const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

// Protect routes with authMiddleware to verify Cognito tokens
router.use(authMiddleware);

module.exports = router;
