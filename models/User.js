const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  account_verified: { type: Boolean, default: false },
  first_login: { type: Boolean, default: true },
  verifyCode: { type: number, unique: true },
});

module.exports = mongoose.model("User", UserSchema);
