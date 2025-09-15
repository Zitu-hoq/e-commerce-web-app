const Order = require("../models/order");
const User = require("../models/user");
const Archive = require("../models/archive");

const addToArchive = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Invalid User!" });
    const { orderId, orderData } = req.body;
    //check for valid req
    if (!orderId || !orderData)
      return res.status(400).json({ message: "Invalid Request!" });
    if (
      orderData.paymentMethod === "processing" ||
      !["delivered", "cancelled"].includes(orderData.status)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid order status or payment method!" });
    }
    //delete order
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    //add to archive and update user
    const archiveOrder = await Archive.create(orderData);
    const user = await User.findByIdAndUpdate(
      orderData.user,
      {
        $pull: { order: orderId },
        $push: { previousOrder: archiveOrder._id },
      },
      { new: true }
    );
    return res.status(200).json({ message: "order added to archive!" });
  } catch (error) {
    console.log("add to archive error");
    return res.status(400).json({ message: error.message, error });
  }
};

module.exports = {
  addToArchive,
};
