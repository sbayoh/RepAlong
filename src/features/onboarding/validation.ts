import {
  BIO_MAX_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
  MAX_TRAINING_VIBES,
  MIN_TRAINING_VIBES,
  NAME_MAX_LENGTH,
  type ExperienceLevel,
} from '@/constants/onboarding';

export type BasicsStepValues = {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
};

/** Returns a user-facing error message, or null if the step is valid. Does not mutate input. */
export function validateBasicsStep(values: BasicsStepValues): string | null {
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const displayName = values.displayName.trim();

  if (!firstName || !lastName || !displayName) {
    return 'Please fill in your name.';
  }
  if (firstName.length > NAME_MAX_LENGTH || lastName.length > NAME_MAX_LENGTH) {
    return 'Names must be shorter.';
  }
  if (displayName.length > DISPLAY_NAME_MAX_LENGTH) {
    return `Display name must be ${DISPLAY_NAME_MAX_LENGTH} characters or fewer.`;
  }
  if (values.bio.length > BIO_MAX_LENGTH) {
    return `Bio must be ${BIO_MAX_LENGTH} characters or fewer.`;
  }
  return null;
}

export function validateExperienceStep(experienceLevel: ExperienceLevel | null): string | null {
  if (!experienceLevel) {
    return 'Choose your experience level.';
  }
  return null;
}

export function validateGoalsStep(goals: string[]): string | null {
  if (goals.length === 0) {
    return 'Choose at least one goal.';
  }
  return null;
}

export function validateInterestsStep(trainingInterests: string[]): string | null {
  if (trainingInterests.length === 0) {
    return 'Choose at least one training interest.';
  }
  return null;
}

export function validateVibeStep(trainingVibes: string[]): string | null {
  if (trainingVibes.length < MIN_TRAINING_VIBES) {
    return 'Choose at least one training vibe.';
  }
  if (trainingVibes.length > MAX_TRAINING_VIBES) {
    return `Choose up to ${MAX_TRAINING_VIBES} training vibes.`;
  }
  return null;
}

export function validateHostingStep(interestedInHosting: boolean | null): string | null {
  if (interestedInHosting === null) {
    return 'Choose an option to continue.';
  }
  return null;
}
