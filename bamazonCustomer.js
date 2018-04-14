var inquirer = require('inquirer');
var mysql = require('mysql');

var sqlCxn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

sqlCxn.connect(function(error) {
    if (error) throw error;
    console.log("\nSuccessfully connected to mySql with id", sqlCxn.threadId);
});