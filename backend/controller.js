let XLSX = require("xlsx");
const fs = require('fs');
const autoTable = require("jspdf-autotable");
const path = require('path');
const myModule = require('./index');
const pdf2excel = require('pdf-to-excel');
const functions = require('./functions');
const verify_functions = require('./verify_functions');
const misc_functions = require('./misc_functions');
const {database} = myModule.database;
const { jsPDF } = require("jspdf"); 
const { callbackify } = require('util');


exports.findUser = (req, res) => {
    
    const username = req.query.username;
    console.log(username);
    let findUser = 'SELECT * FROM users WHERE Username= ?';
  

    let query = database.query(findUser , [username], (err, result) => {
        if (err) throw err;
        console.log(result);
    
        const rows = Object.values(JSON.parse(JSON.stringify(result)));
        if(rows.length > 0){
            
            res.send(result);
        }else{
            res.send({msg: "Not found"});
        }

    });
}

exports.updateUser = (req, res) => {
    
    const username = req.body.username;
    const type = req.body.type;
    let updateUser = 'UPDATE users SET Type = ? WHERE Username = ?';

    let query = database.query(updateUser , [type, username], (err, result) => {
        if (err) throw err;
    });
}

exports.findAllUsers = (req, res) => {
    let findAllUsers = 'SELECT * FROM users';

    let query = database.query(findAllUsers, (err, result) => {
        if (err) throw err;

        // returns all existing users in the database table
        res.send(result);
    });
}

exports.deleteUser = (req, res) => {
    
    const username = req.body.username;
    let removeUser = 'DELETE FROM users WHERE Username= ?';
    let removeUserActivities = 'DELETE FROM activities WHERE Username = ?';    

    let query = database.query(removeUser , [username], (err, result) => {
        if (err) throw err;

        let query2 = database.query(removeUserActivities, [username], (err, result) => {
            if (err) throw err;

            res.send('Successfully deleted user from database!');
        });
    });
}

exports.addActivity= (req, res) => {
    
    const username = req.body.username;
    const action = req.body.action;
   
    let addActivity = 'INSERT INTO activities(Username, Action, Date) values (?, ?, now())';
    let countActivity = 'SELECT COUNT(*) AS rowcount FROM activities';
    let deleteActivity = 'DELETE FROM activities LIMIT 500';
    
    let query1 = database.query(countActivity, (err, result) => {
        if (err) throw err;

        const nrows = Object.values(JSON.parse(JSON.stringify(result)));
  
        console.log(nrows[0].rowcount);
        if (nrows[0].rowcount == 1000){
            let query2 = database.query(deleteActivity, (err, result) => {
                if (err) throw err;
        
                console.log("Successfully deleted oldest 500 activities");
                //res.send(result);
            });
        }  
       
    });

    let query3 = database.query(addActivity, [username, action] ,(err, result) => {
        if (err) throw err;

        console.log("Successfully added activity");
        //res.send(result);
    });
}

exports.findUserActivities = (req, res) => {
    const username = req.query.username;
    let findActivities = 'SELECT * FROM activities where Username=?';
    //console.log(username);

    let query = database.query(findActivities, [username],(err, result) => {
        if (err) throw err;

        // returns the activities of a user
        //console.log(result);
        res.send(result);
    });
}

exports.findAllActivities = (req, res) => {
    let findAllActivities = 'SELECT * FROM activities';

    let query = database.query(findAllActivities, (err, result) => {
        if (err) throw err;

        // returns all existing users in the database table
        console.log(result);
        res.send(result);
    });
}


exports.findAllStudents = (req, res) => {

    let findAllStudents = 'SELECT * FROM students';

    let query = database.query(findAllStudents, (err, result) => {
        if (err) throw err;

        // returns all existing students in the database table
        res.send(result);
    });
}

exports.findQualifiedStudents = (req, res) => {
    let findQualifiedStudents = 'SELECT * FROM students WHERE Qualified = 1';

    let query = database.query(findQualifiedStudents, (err, result) => {
        if (err) throw err;

        // returns all existing students in the database table
        res.send(result);
    });
}

