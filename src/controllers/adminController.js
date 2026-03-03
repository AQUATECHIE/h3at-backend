import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/Users.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    // Total Revenue
    const totalRevenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue =
      totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Users
    const totalUsers = await User.countDocuments({ role: "user" });

    // Revenue per month (last 6 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};