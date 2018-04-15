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
            else if (answers.start === '\t3) Update Inventory') updateInventory();
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

function updateInventory() {
    console.log('\nUpdate Inventory Selected\n');
    startMenu();
}
function addProduct() {
    console.log('\nAdd Product Selected\n');
    startMenu();
}