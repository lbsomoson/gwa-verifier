var XLSX = require("xlsx");
const pdf2excel = require('pdf-to-excel');
var fs = require("fs");

const wb = XLSX.readFile("./honors/honors-grade.csv")
var ws = wb.Sheets["Sheet1"];

var range = XLSX.utils.decode_range(ws['!ref']);

//check if valid name
//var name = ws['A1'].v+ ' '+ws['B1'].v;
var fname = ws['B1'].v;
var lname = ws['A1'].v;

if(/^([A-Z\s])+$/.test(lname) && /^([A-Z\s])+$/.test(fname)){
    console.log('Name: '+ lname+', '+fname);
}else{
    console.log(lname+', '+fname+' is not a valid name');   
}

//check if valid student no
//var studno = ws['C1'].v;
var studno = '2019-12345'

if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
    console.log('Student number: '+studno);
}else{
    console.log('Invalid student number');
}

//check if valid course
//check with all CAS undergraduate programs?
var coursecodes = ['BSCS','BACA'];
var course = String(ws['A2'].v);
if(coursecodes.includes(course)){
    console.log('Course: '+course);
}else{
    console.log(course+ ' is not a valid course');
}


range.s.r = 2;
range.e.r = range.e.r - 4;
ws['!ref'] = XLSX.utils.encode_range(range);

var data = XLSX.utils.sheet_to_json(ws);

//console.log(data);
//convertpdf();
// gets units of term to check for underloading and overloading
//TODO use units to check underload and overload
for(let i = 0; i<data.length;i++){
    if(data[i]["Term"]==undefined){
        //ack
    }else{
        console.log("Units" ,data[i]["Term"])
    }
}
//TODO use units to check underload and overload

// checking content errors:
// -check if valid student no, name, and course
// -check if overloading/underloading
// -check if cumulative weight is correct
// -check if no of units required is reached
// -check for special cases (inc, loa, etc)


// -reject null values
// -reject grades that are not valid (valid grade values: 1-3 in steps of 0.25, 5, INC, DRP, P, etc.)

// following error checks may require a reference file?
// -check if course no. is valid
// -check if units per course is valid
// -check if appropriate thesis course was taken

fs.readdirSync("./honors").forEach(file => {
    var allowedExtensions = /(\.xlsx|\.csv|\.pdf)$/i;
    if (!allowedExtensions.exec(file)){
        console.log("invalid input");
    }else{        

    }
  });  
  
async function convertpdf(){
    let convertPromise = new Promise(function(resolve){
        resolve(pdf2excel.genXlsx('./honors/honors-grade.pdf','./honors/bar.xlsx'));
    })
    await convertPromise;
    const wb = XLSX.readFile("./honors/bar.xlsx")
    var ws = wb.Sheets["Sheet1"];

    var range = XLSX.utils.decode_range(ws['!ref']);

    range.s.r = 2;
    range.e.r = range.e.r - 4;
    ws['!ref'] = XLSX.utils.encode_range(range);

    var data = XLSX.utils.sheet_to_json(ws);

    console.log(data);
    //return data;
}
