const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());

// Create a transporter object with SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Enable debugging
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log("Server started on port " + PORT + "...");
});

// Route for rendering various pages
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

// Handle POST request to send order confirmation email
app.post("/sendOrderEmail", (req, res) => {
  console.log("Request received:", req.body); // Log request data

  const { name, email, city, address, phoneNumber, items, totalOrderPrice } =
    req.body;

  // Validate required fields
  if (
    !name ||
    !email ||
    !city ||
    !address ||
    !phoneNumber ||
    !items ||
    !totalOrderPrice
  ) {
    return res.status(400).send("Missing required fields");
  }

  // Create email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "treffens.co@gmail.com",
    subject: "New Order Confirmation",
    html: `
      <h2>Order Confirmation</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <h3>Items:</h3>
      <ul>
        ${items
          .map(
            (item) => `
          <li>
            <strong>${item.itemName}</strong> (${item.itemSize}) - ${item.itemQuantity} x ${item.itemPrice} EGP
          </li>
        `
          )
          .join("")}
      </ul>
      <h4>Total Order Price: ${totalOrderPrice} EGP</h4>
    `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Email sent successfully");
  });
});

// Error Handler for 404 Not Found
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

// Error Handler for other errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
