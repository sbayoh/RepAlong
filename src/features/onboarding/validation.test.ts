import {
  validateBasicsStep,
  validateExperienceStep,
  validateGoalsStep,
  validateHostingStep,
  validateInterestsStep,
  validateVibeStep,
} from '@/features/onboarding/validation';

describe('validateBasicsStep', () => {
  const validValues = { firstName: 'Jane', lastName: 'Doe', displayName: 'Jane D.', bio: '' };

  it('returns null for fully valid values', () => {
    expect(validateBasicsStep(validValues)).toBeNull();
  });

  it('treats whitespace-only names as missing', () => {
    expect(validateBasicsStep({ ...validValues, firstName: '   ' })).toMatch(/name/i);
  });

  it('rejects a display name over the max length', () => {
    expect(validateBasicsStep({ ...validValues, displayName: 'x'.repeat(61) })).toMatch(
      /display name/i,
    );
  });

  it('rejects a bio over the max length', () => {
    expect(validateBasicsStep({ ...validValues, bio: 'x'.repeat(301) })).toMatch(/bio/i);
  });

  it('accepts an empty bio', () => {
    expect(validateBasicsStep({ ...validValues, bio: '' })).toBeNull();
  });
});

describe('validateExperienceStep', () => {
  it('returns null when a level is chosen', () => {
    expect(validateExperienceStep('beginner')).toBeNull();
  });

  it('rejects no selection', () => {
    expect(validateExperienceStep(null)).toMatch(/choose/i);
  });
});

describe('validateGoalsStep', () => {
  it('returns null with at least one goal', () => {
    expect(validateGoalsStep(['build_strength'])).toBeNull();
  });

  it('rejects an empty selection', () => {
    expect(validateGoalsStep([])).toMatch(/at least one/i);
  });
});

describe('validateInterestsStep', () => {
  it('returns null with at least one interest', () => {
    expect(validateInterestsStep(['cardio'])).toBeNull();
  });

  it('rejects an empty selection', () => {
    expect(validateInterestsStep([])).toMatch(/at least one/i);
  });
});

describe('validateVibeStep', () => {
  it('returns null with one vibe', () => {
    expect(validateVibeStep(['focused'])).toBeNull();
  });

  it('returns null with three vibes', () => {
    expect(validateVibeStep(['focused', 'social', 'relaxed'])).toBeNull();
  });

  it('rejects an empty selection', () => {
    expect(validateVibeStep([])).toMatch(/at least one/i);
  });

  it('rejects more than three selections', () => {
    expect(
      validateVibeStep(['focused', 'social', 'relaxed', 'high_energy']),
    ).toMatch(/up to 3/i);
  });
});

describe('validateHostingStep', () => {
  it('returns null when true is chosen', () => {
    expect(validateHostingStep(true)).toBeNull();
  });

  it('returns null when false is chosen', () => {
    expect(validateHostingStep(false)).toBeNull();
  });

  it('rejects no selection', () => {
    expect(validateHostingStep(null)).toMatch(/choose/i);
  });
});
