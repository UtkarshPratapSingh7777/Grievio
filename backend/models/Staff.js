const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  dept: { 
    type: String, 
    enum: ["roads", "water", "waste", "electricity", "other"], 
    required: true 
  },
  location: {
    city: { type: String, required: true }
  },
  phone: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  taskCount: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = {Staffmodel : mongoose.model("Staff", staffSchema,"Staff")};
