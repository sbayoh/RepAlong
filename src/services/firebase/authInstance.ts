import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError } from 'firebase/app';
import { type Auth, connectAuthEmulator, getAuth, initializeAuth } from 'firebase/auth';
// `firebase/auth`'s published types are a single platform-independent rollup
// that omits this RN-only export, even though it resolves correctly at
// runtime (Metro picks it up via `@firebase/auth`'s own conditional exports
// under the "react-native" condition). See docs/architecture.md §9.
// @ts-expect-error — getReactNativePersistence exists at runtime, not in these published types.
import { getReactNativePersistence } from 'firebase/auth';

import { firebaseApp } from '@/services/firebase/app';
import {
  FIREBASE_EMULATOR_AUTH_PORT,
  FIREBASE_EMULATOR_HOST,
  USE_FIREBASE_EMULATOR,
} from '@/services/firebase/emulatorConfig';

/**
 * Native (iOS/Android) Auth instance. `firebase/auth`'s package.json `exports`
 * map resolves `getReactNativePersistence` only under Metro's "react-native"
 * condition — this file is the `.ts` fallback Metro picks for native
 * platforms (see `authInstance.web.ts` for the web-specific instance).
 *
 * `initializeAuth` (rather than `getAuth`) is required here: without an
 * explicit persistence layer, Auth state would not survive an app restart on
 * native, silently falling back to in-memory-only sessions.
 *
 * `initializeAuth` may only be called once per `FirebaseApp` instance — a
 * second call throws `auth/already-initialized`. This module is normally
 * only evaluated once per JS engine lifetime, but Metro Fast Refresh can
 * re-execute a changed module (this file, or anything it transitively
 * depends on) without tearing down the whole native/JS bridge, which does
 * hit that second-call case in dev. Falling back to `getAuth` (which
 * retrieves the already-configured instance rather than trying to
 * reconfigure it) makes this resilient to Fast Refresh; on a real cold
 * start `initializeAuth` always succeeds on the first try.
 */
function createNativeFirebaseAuth(): Auth {
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'auth/already-initialized') {
      return getAuth(firebaseApp);
    }
    throw error;
  }
}

export const firebaseAuth: Auth = createNativeFirebaseAuth();

if (USE_FIREBASE_EMULATOR) {
  connectAuthEmulator(
    firebaseAuth,
    `http://${FIREBASE_EMULATOR_HOST}:${FIREBASE_EMULATOR_AUTH_PORT}`,
    { disableWarnings: true },
  );
}
