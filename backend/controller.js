const fs = require('fs');
const { jsPDF } = require("jspdf"); 
const autoTable = require("jspdf-autotable");
const path = require('path');
const myModule = require('./index');
const {database} = myModule.database;
const pdf2excel = require('pdf-to-excel');
const functions = require('./functions');
let XLSX = require("xlsx");


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

    let query = database.query(addActivity, [username, action] ,(err, result) => {
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

        // returns the taken courses of specified student
        console.log(result)
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

    let qualified = 'SELECT * from students';
    
    let query = database.query(qualified, (err, result) =>{
        if (err) throw err;

        let summary = JSON.parse(JSON.stringify(result))
        var doc = new jsPDF();
       
        
        for (i in summary){
            
            let toTable = Object.values(summary[i]);
            doc.autoTable({
                head:[['ID', 'First name', 'Last name', 'Program', 'GWA', 'Notes']],
                body: [toTable]
            })
            doc.save('table.pdf');

    }
})
}


exports.uploadSingle = (req, res) => {
    console.log(req.files);
    let err_msg_arr = [];
    for(let i=0; i<req.files.length; i++){
        let filename = req.files[i].originalname;
        
        if(/.+\.xlsx/.test(filename) || /.+\.csv/.test(filename)){
            let allErrors = {};
            let workbook = XLSX.readFile("files/" + filename);
            let sheet_names = workbook.SheetNames;

            for(let j in sheet_names){
                //transform excel to JSON
                let errors = [];  
                let name, fname, lname, program, studno, gwa, headers;

                name = functions.verifyname(filename, sheet_names[j]);
                studno = functions.verifystudno(filename, sheet_names[j]);
                program = functions.verifycourse(filename, sheet_names[j]);
                headers = functions.verifyHeaders(filename, sheet_names[j]);

                if(name.error){
                    errors.push(name.error)
                }else{
                    fname = name.fname;
                    lname = name.lname;
                }
                
                if(studno.error){
                    errors.push(studno.error)
                }

                if(program.error){
                    errors.push(program.error)
                }

                if(!headers.success){
                    errors.push(headers.error)
                }

                //check if the three basic necessary information is found
                //the student number is the identifier 
                if(errors.length){
                    allErrors[sheet_names[j]] = errors
                    continue
                }

                let data = functions.readData(filename, sheet_names[j]);
                if(data.error){
                    errors.push(data.error)
                }

                var checkFormat = functions.processExcel(filename, program, data);
                
                if(!checkFormat.success){
                    checkFormat.notes.forEach((note) => {
                        errors.push(note)
                    })
                }

                let notes_msg = 'Notes: '
                if(errors.length){
                    allErrors[sheet_names[j]] = errors
                    for(let count=0; count<errors.length; count++){
                        if(count === (errors.length)-1){
                            notes_msg += errors[count]
                        }else{
                            notes_msg += errors[count] + ", "
                        }

                    }
                }

                let checkCalc = functions.weightIsValid(data,false)

                if(checkCalc.success){
                    functions.addTakenCourses(data, studno);
                    if(checkCalc.qualified){
                        console.log("Student is qualified");
                        functions.addStudent(studno, fname, lname, program, checkCalc.gwa, 1, notes_msg);
                    }else{
                        console.log("Student is not qualified");
                        functions.addStudent(studno, fname, lname, program, checkCalc.gwa, 0, notes_msg);
                    }   
                }

                

            }

            let filename_err_msg = []
            let all_err_msg = [];
            filename_err_msg.push(filename);
            if(Object.keys(allErrors).length){
                console.log("Errors on the following files:")
                Object.keys(allErrors).forEach((key) => {
                    let err_msg = key + ": ";
                    for(let count=0; count<allErrors[key].length; count++){
                        if(count === (allErrors[key].length)-1){
                            err_msg += allErrors[key][count]
                        }else{
                            err_msg += allErrors[key][count] + ", "
                        }

                    }
                    console.log(err_msg);
                    all_err_msg.push(err_msg);
                })
            }else{
                let err_msg = "No warnings";
                all_err_msg.push(err_msg);
            }
            filename_err_msg.push(all_err_msg);
            err_msg_arr.push(filename_err_msg);

        }else if(/.+\.pdf/.test(filename)){
            //transform pdf to JSON
            newfilename = filename.substring(0, filename.lastIndexOf('.')) + '.xlsx';
            async function convertpdf(){
                let convertPromise = new Promise(function(resolve){
                    
                    resolve(pdf2excel.genXlsx('files/'+ filename,'./files/' + newfilename));
                })
                await convertPromise;
            }
            convertpdf().then(() => {
                let allErrors = {};
                let workbook = XLSX.readFile("files/" + newfilename);
                let sheet_names = workbook.SheetNames;

                for(let j in sheet_names){
                    //transform excel to JSON
                    let errors = [];  
                    let name, fname, lname, program, studno, gwa;

                    name = functions.verifyname(newfilename, sheet_names[j]);
                    studno = functions.verifystudno(newfilename, sheet_names[j]);
                    program = functions.verifycourse(newfilename, sheet_names[j]);

                    if(name.error){
                        errors.push(name.error)
                    }else{
                        fname = name.fname;
                        lname = name.lname;
                    }
                    
                    if(studno.error){
                        errors.push(studno.error)
                    }

                    if(program.error){
                        errors.push(program.error)
                    }

                    //check if the three basic necessary information is found
                    //the student number is the identifier 
                    if(errors.length){
                        allErrors[sheet_names[j]] = errors
                        continue
                    }

                    let data = functions.readData(newfilename, sheet_names[j]);
                    if(data.error){
                        errors.push(data.error)
                    }

                    var checkFormat = functions.processExcel(newfilename, program, data);
                    
                    // TODO: add students into database despite having "warnings"
                    if(!checkFormat.success){
                        checkFormat.notes.forEach((note) => {
                            errors.push(note)
                        })
                    }

                    let notes_msg = 'Notes: '
                    if(errors.length){
                        allErrors[sheet_names[j]] = errors
                        for(let count=0; count<errors.length; count++){
                            if(count === (errors.length)-1){
                                notes_msg += errors[count]
                            }else{
                                notes_msg += errors[count] + ", "
                            }

                        }
                    }

                    let checkCalc = functions.weightIsValid(data,true)

                    if(checkCalc.success){
                        functions.addTakenCourses(data, studno);
                        if(checkCalc.qualified){
                            console.log("Student is qualified");
                            functions.addStudent(studno, fname, lname, program, checkCalc.gwa, 1, notes_msg);
                        }else{
                            console.log("Student is not qualified");
                            functions.addStudent(studno, fname, lname, program, checkCalc.gwa, 0, notes_msg);
                        }   
                    }

                }
                let filename_err_msg = []
                let all_err_msg = [];
                if(Object.keys(allErrors).length){
                    console.log("Errors on the following files:")
                    Object.keys(allErrors).forEach((key) => {
                        let err_msg = key + ": ";
                        for(let count=0; count<allErrors[key].length; count++){
                            if(count === (allErrors[key].length)-1){
                                err_msg += allErrors[key][count]
                            }else{
                                err_msg += allErrors[key][count] + ", "
                            }

                        }
                        console.log(err_msg);
                        all_err_msg.push(err_msg);
                    })
                }else{
                    let err_msg = "No warnings";
                    all_err_msg.push(err_msg);
                }
                filename_err_msg.push(all_err_msg)
                err_msg_arr.push(filename_err_msg);
            });
            convertPromise.catch((error) =>{
                throw error;
            })

        }

    }

    //Delete uploaded files
    fs.readdir('files', (err, files) => {
        if (err) console.log(err);
      
        for (const file of files) {
          fs.unlink(path.join('files', file), err => {
            if (err) console.log(err)
          });
        }
      });

    res.send({msg:err_msg_arr});
} 

