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

    sqlCxn.query("SELECT * FROM products", function (error, products) {

        if (error) throw error;
        inquirer.prompt([
            {
                name: 'prompt',
                type: 'list',
                message: 'Online Store Menu\n',
                choices: ['\t1) Display Products', '\t2) Place an Order', '\t3) Quit\n']
            }
        ]).then(function (answers) {

            if (answers.prompt === '\t1) Display Products') displayProducts(products);
            else if (answers.prompt === '\t2) Place an Order') placeOrder(products);
            else { console.log('Good-bye!'); sqlCxn.end(); };

        });

    });

};

function displayProducts(products) {


    console.log("\nProducts\n");
    var tbl = new table;
    products.forEach(function(products) {
        tbl.cell('Item ID', products.item_id);
        tbl.cell('Description', products.product_name);
        tbl.cell('Price (US$)', products.price, table.number(2));
        tbl.newRow();
    });
    console.log(tbl.toString(), "\n");
    startMenu();

};

function placeOrder(products) {

    inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            message: "Please select an item ID.",
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
            message: "How many would you like to buy?",
            validate: function (input) {
                if (!isNaN(input)) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {

        var item;
        for (let i = 0; i < products.length; i++) {
            if (products[i].item_id === answers.id) item = products[i];
        }
        if (answers.qty > item.stock_quantity) {
            console.log("\nWe're sorry, requested quantity unavailable. In stock: " + item.stock_quantity + "\n");
            updateQuantity(item);
        }
        else {
            updateProduct(item, answers.qty);
        }

    });

};

function updateQuantity(item) {

    inquirer.prompt([
        {
            name: 'input',
            type: 'list',
            message: 'Would you like to change your quantity?\n',
            choices: ['\t1) Yes', '\t2) No']
        }
    ]).then(function (answers) {

        console.log('');
        if (answers.input === '\t1) Yes') {
            inquirer.prompt([
                {
                    name: 'qty',
                    type: 'input',
                    message: "How many would you like to buy?",
                    validate: function (input) {
                        if (!isNaN(input)) {
                            return true;
                        }
                        return false;
                    }
                }
            ]).then(function (answers) {

                if (answers.qty > item.stock_quantity) {
                    console.log("\nWe're sorry, requested quantity unavailable. In stock: " + item.stock_quantity + "\n");
                    updateQuantity(item);
                }
                else {
                    updateProduct(item, answers.qty);
                }

            });

        }
        else {
            console.log('');
            startMenu();
        }

    });

};

function updateProduct(item, qty) {

    var totalCost = item.price * qty;
    sqlCxn.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: item.stock_quantity - qty,
                product_sales: item.product_sales + totalCost
            },
            { 
                item_id: item.item_id
            }
        ],
        function (error) {

            if (error) throw error;
            console.log("\nOrder placed successfully! Order total: $" + totalCost.toFixed(2) + "\n");
            startMenu();

        });

};