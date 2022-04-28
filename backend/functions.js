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

