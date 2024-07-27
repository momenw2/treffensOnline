const express = require("express");
const router = express.Router();
const Product = require("../Models/product.model");

router.get("/item", async (req, res, next) => {
  const { category, name } = req.query;

  try {
    // Find the product with the specified category and name
    const product = await Product.findOne(
      { category, "categoryData.name": name },
      { "categoryData.$": 1 }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Send the product data as the response
    res.json(product.categoryData[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res, next) => {
  try {
    const result = await Product.find();
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

// Add a new topic
router.post("/", async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const result = await product.save();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
