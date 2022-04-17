const { database } = require('./index.js');

exports.login = (req, res) => {
    //check if username is valid
    let findUser = 'SELECT * FROM users WHERE Username = \'pbsuarez\'';

    let query = database.query(findUser, (err, result) => {
        if(err) throw err;
        //check if password is valid 
        //TODO: change this later
        if(result[0].Password === 'CMSC128') console.log("Logged In");

        //TODO: create a token for user
        res.send("Found User!");
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

}