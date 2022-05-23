const express = require("express");
const multer = require('multer');
const mysql = require("mysql");
const cors = require('cors');
const cookieParser = require("cookie-parser");

// express will be used for API
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // change user according to what's in your mySQL
    password: 'vinven',    //change password according to what your mySQL root password is
    database: 'project'       //change database name according to what's in your mySQL
});

//Connecting to database
database.connect((err) => {
    if(err){
        console.log(err)
        console.log("Error!");
    }else{
        console.log("Connected!");
    }
})

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./files");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: fileStorageEngine});

exports.database = {database}
exports.singleFile = {upload}

// // allow CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type");
    res.setHeader("Access-Control-Allow-Credentials","true");
    next();
  });

require("./routes")(app);

app.listen(3001, (err) => {
    if(err) { console.log(err);}
    else { console.log("Server listening at port 3001"); }
});