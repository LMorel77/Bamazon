# Bamazon

## Overview

### Bamazon is a simple Node.js command-line interface (CLI) application, which, like Amazon, serves a storefront where customers can buy products, with the difference being that Bamazon isn't being served on a web site, it's a fictitious store, and, well, a tiny one at that, created for the sole purpose of demonstrating the power of node and the functionality of the various node packages incorporated within.

### This application uses three node.js packages: 1) [`easy-table`](https://www.npmjs.com/package/easy-table) (for the output), 2) [`inquirer`](https://www.npmjs.com/package/inquirer) (for the user prompts), and 3) [`mysql`](https://www.npmjs.com/package/mysql) (for the sql database). For the MySQL server, I used [`MAMP`](https://www.mamp.info). 

### As you'll see in the SQL schema file - `schema.sql` - the SQL database is comprised of two tables, departments and products, each with mock data replicating legitimate items from [`Amazon.com`](https://www.amazon.com). For more database info, check out the SQL schema file in this repository.

### BAMAZON has three views, or modules called: 1) `Customer` 2) `Manager` , and 3) `Supervisor`. Each view can be accessed with its respective file: 1) `bamazonCustomer.js`, 2) `bamazonManager.js`, and 3) `bamazonSupervisor.js`.

### For a brief video demonstration, [click here](https://drive.google.com/file/d/1pQSLL7Se2MwZK8h-_2RWepMwXaLYIptC/view).

### Enjoy!