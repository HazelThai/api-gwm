const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
  availability_id: { type: String, required: true, unique: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  day_of_week: { type: String, required: true },
  start_time: { type: Number, required: true },
  end_time: { type: Number, required: true },
});

module.exports = mongoose.model("Availability", AvailabilitySchema);
