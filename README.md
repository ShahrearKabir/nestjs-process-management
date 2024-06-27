
# Assignment

A brief description of what this project does and who it's for


## Requirements
* node <= 20.3.0
* mongodb 4.4 or higher


## Features
* **Process Management**
* **Schedule Management**

## Technologies Used
* **Backend**: [Nestjs]()
* **Database**: [MongoDB]()

## Installation

Clone repository
```bash
https://github.com/ShahrearKabir/nestjs-process-management.git
```
Install with npm

```bash
# go to project dir

$ cp .env.example .env
$ npm ci

# set all .env variables
```
Setup application .env file
```bash
VERSION=1.0.0
NAME=process-management
RUN_TIME=local
PORT=4300

MONGO_DB_URL=mongodb://localhost:27017/process_management

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debugger mode
$ npm run start:debug

# production mode
$ npm run start:prod
```
    
#### Swagger API documentation url

```http
  http://localhost:4300/api
```



## API end-point

```
  # Create Process
  POST: http://192.168.0.109:4300/api/v1/processes/create-process
```

```
  # Get all Process
  GET: http://192.168.0.109:4300/api/v1/processes/get-all
```

```
  # Get single process with logs
  GET: http://192.168.0.109:4300/api/v1/processes/get-single/1
```

```
  # Delete Process
  DELETE: http://192.168.0.109:4300/api/v1/processes/delete-process/:pid
```
