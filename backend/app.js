const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const upload = multer({ dest: 'uploads/' });

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

// In-memory stores for demo purposes. In production you would use a database.
const couples = {};
const sessions = {};

const dailyActivities = [
  {
    activityId: 'trivia1',
    type: 'trivia',
    payload: { question: 'What is 2+2?', options: ['3', '4', '5'] }
  }
];

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.coupleId = payload.coupleId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Enable Cross-Origin Resource Sharing (CORS) for all routes.
// This is important to allow your React Native app to communicate with the backend.
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// ---- Application API endpoints ----

app.post('/auth/signup', (req, res) => {
  const { email, password, partnerA, partnerB } = req.body;
  const coupleId = `cpl_${Date.now()}`;
  couples[coupleId] = { email, password, partnerA, partnerB };
  const token = jwt.sign({ coupleId }, JWT_SECRET, { expiresIn: '7d' });
  sessions[coupleId] = [];
  res.json({ token, coupleId });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const entry = Object.entries(couples).find(([_id, c]) => c.email === email && c.password === password);
  if (!entry) return res.status(401).json({ error: 'Invalid credentials' });
  const [coupleId] = entry;
  const token = jwt.sign({ coupleId }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, coupleId });
});

app.get('/activity/today', authenticate, (req, res) => {
  const activity = dailyActivities[Math.floor(Math.random() * dailyActivities.length)];
  res.json({
    activityId: activity.activityId,
    type: activity.type,
    payload: activity.payload,
    startingTurn: 'A'
  });
});

app.post('/sessions', authenticate, (req, res) => {
  const { coupleId } = req;
  const { activityId, turn, response, mediaUrls } = req.body;
  const sessionId = `sess_${Date.now()}`;
  const timestamp = Date.now();
  const session = { sessionId, activityId, turn, response, mediaUrls: mediaUrls || [], timestamp };
  sessions[coupleId].push(session);
  res.status(201).json({ sessionId, timestamp, nextTurn: turn === 'A' ? 'B' : 'A' });
});

app.get('/sessions', authenticate, (req, res) => {
  res.json(sessions[req.coupleId] || []);
});

app.post('/media/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});

// Export the Express app to be used by the Vercel serverless function handler.
// This allows api/index.js to import and use this app.
module.exports = app;
