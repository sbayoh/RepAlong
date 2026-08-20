import { FirebaseError } from 'firebase/app';

import { getAuthErrorMessage, isAccountNotFoundError } from '@/services/firebase/authErrors';

function firebaseError(code: string): FirebaseError {
  return new FirebaseError(code, `Firebase: Error (${code}).`);
}

describe('getAuthErrorMessage', () => {
  it('maps a known code to a friendly, non-technical message', () => {
    const message = getAuthErrorMessage(firebaseError('auth/email-already-in-use'));
    expect(message).toMatch(/already exists/i);
    expect(message).not.toMatch(/auth\//);
  });

  it('maps invalid-credential and wrong-password to the same generic message', () => {
    expect(getAuthErrorMessage(firebaseError('auth/invalid-credential'))).toBe(
      getAuthErrorMessage(firebaseError('auth/wrong-password')),
    );
  });

  it('falls back to a generic message for an unmapped Firebase error code, logging it in dev', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const message = getAuthErrorMessage(firebaseError('auth/some-future-error-code'));
      expect(message).toBe('Something went wrong. Please try again.');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('auth/some-future-error-code'),
      );
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('never leaks the raw error for non-Firebase errors', () => {
    const message = getAuthErrorMessage(new Error('some internal stack trace detail'));
    expect(message).toBe('Something went wrong. Please try again.');
  });
});

describe('isAccountNotFoundError', () => {
  it('returns true for auth/user-not-found', () => {
    expect(isAccountNotFoundError(firebaseError('auth/user-not-found'))).toBe(true);
  });

  it('returns false for a different Firebase error code', () => {
    expect(isAccountNotFoundError(firebaseError('auth/too-many-requests'))).toBe(false);
  });

  it('returns false for a non-Firebase error', () => {
    expect(isAccountNotFoundError(new Error('not a firebase error'))).toBe(false);
  });

  it('returns false for a non-error value', () => {
    expect(isAccountNotFoundError(null)).toBe(false);
    expect(isAccountNotFoundError(undefined)).toBe(false);
  });
});
