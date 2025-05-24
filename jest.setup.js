// jest.setup.js

// Extend expect with react-native testing helpers
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock axios
jest.mock('axios');

// Mock Expo ImagePicker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ cancelled: true }),
  launchCameraAsync: jest.fn().mockResolvedValue({ cancelled: true }),
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
}));

// Mock Expo AV for audio recording/playback
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    setAudioModeAsync: jest.fn().mockResolvedValue(),
    Recording: {
      createAsync: jest.fn().mockResolvedValue({
        recording: {
          stopAndUnloadAsync: jest.fn().mockResolvedValue(),
          getURI: () => 'file://test-audio.m4a',
        }
      })
    },
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn().mockResolvedValue(),
          stopAsync: jest.fn().mockResolvedValue(),
          unloadAsync: jest.fn().mockResolvedValue(),
        }
      })
    }
  }
}));

// Mock Expo Camera
jest.mock('expo-camera', () => ({
  Camera: jest.fn(),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notifId'),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(),
}));

// Set up fake timers if needed
jest.useFakeTimers();
