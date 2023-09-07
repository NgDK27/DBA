const db = require("../dbconnection");
const moment = require("moment");
const util = require("util");
const bcrypt = require("bcrypt");
const Category = require("../models/category");

const registerCustomer = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'customer')";
    db.mysqlConnection.query(
      query,
      [username, email, hashedPassword],
      (error, results) => {
        if (error) {
          res.status(500).send("Error registering user");
        } else {
          res.status(201).send("Registration successful");
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Error registering user");
  }
};

const getCategoryName = async (categoryId) => {
  try {
    const category = await Category.findOne({ categoryId: categoryId });

    return category.name;
  } catch (error) {
    console.error("Error fetching category name:", error);
    return null;
  }
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
};

const getCategoryAttributes = async (categoryId, attributes = []) => {
  const category = await Category.findOne({ categoryId: categoryId }).exec();
  if (!category) return attributes;

  attributes = [...attributes, ...category.attributes];
  if (category.parent) {
    return getCategoryAttributes(category.parent.categoryId, attributes);
  }

  return attributes;
};

const getAllProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, search, sortField, sortOrder, category } =
      req.query;

    // Create a function to recursively find all child category IDs
    const allChildCategoryIds = async (categoryId) => {
      const category = await Category.findOne({ _id: categoryId });
      const categoryIds = [category.categoryId];
      const childCategories = await Category.find({
        parent: category._id,
      }).exec();

      for (const childCategory of childCategories) {
        const childIds = await allChildCategoryIds(childCategory._id);
        categoryIds.push(...childIds);
      }

      return categoryIds;
    };

    let query =
      "SELECT p.product_id, p.title, p.description, p.price, p.image, p.category_id, SUM(i.quantity) AS available_quantity, u.username AS seller FROM product p LEFT JOIN inventory i ON p.product_id = i.product_id JOIN users u ON p.seller_id = u.user_id";
    const queryParams = [];

    const conditions = [];

    if (category) {
      const categoryP = await Category.findOne({ categoryId: category });
      // Get all category IDs based on the provided category and its children
      const categoryIds = await allChildCategoryIds(categoryP._id);
      if (categoryIds.length > 0) {
        // Generate a string of placeholders for the IN clause
        const placeholders = categoryIds.map(() => "?").join(", ");
        conditions.push(`p.category_id EXISTS (${placeholders})`);
        queryParams.push(...categoryIds);
      }
    }

    if (minPrice && maxPrice) {
      conditions.push("p.price BETWEEN ? AND ?");
      queryParams.push(parseInt(minPrice), parseInt(maxPrice));
    } else if (minPrice) {
      conditions.push("p.price >= ?");
      queryParams.push(parseInt(minPrice));
    } else if (maxPrice) {
      conditions.push("p.price <= ?");
      queryParams.push(parseInt(maxPrice));
    }

    if (search) {
      conditions.push("(title LIKE ? OR description LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Combine conditions with 'AND'
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " GROUP BY p.product_id, p.title, p.description, p.price, p.image";

    if (sortField && (sortOrder === "ASC" || sortOrder === "DESC")) {
      query += ` ORDER BY ${sortField} ${sortOrder}`;
    }

    // Execute the SQL query
    db.mysqlConnection.query(query, queryParams, (error, results) => {
      if (error) {
        throw error;
      }

      const getProductData = async (results) => {
        const productData = [];

        for (const product of results) {
          const category = await getCategoryName(product.category_id);
          productData.push({
            product_id: product.product_id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
            category: category,
            quantity: product.available_quantity || 0,
            seller: product.seller,
          });
        }

        return productData;
      };

      getProductData(results)
        .then((productData) => {
          res.status(200).json(productData);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          res
            .status(500)
            .json({ message: "Error fetching products", error: error.message });
        });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

const getProduct = async (req, res) => {
  const productId = req.params.id;
  const query =
    "SELECT p.product_id, p.title, p.description, p.price, p.image, p.category_id, SUM(i.quantity) AS available_quantity, u.username AS seller FROM product p LEFT JOIN inventory i ON p.product_id = i.product_id JOIN users u ON p.seller_id = u.user_id WHERE p.product_id = ? GROUP BY p.product_id, p.title, p.description, p.price, p.image";
  db.mysqlConnection.query(query, productId, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error fetching product", error: error.message });
    } else {
      const getProductData = async (results) => {
        const productData = [];

        for (const product of results) {
          const category = await getCategoryName(product.category_id);
          const attributes = await getCategoryAttributes(product.category_id);

          productData.push({
            product_id: product.product_id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
            category: category,
            quantity: product.available_quantity || 0,
            seller: product.seller,
            attributes: attributes,
          });
        }

        return productData;
      };

      getProductData(results)
        .then((productData) => {
          res.status(200).json(productData);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          res
            .status(500)
            .json({ message: "Error fetching products", error: error.message });
        });
    }
  });
};

async function checkInvenQuantity(productId) {
  const query =
    "SELECT SUM(quantity) AS quantity FROM inventory WHERE product_id = ?";
  const results = new Promise((resolve, reject) => {
    db.mysqlConnection.query(query, productId, (error, results) => {
      if (error) {
        console.error("error: " + error.stack);
        reject(error);
        return;
      }
      resolve(results);
    });
  });
  return results;
}

const addCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const totalQuantity = await checkInvenQuantity(productId);

  if (
    Number(quantity) > JSON.parse(JSON.stringify(totalQuantity))[0].quantity
  ) {
    res.status(400).json({ message: "Not enough product in stock" });
  } else {
    if (!global.cart) {
      global.cart = [];
      // Add the product to the cart (in-memory representation)
      global.cart.push({ productId, quantity });
      res.json({ message: "Product added to cart" });
    } else {
      const existProduct = global.cart.find(
        (obj) => obj.productId === productId
      );
      if (existProduct) {
        const productToUpdate = global.cart.find(
          (obj) => obj.productId === productId
        );
        const oldQuantity = parseInt(
          global.cart.find((obj) => obj.productId === productId)?.quantity || 0
        );

        if (
          oldQuantity + Number(quantity) >
          JSON.parse(JSON.stringify(totalQuantity))[0].quantity
        ) {
          res.status(400).json({ message: "Not enough product in stock" });
        } else {
          productToUpdate.quantity = oldQuantity + Number(quantity);
          res.json({ message: "Product added to cart" });
        }
      } else {
        global.cart.push({ productId, quantity });
        res.json({ message: "Product added to cart" });
      }
    }
  }
  console.log(global.cart);
};

const placeOrder = async (req, res) => {
  const customerId = req.session.userid;
  try {
    const connection = await util
      .promisify(db.mysqlConnection.getConnection)
      .call(db.mysqlConnection);
    await util.promisify(connection.beginTransaction).call(connection);

    const queryAsync = util.promisify(connection.query).bind(connection);

    // Begin a transaction

    const eligibleProducts = [];
    const ineligibleProducts = [];

    for (const cartItem of global.cart) {
      const { productId, quantity } = cartItem;

      const availableQuantityResult = await checkInvenQuantity(productId);

      const availableQuantity = JSON.parse(
        JSON.stringify(availableQuantityResult)
      )[0].quantity;

      if (availableQuantity >= quantity) {
        // Product is eligible for the order
        eligibleProducts.push({ productId, quantity });
      } else {
        // Product is ineligible due to insufficient quantity
        ineligibleProducts.push({ productId, quantity, availableQuantity });
      }
    }

    const added_time = moment().format("YYYY-MM-DD HH:mm:ss");

    await queryAsync(
      "INSERT INTO orders (customer_id, order_date, order_status) VALUES (?, ?, ?)",
      [customerId, added_time, "Pending"]
    );

    const orderIdResult = await queryAsync(
      "SELECT LAST_INSERT_ID() as order_id"
    );
    const orderId = JSON.parse(JSON.stringify(orderIdResult))[0].order_id;

    for (const cartItem of eligibleProducts) {
      const { productId, quantity } = cartItem;
      console.log(cartItem);

      // Update inventory quantity
      await queryAsync("CALL PlaceOrder(? , ?, ?)", [
        orderId,
        productId,
        quantity,
      ]);
    }

    await util.promisify(connection.commit).call(connection);
    connection.release((error) => (error ? reject(error) : resolve())); // Release the connection back to the pool

    // Clear the cart
    global.cart = [];

    const response = {
      message: "Order placed successfully",
      eligibleProducts,
      ineligibleProducts,
    };

    res.json(response);
  } catch (error) {
    console.error("Error:", error);

    // Rollback the transaction and release the connection in case of an error
    if (connection) {
      await util.promisify(connection.rollback).call(connection);
      connection.release((error) => (error ? reject(error) : resolve()));
    }

    res.status(500).json({ message: "An error occurred." });
  }
};

const getAllOrders = async (req, res) => {
  const customerId = req.session.userid;
  const query = "SELECT * FROM orders WHERE customer_id = ?";
  db.mysqlConnection.query(query, customerId, (error, result) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Error fetching orders", error: error.message });
    } else {
      res.send(result);
    }
  });
};

const getOrder = async (req, res) => {
  const orderId = req.params.id;
  const customerId = req.session.userid;

  const query =
    "SELECT oi.product_id, oi.quantity FROM orders o JOIN orderItem oi ON o.order_id = oi.order_id WHERE o.customer_id = ? AND o.order_id = ?";
  db.mysqlConnection.query(query, [customerId, orderId], (error, result) => {
    if (error) {
      res.status(500).json({
        message: `Error fetching order${orderId}`,
        error: error.message,
      });
    } else {
      res.send(result);
    }
  });
};

const updateStatus = async (req, res) => {
  const orderId = req.params.id;
  const { newStatus } = req.body;
  try {
    await db.mysqlConnection.query("CALL UpdateStatus(?, ?)", [
      orderId,
      newStatus,
    ]);
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = {
  registerCustomer,
  getAllProducts,
  getProduct,
  getCategoryName,
  getAllCategories,
  getCategoryAttributes,
  getAllOrders,
  getOrder,
  addCart,
  placeOrder,
  updateStatus,
};
