const express = require("express");
const axios = require("axios");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

// router.post("/transcode", authMiddleware, transcodeVideo);

// Proxy the /transcode request to the new transcoder microservice
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Testing locally
    // const transcoderServiceUrl = "http://localhost:5001/";

    // ALB URL
    const transcoderServiceUrl =
      "https://n11253916-a3-1730888968.ap-southeast-2.elb.amazonaws.com:5001/";

    // Forward the request body to the transcoder service
    const response = await axios.post(transcoderServiceUrl, req.body);

    // Respond back with the transcoder service’s response
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error calling the transcoder service:", error.message);
    res
      .status(500)
      .json({ message: "Error calling the transcoder service", error });
  }
});

module.exports = router;
