import axios from "axios";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "n11253916-a2";
const client = new SecretsManagerClient({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
  },
});

// const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const getSecret = async () => {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
      })
    );
    const secret = response.SecretString;
    console.log(secret);
    return secret;
  } catch (error) {
    throw error;
  }
};

// searchVideos() and fetchVideoDetails() assisted by generative AI
export const searchVideos = async (query) => {
  const secret = await getSecret();
  console.log(secret);
  const apiKey = JSON.parse(secret)["youtube-api-key"];

  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      key: apiKey,
      q: query,
      part: "snippet",
      maxResults: 9,
      type: "video",
    },
  });

  return response.data.items; // Return the array of search results
};

// Function to fetch detailed video statistics including views, likes, and comments
export const fetchVideoDetails = async (videoIds) => {
  const secret = await getSecret();
  const apiKey = JSON.parse(secret)["youtube-api-key"];

  const response = await axios.get(`${BASE_URL}/videos`, {
    params: {
      key: apiKey,
      id: videoIds.join(","), // Join all video IDs into a comma-separated string
      part: "snippet,statistics", // Request both snippet and statistics parts
    },
  });

  return response.data.items; // Return the array of video details
};
