var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require('easy-table');

var sqlCxn = mysql.createConnection({

    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'

});

sqlCxn.connect(function (error) {

    if (error) throw error;
    console.log("\nBAMAZON Online Super Store\n");
    startMenu();

});

function startMenu() {

    inquirer.prompt([
        {
            name: 'start',
            type: 'list',
            message: 'Online Store Supervisor Menu\n',
            choices: ['\t1) View Product Sales by Department',
                '\t2) View Department List',
                '\t3) Create New Department',
                '\t4) Quit']
        }
    ]).then(function (answers) {

        if (answers.start === '\t1) View Product Sales by Department') viewSalesByDept();
        else if (answers.start === '\t2) View Department List') viewDepartments();
        else if (answers.start === '\t3) Create New Department') addDepartment();
        else { console.log('\nGood-bye!'); sqlCxn.end(); };

    });

};

function viewSalesByDept() {

    var sqlQueryStmt = "SELECT tbl1.department_id, tbl1.department_name, tbl1.over_head_costs, " +
        "SUM(tbl2.product_sales) AS product_sales, (tbl2.product_sales - tbl1.over_head_costs) " +
        "AS total_profit FROM departments tbl1 INNER JOIN products tbl2 ON tbl1.department_name " +
        "= tbl2.department_name GROUP BY department_name";

    sqlCxn.query(sqlQueryStmt, function (error, data) {

        if (error) throw error;
        console.log("\nProduct Sales by Department\n");
        var tbl = new table;
        data.forEach(function (data) {
            tbl.cell('department_id', data.department_id);
            tbl.cell('department_name', data.department_name);
            tbl.cell('over_head_costs (US$)', data.over_head_costs, table.number(2));
            tbl.cell('product_sales (US$)', data.product_sales, table.number(2));
            tbl.cell('total_profit (US$)', data.total_profit, table.number(2));
            tbl.newRow();
        });
        console.log(tbl.toString(), "\n");
        startMenu();

    });

};

function viewDepartments() {

    sqlCxn.query("SELECT * FROM departments", function (error, data) {

        if (error) throw error;
        console.log("\nDepartments\n");
        var tbl = new table;
        data.forEach(function (data) {
            tbl.cell('department_id', data.department_id);
            tbl.cell('department_name', data.department_name);
            tbl.cell('over_head_costs (US$)', data.over_head_costs, table.number(2));
            tbl.newRow();
        });
        console.log(tbl.toString(), "\n");
        startMenu();

    });

};

function addDepartment() {

    inquirer.prompt([
        {
            name: 'name',
            message: 'Enter the department name:'
        },
        {
            name: 'overhead',
            message: 'Enter the overhead costs:',
            validate: function (input) {
                if (!isNaN(input)) return true;
                return false;
            }
        }
    ]).then(function (answers) {

        sqlCxn.query("INSERT INTO departments SET ?",
            {
                department_name: answers.name,
                over_head_costs: answers.overhead
            },
            function (error) {
                if (error) throw error;
                console.log("\nDepartment added successfully!\n");
                startMenu();

            }
        );
    });

};