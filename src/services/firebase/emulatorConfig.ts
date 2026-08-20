import { Platform } from 'react-native';

/**
 * Development-only toggle for routing Firebase Auth/Firestore at the local
 * Emulator Suite instead of the real `repalong-49bc9` project. Off by default
 * so normal `npm start` / `expo start` runs against production Firebase.
 *
 * Enable by setting `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env`.
 */
export const USE_FIREBASE_EMULATOR =
  __DEV__ && process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

/**
 * Android emulators run in their own network namespace where `127.0.0.1`
 * refers to the emulator itself, not the host machine — `10.0.2.2` is the
 * documented alias for the host loopback. iOS Simulator and web share the
 * host's network namespace, so `127.0.0.1` works there.
 *
 * Physical devices are out of scope for this toggle (would need the host's
 * LAN IP instead).
 */
export const FIREBASE_EMULATOR_HOST = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

export const FIREBASE_EMULATOR_AUTH_PORT = 9099;
export const FIREBASE_EMULATOR_FIRESTORE_PORT = 8080;
