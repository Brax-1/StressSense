const express = require("express");
const Meeting = require("../models/Meeting");
const Userdata = require("../models/Userdata");
const router = express.Router();

router.post("/", async (req, res) => {
  const { meeting_id, start_date, end_date } = req.body;

  try {
    let meeting = new Meeting({
      meeting_id,
      start_date,
      end_date,
    });
    await meeting.save();
    return res.status(200).send({
      message: "meeting data successfully added",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/:meetingid", async (req, res) => {
  try {
    const meet = await Meeting.findOne({ meeting_id: req.params.meetingid });
    if (!meet) {
      return res.status(404).json({
        msg: "meet not found",
      });
    }
    res.json({ meetid: meet._id });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

router.get("/allusers/:meetingid", async (req, res) => {
  try {
    const meet = await Meeting.findOne({ meeting_id: req.params.meetingid });
    if (!meet) {
      return res.status(404).json({
        msg: "meet not found",
      });
    }
    const alluserdata = await Userdata.find({ _id: { $in: meet.Users } });
    res.json(alluserdata);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

//update endtime left

module.exports = router;
