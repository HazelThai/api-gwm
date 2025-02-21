const express = require("express");
const router = express.Router();
const authRoute = require("./authRoutes");
const userRoute = require("./userRoutes");
router.use("/", authRoute);
router.use("/", userRoute);
module.exports = router;
