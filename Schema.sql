CREATE DATABASE dba;
USE dba;

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
  total_area_volume INT NOT NULL,
  available_area INT NOT NULL
);

CREATE TABLE inventory (
  inventory_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  warehouse_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id),
  FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE orders (
  order_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  order_date DATETIME NOT NULL,
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


DELIMITER //

CREATE PROCEDURE SendProductToWarehouse(IN p_id INT, IN qnt INT)
BEGIN
  DECLARE total_quantity INT;
  DECLARE product_area INT;
  DECLARE remaining_quantity INT;
  DECLARE combined_available_area INT;

  -- Calculate the total quantity of the product in stock
  SELECT SUM(quantity) INTO total_quantity
  FROM inventory
  WHERE product_id = p_id;

  -- Calculate the product's area for the chosen product
  SELECT (length * width * height) INTO product_area
  FROM product
  WHERE product_id = p_id;

  -- Calculate the combined available area in all warehouses
  SELECT SUM(available_area) INTO combined_available_area
  FROM warehouse;

  -- Compare the total combined available area with the total volume of the products
  IF combined_available_area < (product_area * qnt) THEN
    -- Handle the case where there's not enough space in all warehouses
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Not enough space in warehouses to stock all products';
  ELSE
    -- Continue with the rest of the logic to send products to warehouses
    SET remaining_quantity = qnt;

    -- Loop through warehouses while remaining_quantity > 0
    WHILE remaining_quantity > 0 DO
      -- Find the warehouse with the largest available space
      SELECT warehouse_id
      INTO @target_warehouse
      FROM warehouse
      ORDER BY available_area DESC
      LIMIT 1;

      -- Calculate available space in the selected warehouse
      SELECT available_area INTO @available_space_selected
      FROM warehouse
      WHERE warehouse_id = @target_warehouse;

      -- If enough space, update inventory
      IF @available_space_selected >= (remaining_quantity * product_area) THEN
        -- Update or insert into inventory
        IF EXISTS (SELECT 1 FROM inventory WHERE product_id = p_id AND warehouse_id = @target_warehouse) THEN
          UPDATE inventory
          SET quantity = quantity + remaining_quantity
          WHERE product_id = p_id AND warehouse_id = @target_warehouse;
          
          UPDATE warehouse
          SET available_area = available_area - (remaining_quantity * product_area)
          WHERE warehouse_id = @target_warehouse;
          
        ELSE
          INSERT INTO inventory (product_id, warehouse_id, quantity)
          VALUES (p_id, @target_warehouse, remaining_quantity);
          
          UPDATE warehouse
          SET available_area = available_area - (remaining_quantity * product_area)
          WHERE warehouse_id = @target_warehouse;
          
        END IF;
        -- Update remaining quantity and exit loop
        SET remaining_quantity = 0;
      ELSE
        -- Update available space in the warehouse
        
        IF EXISTS (SELECT 1 FROM inventory WHERE product_id = p_id AND warehouse_id = @target_warehouse) THEN

          UPDATE inventory
          SET quantity = quantity + FLOOR(@available_space_selected / product_area)
          WHERE product_id = p_id AND warehouse_id = @target_warehouse;
          
        ELSE
          INSERT INTO inventory (product_id, warehouse_id, quantity)
          VALUES (p_id, @target_warehouse, FLOOR(@available_space_selected / product_area));
          
        END IF;

        UPDATE warehouse
        SET available_area = available_area - - (product_area * FLOOR(@available_space_selected / product_area))
        WHERE warehouse_id = @target_warehouse;

        SET remaining_quantity = remaining_quantity - FLOOR(@available_space_selected / product_area);
        
      END IF;
      
    END WHILE;
  END IF;
END //

DELIMITER ;






DELIMITER //

CREATE PROCEDURE UpdateInventory(IN p_id INT, IN qnt INT)
BEGIN
  
  DECLARE product_area INT;
  DECLARE remaining_quantity INT;

  SELECT (length * width * height) INTO product_area
  FROM product
  WHERE product_id = p_id;

  SET remaining_quantity = qnt;

  WHILE remaining_quantity > 0 DO
     
      SELECT warehouse_id
      INTO @target_warehouse
      FROM inventory
      WHERE product_id = p_id
      ORDER BY quantity DESC
      LIMIT 1;

      SELECT quantity
      INTO @available_quantity
      FROM inventory
      WHERE product_id = p_id AND warehouse_id = @target_warehouse;
    

      IF @available_quantity > remaining_quantity THEN

        UPDATE inventory
        SET quantity = quantity - qnt
        WHERE product_id = p_id AND warehouse_id = @target_warehouse;

        UPDATE warehouse
        SET available_area = available_area + (product_area * qnt)
        WHERE warehouse_id = @target_warehouse;

        SET remaining_quantity = 0;

      ELSE 

        UPDATE inventory
        SET quantity = quantity - @available_quantity
        WHERE product_id = p_id AND warehouse_id = @target_warehouse;

        UPDATE warehouse
        SET available_area = available_area + (product_area * @available_quantity)
        WHERE warehouse_id = @target_warehouse;


        SET remaining_quantity = remaining_quantity - @available_quantity;

      END IF;

  END WHILE;

END //
DELIMITER ;
















