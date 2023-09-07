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
  product_id INT,
  warehouse_id INT,
  quantity INT NOT NULL,
  FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE SET NULL
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
  product_id INT,
  quantity INT NOT NULL,
  warehouse_id INT,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE SET NULL,
  FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id) ON DELETE SET NULL
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

  -- Lock the inventory row for the specific product and warehouse
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

    -- Lock the inventory row for the specific product and warehouse
    SELECT * FROM inventory WHERE product_id = p_id AND warehouse_id = @target_warehouse FOR UPDATE;

    SELECT quantity
    INTO @available_quantity
    FROM inventory
    WHERE product_id = p_id AND warehouse_id = @target_warehouse;

    IF @available_quantity > remaining_quantity THEN
      -- Update inventory and insert into orderItem
      UPDATE inventory
      SET quantity = quantity - remaining_quantity
      WHERE product_id = p_id AND warehouse_id = @target_warehouse;

      INSERT INTO orderItem (order_id, product_id, quantity, warehouse_id) VALUES (o_id, p_id, remaining_quantity, @target_warehouse);

      SET remaining_quantity = 0;

    ELSE 
      -- Update inventory and insert into orderItem
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

  OPEN cur;
  FETCH cur INTO w_id, p_id, qnt;

  WHILE NOT done DO
    IF (OLD.order_status = 'Pending') AND (NEW.order_status = 'Accept') THEN
      -- Update warehouse available area
      SELECT length * width * height 
      INTO @product_area FROM product 
      WHERE product_id = p_id;

      UPDATE warehouse
      SET available_area = available_area + (qnt * @product_area)
      WHERE warehouse_id = w_id;

    ELSEIF (OLD.order_status = 'Pending') AND (NEW.order_status = 'Reject') THEN
      -- Update inventory quantity
      UPDATE inventory
      SET quantity = quantity + qnt
      WHERE product_id = p_id AND warehouse_id = w_id;

    END IF;

    FETCH cur INTO w_id, p_id, qnt;
  END WHILE;
  
  CLOSE cur;
  
END //

DELIMITER ;




-- Sample data
INSERT INTO users(username, email, password, role) VALUES 
("Customer1", "C1@gmail.com", "$2b$10$YNkrduDGVwIdAv9xztWB4OxlvDSE9isdRH3bmsUUbHBFMDNrDgb6G", "customer"),
("Customer2", "C2@gmail.com", "$2b$10$lbqlmowp2Bgj.DF845kgwOLs8ehk1V8FMunpg/1PKZEYMDZXjlaa.", "customer"), 
("Admin1", "A1@gmail.com", "$2b$10$qOZSoMannGm88Rm5LWGJwO.orp1D12Sj/dq5Qa5PFJnVoF2m1EsQi", "warehouse_admin"), 
("Admin2", "A2@gmail.com", "$2b$10$YYF2f1hHm/FfxTUe4kX4sOGfJ9MYVXZ1iIogdzQL9wI16Znwbvkn.", "warehouse_admin"),
("Seller1", "S1@gmail.com", "$2b$10$drKiuqvlFQ0rG2EzYUB4ougEFQmcOBKiKU2zLZuiZucFUtS58lBwG", "seller"), 
("Seller2", "S2@gmail.com", "$2b$10$aPmAzkDe8DZ4wMlpLBXU6e1Oylof1Q7DzhWq0RNcga7LyaQ.fy11.", "seller"),
("Customer3", "C3@gmail.com", "$2b$10$tBrtqKaedpOAWX4bo3ndzeD.RGhq657JnCiTf1AJF1CHmoz4ZYTY.", "customer"),
("Customer4", "C4@gmail.com", "$2b$10$gmv5Hdtx6Dzmy1JNaBfnlO2V4KauDN.0.JcSl2Kz958VT90xf5PkC", "customer"),
("Customer5", "C5@gmail.com", "$2b$10$4F5T3nXeBNjLApmoqWIDt.9KmvUxPo8k9AvY3kOsQpiNm3g9lkZlG", "customer"),
("Customer6", "C6@gmail.com", "$2b$10$7n9K9LUraR8W0Htx5aU/OuY34OQrebL22P5i61oF/59KbwyrIDVKG", "customer"),
("Customer7", "C7@gmail.com", "$2b$10$K7bBFiK/iUivciPbsP1vOOTwWosa3iEmA/zMpNVrJyI1Rk9ga/Qwa", "customer");


