CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('warehouse_admin', 'seller', 'customer') NOT NULL
);

CREATE TABLE Category (
category_id int not null,
name varchar(50) not null,
parent_category_id int not null,
primary key(category_id)
)engine=InnoDB;

CREATE TABLE Product(
product_id int not null auto_increment,
title varchar(255) not null,
description varchar(255) not null,
price int not null,
image longblob, 
length int not null,
width int not null,
height int not null,
category_id int not null,
primary key(product_id),
foreign key(category_id) references Category(category_id)
)engine=InnoDB;

CREATE TABLE Warehouse(
warehouse_id int not null auto_increment,
name varchar(255) not null,
province varchar(255) not null,
city varchar(255) not null,
district varchar(255) not null,
street varchar(255) not null,
number int not null,
total_area_volume int not null,
primary key (warehouse_id)
)engine=InnoDB;

CREATE TABLE Orders(
order_id int not null auto_increment,
customer_id int not null,
order_date date not null,
status enum("Done","On-going","Canceled") not null,
primary key(order_id)
)engine=InnoDB;

CREATE TABLE OrderItem(
order_item_id int not null auto_increment,
order_id int not null,
product_id int not null,
quantity int not null,
primary key (order_item_id),
foreign key (order_id) references Orders(order_id),
foreign key (product_id) references Product(product_id)
)engine=InnoDB;

CREATE TABLE Inventory(
inventory_id int not null auto_increment,
product_id int not null,
warehouse_id int not null,
quantity int not null,
primary key (inventory_id),
foreign key (warehouse_id) references Warehouse(warehouse_id),
foreign key (product_id) references Product(product_id)
)engine=InnoDB;

