const express = require("express");
const ActivityRouter = express.Router();
const { Activitymodel } = require("../models/Activity");
const { citizenTokenVerify, staffTokenVerify, adminTokenVerify } = require("../middleware/auth");

ActivityRouter.get("/citizen", citizenTokenVerify, async (req, res) => {
  try {
    const items = await Activitymodel.find({ userType: "citizen", userId: req.citizen._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).send({ items });
  } catch (err) {
    res.status(500).send({ msg: "Failed to fetch activity", error: err.message });
  }
});


module.exports = ActivityRouter;


