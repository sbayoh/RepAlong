const jestExpoPreset = require('jest-expo/jest-preset');

// Firestore rules tests (firestore.rules.test.ts) talk to a real emulator
// over HTTP/gRPC and have zero React Native surface. Deliberately NOT
// spreading the whole jest-expo preset here (unlike jest.config.js) — its
// `setupFiles` pull in @react-native/jest-preset's own ESM setup script,
// which this Node-only suite doesn't need and which isn't covered by a
// firebase-only transformIgnorePatterns. Only the babel-jest `transform` is
// reused, since TS still needs stripping either way.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/firestore.rules.test.ts'],
  transformIgnorePatterns: ['/node_modules/(?!(.pnpm|firebase|@firebase))'],
  transform: {
    ...jestExpoPreset.transform,
    '\\.mjs$': jestExpoPreset.transform['\\.[jt]sx?$'],
  },
  testTimeout: 30000,
};
