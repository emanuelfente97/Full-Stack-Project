const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/product");

// Getting all
router.get("/", auth, async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //Getting One 
  router.get("/:id", [auth, getProduct] , (req, res, next) => {
    res.send(res.product);
  });

  //Creating 
  router.post("/", auth, async (req, res, next) => {
    const { name, price, category, img } = req.body;
  
    let product;
    img
      ? (product = new Product({
          name,
          price,
          category,
          author: req.user._id,
          img,
        }))
      : (product = new Product({
        name,
        price,
        category,
          author: req.user._id,
        }));
    try {
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  //Update
  router.put("/:id", [auth, getProduct], async (req, res, next) => {
    if (req.user._id !== res.product.author)
      res
        .status(400)
        .json({ message: "You do not have the permission to update this product" });
    const { title, body, img } = req.body;
    if (title) res.product.title = title;
    if (body) res.product.body = body;
    if (img) res.product.img = img;
  
    try {
      const updatedProduct = await res.product.save();
      res.status(201).send(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  //Deleting a Product 
  router.delete("/:id", [auth, getProduct], async (req, res, next) => {
    if (req.user._id !== res.product.author)
      res
        .status(400)
        .json({ message: "You do not have the permission to delete this product" });
    try {
      await res.product.remove();
      res.json({ message: "Deleted product" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

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
module.exports = router