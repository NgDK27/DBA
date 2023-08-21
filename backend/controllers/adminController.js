const express = require("express");
const db = require("../dbconnection");
const bcrypt = require("bcrypt");
const Category = require("../models/category");
const { all } = require("../routes/customer");
const session = require("express-session");

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
    console.log(error);
    res.status(500).send("Error registering user");
  }
};

const createCatagory = async (req, res) => {
  const { id, name } = req.body;

  const newCategory = await Category.create(
    { id: id, name: name },
    { new: true }
  );
  res.status(200).json(newCategory);
};

const getAllCatagories = async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { id: categoryId },
      { name },
      { new: true }
    ).exec();

    if (updatedCategory) {
      res
        .status(200)
        .json({ message: "Category updated", category: updatedCategory });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  req.session.categoryId = req.params.id;
  const getCategoryIDQuery = "SELECT DISTINCT category_id FROM product";
  const allProductCategory = [];

  db.mysqlConnection.query(getCategoryIDQuery, async (error, result) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error deleting category", error: error.message });
    } else {
      for (const category of result) {
        allProductCategory.push(category.category_id);
      }
      console.log(allProductCategory);

      if (allProductCategory.includes(parseInt(req.session.categoryId))) {
        res.status(403).send("There are products in this category");
      } else {
        try {
          const deleteCate = await Category.deleteOne(
            {
              id: parseInt(req.session.categoryId),
            },
            { new: true }
          ).exec();

          res.status(200).send("Delete successfully");
        } catch (error) {
          res.status(500).json({
            message: "Error deleting product",
            error: error.message,
          });
        }
      }
    }
  });
};

const createWarehouse = async (req, res) => {
  try {
    var data = {
      name: req.body.name,
      province: req.body.province,
      city: req.body.city,
      district: req.body.district,
      street: req.body.street,
      number: req.body.number,
      total_area_volume: req.body.area,
    };
    console.log(data);
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
  } catch (error) {}
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
              } else {
                res.status(200).send("Delete successfully");
              }
            }
          );
        }
      }
      res.status(403).send("There are products in this warehouse");
    }
  });
};

const createInventory = async (req, res) => {
  try {
    var data = {
      product_id: req.body.product_id,
      warehouse_id: req.body.warehouse_id,
      quantity: req.body.quantity,
    };
    console.log(data);
    let result = await db.mysqlConnection.query(
      "INSERT INTO inventory SET ? ",
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
  } catch (error) {}
};

module.exports = {
  registerAdmin,
  createCatagory,
  getAllCatagories,
  updateCategory,
  deleteCategory,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  createInventory,
};
