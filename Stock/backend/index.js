const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

const BASE_URL = "http://20.244.56.144/evaluation-service";

// Get all available stocks
app.get("/api/stocks", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/stocks`);
    res.json(response.data.stocks);
  } catch (err) {
    console.error("Error fetching stocks", err.message);
    res.status(500).json({ error: "Failed to fetch stock list" });
  }
});

// Get historical prices for a specific stock in last m minutes
app.get("/api/stocks/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const { minutes } = req.query;

  try {
    const url = `${BASE_URL}/stocks/${ticker}` + (minutes ? `?minutes=${minutes}` : "");
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching stock prices", err.message);
    res.status(500).json({ error: "Failed to fetch price data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend API running at http://localhost:${PORT}`);
});
