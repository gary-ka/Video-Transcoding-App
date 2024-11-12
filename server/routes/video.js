const express = require("express");
const { uploadVideo, listVideos } = require("../controllers/videoController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/upload", authMiddleware, uploadVideo);

router.get("/list", authMiddleware, listVideos);

module.exports = router;
