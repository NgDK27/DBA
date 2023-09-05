const db = require("../dbconnection");
const util = require("util");
const bcrypt = require("bcrypt");
const Category = require("../models/category");
const { query } = require("express");

const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'warehouse_admin')";
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
    res.status(500).send("Error registering user");
  }
};

const createCategory = async (req, res) => {
  const { name, parentName, attributes } = req.body;

  const parentCategory = await Category.findOne({ name: parentName });

  const newCategory = new Category({
    name: name,
    parent: parentCategory ? parentCategory._id : null,
    attributes: attributes,
  });
  await newCategory.save();

  res.status(200).json(newCategory);
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
};

const getCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findOne({ categoryId: categoryId }).exec();
    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, attributes } = req.body;

  try {
    const category = await Category.findOne({ categoryId: categoryId }).exec();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      category.name = name;
    }

    if (attributes) {
      for (const updatedAttribute of attributes) {
        const existingAttribute = category.attributes.find(
          (attr) => attr.key === updatedAttribute.key
        );

        if (existingAttribute) {
          existingAttribute.value = updatedAttribute.value;
        } else {
          category.attributes.push(updatedAttribute);
        }
      }
    }

    // Save the updated category
    await category.save();

    res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

async function hasAssociatedProducts(categoryId) {
  try {
    const rows = await db.mysqlConnection.query(
      "SELECT DISTINCT category_id FROM product WHERE category_id = ?",
      [categoryId]
    );

    if (rows.length > 0) {
      return true; // There are associated products in this category
    }

    // Check child categories recursively
    const category = await Category.findOne({ categoryId: categoryId }).exec();
    const childCategories = await Category.find({
      parent: category._id,
    }).exec();
    for (const childCategory of childCategories) {
      if (await hasAssociatedProducts(childCategory.categoryId)) {
        return true; // Child category or its descendants have associated products
      }
    }

    return false; // No associated products found in this category or its children
  } catch (error) {
    throw error;
  }
}

const deleteCategory = async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const checkProduct = await hasAssociatedProducts(categoryId);

  try {
    // Check if the category or its children have associated products
    if (checkProduct) {
      return res.status(403).json({
        message:
          "Cannot delete. Products exist in this category or its children.",
      });
    }

    const category = await Category.findOne({ categoryId: categoryId }).exec();
    // No associated products, so it's safe to delete
    await Category.findByIdAndDelete(category._id).exec();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

const createWarehouse = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      province: req.body.province,
      city: req.body.city,
      district: req.body.district,
      street: req.body.street,
      number: req.body.number,
      total_area_volume: req.body.area,
      available_area: req.body.area,
    };

    let result = await db.mysqlConnection.query(
      "INSERT INTO warehouse SET ? ",
      [data],
      function (err, rows) {
        if (err) {
          res.send({
            message: "Error",
            err,
          });
        } else {
          res.send("success");
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateWarehouse = async (req, res) => {
  const warehouseId = req.params.id;
  const { name, province, city, district, street, number } = req.body;

  const updateFields = [];
  const updateValues = [];

  if (name) {
    updateFields.push("name = ?");
    updateValues.push(name);
  }
  if (province) {
    updateFields.push("province = ?");
    updateValues.push(province);
  }
  if (city) {
    updateFields.push("city = ?");
    updateValues.push(district);
  }
  if (district) {
    updateFields.push("district = ?");
    updateValues.push(district);
  }
  if (street) {
    updateFields.push("street = ?");
    updateValues.push(street);
  }
  if (number) {
    updateFields.push("number = ?");
    updateValues.push(number);
  }

  if (updateFields.length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update" });
  }

  const updateQuery = `
    UPDATE warehouse
    SET ${updateFields.join(", ")}
    WHERE warehouse_id = ?`;

  updateValues.push(warehouseId);

  db.mysqlConnection.query(updateQuery, updateValues, (error, result) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Error updating warehouse", error: error.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Warehouse not found" });
    } else {
      res.status(200).json({ message: "Warehouse updated successfully" });
    }
  });
};

const deleteWarehouse = async (req, res) => {
  let found = false;
  const name = req.query;
  const getDeleteWarehouseQuery =
    "SELECT * FROM warehouse w LEFT JOIN inventory i ON w.warehouse_id = i.warehouse_id LEFT JOIN product p ON i.product_id = p.product_id WHERE p.product_id IS NULL";
  db.mysqlConnection.query(getDeleteWarehouseQuery, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "There are no warehouse without products",
        error: error.message,
      });
    } else {
      for (const warehouse of result) {
        if (warehouse.name == JSON.parse(JSON.stringify(name)).name) {
          const deleteWarehouseQuery = "DELETE FROM warehouse WHERE name = ?";
          db.mysqlConnection.query(
            deleteWarehouseQuery,
            [JSON.parse(JSON.stringify(name)).name],
            (error, result) => {
              if (error) {
                return res.status(500).json({
                  message: "Error deleting warehouse",
                  error: error.message,
                });
              }
            }
          );
        }
      }

      if (found) {
        res.status(403).send("There are products in this warehouse");
      } else {
        res.status(200).send("Delete successfully");
      }
    }
  });
};

