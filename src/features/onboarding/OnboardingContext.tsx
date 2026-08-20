import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { completeOnboarding } from '@/services/firebase';
import { useAuthSession } from '@/features/auth/AuthContext';
import type { ExperienceLevel, Goal, TrainingInterest, TrainingVibe } from '@/constants/onboarding';
import type { OnboardingDraft } from '@/types/profile';

type OnboardingDraftState = {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  experienceLevel: ExperienceLevel | null;
  goals: Goal[];
  trainingInterests: TrainingInterest[];
  trainingVibes: TrainingVibe[];
  interestedInHosting: boolean | null;
};

type OnboardingContextValue = {
  draft: OnboardingDraftState;
  setBasics: (values: { firstName: string; lastName: string; displayName: string; bio: string }) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  toggleGoal: (goal: Goal) => void;
  toggleInterest: (interest: TrainingInterest) => void;
  toggleVibe: (vibe: TrainingVibe) => void;
  setInterestedInHosting: (value: boolean) => void;
  isSubmitting: boolean;
  submitError: string | null;
  finishOnboarding: () => Promise<boolean>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function useOnboarding(): OnboardingContextValue {
  const value = useContext(OnboardingContext);
  if (!value) {
    throw new Error('useOnboarding must be used within an <OnboardingProvider />');
  }
  return value;
}

function toggleInArray<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((existing) => existing !== item) : [...list, item];
}

export function OnboardingProvider({ children }: PropsWithChildren) {
  const { firebaseUser, profile } = useAuthSession();

  const [draft, setDraft] = useState<OnboardingDraftState>(() => ({
    firstName: profile?.firstName ?? '',
    lastName: profile?.lastName ?? '',
    displayName: profile?.displayName ?? firebaseUser?.displayName ?? '',
    bio: '',
    experienceLevel: null,
    goals: [],
    trainingInterests: [],
    trainingVibes: [],
    interestedInHosting: null,
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setBasics = useCallback<OnboardingContextValue['setBasics']>((values) => {
    setDraft((prev) => ({ ...prev, ...values }));
  }, []);

  const setExperienceLevel = useCallback((level: ExperienceLevel) => {
    setDraft((prev) => ({ ...prev, experienceLevel: level }));
  }, []);

  const toggleGoal = useCallback((goal: Goal) => {
    setDraft((prev) => ({ ...prev, goals: toggleInArray(prev.goals, goal) }));
  }, []);

  const toggleInterest = useCallback((interest: TrainingInterest) => {
    setDraft((prev) => ({
      ...prev,
      trainingInterests: toggleInArray(prev.trainingInterests, interest),
    }));
  }, []);

  const toggleVibe = useCallback((vibe: TrainingVibe) => {
    setDraft((prev) => ({ ...prev, trainingVibes: toggleInArray(prev.trainingVibes, vibe) }));
  }, []);

  const setInterestedInHosting = useCallback((value: boolean) => {
    setDraft((prev) => ({ ...prev, interestedInHosting: value }));
  }, []);

  const finishOnboarding = useCallback(async () => {
    if (!firebaseUser) return false;
    if (!draft.experienceLevel || draft.interestedInHosting === null) return false;

    const payload: OnboardingDraft = {
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      displayName: draft.displayName.trim(),
      bio: draft.bio.trim(),
      experienceLevel: draft.experienceLevel,
      goals: draft.goals,
      trainingInterests: draft.trainingInterests,
      trainingVibes: draft.trainingVibes,
      interestedInHosting: draft.interestedInHosting,
    };

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await completeOnboarding(firebaseUser.uid, payload);
      return true;
    } catch {
      setSubmitError('Could not finish setting up your profile. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, firebaseUser]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft,
      setBasics,
      setExperienceLevel,
      toggleGoal,
      toggleInterest,
      toggleVibe,
      setInterestedInHosting,
      isSubmitting,
      submitError,
      finishOnboarding,
    }),
    [
      draft,
      setBasics,
      setExperienceLevel,
      toggleGoal,
      toggleInterest,
      toggleVibe,
      setInterestedInHosting,
      isSubmitting,
      submitError,
      finishOnboarding,
    ],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
