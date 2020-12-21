FROM golang:1.15-alpine

RUN apk add build-base
RUN mkdir /kobo

COPY . /kobo

WORKDIR /kobo

RUN go build -o main .

CMD [ "/kobo/main", "-db_path=/mnt/KoboReader.sqlite"]
