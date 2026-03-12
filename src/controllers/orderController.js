import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* ================================
   USER ORDER (LOGGED IN)
================================ */

export const createOrder = async (req, res) => {
  try {

    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {

      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }

      product.stock -= item.quantity;
      await product.save();

      const price = product.finalPrice || product.price;

      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: price,
        image: product.images?.[0]?.url,
        quantity: item.quantity,
        selectedSize: item.selectedSize
      });

    }

    const shipping = 2000;
    const totalAmount = subtotal + shipping;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      subtotal,
      shipping,
      totalAmount
    });

    /* CLEAR CART */

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.status(201).json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


/* ================================
   GUEST ORDER
================================ */

export const createGuestOrder = async (req, res) => {

  try {

    const { shippingAddress, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items provided"
      });
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of items) {

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }

      product.stock -= item.quantity;

      await product.save();

      const price = product.finalPrice || product.price;

      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: price,
        image: product.images?.[0]?.url,
        quantity: item.quantity,
        selectedSize: item.selectedSize
      });

    }

    const shipping = 2000;
    const totalAmount = subtotal + shipping;

    const order = await Order.create({

      guestEmail: shippingAddress.email,

      orderItems,
      shippingAddress,
      subtotal,
      shipping,
      totalAmount

    });

    res.status(201).json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


/* ================================
   USER ORDERS
================================ */

export const getMyOrders = async (req, res) => {

  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(orders);

};


/* ================================
   ADMIN UPDATE ORDER STATUS
================================ */

export const updateOrderStatus = async (req, res) => {

  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  order.status = status;

  await order.save();

  res.json({
    message: "Order status updated",
    order
  });

};


/* ================================
   ADMIN GET ALL ORDERS
================================ */

export const getAllOrders = async (req, res) => {

  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);

};