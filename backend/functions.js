// Add functions here to modularize source code better

var XLSX = require("xlsx");
const { checkIfLoggedIn } = require("./auth-controller");
var config = require('./config.json');

const myModule = require('./index');
const {database} = myModule.database;

function readData(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename);
    var ws = wb.Sheets[sheetName];
    var range = XLSX.utils.decode_range(ws['!ref']);
    range.s.r = 3;
    ws['!ref'] = XLSX.utils.encode_range(range);
    var data = XLSX.utils.sheet_to_json(ws);
    //console.log(data)
    if(data.length === 0){
        return {'error': 'data does not exist'}
    }
    return data;
}

function verifyname(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true});
    var ws = wb.Sheets[sheetName];
    var fname = ws['B1'].v;
    var lname = ws['A1'].v;

    if(/^([a-zA-Z])+$/.test(lname) && /^([a-zA-Z])+$/.test(fname) && (fname != undefined || lname !=undefined)){
        //console.log('Name: '+ lname+', '+fname + ' is a valid name');
    }else{
        //console.log(lname+', '+fname+' is not a valid name');
        return {"error": "Name is not valid"}   
    }

    return {"fname": fname, "lname": lname}
}

function verifystudno(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true}) ;
    var ws = wb.Sheets[sheetName];
    var studno = String(ws['A2'].v);
    console.log(studno);
    if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
        //console.log('Student number: '+studno);
    }else{
        studno = String(ws['A3'].v);
        if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
            //console.log('Student number: '+studno);
        }else{
            //console.log('Invalid student number');
            return {"error": "Invalid student number"};
        }
        
    }

    return studno
}

function verifycourse(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true});
    var ws = wb.Sheets[sheetName];
    var course = String(ws['A3'].v);
    console.log(course);
    if(config.programs.includes(course)){
        //console.log('Course: '+course);
    }else{
        course = String(ws['A2'].v);
        if(config.programs.includes(course)){
            //console.log('Course: '+course);
        }else{
            //console.log(course+ ' is not a valid course');
            return {"error": "Invalid course"};
        }
        
    }

    return course;
}

function verifyHeaders(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetRows: 4, sheetStubs: true});
    var ws = wb.Sheets[sheetName];
    var range = XLSX.utils.decode_range(ws['!ref']);
    range.s.r = 3;
    ws['!ref'] = XLSX.utils.encode_range(range);
    var data = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: '',
        blankrows: true
    });

    let headers = {
        0: 'CRSE NO.',
        1: 'Grade',
        2: 'Units',
        3: 'Weight',
        4: 'Cumulative',
        5: 'Term'
    }

    for(let i=0; i<Object.keys(headers).length; i++){
        if(!(data[0][i] === headers[i])){
            return {'success': false, 'error':'Wrong format for headers'}
        }
    }

    return {'success': true}
}


