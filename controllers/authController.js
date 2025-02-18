const { sendVerificationCode } = require("../utils/emailService");
const createResponse = require("../utils/responseStructure");
const generateUniqueCode = require("../utils/generateUniqueCode");
exports.register = async (req, res) => {
  const { email } = req.body;
  const code = generateUniqueCode();

  try {
    sendVerificationCode(email, code, "register");
    res.status(200).json(
      createResponse("success", "Verification code sent to your email", {
        verificationCode: code,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(
        createResponse(
          "error",
          "Failed to send email",
          { verificationCode: null },
          { code: "EMAIL_SEND_ERROR", details: error.message }
        )
      );
  }
};
