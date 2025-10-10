const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    userType: { type: String, enum: ["citizen", "staff", "admin"], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Activitymodel = mongoose.model("Activity", ActivitySchema);

module.exports = { Activitymodel };


