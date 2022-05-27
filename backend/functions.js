var XLSX = require("xlsx");
var config = require('./config.json');
const { checkIfLoggedIn } = require("./auth-controller");
const myModule = require('./index');
const {database} = myModule.database;

function checkTermValidity(term){
    // Check if term is in valid format
    if(/^l{1,2}\/\d{2}\/\d{2}$/.test(term)){
        const termElements = term.split("/");
        if(parseInt(termElements[1])+1 != parseInt(termElements[2])){
            notes.push("Academic Year of Term is incorrectly formatted for " + term)
        }
    }else if(!/^midyear 20\d{2}$/.test(term)){
        notes.push("Error in term format for term " + term);
    }
}


function readData(filename, sheetName, isPdf){
    var wb = XLSX.readFile("files/" + filename);
    var ws = wb.Sheets[sheetName];
    var range = XLSX.utils.decode_range(ws['!ref']);
    range.s.r = 3;
    ws['!ref'] = XLSX.utils.encode_range(range);
    var data = XLSX.utils.sheet_to_json(ws);

    let end_range = range.s.r
    let units_and_checksum_check = false;
    let gwa_check = false;
    let semesterCount = 0;

    for(let i=0; i<data.length; i++){
        if((data[i]["CRSE NO."] && data[i].Grade && (data[i].Units === 0 || data[i].Units) && (data[i].Weight === 0 || data[i].Weight) && data[i].Cumulative) || (data[i]["CRSE NO."] && data[i].Term) ){
            if(data[i]["Term"]){ // If load exists, then term must also exist
                if(isNaN(data[i]["Term"])){
                    //console.log("Semester is not a number during course " + data[i]["CRSE NO."]  + "the load is " + data[i].Term)
                    return {'error': 'A Semester Load is not a Number'}
                }
                if(data[i].__EMPTY){
                    //checkTermValidity(data[i].__EMPTY)
                    semesterCount++;
                }else{
                    return {'error': 'Term does not exist'}
                }
            }
            end_range++;
        }

    }

    if(semesterCount === 0){
        return {'error': 'No Detected Units per Semester and/or Semesters'}
    }

    let index = end_range-3;
    for(let i=0; i<2; i++){
        index = index+i;
        if(isPdf){
            if(!units_and_checksum_check){
                index--;
                if(data[index].__EMPTY_2){
                    if(data[index].__EMPTY_3){
                        if(isNaN(data[index].__EMPTY_2) || isNaN(data[index].__EMPTY_3)){
                            return {'error': 'Total Units or Cumulative Weight is not a number'}
                        }else{
                            units_and_checksum_check = true;
                        }
                    }else{
                        if(isNaN(data[index].__EMPTY_1) || isNaN(data[index].__EMPTY_2)){
                            return {'error': 'Total Units or Cumulative Weight is not a number'}
                        }else{
                            units_and_checksum_check = true;
                        }
                    }
                }else{
                    return {'error': 'Total Units or Cumulative Weight is not found'}
                }
            }
            else if (!gwa_check){
                if(data[index]["CRSE NO."] && data[index].Grade){ 
                    console.log(data[index]["CRSE NO."])
                    console.log(data[index].Grade)
                    if((typeof data[index]["CRSE NO."] != 'string' || data[index]["CRSE NO."].trim() !== "GWA") || isNaN(data[index].Grade)){
                        return {'error': 'Unexpected format for GWA'}
                    }else{
                        gwa_check = true;
                    }
                }else{
                    return {'error': 'GWA not found'}
                }
    
            }

        }else{
            if(!units_and_checksum_check){
                if(data[index].Grade && data[index].Cumulative){ 
                    if(isNaN(data[index].Grade) || isNaN(data[index].Cumulative)){
                        return {'error': 'Total Units or Cumulative Weight is not a number'}
                    }else{
                        units_and_checksum_check = true;
                    }
                }else{
                    return {'error': 'Total Units or Cumulative Weight is not found'}
                }
            }
            else if (!gwa_check){
                if(data[index]["CRSE NO."] && data[index].Grade){ 
                    if((typeof data[index]["CRSE NO."] != 'string' || data[index]["CRSE NO."].trim() !== "GWA") || isNaN(data[index].Grade)){
                        return {'error': 'Unexpected format for GWA'}
                    }else{
                        gwa_check = true;
                    }
                }else{
                    return {'error': 'GWA not found'}
                }
    
            }
    
        }
    }
    
    range.e.r = end_range;
    ws['!ref'] = XLSX.utils.encode_range(range);
    realData = XLSX.utils.sheet_to_json(ws);

    if(realData.length === 0){
        return {'error': 'Data does not exist'}
    }
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
    let taken_elective_count = 0;
    let elective_count = 0;
    let sp_thesis = false;
    let sp_flag = false;
    let max_term_count = config.units[program].Thesis.length;
    let term_count = 0;
    
    

    for(let i=0; i<data.length; i++){
        /*
        Things to check:
        0. Check if the proper format of CRSE NO., Grade, Units, Weight, Cumulative, Term is followed (DONE)
        1. Check if the courses taken are in the course, if not, count it as elective (DONE)
        2. Check if the required elective count is reached (DONE)
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
                }
            }else if(/^.+\s200$/.test(data[i]["CRSE NO."])){
                if(!sp_thesis) {
                    elective_count = config.elective[program].Thesis;
                    sp_thesis = true
                }
            }else if(/^.+\s190$/.test(data[i]["CRSE NO."])){
                if(!sp_thesis) {
                    elective_count = config.elective[program].SP;
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
    
    if(elective_count > taken_elective_count){
        notes.push("Insufficient number of elective courses")
        console.log("Elective left: " + elective_count)
    }

    if(sp_thesis != true){
        notes.push("No SP/Thesis")
    }

    if(notes.length){   //notes is not empty
        return {"success": false, "notes": notes}
    }

    return {"success": true, "error": "None"}
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
        if (err) {
            console.log(err)
        };

        console.log("Successfully added student");
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


function weightIsValid(data,program,ispdf){

    let initSum = 0;
    let checkSum = 0;
    let initUnits = 0;
    let units = 0;
    let initGWA = 0;
    let gwa = 0;
    let qualified_for_honors = true;
    let warnings = [];
    let max_unit_count = config.max_units[program].Thesis;

    for(let i = 0; i<data.length; i++){
        
        if (data[i]["CRSE NO."] && data[i].Grade && (data[i].Weight === 0 || data[i].Weight) && data[i].Cumulative || (data[i]["CRSE NO."] && data[i].Term) ){

            // Check if course is of 200 series (thesis)
            if(/.+200$/.test(data[i]["CRSE NO."])){
                if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                    continue;
                }else if(!isNaN(data[i].Grade)){
                    checkSum += (data[i].Grade*6);
                    units += 6;
                }
               
            }

            // Check if course is of 190 series (special problem)
            else if (/.+190$/.test(data[i]["CRSE NO."])){
                max_unit_count = config.max_units[program].SP;
                if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                    continue;
                }
                else if(!isNaN(data[i].Grade)){
                    checkSum += (data[i].Grade*3);
                    units += 3;
                }
            }

            // Check if course is a seminar
            else if (/.+199$/.test(data[i]["CRSE NO."])){
                units += 1;
                continue;
                
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
            if(ispdf){
                console.log(data[i-1])
                if(data[i-1].__EMPTY_2 != undefined){  //pdf
                    console.log(data[i-1].__EMPTY_2)
                    if(data[i-1].__EMPTY_3){
                        initSum = data[i-1].__EMPTY_3;
                        initUnits = data[i-1].__EMPTY_2;
                        initGWA = parseFloat(data[i].Grade).toFixed(4);
                    }else{
                        initSum = data[i-1].__EMPTY_2;
                        initUnits = data[i-1].__EMPTY_1;
                        initGWA = parseFloat(data[i].Grade).toFixed(4);
                    }
                }
            }else{
                initSum = data[i].Cumulative;
                initUnits = data[i].Grade;
                initGWA = parseFloat(data[i+1].Grade).toFixed(4);
            }            
            break;
        }
        //console.log("Checksum is now " + checkSum)
    }
    console.log(`initGWA: ${initGWA}`)
    console.log(`checkSum: ${checkSum} initSum: ${initSum}`)
    gwa = (checkSum/units).toFixed(4);

    if(units < max_unit_count){
        warnings.push("Less than required number of units")
    }else{
        console.log("Required units reached")
    }

    if(gwa > 1.75) {
        console.log('GWA did not reach atlast 1.75');
        qualified_for_honors = false;
    }

    if (checkSum === initSum && units === initUnits && gwa === initGWA) {

        return {'success': true, 'gwa':gwa, 'units':units, 'qualified':qualified_for_honors, 'warning': warnings};
    }

    
    warnings.push('Mismatch with Cumulative Weight, Total Units, or GWA')
    return {'success': true, 'gwa': initGWA , 'units':units, 'qualified':qualified_for_honors, 'warning': warnings};

}

function checkloadforEdit(data, count, config, term_count, notes){
    let recorded = 0;
    for (let i = 0; i < data.length; i++){
        if (data[i].Term === data[count].Term) {
            if(/^.+\s200$/.test(data[i].Course_Code) && isNaN(parseFloat(data[i].Units))){
                recorded += 6;
            }
            else if (/^.+\s190$/.test(data[i].Course_Code) && isNaN(parseFloat(data[i].Units))){
                recorded += 3;
            }
            else{
                recorded += parseFloat(data[i].Units);
            }
        }
    }
    
    if(recorded<config[term_count]){
        notes.push("Underload during " + data[count].Term)
    }else if(recorded == config[term_count]){
        //console.log(recorded, "Regular Load");
    }else{
        notes.push("Overload during " + data[count].Term)
    }

}

function addEditedTakenCourses(data, studno){
    let count = 1;
    
    for(let i=0; i<data.length; i++){
        //console.log("Adding a course")
        if(['LOA', 'AWOL'].includes(data[i].Course_Code)){
            if(data[i].Course_Code === 'LOA'){
                addCourse(count, studno, 'LOA', null, null, null, null, data[i].Term);
                count++;
            }else{
                addCourse(count, studno, 'AWOL', null, null, null, null, data[i].Term);
                count++;
            }
            
        }else{
            addCourse(count, studno, data[i].Course_Code, null, data[i].Grade, data[i].Units, data[i].Weight, data[i].Term);
            count++;
        }
    }
    console.log("Updated student record for student", studno);
    //console.log("Count is " + count);
}

function processEdit(edited_data){
    
    let student_id = edited_data.studentID;
    let data = edited_data.courses;
    
    let progquery = database.query('SELECT Program FROM students WHERE ID = ?',[student_id], (err, result) => {
        if (err) throw err;
        
        let program = result[0].Program;
        let errors = [];
        let warnings = [];

        let checkSum = 0;
        let units = 0;
        let gwa = 0;

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
        let qualified_for_honors = 1;

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
                    else if(!isNaN(parseFloat(data[i].Grade))){
                        checkSum += (parseFloat(data[i].Grade)*6);
                        units += 6;
                    }

                }else if(/^.+\s190$/.test(data[i].Course_Code)){
                    if(!sp_thesis) {
                        elective_count = config.elective[program].SP;
                        sp_thesis = true
                        sp_flag = true
                        max_term_count = config.units[program].SP.length
                    }

                    if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                        continue;
                    }
                    else if(!isNaN(parseFloat(data[i].Grade))){
                        checkSum += (parseFloat(data[i].Grade)*3);
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
                        warnings.push("Taken LOA during " + data[i].Term)
                        continue
                    }
                    else if(data[i].Course_Code === 'AWOL'){
                        qualified_for_honors = 0;
                        warnings.push("AWOL during " + data[i].Term)
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
                        qualified_for_honors = 0;
                        warnings.push('Student has a grade of INC or DFG for course '+ data[i].Course_Code)
                        continue
                    }
                    
                    else if(data[i].Grade === 'DRP'){
                        warnings.push('Student has a grade of DRP for course '+ data[i].Course_Code)
                        continue
                    }
                    if (!isNaN(parseFloat(data[i].Grade)) && !isNaN(parseFloat(data[i].Units))){
                        if(parseFloat(data[i].Grade)*parseFloat(data[i].Units) === data[i].Weight){     // if the calculation is correct
                            checkSum += data[i].Weight;
                            units += parseFloat(data[i].Units);
                        }else{                                                  // if not
                            checkSum += (parseFloat(data[i].Grade)*parseFloat(data[i].Units));
                            units += parseFloat(data[i].Units);
                        }
                    }

                }

                //Check for underloading and overloading
                if(term_count < max_term_count){
                    if(i === (data.length-1) || !(data[i].Term === data[i+1].Term)){ //load exists
                        if(!sp_flag){
                            checkloadforEdit(data, i, config.units[program].Thesis, term_count, warnings)
                            term_count++;
                        }else{
                            checkloadforEdit(data, i, config.units[program].SP, term_count, warnings)
                            term_count++;
                        }
                    }
                }else{
                    warnings.push("Took more terms than prescribed during course" + data[i].Course_Code)
                }

        }
        
        if (units > 0){
            gwa = checkSum / units;
        }

        if (gwa > 1.75 || gwa === 0){
            qualified_for_honors = 0;
        }

        if(hk11_count != 0 || hk12_count != 0){
            warnings.push("Incomplete number of HK courses")
        }
        if(nstp1_count != 0 || nstp2_count != 0){
            warnings.push("Incomplete number of NSTP courses")
        }

        if(required_ge.length < 6){
            warnings.push("Incomplete number of required GE courses")
        }
        
        if(elective_count > taken_elective_count){
            warnings.push("Insufficient number of elective courses")
            console.log("Elective count remaining is: " + elective_count)
        }

        if(sp_thesis != true){
            warnings.push("No SP/Thesis")
        }

        let warnings_msg = 'Notes: '
        if (warnings.length){
            for (let count = 0; count < warnings.length; count++){
                if (count === (warnings.length)-1){
                    warnings_msg += warnings[count];
                }
                else{
                    warnings_msg += warnings[count] + ", ";
                }
            }
        } 

        let updateStudent = 'UPDATE students SET GWA = ?, Qualified = ?, Warnings = ? WHERE ID = ?';

        let studentquery = database.query(updateStudent, [gwa, qualified_for_honors, warnings_msg, student_id], (err, result) => {
            if (err) throw err;
        });

        // let removeStudent = 'DELETE FROM students WHERE ID = ?';
        let removeRecord = 'DELETE FROM taken_courses WHERE Student_ID = ?';

        let query = database.query(removeRecord , [student_id], (err, result) => {
            if (err) throw err;
            
            addEditedTakenCourses(data, student_id);
        
        });
        
    });
}



module.exports={readData, checkload,processExcel, addStudent, weightIsValid, addTakenCourses, processEdit}