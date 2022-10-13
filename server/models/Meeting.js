const mongoose = require("mongoose");
const MeetingSchema = new mongoose.Schema({
  meeting_id: {
    type: String,
    required: true,
    unique: true,
  },
  meeting_name: {
    type: String,
    required: true,
  },
  Users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userdata",
    },
  ],
  start_date: {
    type: Date,
    default:Date.now
  },
  end_date: {
    type: Date,
    default:Date.now
  },
});

module.exports = Meeting = mongoose.model("meeting", MeetingSchema);
