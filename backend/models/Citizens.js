const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
}, { timestamps: true });
module.exports = {Citizenmodel : mongoose.model("Citizen", citizenSchema,"Citizen")};
// export const Citizenmodel = mongoose.model("Citizen", citizenSchema);
