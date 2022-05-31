var XLSX = require("xlsx");
var config = require('./config.json');

function verifyname(filename, sheetName){
    //returns name if both first and last name are valid, returns an error if not
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true});
    var ws = wb.Sheets[sheetName];
    //obtain name from expected location in sheet
    var fname = ws['B1'].v;
    var lname = ws['A1'].v;

    console.log(fname)
    console.log(lname)

    //regex for valid name
    if(/^([a-zA-Z])+$/.test(lname) && /^([a-zA-Z])+$/.test(fname) && (fname != undefined && lname !=undefined)){
        return {"fname": fname, "lname": lname}
    }else{
        return {"error": "Name is not valid"}   
    }

}

function verifystudno(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true}) ;
    var ws = wb.Sheets[sheetName];
    //obtain student number from expected location in sheet
    var studno = String(ws['A2'].v);
    console.log(studno);
    //regex for valid student number
    if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
        //console.log('Student number: '+studno);
    }else{
        //if unsuccessful, check another expected location for student number and repeat process
        studno = String(ws['A3'].v);
        if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
            //console.log('Student number: '+studno);
        }else{
            //console.log('Invalid student number');
            return {"error": "Invalid student number"};
        }
        
    }
    //returns student number in the form of a string
    return studno
}

function verifycourse(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true});
    var ws = wb.Sheets[sheetName];
    //obtain course from expected location in sheet
    var course = String(ws['A3'].v);
    console.log(course);
    //check if course is included in config
    if(config.programs.includes(course)){
        //console.log('Course: '+course);
    }else{
        //if unsuccessful, check another expected location for course and repeat process
        course = String(ws['A2'].v);
        if(config.programs.includes(course)){
            //console.log('Course: '+course);
        }else{
            //console.log(course+ ' is not a valid course');
            return {"error": "Invalid course"};
        }
        
    }
    //returns course in the form of a string
    return course;
}

function verifyHeaders(filename, sheetName){
    //verifies correct format for headers
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
            //if headers mismatch, prints expected header with obtained header and returns an error
            console.log(`Expected ${headers[i]} but got ${data[0][i]}`)
            return {'success': false, 'error':'Wrong format for headers'}
        }
    }

    //returns true if there are no errors
    return {'success': true}
}

function verifyunits(data){
    //compares calculated total units in term with total units recorded in sheet
    //prints result in console
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

function verifyErrors(name, studno, program, headers, errors) {
    //if errors exist in following parameters, return false
    //else, return true
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