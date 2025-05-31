import express from "express";
import cors from "cors";
import { config } from "dotenv";
import axios from "axios";

config();
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
let spotifyAccessToken = null;
let tokenRefreshTimeout = null;

// Refresh Spotify token
async function refreshSpotifyToken() {
  try {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    spotifyAccessToken = data.access_token;
    console.log("✅ Spotify token refreshed");

    clearTimeout(tokenRefreshTimeout);
    tokenRefreshTimeout = setTimeout(refreshSpotifyToken, 55 * 60 * 1000);
  } catch (err) {
    console.error("❌ Failed to refresh Spotify token:", err.message);
    setTimeout(refreshSpotifyToken, 10000);
  }
}
refreshSpotifyToken();

// Emotion to genre mapping
const emotionGenreMap = {
  sadness: ["acoustic", "ambient"],
  joy: ["pop", "dance"],
  anger: ["rock", "metal"],
  surprise: ["alternative", "indie"],
  fear: ["ambient", "classical"],
  love: ["r-n-b", "soul"],
};

// Emotion detection
async function detectEmotion(text) {
  try {
    const { data } = await axios.post(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const emotions = data[0];
    if (!emotions || emotions.length === 0) return null;

    return emotions.reduce((max, curr) => (curr.score > max.score ? curr : max)).label;
  } catch (err) {
    console.error("❌ Emotion detection error:", err.message);
    return null;
  }
}

// Main route
app.post("/api/playlist", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  if (!spotifyAccessToken) return res.status(503).json({ error: "Spotify token not ready" });

  const emotion = await detectEmotion(text);
  console.log("🧠 Detected emotion:", emotion);

  const keyword = emotion?.toLowerCase() || "mood";

  try {
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${spotifyAccessToken}` },
      params: { q: keyword, type: "playlist", limit: 10, market: "IN" },
    });

    const playlists = data.playlists?.items?.filter(p => p && p.id);
    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ error: "No playlists found for this emotion." });
    }

    const selected = playlists.sort(() => 0.5 - Math.random()).slice(0, 3);

    let allTracks = [];

    for (const playlist of selected) {
      const { data: trackData } = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
          headers: { Authorization: `Bearer ${spotifyAccessToken}` },
          params: { limit: 10 },
        }
      );

      const tracks = trackData.items
        .filter(item => item.track)
        .map(item => ({
          playlist_name: playlist.name,
          track_name: item.track.name,
          artist: item.track.artists[0]?.name,
          album_image: item.track.album.images[0]?.url,
          preview_url: item.track.preview_url,
          spotify_url: item.track.external_urls?.spotify,
        }));

      allTracks.push(...tracks);
    }

    const finalTracks = allTracks.sort(() => 0.5 - Math.random()).slice(0, 10);
    res.json({ emotion, keyword, tracks: finalTracks });
  } catch (err) {
    console.error("❌ Error fetching playlists:", err.message);
    res.status(500).json({ error: "Error fetching playlists or tracks." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at the http://localhost:${port}`);
});
