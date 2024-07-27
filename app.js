const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.URI).then(() => {
  app.listen(PORT, () => {
    console.log("server started on port " + PORT + "...");
  });

  console.log("Mongodb connected....");
});

app.get("/", (req, res) => res.render("home"));
app.get("/About-Us", (req, res) => res.render("aboutUs"));
app.get("/product", (req, res) => res.render("productPage"));
app.get("/item", (req, res) => res.render("itemPage"));
app.get("/checkout", (req, res) => res.render("checkoutPage"));
app.get("/confirmation", (req, res) => res.render("confirmationPage"));
app.get("/sizechart", (req, res) => res.render("sizeChart"));
app.get("/privacyPolicy", (req, res) => res.render("privacyPolicyPage"));
app.get("/shipping", (req, res) => res.render("shippingPage"));
app.get("/AdminDB", (req, res) => res.render("adminPage"));
app.get("/AdminOD", (req, res) => res.render("adminOrderDetails"));

// Product Router
const productRoutes = require("./Routes/product.router");
app.use("/productBCK", productRoutes);

// Order Router
const orderRoutes = require("./Routes/order.router");
app.use("/orderBCK", orderRoutes);

//Error Handler
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
