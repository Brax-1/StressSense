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
      user_email: {
        type: String,
        required: true,
      },
      stress_percentage: {
        type: Number,
        default:0
      },
      interaction_percentage: {
        type: Number,
        default: 0
      },
    },
  ],
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
