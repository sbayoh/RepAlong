import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type DocumentReference,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';

import { firestoreDb } from '@/services/firebase/firestoreInstance';
import type {
  UpdatableUserProfileFields,
  UserProfile,
  UserProfileWrite,
} from '@/types/user';

function userDocRef(uid: string): DocumentReference {
  return doc(firestoreDb, 'users', uid);
}

/**
 * Ensures the given authenticated user has a `users/{uid}` document,
 * creating one only if it doesn't already exist. The transaction's only job
 * is race-safe, idempotent creation: concurrent callers (e.g. the
 * registration screen and a future social-login flow both calling this for
 * the same brand-new user) can never race into duplicate/overwriting
 * writes. It intentionally does NOT try to return the written data —
 * `serverTimestamp()` is an unresolved `FieldValue` sentinel until Firestore
 * resolves it server-side, so the transaction closure only ever sees the
 * sentinel, never a real `Timestamp`. Once the transaction has committed, a
 * plain `getDoc` re-read returns the server-resolved document, which is what
 * gets returned as `UserProfile` (whose fields are real `Timestamp`s).
 *
 * `seed` supplies name fields at creation time only (e.g. from the sign-up
 * form); it's ignored if a profile already exists.
 */
export async function ensureUserProfile(
  user: User,
  seed?: { firstName?: string; lastName?: string },
): Promise<UserProfile> {
  const ref = userDocRef(user.uid);

  await runTransaction(firestoreDb, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists()) {
      return;
    }

    const firstName = seed?.firstName?.trim() ?? '';
    const lastName = seed?.lastName?.trim() ?? '';
    const displayName =
      [firstName, lastName].filter(Boolean).join(' ') || user.email || 'RepAlong Member';
    const now = serverTimestamp();

    const profile: UserProfileWrite = {
      uid: user.uid,
      email: user.email ?? '',
      firstName,
      lastName,
      displayName,
      createdAt: now,
      updatedAt: now,
      onboardingCompleted: false,
      accountStatus: 'active',
    };

    transaction.set(ref, profile);
  });

  const created = await getDoc(ref);
  if (!created.exists()) {
    // Firestore guarantees a committed transaction's write is visible to a
    // subsequent read; reaching this would mean something deleted the
    // document in the brief window after commit.
    throw new Error('User profile document missing immediately after creation.');
  }
  return created.data() as UserProfile;
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userDocRef(uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

/** Updates only the base-profile fields clients are permitted to change (see firestore.rules). */
export async function updateUserProfile(
  uid: string,
  fields: UpdatableUserProfileFields,
): Promise<void> {
  await updateDoc(userDocRef(uid), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}
