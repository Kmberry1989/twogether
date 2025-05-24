const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(bodyParser.json());

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
  const coupleId = `cpl_${Date.now()}`;
  // Store couple (password not hashed in this stub)
  couples[coupleId] = { email, password, partnerA, partnerB };
  const token = jwt.sign({ coupleId }, JWT_SECRET, { expiresIn: '7d' });
  sessions[coupleId] = [];
  res.json({ token, coupleId });
});

// 2. Log In
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const coupleEntry = Object.entries(couples).find(([_id, couple]) => couple.email === email && couple.password === password);
  if (!coupleEntry) return res.status(401).json({ error: 'Invalid credentials' });
  const [coupleId] = coupleEntry;
  const token = jwt.sign({ coupleId }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, coupleId });
});

// 3. Fetch Today’s Activity
app.get('/activity/today', authenticate, (req, res) => {
  const { coupleId } = req;
  // Simple random pick (could be date-based)
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
  const { coupleId } = req;
  const { activityId, turn, response, mediaUrls } = req.body;
  const sessionId = `sess_${Date.now()}`;
  const timestamp = Date.now();
  const session = { sessionId, activityId, turn, response, mediaUrls: mediaUrls || [], timestamp };
  sessions[coupleId].push(session);
  res.status(201).json({ sessionId, timestamp, nextTurn: turn === 'A' ? 'B' : 'A' });
});

// 5. Fetch Session History
app.get('/sessions', authenticate, (req, res) => {
  const { coupleId } = req;
  res.json(sessions[coupleId] || []);
});

app.listen(PORT, () => {
  console.log(`Twogether API server running on port ${PORT}`);
});
