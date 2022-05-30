const myModule = require('./index');
const {database} = myModule.database;
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const salt = 'worcestershire';
const pepper = 'A';
require('dotenv').config({path: __dirname + '/config.env'});

exports.login = (req, res) => {
    //check if username is valid
    let findUser = 'SELECT * FROM users WHERE Username = ? AND Password = ?';
    const username = req.body.username;
    const password = req.body.password;
    const seasoned = password.concat(salt, pepper);
    const hash = crypto.createHash('md5').update(seasoned).digest('hex');

    let query = database.query(findUser, [username, hash] , (err, result) => {
        if(err){
            console.log("login err");
        };

        if(result.length === 0){
            console.log("not logged in. user not found")
        }else{
            console.log(result[0]);
            if(result[0].Password === hash) {
                console.log("Logged In");

                const tokenPayload = {
                    username: result[0].Username,
                    type: result[0].Type
                }
                
                const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: "5s"});
                const refreshToken = jwt.sign(tokenPayload, process.env.JWT_SECRET2, {expiresIn: "1d"});

                return res.send({result, token, refreshToken, username})
            }

        }

        return res.send({msg: "Not found"})

    })
    
}

exports.signUp = (req, res) => {
    const username = req.body.username;
    const password = req.body.userpassword;
    const type = req.body.usertype;
    const seasoned = password.concat(salt, pepper);
    const hash = crypto.createHash('md5').update(seasoned).digest('hex');
    let sql = 'INSERT INTO users (Username, Password, Type) VALUES ( ?, ?, ?)';
    
    let query = database.query(sql, [username,hash,type], (err, result) => {
        if(err) throw err;
        console.log("No Error");
        console.log(result);
        res.send("Successfully Added user to database!");
    })
}

exports.checkIfLoggedIn = (req, res) => {

    if (!req.cookies || !req.cookies.authToken) {
        console.log("No cookies");
        return res.send({ isLoggedIn: false });
    }
    
    return jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET,
        (err, tokenPayload) => {
            if (err) {
                console.log('Token is expired');
                // since token is expired, check for refresh token
                if(req.cookies.refreshToken) { // token exist
                    // verify token
                    jwt.verify(req.cookies.refreshToken, process.env.JWT_SECRET2, (err, refreshPayload) => {
                        if(err) {
                            console.log("Refresh Token not Valid")
                            return res.send({ isLoggedin: false});
                        }

                        const tokenPayload = {
                            username: refreshPayload.username,
                            type: refreshPayload.type
                        }

                        // sign new access token
                        const newAccessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: "5s"});

                        //send cookie of new access token
                        res.cookie("authToken", newAccessToken, 
                            {
                                path: "localhost:3001/",
                                age: 86400,
                                sameSite: "lax"
                            }
                        );

                        return res.send({ isLoggedin: true, username: tokenPayload.username, type: tokenPayload.type }); 
                    })
                }
                
                return res.send({ isLoggedin: false});
                
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

            })
            
            console.log("Logged in")
            return res.send({ isLoggedin: true, username: user_name, type: type });
        });
    
}

