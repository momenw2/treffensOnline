const express = require("express");
const router = express.Router();
const Order = require("../Models/order.model");

// Route to get all orders or filter by phone number
router.get("/", async (req, res, next) => {
  try {
    const { phoneNumber } = req.query;
    const query = phoneNumber
      ? { phoneNumber: { $regex: phoneNumber, $options: "i" } }
      : {};
    const result = await Order.find(query);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Route to get a specific order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Add a new order
router.post("/", async (req, res, next) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Update order progress
router.put("/:id", async (req, res) => {
  try {
    const { orderProgress } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderProgress },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to update order progress" });
  }
});

module.exports = router;
