const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");

const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(204).send({ message: "Empty cart" });
    cart.items = cart.items.reverse();
    return res.status(200).json({ cart: cart.items, message: "ok" });
  } catch (error) {
    console.log("get-cart-error");
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product, quantity, size, color } = req.body;
    const userId = req.user._id;
    //check for valid product
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res
        .status(404)
        .json({ message: "Product not found in the server!" });
    }
    //check for existing cart for user
    let cart = await Cart.findOne({ user: userId });
    const newItem = { product, quantity, size, color };
    // create new cart for user
    if (!cart) {
      cart = new Cart({ user: userId, items: [newItem] });
      await cart.save();
      const user = await User.findById(userId);
      user.cart = cart._id;
      await user.save();
    } else {
      //update product specification on existing cart product
      const index = cart.items.findIndex(
        (item) => item.product.toString() === product
      );
      if (index > -1) {
        cart.items[index].color = color; // update color
        cart.items[index].size = size; // update size
        cart.items[index].quantity += quantity; // update quantity if same product/size/color
      } else {
        // add product on existing cart
        cart.items.push(newItem);
      }
    }
    await cart.save();
    await cart.populate("items.product");
    return res.status(200).json({
      message: "Product added to cart",
      cart: [...cart.items].reverse(), // return newly added items first
    });
  } catch (error) {
    console.log("add-to-cart-error");
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateCart = async (req, res) => {
  try {
    const updateItem = req.body;
    const userId = req.user._id;
    //check for cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Item not found" });
    } else {
      //update cart
      const index = cart.items.findIndex(
        (item) => item.product.toString() === updateItem.product._id
      );
      if (index > -1) {
        cart.items[index].color = updateItem.color; // update color
        cart.items[index].size = updateItem.size; // update size
        cart.items[index].quantity = updateItem.quantity; // update quantity if same product/size/color
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
      }
    }
    await cart.save();
    await cart.populate("items.product");
    res
      .status(200)
      .json({ cart: [...cart.items].reverse(), message: "Cart updated" });
  } catch (error) {
    console.log("update-cart-error");
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;
    //check for cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    //remove product from cart
    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId)
    );
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json({
      message: "Product removed from cart",
      cart: [...cart.items].reverse(),
    });
  } catch (error) {
    console.log("remove-from-cart-error");
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCartItems, addToCart, updateCart, removeFromCart };
