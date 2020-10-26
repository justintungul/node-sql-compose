# MySQL NodeJS Docker Compose

Sample NodeJS application with MySQL database built with docker-compose.

### Ports

- NodeJs: 666
- MySQL: 3306

### Installation

1. git clone repo
2. docker-compose up

### Testing sample endpoints
```
curl -X GET localhost:666
curl -X POST localhost:666/get-users
curl --header "Content-Type: application/json" -d '{"first_name": "froe", "last_name": "doe", "email": "froe@email.com"}' -X POST localhost:666/add-user
```
