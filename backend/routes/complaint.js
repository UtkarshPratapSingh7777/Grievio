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
const cloudinary = require("cloudinary");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { Activitymodel } = require("../models/Activity");
const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return result.secure_url;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw error;
    }
};
cloudinary.config({
    cloud_name: "YOUR CLOUDINARY CLOUD NAME",
    api_key: "YOUR API KEY",
    api_secret: "YOUR API SECRET"
});
Complaintrouter.post("/create", citizenTokenVerify, upload.single("photo"), async (req, res) => {
    try {
        if (typeof req.body.location === "string") {
            try {
                req.body.location = JSON.parse(req.body.location);
            } catch (e) {
                return res.status(400).send({ msg: "Invalid location payload" });
            }
        }
        const parsed = complaintcreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).send({ msg: "Invalid input", error: parsed.error });
        }
        if (req.file && req.file.path) {
            try {
                const uploadedUrl = await uploadFile(req.file.path);
                req.body.photoUrl = uploadedUrl;
            } finally {
                fs.unlink(req.file.path, () => {});
            }
        }

        const { title, description, dept, location } = req.body;
        const admin = await Adminmodel.findOne({
            dept: dept,
            "location.city": location.city.toLowerCase()
        });

        if (!admin) {
            return res.status(400).send({ msg: "No admin found for your dept and location" });
        }
        location.city = location.city.toLowerCase();
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
                assignedStaffId: null,
                photoUrl: req.body.photoUrl || null,
                staffresolveproof: {
                    photoUrlupdated: null
                }
            });
            // Activity: complaint created
            await Activitymodel.create({
                userType: "citizen",
                userId: req.citizen._id,
                complaintId: complaint._id,
                message: `Created complaint ${complaint.ticketId}`,
            });
            res.status(201).send({ msg: "Complaint created successfully", complaint });
        } catch (err) {
            res.status(400).send({ msg: "Complaint creation failed", error: err.message });
        }
    } catch (err) {
        res.status(500).send({ msg: "Unexpected error", error: err.message });
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
            res.status(400).send({ msg: "Only open complaints can be assigned" });
            return;
        }
        complaint.assignedStaffId = staff._id;
        complaint.status = "in-progress";
        await complaint.save();
        staff.taskCount += 1;
        await staff.save();
        // Activity: assigned to staff
        await Activitymodel.create({
            userType: "staff",
            userId: staff._id,
            complaintId: complaint._id,
            message: `Assigned complaint ${complaint.ticketId}`,
        });
        res.status(200).send({ msg: "Complaint assigned successfully", complaint: complaint, staff: staff });

    } catch (err) {
        res.status(500).send({ msg: "Failed to assign complaint", error: err.message });
    }
});
Complaintrouter.put("/resolvecomplaintstaff/:complaintid", staffTokenVerify, upload.single("resolveimage"), async (req, res) => {
    const complaintId = req.params.complaintid;
    let uploadedUrl = null;
    if (req.file && req.file.path) {
        try {
            uploadedUrl = await uploadFile(req.file.path);
        } finally {
            fs.unlink(req.file.path, () => {});
        }
    }

    try {
        const complaint = await Complaintmodel.findOne({ _id: complaintId, assignedStaffId: req.staff._id });
        if (!complaint) {
            return res.status(404).send({ msg: "Complaint not found" });
        }
        if (complaint.status !== "in-progress") {
            return res.status(400).send({ msg: "Only in-progress complaints can be resolved" });
        }

        const photoUrlupdated = uploadedUrl || req.body.photoUrlupdated || null;
        complaint.status = "resolved-stafflevel";
        complaint.staffresolveproof.photoUrlupdated = photoUrlupdated;
        await complaint.save();

        req.staff.taskCount -= 1;
        await req.staff.save();
        // Activity: staff resolved
        await Activitymodel.create({
            userType: "staff",
            userId: req.staff._id,
            complaintId: complaint._id,
            message: `Marked resolved at staff level for ${complaint.ticketId}`,
        });
        res.status(200).send({ msg: "Complaint resolved successfully", complaint: complaint });
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
            // Activity: admin verified
            await Activitymodel.create({
                userType: "admin",
                userId: req.admin._id,
                complaintId: complaint._id,
                message: `Verified resolution for ${complaint.ticketId}`,
            });
            res.status(200).send({ msg: "Complaint resolved successfully", complaint: complaint });
        }
    } catch (err) {
        res.status(500).send({ msg: "Failed to resolve complaint", error: err.message });
    }
});

module.exports = Complaintrouter;