function processExcel(filename, program, data){

    let notes = [];
    let errors = [];

    let courses_taken = [];
    let ge_taken = [];
    let required_ge = [];
    let hk11_count = 1;
    let hk12_count = 3;
    let nstp1_count = 1;
    let nstp2_count = 1;
    let taken_elective_count = 0;
    let elective_count = 0;
    let sp_thesis = false;
    let sp_flag = false;
    let max_term_count = config.units[program].Thesis.length;
    let term_count = 0;
    

    for(let i=0; i<data.length; i++){
        /*
        Things to check:
        0. Check if the proper format of CRSE NO., Grade, Units, Weight, Cumulative, Term is followed
        1. Check if the courses taken are in the course, if not, count it as elective (DONE)
        2. Check if the required elective count is reached (WIP)
        3. Check if the NSTP and HK requirements are met (DONE)
        4. Check if student is taking an SP/Thesis (DONE)
        5. Check if Underloading or Overloading (WIP)
        6. Check if term has a valid format (DONE)
        7. Check if Weight and Cumulative matches our own calculation (DONE)
        8. Check if student met the required number of units 

        */
        
        if((data[i]["CRSE NO."] && data[i].Grade && (data[i].Weight === 0 || data[i].Weight) && data[i].Cumulative) || (data[i]["CRSE NO."] && data[i].Term) ){
            //Check validity of courses
            if(config.course[program].includes(data[i]["CRSE NO."])){   //Check if course taken is in the program
                if(!courses_taken.includes(data[i]["CRSE NO."])){
                    courses_taken.push(data[i]["CRSE NO."]);
                    //console.log(data[i]["CRSE NO."] + " is part of program")
                }
            }else if(/^.+\s200$/.test(data[i]["CRSE NO."])){
                //console.log(data[i]["CRSE NO."] + " is Thesis")
                if(!sp_thesis) {
                    elective_count = config.elective[program].Thesis;
                    sp_thesis = true
                }
            }else if(/^.+\s190$/.test(data[i]["CRSE NO."])){
                if(!sp_thesis) {
                    elective_count = 6;
                    sp_thesis = true
                    sp_flag = true
                    max_term_count = config.units[program].SP.length
                }
            }else if(data[i]["CRSE NO."] === 'HK 11'){                   //If course not in the program, check if it's a HK subject
                hk11_count--;
            }else if(data[i]["CRSE NO."] === 'HK 12' || data[i]["CRSE NO."] === 'HK 13'){
                hk12_count--;
            }else if(data[i]["CRSE NO."] === 'NSTP 1'){
                nstp1_count--;
            }else if(data[i]["CRSE NO."] === 'NSTP 2'){
                nstp2_count--;
            }
            else if(config.GE.hasOwnProperty(data[i]["CRSE NO."])){
                if(config.GE[data[i]["CRSE NO."]] === 'Required'){
                    required_ge.push(data[i]["CRSE NO."]);
                    //console.log(data[i]["CRSE NO."] + " is Required")
                }else{
                    ge_taken.push(data[i]["CRSE NO."]);
                }
            }else if(data[i]["CRSE NO."] === 'LOA'){
                notes.push("Taken LOA during " + data[i].__EMPTY)
            }
            else if(data[i]["CRSE NO."] === 'AWOL'){
                notes.push("AWOL during " + data[i].__EMPTY)
            }
            else{
                taken_elective_count++;
                //console.log(data[i]["CRSE NO."] + "is Elective");
            }

            //Check for underloading and overloading
            if(term_count < max_term_count){
                if(data[i]["Term"]!=undefined){ //load exists
                    if(!sp_flag){
                        checkload(data, i, config.units[program].Thesis, term_count, notes)
                        term_count++;
                    }else{
                        checkload(data, i, config.units[program].SP, term_count, notes)
                        term_count++;
                    }
                    
                }
            }else{
                notes.push("Took more terms than prescribed during course" + data[i]["CRSE NO."])
                //console.log("Term count is "+ term_count + "during course" + data[i]["CRSE NO."])
            }

            //Check validity of term
            // let term = data[i].__EMPTY;
            // if(term != undefined){   //term exists

            //     //check if term is in valid format
            //     if(/^l{1,2}\/\d{2}\/\d{2}$/.test(term)){
            //         const termElements = term.split("/");
            //         if(parseInt(termElements[1])+1 != parseInt(termElements[2])){
            //             notes.push("Academic Year of Term is incorrectly formatted for " + term)
            //         }
            //     }else if(!/^midyear 20\d{2}$/.test(term)){
            //         notes.push("Error in term format for term" + term);
            //     }
            // }
        }

    }

    if(hk11_count != 0 || hk12_count != 0){
        notes.push("Incomplete number of HK courses")
    }
    if(nstp1_count != 0 || nstp2_count != 0){
        notes.push("Incomplete number of NSTP courses")
    }

    if(required_ge.length < 6){
        notes.push("Incomplete number of required GE courses")
    }
    
    if(elective_count > taken_elective_count){
        notes.push("Insufficient number of elective courses")
    }

    if(sp_thesis != true){
        notes.push("No SP/Thesis")
    }

    if(notes.length){   //notes is not empty
        return {"success": false, "notes": notes}
    }

    return {"success": true, "error": "None"}
}

function verifyunits(data){
    let calced = 0;
    for(let i = 0; i<data.length;i++){
        if(!isNaN(data[i]["Grade"])){
            calced += data[i]["Units"];
            if(!isNaN(data[i]["Term"])){
                recorded = data[i]["Term"];
                console.log("Calculated Units of Term:",calced)
                console.log("Recorded Units:",recorded)
                if(recorded==calced){
                    console.log("Correct recorded units");
                }else{
                    console.log("Incorrect recorded units");
                }
                calced = 0;
            }
        }
    }
}


