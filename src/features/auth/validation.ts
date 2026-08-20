/** Firebase Auth rejects passwords shorter than 6 characters. */
export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/** Returns a user-facing error message, or null if the form is valid. Does not mutate input. */
export function validateSignUpForm(values: SignUpFormValues): string | null {
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const email = values.email.trim();

  if (!firstName || !lastName || !email || !values.password || !values.confirmPassword) {
    return 'Please fill in all fields.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (values.password !== values.confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}

export type SignInFormValues = {
  email: string;
  password: string;
};

export function validateSignInForm(values: SignInFormValues): string | null {
  const email = values.email.trim();
  if (!email || !values.password) {
    return 'Please enter your email and password.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  return null;
}

export type ForgotPasswordFormValues = {
  email: string;
};

export function validateForgotPasswordForm(values: ForgotPasswordFormValues): string | null {
  const email = values.email.trim();
  if (!email) {
    return 'Enter your email address.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  return null;
}
