import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {

  const { productId, quantity, selectedSize } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock available" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      totalAmount: 0
    });
  }

  const itemIndex = cart.items.findIndex(
    item =>
      item.product.toString() === productId &&
      item.selectedSize === selectedSize
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      selectedSize
    });
  }

  let total = 0;

  for (const item of cart.items) {
    const prod = await Product.findById(item.product);
    total += prod.price * item.quantity;
  }

  cart.totalAmount = total;

  await cart.save();

  res.json(cart);

};

// get user cart 
export const getUserCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product");

  if (!cart) {
    return res.json({ items: [], totalAmount: 0 });
  }

  res.json(cart);
};

// update quantity

export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not in cart" });
  }

  item.quantity = quantity;

  let total = 0;

  for (const item of cart.items) {
    const prod = await Product.findById(item.product);
    total += prod.price * item.quantity;
  }

  cart.totalAmount = total;

  await cart.save();

  res.json(cart);
};

// remove item 

export const removeCartItem = async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  let total = 0;

  for (const item of cart.items) {
    const prod = await Product.findById(item.product);
    total += prod.price * item.quantity;
  }

  cart.totalAmount = total;

  await cart.save();

  res.json(cart);
};