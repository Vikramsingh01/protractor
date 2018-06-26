
var XLSX = require('xlsx');
var workbook = XLSX.readFile('test.xlsx');
//var firstSheetName = workbook.SheetNames[0];
//var firstSheetName ="Login";
var sheet = workbook.Sheets["Login"];


/* var fn="A2";
var ln ="B2";
var tn ="C2";
var fmn ="D2";
var dob ="E2";
var gender ="F2";

var desired_user = sheet[fn];
var desired_pwd = sheet[ln];
var firsname = desired_user.v;
var lastname = desired_pwd.v;
console.log(firsname+" "+lastname);   */ 

 var sheet2arr = function (sheet) {
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var str = "";
    console.log("range.SheetNames " + range.e.r);
    for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
       // row = [];
      // console.log("rowNum : "+rowNum);
        for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
            var nextCell = sheet[
                XLSX.utils.encode_cell({ r: rowNum, c: colNum })
            ];
           str= str.concat(nextCell.w+"  ");
           //var pp =str.split("  ");
           //console.log(pp);
           // console.log(nextCell.w+"\s");
           /*  if (typeof nextCell === 'undefined') {
                row.push(void 0);
            } else {row.push(nextCell.w);} */

        }
      str=  str.concat(" \n ");
        console.log(str)
        result.push(row);
    } 
    return result;
};

sheet2arr(sheet); 

