/**
 * Unit tests for `beginProfileRepair`'s decision logic (see profile.ts). Mocks
 * `firebase/firestore` and the app's Firestore instance entirely — no emulator
 * involved, unlike `firestore.rules.test.ts` — so these run as part of `npm test`.
 */
import { runTransaction } from 'firebase/firestore';

import { beginProfileRepair } from '@/services/firebase/profile';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn((_db, collection, id) => ({ collection, id })),
  getDoc: jest.fn(),
  runTransaction: jest.fn(),
  serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
  updateDoc: jest.fn(),
}));

jest.mock('@/services/firebase/firestoreInstance', () => ({
  firestoreDb: {},
}));

const mockRunTransaction = runTransaction as jest.Mock;

function mockTransactionWith(get: jest.Mock, update: jest.Mock) {
  mockRunTransaction.mockImplementation(async (_db, updater) => updater({ get, update }));
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('beginProfileRepair', () => {
  // Case A: profile exists — must not reset onboarding.
  test('leaves onboardingCompleted untouched when the profile already exists', async () => {
    const update = jest.fn();
    mockTransactionWith(jest.fn().mockResolvedValue({ exists: () => true }), update);

    const result = await beginProfileRepair('alice');

    expect(result).toEqual({ outcome: 'profile-exists' });
    expect(update).not.toHaveBeenCalled();
  });

  // Case B: profile confirmed missing — resets onboardingCompleted to false.
  test('resets onboardingCompleted to false when the profile is confirmed missing', async () => {
    const update = jest.fn();
    mockTransactionWith(jest.fn().mockResolvedValue({ exists: () => false }), update);

    const result = await beginProfileRepair('alice');

    expect(result).toEqual({ outcome: 'repaired' });
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ onboardingCompleted: false }),
    );
  });

  // Case C: the read itself throws (e.g. network failure) — must not reset onboarding.
  test('propagates a read failure without resetting onboarding', async () => {
    const update = jest.fn();
    mockTransactionWith(jest.fn().mockRejectedValue(new Error('network error')), update);

    await expect(beginProfileRepair('alice')).rejects.toThrow('network error');
    expect(update).not.toHaveBeenCalled();
  });
});
