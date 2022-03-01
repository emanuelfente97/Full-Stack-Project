const User = require("../models/user");
const Product = require("../models/product");

//Find Schema for user
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);

    if (!user) res.status(404).json({ message: "Could not find user" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

//Find Schema for products
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);

    if (!product) res.status(404).json({ message: "Could not find user" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.product = product;
  next();
}

module.exports = { getUser, getProduct };
