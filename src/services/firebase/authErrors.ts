import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use':
    'An account with this email already exists. Try signing in instead.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/weak-password': 'Choose a stronger password (at least 6 characters).',
  'auth/invalid-credential': 'That email or password is incorrect.',
  'auth/wrong-password': 'That email or password is incorrect.',
  'auth/user-not-found': 'That email or password is incorrect.',
  'auth/user-disabled': 'This account has been disabled. Contact support for help.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
};

const DEFAULT_AUTH_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * True when `error` is Firebase's "no account matches this email" code. Password reset
 * uses this to swallow the error into a success response — never revealing whether an
 * account exists — rather than mapping it through `getAuthErrorMessage`.
 */
export function isAccountNotFoundError(error: unknown): boolean {
  return error instanceof FirebaseError && error.code === 'auth/user-not-found';
}

/** Maps a Firebase Auth error to a user-facing message. Never exposes raw error codes/objects. */
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    const message = AUTH_ERROR_MESSAGES[error.code];
    if (message) {
      return message;
    }
    if (__DEV__) {
      console.warn(`[auth] Unmapped Firebase error code: ${error.code}`);
    }
  }
  return DEFAULT_AUTH_ERROR_MESSAGE;
}
