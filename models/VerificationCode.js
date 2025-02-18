const mongoose = require("mongoose");

const VerificationCodeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: { type: String, required: true },
  create_at: { type: Date, default: Date.now, expires: "5m" },
});

module.exports = mongoose.model("VerificationCode", VerificationCodeSchema);