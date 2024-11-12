const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: "ap-southeast-2" });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Controller logic to download transcoded video
const downloadTranscodedVideo = async (req, res) => {
  const { videoFileName } = req.params;
  const s3Key = `videos/${videoFileName}`;

  try {
    // Generate a pre-signed url to download the video from S3
    const downloadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
    };

    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand(downloadParams),
      { expiresIn: 3600 }
    );

    const cognitoGroups = req.user.groups;

    // Respond with the signed url
    res.status(200).json({ downloadUrl: signedUrl, groups: cognitoGroups });
  } catch (error) {
    console.error("Error generating download URL:", error);
    res.status(500).json({ message: "Error generating download url", error });
  }
};

module.exports = {
  downloadTranscodedVideo,
};
