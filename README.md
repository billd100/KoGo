# KoGo

The purpose of this app is to enable initial device setup and viewing of Kobo E-Reader statistics independent of Rakuten.

## Getting Started

To start each service and the UI, run `docker-compose up`.

## Architecture

There are two Go services and a React UI. The first Go service is a REST service for the UI. Currently, it acts as an intermediary between the UI and the second Go service.

The second Go service is a gRPC server that handles all database interactions.