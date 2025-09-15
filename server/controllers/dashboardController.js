const Order = require("../models/order");
const User = require("../models/user");
const Archive = require("../models/archive");
const Product = require("../models/product");
const Category = require("../models/category");
const Voucher = require("../models/voucher");

const showUsers = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "forbidden" });
    // show name, email, phone, current order count, total order count
    const users = await User.aggregate([
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          currentOrdersCount: {
            $size: { $ifNull: ["$order", []] },
          },
          totalOrders: {
            $add: [
              { $size: { $ifNull: ["$order", []] } },
              { $size: { $ifNull: ["$previousOrder", []] } },
            ],
          },
        },
      },
      { $sort: { totalOrders: -1 } }, // sort by totalOrders descending
    ]);
    return res.status(200).json({ users: users });
  } catch (error) {
    console.log("show user error");
    return res.status(404).json({ message: error.message });
  }
};

const showAnalytics = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "forbidden" });
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthFilter = {
      $gte: startOfLastMonth,
      $lt: startOfThisMonth,
    };

    const [
      totalUsers,
      lastMonthUsers,
      totalCompletedOrders,
      lastMonthCompletedOrders,
      totalCurrentOrders,
      lastMonthIncompletedOrders,
      totalNumberOfProducts,
      lastMonthAddedProducts,
      totalNumberOfCategories,
      voucherStats,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        completedAt: lastMonthFilter,
      }),
      Archive.countDocuments({ status: "delivered" }),
      Archive.countDocuments({
        status: "delivered",
        completedAt: lastMonthFilter,
      }),
      Order.countDocuments({ paymentMethod: { $ne: "processing" } }),
      Order.countDocuments({
        paymentMethod: { $ne: "processing" },
        createdAt: lastMonthFilter,
      }),

      Product.countDocuments(),
      Product.countDocuments({
        completedAt: lastMonthFilter,
      }),
      Category.countDocuments(),
      Voucher.aggregate([
        {
          $group: {
            _id: "$isActive",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);
    // Format voucher counts
    let activeVouchers = 0;
    let inactiveVouchers = 0;
    voucherStats.forEach((v) => {
      if (v._id === true) activeVouchers = v.count;
      else inactiveVouchers = v.count;
    });

    // Final dashboard object
    const result = {
      totalUsers,
      lastMonthUsers,
      totalCompletedOrders,
      lastMonthCompletedOrders,
      totalCurrentOrders,
      lastMonthIncompletedOrders,
      totalNumberOfProducts,
      lastMonthAddedProducts,
      totalNumberOfCategories,
      activeVouchers,
      inactiveVouchers,
    };

    return res.status(200).json({ analytics: result });
  } catch (error) {
    console.log("show analytics error");
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  showAnalytics,
  showUsers,
};
