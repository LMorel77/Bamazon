CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id VARCHAR(10) NOT NULL,
    product_name VARCHAR(128),
    department_name VARCHAR(128),
    price DECIMAL(10,2),
    stock_quantity INT(10),
    PRIMARY KEY (item_id)
);

-- Adding 'product_sales' column/field to existing table 'products':
ALTER TABLE products
ADD COLUMN product_sales DECIMAL(10,2) DEFAULT 0.00
AFTER stock_quantity;

-- Creating table 'departments'
CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(128),
    over_head_costs DECIMAL(10,2),
    PRIMARY KEY (department_id)
);

-- Mock Data for 'products' table
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES
    ("B004AHDV5A",
    "Wild Planet, Wild Albacore Tuna, 5 Ounce Can (Pack of 12)",
    "Food",
    33.80,
    100),
    ("B074H6816H",
    "365 Everyday Value, Organic Creamy Peanut Butter Spread, 28 oz",
    "Food",
    5.99,
    50),
    ("B074J6TMD3",
    "365 Everyday Value, Snack Crackers, 16 oz",
    "Food",
    2.99,
    49),
    ("B000QSTEKS",
    "Garden of Eatin', Red Hot Blues Spicy All Natural Tortilla Chips, 16 oz",
    "Food",
    3.99,
    34),
    ("B0046OB5DW",
    "Kohler 30321-CP Escutcheon",
    "Home Improvement",
    95.78,
    27),
    ("B001GZZFR6",
    "Kohler Genuine Part GP71969 Valve Mixer Kit",
    "Home Improvement",
    27.52,
    12),
    ("B077QD19FY",
    "Bison Denim Men's Top Grain Leather Reversible Belt",
    "Apparel",
    19.99,
    21),
    ("B005LLL2HI",
    "Trico Exact Fit 16-A Rear Integral Wiper Blade - 16-inch",
    "Automotive",
    10.08,
    16),
    ("B00HEYTUW4",
    "Champion Men's 3-Pack Smart Temp Boxer Brief",
    "Apparel",
    17.99,
    77),
    ("B00OAJ412U",
    "Samsung 850 EVO 250GB 2.5-Inch SATA III Internal SSD (MZ-75E250B/AM)",
    "Electronics",
    108.99,
    42),
    ("B00ZO4WWBM",
    "Copper Compression Arthritis\Carpel Tunnel Gloves",
    "Health",
    21.95,
    19),
    ("B000WFKX6Y",
    "Safe Paw Ice Melter 35 Lbs/Pail",
    "Pet Supplies",
    62.40,
    69);

-- Mock data for 'departments' table
INSERT INTO departments (department_name, over_head_costs)
VALUES ('Food', 250000),
    ('Pet Supplies', 121500),
    ('Home Improvement', 212700),
    ('Electronics', 97676),
    ('Automotive', 81650),
    ('Apparel', 149696),
    ('Health', 77126);