INSERT INTO product(title, description, price, image, length, width, height, seller_id, category_id) VALUES
("iPhone 15", "Version of Apple smartphone", 1099, "image_1694053015698.jpeg", 4, 2 , 1, 5, 10),
("Samsung A34", "Samsung A34 series phone", 799, "image_1694053045909.jpg" , 5, 3, 1, 5, 11),
("Dell Laptop", "A laptop from Dell", 1000, "image_1694053144371.jpg", 10, 8, 3, 5, 12),
("School Desktop", "Prebuilt desktop made for school", 2500, "image_1694053175540.jpg", 15, 8, 10, 5, 13),
("LED monitor", "LED monitor from Samsung", 83, "image_1694053205946.png", 15, 10, 3, 5, 14),
("Keyboard & Mice", "A set of a mouse and keyboard", 15, "image_1694053242345.png", 8, 4, 2, 5, 15),
("Digital camera", "A digital camera", 2200, "image_1694053287058.jpg", 4, 2, 2, 5, 16),
("DSLR camera", "A DSLR camera", 250, "image_1694053318195.jpg", 4, 2, 2, 5, 17),
("Headphones", "Bluetooth headphones", 30, "image_1694053342003.png", 4, 4, 3, 5, 18),
("Bluetooth Speakers", "Speakers connected by bluetooth", 45, "image_1694053368374.jpg", 15, 3, 3, 5, 19),
("Earphones", "Small earphones for business work", 50, "image_1694053399822.jpeg", 8, 6, 3, 5, 20),
("Refrigerators", "Refrigerator for food preservation", 500, "image_1694053432318.jpg", 30, 15, 8, 6, 21),
("Washing Machine", "Machine for washing clothes", 250, "image_1694053466617.png", 20, 20, 20, 6, 22),
("Space Pirate", "A Sci-Fi book", 15, "image_1694053507042.jpg", 8, 6, 2, 6, 23),
("Knight's tale", "A fantasy fiction book", 15, "image_1694053538334.jpeg", 8, 6, 2, 6, 24),
("Nightmare on the Moon", "A horror book", 15, "image_1694053572255.jpg", 8, 6, 2, 6, 25),
("Heart throb", "A thriller book", 15, "image_1694053599721.jpg", 8, 6, 2, 6, 26),
("3 Kingdoms", "Historical fiction book", 15, "image_1694053624699.jpg", 8, 6, 2, 6, 27),
("Lovers at ocean's depth", "A romace book", 15, "image_1694053653747.png", 8, 6, 2, 6, 28),
("Life of Guy", "An autobiography of Guy", 15, "image_1694053679703.jpg", 8, 6, 2, 6, 29),
("Welf's deeds", "A biography about Welf", 15, "image_1694053707623.jpg", 8, 6, 2, 6, 30),
("Find time for yourself", "A self-help book about self-esteem", 15, "image_1694053731424.jpg", 8, 6, 2, 6, 31);


INSERT INTO warehouse(name, province, city, district, street, number, total_area_volume, available_area) VALUES
("Warehouse1", "ProvinceA", "CityA", "DistrictA", "StreetA", 1, 100000, 95829),
("Warehouse2", "ProvinceC", "CityA", "DistrictB", "StreetB", 25, 50000, 43640),
("Warehouse3", "ProvinceZ", "CityB", "DistrictA", "StreetC", 7, 80000, 43891);

INSERT INTO inventory(product_id, warehouse_id, quantity) VALUES 
(1, 2, 15), (2, 3, 3), (2, 1, 5), (3, 2, 20), (12, 3, 10), (20, 1, 42), (21, 2, 15), (7, 3, 4), (7, 1, 4);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (1, "2023-09-05 16:55:05", "Pending");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (1, 2, 5, 1), (1, 2, 2, 3);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (2, "2023-09-06 12:45:05", "Pending");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (2, 12, 8, 3);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (7, "2023-09-03 09:06:05", "Accept");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (3, 20, 8, 1);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (7, "2023-09-16 20:45:05", "Pending");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (4, 2, 8, 3);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (8, "2022-07-12 19:06:05", "Accept");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (5, 3, 15, 2);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (8, "2022-07-12 19:06:05", "Reject");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (6, 21, 15, 2);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (9, "2021-07-12 19:06:05", "Accept");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (7, 2, 4, 3);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (9, "2020-04-12 19:06:05", "Accept");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (8, 13, 10, 2);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (10, "2021-07-12 19:06:05", "Accept");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (9, 10, 5, 1);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (11, "2021-07-12 19:06:05", "Pending");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (10, 14, 13, 1);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (11, "2021-07-12 19:06:05", "Reject");
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (11, 7, 4, 3), (11, 7, 4, 1);
