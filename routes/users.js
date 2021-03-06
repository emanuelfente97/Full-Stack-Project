require("dotenv").config();

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const { getUser, getProduct } = require("../middleware/finders");

// const Users = [];
// Getting all
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Getting One
router.get("/:id", getUser, (req, res, next) => {
  res.send(res.user);
});

// Creating one
router.post("/", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword);
    const user = new User({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
      contact: req.body.contact,
    });
    const newUser = await user.save();
    // user.push(user)
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Log in with email and password

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) res.status(404).json({ message: "Could not find user" });
  if (await bcrypt.compare(password, user.password)) {
    try {
      const access_token = jwt.sign(
        JSON.stringify(user),
        process.env.JWT_SECRET_KEY
      );
      res.status(201).json({ jwt: access_token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(400)
      .json({ message: "Email and password combination do not match" });
  }
});

// Updating One
router.put("/:id", getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.contact != null) {
    res.user.contact = req.body.contact;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted user " });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Carts
//getting all items in cart
router.get("/:id/cart",[auth, getUser] ,async (req, res, next) => {
  try {
    res.json(res.user.cart);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

//Adding an item
router.post("/:id/cart", [auth, getProduct], async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const inCart = user.cart.some((prod) => prod._id == req.params.id);
  if (inCart) {
    product.quantity += req.body.quantity;
    const updatedUser = await user.save();
    try {
      res.status(201).json(updatedUser.cart);
    } catch (error) {
      res.status(500).json(console.log(error));
    }
  } else {
    try {
      let product_id = res.product._id;
      let name = res.product.name;
      let category = res.product.category;
      let img = res.product.img;
      let price = res.product.price;
      let quantity = req.body;
      let created_by = req.user._id;
      user.cart.push({
        product_id,
        name,
        category,
        img,
        price,
        quantity,
        created_by,
      });
      const updatedUser = await user.save();
      res.status(201).json(updatedUser.cart);
    } catch (error) {
      res.status(500).json(console.log(error));
    }
  }
});
//updates the items in the users cart
router.put("/:id/cart", [auth, getProduct],
  async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const inCart = user.cart.some((prod) => prod.product_id == req.params.id);
    console.log(inCart);

    if (inCart) {
      try {
        const product = user.cart.find(
          (prod) => prod.product_id == req.params.id
        );
        product.quantity = req.body.quantity;
        user.cart.quantity = product.quantity;
        user.markModified("cart");
        const updatedUser = await user.save();
        console.log(updatedUser);
        res.status(201).json(updatedUser.cart);
      } catch (error) {
        res.status(500).json(console.log(error));
      }
    }
  }
);
//Deleting in user cart
router.delete("/:id/cart", [auth, getProduct], async (req, res, next) => {});

module.exports = router;