function checkload(data, count, config, term_count, notes){
    
        const recorded = data[count]["Term"];
        if(recorded<config[term_count]){
            notes.push("Underload during " + data[count].__EMPTY)
        }else if(recorded == config[term_count]){
            //console.log(recorded, "Regular Load");
        }else{
            notes.push("Overload during " + data[count].__EMPTY)
        }
    
}

function addStudent(studno, fname, lname, program, gwa, qualified, warnings){
    let addStudent = 'INSERT INTO students values (?, ?, ?, ?, ?, ?, ?)';

    let query = database.query(addStudent, [studno, fname, lname, program, gwa, qualified, warnings] ,(err, result) => {
        if (err) throw err;

        console.log("Successfully added student");
        //res.send(result);
    });
}

function addCourse(id, studno, course_code, course_type, grade, units, weight, term){
    let addCourse = 'INSERT INTO taken_courses values (?, ?, ?, ?, ?, ?, ?, ?)';

    let query = database.query(addCourse, [id, studno, course_code, course_type, grade, units, weight, term], (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}

function addTakenCourses(data, studno){
    let courses_to_add = [];
    let count = 1;

    for(let i=0; i<data.length; i++){
        //console.log("Adding a course")
        if (data[i]['CRSE NO.'] != undefined){
            if(['LOA', 'AWOL'].includes(data[i]['CRSE NO.'])){
                if(data[i]['CRSE NO.'] === 'LOA'){
                    addCourse(count, studno, 'LOA', null, null, null, null, data[i].__EMPTY);
                    count++;
                }else{
                    addCourse(count, studno, 'AWOL', null, null, null, null, data[i].__EMPTY);
                    count++;
                }
                
            }else if(data[i].__EMPTY == undefined){
                courses_to_add.push(i);
            }else{
                courses_to_add.push(i);
                for(let j=0; j<courses_to_add.length; j++){
                    addCourse(count, studno, data[courses_to_add[j]]['CRSE NO.'], null, data[courses_to_add[j]].Grade, data[courses_to_add[j]].Units, data[courses_to_add[j]].Weight, data[i].__EMPTY);
                    count++;
                }
                courses_to_add = [];
            }
        }
    }
    console.log("Added courses");
}


function weightIsValid(data){

    let initSum = 0;
    let checkSum = 0;
    let initUnits = 0;
    let units = 0;
    let initGWA = 0;
    let gwa = 0;
    let qualified_for_honors = true;
    let warnings = [];

    for(let i = 0; i<data.length; i++){
        
        if (data[i]["CRSE NO."] && data[i].Grade && (data[i].Weight === 0 || data[i].Weight) && data[i].Cumulative || (data[i]["CRSE NO."] && data[i].Term) ){
            // check if course is of 200 series (thesis)
            if(/.+200$/.test(data[i]["CRSE NO."])){
                if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                    continue;
                }
                else if(!isNaN(data[i].Grade)){
                    checkSum += (data[i].Grade*6);
                    units += 6;
                }
               
            }
            // check if course is of 190 series (special problem)
            else if (/.+190$/.test(data[i]["CRSE NO."])){
                if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                    continue;
                }
                else if(!isNaN(data[i].Grade)){
                    checkSum += (data[i].Grade*3);
                    units += 3;
                }
            }
            // check if course is a seminar
            else if (/.+199$/.test(data[i]["CRSE NO."])){
                if((data[i].Grade === 'S')){
                    units += 1;
                    continue;
                }
                else {
                    if(data[i].Grade*data[i].Units === data[i].Weight){
                        checkSum += data[i].Weight;
                    }else{
                        checkSum += (data[i].Grade*data[i].Units);
                    }
                }
            }
            else if(['LOA'].includes(data[i]["CRSE NO."])){
                continue;
            }
            else if(['AWOL'].includes(data[i]["CRSE NO."])){
                qualified_for_honors = false;
                continue;
            }
            else {
                if(['INC', 'DFG'].includes(data[i].Grade)){
                    qualified_for_honors = false;
                    warnings.push('Student has a grade of INC or DFG for course '+ data[i]["CRSE NO."])
                    continue
                }
                
                else if(data[i].Grade === 'DRP'){
                    warnings.push('Student has a grade of DRP for course '+ data[i]["CRSE NO."])
                    continue
                }

                if(data[i].Grade*data[i].Units === data[i].Weight){     // if the calculation is correct
                    checkSum += data[i].Weight;
                    units += data[i].Units;
                }else{                                                  // if not
                    checkSum += (data[i].Grade*data[i].Units);
                    units += data[i].Units;
                }
            }
        }
        else {
            // if(data[i-1].__EMPTY_2 != undefined){  //pdf
            //     if(data[i-1].__EMPTY_3){
            //         initSum = data[i-1].__EMPTY_3;
            //         initUnits = data[i-1].__EMPTY_2;
            //     }else{
            //         initSum = data[i-1].__EMPTY_2;
            //         initUnits = data[i-1].__EMPTY_1;
            //     }
            //     break;
            // }

            initSum = data[i].Cumulative;
            initUnits = data[i].Grade;
            initGWA = data[i+1].Grade;
            break;
        }
        //console.log("Checksum is now " + checkSum)
    }

    console.log(`checkSum: ${checkSum} initSum: ${initSum}`)
    gwa = checkSum/units;
    if(gwa > 1.75) {
        console.log('GWA did not reach atlast 1.75');
        qualified_for_honors = false;
    }

    if (checkSum === initSum && units === initUnits && gwa === initGWA) {
        return {'success': true, 'gwa':gwa, 'units':units, 'qualified':qualified_for_honors};
    }
    
    warnings.push('mismatch with cumulative weight, total units, or gwa')
    return {'success': true, 'gwa': initGWA , 'units':units, 'qualified':qualified_for_honors, 'warning': warnings};

}


