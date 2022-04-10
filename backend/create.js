var XLSX = require("xlsx");

var wb = XLSX.readFile("honors-grade.csv");

var ws = wb.Sheets["Sheet1"];

var range = XLSX.utils.decode_range(ws['!ref']);

range.s.r = 2;
range.e.r = range.e.r - 4;
ws['!ref'] = XLSX.utils.encode_range(range);

var data = XLSX.utils.sheet_to_json(ws);

console.log(data);