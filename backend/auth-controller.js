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

exports.findAllStudents = (req, res) => {
    let findAllStudents = 'SELECT * FROM students';

    let query = database.query(findAllStudents, (err, result) => {
        if (err) throw err;

        // returns all existing students in the database table
        res.send(result);
    });
}

exports.sortBy = (req, res) => {
    // assuming req.sort is the basis, and req.order is either ASC or DESC
    // basis could be First_Name, Last_Name, Course, GWA(?)
    let sortStudents = 'SELECT * FROM students ORDER BY ${req.sort} ${req.order}'

    let query = database.query(findStudents, (err, result) => {
        if (err) throw err;

        res.send(result);
    });
}

exports.searchStudents = (req, res) => {

    // assuming req.search is the text inside the search bar for the 
    let search = 'SELECT * FROM students WHERE First_Name LIKE ${req.search}';

    let query = database.query(search, (err, result) => {
        if (err) throw err;

        // returns in the database table
        res.send(result);
    });
}

exports.deleteStudent = (req, res) => {

    let removeStudent = 'DELETE FROM students WHERE ID = ${req.student_id}';
    let removeRecord = 'DELETE FROM taken_courses WHERE ID = ${req.student_id}';

    let query = database.query(removeStudent, (err, result) => {
        if (err) throw err;

        let query2 = database.query(removeRecord, (err, result) => {
            if (err) throw err;

            res.send('Successfully deleted student from database!');
        });
    });
}