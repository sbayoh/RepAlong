/**
 * Firestore Security Rules tests for `firestore.rules`, using the official
 * `@firebase/rules-unit-testing` library against a locally running Firestore
 * emulator (127.0.0.1:8080 — see `firebase.json` / docs/architecture.md).
 *
 * Not part of `npm test` (requires a running emulator); run explicitly via
 * `npm run test:rules`.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

const PROJECT_ID = 'repalong-rules-test';

let testEnv: RulesTestEnvironment;

function validNewUserDoc(uid: string, overrides: Record<string, unknown> = {}) {
  return {
    uid,
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    displayName: 'Jane Doe',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    onboardingCompleted: false,
    accountStatus: 'active',
    ...overrides,
  };
}

async function seedUserDoc(uid: string, overrides: Record<string, unknown> = {}) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'users', uid), validNewUserDoc(uid, overrides));
  });
}

function validNewProfileDoc(uid: string, overrides: Record<string, unknown> = {}) {
  return {
    uid,
    displayName: 'Jane Doe',
    firstName: 'Jane',
    lastName: 'Doe',
    bio: 'Training for a 5k.',
    experienceLevel: 'beginner',
    goals: ['build_strength', 'stay_consistent'],
    trainingInterests: ['strength_training', 'mobility'],
    trainingVibes: ['focused', 'social'],
    interestedInHosting: false,
    photoURL: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  };
}

async function seedProfileDoc(uid: string, overrides: Record<string, unknown> = {}) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'profiles', uid), validNewProfileDoc(uid, overrides));
  });
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(path.resolve(__dirname, 'firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('users/{uid} — unauthenticated', () => {
  test('cannot read', async () => {
    await seedUserDoc('alice');
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(unauthed.firestore(), 'users/alice')));
  });

  test('cannot create', async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(setDoc(doc(unauthed.firestore(), 'users/alice'), validNewUserDoc('alice')));
  });

  test('cannot update', async () => {
    await seedUserDoc('alice');
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(
      updateDoc(doc(unauthed.firestore(), 'users/alice'), { firstName: 'Hacked' }),
    );
  });
});

describe('users/{uid} — authenticated owner', () => {
  test('can create own correctly shaped document', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(setDoc(doc(alice.firestore(), 'users/alice'), validNewUserDoc('alice')));
  });

  test('can read own document', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(getDoc(doc(alice.firestore(), 'users/alice')));
  });

  test('cannot create with another uid in the uid field', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(doc(alice.firestore(), 'users/alice'), validNewUserDoc('alice', { uid: 'mallory' })),
    );
  });

  test('cannot create with accountStatus other than "active"', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'users/alice'),
        validNewUserDoc('alice', { accountStatus: 'suspended' }),
      ),
    );
  });

  test('cannot create with unexpected extra fields', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(doc(alice.firestore(), 'users/alice'), validNewUserDoc('alice', { isAdmin: true })),
    );
  });

  test('cannot backdate createdAt to a fixed client timestamp', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'users/alice'),
        validNewUserDoc('alice', { createdAt: new Date('2000-01-01') }),
      ),
    );
  });

  test('can update firstName', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(
      updateDoc(doc(alice.firestore(), 'users/alice'), {
        firstName: 'Janet',
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('can update lastName', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(
      updateDoc(doc(alice.firestore(), 'users/alice'), {
        lastName: 'Smith',
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('can update displayName', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(
      updateDoc(doc(alice.firestore(), 'users/alice'), {
        displayName: 'J. Doe',
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('can update onboardingCompleted', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(
      updateDoc(doc(alice.firestore(), 'users/alice'), {
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('cannot change uid', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      updateDoc(doc(alice.firestore(), 'users/alice'), {
        uid: 'mallory',
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('cannot change email', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      updateDoc(doc(alice.firestore(), 'users/alice'), {
        email: 'new@example.com',
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('cannot change createdAt', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      updateDoc(doc(alice.firestore(), 'users/alice'), {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('cannot change accountStatus', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      updateDoc(doc(alice.firestore(), 'users/alice'), {
        accountStatus: 'suspended',
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('cannot delete own user document', async () => {
    await seedUserDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(deleteDoc(doc(alice.firestore(), 'users/alice')));
  });
});

describe('users/{uid} — different authenticated user', () => {
  test('cannot read another user\'s document', async () => {
    await seedUserDoc('alice');
    const mallory = testEnv.authenticatedContext('mallory');
    await assertFails(getDoc(doc(mallory.firestore(), 'users/alice')));
  });

  test('cannot create another user\'s document', async () => {
    const mallory = testEnv.authenticatedContext('mallory');
    await assertFails(setDoc(doc(mallory.firestore(), 'users/alice'), validNewUserDoc('alice')));
  });

  test('cannot update another user\'s document', async () => {
    await seedUserDoc('alice');
    const mallory = testEnv.authenticatedContext('mallory');
    await assertFails(
      updateDoc(doc(mallory.firestore(), 'users/alice'), { firstName: 'Hacked' }),
    );
  });
});

describe('profiles/{uid} — unauthenticated', () => {
  test('cannot read', async () => {
    await seedProfileDoc('alice');
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(unauthed.firestore(), 'profiles/alice')));
  });

  test('cannot create', async () => {
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(
      setDoc(doc(unauthed.firestore(), 'profiles/alice'), validNewProfileDoc('alice')),
    );
  });

  test('cannot update', async () => {
    await seedProfileDoc('alice');
    const unauthed = testEnv.unauthenticatedContext();
    await assertFails(
      updateDoc(doc(unauthed.firestore(), 'profiles/alice'), { bio: 'Hacked' }),
    );
  });
});

describe('profiles/{uid} — authenticated owner', () => {
  test('can create own correctly shaped profile', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(
      setDoc(doc(alice.firestore(), 'profiles/alice'), validNewProfileDoc('alice')),
    );
  });

  test('can read own profile', async () => {
    await seedProfileDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(getDoc(doc(alice.firestore(), 'profiles/alice')));
  });

  test('can update editable fields', async () => {
    await seedProfileDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(
      updateDoc(doc(alice.firestore(), 'profiles/alice'), {
        bio: 'Updated bio',
        experienceLevel: 'intermediate',
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('cannot create with another uid in the uid field', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', { uid: 'mallory' }),
      ),
    );
  });

  test('cannot change uid', async () => {
    await seedProfileDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      updateDoc(doc(alice.firestore(), 'profiles/alice'), {
        uid: 'mallory',
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('cannot change createdAt', async () => {
    await seedProfileDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      updateDoc(doc(alice.firestore(), 'profiles/alice'), {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('cannot add unexpected fields', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', { isVerified: true }),
      ),
    );
  });

  test('cannot use an invalid experienceLevel', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', { experienceLevel: 'expert' }),
      ),
    );
  });

  test('cannot exceed the goals array limit', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', {
          goals: [
            'build_strength', 'build_muscle', 'fat_loss', 'general_fitness',
            'endurance', 'athletic_performance', 'learn_the_gym', 'stay_consistent',
            'extra_goal',
          ],
        }),
      ),
    );
  });

  test('cannot exceed the trainingVibes array limit', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', {
          trainingVibes: ['focused', 'social', 'relaxed', 'high_energy'],
        }),
      ),
    );
  });

  test('cannot use an unknown stored goal value', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', { goals: ['build_strength', 'fake_goal'] }),
      ),
    );
  });

  test('cannot use an unknown stored trainingInterest value', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', { trainingInterests: ['strength_training', 'whatever'] }),
      ),
    );
  });

  test('cannot use an unknown stored trainingVibe value', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', { trainingVibes: ['focused', 'extreme'] }),
      ),
    );
  });

  test('cannot store a duplicate goal value', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', { goals: ['build_strength', 'build_strength'] }),
      ),
    );
  });

  test('cannot store a duplicate trainingInterest value', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', {
          trainingInterests: ['strength_training', 'strength_training'],
        }),
      ),
    );
  });

  test('cannot store a duplicate trainingVibe value', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(
        doc(alice.firestore(), 'profiles/alice'),
        validNewProfileDoc('alice', { trainingVibes: ['focused', 'focused'] }),
      ),
    );
  });

  test('cannot delete own profile', async () => {
    await seedProfileDoc('alice');
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(deleteDoc(doc(alice.firestore(), 'profiles/alice')));
  });
});

describe('profiles/{uid} — different authenticated user', () => {
  test("cannot read another user's profile", async () => {
    await seedProfileDoc('alice');
    const mallory = testEnv.authenticatedContext('mallory');
    await assertFails(getDoc(doc(mallory.firestore(), 'profiles/alice')));
  });

  test("cannot create another user's profile", async () => {
    const mallory = testEnv.authenticatedContext('mallory');
    await assertFails(
      setDoc(doc(mallory.firestore(), 'profiles/alice'), validNewProfileDoc('alice')),
    );
  });

  test("cannot update another user's profile", async () => {
    await seedProfileDoc('alice');
    const mallory = testEnv.authenticatedContext('mallory');
    await assertFails(
      updateDoc(doc(mallory.firestore(), 'profiles/alice'), { bio: 'Hacked' }),
    );
  });
});

describe('unknown paths — default deny', () => {
  test('authenticated user cannot read an unmatched collection', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(getDoc(doc(alice.firestore(), 'other/thing')));
  });

  test('authenticated user cannot write an unmatched collection', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(setDoc(doc(alice.firestore(), 'other/thing'), { foo: 'bar' }));
  });
});
