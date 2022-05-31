# Backend

## Core Contributors
* Paolo Suarez[@pbsuarez](https://github.com/pbsuarez/)
* Andrei Enrique[@auenrique](https://github.com/auenrique)
* EJ Oña[@EJ0723](https://github.com/EJ0723)
* Vincent Villar[@vbvillar](https://github.com/vbvillar)

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

### Accessing the database
To access the database, go to the `index.js` file and change the fields for the database constant.

``` // index.js
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // change user according to what's in your mySQL
    password: 'CMSC128',    //change password according to what your mySQL root password is
    database: 'project'       //change database name according to what's in your mySQL
});
```

### Limitations
There are certain limitations when uploading a file. For .csv files, the second part of the student number cannot be any number from the range of 00001 to 00012. This is because the .csv file is being read as an .xlsx which causes some problems in the conversion of certain numbers. For PDF files, cells cannot be centered and merged. Empty cells are also filled in by other cells that are on the same row. Due to these circumstances, processing PDFs are not as functional as .xlsx or .csv files. These problems are also brought by the conversion of PDF to Excel. 