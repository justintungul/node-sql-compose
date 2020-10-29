# MySQL NodeJS Docker Compose

Sample NodeJS application with MySQL interfaced with a TCP server built with docker-compose.

### Ports

- HTTP: 8080
- TCP: 6603
- MySQL: 3306

### Installation

1. git clone repo
2. docker-compose up

### Testing sample endpoints
```
curl -X GET localhost:8080
curl -X POST localhost:8080/get-users
curl --header "Content-Type: application/json" -d '{"firstName": "froe", "lastName": "doe", "email": "froe@email.com"}' -X POST localhost:8080/add-user
```
