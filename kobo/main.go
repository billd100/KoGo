package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net"
	"strings"

	_ "github.com/mattn/go-sqlite3"
	"google.golang.org/grpc"

	pb "github.com/billd100/kogo/protos"
)

var (
	dbPath     = flag.String("db_path", "/Volumes/KOBOeReader/.kobo/KoboReader.sqlite", "Path to host Kobo database")
	serverAddr = flag.String("server_addr", ":10000", "Server address in the format of host:port")
)

var db *sql.DB

type activityServer struct {
	pb.UnimplementedActivityServer
	getBooks []*pb.Book
}

func (s *activityServer) GetBooks(booksRequest *pb.BooksRequest, stream pb.Activity_GetBooksServer) error {

	var queryBuilder strings.Builder
	queryBuilder.WriteString("SELECT Title, TimeSpentReading, Attribution, ___PercentRead FROM content")
	if booksRequest.ShowOnlyRead {
		queryBuilder.WriteString(" WHERE TimeSpentReading > 0")
	}
	queryBuilder.WriteString(";")
	getBooksQuery := queryBuilder.String()

	rows, err := db.Query(getBooksQuery)
	if err != nil {
		log.Printf("Unable to retrieve Activity entries with sql=%s", getBooksQuery)
	}
	defer rows.Close()

	for rows.Next() {
		var title string
		var timeSpentReading int32
		var author string
		var percentRead int32
		err = rows.Scan(&title, &timeSpentReading, &author, &percentRead)
		if err != nil {
			log.Printf("Error scanning row=%v", err)
		}
		book := &pb.Book{
			Title:            title,
			TimeSpentReading: timeSpentReading,
			PercentRead:      percentRead,
			Author:           author,
		}
		if err := stream.Send(book); err != nil {
			return err
		}
	}
	return nil
}

func (s *activityServer) GetBookCount(ctx context.Context, bookCountRequest *pb.BookCountRequest) (*pb.BookCountResponse, error) {

	row, err := db.Query("SELECT COUNT(DISTINCT(BookTitle)) FROM content;")
	if err != nil {
		log.Printf("Error getting book count=%v", err)
	}
	defer row.Close()

	var count int32
	for row.Next() {
		row.Scan(&count)
		break
	}

	return &pb.BookCountResponse{Count: count}, nil
}

func (s *activityServer) BackupDatabase(ctx context.Context, backupDatabaseRequest *pb.BackupDatabaseRequest) (*pb.BackupDatabaseResponse, error) {
	return nil, nil
}

/*
	Kobo E-Readers require registration in order to function. Registration can be mocked by creating a user in the `user` table.
*/
func (s *activityServer) OfflineSetup(ctx context.Context, offlineSetupRequest *pb.OfflineSetupRequest) (*pb.OfflineSetupResponse, error) {

	log.Print("Offline setup...")

	rows, err := db.Query("SELECT UserID FROM user;")
	if err != nil {
		log.Printf("Error querying user=%v", err)
	}
	defer rows.Close()

	var userIds []string
	for rows.Next() {
		var userId string
		rows.Scan(&userId)

		userIds = append(userIds, userId)
	}

	if len(userIds) > 0 && !offlineSetupRequest.OverwriteExistingUser {
		return &pb.OfflineSetupResponse{Success: false, ExistingUserPresent: true}, nil
	}

	addUser, err := db.Prepare("INSERT INTO user(UserID, UserKey) VALUES('1', '')")
	if err != nil {
		log.Printf("Error preparing insert user=%v", err)
	}
	defer addUser.Close()

	_, err = addUser.Exec()
	if err != nil {
		log.Printf("Error executing user insert=%v", err)
	}

	return &pb.OfflineSetupResponse{Success: true}, nil
}

func (s *activityServer) GetUsers(usersRequest *pb.GetUsersRequest, stream pb.Activity_GetUsersServer) error {

	getUsers := fmt.Sprint("SELECT UserID, UserDisplayName, UserEmail, HasMadePurchase, ___DeviceID FROM user;")
	rows, err := db.Query(getUsers)
	if err != nil {
		log.Printf("Unable to retrieve user entries with sql=%s", getUsers)
	}
	defer rows.Close()

	for rows.Next() {
		var id string
		var displayName string
		var email string
		var hasMadePurchase bool
		var deviceId string
		err = rows.Scan(&id, &displayName, &email, &hasMadePurchase, &deviceId)
		if err != nil {
			log.Printf("")
		}
		user := &pb.User{
			Id:              id,
			DisplayName:     displayName,
			Email:           email,
			HasMadePurchase: hasMadePurchase,
			DeviceId:        deviceId,
		}
		if err := stream.Send(user); err != nil {
			return err
		}
	}
	return nil
}

func main() {

	flag.Parse()

	// Open database connection
	log.Println(*dbPath)
	db, _ = sql.Open("sqlite3", *dbPath)
	defer db.Close()

	// Listen for incoming requests
	lis, err := net.Listen("tcp", *serverAddr)
	if err != nil {
		log.Fatal(err)
	}

	grpcServer := grpc.NewServer()
	activityServer := &activityServer{}
	pb.RegisterActivityServer(grpcServer, activityServer)
	grpcServer.Serve(lis)
}
