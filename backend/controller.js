const fs = require('fs');
const path = require('path');
const myModule = require('./index');
const {database} = myModule.database;
const pdf2excel = require('pdf-to-excel');
const functions = require('./functions');
let XLSX = require("xlsx");


exports.findAllStudents = (req, res) => {
    let findAllStudents = 'SELECT * FROM students';

    let query = database.query(findAllStudents, (err, result) => {
        if (err) throw err;

        // returns all existing students in the database table
        res.send(result);
    });
}

exports.findStudentRecord = (req, res) => {
    let findStudentRecord = 'SELECT * FROM taken_courses where Student_ID=?';

    let query = database.query(findStudentRecord, [req.id],(err, result) => {
        if (err) throw err;

        // returns the taken courses of specified student
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
    let search = 'SELECT * FROM students WHERE (SELECT CONCAT(First_Name, " ", Last_Name) AS Full_Name) LIKE \"%${req.search}%\"';

    let query = database.query(search, (err, result) => {
        if (err) throw err;

        // returns in the database table
        res.send(result);
    });
}

exports.deleteStudent = (req, res) => {
    
    const student_id = req.body.student_id;
    let removeStudent = 'DELETE FROM students WHERE ID = ?';
    let removeRecord = 'DELETE FROM taken_courses WHERE ID = ?';
    

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

exports.uploadSingle = (req, res) => {
    console.log(req.files);
    for(let i=0; i<req.files.length; i++){
        let filename = req.files[i].originalname;
        //console.log(filename);
        if(/.+\.xlsx/.test(filename)){
            let allErrors = {};
            let workbook = XLSX.readFile("files/" + filename);
            let sheet_names = workbook.SheetNames;

            for(let j in sheet_names){
                let errors = [];
                //transform excel to JSON
                let fname, lname, program, studno, gwa;
                let data = functions.readData(filename, sheet_names[j]);
                let name = functions.verifyname(filename, sheet_names[j]);

                if(name.error){
                    errors.push(name.error)
                }else{
                    fname = name.fname;
                    lname = name.lname;
                }
                
                studno = functions.verifystudno(filename, sheet_names[j]);
                if(studno.error){
                    errors.push(studno.error)
                }

                program = functions.verifycourse(filename, sheet_names[j]);
                if(program.error){
                    errors.push(program.error)
                }

                //check if the three basic necessary information is found
                //the student number is the identifier 
                if(errors.length){
                    allErrors[sheet_names[j]] = errors
                    continue
                }

                var checkFormat = functions.processExcel(filename, program, data);
                
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

                let checkCalc = functions.weightIsValid(data)

                if(checkCalc.success){
                    functions.addTakenCourses(data, studno);
                }

                functions.addStudent(studno, fname, lname, program, checkCalc.gwa, notes_msg);

            }
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
                })
            }
            
            //console.log("File is xlsx");

        }else if(/.+\.csv/.test(filename)){
            //transform csv to JSON
            //console.log("File is csv");
            let allErrors = {};
            let workbook = XLSX.readFile("files/" + filename);
            let sheet_names = workbook.SheetNames;

            for(let j in sheet_names){
                let errors = [];
                //transform excel to JSON
                let fname, lname, program, studno, gwa;
                let data = functions.readData(filename, sheet_names[j]);

                let name = functions.verifyname(filename, sheet_names[j]);
                if(name.error){
                    errors.push(name.error)
                }else{
                    fname = name.fname;
                    lname = name.lname;
                }
                
                studno = functions.verifystudno(filename, sheet_names[j]);
                if(studno.error){
                    errors.push(studno.error)
                }

                program = functions.verifycourse(filename, sheet_names[j]);
                if(program.error){
                    errors.push(program.error)
                }

                //check if the three basic necessary information is found
                //the student number is the identifier 
                if(errors.length){
                    allErrors[sheet_names[j]] = errors
                    continue
                }

                var checkFormat = functions.processExcel(filename, program, data);
                
                // TODO: add students into database despite having "warnings"
                if(checkFormat.success){
                    let checkCalc = functions.weightIsValid(data)
                    if(checkCalc.success){
                        functions.addTakenCourses(data, studno);
                    }

                    functions.addStudent(studno, fname, lname, program, checkCalc.gwa);

                }else if(!checkFormat.success){
                    checkFormat.notes.forEach((note) => {
                        //console.log("Note is " + note)
                        errors.push(note)
                    })
                }

                if(errors.length){
                    allErrors[sheet_names[j]] = errors
                }

            }
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
                })
            }

            //console.log(data);
            console.log("File is csv");

            for(let j in sheet_names){
                //console.log(sheet_names[j])
                let errors = [];
                //transform excel to JSON
                let fname, lname, program, studno, gwa;
                let data = functions.readData(filename, sheet_names[j]);
                //console.log(data)
            }

        }else if(/.+\.pdf/.test(filename)){
            //transform pdf to JSON
            async function convertpdf(){
                let convertPromise = new Promise(function(resolve){
                    resolve(pdf2excel.genXlsx('files/'+ filename,'./files/bar.xlsx'));
                })
                await convertPromise;
                // const wb = XLSX.readFile("./files/bar.xlsx")
                // var ws = wb.Sheets["Sheet1"];

                // var range = XLSX.utils.decode_range(ws['!ref']);

                // range.s.r = 2;
                // range.e.r = range.e.r - 4;
                // ws['!ref'] = XLSX.utils.encode_range(range);

                // var data = XLSX.utils.sheet_to_json(ws);

                //console.log(data);
                //return data;
            }
            convertpdf();
            let newfilename = 'bar.xlsx'
            let allErrors = {};
            let workbook = XLSX.readFileSync("files/" + newfilename);
            let sheet_names = workbook.SheetNames;

            for(let j in sheet_names){
                let errors = [];
                //transform excel to JSON
                let fname, lname, program, studno, gwa;
                let data = functions.readData(newfilename, sheet_names[j]);
                console.log(data)

                // let name = functions.verifyname(newfilename, sheet_names[j]);
                // if(name.error){
                //     errors.push(name.error)
                // }else{
                //     fname = name.fname;
                //     lname = name.lname;
                // }
                
                // studno = functions.verifystudno(newfilename, sheet_names[j]);
                // if(studno.error){
                //     errors.push(studno.error)
                // }

                // program = functions.verifycourse(newfilename, sheet_names[j]);
                // if(program.error){
                //     errors.push(program.error)
                // }

                // //check if the three basic necessary information is found
                // //the student number is the identifier 
                // if(errors.length){
                //     allErrors[sheet_names[j]] = errors
                //     continue
                // }

                // var checkFormat = functions.processExcel(newfilename, program, data);
                
                // // TODO: add students into database despite having "warnings"
                // if(checkFormat.success){
                //     let checkCalc = functions.weightIsValid(data)
                //     if(checkCalc.success){
                //         functions.addTakenCourses(data, studno);
                //     }

                //     functions.addStudent(studno, fname, lname, program, checkCalc.gwa);

                // }else if(!checkFormat.success){
                //     checkFormat.notes.forEach((note) => {
                //         //console.log("Note is " + note)
                //         errors.push(note)
                //     })
                // }

                // if(errors.length){
                //     allErrors[sheet_names[j]] = errors
                // }

            }
        //     if(Object.keys(allErrors).length){
        //         console.log("Errors on the following files:")
        //         Object.keys(allErrors).forEach((key) => {
        //             let err_msg = key + ": ";
        //             for(let count=0; count<allErrors[key].length; count++){
        //                 if(count === (allErrors[key].length)-1){
        //                     err_msg += allErrors[key][count]
        //                 }else{
        //                     err_msg += allErrors[key][count] + ", "
        //                 }

        //             }
        //             console.log(err_msg);
        //         })
        //     }

        // }

    }

    // //Delete uploaded files
    // fs.readdir('files', (err, files) => {
    //     if (err) console.log(err);
      
    //     for (const file of files) {
    //       fs.unlink(path.join('files', file), err => {
    //         if (err) console.log(err)
    //       });
    //     }
    //   });
} 

}