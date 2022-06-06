var XLSX = require("xlsx");
var config = require('./config.json');
const myModule = require('./index');
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

// This function reads the data starting from the first course up until the last one.
// It also tries to retrieve the number of units, cumulative weight, and GWA 
// that is noted on the bottom of the file

function readData(filename, sheetName, isPdf){
    var wb = XLSX.readFile("files/" + filename, {raw: true});
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
                        if(/^-\d\d$/.test(data[i].Units)){
                            if(!/^.+\s200$/.test(data[i]["CRSE NO."]) && !/^.+\s190$/.test(data[i]["CRSE NO."])){
                                return {'error': `${data[i].Units} is not an acceptable number of units for ${data[i]["CRSE NO."]}`}
                            }
                        }
                        
                    }
                }else{
                    if(typeof data[i].Units === "string"){
                        data[i].Units = parseInt(data[i].Units)
                    }
                }
            }
            
            // These are special cases 
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
                    console.log(`During ${data[i]["CRSE NO."]}`)
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
    if(data.length-index >= 2){
        for(let i=0; i<2; i++){
            index = index+i;
            // Performs different actions to retrieve recorded total units, cumulative weights, and gwa depending on if file is a pdf or not
            if(isPdf){
                if(!units_and_checksum_check){
                    index--;
                    if(data[index].__EMPTY_2){
                        if(data[index].__EMPTY_3){
                            if(isNaN(data[index].__EMPTY_2) || isNaN(data[index].__EMPTY_3)){
    
                                passedCheck = false;
                                notes.push('Total Units or Cumulative Weight is not a number');
                            }else if(!isNaN(data[index].__EMPTY_2) && !isNaN(data[index].__EMPTY_3)){
                                data[index].__EMPTY_2 = parseFloat(data[index].__EMPTY_2)
                                data[index].__EMPTY_3 = parseFloat(data[index].__EMPTY_3)
                            }
                            
                        }else{
                            if(isNaN(data[index].__EMPTY_1) || isNaN(data[index].__EMPTY_2)){
                                passedCheck = false;
                                notes.push('Total Units or Cumulative Weight is not a number');
                            }else if(!isNaN(data[index].__EMPTY_1) && !isNaN(data[index].__EMPTY_2)){
                                data[index].__EMPTY_1 = parseFloat(data[index].__EMPTY_1)
                                data[index].__EMPTY_2 = parseFloat(data[index].__EMPTY_2)
                            } 
                            
                        }
                    }else{
                        passedCheck = false;
                        notes.push('Total Units or Cumulative Weight is not found');

                    }
    
                    units_and_checksum_check = true;
    
                }
                else if (!gwa_check){
                    if(data[index]["CRSE NO."] && data[index].Grade){ 
                        if((typeof data[index]["CRSE NO."] != 'string' || data[index]["CRSE NO."].trim() !== "GWA") || isNaN(data[index].Grade)){
                            passedCheck = false;
                            notes.push('Unexpected format for GWA');
                        }
                        
                    }else{
                        passedCheck = false;
                        notes.push('Unexpected format for GWA');
                    }
                    
                    gwa_check = true;
                }
    
    
            }else{
                if(!units_and_checksum_check){
                    console.log(data[index].Grade)
                    if(data[index].Grade != undefined && data[index].Cumulative != undefined){ 
                        if(isNaN(data[index].Grade) || isNaN(data[index].Cumulative)){
                            passedCheck = false;
                            notes.push('Total Units or Cumulative Weight is not a number');
    
                        }else{
                            units_and_checksum_check = true;
                        }
                    }else{
                        passedCheck = false;
                        notes.push('Total Units or Cumulative Weight is not found');
                    }
                }
                else if (!gwa_check){
                    if(data[index]["CRSE NO."] && data[index].Grade){ 
                        if((typeof data[index]["CRSE NO."] != 'string' || data[index]["CRSE NO."].trim() !== "GWA") || isNaN(data[index].Grade)){
                            passedCheck = false;
                            notes.push('Unexpected format for GWA');
                        }
                    }else{
                        passedCheck = false;
                        notes.push('GWA not found');
                    }
                    gwa_check = true
                }
        
            }
        }
    }else{
        passedCheck = false
        notes.push("Missing Cumulative Weight/GWA/Units")
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

        // Compares load taken in term with expected load found in config
        // Check for Underload and Overload
        if(recorded<config[term_count]){
            notes.push("Underload during " + data[count].__EMPTY) 
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

// Function that checks if student is underloaded or overloaded for a semester

function checkloadforEdit(data, count, config, term_count, notes){
    let recorded = 0;
    // loop collects the recorded units for the semester
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
    
    // checks if the student has underloaded or overloaded in a semester
    if(recorded<config[term_count]){
        notes.push("Underload during " + data[count].Term)
    }else if(recorded > config[term_count]){
        notes.push("Overload during " + data[count].Term)
    }
}

// Function for the edit feature that adds the course for the student's record
function addEditedTakenCourses(data, studno){
    let count = 1;
    
    for(let i=0; i<data.length; i++){
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
}

// Function that processes the data from the edit feature to collect 
// and compute data to determine student's elgibility for latin honors

function processEdit(edited_data){
    // initial data received from the frontend side
    let student_id = edited_data.studentID;
    let data = edited_data.courses;
    let program = edited_data.studentProgram;

    /*
    | setup of necessary variables to collect important record-related information
    | as well as determine eligibility of student for latin honors
    */ 
    let warnings = [];

    let courses_taken = [];
    let required_ge = [];
    let ge_taken = [];
    
    let gwa = 0;
    let units = 0;
    let checkSum = 0;

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

    let qualified_for_honors = 1;
    let max_unit_count = config.max_units[program].Thesis;
    let max_term_count = config.units[program].Thesis.length;
    let term =  config.units[program].Thesis;
    let term_count_err = false;

    if(config.units[program].Thesis.length === 0){
        max_term_count = config.units[program].SP.length
        term = config.units[program].SP
    }

    // loops through each taken course from the given data 
    for(let i=0; i<data.length; i++){
        let skip_check = false;

        // checks if student has taken and passed Thesis course 
        if(/^.+\s200$/.test(data[i].Course_Code)){
            if(!sp_thesis) {
                elective_count = config.elective[program].Thesis;
                sp_thesis = true;
            }

            if(!isNaN(parseFloat(data[i].Grade))){
                if (parseFloat(data[i].Grade) !== 5.0){
                    completed_Thesis_SP = true;
                }
                checkSum += (parseFloat(data[i].Grade)*6);
                units += 6;
            }

        }
        // checks if student has taken and passed SP course 
        else if(/^.+\s190$/.test(data[i].Course_Code)){
            if(!sp_thesis){
                sp_flag = true;
                sp_thesis = true;
                elective_count = config.elective[program].SP;
                max_term_count = config.units[program].SP.length;
            }

            if(!isNaN(parseFloat(data[i].Grade))){
                if (parseFloat(data[i].Grade) !== 5.0){
                    completed_Thesis_SP = true;
                }
                checkSum += (parseFloat(data[i].Grade)*3);
                units += 3;
            }
        }
        // catches the grade of S or U to still count the course's units
        else if (/.+199$/.test(data[i].Course_Code)){
            if((data[i].Grade === 'S' || data[i].Grade === 'U')){
                units += 1;
            }
        }
        // checks if student failed the course to skip the counters for required courses 
        else if(parseFloat(data[i].Grade) === 5.0){
            checkSum += (parseFloat(data[i].Grade)*parseFloat(data[i].Units))
            units += parseFloat(data[i].Units)
            skip_check = true
        }
        // checks if student has an INC or DFG for the course
        else if(['INC', 'DFG'].includes(data[i].Grade)){
            qualified_for_honors = 0;
            warnings.push('Student has a grade of INC or DFG for course '+ data[i].Course_Code)
            skip_check = true
        }
        // checks if student has a DRP for the course
        else if(data[i].Grade === 'DRP'){
            warnings.push('Student has a grade of DRP for course '+ data[i].Course_Code)
            skip_check = true
        }
        // checks if student has a grade of P for the course
        else if(data[i].Grade === 'P'){
            units += parseFloat(data[i].Units)
        }else{
            /*
            | block of code to compute for the cumulative weight and addition of more 
            | units from courses not caught from the previous conditional arguments
            */
            if(!isNaN(parseFloat(data[i].Grade)) && !isNaN(parseFloat(data[i].Units))){
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
        if(!term_count_err){
            if(term_count < max_term_count){
                if(i === (data.length-1) || !(data[i].Term === data[i+1].Term)){
                    checkloadforEdit(data, i, term, term_count, warnings)
                    term_count++;
                }
            }else{
                warnings.push("Took more terms than prescribed during course" + data[i].Course_Code)
            }
        }

        // Skip the checking if grade is failing, INC, DFG, DRP since the courses
        // should not be written off as 'taken'
        if(skip_check){
            continue
        }
        
        // If this point is reached, then the grade 
        // is either numerical, but not failing, or 'P'
        
        // Since these courses are 'passed', then we can count them as 'taken'

        // checks if course taken is in the course curriculum
        if(config.course[program].includes(data[i].Course_Code)){
            if(!courses_taken.includes(data[i].Course_Code)){
                courses_taken.push(data[i].Course_Code);
            }
        }else if(data[i].Course_Code === 'HK 11'){
            hk11_count--;
        }else if((data[i].Course_Code === 'HK 12' || data[i].Course_Code === 'HK 13')){
            hk12_count--;
        }else if(data[i].Course_Code === 'NSTP 1'){
            nstp1_count--;
        }else if(data[i].Course_Code === 'NSTP 2'){
            nstp2_count--;
        }
        // checks if course taken is a required GE or a GE elective
        else if(config.GE.hasOwnProperty(data[i].Course_Code)){
            if(config.GE[data[i].Course_Code] === 'Required'){
                required_ge.push(data[i].Course_Code);
            }else{
                ge_taken.push(data[i].Course_Code);
            }
        }
        // checks if the student is on LOA for the semester
        else if(data[i].Course_Code === 'LOA'){
            warnings.push("Taken LOA during " + data[i].Term)
        }
        // checks if the student is on AWOL for the semester
        else if(data[i].Course_Code === 'AWOL'){
            qualified_for_honors = 0;
            warnings.push("AWOL during " + data[i].Term)
        }
        // treats the course taken as an elective
        else{
            taken_elective_count++;
        }
    }
    
    if (units > 0){
        // code computes for the student's GWA
        gwa = (checkSum / units).toFixed(4);
    }

    // checks if the student does not pass the GWA qualifications for latin honors
    if (gwa > 1.75 || gwa === 0){
        qualified_for_honors = 0;
    }

    // following lines of code checks for certain requirements for a graduating student
    if (units < max_unit_count) {
        warnings.push("Less than required number of units")
    }
    if(elective_count > taken_elective_count){
        warnings.push("Insufficient number of elective courses")
    }
    if(sp_thesis != true){
        qualified_for_honors = 0;
        warnings.push("No SP/Thesis")
    }
    if(required_ge.length < 6){
        qualified_for_honors = 0;
        warnings.push("Incomplete number of required GE courses")
    }
    if(hk11_count != 0 || hk12_count != 0){
        qualified_for_honors = 0;
        warnings.push("Incomplete number of HK courses")
    }
    if(nstp1_count != 0 || nstp2_count != 0){
        qualified_for_honors = 0;
        warnings.push("Incomplete number of NSTP courses")
    }
    if(sp_thesis && !completed_Thesis_SP){
        qualified_for_honors = 0;
        warnings.push("Thesis or SP was not completed")
    }

    // collect the compiled warnings to upload into the edit history
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

    // queries to update the student and their student record
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

// Function that does the calculation of the file

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
    let term = config.units[program].Thesis;
    let term_count_err = false;

    if(config.units[program].Thesis.length === 0){
        max_term_count = config.units[program].SP.length
        term = config.units[program].SP
    }
    

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
                console.log(config.max_units[program])
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
                notes.push("Student has taken LOA")
                continue
            }else if(['AWOL'].includes(data[i]["CRSE NO."])){
                notes.push("Student was AWOL")
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
            }
            else if(['S', 'U'].includes(data[i].Grade)){
                if(isNaN(data[i].Units)){
                    notes.push("Unrecognized course with a grade of S or U")
                }else{
                    units += data[i].Units
                }
            }
            else{
                if(data[i].Grade*data[i].Units === data[i].Weight){     // if the calculation is correct
                    checkSum += data[i].Weight;
                    units += data[i].Units;
                }else{                                                  // if not
                    checkSum += (data[i].Grade*data[i].Units);
                    units += data[i].Units;
                }
            }

            //Check for underloading and overloading
            if(!term_count_err){
                if(term_count < max_term_count){
                    if(data[i]["Term"]!=undefined){ //load exists
                        checkload(data, i, term, term_count, notes)
                        term_count++;
                    }
                }else{
                    notes.push("Took more terms than prescribed.")
                    term_count_err = true
                }
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
                notes.push("Student has taken LOA")
            }
            else if(data[i]["CRSE NO."] === 'AWOL'){
                notes.push("Student was AWOL")
            }
            else{
                taken_elective_count++;
            }

            

            //console.log(`checkSum is currently ${checkSum} and initSum is ${data[i].Cumulative} at course ${data[i]["CRSE NO."]}`)
            //console.log(`Units is currently ${units} at course ${data[i]["CRSE NO."]}`)
            
        }
        
        else {
            if(GWA_reqs_check){
                //performs different actions to retrieve recorded total units, cumulative weights, and gwa depending on if file is a pdf or not
                if(ispdf){
                    if(data[i-1].__EMPTY_2 != undefined){
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
    console.log(units)
    console.log(initUnits)
    console.log(checkSum)
    console.log(initSum)

    gwa = (checkSum/units).toFixed(4);

    if(gwa > 1.75) qualified_for_honors = false;

    if(units < max_unit_count) {
        notes.push("Less than required number of units")
    }

    if(elective_count > taken_elective_count) {
        notes.push("Insufficient number of elective courses")
    }

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
            //notes.push('Mismatch with Cumulative Weight, Total Units, or GWA')
            qualified_for_honors = false;
            if(checkSum != initSum){
                notes.push('Mismatch with Cumulative Weight')
            }
            if(units != initUnits){
                notes.push('Mismatch with Total Units')
            }
            if(gwa != initGWA){
                notes.push('Mismatch with GWA')
            }
        }
    }

    return {'success': true, 'gwa': gwa , 'units':units, 'qualified':qualified_for_honors, 'notes': notes};
}



module.exports={readData, checkload, addStudent, addTakenCourses, processEdit, processFile}