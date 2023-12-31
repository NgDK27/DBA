# Set up database
- Open a root instance of MySQL database
- Run script
  ```bash
  ALTER USER 'root'@'localhost' identified with mysql_native_password by 'password';
  FLUSH PRIVILEDGES;
  ```
- Go into the database.sql file in the project and copy all the contents into the sql workbench
- Run all of the sql code
- The resulting database should look like this:  
  ![Database sql](./backend/images/database_structure_sql.png)

# Intructions for launching project
- Open cmd terminal in the root directory of the project
- Open 2 terminals
  ![Two terminal](./backend/images/two_terminal.png)
- Install dependencies for the back-end
  ```bash
  cd backend
  npm i
  ```
- Install dependencies for the front-end
  ```bash
  cd frontend
  npm i
  ```
- It will look something like this:
  ![Two terminal dependencies](./backend/images/two_terminal_dependencies.png)
- Start the back-end of the project in the first terminal
  ```bash
  npm start
  ```
  This will start the back end at [https://localhost/](https://localhost/)
- Start the front-end of the project in the second terminal
  ```bash
  npm start
  ```
  This will start the front end at [https://localhost:4200/](https://localhost:4200/)
- The end result should look like this:
  ![Two terminal result](./backend/images/two_terminal_result.png)
- Open a web browser and go to the address "https://localhost:4200"
- When the website load you will see this screen:
  ![Security Warning](./backend/images/Warning.png)
- Click on "Advance" on the bottom of the page, you will see more options displayed:
  ![Security Warning Advance Clicked](./backend/images/Warning_AfterAdvance.png)
- Click on "Proceed to localhost (unsafe)" to go to the website:
- Now repeat the process for address location "https://localhost" (this is where the backend of the site is hosted)
- Finally go back to the address "https://localhost:4200" to see the website:
  ![Website Home Screen](./backend/images/Home_ScreenFinal.png)

# Sample data for database:

## Accounts for testing:
All test accounts will have the same username and password:
### Customer accounts: 
Customer1, Customer2, Customer3, Customer4, Customer5, Customer6, Customer7
### Seller accounts:
Seller1, Seller2
### Warehouse admin accounts:
Admin1, Admin2

## Sql for sample users: 
INSERT INTO users(username, email, password, role) VALUES  
("Customer1",   "C1@gmail.com",   "$2b$10$YNkrduDGVwIdAv9xztWB4OxlvDSE9isdRH3bmsUUbHBFMDNrDgb6G",   "customer"),  
("Customer2",   "C2@gmail.com",   "$2b$10$lbqlmowp2Bgj.DF845kgwOLs8ehk1V8FMunpg/1PKZEYMDZXjlaa.",   "customer"),  
("Admin1",   "A1@gmail.com",   "$2b$10$qOZSoMannGm88Rm5LWGJwO.orp1D12Sj/dq5Qa5PFJnVoF2m1EsQi",   "warehouse_admin"),  
("Admin2",   "A2@gmail.com",   "$2b$10$YYF2f1hHm/FfxTUe4kX4sOGfJ9MYVXZ1iIogdzQL9wI16Znwbvkn.",   "warehouse_admin"),  
("Seller1",   "S1@gmail.com",   "$2b$10$drKiuqvlFQ0rG2EzYUB4ougEFQmcOBKiKU2zLZuiZucFUtS58lBwG",   "seller"),  
("Seller2",   "S2@gmail.com",   "$2b$10$aPmAzkDe8DZ4wMlpLBXU6e1Oylof1Q7DzhWq0RNcga7LyaQ.fy11.",   "seller"),  
("Customer3",   "C3@gmail.com",   "$2b$10$tBrtqKaedpOAWX4bo3ndzeD.RGhq657JnCiTf1AJF1CHmoz4ZYTY.",   "customer"),  
("Customer4",   "C4@gmail.com",   "$2b$10$gmv5Hdtx6Dzmy1JNaBfnlO2V4KauDN.0.JcSl2Kz958VT90xf5PkC",   "customer"),  
("Customer5",   "C5@gmail.com",   "$2b$10$4F5T3nXeBNjLApmoqWIDt.9KmvUxPo8k9AvY3kOsQpiNm3g9lkZlG",   "customer"),  
("Customer6",   "C6@gmail.com",   "$2b$10$7n9K9LUraR8W0Htx5aU/OuY34OQrebL22P5i61oF/59KbwyrIDVKG",   "customer"),  
("Customer7",   "C7@gmail.com",   "$2b$10$K7bBFiK/iUivciPbsP1vOOTwWosa3iEmA/zMpNVrJyI1Rk9ga/Qwa",   "customer");  

## Sql for sample products:
INSERT INTO product(title, description, price, image, length, width, height, seller_id, category_id) VALUES  
("iPhone 15",   "Version of Apple smartphone",   1099, "image_1694053015698.jpeg",   4, 2 , 1, 5, 10),  
("Samsung A34",   "Samsung A34 series phone",   799, "image_1694053045909.jpg" , 5, 3, 1, 5, 11),  
("Dell Laptop",   "A laptop from Dell",   1000, "image_1694053144371.jpg",   10, 8, 3, 5, 12),  
("School Desktop",   "Prebuilt desktop made for school",   2500, "image_1694053175540.jpg",   15, 8, 10, 5, 13),  
("LED monitor",   "LED monitor from Samsung",   83, "image_1694053205946.png",   15, 10, 3, 5, 14),  
("Keyboard & Mice",   "A set of a mouse and keyboard",   15, "image_1694053242345.png",   8, 4, 2, 5, 15),  
("Digital camera",   "A digital camera",   2200, "image_1694053287058.jpg",   4, 2, 2, 5, 16),  
("DSLR camera",   "A DSLR camera",   250, "image_1694053318195.jpg",   4, 2, 2, 5, 17),  
("Headphones",   "Bluetooth headphones",   30, "image_1694053342003.png",   4, 4, 3, 5, 18),  
("Bluetooth Speakers",   "Speakers connected by bluetooth",   45, "image_1694053368374.jpg",   15, 3, 3, 5, 19),  
("Earphones",   "Small earphones for business work",   50, "image_1694053399822.jpeg",   8, 6, 3, 5, 20),  
("Refrigerators",   "Refrigerator for food preservation",   500, "image_1694053432318.jpg",   30, 15, 8, 6, 21),  
("Washing Machine",   "Machine for washing clothes",   250, "image_1694053466617.png",   20, 20, 20, 6, 22),  
("Space Pirate",   "A Sci-Fi book",   15, "image_1694053507042.jpg",   8, 6, 2, 6, 23),  
("Knight's tale",   "A fantasy fiction book",   15, "image_1694053538334.jpeg",   8, 6, 2, 6, 24),  
("Nightmare on the Moon",   "A horror book",   15, "image_1694053572255.jpg",   8, 6, 2, 6, 25),  
("Heart throb",   "A thriller book",   15, "image_1694053599721.jpg",   8, 6, 2, 6, 26),  
("3 Kingdoms",   "Historical fiction book",   15, "image_1694053624699.jpg",   8, 6, 2, 6, 27),  
("Lovers at ocean's depth",   "A romace book",   15, "image_1694053653747.png",   8, 6, 2, 6, 28),  
("Life of Guy",   "An autobiography of Guy",   15, "image_1694053679703.jpg",   8, 6, 2, 6, 29),  
("Welf's deeds",   "A biography about Welf",   15, "image_1694053707623.jpg",   8, 6, 2, 6, 30),  
("Find time for yourself",   "A self-help book about self-esteem",   15, "image_1694053731424.jpg",   8, 6, 2, 6, 31);  

## Sql for sample warehouses:
INSERT INTO warehouse(name, province, city, district, street, number, total_area_volume, available_area) VALUES  
("Warehouse1",   "ProvinceA",   "CityA",   "DistrictA",   "StreetA",   1, 100000, 95829),  
("Warehouse2",   "ProvinceC",   "CityA",   "DistrictB",   "StreetB",   25, 50000, 43640),  
("Warehouse3",   "ProvinceZ",   "CityB",   "DistrictA",   "StreetC",   7, 80000, 43891);  
 
## Sql for sample inventory:
INSERT INTO inventory(product_id, warehouse_id, quantity) VALUES  
(1, 2, 15), (2, 3, 3), (2, 1, 5), (3, 2, 20), (12, 3, 10), (20, 1, 42), (21, 2, 15), (7, 3, 4), (7, 1, 4);  

## Sql for sample order and orderItem:
INSERT INTO orders(customer_id, order_date, order_status) VALUES (1, "2023-09-05 16:55:05",   "Pending");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (1, 2, 5, 1), (1, 2, 2, 3);  

INSERT INTO orders(customer_id, order_date, order_status) VALUES (2, "2023-09-06 12:45:05",   "Pending");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (2, 12, 8, 3);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (7, "2023-09-03 09:06:05",   "Accept");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (3, 20, 8, 1);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (7, "2023-09-16 20:45:05",   "Pending");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (4, 2, 8, 3);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (8, "2022-07-12 19:06:05",   "Accept");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (5, 3, 15, 2);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (8, "2022-07-12 19:06:05",   "Reject");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (6, 21, 15, 2);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (9, "2021-07-12 19:06:05",   "Accept");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (7, 2, 4, 3);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (9, "2020-04-12 19:06:05",   "Accept");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (8, 13, 10, 2);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (10, "2021-07-12 19:06:05",   "Accept");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (9, 10, 5, 1);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (11, "2021-07-12 19:06:05",   "Pending");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (10, 14, 13, 1);

INSERT INTO orders(customer_id, order_date, order_status) VALUES (11, "2021-07-12 19:06:05",   "Reject");  
INSERT INTO orderitem(order_id, product_id, quantity, warehouse_id) VALUES (11, 7, 4, 3), (11, 7, 4, 1);


# Sample data for the categories:

- Electronics  
    - Mobile Phones  
        - Apple  
        - Samsung  
    - Computers & Accessories  
        - Laptops  
        - Desktops  
        - Monitors  
        - Keyboards & Mice  
    - Cameras & Photography  
        - Digital Cameras  
        - DSLR Cameras  
    - Audio & Headphones  
        - Headphones  
        - Bluetooth Speakers  
        - Earphones  
    - Home Appliances  
        - Refrigerators  
        - Washing Machines  
- Books  
    - Fiction  
        - Science Fiction  
        - Fantasy Fiction  
        - Horror Fiction  
        - Mystery and Thriller  
        - Historical Fiction  
        - Romance Fiction  
    - Non-Fiction  
        - Autobiography & Memoir  
        - Biography  
        - Self-help  

### All categories asides from “Electronics” and “Books” each has an attribute:
- Mobile Phones: Advance Camera Technology
- Computers & Accessories: High-Performance Computing
- Cameras & Photography: High-Quality Imaging
- Audio & Headphones: Immersive Sound Experience
- Home Appliances: Efficient Household Solutions
- Fiction: Imaginative Story
- Non-Fiction: Informative Exploration
- Apple: Premium Build Quality
- Samsung: Diverse Product Range
- Laptops: Perfectly portable
- Desktops: Powerful Computing
- Monitors: High-Resolution Displays
- Keyboards & Mice: Ergonomic Design
- Digital Cameras: Compact and Versatile
- DSLR Cameras: Professional Photography
- Headphones: Noise Isolation and Sound Quality
- Bluetooth Speakers: Wireless
- Earphones: On-the-Go Audio
- Refrigerators: Food Preserving Storage
- Washing Machines: Low noise operation
- Science Fiction: Speculative Futures
- Fantasy Fiction: Magical Realms
- Horror Fiction: Suspenseful Narratives
- Mystery and Thriller: Intriguing Plots
- Historical Fiction: Historical Authenticity
- Romance Fiction: Romantic Themes
- Autobiography & Memoir: Personal Narratives
- Biography: Life Stories
- Self-help: Personal Development


# Video Demonstration of Project:
Video on the link [here](https://1drv.ms/v/s!AtiEBnA7_FxagfpHq9V1m29IusOtBA)



# Routes
post: /login

get: /logout

get: /images/:id

## customer:

post: /customers/register

get: /customers/getAllProducts (minPrice, maxPrice, search, sortField, sortOrder)

get: /customers/getProduct/:id

get: /customers/getAllOrders

get: /customers/getOrder/:id

post: /customer/addCart

post: /customer/placeOrder (will still go through for eligible product)

put: /updateStatus/:id (update order's status)

## admin:

post: /admins/register

get: /admins/categories

get: /admins/categories/:id

post: /admins/categories

put: /admins/categories/:id

delete: /admins/categories/:id (only with no products)

post: /admins/warehouses

get: /admins/warehouses/ (all warehouses)

get: /admins/warehouses/:id

put: /admins/warehouses/:id

delete: /admins/warehouses/:id (only with no products) (name)

post: admins/moveProducts

## seller:

post: /sellers/register

post: /sellers/createProduct

put: /sellers/products/:id

delete: /sellers/products/:id

get: /getAllProducts

get: /getProduct/:id

post: /sendInbound

# Category schema
Category in mongodb:

const categorySchema = new mongoose.Schema({  
    categoryId: {  
        type: Number,  
        unique: true,  
    },  
    name: {  
        type: String,  
    },  
    parent: {  
        type: mongoose.Schema.Types.ObjectId,  
        ref: "Category",  
        default: null,  
    },  
    children: [{   type: mongoose.Schema.Types.ObjectId, ref: "Category" }],  
    attributes: [  
            {  
                key: String,  
                value: mongoose.Schema.Types.Mixed,  
            },  
        ],  
});



# Contribution
| SID      | Name                 | Score |
|:---------|:---------------------|:-----:|
| s3925921 | Nguyen Dinh Khai     |   7   | 
| s3878089 | Do Nam Binh          |   6   |
| s3836454 | Nguyen Giang Huy     |   6   |
| s3878010 | Nguyen Duc Anh       |   1   |