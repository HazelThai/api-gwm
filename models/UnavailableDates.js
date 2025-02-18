const mongoose = require("mongoose");

const UnavailableDatesSchema = new mongoose.Schema({
  unavailable_id: { type: String, required: true, unique: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: [{ type: number, required: true }],
});

module.exports = mongoose.model("UnavailableDates", UnavailableDatesSchema);