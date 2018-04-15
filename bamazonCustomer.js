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

    sqlCxn.query("SELECT * FROM products", function (error, data) {

        if (error) throw error;

        inquirer.prompt([
            {
                name: 'prompt',
                type: 'list',
                message: 'Online Store Menu\n',
                choices: ['\t1) Display Products', '\t2) Place an Order', '\t3) Quit\n']
            }
        ]).then(function (answers) {

            if (answers.prompt === '\t1) Display Products') displayProducts(data);
            else if (answers.prompt === '\t2) Place an Order') placeOrder(data);
            else { console.log('Good-bye!'); sqlCxn.end(); }

        });

    });

};

function displayProducts(data) {

    console.log("\nItem ID     Price\tDescription\n");
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].item_id + "  $ " + (data[i].price).toFixed(2) + "\t" + data[i].product_name);
    };
    console.log('');
    startMenu();

};

function placeOrder(data) {

    inquirer.prompt([
        {
            name: 'id',
            type: 'list',
            message: "Please select an item ID.",
            choices: function () {
                var item_id_list = [];
                for (let i = 0; i < data.length; i++) {
                    item_id_list.push(data[i].item_id);
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
        for (let i = 0; i < data.length; i++) {
            if (data[i].item_id === answers.id) item = data[i];
        }
        if (answers.qty > item.stock_quantity) {
            console.log("\nWe're sorry, requested quantity unavailable. In stock: " + item.stock_quantity + "\n");
            quantityUpdate(item);
        }
        else {
            console.log("\nOrder placed successfully!\n");
            // updateProduct(item, answers.qty);
            startMenu();
        }

    });

};

function quantityUpdate(item) {

    inquirer.prompt([
        {
            name: 'input',
            type: 'list',
            message: 'Would you like to change your quantity?\n',
            choices: ['\t1) Yes', '\t2) No']
        }
    ]).then(function (answers) {

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
                    quantityUpdate(item);
                }
                else {
                    console.log("\nOrder placed successfully!\n");
                    // updateProduct(item, answers.qty);
                    startMenu();
                }

            });

        }
        else {
            startMenu();
        }

    });

};

function updateProduct(item, qty) {

}