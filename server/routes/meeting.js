const express = require("express");
const Meeting = require("../models/Meeting");

const router = express.Router();

router.post("/", async (req, res) => {
  const { meeting_id, meeting_name, start_date, end_date } = req.body;

  try {
    let meeting = new Meeting({
      meeting_id,
      meeting_name,
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

module.exports = router;
