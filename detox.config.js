/**
 * Detox configuration for end-to-end testing
 * Requires: npm install --save-dev detox detox-cli jest-circus @babel/core @babel/runtime
 */

module.exports = {
  testRunner: 'jest-circus/runner',
  runnerConfig: 'e2e/config.json',
  configurations: {
    'ios.sim.debug': {
      type: 'ios.simulator',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Twogether.app',
      build: 'xcodebuild -workspace ios/Twogether.xcworkspace -scheme Twogether -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.emu.debug': {
      type: 'android.emulator',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
      device: { avdName: 'Pixel_3_API_30' },
    },
  },
};
