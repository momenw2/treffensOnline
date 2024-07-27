const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  name: String,
  email: String,
  city: String,
  address: String,
  phoneNumber: String,
  items: [
    {
      itemName: String,
      itemSize: String,
      itemQuantity: String,
      itemPrice: String,
    },
  ],
  totalOrderPrice: String,
  orderProgress: String,
});

const order = mongoose.model("order", orderSchema);

module.exports = order;
