# Backend

## Core Contributors
* Paolo Suarez
* Andrei Enrique
* EJ Oña
* Vincent Villar

## Guidelines
### Running the Application
For first time run, use the command `npm install` then `node index.js`. Otherwise, just use `node index.js`.

### Adding First User
If the database is empty, adding a user will be nearly impossible since passwords are hashed. To add a user, refer to the `rest.http` file. This file can be used in Visual Studio Code with the `REST Client` extension. Comment out other requests except the one under Register admin user and press Send Request.

```// rest.http
## Register admin user
POST http://localhost:3001/signup
Content-Type: application/json

{
    "username": "admin",
    "userpassword": "admin",
    "usertype": "admin"
}
```