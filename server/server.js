const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connection = require("./db");
const authUser = require("./routes/auth/authRoutes");
const commonRoutes = require("./routes/commonRoutes");
const orderRoutes = require("./routes/user/orderRoutes");
const adminOrderRoutes = require("./routes/admin/orderRoutes");
const productRoutes = require("./routes/admin/productRoutes");
const cartRoutes = require("./routes/user/cartRoutes");
const bannerRoutes = require("./routes/admin/bannerRoutes");
const profileRoutes = require("./routes/user/profileRoutes");
const voucherRoutes = require("./routes/admin/voucherRoutes");
const dashboardRoutes = require("./routes/admin/dashboardRoutes");
const { checkStripePayment } = require("./controllers/paymentController");
const bodyParser = require("body-parser");

// Initialize Express
const app = express();

//Database Connection
connection();

app.post(
  "/api/payment/webhook",
  bodyParser.raw({ type: "application/json" }),
  checkStripePayment
);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : "*";

app.use(
  cors({
    origin:
      allowedOrigins === "*"
        ? "*"
        : (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error("Not allowed by CORS"));
            }
          },
    credentials: true,
  })
);

// Routes
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//user routes

app.use("/api/public", commonRoutes);

app.use("/api/user/order", orderRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/user", profileRoutes);

//admin routes

app.use("/api/admin/order", adminOrderRoutes);

app.use("/api/admin/product", productRoutes);

app.use("/api/admin/banner", bannerRoutes);

app.use("/api/admin/voucher", voucherRoutes);

app.use("/api/admin/analytics", dashboardRoutes);

//auth routes

app.use("/api/auth", authUser);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port: ${PORT}`);
});
