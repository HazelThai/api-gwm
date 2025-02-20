const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const headers = req.headers["authorization"];
  const token = headers && headers.split(" ")[1];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    req.user_id = jwt.decode.user_id;
    req.email = jwt.decode.email;
    next();
  });
};

module.exports = verifyToken;
