const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");
const ffmpeg = require("fluent-ffmpeg");
const os = require("os");
const path = require("path");
const fs = require("fs");

const s3 = new S3Client({ region: "ap-southeast-2" });
const dynamoDb = new DynamoDBClient({ region: "ap-southeast-2" });

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

// Controller logic to transcode video from .mov to .mp4
const transcodeVideo = async (req, res) => {
  const { videoFileName } = req.body;
  const s3Key = `videos/${videoFileName}`; // S3 key of the original file
  const mp4FileName = videoFileName.replace(
    path.extname(videoFileName),
    ".mp4"
  );
  const tempInputFile = path.join(os.tmpdir(), videoFileName);
  const tempOutputFile = path.join(os.tmpdir(), mp4FileName);

  try {
    // Download the video from S3 to a temporary location
    const s3DownloadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
    };

    const downloadStream = fs.createWriteStream(tempInputFile);
    const s3Object = await s3.send(new GetObjectCommand(s3DownloadParams));
    s3Object.Body.pipe(downloadStream);

    downloadStream.on("finish", () => {
      // Start the transcoding process
      console.log(`Transcoding started for: ${videoFileName}`);
      const startTime = new Date();

      ffmpeg(tempInputFile)
        .output(tempOutputFile)
        .size("1920x1080")
        .on("progress", (progress) => {
          console.log(`Progress updated: ${progress.percent}%`);
        })
        .on("end", async () => {
          const endTime = new Date();
          const durationInSeconds = (endTime - startTime) / 1000;
          console.log(
            `Transcoding finished for ${videoFileName} in ${durationInSeconds} seconds`
          );

          // Upload the transcoded file back to S3
          const s3UploadParams = {
            Bucket: BUCKET_NAME,
            Key: `videos/${mp4FileName}`,
            Body: fs.createReadStream(tempOutputFile),
            ContentType: "video/mp4",
          };

          await s3.send(new PutObjectCommand(s3UploadParams));

          // Update DynamoDB with transcoded file metadata
          const dynamoUpdateParams = {
            TableName: TABLE_NAME,
            Key: {
              "qut-username": { S: "n11253916@qut.edu.au" },
              videoId: { S: uuidv4() }, // Use appropriate sort key
            },
            UpdateExpression:
              "SET transcodedFileName = :transcodedFileName, isTranscoded = :isTranscoded",
            ExpressionAttributeValues: {
              ":transcodedFileName": { S: mp4FileName },
              ":isTranscoded": { BOOL: true },
            },
          };

          await dynamoDb.send(new UpdateItemCommand(dynamoUpdateParams));

          // Clean up the temporary files
          fs.unlinkSync(tempInputFile);
          fs.unlinkSync(tempOutputFile);

          // Respond with success
          res.status(200).json({
            message: "File transcoded successfully",
            transcodedFileName: mp4FileName,
          });
        })
        .on("error", (err) => {
          console.error(`Error during transcoding: ${err.message}`);
          res
            .status(500)
            .json({ message: "Error during transcoding", error: err });
        })
        .run();
    });
  } catch (error) {
    console.error("Error transcoding video:", error);
    res.status(500).json({ message: "Error transcoding video", error });
  }
};

module.exports = {
  transcodeVideo,
};
