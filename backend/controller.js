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
            //transform excel to JSON
            let fname, lname, program, studno, gwa;
            let data = functions.readData(filename);

            let name = functions.verifyname(filename);
            fname = name.fname;
            lname = name.lname;
            studno = functions.verifystudno(filename);
            program = functions.verifycourse(filename);

            var checkFormat = functions.processExcel(filename, program);

            if(checkFormat.success){
                if(functions.weightIsValid(data)){
                    functions.addTakenCourses(data, studno);
                }
            }

            let checkSum = 0;
            let units = 0;
            
            console.log("File is xlsx");

        }else if(/.+\.csv/.test(filename)){
            //transform csv to JSON
            //console.log("File is csv");
            const wb = XLSX.readFile("files/" + filename)
            var ws = wb.Sheets["Sheet1"];

            var range = XLSX.utils.decode_range(ws['!ref']);

            range.s.r = 2;
            range.e.r = range.e.r - 4;
            ws['!ref'] = XLSX.utils.encode_range(range);

            var data = XLSX.utils.sheet_to_json(ws);

            //console.log(data);
            console.log("File is csv");


        }else if(/.+\.pdf/.test(filename)){
            //transform pdf to JSON
            async function convertpdf(){
                let convertPromise = new Promise(function(resolve){
                    resolve(pdf2excel.genXlsx('files/'+ filename,'./files/bar.xlsx'));
                })
                await convertPromise;
                const wb = XLSX.readFile("./files/bar.xlsx")
                var ws = wb.Sheets["Sheet1"];

                var range = XLSX.utils.decode_range(ws['!ref']);

                range.s.r = 2;
                range.e.r = range.e.r - 4;
                ws['!ref'] = XLSX.utils.encode_range(range);

                var data = XLSX.utils.sheet_to_json(ws);

                //console.log(data);
                //return data;
            }
            convertpdf();
            console.log("File is pdf");

        }

    }
    
} 