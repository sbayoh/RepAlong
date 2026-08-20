import { isValidEmail, validateSignInForm, validateSignUpForm } from '@/features/auth/validation';

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('jane@example.com')).toBe(true);
  });

  it('rejects a missing @', () => {
    expect(isValidEmail('jane.example.com')).toBe(false);
  });

  it('rejects a missing domain', () => {
    expect(isValidEmail('jane@')).toBe(false);
  });
});

describe('validateSignUpForm', () => {
  const validForm = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  it('returns null for a fully valid form', () => {
    expect(validateSignUpForm(validForm)).toBeNull();
  });

  it('treats whitespace-only names as missing', () => {
    expect(validateSignUpForm({ ...validForm, firstName: '   ' })).toMatch(/all fields/i);
  });

  it('rejects a malformed email', () => {
    expect(validateSignUpForm({ ...validForm, email: 'not-an-email' })).toMatch(/valid email/i);
  });

  it('rejects a password below the Firebase minimum', () => {
    expect(
      validateSignUpForm({ ...validForm, password: '123', confirmPassword: '123' }),
    ).toMatch(/at least/i);
  });

  it('rejects mismatched passwords', () => {
    expect(validateSignUpForm({ ...validForm, confirmPassword: 'different' })).toMatch(
      /do not match/i,
    );
  });
});

describe('validateSignInForm', () => {
  it('returns null when both fields are present and email is valid', () => {
    expect(validateSignInForm({ email: 'jane@example.com', password: 'anything' })).toBeNull();
  });

  it('rejects an empty password', () => {
    expect(validateSignInForm({ email: 'jane@example.com', password: '' })).toMatch(
      /email and password/i,
    );
  });

  it('rejects a malformed email', () => {
    expect(validateSignInForm({ email: 'not-an-email', password: 'anything' })).toMatch(
      /valid email/i,
    );
  });
});
