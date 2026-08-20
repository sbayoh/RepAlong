import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type DocumentReference,
} from 'firebase/firestore';

import { userDocRef } from '@/services/firebase/firestore';
import { firestoreDb } from '@/services/firebase/firestoreInstance';
import type {
  OnboardingDraft,
  Profile,
  ProfileRepairResult,
  UpdatableProfileFields,
} from '@/types/profile';

function profileDocRef(uid: string): DocumentReference {
  return doc(firestoreDb, 'profiles', uid);
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const snapshot = await getDoc(profileDocRef(uid));
  return snapshot.exists() ? (snapshot.data() as Profile) : null;
}

/**
 * Idempotent create-if-missing for `profiles/{uid}`, mirroring `ensureUserProfile`'s
 * transaction pattern. Not used by the Phase 2A onboarding flow itself (that goes
 * through `completeOnboarding`), but available for a future recovery/rebuild path that
 * has real user-supplied data to write — never call this with fabricated field values.
 */
export async function createProfile(uid: string, data: OnboardingDraft): Promise<Profile> {
  const ref = profileDocRef(uid);

  await runTransaction(firestoreDb, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists()) {
      return;
    }
    const now = serverTimestamp();
    transaction.set(ref, {
      uid,
      ...data,
      photoURL: null,
      createdAt: now,
      updatedAt: now,
    });
  });

  const created = await getDoc(ref);
  if (!created.exists()) {
    throw new Error('Profile document missing immediately after creation.');
  }
  return created.data() as Profile;
}

/** Updates only the editable profile fields clients are permitted to change (see firestore.rules). */
export async function updateProfile(uid: string, fields: UpdatableProfileFields): Promise<void> {
  await updateDoc(profileDocRef(uid), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Finishes onboarding: writes `profiles/{uid}` and flips
 * `users/{uid}.onboardingCompleted` to `true` in a single transaction, so a failure
 * partway through never leaves the account half-complete (either both writes land, or
 * neither does and the caller can safely retry the whole thing).
 *
 * Also syncs `firstName`/`lastName`/`displayName` onto `users/{uid}` from the same
 * finalized draft, so the private account doc never drifts from the name the user
 * actually finished onboarding with (it otherwise still holds whatever was typed at
 * signup). Every other draft field (bio, goals, interests, vibes, hosting) stays
 * profile-only — never duplicated onto `users/{uid}`.
 *
 * Preserves an existing profile's `createdAt`/`uid` if this is somehow not the first
 * call for this uid (e.g. a resubmission) rather than assuming first-write-wins.
 */
export async function completeOnboarding(uid: string, draft: OnboardingDraft): Promise<void> {
  const profileRef = profileDocRef(uid);
  const userRef = userDocRef(uid);

  await runTransaction(firestoreDb, async (transaction) => {
    const existingProfile = await transaction.get(profileRef);
    const now = serverTimestamp();

    if (existingProfile.exists()) {
      transaction.update(profileRef, { ...draft, updatedAt: now });
    } else {
      transaction.set(profileRef, {
        uid,
        ...draft,
        photoURL: null,
        createdAt: now,
        updatedAt: now,
      });
    }

    transaction.update(userRef, {
      firstName: draft.firstName,
      lastName: draft.lastName,
      displayName: draft.displayName,
      onboardingCompleted: true,
      updatedAt: now,
    });
  });
}

/**
 * Controlled recovery for `users/{uid}.onboardingCompleted === true` with
 * `profiles/{uid}` genuinely missing (not a transient read failure — the caller must
 * only invoke this after a successful `getProfile` confirms `null`).
 *
 * Never fabricates a replacement profile. If `profiles/{uid}` still exists (e.g. a
 * second repair attempt racing a prior one, or the earlier "missing" read was itself
 * stale), leaves `onboardingCompleted` untouched and tells the caller to just refresh.
 * Only when the transaction's own read confirms the document is absent does it flip
 * `users/{uid}.onboardingCompleted` back to `false`, which routing
 * (`src/app/_layout.tsx`) then naturally reads as "needs onboarding" and returns the
 * user to the `(onboarding)` flow to rebuild it with real answers.
 */
export async function beginProfileRepair(uid: string): Promise<ProfileRepairResult> {
  const profileRef = profileDocRef(uid);
  const userRef = userDocRef(uid);

  return runTransaction(firestoreDb, async (transaction) => {
    const existingProfile = await transaction.get(profileRef);
    if (existingProfile.exists()) {
      return { outcome: 'profile-exists' };
    }

    transaction.update(userRef, {
      onboardingCompleted: false,
      updatedAt: serverTimestamp(),
    });
    return { outcome: 'repaired' };
  });
}