// Splits the term to a more readable format
function termToText(term){
    const termElements = term.split("/");
    let term_msg = "";

    if(termElements[0] === 'l'){
        term_msg += "1st Semester of A.Y. 20" + termElements[1] + "-20" + termElements[2]; 
    }else{
        term_msg += "2nd Semester of A.Y. 20" + termElements[1] + "-20" + termElements[2]; 
    }



}

function addEditedTakenCourses(data, studno){
    let count = 1;

    for(let i=0; i<data.length; i++){
        //console.log("Adding a course")
        if(['LOA', 'AWOL'].includes(data[i].Course_Code)){
            if(data[i].Course_Code === 'LOA'){
                addCourse(count, studno, 'LOA', null, null, null, null, data[i].__EMPTY);
                count++;
            }else{
                addCourse(count, studno, 'AWOL', null, null, null, null, data[i].__EMPTY);
                count++;
            }
            
        }else{
            addCourse(count, studno, data[i].Course_Code, null, data[i].Grade, data[i].Units, data[i].Weight, data[i].__EMPTY);
            count++;
        }
    }
    console.log("Added edited courses");
    //console.log("Count is " + count);
}

function processEdit(edited_data){
    
    let student_id = edited_data.studentID;
    let data = edited_data.courses;

    let getProgram = 'SELECT Program FROM students WHERE ID = \'2018-82531\'';

    let progquery = database.query(getProgram, (err, result) => {
        if (err) throw err;
        
        let program = result[0].Program;
        let notes = [];
        let errors = [];
        let warnings = [];

        let courses_taken = [];
        let ge_taken = [];
        let required_ge = [];
        let hk11_count = 1;
        let hk12_count = 3;
        let nstp1_count = 1;
        let nstp2_count = 1;
        let taken_elective_count = 0;
        let elective_count = 0;
        let sp_thesis = false;
        let sp_flag = false;
        let max_term_count = config.units[program].Thesis.length;
        let term_count = 0;

        for(let i=0; i<data.length; i++){

                if(/^.+\s200$/.test(data[i].Course_Code)){
                    //console.log(data[i].Course_Code + " is Thesis")
                    if(!sp_thesis) {
                        elective_count = config.elective[program].Thesis;
                        sp_thesis = true
                    }

                    if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                        continue;
                    }
                    else if(!isNaN(data[i].Grade)){
                        checkSum += (data[i].Grade*6);
                        units += 6;
                    }

                }else if(/^.+\s190$/.test(data[i].Course_Code)){
                    if(!sp_thesis) {
                        elective_count = 6;
                        sp_thesis = true
                        sp_flag = true
                        max_term_count = config.units[program].SP.length
                    }

                    if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                        continue;
                    }
                    else if(!isNaN(data[i].Grade)){
                        checkSum += (data[i].Grade*3);
                        units += 3;
                    }
                }else if (/.+199$/.test(data[i].Course_Code)){
                    if(!courses_taken.includes(data[i].Course_Code)){
                        courses_taken.push(data[i].Course_Code);
                    }

                    if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                        units += 1;
                        continue;
                    }
                }else{
                    if(config.course[program].includes(data[i].Course_Code)){   //Check if course taken is in the program
                        if(!courses_taken.includes(data[i].Course_Code)){
                            courses_taken.push(data[i].Course_Code);
                        }
                    }else if(data[i].Course_Code === 'HK 11'){                   //If course not in the program, check if it's a HK subject
                        hk11_count--;
                    }else if(data[i].Course_Code === 'HK 12' || data[i].Course_Code === 'HK 13'){
                        hk12_count--;
                    }else if(data[i].Course_Code === 'NSTP 1'){
                        nstp1_count--;
                    }else if(data[i].Course_Code === 'NSTP 2'){
                        nstp2_count--;
                    }
                    else if(config.GE.hasOwnProperty(data[i].Course_Code)){
                        if(config.GE[data[i].Course_Code] === 'Required'){
                            required_ge.push(data[i].Course_Code);
                        }else{
                            ge_taken.push(data[i].Course_Code);
                        }
                    }else if(data[i].Course_Code === 'LOA'){
                        notes.push("Taken LOA during " + data[i].__EMPTY)
                        continue
                    }
                    else if(data[i].Course_Code === 'AWOL'){
                        notes.push("AWOL during " + data[i].__EMPTY)
                        continue
                    }
                    else{
                        taken_elective_count++;
                        //console.log(data[i].Course_Code + "is Elective");
                    }

                    /*                                  */
                    /*          GRADE CHECKING          */
                    /*                                  */

                    if(['INC', 'DFG'].includes(data[i].Grade)){
                        warnings.push('Student has a grade of INC or DFG for course '+ data[i].Course_Code)
                        continue
                    }
                    
                    else if(data[i].Grade === 'DRP'){
                        warnings.push('Student has a grade of DRP for course '+ data[i].Course_Code)
                        continue
                    }

                    if(data[i].Grade*data[i].Units === data[i].Weight){     // if the calculation is correct
                        checkSum += data[i].Weight;
                        units += data[i].Units;
                    }else{                                                  // if not
                        checkSum += (data[i].Grade*data[i].Units);
                        units += data[i].Units;
                    }

                }

                //Check for underloading and overloading
                if(term_count < max_term_count){
                    if(data[i]["Term"]!=undefined){ //load exists
                        if(!sp_flag){
                            checkload(data, i, config.units[program].Thesis, term_count, notes)
                            term_count++;
                        }else{
                            checkload(data, i, config.units[program].SP, term_count, notes)
                            term_count++;
                        }
                        
                    }
                }else{
                    notes.push("Took more terms than prescribed during course" + data[i].Course_Code)
                }

        }

        if(hk11_count != 0 || hk12_count != 0){
            notes.push("Incomplete number of HK courses")
        }
        if(nstp1_count != 0 || nstp2_count != 0){
            notes.push("Incomplete number of NSTP courses")
        }

        if(required_ge.length < 6){
            notes.push("Incomplete number of required GE courses")
        }
        
        if(elective_count > taken_elective_count){
            notes.push("Insufficient number of elective courses")
        }

        if(sp_thesis != true){
            notes.push("No SP/Thesis")
        }

        // let removeStudent = 'DELETE FROM students WHERE ID = ?';
        let removeRecord = 'DELETE FROM taken_courses WHERE Student_ID = ?';

        let query = database.query(removeRecord , [student_id], (err, result) => {
            if (err) throw err;
            
            addEditedTakenCourses(data, student_id);
        
        });
        
    });

    

    // if(notes.length){   //notes is not empty
    //     return {"success": true, "notes": notes}
    // }

    // return {"success": true, "error": "None"}
}

// function getStudentProgram(student_id){
//     let getProgram = 'SELECT Program FROM students WHERE ID = \'2018-82531\'';

//     let query = database.query(getProgram, (err, result) => {
//         if (err) throw err;
//         console.log(`result[0].Program: ${result[0].Program}`);
//         return(result[0].Program);
//     });
// }

module.exports={readData, verifyunits,checkload,processExcel, verifyname, verifycourse, verifystudno, addStudent, weightIsValid, addTakenCourses, termToText, verifyHeaders, processEdit}