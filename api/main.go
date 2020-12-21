package main

import (
	"context"
	"encoding/json"
	"flag"
	"io"
	"log"
	"net/http"
	"time"

	pb "github.com/billd100/kogo/protos"
	"google.golang.org/grpc"
)

var (
	serverAddr = flag.String("server_addr", "kobo:10000", "Server address in the format of host:port")
)

var client pb.ActivityClient

type book struct {
	Title            string
	TimeSpentReading int32
	Author           string
	PercentRead      int32
}

type user struct {
	Id              string
	DisplayName     string
	Email           string
	HasMadePurchase bool
	DeviceId        string
}

func getBooks(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	stream, err := client.GetBooks(ctx, &pb.BooksRequest{ShowOnlyRead: true})
	if err != nil {
		log.Printf("Error getting books=%v", err)
	}

	books := []book{}
	for {
		b, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("Error getting book from stream=%v", err)
		}

		books = append(books, book{
			Title:            b.Title,
			TimeSpentReading: b.TimeSpentReading,
			PercentRead:      b.PercentRead,
			Author:           b.Author,
		})
	}
	json.NewEncoder(w).Encode(books)
}

func getBookCount(w http.ResponseWriter, r *http.Request) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	response, err := client.GetBookCount(ctx, &pb.BookCountRequest{})
	if err != nil {
		log.Printf("Error calling GetBookCount=%v", err)
	}
	json.NewEncoder(w).Encode(response)
}

func offlineSetup(w http.ResponseWriter, r *http.Request) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	request := &pb.OfflineSetupRequest{OverwriteExistingUser: false}
	query := r.URL.Query()
	overwriteExistingUser, present := query["overwriteExistingUser"]
	if present && overwriteExistingUser[0] == "true" {
		request.OverwriteExistingUser = true
	}

	response, err := client.OfflineSetup(ctx, request)
	if err != nil {
		log.Printf("Error calling OfflineSetup=%v", err)
	}
	json.NewEncoder(w).Encode(response)
}

func getUsers(w http.ResponseWriter, r *http.Request) {

	log.Print("Getting users...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	stream, err := client.GetUsers(ctx, &pb.GetUsersRequest{})
	if err != nil {
		log.Printf("Error getting users=%v", err)
	}

	users := []user{}
	for {
		u, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("Error getting book from stream=%v", err)
		}

		users = append(users, user{
			Id:              u.Id,
			DisplayName:     u.DisplayName,
			Email:           u.Email,
			HasMadePurchase: u.HasMadePurchase,
			DeviceId:        u.DeviceId,
		})
	}
	json.NewEncoder(w).Encode(users)
}

func main() {

	flag.Parse()

	conn, err := grpc.Dial(*serverAddr, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to dial err=%v", err)
	}
	defer conn.Close()
	client = pb.NewActivityClient(conn)

	http.HandleFunc("/get-books", getBooks)
	http.HandleFunc("/get-book-count", getBookCount)
	http.HandleFunc("/offline-setup", offlineSetup)
	http.HandleFunc("/get-users", getUsers)
	log.Fatal(http.ListenAndServe(":8000", nil))
}
