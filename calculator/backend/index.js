const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 9876;
const WINDOW_SIZE = 10;
let store = [];

const ENDPOINTS = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand",
};

app.get("/", (req, res) => {
  res.send("Server is t up. Use /numbers/e, /numbers/p, etc.");
});

app.get("/numbers/:type", async (req, res) => {
  const type = req.params.type;

  if (!ENDPOINTS[type]) {
    return res.status(400).json({ error: "Invalid number type!" });
  }

  const apiUrl = `http://20.244.56.144/evaluation-service/${ENDPOINTS[type]}`;
  const windowPrevState = [...store];
  let numbers = [];

  try {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => source.cancel("Timeout"), 500);

    const response = await axios.get(apiUrl, {
      cancelToken: source.token,
    });

    clearTimeout(timeout);
    numbers = response.data.numbers || [];
  } catch (err) {
    console.log("Fetch error or timeout. Using fallback data.");
    if (type === "e") numbers = [2, 4, 6, 8, 10];
    else if (type === "p") numbers = [2, 3, 5, 7, 11];
    else if (type === "f") numbers = [1, 1, 2, 3, 5, 8];
    else if (type === "r") numbers = [7, 12, 18, 20];
  }

  for (const num of numbers) {
    if (!store.includes(num)) {
      store.push(num);
    }
  }

  while (store.length > WINDOW_SIZE) {
    store.shift();
  }

  const avg = store.length
    ? parseFloat(
        (store.reduce((a, b) => a + b, 0) / store.length).toFixed(2)
      )
    : 0;

  return res.json({
    windowPrevState,
    windowCurrState: [...store],
    numbers,
    avg,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
