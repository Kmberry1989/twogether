# Twogether™ App

**Twogether™** helps couples connect through daily interactive activities. Features include:
- Multimodal activities: Trivia, Pictionary, Charades, Music Duet.
- Turn-based flow.
- Keepsake journal with media (images, audio, video).
- Gamification: Points, streaks, badges.
- Customizable: Themes, reminders, settings.

## Setup

1. Clone repo:
git clone git@github.com:your-org/twogether-app.git
cd twogether-app
2. Frontend:
npm install
npm start
3. Backend:
cd backend
npm install
npm run dev
4. Tests:
npm test
npm run detox:build:ios && npm run detox:test:ios

## Deployment to Vercel

1. Install the Vercel CLI and log in:
   ```bash
   npm i -g vercel
   vercel login
   ```
2. Deploy the backend:
   ```bash
   vercel --prod
   ```
   Vercel reads `vercel.json` and builds the function defined in `api/index.js`.
   The API will be accessible from the generated Vercel URL.
