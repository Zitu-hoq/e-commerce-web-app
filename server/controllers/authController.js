const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Message = require("../models/message");

async function cleanupOldMessagesForUser(userId) {
  try {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 min ago

    // Find all old message IDs for this user
    const oldMessages = await Message.find({
      _id: { $in: await User.findById(userId).distinct("message") },
      createdAt: { $lte: cutoff },
    }).select("_id Link");

    if (!oldMessages.length) return;

    const oldMessageIds = oldMessages.map((m) => m._id);
    const linkedOrderIds = oldMessages.map((m) => m.Link).filter(Boolean);

    // Find "processing" orders among linked ones
    const processingOrders = await Order.find({
      _id: { $in: linkedOrderIds },
      paymentMethod: "processing",
    }).select("_id");

    const processingOrderIds = processingOrders.map((o) => o._id);

    // Delete all old messages in one go
    await Message.deleteMany({ _id: { $in: oldMessageIds } });

    // Delete all "processing" orders in one go
    if (processingOrderIds.length) {
      await Order.deleteMany({ _id: { $in: processingOrderIds } });
    }

    // Pull all deleted IDs from the user's arrays in one update
    await User.updateOne(
      { _id: userId },
      {
        $pull: {
          messages: { $in: oldMessageIds },
          orders: { $in: processingOrderIds },
        },
      }
    );
  } catch (err) {
    console.log("Error in cleanup old messages");
  }
}

const authenticate = async (req, res, next) => {
  //check for jwt token
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let id;
    if (decoded.admin) {
      id = decoded.admin._id;
    } else {
      id = decoded.user._id;
    }
    //check for user
    let user = await User.findById(id)
      .select("-password")
      .populate("addresses")
      .populate("message")
      .populate({
        path: "order",
        populate: [
          {
            path: "items",
            populate: { path: "product" },
          },
        ],
      });
    if (!user) {
      user = await Admin.findById(id).select("-password");
    }
    if (!user) {
      return res.status(403).json({ message: "user not found" });
    }
    //set req field for next controller
    req.user = user;
    req.isAdmin = !!(await Admin.findById(id));
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token." });
  }
};

const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authenticated!!!" });
  }
  if (req.isAdmin) {
    return res.json({ success: true, user: req.user });
  }
  await cleanupOldMessagesForUser(req.user._id);
  res.json({ success: true, user: req.user });
};

// admin registration path
// const adminReg = async(req, res) =>{
//     try{
//         const name = "";
//         const password = await bcrypt.hash("", 10);
//         const admin = {
//             name: name,
//             password: password,
//         }
//         await new Admin(admin).save();
//         res.send({message: "good"});
//     }catch(err){
//         console.log(err);
//     }
// }

const adminAuth = async (req, res) => {
  const { name, password } = req.body;
  try {
    //check admin
    const admin = await Admin.findOne({ name: name });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials!" });
    }
    //check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials!" });
    }
    //generate jwt
    const token = generateToken({ admin }, "admin");
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ success: true, message: "special login successful." });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ success: false, message: "Something is wrong!!" });
  }
};

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const { name, email, phone, password } = userData;
    //check for data
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "User Name and Email is required!" });
    }
    // check for existing email
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(409).json({ message: "email already exist" });
    }
    //check for existing phone
    const existingPhone = await User.findOne({ phone: phone });
    if (existingPhone) {
      return res.status(409).json({ message: "Phone Number already exist" });
    }
    // hash password and save user
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      phone,
      password: hashPassword,
    };
    await new User(newUser).save();
    return res.status(200).json({
      message: "Account Created!",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(501).json({
      message: "Error creating account",
      err,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // validate user
    const user = await User.findOne({ email })
      .populate("addresses")
      .populate("message")
      .populate({
        path: "order",
        populate: [
          {
            path: "items",
            populate: { path: "product" },
          },
        ],
      });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "user not found!" });
    }
    //validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials!" });
    }
    //generate jwt and remove expired messages
    const token = generateToken({ user: { _id: user._id } }, "user");
    await cleanupOldMessagesForUser(user._id);
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({ success: true, message: "Login successful.", user: user });
  } catch (err) {
    console.log(err.message);
    return res.status(501).json({
      message: "Something wrong with the database.",
      err,
    });
  }
};

const logoutUser = async (req, res) => {
  res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({ success: true, message: "Logout successful." });
};

const deleteUser = async (req, res) => {
  const { password } = req.body;
  try {
    //validate user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "user not found!" });
    }
    //validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials!" });
    }
    console.log(`[-] Deleting user: ${user.email}`);

    // Cascade delete related data
    await Promise.all([
      Cart.deleteOne({ user: req.user._id }),
      Order.deleteMany({ user: req.user._id }),
      User.findByIdAndDelete(req.user._id),
    ]);
    res.status(200).json({ message: "Your account deleted successfully!" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "Server Error While deleting User data." });
  }
};

module.exports = {
  authenticate,
  adminAuth,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  deleteUser,
};
