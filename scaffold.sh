#!/usr/bin/env bash

set -e

# Create directories
mkdir -p backend uploads .github/workflows e2e

# 1) README.md
cat > README.md << 'EOF'
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
EOF

# 2) package.json
cat > package.json << 'EOF'
{
"name": "twogether-app",
"version": "1.0.0",
"main": "App.tsx",
"scripts": {
 "start": "expo start",
 "android": "expo run:android",
 "ios": "expo run:ios",
 "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
 "test": "jest",
 "detox:build:ios": "detox build --configuration ios.sim.debug",
 "detox:build:android": "detox build --configuration android.emu.debug",
 "detox:test:ios": "detox test --configuration ios.sim.debug",
 "detox:test:android": "detox test --configuration android.emu.debug"
},
"dependencies": {
 "@react-native-async-storage/async-storage": "*",
 "axios": "*",
 "expo": "*",
 "expo-av": "*",
 "expo-camera": "*",
 "expo-image-picker": "*",
 "expo-notifications": "*",
 "@react-navigation/native": "*",
 "@react-navigation/stack": "*",
 "@react-navigation/bottom-tabs": "*",
 "react-native-gesture-handler": "*",
 "react-native-reanimated": "*",
 "react-native-safe-area-context": "*",
 "react-native-screens": "*",
 "react-native-sketch-canvas": "*",
 "lucide-react-native": "*"
},
"devDependencies": {
 "@babel/core": "*",
 "@babel/runtime": "*",
 "@testing-library/jest-native": "*",
 "@testing-library/react-native": "*",
 "@types/jest": "*",
 "@types/react": "*",
 "@types/react-native": "*",
 "babel-jest": "*",
 "detox": "*",
 "detox-cli": "*",
 "eslint": "*",
 "eslint-config-prettier": "*",
 "jest": "*",
 "jest-circus": "*",
 "typescript": "*",
 "prettier": "*"
}
}
EOF

# 3) tsconfig.json
cat > tsconfig.json << 'EOF'
{
"compilerOptions": {
 "target": "esnext",
 "module": "esnext",
 "jsx": "react-native",
 "strict": true,
 "moduleResolution": "node",
 "skipLibCheck": true,
 "allowJs": true,
 "noEmit": true
},
"exclude": ["node_modules", "babel.config.js", "metro.config.js", "jest.config.js"]
}
EOF

# 4) babel.config.js
cat > babel.config.js << 'EOF'
module.exports = function(api) {
api.cache(true);
return {
 presets: ['babel-preset-expo']
};
};
EOF

# 5) .eslintrc.js
cat > .eslintrc.js << 'EOF'
module.exports = {
root: true,
extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
parser: '@typescript-eslint/parser',
plugins: ['@typescript-eslint'],
env: { 'react-native/react-native': true },
rules: {}
};
EOF

# 6) .prettierrc
cat > .prettierrc << 'EOF'
{
"singleQuote": true,
"trailingComma": "none"
}
EOF

# 7) .gitignore
cat > .gitignore << 'EOF'
node_modules/
ios/build/
android/app/build/
uploads/
coverage/
.expo/
npm-debug.log
yarn-error.log
EOF

# 8) jest.config.js
cat > jest.config.js << 'EOF'
module.exports = {
preset: 'react-native',
moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
setupFiles: ['<rootDir>/jest.setup.js'],
setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
transformIgnorePatterns: ['node_modules/(?!(react-native|@react-native|@react-navigation|lucide-react-native)/)']
};
EOF

