jest.mock('@react-native-async-storage/async-storage', () =>
require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), { virtual: true });
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