const getAllWarehouses = async (req, res) => {
  const query =
    "SELECT w.warehouse_id, w.name, SUM(i.quantity) AS total_quantity, w.available_area FROM warehouse w LEFT JOIN inventory i ON w.warehouse_id = i.warehouse_id LEFT JOIN product p ON i.product_id = p.product_id GROUP BY i.warehouse_id";
  db.mysqlConnection.query(query, (error, result) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Error fetching warehouses", error: error.message });
    } else {
      res.send(result);
    }
  });
};

const getWarehouse = async (req, res) => {
  const warehouseId = req.params.id;
  const query =
    "SELECT p.product_id, SUM(i.quantity) AS total_quantity, (p.length*p.width*p.height*SUM(i.quantity)) as occupied_area FROM inventory i JOIN warehouse w ON w.warehouse_id = i.warehouse_id JOIN product p ON i.product_id = p.product_id WHERE i.warehouse_id = ? GROUP BY i.warehouse_id, p.product_id";
  const availableArea =
    "SELECT w.available_area FROM warehouse w WHERE w.warehouse_id = ?";
  Promise.all([
    new Promise((resolve, reject) => {
      db.mysqlConnection.query(query, warehouseId, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
    new Promise((resolve, reject) => {
      db.mysqlConnection.query(availableArea, warehouseId, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
  ])
    .then(([result1, result2]) => {
      res.send({ result1, result2 });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving data");
    });
};

const moveProducts = async (req, res) => {
  const { sourceWarehouseId, destinationWarehouseId, productId, quantity } =
    req.body;

  try {
    const connection = await util
      .promisify(db.mysqlConnection.getConnection)
      .call(db.mysqlConnection);
    await util.promisify(connection.beginTransaction).call(connection);

    const queryAsync = util.promisify(connection.query).bind(connection);

    async function getAreaResult(productId) {
      const areaQuery =
        "SELECT (p.length * p.width * p.height) as area FROM product p WHERE p.product_id = ?";

      return new Promise((resolve, reject) => {
        db.mysqlConnection.query(areaQuery, productId, (error, result) => {
          if (error) {
            console.error("Error fetching area information:", error.message);
            reject(error);
          } else {
            const areaObject = JSON.parse(JSON.stringify(result));
            resolve(areaObject[0].area);
          }
        });
      });
    }

    (async () => {
      const productArea = await getAreaResult(productId);
      const requiredArea = productArea * quantity;

      const destinationAvailableArea = await queryAsync(
        "SELECT available_area FROM warehouse WHERE warehouse_id = ?",
        destinationWarehouseId
      );

      if (
        requiredArea >
        JSON.parse(JSON.stringify(destinationAvailableArea))[0].available_area
      ) {
        await util.promisify(connection.rollback).call(connection);
        connection.release((error) => (error ? reject(error) : resolve()));
        res.status(500).json({ message: "Not enough space" });
      } else {
        // Step 1: Update source warehouse inventory
        await queryAsync(
          "UPDATE inventory SET quantity = quantity - ? WHERE warehouse_id = ? AND product_id = ?",
          [quantity, sourceWarehouseId, productId]
        );

        // Step 2: Update destination warehouse inventory
        const existingInventoryRow = await queryAsync(
          "SELECT quantity FROM inventory WHERE warehouse_id = ? AND product_id = ?",
          [destinationWarehouseId, productId]
        );

        if (existingInventoryRow.length > 0) {
          await queryAsync(
            "UPDATE inventory SET quantity = quantity + ? WHERE warehouse_id = ? AND product_id = ?",
            [quantity, destinationWarehouseId, productId]
          );
        } else {
          await queryAsync(
            "INSERT INTO inventory (product_id, warehouse_id, quantity) VALUES (?, ?, ?)",
            [productId, destinationWarehouseId, quantity]
          );
        }

        // Next part

        await Promise.all([
          queryAsync(
            "UPDATE warehouse SET available_area = available_area + ? WHERE warehouse_id = ?",
            [requiredArea, sourceWarehouseId]
          ),
          queryAsync(
            "UPDATE warehouse SET available_area = available_area - ? WHERE warehouse_id = ?",
            [requiredArea, destinationWarehouseId]
          ),
        ]);
        // Commit the transaction
        await util.promisify(connection.commit).call(connection);

        // Release the connection
        connection.release((error) => (error ? reject(error) : resolve()));

        res.json({ message: "Products moved between warehouses." });
      }
    })();
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

module.exports = {
  registerAdmin,
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getAllWarehouses,
  getWarehouse,
  moveProducts,
};
