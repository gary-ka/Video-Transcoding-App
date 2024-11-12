const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: "ap-southeast-2" });
const dynamoDb = new DynamoDBClient({ region: "ap-southeast-2" });

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

// Generate pre-signed url and store metadata
const uploadVideo = async (req, res) => {
  console.log("Request received for video upload.");
  try {
    const { videoFileName, fileType } = req.body;

    // Create S3 Key (path)
    const videoId = uuidv4(); // Generate unique video ID
    const s3Key = `videos/${videoFileName}`;

    // Generate Pre-signed URL
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType, // Video content type (e.g., video/mp4)
    };

    const preSignedUrl = await getSignedUrl(
      s3,
      new PutObjectCommand(s3Params),
      {
        expiresIn: 300, // 5 minutes
      }
    );

    // Store Metadata in DynamoDB
    const dynamoParams = {
      TableName: TABLE_NAME,
      Item: {
        "qut-username": { S: "n11253916@qut.edu.au" }, // partition key
        videoId: { S: videoId }, // Sort key
        fileName: { S: videoFileName },
        uploadTime: { S: new Date().toISOString() },
        s3Url: { S: `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}` }, // S3 url to access the video
        isTranscoded: { BOOL: false },
        "user-username": {
          S: req.user["cognito:username"] || req.user.username,
        },
      },
    };

    await dynamoDb.send(new PutItemCommand(dynamoParams));

    // Respond with the pre-signed URL and video metadata
    res.status(200).json({
      message: "Pre-signed URL generated, and metadata stored in DynamoDB.",
      preSignedUrl,
      videoMetadata: {
        videoId,
        fileName: videoFileName,
        s3Url: `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`,
      },
    });
  } catch (error) {
    console.error(
      "Error generating pre-signed URL or storing metadata:",
      error
    );
    return res.status(500).json({
      message: "Error generating pre-signed URL or storing metadata",
      error,
    });
  }
};

// List uploaded videos for the authenticated user
const listVideos = async (req, res) => {
  console.log("Request user:", req.user);
  if (!req.user || !req.user.username) {
    return res.status(400).json({ message: "User information is missing." });
  }

  const username = req.user.username;
  const isAdmin = username === "admin";

  try {
    let dynamoParams;
    let videos = [];

    if (isAdmin) {
      // Admin user can scan the entire table
      dynamoParams = {
        TableName: TABLE_NAME,
      };
      const result = await dynamoDb.send(new ScanCommand(dynamoParams));
      videos = result.Items.map((item) => {
        // Extract fileName, s3Url, and isTranscoded attribute
        const fullFileName = item.fileName
          ? item.fileName.S
          : "Unknown file name";
        const s3Url = item.s3Url ? item.s3Url.S : "No S3 URL available";
        const isTranscoded = item.isTranscoded ? item.isTranscoded.BOOL : false;
        const transcodedFileName = item.transcodedFileName
          ? item.transcodedFileName.S
          : "No transcoded file available";

        return {
          fileName: fullFileName,
          s3Url: s3Url,
          isTranscoded: isTranscoded,
          transcodedFileName: transcodedFileName,
        };
      });
    } else {
      // General user can only query videos they uploaded
      const dynamoParams = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "#user = :username",
        ExpressionAttributeNames: {
          "#user": "qut-username", // Partition key
        },
        ExpressionAttributeValues: {
          ":username": { S: "n11253916@qut.edu.au" }, // Partition key value
        },
      };

      const result = await dynamoDb.send(new QueryCommand(dynamoParams));

      videos = result.Items.map((item) => {
        // Extract fileName, s3Url, and isTranscoded attribute
        const fullFileName = item.fileName
          ? item.fileName.S
          : "Unknown file name";
        const s3Url = item.s3Url ? item.s3Url.S : "No S3 URL available";
        const isTranscoded = item.isTranscoded ? item.isTranscoded.BOOL : false;
        const transcodedFileName = item.transcodedFileName
          ? item.transcodedFileName.S
          : "No transcoded file available";

        return {
          fileName: fullFileName,
          s3Url: s3Url,
          isTranscoded: isTranscoded,
          transcodedFileName: transcodedFileName,
        };
      });
    }

    // Send the videos array in the response
    return res.status(200).json({ videos });
  } catch (error) {
    console.error("Error retrieving videos from DynamoDB:", error);
    return res.status(500).json({ message: "Error retrieving videos" });
  }
};

module.exports = { uploadVideo, listVideos };
