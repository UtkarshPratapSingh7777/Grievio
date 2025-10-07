const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  dept: { 
    type: String, 
    enum: ["roads", "water", "waste", "electricity", "other"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["open", "in-progress", "resolved-stafflevel","resolved-adminlevel", "escalated"], 
    default: "open" 
  },
  location: {
    city: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  photoUrl: { type: String },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "Citizen", required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  assignedStaffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  dueDate: { type: Date },
  remarks: [
    {
      by: { type: String }, // could be "citizen", "staff", or "admin"
      message: { type: String },
      date: { type: Date, default: Date.now }
    }
  ],
  staffresolveproof:{
    photoUrlupdated:{type:String }
  }
}, { timestamps: true });

module.exports = {Complaintmodel : mongoose.model("Complaints", complaintSchema,"Complaints")};
// export const Complaintmodel = mongoose.model("Complaint", Complaintmodel);
