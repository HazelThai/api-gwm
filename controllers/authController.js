const { sendVerificationCode } = require("../utils/emailService");
const createResponse = require("../utils/responseStructure");
const generateUniqueCode = require("../utils/generateUniqueCode");
const User = require("../models/User");
const generateAccessToken = require("../utils/generateAccessToken");
/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and email verification
 * /api/v1/send-mail:
 *   post:
 *     summary: Send a verification code to the user's email
 *     description: |
 *       Generates a unique verification code and sends it to the user's email.
 *       If the user does not exist, a new user account is created with the email and verification code.
 *       If the user exists, the verification code is updated.
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
 *             required:
 *               - email
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
 *         description: Failed to send the verification code
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
exports.sendMail = async (req, res) => {
  const { email } = req.body;
  const code = generateUniqueCode();

  try {
    sendVerificationCode(email, code, "register");
    const user = await User.findOne({ email });
    if (!user) {
      const userAccount = await User.create({
        email: email,
        name: "",
        phone_number: "",
        first_login: true,
        account_verified: false,
        verifyCode: code,
      });
      await userAccount.save();
    }
    user.verifyCode = code;
    await user.save();
    res.status(200).json(
      createResponse("success", "Verification code sent successfully", {
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
 *   - name: Authentication
 *     description: User authentication and registration
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     description: Verifies the user's email and updates their account information.
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
 *               code:
 *                 type: string
 *                 example: ABC123
 *               name:
 *                 type: string
 *                 example: John Doe
 *               number_phone:
 *                 type: string
 *                 example: +1234567890
 *     responses:
 *       200:
 *         description: User account verified and updated successfully
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
 *                   example: User account verified and updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationCode:
 *                       type: string
 *                       example: ABC123
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: null
 *                     details:
 *                       type: string
 *                       example: null
 *       400:
 *         description: Bad request
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
 *                   example: Verification code is invalid or user information is incomplete
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationCode:
 *                       type: string
 *                       example: null
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: INVALID_CODE_OR_INCOMPLETE_INFO
 *                     details:
 *                       type: string
 *                       example: Verification code is invalid or user information is incomplete
 *       404:
 *         description: Email not found
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
 *                   example: Email is not registered
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationCode:
 *                       type: string
 *                       example: null
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: EMAIL_NOT_FOUND
 *                     details:
 *                       type: string
 *                       example: The provided email is not registered
 *       500:
 *         description: Internal server error
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
 *                   example: Failed to process the request
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationCode:
 *                       type: string
 *                       example: null
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: SERVER_ERROR
 *                     details:
 *                       type: string
 *                       example: Internal server error occurred
 */
exports.register = async (req, res) => {
  const { email, code, name, number_phone } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(
        createResponse("error", "Email is not registered", {
          verificationCode: null,
        })
      );
    }
    if (!user.name || !user.phone_number) {
      return res.status(400).json(
        createResponse("error", "User information is incomplete", {
          verificationCode: null,
        })
      );
    }
    if (code !== user.verifyCode) {
      return res.status(400).json(
        createResponse("error", "Verification code is invalid", {
          verificationCode: null,
        })
      );
    }
    const userAccount = {
      name: name,
      phone_number: number_phone,
      verifyAccount: true,
      first_login: true,
      verifyCode: null,
    };
    user.save(userAccount);
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
  const { email, code } = req.body;
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
    user.verifyCode = code;
    await user.save();
    if (code === user.verifyCode) {
      user.verifyCode = null;
      user.first_login = false;
    }
    await user.save();
    const accessToken = generateAccessToken(user);
    res.status(200).json(
      createResponse("success", "Verification code sent to your email", {
        verificationCode: code,
        accessToken: accessToken,
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
  *   - name: Authentication
  *     description: User authentication and registration
  * /api/v1/logout:
  *   post:
  *     summary: Log out the user
  *     description: Logs out the user by destroying the session and clearing the cookies
  *     tags:
  *       - Authentication
  *     responses:
  *       200:
  *         description: User logged out successfully
  *         schema:
  *           type: object
  *           properties:
  *             status:
  *               type: string
  *               example: success
  *             message:
  *               type: string
  *               example: User logged out successfully
  *             data:
  *               type: object
  *               properties:
  *                 verificationCode:
  *                   type: string
  *                   example: null
  *                 accessToken:
  *                   type: string
  *                   example: null
  *             error:
*/
exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.clearCookie("accessToken");
    res.status(200).json(
      createResponse("success", "User logged out successfully", {
        verificationCode: null,
        accessToken: null,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(
        createResponse(
          "error",
          "Failed to log out",
          { verificationCode: null, accessToken: null },
          { code: "LOGOUT_ERROR", details: error.message }
        )
      );
  }
};
