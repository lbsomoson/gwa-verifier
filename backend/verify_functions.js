var XLSX = require("xlsx");
var config = require('./config.json');

function verifyname(filename, sheetName){
    // Returns name if both first and last name are valid, returns an error if not
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true});
    var ws = wb.Sheets[sheetName];
    
    // Obtain name from expected location in sheet
    try{
        var fname = ws['B1'].v;
        var lname = ws['A1'].v;
    }catch{
        return {"error": "Name is not valid"} 
    }

    // Regex for valid name
    if(/^([a-zA-Z])+$/.test(lname) && /^([a-zA-Z])+$/.test(fname) && (fname != undefined && lname !=undefined)){
        return {"fname": fname, "lname": lname}
    }else{
        return {"error": "Name is not valid"}   
    }

}

function verifystudno(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true}) ;
    var ws = wb.Sheets[sheetName];

    // Obtain student number from expected location in sheet
    try{
        var studno = String(ws['A2'].v);

        // Regex for valid student number
        if(!/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
            // If unsuccessful, check another expected location for student number and repeat process
            studno = String(ws['A3'].v);
            if(!/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
                return {"error": "Invalid Student Number"};
            }
        }
    }catch{
        return {"error": "Invalid Student Number or Degree Program"};
    }

    
    // Returns student number in the form of a string
    return studno
}

function verifycourse(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true});
    var ws = wb.Sheets[sheetName];

    // Obtain course from expected location in sheet
    try{
        var course = String(ws['A3'].v);

        // Check if course is included in config
        if(!config.programs.includes(course)){
            // If unsuccessful, check another expected location for course and repeat process
            course = String(ws['A2'].v);
            if(!config.programs.includes(course)){
                return {"error": "Invalid Degree Program"};
            }
        }
    }catch{
        return {"error": "Invalid Student Number or Degree Program"};
    }
    
    // Returns course in the form of a string
    return course;
}

function verifyHeaders(filename, sheetName){
    // Verifies correct format for headers
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

    console.log(data)

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
            // If headers mismatch, prints expected header with obtained header and returns an error
            return {'success': false, 'error':'Wrong format for headers'}
        }
    }

    // Returns true if there are no errors
    return {'success': true}
}

function verifyunits(data){
    // Compares calculated total units in term with total units recorded in sheet
    let calced = 0;
    for(let i = 0; i<data.length;i++){
        if(!isNaN(data[i]["Grade"])){
            calced += data[i]["Units"];
            if(!isNaN(data[i]["Term"])){
                recorded = data[i]["Term"];
                calced = 0;
            }
        }
    }
}

function verifyErrors(name, studno, program, headers, errors) {
    // If errors exist in following parameters, return false
    // else, return true
    if(name.error){
        errors.push(name.error)
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

    if(errors.length){
        return {"success": false}
    }

    return {"success": true, "firstName": name.fname, "lastName": name.lname}
    
}

module.exports={verifyunits, verifyname, verifycourse, verifystudno, verifyHeaders, verifyErrors}