exports.findStudentRecord = (req, res) => {
    let findStudentRecord = `SELECT * FROM taken_courses where Student_ID=?`;

    let query = database.query(findStudentRecord, [req.body.id],(err, result) => {
        if (err) throw err;
        res.send(result);
    });
}

exports.editStudentRecord = (req, res) => {

    obj = functions.processEdit(req.body.data);
    res.send(obj);

}

exports.addEditHistory = (req, res) => {
    let getCount = '(SELECT COUNT(*)+1 FROM edit_history)';
    let addHistory = 'INSERT INTO edit_history (ID, Username, Student_ID, Datetime_of_edit, Edit_notes) VALUES (?, ?, ?, NOW(), ?)';
    database.query(getCount, function(err, result, fields) {
        if (err) throw err;

        count = Object.values(result[0])[0];
        database.query(addHistory, [count, req.body.Username, req.body.ID, req.body.notes], (err, result) => {
            if (err) throw err;
    
            res.send('Updated edit history');
        });
    });

    
}

exports.findAllEdits = (req, res) => {
    let findAllEdits = 'SELECT * FROM edit_history';

    let query = database.query(findAllEdits, (err, result) => {
        if (err) throw err;

        res.send(result);
    });
}

//might remove sort since this will be frontend's work
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
    //let search = 'SELECT * FROM students WHERE (SELECT CONCAT(First_Name, " ", Last_Name) AS Full_Name) LIKE \"%${req.search}%\"';
    let search = 'SELECT * FROM students WHERE First_Name = ? AND Last_Name = ?';
    let query = database.query(search, [req.body.fn,req.body.ln], (err, result) => {
        if (err) throw err;

        // returns in the database table
        res.send(result);
    });
}

exports.searchStudentsByGwa = (req, res) => {

    let search = 'SELECT * FROM students WHERE GWA = ?';
    let query = database.query(search,[req.body.gwa], (err, result) => {
        if (err) throw err;

        // returns in the database table
        res.send(result);
    });
}

exports.searchStudentsByID = (req, res) => {

    let search = 'SELECT * FROM students WHERE ID = ?';
    let query = database.query(search,[req.body.id], (err, result) => {
        if (err) throw err;

        // returns in the database table
        res.send(result);
    });
}

exports.deleteStudent = (req, res) => {
    
    const student_id = req.body.student_id;
    let removeStudent = 'DELETE FROM students WHERE ID = ?';
    let removeRecord = 'DELETE FROM taken_courses WHERE Student_ID = ?';
    

    let query = database.query(removeStudent , [student_id], (err, result) => {
        if (err) throw err;

        let query2 = database.query(removeRecord, [student_id], (err, result) => {
            if (err) throw err;

            res.send('Successfully deleted student from database!');
        });
    });
}

exports.deleteAllStudents = (req, res) => {

    let removeAllStudents = 'DELETE FROM students';
    let removeAllRecords = 'DELETE FROM taken_courses';

    let query = database.query(removeAllStudents, (err, result) => {
        if (err) throw err;

        let query2 = database.query(removeAllRecords, (err, result) => {
            if (err) throw err;

            res.send('Successfully deleted all students from database!');
        });
    });
}

exports.downloadSummary = (req, res) =>{
    let qualified = "SELECT ID, First_Name, Last_Name, Program, GWA, Warnings from students WHERE Qualified = '1' ";
    //grabs all qualified students in the students table
    
    let query = database.query(qualified, (err, result) =>{
        if (err) throw err;

        let summary = JSON.parse(JSON.stringify(result))
        console.log(summary)
        var doc = new jsPDF();
       
        let toTable = summary.map(Object.values); //maps values into an array of arrays
        for (i in toTable){
            toTable[i] = Object.values(toTable[i])
        }  
        doc.autoTable({
            head:[['ID', 'First name', 'Last name', 'Program', 'GWA', 'Notes']],    //creates a table with the following headers
            body: toTable
        })
        doc.save('../frontend/public/table.pdf');  //saves the table into a pdf file

    
})
}

