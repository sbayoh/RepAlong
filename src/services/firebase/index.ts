export { firebaseApp } from '@/services/firebase/app';
export { firebaseConfig } from '@/services/firebase/config';
export type { FirebaseWebConfig } from '@/services/firebase/config';

export { firebaseAuth } from '@/services/firebase/authInstance';
export {
  getCurrentFirebaseUser,
  isCurrentUserEmailVerified,
  sendPasswordReset,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  subscribeToAuthChanges,
} from '@/services/firebase/auth';
export type { EmailCredentials } from '@/services/firebase/auth';
export { getAuthErrorMessage, isAccountNotFoundError } from '@/services/firebase/authErrors';

export { firestoreDb } from '@/services/firebase/firestoreInstance';
export {
  ensureUserProfile,
  fetchUserProfile,
  updateUserProfile,
} from '@/services/firebase/firestore';

export {
  beginProfileRepair,
  completeOnboarding,
  createProfile,
  getProfile,
  updateProfile,
} from '@/services/firebase/profile';
