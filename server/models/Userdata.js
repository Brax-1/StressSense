const mongoose = require("mongoose");
const UserdataSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  stress_percentage: {
    type: Number,
    default: 0,
  },
  interaction_percentage: {
    type: Number,
    default: 0,
  },
  meeting_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
  },
});

module.exports = Userdata = mongoose.model("userdata", UserdataSchema);
