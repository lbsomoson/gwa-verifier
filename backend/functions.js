// Add functions here to modularize source code better

var XLSX = require("xlsx");
var config = require('./config.json');

const myModule = require('./index');
const {database} = myModule.database;

function readData(filename){
    var wb = XLSX.readFile("files/" + filename);
    var ws = wb.Sheets["Sheet1"];
    var range = XLSX.utils.decode_range(ws['!ref']);
    range.s.r = 3;
    ws['!ref'] = XLSX.utils.encode_range(range);
    var data = XLSX.utils.sheet_to_json(ws);
    //console.log(data);
    return data;
}


function processExcel(filename, program){

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
    
    //console.log(program);
    
    // get course data
    data = readData(filename);
    for(let i=0; i<data.length; i++){

        //Check validity of courses
        if(config.course[program].includes(data[i]["CRSE NO."])){   //Check if course taken is in the program
            if(!courses_taken.includes(data[i]["CRSE NO."])){
                courses_taken.push(data[i]["CRSE NO."]);
            }
        }else if(/^[A-Z]{4} 200$/.test(data[i]["CRSE NO."])){
            if(!sp_thesis) {
                elective_count = 6;
            }
        }else if(/^[A-Z]{4} 190$/.test(data[i]["CRSE NO."])){
            if(!sp_thesis) {
                elective_count = 5;
            }
        }else if(data[i]["CRSE NO."] == 'HK 11'){                   //If course not in the program, check if it's a HK subject
            hk11_count--;
        }else if(data[i]["CRSE NO."] == 'HK 12'){
            hk12_count--;
        }else if(data[i]["CRSE NO."] == 'NSTP 1'){
            nstp1_count--;
        }else if(data[i]["CRSE NO."] == 'NSTP 2'){
            nstp2_count--;
        }else if(data[i]["CRSE NO."] == undefined) break;           //breaks if no more courses are read

        else if(config.GE.hasOwnProperty(data[i]["CRSE NO."])){
            if(config.GE[data[i]["CRSE NO."]] === 'Required'){
                required_ge.push(data[i]["CRSE NO."]);
            }else{
                ge_taken.push(data[i]["CRSE NO."]);
            }
        }else if(data[i]["CRSE NO."] == 'LOA'){
            //do nothing
        }
        else{
            elect_count++;
        }

        //Check validity of term
        let term = data[i].__EMPTY;
        if(term != undefined){   //term exists
            //check if term is in valid format
            if(/^l{1,2}\/\d{2}\/\d{2}$/.test(term)){
                const termElements = term.split("/");
                // for(let i in termElements){
                //     console.log(termElements[i]);
                // }
            }else{
                console.log("Error in term format for row" + i);
            }
        }

        
        //console.log(data[i]);

    }
    // console.log("Number of courses taken is " + courses_taken.length);
    // if(hk11_count != 0 && hk12_count != 0){
    //     console.log("Missing HK courses");
    // }else{
    //     console.log("HK courses complete");
    // }
    // if(nstp1_count == 0 && nstp2_count == 0){
    //     console.log("NSTP courses completed");
    // }
    // console.log("Number of Required GE courses taken: " + required_ge.length);
    // console.log("Number of Elective GE courses taken: " + ge_taken.length);
    
    // if(elective_count <= elect_count){
    //     console.log("Number of electives required reached");
    //     console.log("Elective count is " + elect_count);
    // }

    return {"success": true, "error": "None"}
}


function verifyname(filename){
    var wb = XLSX.readFile("files/" + filename);
    var ws = wb.Sheets["Sheet1"];
    var fname = ws['B1'].v;
    var lname = ws['A1'].v;


    if(/^([A-Z\s])+$/.test(lname) && /^([A-Z\s])+$/.test(fname)){
        console.log('Name: '+ lname+', '+fname);
    }else{
        console.log(lname+', '+fname+' is not a valid name');   
    }

    return {"fname": fname, "lname": lname}
}

//TODO: Check 'A3' for degree program
function verifystudno(filename){
    var wb = XLSX.readFile("files/" + filename);
    var ws = wb.Sheets["Sheet1"];
    var studno = ws['A2'].v;
    if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
        console.log('Student number: '+studno);
    }else{
        console.log('Invalid student number');
    }

    return studno
}

//TODO: Check 'A2' for degree program
function verifycourse(filename){
    var wb = XLSX.readFile("files/" + filename);
    var ws = wb.Sheets["Sheet1"];
    var course = String(ws['A3'].v);

    var coursecodes = ['BSCS','BACA'];
    if(coursecodes.includes(course)){
        console.log('Course: '+course);
    }else{
        console.log(course+ ' is not a valid course');
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


function checkload(data){
    for(let i = 0; i<data.length;i++){
        if(data[i]["Term"]!=undefined){
            recorded = data[i]["Term"];
            if(recorded<15){
                console.log(recorded, "Underload");
            }else if(recorded>=15 && recorded<=21){
                console.log(recorded, "Regular Load");
            }else{
                console.log(recorded, "Overload");
            }
        }
    }
}

function addStudent(studno, fname, lname, program, gwa){
    let addStudent = 'INSERT INTO students values (?, ?, ?, ?, ?)';

    let query = database.query(addStudent, [studno, fname, lname, program, gwa] ,(err, result) => {
        if (err) throw err;

        console.log("Successfully added student");
        res.send(result);
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
    console.log("Count is " + count);
}


function weightIsValid(data){

    let initSum = 0;
    let checkSum = 0;
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
                }
               
            }
            // check if course is of 190 series (special problem)
            else if (/.+190$/.test(data[i]["CRSE NO."])){
                if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                    continue;
                }
                else if (isNaN(data[i].Grade*data[i].Units)){
                    checkSum += (data[i].Grade*3);
                }
            }
            else if (/.+199$/.test(data[i]["CRSE NO."])){
                if((data[i].Grade === 'S')){
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
                if(data[i].Grade*data[i].Units === data[i].Weight){
                    //console.log(data[i]["CRSE NO."] + "\t"+ data[i].Weight);
                    checkSum += data[i].Weight;
                }else{
                    //console.log("Error in " + i);
                    checkSum += (data[i].Grade*data[i].Units);
                }
            }
            console.log(`checkSum: ${checkSum}`)
        }
        else {
            console.log(data[i]);
            initSum = data[i].Cumulative;
            break;
        }
    }
    console.log(`checkSum: ${checkSum} initSum: ${initSum}`)

    if (checkSum == initSum) {
        return true;
    }
    
    return false;

}

module.exports={readData, verifyunits,checkload,processExcel, verifyname, verifycourse, verifystudno, addStudent, weightIsValid, addTakenCourses}