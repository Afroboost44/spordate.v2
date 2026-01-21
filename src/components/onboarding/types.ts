// Types partagés pour l'onboarding

export interface OnboardingData {
  email: string;
  password: string;
  confirmPassword: string;
  selectedSports: string[];
  selectedLevel: string;
  referredBy: string | null;
}

export interface Step1Props {
  data: OnboardingData;
  onDataChange: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  referredBy: string | null;
}

export interface Step2Props {
  data: OnboardingData;
  onDataChange: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
}

export interface StepGrowthProps {
  referralCode: string;
  onGoToProfile: () => void;
}

// Sports disponibles avec icônes Lucide
export const SPORTS = [
  { id: "tennis", label: "Tennis", icon: "Volleyball" },
  { id: "padel", label: "Padel", icon: "TableTennis" },
  { id: "running", label: "Running", icon: "Footprints" },
  { id: "fitness", label: "Fitness", icon: "Dumbbell" },
] as const;

// Niveaux sportifs
export const LEVELS = [
  { id: "debutant", label: "Débutant", description: "Je découvre" },
  { id: "intermediaire", label: "Intermédiaire", description: "Je progresse" },
  { id: "confirme", label: "Confirmé", description: "Je maîtrise" },
  { id: "expert", label: "Expert", description: "Je performe" },
] as const;

// Clé localStorage pour la persistance
export const ONBOARDING_STORAGE_KEY = "spordate_onboarding";
