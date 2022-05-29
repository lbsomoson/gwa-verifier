var XLSX = require("xlsx");
var config = require('./config.json');

function verifyname(filename, sheetName){
    var wb = XLSX.readFile("files/" + filename, {sheetStubs: true});
    var ws = wb.Sheets[sheetName];
    var fname = ws['B1'].v.trim();
    var lname = ws['A1'].v.trim();

    console.log(fname)
    console.log(lname)

    if(/^([a-zA-Z])+$/.test(lname) && /^([a-zA-Z])+$/.test(fname) && (fname != undefined && lname !=undefined)){
        return {"fname": fname, "lname": lname}
    }else{
        return {"error": "Name is not valid"}   
    }

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
            console.log(`Expected ${headers[i]} but got ${data[0][i]}`)
            return {'success': false, 'error':'Wrong format for headers'}
        }
    }

    return {'success': true}
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

function verifyErrors(name, studno, program, headers, fname, lname, errors) {
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