exports.findUserEdits = (req, res) => {
    const username = req.query.username;
    let findUserEdits = 'SELECT * FROM edit_history WHERE Username= ?';

    let query = database.query(findUserEdits, [username],(err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
}

async function convertpdf(filename){
    return new Promise(function(resolve){
        let newfilename = filename.substring(0, filename.lastIndexOf('.')) + '.xlsx';
        resolve(pdf2excel.genXlsx('files/'+ filename,'./files/' + newfilename));
    })
}


exports.uploadSingle = (req, res) => {
    let err_msg_arr = [];
    let promise_list = [];
    for(let i=0; i<req.files.length; i++){
        let filename = req.files[i].originalname;
        
        //check if file is .xlsx or .csv
        if(/.+\.xlsx/.test(filename) || /.+\.csv/.test(filename)){
            console.log(`File ${filename} is Excel/CSV`)
            let allErrors = {};
            let workbook = XLSX.readFile("files/" + filename);
            
            let sheet_names = workbook.SheetNames;

            for(let j in sheet_names){
                //transform excel to JSON
                let errors = [];  
                let GWA_requirement_check = true;
                let name, fname, lname, program, studno, gwa, headers;

                name = verify_functions.verifyname(filename, sheet_names[j]);
                studno = verify_functions.verifystudno(filename, sheet_names[j]);
                program = verify_functions.verifycourse(filename, sheet_names[j]);
                headers = verify_functions.verifyHeaders(filename, sheet_names[j]);

                // Verify if file has the necessary information
                let verifyFile = verify_functions.verifyErrors(name, studno, program, headers, errors);
                if(verifyFile.success){
                    //uniform formatting for name
                    fname = verifyFile.firstName.toUpperCase();
                    lname = verifyFile.lastName.toUpperCase();
                }else{
                    allErrors[sheet_names[j]] = errors
                    continue
                }

                // Get the data 
                let readData = functions.readData(filename, sheet_names[j], false);
                //push any obtained errors to array
                if(readData.error){
                    errors.push(readData.error)
                    allErrors[sheet_names[j]] = errors
                    continue
                }

                if(readData.notes.length){
                    readData.notes.forEach((note) => {
                        errors.push(note)
                    })
                }

                data = readData.data;
                GWA_requirement_check = readData.req_GWA;
                
                //perform file processing
                let processFile = functions.processFile(program, data, false, GWA_requirement_check)

                //push any obtained errors to array
                if(processFile.notes){
                    processFile.notes.forEach((note) => {
                        errors.push(note)
                    })
                }
    
                let notes_msg = misc_functions.createNotes(errors, allErrors, sheet_names, j);
                let qualified = 0;
                if(processFile.success){
                    try{
                        //attempt to add taken courses to db
                        functions.addTakenCourses(data, studno);
                        if(processFile.qualified){
                            qualified = 1
                        }
                        try {
                            //attempt to add student to db
                            functions.addStudent(studno, fname, lname, program, processFile.gwa, qualified, notes_msg);
                        }catch(e){
                            deleteStudent(studno)
                        }
                        
                    }catch(e){
                        deleteStudent(studno)
                    }
                    
                }

            }

            let filename_err_msg = []
            let all_err_msg = [];
            filename_err_msg.push(filename);

            //list file errors
            misc_functions.listFileErrors(allErrors, all_err_msg, filename_err_msg, err_msg_arr);

            // Delete uploaded file
            fs.unlink(path.join('files', filename), err => {
                if (err) console.log(`Error in deleting file in if statement`)
                console.log(`Deleting file in excel if statement`)
            });

            
        //check if file is .pdf
        }else if(/.+\.pdf/.test(filename)){
            //transform pdf to .xlsx
            
            //Push promise into list of promises
            promise_list.push(convertpdf(filename).catch((err) => {
                console.log(err)
            }));
                
        }

    }
 
    // Checks if there are promises to be resolved
    // If none, then send all of the errors found to frontend
    if(!promise_list.length){
        res.send({msg:err_msg_arr});
    
    }else{
        // Waits for all the promises to resolve 
        Promise.all(promise_list).then(()=>{
            fs.readdir('files', (err, files) => {
                if(err){
                    console.log(err);
                }
        
                files.forEach((file) => {
                    if(/.+\.pdf/.test(file)){
                        console.log(`Unlinking file ${file}`)
                        fs.unlink(path.join('files', file), err => {
                            if (err) console.log(err)
                        })
                    }else{
                        let allErrors = {};
                        let workbook = XLSX.readFile("files/" + file);
                        let sheet_names = workbook.SheetNames;
    
                        for(let j in sheet_names){
                            //transform excel to JSON
                            let errors = [];  
                            let name, fname, lname, program, studno, gwa, headers;
    
                            name = verify_functions.verifyname(file, sheet_names[j]);
                            studno = verify_functions.verifystudno(file, sheet_names[j]);
                            program = verify_functions.verifycourse(file, sheet_names[j]);
                            headers = verify_functions.verifyHeaders(file, sheet_names[j]);
                            
                            // Verify if file has the necessary information
                            let verifyFile = verify_functions.verifyErrors(name, studno, program, headers, errors);
                            if(verifyFile.success){
                                //uniform formatting for name
                                fname = verifyFile.firstName.toUpperCase();
                                lname = verifyFile.lastName.toUpperCase();
                            }else{
    
                                allErrors[sheet_names[j]] = errors
                                continue
                            }
    
    
                            // Get the data 
                            let readData = functions.readData(file, sheet_names[j], true);
                            //push any obtained errors to array
                            if(readData.error){
                                errors.push(readData.error)
                                allErrors[sheet_names[j]] = errors
                                continue
                            }
    
    
                            if(readData.notes.length){
                                readData.notes.forEach((note) => {
                                    errors.push(note)
                                })
                            }
    
                            data = readData.data;
                            GWA_requirement_check = readData.req_GWA;
    
                            //perform file processing
                            let processFile = functions.processFile(program, data, true, GWA_requirement_check)
    
                            //push any obtained errors to array
                            if(processFile.notes){
                                processFile.notes.forEach((note) => {
                                    errors.push(note)
                                })
                            }
            
                            let notes_msg = misc_functions.createNotes(errors, allErrors, sheet_names, j);
    
                            let qualified = 0;
                            if(processFile.success){
                                try{
                                    //attempt to add taken courses to db
                                    functions.addTakenCourses(data, studno);
                                    if(processFile.qualified){
                                        qualified = 1
                                    }
                                    try {
                                        //attempt to add student to db
                                        functions.addStudent(studno, fname, lname, program, processFile.gwa, qualified, notes_msg);
                                    }catch(e){
                                        deleteStudent(studno)
                                    }
                                    
                                }catch(e){
                                    deleteStudent(studno)
                                }
                                
                            }     
    
                        }
                        let filename_err_msg = []
                        let all_err_msg = [];

                        let original_filename = file.substring(0, file.lastIndexOf('.')) + '.pdf';
                        filename_err_msg.push(original_filename);
    
                        //list file errors
                        misc_functions.listFileErrors(allErrors, all_err_msg, filename_err_msg, err_msg_arr);
    
                        fs.unlink(path.join('files', file), err => {
                            if (err) console.log(err)
    
                            console.log(`Unlinking ${file}`)
                        });
                    }
                })
                res.send({msg:err_msg_arr});
            })
        }).catch((err) => {
            console.log(err)
        });
        console.log('Promises resolved');

    }

} 

function deleteStudent(studno) {

    let removeStudent = 'DELETE FROM students WHERE ID = ?';
    let removeRecord = 'DELETE FROM taken_courses WHERE Student_ID = ?';
    
    let query = database.query(removeStudent , [studno], (err, result) => {
        if (err) throw err;

        let query2 = database.query(removeRecord, [studno], (err, result) => {
            if (err) throw err;

            res.send('Successfully deleted student from database!');
        });
    });
}

