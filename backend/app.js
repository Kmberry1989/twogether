const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();

// Set Content Security Policy to allow fonts
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data: https:;"
  );
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(bodyParser.json());
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory data stores (replace with real DB in production)
const couples = {};
const sessions = {};
const dailyActivities = [
  { activityId: 'trivia1', type: 'trivia', payload: { question: 'What is 2+2?', options: ['3','4','5'] } },
  // add more activity templates here
];

// Helper: authenticate middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.coupleId = payload.coupleId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// 1. Sign Up
app.post('/auth/signup', (req, res) => {
  const { email, password, partnerA, partnerB } = req.body;
  const coupleId = 'cpl_' + Date.now();
  couples[coupleId] = { email, password, partnerA, partnerB };
  const token = jwt.sign({ coupleId: coupleId }, JWT_SECRET, { expiresIn: '7d' });
  sessions[coupleId] = [];
  res.json({ token, coupleId });
});

// 2. Log In
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const coupleEntry = Object.entries(couples).find(
    ([_id, couple]) => couple.email === email && couple.password === password
  );
  if (!coupleEntry) return res.status(401).json({ error: 'Invalid credentials' });
  const [coupleId] = coupleEntry;
  const token = jwt.sign({ coupleId: coupleId }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, coupleId });
});

// 3. Fetch Today’s Activity
app.get('/activity/today', authenticate, (req, res) => {
  const activity = dailyActivities[Math.floor(Math.random() * dailyActivities.length)];
  res.json({
    activityId: activity.activityId,
    type: activity.type,
    payload: activity.payload,
    startingTurn: 'A'
  });
});

// 4. Submit Session
app.post('/sessions', authenticate, (req, res) => {
  const coupleId = req.coupleId;
  const { activityId, turn, response, mediaUrls } = req.body;
  const sessionId = 'sess_' + Date.now();
  const timestamp = Date.now();
  const session = { sessionId, activityId, turn, response, mediaUrls: mediaUrls || [], timestamp };
  sessions[coupleId].push(session);
  res.status(201).json({ sessionId, timestamp, nextTurn: turn === 'A' ? 'B' : 'A' });
});

// 5. Fetch Session History
app.get('/sessions', authenticate, (req, res) => {
  const coupleId = req.coupleId;
  res.json(sessions[coupleId] || []);
});

// 6. Media Upload
app.post('/media/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
  res.json({ url: fileUrl });
});

module.exports = app;
