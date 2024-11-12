import React, { useEffect, useState } from "react";
import { searchVideos, fetchVideoDetails } from "../services/youtubeService";

function RelatedVideos({ videoTitle }) {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [videoDetails, setVideoDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 3;

  // getRelatedVideos() and handlePageChange() assisted by generative AI
  useEffect(() => {
    const getRelatedVideos = async () => {
      try {
        const videos = await searchVideos(videoTitle); // Search based on the uploaded video's title
        setRelatedVideos(videos);

        // Extract video IDs to fetch detailed metadata
        const videoIds = videos.map((video) => video.id.videoId || video.id);

        // Fetch detailed statistics for each video
        const details = await fetchVideoDetails(videoIds);
        setVideoDetails(details);
      } catch (error) {
        console.error("Error fetching related videos:", error);
      }
    };

    if (videoTitle) {
      getRelatedVideos();
    }
  }, [videoTitle]);

  // Calculate total pages
  const totalPages = Math.ceil(videoDetails.length / videosPerPage);

  // Get the current videos for the page
  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = videoDetails.slice(
    startIndex,
    startIndex + videosPerPage
  );

  // Function to handle page changes
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h3 className="text-2xl mt-10 mb-6">Related Videos</h3>
      {currentVideos.length > 0 ? (
        currentVideos.map((video) => (
          <div className="mb-6" key={video.id}>
            <h4 className="text-xl">{video.snippet.title}</h4>
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                style={{ width: "200px", height: "150px" }}
              /> */}
              <button className="btn-watch mt-2 mb-2">Watch on YouTube</button>
            </a>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.snippet.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p>Views: {video.statistics.viewCount}</p>
            <p>Likes: {video.statistics.likeCount}</p>
            <p>Comments: {video.statistics.commentCount}</p>
          </div>
        ))
      ) : (
        <p>Loading......</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div>
          <button
            className="btn"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="ml-4 mr-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default RelatedVideos;
