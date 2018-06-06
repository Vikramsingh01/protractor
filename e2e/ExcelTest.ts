
//import { readFile } from '.././node_modules/xlsx';
var XLSX = require('xlsx');
var workbook = XLSX.readFile('test.xlsx');

//var workbook =readFile('test.xlsx');
var firstSheetName = workbook.SheetNames[0];
var addressOfCell='A2';
var pwd='B2';
var workSheet =workbook.Sheets[firstSheetName];
var desired_user = workSheet[addressOfCell];
var desired_pwd = workSheet[pwd];
var desired_value_user = desired_user.v;
var desired_value_pwd = desired_pwd.v;
console.log(desired_value_user+""+""+desired_value_pwd);
