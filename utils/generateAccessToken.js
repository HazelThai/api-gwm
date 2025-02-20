const jwt = require("jsonwebtoken");
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = generateAccessToken;
