import { connectFirestoreEmulator, type Firestore, getFirestore } from 'firebase/firestore';

import { firebaseApp } from '@/services/firebase/app';
import {
  FIREBASE_EMULATOR_FIRESTORE_PORT,
  FIREBASE_EMULATOR_HOST,
  USE_FIREBASE_EMULATOR,
} from '@/services/firebase/emulatorConfig';

/** Targets the project's `(default)` Firestore database (nam7). */
export const firestoreDb: Firestore = getFirestore(firebaseApp);

if (USE_FIREBASE_EMULATOR) {
  connectFirestoreEmulator(firestoreDb, FIREBASE_EMULATOR_HOST, FIREBASE_EMULATOR_FIRESTORE_PORT);
}
