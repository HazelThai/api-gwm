const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const middleware = require("../middleware/authMiddleware");
router.post("/user/:userId", middleware, userController.getUserInfo);
router.put("/update-user/:userId", middleware, userController.updateUserInfo);
router.post("/search-user", middleware, userController.searchUser);

module.exports = router;