# 9) jest.setup.js
cat > jest.setup.js << 'EOF'
import '@testing-library/jest-native/extend-expect';
jest.mock('@react-native-async-storage/async-storage', () =>
require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('axios');
jest.mock('expo-image-picker', () => ({
requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
launchImageLibraryAsync: jest.fn().mockResolvedValue({ cancelled: true }),
requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' })
}));
jest.mock('expo-av', () => ({
Audio: {
 requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
 setAudioModeAsync: jest.fn().mockResolvedValue(),
 Recording: { createAsync: jest.fn().mockResolvedValue({ recording: { stopAndUnloadAsync: jest.fn(), getURI: () => 'file://test.m4a' } }) },
 Sound: { createAsync: jest.fn().mockResolvedValue({ sound: { playAsync: jest.fn(), stopAsync: jest.fn(), unloadAsync: jest.fn() } }) }
}
}));
jest.mock('expo-camera', () => ({
Camera: jest.fn(),
requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' })
}));
jest.mock('expo-notifications', () => ({
requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
setNotificationHandler: jest.fn(),
scheduleNotificationAsync: jest.fn().mockResolvedValue('id'),
cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue()
}));
jest.useFakeTimers();
EOF

# 10) detox.config.js
cat > detox.config.js << 'EOF'
module.exports = {
testRunner: 'jest-circus/runner',
runnerConfig: 'e2e/config.json',
configurations: {
 'ios.sim.debug': {
   type: 'ios.simulator',
   binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Twogether.app',
   build: 'xcodebuild -workspace ios/Twogether.xcworkspace -scheme Twogether -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
 },
 'android.emu.debug': {
   type: 'android.emulator',
   binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
   build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
   device: { avdName: 'Pixel_3_API_30' }
 }
}
};
EOF

# 11) CI workflow
cat > .github/workflows/ci.yml << 'EOF'
name: CI
on:
push:
 branches: [ main ]
pull_request:
 branches: [ main ]
jobs:
build:
 runs-on: ubuntu-latest
 strategy:
   matrix:
     node-version: [14.x, 16.x]
 steps:
   - uses: actions/checkout@v3
   - uses: actions/setup-node@v3
     with:
       node-version: ${{ matrix.node-version }}
       cache: 'yarn'
   - run: yarn install --frozen-lockfile
   - run: yarn lint
   - run: yarn test --coverage
   - uses: actions/upload-artifact@v3
     with:
       name: coverage-report
       path: coverage/**/*
EOF

# 12) Backend server.js
cat > backend/server.js << 'EOF'
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const couples = {};
const sessions = {};
const dailyActivities = [
{ activityId: 'trivia1', type: 'trivia', payload: { question: 'What is 2+2?', options: ['3','4','5'] } },
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
app.post('/auth/signup', (req, res) => {
const { email, password, partnerA, partnerB } = req.body;
const coupleId = \`cpl_\${Date.now()}\`;
couples[coupleId] = { email, password, partnerA, partnerB };
const token = jwt.sign({ coupleId }, JWT_SECRET, { expiresIn: '7d' });
sessions[coupleId] = [];
res.json({ token, coupleId });
});
app.post('/auth/login', (req, res) => {
const { email, password } = req.body;
const coupleEntry = Object.entries(couples).find(([_id, c]) => c.email===email && c.password===password);
if (!coupleEntry) return res.status(401).json({ error: 'Invalid credentials' });
const [coupleId] = coupleEntry;
const token = jwt.sign({ coupleId }, JWT_SECRET, { expiresIn: '7d' });
res.json({ token, coupleId });
});
app.get('/activity/today', authenticate, (req, res) => {
const activity = dailyActivities[Math.floor(Math.random()*dailyActivities.length)];
res.json({ activityId: activity.activityId, type: activity.type, payload: activity.payload, startingTurn:'A' });
});
app.post('/sessions', authenticate, (req, res) => {
const { coupleId } = req;
const { activityId, turn, response, mediaUrls } = req.body;
const sessionId = \`sess_\${Date.now()}\`;
const timestamp = Date.now();
const session = { sessionId, activityId, turn, response, mediaUrls: mediaUrls||[], timestamp };
sessions[coupleId].push(session);
res.status(201).json({ sessionId, timestamp, nextTurn: turn==='A'?'B':'A' });
});
app.get('/sessions', authenticate, (req, res) => {
res.json(sessions[req.coupleId]||[]);
});
app.post('/media/upload', authenticate, upload.single('file'), (req, res) => {
if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
const url = \`\${req.protocol}://\${req.get('host')}/uploads/\${req.file.filename}\`;
res.json({ url });
});
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
EOF

# 13) AuthContext.tsx
cat > AuthContext.tsx << 'EOF'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const API_URL = 'http://10.0.0.34:4000';
interface PartnerPayload { name: string; avatarUrl?: string }
interface AuthContextType {
token: string | null;
coupleId: string | null;
isLoading: boolean;
signup: (email: string, password: string, partnerA: PartnerPayload, partnerB: PartnerPayload) => Promise<void>;
login: (email: string, password: string) => Promise<void>;
logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
const [token, setToken] = useState<string | null>(null);
const [coupleId, setCoupleId] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
 const loadAuth = async () => {
   try {
     const storedToken = await AsyncStorage.getItem('token');
     const storedId = await AsyncStorage.getItem('coupleId');
     if (storedToken && storedId) {
       setToken(storedToken);
       setCoupleId(storedId);
       axios.defaults.baseURL = API_URL;
       axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
     }
   } catch (e) {
     console.warn('Failed to load auth from storage', e);
   } finally {
     setIsLoading(false);
   }
 };
 loadAuth();
}, []);
const signup = async (email: string, password: string, partnerA: PartnerPayload, partnerB: PartnerPayload) => {
 const resp = await axios.post(`${API_URL}/auth/signup`, { email, password, partnerA, partnerB });
 const { token: jwt, coupleId: id } = resp.data;
 await AsyncStorage.setItem('token', jwt);
 await AsyncStorage.setItem('coupleId', id);
 axios.defaults.baseURL = API_URL;
 axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
 setToken(jwt);
 setCoupleId(id);
};
const login = async (email: string, password: string) => {
 const resp = await axios.post(`${API_URL}/auth/login`, { email, password });
 const { token: jwt, coupleId: id } = resp.data;
 await AsyncStorage.setItem('token', jwt);
 await AsyncStorage.setItem('coupleId', id);
 axios.defaults.baseURL = API_URL;
 axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
 setToken(jwt);
 setCoupleId(id);
};
const logout = async () => {
 await AsyncStorage.removeItem('token');
 await AsyncStorage.removeItem('coupleId');
 delete axios.defaults.headers.common['Authorization'];
 setToken(null);
 setCoupleId(null);
};
return (
 <AuthContext.Provider value={{ token, coupleId, isLoading, signup, login, logout }}>
   {children}
 </AuthContext.Provider>
);
};
export const useAuth = (): AuthContextType => {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
return ctx;
};
EOF

# ... Repeat for GlobalContext.tsx, ThemeContext.tsx, NotificationService.ts, Storage.ts,
# OnboardingScreen.tsx, HomeScreen.tsx, ActivityScreen.tsx, PictionaryScreen.tsx, MusicLayerScreen.tsx,
# CharadesScreen.tsx, RewardsScreen.tsx, SettingsScreen.tsx, MainTabNavigator.tsx, AppNavigator.tsx, App.tsx

echo "Scaffold complete. Review files and run 'npm install' then 'npm start'."
