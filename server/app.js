require("dotenv").config();
const cors = require("cors");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth"); // Importing the auth routes
const videoRoutes = require("./routes/video"); // Import the video routes
const transcodeRoutes = require("./routes/transcodeRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://n11253916.cab432.com:3000",
      "https://n11253916.cab432.com",
      "https://www.n11253916.cab432.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"], // Allow the Authorization header
    credentials: true,
  })
);

// Mount the routers
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/transcode", transcodeRoutes);
app.use("/api/download", downloadRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

app.use(function (err, req, res, next) {
  // Log the error for debugging purposes
  console.error(err);

  // Send JSON error response
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: req.app.get("env") === "development" ? err : {}, // Send stack trace in development only
  });
});

// app.listen(8000, () => {
//   console.log("Server running on http://localhost:8000");
// });

module.exports = app;
