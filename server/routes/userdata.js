const express = require("express");
const Userdata = require("../models/Userdata");
const Meeting = require("../models/Meeting");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/", async (req, res) => {
  const {
    user_email,
    user_name,
    stress_percentage,
    interaction_percentage,
    meeting_id,
  } = req.body;

  try {
    let meet = await Meeting.findOne({ meeting_id: meeting_id });
    let meet_id = meet._id;
    let userdata = new Userdata({
      meet_id,
      user_email,
      user_name,
      stress_percentage,
      interaction_percentage,
    });
    await userdata.save();

    await Meeting.updateOne(
      {
        _id: meet_id,
      },
      {
        $push: { Users: userdata._id },
      }
    );

    let query = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(userdata._id),
        },
      },
    ];

    let userdatas = await Userdata.aggregate(query);

    return res.status(200).send({
      message: "userdata successfully added",
      data: userdatas[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/:email", async (req, res) => {
  try {
    const userdata = await Userdata.findOne({ user_email: req.params.email });
    if (!userdata) {
      return res.status(404).json({
        msg: "userdata not found",
      });
    }
    res.json(userdata);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

router.patch("/interaction/:meeting_id/:email/:value", async (req, res) => {
  try {
    let meet = await Meeting.findOne({ meeting_id: req.params.meeting_id });
    let meet_id = meet._id;
    await Userdata.findOneAndUpdate(
      { user_email: req.params.email, meeting_id: meet_id },
      { interaction_percentage: req.params.value }
    );
    res.status(200).send("interaction percentage added succesfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});
router.patch("/stress/:meeting_id/:email/:value", async (req, res) => {
  try {
    let meet = await Meeting.findOne({ meeting_id: req.params.meeting_id });
    let meet_id = meet._id;
    await Userdata.findOneAndUpdate(
      { user_email: req.params.email, meeting_id: meet_id },
      { stress_percentage: req.params.value }
    );
    res.status(200).send("stress percentage added succesfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
