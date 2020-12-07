# README

## How to run

### set up MongoDB

Start MongoDB service in the default port (27017) by

```shell
mongod --dbpath ~/data/db
```

or

```shell
brew services start mongodb-community
```

in MacOS.

### insert data into database

Use MongoDB command line tools or the shell script we provided:

```shell
./initial.sh
```

### start Node.js application

```
/usr/local/bin/node /usr/local/bin/nodemon
```

### go to webpage localhost:3000
```
http://localhost:3000/

### admin info
```
admin account: admin
admin code: admin

