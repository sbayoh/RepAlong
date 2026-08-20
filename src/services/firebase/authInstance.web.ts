import { type Auth, connectAuthEmulator, getAuth } from 'firebase/auth';

import { firebaseApp } from '@/services/firebase/app';
import {
  FIREBASE_EMULATOR_AUTH_PORT,
  FIREBASE_EMULATOR_HOST,
  USE_FIREBASE_EMULATOR,
} from '@/services/firebase/emulatorConfig';

/**
 * Web Auth instance. `getAuth` defaults to `indexedDBLocalPersistence`
 * (falling back to `browserLocalPersistence`), which already persists across
 * reloads — no explicit persistence config needed here, unlike native.
 */
export const firebaseAuth: Auth = getAuth(firebaseApp);

if (USE_FIREBASE_EMULATOR) {
  connectAuthEmulator(
    firebaseAuth,
    `http://${FIREBASE_EMULATOR_HOST}:${FIREBASE_EMULATOR_AUTH_PORT}`,
    { disableWarnings: true },
  );
}
