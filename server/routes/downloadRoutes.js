const express = require("express");
const {
  downloadTranscodedVideo,
} = require("../controllers/downloadController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:videoFileName", authMiddleware, downloadTranscodedVideo);

module.exports = router;
