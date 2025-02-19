const { sendVerificationCode } = require("../utils/emailService");
const createResponse = require("../utils/responseStructure");
const generateUniqueCode = require("../utils/generateUniqueCode");
const User = require("../models/User");
/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and registration
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     description: Generates a unique verification code and sends it to the user's email.
 *     tags:
 *       - Authentication
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
 *                      verificationCode:
 *                        type: string
 *                        example: ABC123
 *                      timestamp:
 *                        type: integer
 *                        example: 1676563200
 *                      requestId:
 *                        type: string
 *                        example: abc123xyz
 *                 error:
 *                   type: object
 *                   properties:
 *                      code:
 *                        type: string
 *                        example: null
 *                      details:
 *                        type: string
 *                        example: null
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

/**
 * @swagger
 * tags:
 *    - name: Authentication
 *      description: User authentication and registration
 * /api/v1/login:
 *    post:
 *      summary: Send verification code for login
 *      description: Sends a unique verification code to the user's email for login
 *      tags:
 *        - Authentication
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: user@example.com
 *      responses:
 *        200:
 *          description: Verification code sent successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: success
 *                  message:
 *                    type: string
 *                    example: Verification code sent successfully
 *                  data:
 *                    type: object
 *                    properties:
 *                      verificationCode:
 *                        type: string
 *                        example: ABC123
 *                      timestamp:
 *                        type: integer
 *                        example: 1676563200
 *                      requestId:
 *                        type: string
 *                        example: abc123xyz
 *                  error:
 *                    type: object
 *                    properties:
 *                      code:
 *                        type: string
 *                        example: null
 *                      details:
 *                        type: string
 *                        example: null
 *        500:
 *          description: Failed to send verification code
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: error
 *                  message:
 *                    type: string
 *                    example: Failed to send email
 *                  data:
 *                    type: object
 *                    properties:
 *                      verificationCode:
 *                        type: string
 *                        example: null
 *                      timestamp:
 *                        type: integer
 *                        example: 1676563200
 *                      requestId:
 *                        type: string
 *                        example: abc123xyz
 *                  error:
 *                    type: object
 *                    properties:
 *                      code:
 *                        type: string
 *                        example: EMAIL_SEND_ERROR
 *                      details:
 *                        type: string
 *                        example: SMTP server is unreachable
 */
exports.login = async (req, res) => {
  const { email } = req.body;
  const code = generateUniqueCode();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(
        createResponse("error", "Email is not registered", {
          verificationCode: null,
        })
      );
    }
    sendVerificationCode(email, code, "login");
    if (user.first_login) {
      user.first_login = false;
      await user.save();
      res.status(200).json(
        createResponse("success", "Verification code sent to your email", {
          verificationCode: code,
        })
      );
    }
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

/**
 * @swagger
 * tags:
 *    - name: Authentication
 *      description: User authentication and registration
 * /api/v1/verify-account:
 *    post:
 *      summary: Verify user account
 *      description: Verifies the user account using the verification code sent to the user's email
 *      tags:
 *        - Authentication
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: abc@example.com
 *                code:
 *                  type: string
 *                  example: ABC123
 *      responses:
 *        200:
 *          description: Login successful
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: success
 *                  message:
 *                    type: string
 *                    example: Login successful
 *                  data:
 *                    type: object
 *                    properties:
 *                      verificationCode:
 *                        type: string
 *                        example: ABC123
 *                      name:
 *                        type: string
 *                        example: John Doe
 *                      phone:
 *                        type: string
 *                        example: 1234567890
 *                  error:
 *                    type: object
 *                    properties:
 *                      code:
 *                        type: string
 *                        example: null
 *                      details:
 *                        type: string
 *                        example: null
 *        400:
 *          description: Email is not registered
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: error
 *                  message:
 *                    type: string
 *                    example: Email is not registered
 *                  data:
 *                    type: object
 *                    properties:
 *                      verificationCode:
 *                        type: string
 *                        example: null
 *                      error:
 *                        type: object
 *                        properties:
 *                          code:
 *                            type: string
 *                            example: null
 *                          details:
 *                            type: string
 *                            example: null
 *        500:
 *          description: Failed to verify code
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: error
 *                  message:
 *                    type: string
 *                    example: Failed to verify code
 *                  data:
 *                    type: object
 *                    properties:
 *                      verificationCode:
 *                        type: string
 *                        example: null
 *                  error:
 *                    type: object
 *                    properties:
 *                      code:
 *                        type: string
 *                        example: VERIFICATION_ERROR
 *                      details:
 *                        type: string
 *                        example: Verification code is invalid
*/ 
exports.verifyAccount = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json(
        createResponse("error", "Email is not registered", {
          verificationCode: null,
        })
      );
    }
    if (code) {
      const name = user.name;
      const phone = user.phone_number;
      if (!name || !phone) {
        return res.status(400).json(
          createResponse("error", "User information is incomplete", {
            verificationCode: null,
          })
        );
      }
      user.account_verified = true;
      await user.save();
      res.status(200).json(
        createResponse("success", "Login successful", {
          verificationCode: code,
          name: name,
          phone: phone,
        })
      );
    }
  } catch (error) {
    res
      .status(500)
      .json(
        createResponse(
          "error",
          "Failed to verify code",
          { verificationCode: null },
          { code: "VERIFICATION_ERROR", details: error.message }
        )
      );
  }
};
