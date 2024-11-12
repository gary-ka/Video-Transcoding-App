import React, { useState } from "react";
import axios from "axios";
import { getBaseUrl } from "../services/urlService";

function UploadPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  // const URL = "http://localhost:8000";

  const getToken = () => {
    return localStorage.getItem("idToken");
  };

  const handleUpload = async () => {
    const token = getToken();
    console.log("Token being sent:", token);
    if (!videoFile) {
      setMessage("Please select a video file.");
      return;
    }

    try {
      const URL = await getBaseUrl();
      // Request the pre-signed URL from the backend
      const { data } = await axios.post(
        `${URL}/api/videos/upload`,
        {
          videoFileName: videoFile.name,
          fileType: videoFile.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { preSignedUrl } = data;

      // Upload the file directly to S3 using the pre-signed URL
      const response = await axios.put(preSignedUrl, videoFile, {
        headers: {
          "Content-Type": videoFile.type,
        },
      });

      if (response.status === 200) {
        setMessage(`Upload successful: ${videoFile.name}`);
      } else {
        setMessage("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error);
      setMessage("Upload failed. Please login and try again.");
    }
  };

  return (
    <div className="mt-20">
      <h2 className="text-2xl">Upload Video</h2>
      <input
        className="mt-6"
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />
      <button className="btn ml-6" onClick={handleUpload}>
        Upload
      </button>
      <p className="mt-5">{message}</p>
    </div>
  );
}

export default UploadPage;
