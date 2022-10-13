const express = require("express");
const Userdata = require("../models/Userdata");
const Meeting = require("../models/Meeting");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/", async (req, res) => {
  const { user_email, stress_percentage, interaction_percentage, meeting_id } =
    req.body;

  try {
    let userdata = new Userdata({
      meeting_id,
      user_email,
      stress_percentage,
      interaction_percentage,
    });
    await userdata.save();

    await Meeting.updateOne(
        {
            _id : meeting_id,
        },
        {
            $push:{ Users:userdata._id}
        }
    )

    let query=[
        {
            $match:{
                '_id':mongoose.Types.ObjectId(userdata._id)
            }
        },

    ];

    let userdatas = await Userdata.aggregate(query);

    return res.status(200).send({
        message:'userdata successfully added',
        data:userdatas[0]
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
