const jestExpoPreset = require('jest-expo/jest-preset');

// jest-expo's default preset only transforms `.js/.jsx/.ts/.tsx`, but the
// Firebase JS SDK ships some of its "react-native" condition build (e.g.
// @firebase/util's postinstall helper) as raw `.mjs` — untransformed ESM
// that Jest can't parse on its own. Reusing the same babel-jest transform
// for `.mjs` fixes that without touching jest-expo's own config.
module.exports = {
  ...jestExpoPreset,
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|firebase|@firebase))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
  transform: {
    ...jestExpoPreset.transform,
    '\\.mjs$': jestExpoPreset.transform['\\.[jt]sx?$'],
  },
  // Firestore rules tests need a live emulator and a plain Node environment
  // (not the react-native test environment) — they run separately via
  // `npm run test:rules` / jest.rules.config.js, not as part of `npm test`.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/firestore.rules.test.ts'],
};
