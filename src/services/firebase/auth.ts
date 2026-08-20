import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';

import { firebaseAuth } from '@/services/firebase/authInstance';

export type EmailCredentials = {
  email: string;
  password: string;
};

/** Creates a Firebase Auth user only — does not touch Firestore. See `ensureUserProfile`. */
export async function signUpWithEmail(
  { email, password }: EmailCredentials,
  displayName?: string,
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  return credential.user;
}

export async function signInWithEmail({ email, password }: EmailCredentials): Promise<User> {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return credential.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(firebaseAuth);
}

/** Subscribes to Auth session changes. Returns an unsubscribe function. */
export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(firebaseAuth, callback);
}

export function getCurrentFirebaseUser(): User | null {
  return firebaseAuth.currentUser;
}

/**
 * Exposed for later phases (email verification is not a mandatory blocker
 * yet — see AGENTS.md — but the service layer already surfaces this so a
 * future verification flow doesn't need to touch Auth internals again).
 */
export function isCurrentUserEmailVerified(): boolean {
  return firebaseAuth.currentUser?.emailVerified ?? false;
}
