import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBaseUrl } from "../services/urlService";

// const URL = "http://ec2-3-27-167-6.ap-southeast-2.compute.amazonaws.com:8000";
// const URL = "http://localhost:8000";

const TranscodePage = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [downloadMessage, setDownloadMessage] = useState("");

  const fetchVideos = async () => {
    try {
      const URL = await getBaseUrl();
      const response = await axios.get(`${URL}/api/videos/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("idToken")}`,
        },
      });
      console.log(response.data.videos);
      setVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    // Fetch the list of videos from the server when the component loads
    fetchVideos();
  }, []);

  const startTranscoding = async () => {
    try {
      setIsTranscoding(true);
      setProgress(0);
      setStatusMessage("Transcoding started...");

      const URL = await getBaseUrl();

      await axios.post(
        `${URL}/api/transcode/`,
        { videoFileName: selectedVideo },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("idToken")}`,
          },
        }
      );
      setStatusMessage("Transcoding completed!");

      await fetchVideos();
    } catch (error) {
      console.error("Error starting transcoding:", error);
      setIsTranscoding(false);
      setStatusMessage("Error starting transcoding.");
    }
  };

  const handleDownloadVideo = async (fileName) => {
    console.log("Downloading file:", fileName);
    try {
      const URL = await getBaseUrl();
      const response = await axios.get(`${URL}/api/download/${fileName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("idToken")}`,
        },
      });

      const url = response.data.downloadUrl; // Get the pre-signed URL
      const groups = response.data.groups;
      // Only 'Admin' group can download videos
      if (groups.includes("Admin")) {
        window.open(url); // Open the download link
      } else {
        setDownloadMessage("Sorry, only admin can download videos");
      }
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  return (
    <div className="mt-20">
      <h2 className="text-xl">Transcode and Download Video</h2>
      <select
        className="mt-10"
        onChange={(e) => setSelectedVideo(e.target.value)}
        value={selectedVideo}
      >
        <option value="">Select a video</option>
        {videos.length > 0 ? (
          videos
            .filter((video) => video.isTranscoded === false)
            .map((video) => (
              <option key={video.fileName} value={video.fileName}>
                {video.fileName.replace(/^[^_]+-/, "")}{" "}
                {video.isTranscoded ? "(Transcoded)" : ""}
              </option>
            ))
        ) : (
          <option value="">No videos available</option>
        )}
      </select>

      <button
        className="btn ml-6"
        onClick={startTranscoding}
        disabled={!selectedVideo || isTranscoding}
      >
        Start Transcoding
      </button>

      {statusMessage && <p className="mt-8 text-lg">{statusMessage}</p>}

      <h3 className="mt-28 text-lg">Download Transcoded Videos</h3>
      <ul className="mt-6">
        {videos
          .filter((video) => video.isTranscoded === true)
          .map((video) => (
            <li className="mt-4" key={video.transcodedFileName}>
              {video.transcodedFileName}
              <button
                className="btn ml-6"
                onClick={() => handleDownloadVideo(video.transcodedFileName)}
              >
                Download
              </button>
            </li>
          ))}
      </ul>
      {downloadMessage && <p className="mt-8 text-lg">{downloadMessage}</p>}
    </div>
  );
};

export default TranscodePage;
