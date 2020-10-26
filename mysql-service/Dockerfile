## Pull the mysql:5.7 image
FROM mysql:5.7

## The maintainer name and email
LABEL maintainer="John Doe <johnd@gmail.com>"

# when container will be started, we'll have `test` database created with this schema
COPY ./testdump.sql /docker-entrypoint-initdb.d/
