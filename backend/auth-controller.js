const { database } = require('./index.js');

exports.login = (req, res) => {
    let sql = `SELECT * from user`;
    let query = database.query(sql, (err, result) => {
        if(err) throw err;
        console.log("No Error");
        console.log(result);
        res.send("Found User!");
    })


}

exports.checkIfLoggedIn = (req, res) => {

}