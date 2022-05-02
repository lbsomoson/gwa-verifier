// Add functions here to modularize source code better

var XLSX = require("xlsx");
var config = require('./config.json');

function readData(filename){
    var wb = XLSX.readFile("files/" + filename);
    var ws = wb.Sheets["Sheet1"];
    var range = XLSX.utils.decode_range(ws['!ref']);
    range.s.r = 3;
    ws['!ref'] = XLSX.utils.encode_range(range);
    var data = XLSX.utils.sheet_to_json(ws);
    // console.log(data);
    return data;
}


function processExcel(filename){
    // //const workbookHeaders = xlsx.readFile(filePath, { sheetRows: 1 });
    // let sNum = 0;
    // let program = "";
    
    // //Get student name
    // var wb = XLSX.readFile("files/" + filename);
    // var ws = wb.Sheets["Sheet1"];
    // var range = XLSX.utils.decode_range(ws['!ref']);
    // ws['!ref'] = XLSX.utils.encode_range(range);
    // const name = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
    // console.log(name);

    // //Get student number and program
    // range.s.r = 1;
    // range.e.r = 1;
    // ws['!ref'] = XLSX.utils.encode_range(range);
    // const x = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];

    // range.s.r = 2;
    // range.e.r = 2;
    // ws['!ref'] = XLSX.utils.encode_range(range);
    // const y = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];

    // if(/\d{4}-\d{5}/.test(x[0])){
    //     sNum = x[0];
    //     program = y[0];
    // }else if(config["programs"].includes(x)){
    //     program = x[0];
    //     sNum = y[0];
    // }else{
    //     console.log("Error");
    // }

    // console.log("Student Number is " + sNum);
    // console.log("Program is " + program);
    // let courses_taken = [];
    // let ge_taken = [];
    // let required_ge = [];
    // let hk11_count = 1;
    // let hk12_count = 3;
    
    // // get course data
    data = readData(filename);
    // for(let i=0; i<data.length; i++){

    //     //Check validity of courses
    //     if(config.course[program].includes(data[i]["CRSE NO."])){   //Check if course taken is in the program
    //         if(!courses_taken.includes(data[i]["CRSE NO."])){
    //             courses_taken.push(data[i]["CRSE NO."]);
    //         }
    //     }else if(data[i]["CRSE NO."] == 'HK 11'){                   //If course not in the program, check if it's a HK subject
    //         hk11_count--;
    //     }else if(data[i]["CRSE NO."] == 'HK 12'){
    //         hk12_count--;
    //     }else if(data[i]["CRSE NO."] == undefined) break;           //breaks if no more courses are read

    //     else if(config.GE.hasOwnProperty(data[i]["CRSE NO."])){
    //         if(config.GE[data[i]["CRSE NO."]] === 'Required'){
    //             required_ge.push(data[i]["CRSE NO."]);
    //         }else{
    //             ge_taken.push(data[i]["CRSE NO."]);
    //         }
    //     }


    //     //Check validity of term
    //     let term = data[i].__EMPTY;
    //     if(term != undefined){   //term exists
    //         //check if term is in valid format
    //         if(/^l{1,2}\/\d{2}\/\d{2}$/.test(term)){
    //             const termElements = term.split("/");
    //             for(let i in termElements){
    //                 //console.log(termElements[i]);
    //             }
    //         }else{
    //             console.log("Error in term format for row" + i);
    //         }
    //     }   
        
    //     //console.log(data[i]);

    // }
    // //console.log("Number of courses taken is " + courses_taken.length);
    // if(hk11_count != 0 && hk12_count != 0){
    //     console.log("Missing HK courses");
    // }else{
    //    // console.log("HK courses complete");
    // }
    //console.log("Number of Required GE courses taken: " + required_ge.length);
    //console.log("Number of Elective GE courses taken: " + ge_taken.length);

    return data;
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
}

function verifystudno(filename){
    var wb = XLSX.readFile("files/" + filename);
    var ws = wb.Sheets["Sheet1"];
    var studno = ws['A2'].v;
    if(/^20[0-2][0-9]-[0-9]{5}$/.test(studno)){
        console.log('Student number: '+studno);
    }else{
        console.log('Invalid student number');
    }
}

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
module.exports={verifyunits,checkload,processExcel, verifyname, verifycourse, verifystudno}

