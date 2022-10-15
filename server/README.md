# Modern Meeting WebApp api

Hey! everyone. We did it 😎😎. Our api is up and running On 👇
[api](http://65.2.186.36:3000/api/) .
<br>It is hosted on amazon ec2 instance.

## Setting up project

- Clone the repo and change directory into server.
- make sure you have node js --lts version installed.
- do `npm i` to install all dependencies.

## Setting up database

- We are using mongo db in our application.
- Create a cluster in mongodb atlas.
- Create username and password for the database.
- Get url of the database to connect to the application.

## Setting up .env file

- Set dot env file for environment varibles and put every important credentials into it.
- Also gitignore the .env file so that your credentials don't get public to anyone.

```
PORT = PORT_NUMBER
MONGO_URL = YOUR_MONGODB_DATABASE_URL
```

## Different api endpoints and their use

### users

- It has post method
- used for registering users with name, email and password.

### auth

- It has get method
- used to take x-auth-token = jwt_token as header and authenticate the user.

### meeting

- It keeps track of data of each and every meeting.
- Keeps Usersdata id present as ref and store it in section of Users as array.

### userdata

- It has information of user like user email, interaction count, stress count
- also it has ref of each meeting that is part of particular meeting room.
