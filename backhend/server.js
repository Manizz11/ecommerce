import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const port = 4000;
const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Starting server...");

app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect("mongodb+srv://manishbogati:Manish123@cluster0.nqgdaw1.mongodb.net/e-commerce")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Basic route
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Start server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error : " + error);
  }
});

// Image storage engine
const storage = multer.diskStorage({
  destination: path.join(__dirname, "upload/images"),
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Serve static images
app.use("/images", express.static(path.join(__dirname, "upload/images")));

// Upload endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Product schema & model
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Add product endpoint
app.post("/addproduct", async (req, res) => {
  const products = await Product.find({});
  let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const product = new Product({
    id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({ success: true, name: req.body.name });
});

// Remove product endpoint
app.post("/removeproduct", async (req, res) => {
  const result = await Product.findOneAndDelete({ id: req.body.id });
  if (result) {
    console.log("Removed Product with ID:", req.body.id);
    res.json({ success: true, message: `Product with ID ${req.body.id} removed successfully` });
  } else {
    res.json({ success: false, message: `Product with ID ${req.body.id} not found` });
  }
});

// Get all products
app.get("/allproducts", async (req, res) => {
  const products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

// User schema & model
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// Signup endpoint
app.post("/signup", async (req, res) => {
  const check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "existing user found with same email address" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = { user: { id: user.id } };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// Login endpoint
app.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password; // Note: plain text passwords are insecure!
    if (passCompare) {
      const data = { user: { id: user.id } };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email Id" });
  }
});

// New collections endpoint
app.get("/newcollections", async (req, res) => {
  const products = await Product.find({});
  const newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newcollection);
});

// Popular in women endpoint
app.get("/popularinwomen", async (req, res) => {
  const products = await Product.find({ category: "women" });
  const popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});

// Middleware to fetch user by token
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "please authenticate using a valid token" });
  }
};

// Add to cart endpoint
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("Added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});

// Remove from cart endpoint
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
});

// Get cart data endpoint
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});
