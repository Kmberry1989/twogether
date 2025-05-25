module.exports = {
preset: 'react-native',
moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
setupFiles: ['<rootDir>/jest.setup.js'],
setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
transformIgnorePatterns: ['node_modules/(?!(react-native|@react-native|@react-navigation|lucide-react-native)/)']
};
