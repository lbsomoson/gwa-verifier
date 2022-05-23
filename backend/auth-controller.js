const myModule = require('./index');
const {database} = myModule.database;
const jwt = require("jsonwebtoken");
require('dotenv').config({path: __dirname + '/config.env'});

exports.login = (req, res) => {
    //check if username is valid
    let findUser = 'SELECT * FROM users WHERE Username = ? AND Password = ?';
    const username = req.body.username;
    const password = req.body.password;

    let query = database.query(findUser, [username, password] , (err, result) => {
        if(err){
            console.log("login err");
        };

        if(result.length === 0){
            console.log("not logged in. user not found")
        }else{
            console.log(result[0]);
            if(result[0].Password === password) {
                console.log("Logged In");

                const tokenPayload = {
                    username: result[0].Username,
                    type: result[0].Type
                }

                const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: "1d"});

                return res.send({result, token, username})
            }

        }//else

        return res.send({msg: "Not found"})

    })
    
}

exports.signUp = (req, res) => {
    const username = req.body.username;
    const password = req.body.userpassword;
    const type = req.body.usertype;
    let sql = 'INSERT INTO users (Username, Password, Type) VALUES ( ?, ?, ?)';
    
    let query = database.query(sql, [username,password,type], (err, result) => {
        if(err) throw err;
        console.log("No Error");
        console.log(result);
        res.send("Successfully Added user to database!");
    })
}

exports.checkIfLoggedIn = (req, res) => {

    if (!req.cookies || !req.cookies.authToken) {
        return res.send({ isLoggedIn: false });
    }
    
    return jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET,
        (err, tokenPayload) => {
            if (err) {
                return res.send({ isLoggedin: false });
            }

            const user_name = tokenPayload.username;
            const type = tokenPayload.type;

            let findUser2 = 'SELECT * FROM users WHERE Username = ? and Type = ?';

            // check if user exists
            let query = database.query(findUser2, [user_name, type] , (err, result) => {
                if(err) {
                    console.log("err in db")
                    return res.send({ isLoggedin: false});
                }
                console.log("Found user");
            })

            console.log("username: "+user_name)
            return res.send({ isLoggedin: true, username: user_name, type: type });
        });
}
