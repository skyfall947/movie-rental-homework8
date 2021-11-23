# Restful API for a movie rental store

> Homework of week 8

## Description

This RestAPI is building on
[Nest](https://github.com/nestjs/nest) framework of TypeScript. Using Express plattform.

## Technologies

In order to run this server you must have installed:

- [Node JS](https://nodejs.org/en/): LTS Version 14
- [PostgreSQL](https://www.postgresql.org) 13.4

## Getting started

```bash
git clone https://github.com/skyfall947/movie-rental-homework8.git
cd movie-rental-homework8
npm install
```

## Configure enviroment variables

An example of enviroment variables is on .env.example file

## PostgreSQL

You need to create two databases:

- movies
- movies_test
  And optionally you can import the sql initial data of the directory: /initial-setup

## Postman

You can import the file of the request for postman on the directory: /initial-setup

## Running the app

```bash

# development

$ npm run start


# watch mode

$ npm run start:dev


# unit test

$ npm run test:watch

# integration test

$ npm run test:e2e

```

## License

Copyright (c) 2021 Miguel Atencio Vargas, all rights reserved.
