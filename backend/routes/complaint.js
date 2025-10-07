const express = require("express");
const Complaintrouter = express.Router();
const { Complaintmodel } = require("../models/Complaint");
const { Adminmodel } = require("../models/Admin");
const { Staffmodel } = require("../models/Staff");
const { Citizenmodel } = require("../models/Citizens");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { citizenTokenVerify, staffTokenVerify, adminTokenVerify } = require("../middleware/auth");
const { complaintcreateSchema } = require("../utils/complaintcreatevalidation");
Complaintrouter.post("/create", citizenTokenVerify, async (req, res) => {
    const { success } = complaintcreateSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).send({ msg: "Invalid input", error: complaintcreateSchema.error });
    }
    const { title, description, dept, location } = req.body;
    const admin = await Adminmodel.findOne({
        dept: dept,
        "location.city": location.city.toLowerCase()
    });

    if (!admin) {
        return res.status(400).send({ msg: "No admin found for your dept and location" });
    }
    try {
        const complaint = await Complaintmodel.create({
            ticketId: "TCK-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
            title,
            description,
            dept,
            location,
            citizenId: req.citizen._id,
            status: "open",
            adminId: admin._id,
            assignedStaffId: null
        });
        res.status(201).send({ msg: "Complaint created successfully", complaint });
    } catch (err) {
        res.status(400).send({ msg: "Complaint creation failed", error: err.message });
    }
});
Complaintrouter.put("/update/:complaintid", citizenTokenVerify, async (req, res) => {
    const { complaintid } = req.params;
    const complaint = await Complaintmodel.findOne({ _id: complaintid, citizenId: req.citizen._id });
    if (!complaint) {
        return res.status(404).send({ msg: "Complaint not found" });
    }
    if (complaint.status !== "open") {
        return res.status(400).send({ msg: "Only open complaints can be updated" });
    }
});
//incompltete update endpoint
Complaintrouter.get("/citizen", citizenTokenVerify, async (req, res) => {
    try {
        const complaints = await Complaintmodel.find({ citizenId: req.citizen._id });
        res.status(200).send({ msg: "Complaints fetched successfully", complaints: complaints });
    } catch (err) {
        res.status(500).send({ msg: "Failed to fetch complaints", error: err.message });
    }
});
Complaintrouter.get("/staff", staffTokenVerify, async (req, res) => {
    try {
        const complaints = await Complaintmodel.find({ assignedStaffId: req.staff._id });
        res.status(200).send({ msg: "Complaints fetched successfully", complaints: complaints });
    } catch (err) {
        res.status(500).send({ msg: "Failed to fetch complaints", error: err.message });
    }
});
Complaintrouter.get("/admin", adminTokenVerify, async (req, res) => {
    try {
        const complaints = await Complaintmodel.find({ adminId: req.admin._id });
        res.status(200).send({ msg: "Complaints fetched successfully", complaints: complaints });
    }
    catch (err) {
        res.status(500).send({ msg: "Failed to fetch complaints", error: err.message });
    }
})
Complaintrouter.put("/assign/:complaintid", adminTokenVerify, async (req, res) => {
    const { complaintid } = req.params;
    const staffs = await Staffmodel.find({ dept: req.admin.dept, location: req.admin.location }).sort({ taskCount: 1 });
    if (staffs.length === 0) {
        return res.status(400).send({ msg: "No staff available in your dept and location" });
    }
    const staff = staffs[0];
    try {
        const complaint = await Complaintmodel.findOne({ _id: complaintid, adminId: req.admin._id });
        if (!complaint) {
            return res.status(404).send({ msg: "Complaint not found" });
        }
        if (complaint.status !== "open") {
            return res.status(400).send({ msg: "Complaint is not open" });
        }
        complaint.assignedStaffId = staff._id;
        complaint.status = "in-progress";
        await complaint.save();
        staff.taskCount += 1;
        await staff.save();

        res.status(200).send({ msg: "Complaint assigned successfully", complaint: complaint, staff: staff });

    } catch (err) {
        res.status(500).send({ msg: "Failed to assign complaint", error: err.message });
    }
});
Complaintrouter.put("/resolvecomplaintstaff/:complaintid", staffTokenVerify, async (req, res) => {
    const complaintId = req.params.complaintid;
    // const { photoUrlupdated } = req.body;
    try {
        const complaint = await Complaintmodel.findOne({ _id: complaintId, assignedStaffId: req.staff._id });
        if (!complaint) {
            return res.status(404).send({ msg: "Complaint not found" });
        }
        if (complaint.status == "in-progress") {
            complaint.status = "resolved-stafflevel";
            await complaint.save();
            req.staff.taskCount -= 1;
            await req.staff.save();
            // complaint.staffresolveproof.photoUrlupdated = photoUrlupdated;
            await complaint.save();
            res.status(200).send({ msg: "Complaint resolved successfully", complaint: complaint });
        }
    } catch (err) {
        res.status(500).send({ msg: "Failed to resolve complaint", error: err.message });
    }
})
Complaintrouter.put("/resolvecomplaintadmin/:complaintid", adminTokenVerify, async (req, res) => {
    const complaintId = req.params.complaintid;
    try {
        const complaint = await Complaintmodel.findOne({ _id: complaintId, adminId: req.admin._id });
        if (!complaint) {
            return res.status(404).send({ msg: "Complaint not found" });
        }
        if (complaint.status === "resolved-stafflevel") {
            complaint.status = "resolved-adminlevel";
            await complaint.save();
            res.status(200).send({ msg: "Complaint resolved successfully", complaint: complaint });
        }
    } catch (err) {
        res.status(500).send({ msg: "Failed to resolve complaint", error: err.message });
    }
});

module.exports = Complaintrouter;