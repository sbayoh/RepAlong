import type { FieldValue, Timestamp } from 'firebase/firestore';

import type { ExperienceLevel, Goal, TrainingInterest, TrainingVibe } from '@/constants/onboarding';

/**
 * `profiles/{uid}` — the RepAlong profile foundation (Phase 2A).
 *
 * Distinct from `users/{uid}` (`src/types/user.ts`), which stays private account data.
 * This document is owner-readable only for now; a later, separately reviewed phase
 * decides how/when it becomes publicly discoverable. See docs/architecture.md.
 */
export interface Profile {
  uid: string;
  displayName: string;
  firstName: string;
  lastName: string;
  bio: string;
  experienceLevel: ExperienceLevel;
  goals: Goal[];
  trainingInterests: TrainingInterest[];
  trainingVibes: TrainingVibe[];
  interestedInHosting: boolean;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Shape written to Firestore, where timestamp fields are server-resolved sentinels. */
export type ProfileWrite = Omit<Profile, 'createdAt' | 'updatedAt'> & {
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

/** Editable profile fields a signed-in client may update about themselves. */
export type UpdatableProfileFields = Partial<
  Pick<
    Profile,
    | 'displayName'
    | 'firstName'
    | 'lastName'
    | 'bio'
    | 'experienceLevel'
    | 'goals'
    | 'trainingInterests'
    | 'trainingVibes'
    | 'interestedInHosting'
    | 'photoURL'
  >
>;

/** The full set of profile fields the onboarding flow collects before first submission. */
export type OnboardingDraft = Pick<
  Profile,
  | 'displayName'
  | 'firstName'
  | 'lastName'
  | 'bio'
  | 'experienceLevel'
  | 'goals'
  | 'trainingInterests'
  | 'trainingVibes'
  | 'interestedInHosting'
>;

/**
 * Result of `beginProfileRepair`: `'profile-exists'` means the transaction's own read
 * found `profiles/{uid}` present after all, so `onboardingCompleted` was left
 * untouched — the caller should just refresh and re-render. `'repaired'` means the
 * document was confirmed missing and `users/{uid}.onboardingCompleted` was reset to
 * `false`, so routing returns the user to `(onboarding)`.
 */
export type ProfileRepairResult = { outcome: 'profile-exists' } | { outcome: 'repaired' };
