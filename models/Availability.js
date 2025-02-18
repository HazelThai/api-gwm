const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  availability_id: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  day_of_week: { type: string, required: true },
  start_time: { type: number, required: true },
  end_time: { type: number, required: true },
});

module.exports = mongoose.model('Availability', AvailabilitySchema);