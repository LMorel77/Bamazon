var inquirer = require('inquirer');
var mysql = require('mysql');

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

    sqlCxn.query("SELECT * FROM products", function (error, products) {

        if (error) throw error;
        inquirer.prompt([
            {
                name: 'start',
                type: 'list',
                message: 'Online Store Manager Menu\n',
                choices: ['\t1) View Products for Sale',
                    '\t2) View Low Inventory',
                    '\t3) Update Inventory',
                    '\t4) Add New Product',
                    '\t5) Quit']
            }
        ]).then(function (answers) {

            if (answers.start === '\t1) View Products for Sale') viewProducts(products);
            else if (answers.start === '\t2) View Low Inventory') viewLowInventory(products);
            else if (answers.start === '\t3) Update Inventory') updateInventory(products);
            else if (answers.start === '\t4) Add New Product') addProduct();
            else { console.log('\nGood-bye!'); sqlCxn.end(); };

        })

    })

}

function viewProducts(products) {

    console.log("\nItem ID\t\tQty\tPrice\t\tDescription\n");
    for (let i = 0; i < products.length; i++) {
        console.log(products[i].item_id + "\t" + products[i].stock_quantity + "\t$" +
            (products[i].price).toFixed(2) + "\t\t" + products[i].product_name);
    };
    console.log('');
    startMenu();

}

function viewLowInventory(products) {

    var count = 0;
    console.log("\nItem ID\t\tQty\tPrice\t\tDescription\n");
    for (let i = 0; i < products.length; i++) {
        if (products[i].stock_quantity < 5) {
            console.log(products[i].item_id + "\t" + products[i].stock_quantity + "\t$" +
                (products[i].price).toFixed(2) + "\t\t" + products[i].product_name);
            count++;
        }
    };
    if (count === 0) console.log("(Nothing to display. Inventory levels healthy.)");
    console.log('');
    startMenu();

}

function updateInventory(products) {

    console.log('');
    inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            message: "Which product would you like to update?.",
            choices: function () {
                var item_id_list = [];
                for (let i = 0; i < products.length; i++) {
                    item_id_list.push(products[i].item_id);
                };
                return item_id_list;
            }
        },
        {
            name: 'qty',
            type: 'input',
            message: "Enter new inventory number:",
            validate: function (input) {
                if (!isNaN(input)) return true;
                return false;
            }
        }
    ]).then(function (answers) {

        var item;
        for (let i = 0; i < products.length; i++) {
            if (products[i].item_id === answers.id) item = products[i];
        }

        var newInventory = parseInt(item.stock_quantity) + parseInt(answers.qty);
        sqlCxn.query("UPDATE products SET ? WHERE ?",
            [
                { stock_quantity: newInventory },
                { item_id: answers.id }
            ],
            function (error) {

                if (error) throw error;
                console.log("\nInventory updated successfully!\n");
                startMenu();

            });

    });

};

function addProduct() {

    var department_list = [];
    sqlCxn.query("SELECT department_name FROM departments GROUP BY department_name", function (error, departments) {
        if (error) throw error;
        for (let i = 0; i < departments.length; i++) {
            department_list.push(departments[i].department_name);
        }
    });

    console.log('');
    inquirer.prompt([
        {
            name: 'id',
            type: 'input',
            message: 'Enter the item ID:'
        },
        {
            name: 'name',
            type: 'input',
            message: 'Enter the product name:'
        },
        {
            name: 'dept',
            type: 'list',
            message: 'Select the department:',
            choices: department_list
        },
        {
            name: 'price',
            type: 'input',
            message: 'Enter the price:',
            validate: function (input) {
                if (!isNaN(input)) return true;
                return false;
            }
        },
        {
            name: 'qty',
            type: 'input',
            message: 'Enter the inventory amount:',
            validate: function (input) {
                if (!isNaN(input)) return true;
                return false;
            }
        }
    ]).then(function (answers) {

        sqlCxn.query("INSERT INTO products SET ?",
            {
                item_id: answers.id,
                product_name: answers.name,
                department_name: answers.dept,
                price: answers.price,
                stock_quantity: answers.qty
            },
        function (error) {
            if (error) throw error;
            console.log("\nProduct added successfully!\n");
            startMenu();
        });

    });

}