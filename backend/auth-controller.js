const { database } = require('./index.js');
const jwt = require("jsonwebtoken");
require('dotenv').config({path: __dirname + '/config.env'});

exports.login = (req, res) => {
    //check if username is valid
    let findUser = 'SELECT * FROM users WHERE Username = ?';
    const username = req.body.username;
    const password = req.body.password;

    let query = database.query(findUser, [username, password] , (err, result) => {
        if(err){
            console.log("login err");
        };

        if(result[0].Password === password) {
            console.log("Logged In");

            const tokenPayload = {
                username: result[0].Username,
                type: result[0].Type
            }
    
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: "300s"});
    
            return res.send({result, token, username})
        }
        
        return res.send({msg: "Not found"})
        
    })
    

}

//Sample sign up while waiting for frontend post request
//TODO: change the sql query according to the post request
exports.signUp = (req, res) => {
    let sql = 'INSERT INTO users (Username, Password, Type) VALUES (\'pbsuarez\', \'CMSC128\', \'admin\')';
    
    let query = database.query(sql, (err, result) => {
        if(err) throw err;
        console.log("No Error");
        console.log(result);
        res.send("Successfully Added user to database!");
    })

    //Replace SQL query above with this when frontend is connected
    // let sql = 'INSERT INTO users (Username, Password, Type) VALUES (?, ?, ?)';
    // let username = req.body.username, password = req.body.password, type = req.body.type;
    // let query = database.query(sql2, [username, password, type], (err, result) => {
    //     if(err) throw err;
    //     console.log("No Error");
    //     console.log(result);
    //     res.send("Successfully Added user to database!");
    // })
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
            return res.send({ isLoggedIn: false });
            }

            const user_name = tokenPayload.Username;
            const type = tokenPayload.Type;
            let findUser2 = 'SELECT * FROM users WHERE Username = ? and Type = ?';

            // check if user exists
            let query = database.query(findUser2, [user_name, type] , (err, result) => {
                if(err) {
                    return res.send({ isLoggedIn: false});
                }
            })

            console.log("user is currently logged in");
            return res.send({ isLoggedIn: true });
            });
}
