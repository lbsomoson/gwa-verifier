const myModule = require('./index');
const {database} = myModule.database;
var XLSX = require("xlsx");
const pdf2excel = require('pdf-to-excel');

exports.login = (req,res) =>{
    
    const username = req.body.username;
    const password = req.body.password;
    //console.log("here");
    let sqlSearch = "SELECT * FROM users WHERE username = ? AND password = ?"
    database.query(sqlSearch,[username,password], (err,result)=>{
        if(err){
            res.send(err)
        }
            
        if(result.length > 0){
            //console.log(result)
            res.send(result)
        }else{
            res.send({msg: "Not found"})
        }
    })
}

exports.upload = (req,res) =>{ 
    const fileUpload = req.body.uploadedFile;
    console.log("file sent:");
    console.log(fileUpload);
    res.send({uploaded: fileUpload});
}

exports.uploadSingle = (req, res) => {
    const filename = req.file.originalname;
    if(/.+\.xlsx/.test(filename)){
        //transform excel to JSON
        //console.log("File is xlsx");
        const wb = XLSX.readFile("files/" + filename)
        var ws = wb.Sheets["Sheet1"];

        var range = XLSX.utils.decode_range(ws['!ref']);

        range.s.r = 2;
        range.e.r = range.e.r - 4;
        ws['!ref'] = XLSX.utils.encode_range(range);

        var data = XLSX.utils.sheet_to_json(ws);
        var fname = ws['B1'].v;
        var lname = ws['A1'].v;
        var course = ws['A2'].v;

        console.log(data);
        console.log(fname, lname);
        console.log(course);
        console.log("File is xlsx");
        //res.send({uploaded: fileUpload});

    }else if(/.+\.csv/.test(filename)){
        //transform csv to JSON
        //console.log("File is csv");
        const wb = XLSX.readFile("files/" + filename)
        var ws = wb.Sheets["Sheet1"];

        var range = XLSX.utils.decode_range(ws['!ref']);

        range.s.r = 2;
        range.e.r = range.e.r - 4;
        ws['!ref'] = XLSX.utils.encode_range(range);

        var data = XLSX.utils.sheet_to_json(ws);
        var fname = ws['B1'].v;
        var lname = ws['A1'].v;
        var course = ws['A2'].v;

        console.log(data);
        console.log(fname, lname);
        console.log(course);
        console.log("File is csv");


    }else if(/.+\.pdf/.test(filename)){
        //transform pdf to JSON
        async function convertpdf(){
            let convertPromise = new Promise(function(resolve){
                resolve(pdf2excel.genXlsx('files/'+ filename,'./files/bar.xlsx'));
            })
            await convertPromise;
            const wb = XLSX.readFile("./files/bar.xlsx")
            var ws = wb.Sheets["Sheet1"];
        
            var range = XLSX.utils.decode_range(ws['!ref']);
        
            range.s.r = 2;
            range.e.r = range.e.r - 4;
            ws['!ref'] = XLSX.utils.encode_range(range);
        
            var data = XLSX.utils.sheet_to_json(ws);
            var fname = ws['B1'].v;
            var lname = ws['A1'].v;
            var course = ws['A2'].v;
    
            console.log(data);
            console.log(fname, lname);
            console.log(course);
            //return data;
        }
        convertpdf();
        console.log("File is pdf");

    }
   
}