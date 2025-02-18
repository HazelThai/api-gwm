const { sendVerificationCode } = require("../utils/emailService");
const createResponse = require("../utils/responseStructure");
const generateUniqueCode = require("../utils/generateUniqueCode");
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Generates a unique verification code and sends it to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Verification code sent successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationCode:
 *                       type: string
 *                       example: ABC123
 *                     timestamp:
 *                       type: integer
 *                       example: 1676563200
 *                     requestId:
 *                       type: string
 *                       example: abc123xyz
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: null
 *                     details:
 *                       type: string
 *                       example: null
 *       500:
 *         description: Failed to send verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to send email
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationCode:
 *                       type: string
 *                       example: null
 *                     timestamp:
 *                       type: integer
 *                       example: 1676563200
 *                     requestId:
 *                       type: string
 *                       example: abc123xyz
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: EMAIL_SEND_ERROR
 *                     details:
 *                       type: string
 *                       example: SMTP server is unreachable
 */
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
