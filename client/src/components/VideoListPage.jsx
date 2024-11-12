import React, { useEffect, useState } from "react";
import axios from "axios";
import RelatedVideos from "./RelatedVideos";
import { getBaseUrl } from "../services/urlService";

// const URL = "http://ec2-3-27-167-6.ap-southeast-2.compute.amazonaws.com:8000";
// const URL = "http://localhost:8000";

function VideoListPage() {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null); // State to handle selected video
  const [sortOrder, setSortOrder] = useState("asc"); // State to track sorting order

  useEffect(() => {
    // Fetch the list of videos
    const fetchVideos = async () => {
      const token = localStorage.getItem("idToken");
      try {
        const URL = await getBaseUrl();
        const response = await axios.get(`${URL}/api/videos/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.videos.length === 0) {
          setMessage("No videos found.");
        } else {
          setVideos(response.data.videos);
        }
      } catch (error) {
        setMessage("Error retrieving videos. Please try again.");
      }
    };

    fetchVideos();
  }, []);

  // handleShowRelated() and handleSort() assisted by generative AI
  // Function to clean up the file name and extract a meaningful search term
  const handleShowRelated = (fileName) => {
    const baseName = fileName.replace(/\.[^/.]+$/, ""); // Remove file extension
    const searchQuery = baseName.replace(/[-_]/g, " "); // Replace dashes/underscores with spaces
    setSelectedVideoTitle(searchQuery); // Set cleaned-up name as search query
  };

  // Function to sort videos alphabetically by title
  const handleSort = () => {
    const sortedVideos = [...videos].sort((a, b) => {
      const nameA = a.fileName.toLowerCase();
      const nameB = b.fileName.toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    console.log("Sorted videos: ", sortedVideos);
    setVideos(sortedVideos);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sorting order
  };

  return (
    <div className="mt-20">
      <h2 className="text-2xl">Your Uploaded Videos</h2>
      {message && <p className="mt-6">{message}</p>}
      <button className="mt-6 btn" onClick={handleSort}>
        Sort by Title ({sortOrder === "asc" ? "A-Z" : "Z-A"})
      </button>
      <ul className="mt-6">
        {videos
          .filter((video) => video.isTranscoded === false)
          .map((video) => {
            console.log("Video fileName being rendered:", video.fileName);
            return (
              <li className="text-lg mt-4" key={video.s3Url}>
                {video.fileName}{" "}
                {/* Make sure only the cleaned filename is rendered */}
                <button
                  className="ml-8 btn"
                  onClick={() => handleShowRelated(video.fileName)}
                >
                  Show Related Videos
                </button>
              </li>
            );
          })}
      </ul>

      {/* Conditionally render RelatedVideos component if a video is selected */}
      {selectedVideoTitle && <RelatedVideos videoTitle={selectedVideoTitle} />}
    </div>
  );
}

export default VideoListPage;
