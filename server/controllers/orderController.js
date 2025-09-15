const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const { checkCouponLogic } = require("./voucherController");
const Address = require("../models/addressBook");
const Voucher = require("../models/voucher");
const Message = require("../models/message");
const Cart = require("../models/cart");

const calculateProductDetails = (item, product) => {
  let message;
  if (product.stock >= item.quantity) {
    let shippingFee;
    const subtotal = item.quantity * product.price;
    if (product.shipFrom === "Bangladesh") {
      shippingFee = 60;
    } else shippingFee = 200;
    const total = subtotal + shippingFee;
    message = "available";
    return { message, shippingFee, subtotal, total };
  } else {
    message = "Out of Stock!";
    return message;
  }
};

const applyCoupon = (amount, coupon) => {
  if (amount.totalSubtotal < coupon.minPurchase) return amount.calTotal;
  if (coupon.discountType === "fixed") {
    return Math.max(0, amount.calTotal - coupon.discountValue);
  }
  if (coupon.discountType === "percentage") {
    const rawDiscount = (amount.totalSubtotal * coupon.discountValue) / 100;
    const cappedDiscount = coupon.maxDiscount
      ? Math.min(rawDiscount, coupon.maxDiscount)
      : rawDiscount;

    return Math.max(0, amount.calTotal - cappedDiscount);
  }
  return amount.calTotal;
};

const showOrders = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(401).json({ message: "Invalid User" });
    //get all orders from db
    const orders = await Order.find({})
      .populate("user")
      .populate("items.product")
      .lean();
    // simplify them for response
    const simplifiedOrders = await Promise.all(
      orders.map(async ({ user, items, voucher, ...rest }) => {
        let voucherDisplay = null;
        if (voucher) {
          const coupon = await Voucher.findById(voucher);
          if (coupon) {
            const type = coupon.discountType === "fixed" ? "TAKA" : "%";
            voucherDisplay =
              coupon.code + "-" + String(coupon.discountValue) + type;
          }
        }
        return {
          ...rest,
          voucher: voucherDisplay,
          user: {
            _id: user._id,
            name: user.name,
          },
          items: items.map(({ product, ...itemRest }) => ({
            ...itemRest,
            product: {
              _id: product._id,
              name: product.name,
            },
          })),
        };
      })
    );
    return res.status(200).json({ orders: simplifiedOrders });
  } catch (err) {
    res.status(501).json({ error: err.message });
    console.log("show order error");
  }
};

const createOrder = async (orderData) => {
  const user = await User.findById(orderData.user);
  if (!user) throw new Error("Only user can place an order!!!");
  const order = await Order.create(orderData);
  user.order.push(order._id);
  await user.save();
  return order._id;
};

