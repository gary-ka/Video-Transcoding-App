require("dotenv").config();
const cors = require("cors");
const express = require("express");

const transcodeRoutes = require("./transcodeRoutes");

const app = express();
app.use(cors());
app.use(express.json()); // Use JSON middleware for parsing incoming requests

// Health check route
app.get("/api/health/transcoder", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use("/api/transcode", transcodeRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Transcoder service running on port ${PORT}`);
});
