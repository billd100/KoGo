FROM golang:1.15-alpine

RUN mkdir /api

COPY . /api

WORKDIR /api

RUN go build -o main .

CMD [ "/api/main" ]
