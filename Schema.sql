CREATE DATABASE dba;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('warehouse_admin', 'seller', 'customer') NOT NULL
);

CREATE TABLE product (
    product_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    image LONGTEXT, 
    length INT NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    seller_id INT NOT NULL,
    category_id INT NOT NULL,
    added_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

CREATE TABLE warehouse (
  warehouse_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  province VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  number INT NOT NULL,
  total_area_volume INT NOT NULL
);

CREATE TABLE order (
  order_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  order_date DATETIME INT NOT NULL,
  status enum("Accept","Pending","Reject") NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

CREATE TABLE orderItem (
  order_item_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- CREATE TABLE inventory (
--   inventory_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--   product_id INT NOT NULL,
--   warehouse_id INT NOT NULL,
--   quantity INT NOT NULL,
--   FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id),
--   FOREIGN KEY (product_id) REFERENCES product(product_id)
-- );














