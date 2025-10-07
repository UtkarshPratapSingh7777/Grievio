const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
  phone: { type: String }
}, { timestamps: true, collection: "Admin" });
adminSchema.index({ dept: 1, location: 1 }, { unique: true });
module.exports = {Adminmodel : mongoose.model("Admin", adminSchema, "Admin")};

