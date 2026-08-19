import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

import { firebaseConfig } from '@/services/firebase/config';

export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);
