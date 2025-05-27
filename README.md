# Twogether™ App

**Twogether™** helps couples connect through daily interactive activities. Features include:
- Multimodal activities: Trivia, Pictionary, Charades, Music Duet.
- Turn-based flow.
- Keepsake journal with media (images, audio, video).
- Gamification: Points, streaks, badges.
- Customizable: Themes, reminders, settings.

## Getting Started

To run Twogether, you'll need to set up both the backend server and the frontend mobile application.

### Prerequisites

*   Node.js and npm (or yarn) installed.
*   Expo CLI installed (`npm install -g expo-cli`) if you want to run on your own device or simulators.

### 1. Backend Setup

The backend server handles authentication, activity data, and session management.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  Start the backend server:
    ```bash
    npm start
    # or for development with auto-reload:
    # npm run dev
    ```
    The server will typically run on `http://localhost:4000`.

### 2. Frontend Setup

The frontend is a React Native application managed with Expo.

1.  Navigate to the project root directory (if you were in the `backend` directory, go back: `cd ..`).
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  Start the Expo development server:
    ```bash
    npm start
    # or
    # expo start
    ```
    This will open the Expo developer tools in your browser. You can then:
    *   Scan the QR code with the Expo Go app on your iOS or Android device.
    *   Run on an Android emulator/device (`npm run android` or press `a` in the Metro Bundler terminal).
    *   Run on an iOS simulator (`npm run ios` or press `i` in the Metro Bundler terminal; macOS only).

**Important:** The backend server *must* be running for the frontend application to work correctly, as it relies on the API for user authentication and data.
