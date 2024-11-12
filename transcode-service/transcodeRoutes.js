const express = require("express");
const { transcodeVideo } = require("./transcodeController"); // Import the transcode controller
const router = express.Router();

// Define the route for transcoding (no auth middleware needed here)
router.post("/", transcodeVideo); // Base route for transcoding service

module.exports = router;
