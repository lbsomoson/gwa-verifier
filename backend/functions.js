// Add functions here to modularize source code better

var XLSX = require("xlsx");
var config = require('./config.json');

const myModule = require('./index');
const {database} = myModule.database;

//TO DO: Check if data exists and if the proper column names exist
function readData(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename);
    var ws = wb.Sheets[sheetName];
    var range = XLSX.utils.decode_range(ws['!ref']);
    range.s.r = 3;
    ws['!ref'] = XLSX.utils.encode_range(range);
    var data = XLSX.utils.sheet_to_json(ws);
    console.log(data);
    return data;
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
    let elect_count = 0;
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
        7. Check if Weight and Cumulative matches our own calculation
        8. Check if student met the required number of units 

        */
        
        //Check validity of courses
        if(config.course[program].includes(data[i]["CRSE NO."])){   //Check if course taken is in the program
            if(!courses_taken.includes(data[i]["CRSE NO."])){
                courses_taken.push(data[i]["CRSE NO."]);
            }
        }else if(/^.+\s200$/.test(data[i]["CRSE NO."])){
            if(!sp_thesis) {
                elective_count = 5;
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
        }else if(data[i]["CRSE NO."] === 'HK 12'){
            hk12_count--;
        }else if(data[i]["CRSE NO."] === 'NSTP 1'){
            nstp1_count--;
        }else if(data[i]["CRSE NO."] === 'NSTP 2'){
            nstp2_count--;
        }else if(data[i]["CRSE NO."] === undefined) break;           //breaks if no more courses are read

        else if(config.GE.hasOwnProperty(data[i]["CRSE NO."])){
            if(config.GE[data[i]["CRSE NO."]] === 'Required'){
                required_ge.push(data[i]["CRSE NO."]);
            }else{
                ge_taken.push(data[i]["CRSE NO."]);
            }
        }else if(data[i]["CRSE NO."] === 'LOA'){
            notes.push("Taken LOA during " + data[i].__EMPTY)
        }
        else{
            elect_count++;
            
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
        let term = data[i].__EMPTY;
        if(term != undefined){   //term exists

            //check if term is in valid format
            if(/^l{1,2}\/\d{2}\/\d{2}$/.test(term)){
                const termElements = term.split("/");
                if(parseInt(termElements[1])+1 != parseInt(termElements[2])){
                    notes.push("Academic Year of Term is incorrectly formatted for " + term)
                }
            }else if(!/^midyear 20\d{2}$/.test(term)){
                notes.push("Error in term format for term" + term);
            }
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
    
    if(elective_count > elect_count){
        notes.push("Insufficient number of elective courses")
    }

    if(!sp_thesis){
        notes.push("No SP/Thesis")
    }

    if(notes.length){   //notes is not empty
        return {"success": false, "notes": notes}
    }

    return {"success": true, "error": "None"}
}


function verifyname(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true});
    var ws = wb.Sheets[sheetName];
    var fname = ws['B1'].v;
    var lname = ws['A1'].v;


    if(/^([A-Z\s])+$/.test(lname) && /^([A-Z\s])+$/.test(fname)){
        //console.log('Name: '+ lname+', '+fname);
    }else{
        //console.log(lname+', '+fname+' is not a valid name');
        return {"error": "Name is not valid"}   
    }

    return {"fname": fname, "lname": lname}
}

//TODO: Check 'A3' for degree program
function verifystudno(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true}) ;
    var ws = wb.Sheets[sheetName];
    var studno = ws['A2'].v;
    if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
        //console.log('Student number: '+studno);
    }else{
        studno = ws['A3'].v;
        if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
            //console.log('Student number: '+studno);
        }else{
            //console.log('Invalid student number');
            return {"error": "Invalid student number"};
        }
        
    }

    return studno
}

//TODO: Check 'A2' for degree program
function verifycourse(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true});
    var ws = wb.Sheets[sheetName];
    var course = String(ws['A3'].v);

    var coursecodes = ['BSCS','BACA'];
    if(coursecodes.includes(course)){
        //console.log('Course: '+course);
    }else{
        course = String(ws['A2'].v);
        if(coursecodes.includes(course)){
            //console.log('Course: '+course);
        }else{
            //console.log(course+ ' is not a valid course');
            return {"error": "Invalid course"};
        }
        
    }

    return course;
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
            console.log(recorded, "Regular Load");
        }else{
            notes.push("Overload during " + data[count].__EMPTY)
            console.log("Count is "+ term_count +" and " + config[term_count] + "is not equal to " + data[count]["Term"] + "for term " + data[count].__EMPTY)
            console.log(recorded, "Overload");
        }
    
}

function addStudent(studno, fname, lname, program, gwa, warnings){
    let addStudent = 'INSERT INTO students values (?, ?, ?, ?, ?, ?)';

    let query = database.query(addStudent, [studno, fname, lname, program, gwa, warnings] ,(err, result) => {
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

        //console.log("Successfully added course");
        //res.send(result);
    });
}

function addTakenCourses(data, studno){
    let courses_to_add = [];
    let count = 1;

    for(let i=0; i<data.length; i++){
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
                    //console.log("Successfully added student");
                }
                courses_to_add = [];
            }
        }
    }
    //console.log("Count is " + count);
}


function weightIsValid(data){

    let initSum = 0;
    let checkSum = 0;
    let initUnits = 0;
    let units = 0;
    let initGWA = 0;
    let gwa = 0;
    let count = 0;
    //console.log(data)
    for(let i = 0; i<data.length; i++){
        

        if (data[i]['CRSE NO.'] != undefined){
            // check if course is of 200 series (thesis)
            if(/.+200$/.test(data[i]["CRSE NO."])){
                if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                    continue;
                }
                else if (isNaN(data[i].Grade*data[i].Units)){
                    checkSum += (data[i].Grade*6);
                    units += 6;
                }
               
            }
            // check if course is of 190 series (special problem)
            else if (/.+190$/.test(data[i]["CRSE NO."])){
                if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                    continue;
                }
                else if (isNaN(data[i].Grade*data[i].Units)){
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
                        //console.log(data[i]["CRSE NO."] + "\t"+ data[i].Weight);
                        checkSum += data[i].Weight;
                    }else{
                        //console.log("Error in " + i);
                        checkSum += (data[i].Grade*data[i].Units);
                    }
                }
            }
            else if(['AWOL', 'LOA'].includes(data[i]["CRSE NO."])){
                continue;
            }
            else {
                if(data[i].Grade*data[i].Units === data[i].Weight){     // if the calculation is correct
                    checkSum += data[i].Weight;
                    units += data[i].Units;
                }else{                                                  // if not
                    checkSum += (data[i].Grade*data[i].Units);
                    units += data[i].Units;
                }
            }
            //console.log(`checkSum: ${checkSum}`)
        }
        else {
            //console.log(data[i]);
            initSum = data[i].Cumulative;
            initUnits = data[i].Grade;
            initGWA = data[i+1].Grade;
            break;
        }
    }

    console.log(`checkSum: ${checkSum} initSum: ${initSum}`)
    gwa = checkSum/units;

    if (checkSum === initSum && units === initUnits) {
        return {'success': true, 'gwa':gwa};
    }
    
    return {'success': false, 'gwa': initGWA,'warning': 'mismatch with cumulative or total units'};

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

module.exports={readData, verifyunits,checkload,processExcel, verifyname, verifycourse, verifystudno, addStudent, weightIsValid, addTakenCourses, termToText}