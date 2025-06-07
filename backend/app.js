const express = require('express');
const cors = require('cors');
const app = express();

/**
 * A sample list of words for games like Pictionary or Charades.
 * In a real application, you might want to fetch these from a database
 * or a more extensive list.
 */
const words = [
  'house', 'car', 'tree', 'dog', 'cat', 'computer', 'phone', 'sun', 'moon',
  'star', 'bicycle', 'mountain', 'river', 'bridge', 'book', 'key', 'guitar',
  'flower', 'rainbow', 'clock', 'airplane', 'boat', 'train', 'hat', 'shoe'
];

// Enable Cross-Origin Resource Sharing (CORS) for all routes.
// This is important to allow your React Native app to communicate with the backend.
app.use(cors());

// A simple test route to confirm the backend is running.
// The path should be '/message', not '/api/message'. Vercel's routing
// handles the `/api` part by directing the request to this serverless function.
// The Express app only needs to care about the path that comes *after* /api.
app.get('/message', (req, res) => {
  res.json({ message: 'Hello from the backend! The connection is successful.' });
});

/**
 * A new route to provide a random word for the games.
 * This endpoint was missing, which would cause a 404 error in the app.
 * It selects a random word from the `words` array and returns it as JSON.
 */
app.get('/word', (req, res) => {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  res.json({ word: randomWord });
});

// Export the Express app to be used by the Vercel serverless function handler.
// This allows api/index.js to import and use this app.
module.exports = app;
