# KoGo - A Kobo E-Reader Companion

The purpose of this app is to enable initial device setup and viewing of Kobo reading statistics independent of Rakuten.

## Getting Started

To start each service and the UI, run `docker-compose up`.

## Architecture

There are two Go services and a UI built with React. One Go service is a REST service for the UI. Currently it acts as an intermediary between the UI and the second Go service.

The second Go service is a gRPC server that handles all database interactions. The pattern used here (ui - REST - api - gRPC - db), as opposed to gRPC from front to back, is due to limitations of [gRPC-web](https://github.com/grpc/grpc-web) which requires a proxy (simple but adds some infra complexity), lacks support for bidi streaming, and JSON keeps things simple on the front-end.