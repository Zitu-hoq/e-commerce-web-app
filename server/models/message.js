const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, require: true },
    Link: { type: String },
    products: [{ type: String, require: true }],
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