const placeOrder = async (req, res) => {
  try {
    const { products, voucherCode, totalAmount, shippingAddressId } =
      req.body.order;
    const prevRoute = req.body.prevRoute;
    const productIdsToRemove = [];

    // convert address into json
    const address = await Address.findById(shippingAddressId).lean();
    const {
      _id,
      user,
      createdAt,
      updatedAt,
      __v,
      isDefault,
      ...shippingAddress
    } = address;

    //check for valid vouchar
    let validVouchar = {};
    if (voucherCode !== "") {
      validVouchar = await checkCouponLogic(voucherCode);
    }

    // check wether the products are valid or not.
    const validProducts = await Promise.all(
      products.map(async (item) => {
        try {
          const product = await Product.findById(item.product);
          const { message, shippingFee, subtotal, total } =
            calculateProductDetails(item, product);
          productIdsToRemove.push(product._id.toString());
          return {
            product: product._id,
            name: product.name,
            size: item.size,
            color: item.color,
            unitPrice: product.price,
            quantity: item.quantity,
            message,
            shippingFee,
            subtotal,
            total,
            deliveryDate: new Date(
              Date.now() + product.estDelivaryTime * 24 * 60 * 60 * 1000
            ),
          };
        } catch (error) {
          return { message: "Product is unavilable." };
        }
      })
    );

    // calculate total on valid products
    const summary = validProducts.reduce(
      (acc, curr) => {
        acc.totalSubtotal += curr.subtotal;
        acc.totalShippingFee += curr.shippingFee;
        acc.calTotal += curr.total;
        return acc;
      },
      { totalSubtotal: 0, totalShippingFee: 0, calTotal: 0 }
    );

    //check the calculated total with given total
    const validTotal = applyCoupon(summary, validVouchar);
    if (validTotal !== totalAmount)
      return res.status(400).json({ message: "Invalid total amount" });

    // change the valid products accrodingly for order
    const productNames = [];
    let maxDeliveryDate = null;
    const items = await validProducts.map((item) => {
      const {
        product,
        size,
        color,
        unitPrice,
        quantity,
        name,
        deliveryDate,
        ...rest
      } = item;

      const currentDate = deliveryDate;
      if (!maxDeliveryDate || currentDate > maxDeliveryDate) {
        maxDeliveryDate = currentDate;
      }
      productNames.push(name);
      return { product, size, color, unitPrice, quantity, deliveryDate };
    });
    const data = {
      user: req.user._id,
      voucher: validVouchar ? validVouchar._id : null,
      items,
      shippingAddress: shippingAddress,
      totalAmount: validTotal,
      deliveryDate: maxDeliveryDate,
    };
    const orderId = await createOrder(data);

    //if the products are from user cart, clear the ordered cart items
    if (prevRoute === "cart") {
      const cart = await Cart.findOne({ user: req.user._id });
      cart.items = cart.items.filter(
        (item) => !productIdsToRemove.includes(item.product.toString())
      );
      await cart.save();
    }

    return res
      .status(200)
      .json({ message: "order placed!", orderId, productNames });
  } catch (error) {
    console.log("place-order-error");
    return res.status(403).json({ message: error.message, error });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;

    //check for valid order for cancellation and delete it.
    const order = await Order.findById(orderId);
    if (order.status === "placed" && order.paymentStatus === "pending") {
      await order.deleteOne();

      //remove related message
      const deletedMessage = await Message.findOneAndDelete({ Link: orderId });
      if (deletedMessage) {
        await User.findByIdAndUpdate(req.user._id, {
          $pull: { order: orderId, message: deletedMessage._id },
        });
      }
      return res
        .status(200)
        .json({ message: "Order Cancelled", cancelled: true });
    }

    //give res for invalid cancellation req
    return res.status(200).json({
      message:
        "You can't cancel this order. Please Contact with customer care.",
      cancelled: false,
    });
  } catch (error) {
    console.log("cancel-order-error");
    return res.status(403).json({ message: error.message, error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Invalid User!" });
    const orderId = req.body.orderId;

    // delete Order
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "order not found!" });
    }

    // restore paid order
    if (deletedOrder.paymentMethod === "paid") {
      await Order.create(deletedOrder);
      return res.status(400).json({ message: "Paid order can't be deleted!" });
    }

    // remove related message if needed
    if (deletedOrder.paymentMethod === "processing") {
      const deletedMessage = await Message.findOneAndDelete({ Link: orderId });
      if (deletedMessage) {
        await User.findByIdAndUpdate(deletedOrder.user, {
          $pull: { order: orderId, message: deletedMessage._id },
        });
        return res
          .status(200)
          .json({ message: "Order deleted and message removed from user." });
      }
    }

    // remove order from user
    await User.findByIdAndUpdate(deletedOrder.user, {
      $pull: { order: orderId },
    });

    return res.status(200).json({ message: "Order Deleted!" });
  } catch (error) {
    console.log("delete-order-error");
    return res.status(403).json({ message: error.message, error });
  }
};

const editOrder = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(401).json({ message: "Invalid User" });
    const { orderId, updates } = req.body;
    // check for orderId and update fields
    if (!orderId || !updates || typeof updates !== "object") {
      return res.status(400).json({ message: "Invalid request data." });
    }
    // Only allow certain fields to be updated
    const allowedFields = [
      "deliveryDate",
      "status",
      "paymentStatus",
      "paymentMethod",
      "paidAmount",
      "trackingNumber",
    ];
    //validate the update fields
    const filteredUpdates = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    }
    //update
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: filteredUpdates },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }
    return res.status(200).json({ message: "Order updated!" });
  } catch (error) {
    console.log("edit order error");
    return res.status(403).json({ message: error.message, error });
  }
};

module.exports = {
  placeOrder,
  showOrders,
  createOrder,
  deleteOrder,
  editOrder,
  cancelOrder,
};
