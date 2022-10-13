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
        required: true,
      },
      interaction_percentage: {
        type: Number,
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

module.export = User = mongoose.model("user", UserSchema);
