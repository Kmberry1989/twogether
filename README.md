Twogether™ App

Twogether™ is a React Native (Expo) mobile application designed to help couples connect through daily interactive activities. Features include:

Multimodal Activities: Trivia, drawing (Pictionary), charades, musical layering, and more.

Turn-Based Flow: Each activity alternates turns between partners.

Keepsake Journal: Persisted session history with media (images, audio, video) for lifelong memories.

Gamification & Rewards: Points, streaks, and badges to motivate regular engagement.

Customizable Experience: Light/dark themes, daily reminder scheduling, and user settings.

Architecture Overview

Frontend: React Native with Expo, using Context for Auth, Global (session), and Theme.

Navigation: React Navigation with a bottom tab navigator (Home, Journey, Rewards, Settings) and a stack for activity flows.

Backend: Express.js API server with JWT auth, in-memory stub (replaceable with Firestore/PostgreSQL), and file uploads via Multer.

Storage: Local persistence (AsyncStorage) and remote sessions/media endpoints.

Notifications: Expo Notifications for daily local reminders.

Testing: Jest & React Native Testing Library for unit tests; mocks for Expo modules.

Getting Started

Prerequisites

Node.js (>=14)

Expo CLI (npm install -g expo-cli)

Yarn or npm

(Optional) Android Studio / Xcode for simulators

Frontend Setup

# Clone repo
git clone https://github.com/your-org/twogether-app.git
cd twogether-app

# Install dependencies
yarn install  # or npm install

# Start Expo
expo start

Backend Setup

# In a separate terminal
git clone https://github.com/your-org/twogether-backend.git
cd twogether-backend

# Install dependencies
yarn install

# Run server
npm start  # listens on http://localhost:4000

Ensure API base URL in AuthContext.tsx and axios defaults points to your backend.

Running Tests

# Run unit tests
npm test

# For coverage report
yarn test --coverage

CI/CD

A GitHub Actions workflow (.github/workflows/ci.yml) is configured to run linting, tests, and build checks on push and pull requests.

Deployment & Future Work

Backend: Migrate in-memory store to Firestore or PostgreSQL, add secure password hashing.

Activities: Expand puzzle, quiz, and game packs; integrate WebMIDI and three.js modules.

Polish: Add animations, refine UI, implement offline sync.

E2E Testing: Set up Detox for automated end-to-end scenarios.

Ready to build deeper connections? Let’s start Twogether!

