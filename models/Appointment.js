const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  appointment_id: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheduled_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  start_time: { type: number, required: true },
  end_time: { type: number, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);