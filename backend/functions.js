// Add functions here to modularize source code better

var XLSX = require("xlsx");



exports.processExcel = (filename) => {
    var wb = XLSX.readFile("files/" + filename);

    var ws = wb.Sheets["Sheet1"];

    var range = XLSX.utils.decode_range(ws['!ref']);

    range.s.r = 2;
    range.e.r = range.e.r - 4;
    ws['!ref'] = XLSX.utils.encode_range(range);

    var data = XLSX.utils.sheet_to_json(ws);

    return data;
}

function verifyname(fname,lname){
    if(/^([A-Z\s])+$/.test(lname) && /^([A-Z\s])+$/.test(fname)){
        console.log('Name: '+ lname+', '+fname);
    }else{
        console.log(lname+', '+fname+' is not a valid name');   
    }
}

function verifystudno(studno){
    if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
        console.log('Student number: '+studno);
    }else{
        console.log('Invalid student number');
    }
}

function verifycourse(course){
    var coursecodes = ['BSCS','BACA'];
    if(coursecodes.includes(course)){
        console.log('Course: '+course);
    }else{
        console.log(course+ ' is not a valid course');
    }
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
module.exports={verifyname,verifycourse,verifyunits,checkload}