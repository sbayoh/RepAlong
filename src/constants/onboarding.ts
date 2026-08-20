/**
 * Typed onboarding/profile vocabulary — stored values plus their user-facing labels.
 * Screens should always render via the `*_LABELS` maps, never a raw stored value.
 */

export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'experienced'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  experienced: 'Experienced',
};

export const EXPERIENCE_LEVEL_DESCRIPTIONS: Record<ExperienceLevel, string> = {
  beginner: "I'm still learning the gym and building confidence.",
  intermediate: 'I train consistently and know my way around.',
  experienced: "I've trained for years and have a strong routine.",
};

export const GOALS = [
  'build_strength',
  'build_muscle',
  'fat_loss',
  'general_fitness',
  'endurance',
  'athletic_performance',
  'learn_the_gym',
  'stay_consistent',
] as const;
export type Goal = (typeof GOALS)[number];

export const GOAL_LABELS: Record<Goal, string> = {
  build_strength: 'Build strength',
  build_muscle: 'Build muscle',
  fat_loss: 'Fat loss',
  general_fitness: 'General fitness',
  endurance: 'Endurance',
  athletic_performance: 'Athletic performance',
  learn_the_gym: 'Learn the gym',
  stay_consistent: 'Stay consistent',
};

export const TRAINING_INTERESTS = [
  'strength_training',
  'bodybuilding',
  'powerlifting',
  'functional_fitness',
  'cardio',
  'hiit',
  'mobility',
  'calisthenics',
  'sports_training',
] as const;
export type TrainingInterest = (typeof TRAINING_INTERESTS)[number];

export const TRAINING_INTEREST_LABELS: Record<TrainingInterest, string> = {
  strength_training: 'Strength training',
  bodybuilding: 'Bodybuilding',
  powerlifting: 'Powerlifting',
  functional_fitness: 'Functional fitness',
  cardio: 'Cardio',
  hiit: 'HIIT',
  mobility: 'Mobility',
  calisthenics: 'Calisthenics',
  sports_training: 'Sports training',
};

export const TRAINING_VIBES = [
  'focused',
  'social',
  'beginner_friendly',
  'high_energy',
  'relaxed',
  'accountability',
] as const;
export type TrainingVibe = (typeof TRAINING_VIBES)[number];

export const TRAINING_VIBE_LABELS: Record<TrainingVibe, string> = {
  focused: 'Focused',
  social: 'Social',
  beginner_friendly: 'Beginner friendly',
  high_energy: 'High energy',
  relaxed: 'Relaxed',
  accountability: 'Accountability',
};

/** Product rule: the training-vibe step allows 1–3 selections (see AGENTS.md Phase 2A spec). */
export const MIN_TRAINING_VIBES = 1;
export const MAX_TRAINING_VIBES = 3;

export const BIO_MAX_LENGTH = 300;
export const DISPLAY_NAME_MAX_LENGTH = 60;
export const NAME_MAX_LENGTH = 60;
