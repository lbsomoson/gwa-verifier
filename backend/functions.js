var XLSX = require("xlsx");
var config = require('./config.json');
const { checkIfLoggedIn } = require("./auth-controller");
const myModule = require('./index');
const { response } = require("express");
const {database} = myModule.database;

function checkTermValidity(term){
    // Check if term is in valid format
    if(/^l{1,2}\/\d{2}\/\d{2}$/.test(term)){
        const termElements = term.split("/");
        if(parseInt(termElements[1])+1 != parseInt(termElements[2])){
            return {"success": false, "notes": "Academic Year of Term is incorrectly formatted for " + term}
        }
    }else if(!/^midyear 20\d{2}$/.test(term)){
        return {"success": false, "notes": "Error in term format for term " + term}
        
    }

    return {"success": true}
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

    let notes = [];
    let thesis_sp_pass = false;

    let accepted_grades = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5, 'INC', 'DRP', 'DFG', 'S', 'U', 'P'];
    let Thesis_SP_grades = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4, 5, 'S', 'U'];
    let Thesis_SP_grades_pass = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 4];
    let string_grades = ['INC', 'DRP', 'DFG', 'S', 'U', 'P']


    for(let i=0; i<data.length; i++){
        if((data[i]["CRSE NO."] && data[i].Grade && (data[i].Units === 0 || data[i].Units) && (data[i].Weight === 0 || data[i].Weight) && (data[i].Cumulative === 0 || data[i].Cumulative)) || (data[i]["CRSE NO."] && data[i].Term) ){
            
            // Check the type of the courses
            if(typeof data[i]["CRSE NO."] !== "string"){
                return {'error': `${data[i]["CRSE NO."]} is not of the proper format`}
            }

            // Check if the Grade is accepted or not
            if(typeof data[i].Grade === "string" && !string_grades.includes(data[i].Grade)){
                // try parsing to see if it will result in a number
                if(isNaN(parseFloat(data[i].Grade)) || !accepted_grades.includes(parseFloat(data[i].Grade))){
                    return {'error': `A grade of ${data[i].Grade} is not accepted`}
                }else{
                    data[i].Grade = parseFloat(data[i].Grade)
                }
                
            }


            // Check if the number of units is accepted
            // Check first if the course is LOA/AWOL since these are special cases that only have CRSE NO.
            if(!['LOA', 'AWOL'].includes(data[i]["CRSE NO."])){
                if(!/^\d$/.test(data[i].Units)){
                    if(!/^\d\(\d\)$/.test(data[i].Units)){
                        return {'error': `${data[i].Units} is not an acceptable number of units`}
                    }
                }else{
                    if(typeof data[i].Units === "string"){
                        data[i].Units = parseInt(data[i].Units)
                    }
                }
            }
            
            
            if(/^.+\s200$/.test(data[i]["CRSE NO."])){
                if(!thesis_sp_pass){
                    if(!Thesis_SP_grades.includes(data[i].Grade)){
                        return {'error': `A grade of ${data[i].Grade} is not accepted for Thesis`}
                    }

                    if(Thesis_SP_grades_pass.includes(data[i].Grade)){
                        thesis_sp_pass = true
                    }
                }else{
                    return {'error': `Another Thesis/SP course detected after passing`}
                }
                
                
                
            }
                
            if(/^.+\s190$/.test(data[i]["CRSE NO."])){
                if(!thesis_sp_pass){
                    if(!Thesis_SP_grades.includes(data[i].Grade)){
                        return {'error': `A grade of ${data[i].Grade} is not accepted for SP`}
                    }

                    if(Thesis_SP_grades_pass.includes(data[i].Grade)){
                        thesis_sp_pass = true
                    }
                }else{
                    return {'error': `Another Thesis/SP course detected after passing`}
                }
                
            }

            if(/^.+\s199$/.test(data[i]["CRSE NO."])){
                if(!['S', 'U'].includes(data[i].Grade)){
                    return {'error': `A grade of ${data[i].Grade} is not accepted for Seminars`}
                }
            }

            // Check for the special case of LOA/AWOL
            if(['LOA', 'AWOL'].includes(data[i]["CRSE NO."])){
                if(data[i].Grade || data[i].Units || data[i].Weight || data[i].Cumulative){
                    return {'error': 'LOA/AWOL must not have a Grade/Units/Weight/Cumulative'}
                }
            }

            if(data[i]["Term"]){ // If load exists, then term must also exist
                if(isNaN(data[i]["Term"])){ 
                    return {'error': 'A Semester Load is not a Number'}
                }
                if(data[i].__EMPTY){
                    let termValidity = checkTermValidity(data[i].__EMPTY)
                    if(termValidity.success){
                        semesterCount++;
                    }else return{'error': termValidity.notes}
                    

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

    // Check if Units/CheckSum/GWA are all found
    let passedCheck = true;

    for(let i=0; i<2; i++){
        index = index+i;
        if(isPdf){
            if(!units_and_checksum_check){
                index--;
                if(data[index].__EMPTY_2){
                    if(data[index].__EMPTY_3){
                        if(isNaN(data[index].__EMPTY_2) || isNaN(data[index].__EMPTY_3)){

                            passedCheck = false;
                            notes.push('Total Units or Cumulative Weight is not a number');
                            //return {'error': 'Total Units or Cumulative Weight is not a number'}
                        }else if(!isNaN(data[index].__EMPTY_2) && !isNaN(data[index].__EMPTY_3)){
                            data[index].__EMPTY_2 = parseFloat(data[index].__EMPTY_2)
                            data[index].__EMPTY_3 = parseFloat(data[index].__EMPTY_3)
                        }
                        
                    }else{
                        if(isNaN(data[index].__EMPTY_1) || isNaN(data[index].__EMPTY_2)){
                            passedCheck = false;
                            notes.push('Total Units or Cumulative Weight is not a number');
                            //return {'error': 'Total Units or Cumulative Weight is not a number'}
                        }else if(!isNaN(data[index].__EMPTY_1) && !isNaN(data[index].__EMPTY_2)){
                            data[index].__EMPTY_1 = parseFloat(data[index].__EMPTY_1)
                            data[index].__EMPTY_2 = parseFloat(data[index].__EMPTY_2)
                        } 
                        
                    }
                }else{
                    passedCheck = false;
                    notes.push('Total Units or Cumulative Weight is not found');
                    //return {'error': 'Total Units or Cumulative Weight is not found'}
                }

                units_and_checksum_check = true;

            }
            else if (!gwa_check){
                if(data[index]["CRSE NO."] && data[index].Grade){ 
                    if((typeof data[index]["CRSE NO."] != 'string' || data[index]["CRSE NO."].trim() !== "GWA") || isNaN(data[index].Grade)){
                        passedCheck = false;
                        notes.push('Unexpected format for GWA');
                        //return {'error': 'Unexpected format for GWA'}
                    }
                    
                }else{
                    passedCheck = false;
                    notes.push('Unexpected format for GWA');
                    //return {'error': 'GWA not found'}
                }
                
                gwa_check = true;
            }


        }else{
            if(!units_and_checksum_check){
                if(data[index].Grade && data[index].Cumulative){ 
                    if(isNaN(data[index].Grade) || isNaN(data[index].Cumulative)){
                        passedCheck = false;
                        notes.push('Total Units or Cumulative Weight is not a number');
                        //return {'error': 'Total Units or Cumulative Weight is not a number'}

                    }else{
                        units_and_checksum_check = true;
                    }
                }else{

                    passedCheck = false;
                    notes.push('Total Units or Cumulative Weight is not found');
                    //return {'error': 'Total Units or Cumulative Weight is not found'}

                }
            }
            else if (!gwa_check){
                if(data[index]["CRSE NO."] && data[index].Grade){ 
                    if((typeof data[index]["CRSE NO."] != 'string' || data[index]["CRSE NO."].trim() !== "GWA") || isNaN(data[index].Grade)){

                        passedCheck = false;
                        notes.push('Unexpected format for GWA');
                        //return {'error': 'Unexpected format for GWA'}

                    }else{
                        gwa_check = true;
                    }
                }else{

                    passedCheck = false;
                    notes.push('GWA not found');
                    //return {'error': 'GWA not found'}

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


    return {"data": data, "req_GWA": passedCheck, "notes": notes};
}


function checkload(data, count, config, term_count, notes){
        const recorded = data[count]["Term"];
        if(recorded<config[term_count]){
            console.log(`Expected ${config[term_count]} but got ${recorded} during ${data[count].__EMPTY}`)
            notes.push("Underload during " + data[count].__EMPTY)
        }else if(recorded == config[term_count]){
            console.log(`Expected ${config[term_count]} and got ${recorded} during ${data[count].__EMPTY}`)
        }else{
            console.log(`Expected ${config[term_count]} but got ${recorded} during ${data[count].__EMPTY}`)
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
    let program = edited_data.studentProgram;

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
            if(config.course[program].includes(data[i].Course_Code) && data[i].Grade != 5 && data[i].Grade != 4){   //Check if course taken is in the program
                if(!courses_taken.includes(data[i].Course_Code)){
                    courses_taken.push(data[i].Course_Code);
                }
            }else if(data[i].Course_Code === 'HK 11' && data[i].Grade != 5){                   //If course not in the program, check if it's a HK subject
                hk11_count--;
            }else if((data[i].Course_Code === 'HK 12' || data[i].Course_Code === 'HK 13') && data[i].Grade != 5 && data[i].Grade != 4){
                hk12_count--;
            }else if(data[i].Course_Code === 'NSTP 1' && data[i].Grade != 5 && data[i].Grade != 4){
                nstp1_count--;
            }else if(data[i].Course_Code === 'NSTP 2' && data[i].Grade != 5 && data[i].Grade != 4){
                nstp2_count--;
            }
            else if(config.GE.hasOwnProperty(data[i].Course_Code) && data[i].Grade != 5 && data[i].Grade != 4){
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
    let removeRecord = 'DELETE FROM taken_courses WHERE Student_ID = ?';

    database.query(updateStudent, [gwa, qualified_for_honors, warnings_msg, student_id], (err, result) => {
        if (err) throw err;

        database.query(removeRecord , [student_id], (err, result) => {
            if (err) throw err;
            
            addEditedTakenCourses(data, student_id);
            
        });
    });

    return true;

}

function processFile(program, data, ispdf, GWA_requirement_check){

    let notes = [];

    let courses_taken = [];
    let required_ge = [];
    let ge_taken = [];

    let gwa = 0;
    let units = 0;
    let checkSum = 0;

    let initGWA = 0;
    let initSum = 0;
    let initUnits = 0;
    
    let taken_elective_count = 0;
    let elective_count = 0;
    let term_count = 0;

    let nstp1_count = 1;
    let nstp2_count = 1;
    let hk11_count = 1;

    let hk12_count = 3;
    
    let sp_flag = false;
    let sp_thesis = false;
    let completed_Thesis_SP = false;

    let qualified_for_honors = true;

    let GWA_reqs_check = GWA_requirement_check;
    let max_unit_count = config.max_units[program].Thesis;
    let max_term_count = config.units[program].Thesis.length;
    

    for(let i=0; i<data.length; i++){
        let skip_check = false;

        if((data[i]["CRSE NO."] && data[i].Grade && (data[i].Units === 0 || data[i].Units) && (data[i].Weight === 0 || data[i].Weight) && (data[i].Cumulative === 0 || data[i].Cumulative)) || (data[i]["CRSE NO."] && data[i].Term)){
            
            // Before checking if a course is to be counted as "taken"
            // check if their grade is not failing, incomplete, deferred or dropped

            // The exemptions are Thesis and SP since we need to check first if they are "attempted"
            // If they are atleast attempted, then elective count requirements will be set and 
            // it will not be noted that No SP/Thesis are taken

            if(/^.+\s200$/.test(data[i]["CRSE NO."])){
                if(!sp_thesis) {
                    elective_count = config.elective[program].Thesis;
                    sp_thesis = true
                }

                if(!isNaN(data[i].Grade)){
                    if(data[i].Grade !== 5){
                        if(completed_Thesis_SP){
                            notes.push('Thesis is already completed')
                        }
                        completed_Thesis_SP = true;
                    }

                    checkSum += (data[i].Grade*6);
                    units += 6;
                }

                
            }else if(/^.+\s190$/.test(data[i]["CRSE NO."])){
                if(!sp_thesis) {
                    sp_flag = true
                    sp_thesis = true
                    elective_count = config.elective[program].SP;
                    max_term_count = config.units[program].SP.length
                }

                max_unit_count = config.max_units[program].SP;
                if(!isNaN(data[i].Grade)){
                    if(data[i].Grade !== 5){
                        completed_Thesis_SP = true;
                    }
                    checkSum += (data[i].Grade*3);
                    units += 3;
                }
                
            }else if (/.+199$/.test(data[i]["CRSE NO."])){
                if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                    units += 1;
                }
            }else if (['LOA'].includes(data[i]["CRSE NO."])){
                continue
            }else if(['AWOL'].includes(data[i]["CRSE NO."])){
                qualified_for_honors = false;
                continue;
            }else if(data[i].Grade === 5){
                checkSum += (data[i].Grade*data[i].Units)
                units += data[i].Units
                skip_check = true
                
            }else if(['INC', 'DFG'].includes(data[i].Grade)){
                qualified_for_honors = false;
                notes.push('Student has a grade of INC or DFG for course '+ data[i]["CRSE NO."])
                skip_check = true
            }else if(data[i].Grade === 'DRP'){
                notes.push('Student has a grade of DRP for course '+ data[i]["CRSE NO."])
                skip_check = true
            }
            else if(data[i].Grade === 'P'){
                units += data[i].Units
            }else{
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
                notes.push("Took more terms than prescribed.")
            }

            // Skip the checking if grade is failing, INC, DFG, DRP since the courses
            // should not be written off as 'taken'

            if(skip_check){
                continue
            }
            
            // If this point is reached, then the grade 
            // is either numerical, but not failing, or 'P'
            
            // Since these courses are 'passed', then we can count them as 'taken'
            
            if(config.course[program].includes(data[i]["CRSE NO."])){   //Check if course taken is in the program
                if(!courses_taken.includes(data[i]["CRSE NO."])){
                    courses_taken.push(data[i]["CRSE NO."]);
                }
            }if(data[i]["CRSE NO."] === 'HK 11'){                   //If course not in the program, check if it's a HK subject
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

            

            //console.log(`checkSum is currently ${checkSum} and initSum is ${data[i].Cumulative} at course ${data[i]["CRSE NO."]}`)
            
        }
        
        else {
            if(GWA_reqs_check){
                if(ispdf){
                    if(data[i-1].__EMPTY_2 != undefined){  //pdf
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
                
        }

    }

    gwa = (checkSum/units).toFixed(4);

    if(gwa > 1.75) qualified_for_honors = false;

    if(units < max_unit_count) notes.push("Less than required number of units")

    if(elective_count > taken_elective_count) notes.push("Insufficient number of elective courses")

    if(sp_thesis != true) {
        qualified_for_honors = false
        notes.push("No SP/Thesis")
    }

    if(required_ge.length < 6) {
        qualified_for_honors = false;
        notes.push("Incomplete number of required GE courses")
    }

    if(hk11_count != 0 || hk12_count != 0) {
        qualified_for_honors = false;
        notes.push("Incomplete number of HK courses")
    }
    
    if(nstp1_count != 0 || nstp2_count != 0) {
        qualified_for_honors = false;
        notes.push("Incomplete number of NSTP courses")
    }

    if(sp_thesis && !completed_Thesis_SP){
        qualified_for_honors = false;
        notes.push("Thesis or SP was not completed")
    }

    if(GWA_reqs_check){
        if (!(checkSum === initSum && units === initUnits && gwa === initGWA) && units >= max_unit_count){
            console.log(`Expected checkSum to be ${checkSum} got ${initSum}`)
            notes.push('Mismatch with Cumulative Weight, Total Units, or GWA')
            qualified_for_honors = false;
        }
    }

    return {'success': true, 'gwa': gwa , 'units':units, 'qualified':qualified_for_honors, 'notes': notes};
}



module.exports={readData, checkload, addStudent, addTakenCourses, processEdit, processFile}