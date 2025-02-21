const Availability = require("../models/Availability");
const UnavailableDates = require("../models/UnavailableDates");
const User = require("../models/User");
const createResponse = require("../utils/responseStructure");

exports.getUserInfo = function (req, res) {
  const { userId } = req.params;
  try {
    const user = User.findById(userId).select("-verifyCode");
    if (!user) {
      return res
        .status(404)
        .json(createResponse("error", "User not found", null));
    }
    res.status(200).json(
      createResponse("success", "User found", {
        user,
      })
    );
  } catch (error) {
    res.status(500).json(createResponse("error", error.message, null));
  }
};

exports.updateUserInfo = async function (req, res) {
  const { userId } = req.params;
  const { name, phone } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(createResponse("error", "User not found", null));
    }
    user.name = name;
    user.phone = phone;
    await user.save();
    res.status(200).json(
      createResponse("success", "User updated successfully", {
        user,
      })
    );
  } catch (error) {
    res.status(500).json(createResponse("error", error.message, null));
  }
};

exports.searchUser = async function (req, res) {
  const { searchTerms } = req.query;
  try {
    const user = await User.findOne({
      $or: [{ email: searchTerms }, { phone: searchTerms }],
    }).select("-verifyCode");
    if (!user) {
      return res
        .status(404)
        .json(createResponse("error", "User not found", null));
    }
    const availabilityTime = await Availability.find({ user_id: user._id });
    const invailabilityTime = await UnavailableDates.find({
      user_id: user._id,
    });
    res.status(200).json(
      createResponse("success", "User found", {
        user,
        availabilityTime,
        invailabilityTime,
      })
    );
  } catch (error) {
    res.status(500).json(createResponse("error", error.message, null));
  }
};
