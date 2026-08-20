import type { FieldValue, Timestamp } from 'firebase/firestore';

/**
 * Private account-foundation document at `users/{uid}`.
 *
 * This is NOT a public/discoverable profile. Later phases will introduce a
 * separate public profile document for discovery; this document stays
 * private account data (see docs/architecture.md).
 */
export type AccountStatus = 'active' | 'suspended' | 'deleted';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  onboardingCompleted: boolean;
  accountStatus: AccountStatus;
}

/** Shape written to Firestore, where timestamp fields are server-resolved sentinels. */
export type UserProfileWrite = Omit<UserProfile, 'createdAt' | 'updatedAt'> & {
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

/** Base-profile fields a signed-in client may update about themselves. */
export type UpdatableUserProfileFields = Partial<
  Pick<UserProfile, 'firstName' | 'lastName' | 'displayName' | 'onboardingCompleted'>
>;
