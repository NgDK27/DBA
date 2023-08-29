DROP DATABASE IF EXISTS dba;
CREATE DATABASE IF NOT EXISTS dba;
USE dba;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS warehouse;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS orderItem;

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
  order_status enum("Accept","Pending","Reject") NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

CREATE TABLE orderItem (
  order_item_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  warehouse_id INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES product(product_id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id)
);



-- Procedure for sending inbound order
DROP PROCEDURE IF EXISTS SendProductToWarehouse;
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




-- Procedure for placing order and update database according to the order
DROP PROCEDURE IF EXISTS PlaceOrder;
DELIMITER //

CREATE PROCEDURE PlaceOrder(IN o_id INT, IN p_id INT, IN qnt INT)
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

        SELECT * FROM inventory WHERE product_id = p_id AND warehouse_id = @target_warehouse FOR UPDATE;

        UPDATE inventory
        SET quantity = quantity - qnt
        WHERE product_id = p_id AND warehouse_id = @target_warehouse;

        INSERT INTO orderItem (order_id, product_id, quantity, warehouse_id) VALUES (o_id, p_id, remaining_quantity, @target_warehouse);

        SET remaining_quantity = 0;

      ELSE 

        SELECT * FROM inventory WHERE product_id = p_id AND warehouse_id = @target_warehouse FOR UPDATE;

        UPDATE inventory
        SET quantity = quantity - @available_quantity
        WHERE product_id = p_id AND warehouse_id = @target_warehouse;

        INSERT INTO orderItem (order_id, product_id, quantity, warehouse_id) VALUES (o_id, p_id, @available_quantity, @target_warehouse);

        SET remaining_quantity = remaining_quantity - @available_quantity;

      END IF;

  END WHILE;

END //

DELIMITER ;



DROP PROCEDURE IF EXISTS UpdateStatus;
DELIMITER //
CREATE PROCEDURE UpdateStatus(IN o_id INT, IN new_status VARCHAR(10)) 
BEGIN

  UPDATE orders 
  SET order_status = new_status
  WHERE order_id = o_id;

END //







-- Trigger for changing order status
DROP TRIGGER IF EXISTS OrderStatusChanged;

DELIMITER //

CREATE TRIGGER OrderStatusChanged AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  DECLARE w_id INT;
  DECLARE p_id INT;
  DECLARE qnt INT;
  DECLARE done BOOLEAN DEFAULT FALSE;
  
  -- Declare and initialize the cursor variables
  DECLARE cur CURSOR FOR
    SELECT oi.warehouse_id, oi.product_id, oi.quantity
    FROM orderItem oi
    WHERE oi.order_id = NEW.order_id;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  -- Handle the case when status changes from 'Pending' to 'Accept'
  IF (OLD.order_status = 'Pending') AND (NEW.order_status = 'Accept') THEN
    OPEN cur;
    FETCH cur INTO w_id, p_id, qnt;

    WHILE NOT done DO
      -- Update warehouse available area and move to the next row
      UPDATE warehouse
      SET available_area = available_area + (qnt * (SELECT length * width * height FROM product WHERE product_id = p_id))
      WHERE warehouse_id = w_id;
      
      FETCH cur INTO w_id, p_id, qnt;
    END WHILE;
    
    CLOSE cur;
  
  -- Handle the case when status changes from 'Pending' to 'Reject'
  ELSEIF (OLD.order_status = 'Pending') AND (NEW.order_status = 'Reject') THEN
    OPEN cur;
    FETCH cur INTO w_id, p_id, qnt;

    WHILE NOT done DO
      -- Update inventory quantity and move to the next row
      UPDATE inventory
      SET quantity = quantity + qnt
      WHERE product_id = p_id AND warehouse_id = w_id;
      
      FETCH cur INTO w_id, p_id, qnt;
    END WHILE;
    
    CLOSE cur;

  -- Handle other status changes by simply moving the cursor to the next row
  ELSE
    OPEN cur;
    FETCH cur INTO w_id, p_id, qnt;

    WHILE NOT done DO
      FETCH cur INTO w_id, p_id, qnt;
    END WHILE;
    
    CLOSE cur;
  END IF;
  
END //

DELIMITER ;
