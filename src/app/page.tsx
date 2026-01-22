"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Check } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured, getMissingConfig } from "@/lib/firebase";
import { createUserProfile, type UserProfile } from "@/lib/db";
import { getSports, DEFAULT_SPORTS, type Sport } from "@/lib/sports";
import { useToast } from "@/hooks/use-toast";
import { ConfigErrorScreen } from "@/components/ConfigErrorScreen";
import { 
  Step1, 
  Step2, 
  StepGrowth, 
  ONBOARDING_STORAGE_KEY,
  type OnboardingData 
} from "@/components/onboarding";

// État initial du formulaire
const initialData: OnboardingData = {
  email: "",
  password: "",
  confirmPassword: "",
  selectedSports: [],
  selectedLevel: "",
  referredBy: null,
};

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // États
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [sports, setSports] = useState<Sport[]>(DEFAULT_SPORTS);

  // Load sports and restore state from localStorage
  useEffect(() => {
    const init = async () => {
      // Load sports
      try {
        const loadedSports = await getSports();
        setSports(loadedSports);
      } catch (e) {
        console.warn('[Onboarding] Using default sports');
        setSports(DEFAULT_SPORTS);
      }

      // Get referral code from URL
      const refCode = searchParams.get("ref");
      
      // Restore from localStorage (PERSISTANCE)
      try {
        const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Restore step and data if not completed
          if (parsed.step && parsed.step < 3) {
            setStep(parsed.step);
            setData(prev => ({
              ...prev,
              ...parsed.data,
              // URL referral code takes priority
              referredBy: refCode || parsed.data?.referredBy || null,
            }));
            console.log('[Onboarding] Restored from localStorage, step:', parsed.step);
          }
        } else if (refCode) {
          setData(prev => ({ ...prev, referredBy: refCode }));
        }
      } catch (e) {
        console.warn('[Onboarding] localStorage restore failed');
        if (refCode) {
          setData(prev => ({ ...prev, referredBy: refCode }));
        }
      }
      
      setIsHydrated(true);
    };

    init();
  }, [searchParams]);

  // Save to localStorage on changes (PERSISTANCE)
  useEffect(() => {
    if (!isHydrated) return;
    
    // Clear localStorage if account created
    if (step >= 3) {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      return;
    }

    // Save current state
    try {
      const dataToSave = {
        step,
        data: {
          email: data.email,
          // Don't save passwords for security
          selectedSports: data.selectedSports,
          selectedLevel: data.selectedLevel,
          referredBy: data.referredBy,
        },
      };
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('[Onboarding] Saved to localStorage, step:', step);
    } catch (e) {
      console.warn('[Onboarding] localStorage save failed');
    }
  }, [step, data, isHydrated]);

  const handleDataChange = useCallback((newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const handleNextStep = useCallback(() => {
    setStep(prev => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setStep(prev => prev - 1);
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      let uid: string;

      if (isFirebaseConfigured && auth) {
        // Use Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          data.email, 
          data.password
        );
        uid = userCredential.user.uid;
      } else {
        // Fallback: generate local user ID
        uid = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Store credentials in localStorage for demo purposes
        localStorage.setItem('spordate_user_email', data.email);
        localStorage.setItem('spordate_user_id', uid);
      }

      const profile = await createUserProfile(
        uid,
        data.email,
        data.selectedSports,
        data.selectedLevel,
        data.referredBy || undefined
      );

      setUserProfile(profile);
      setStep(3);
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);

      toast({
        title: "Compte créé ! 🎉",
        description: isFirebaseConfigured 
          ? "Bienvenue dans la communauté Spordate."
          : "Bienvenue ! Mode local activé.",
      });
    } catch (error: any) {
      console.error("[Onboarding] Error:", error);
      
      let errorMessage = "Une erreur est survenue.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Cet email est déjà utilisé.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email invalide.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Mot de passe trop faible.";
      }

      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [data, toast]);

  const handleGoToProfile = useCallback(() => {
    router.push("/profile");
  }, [router]);

  // Loading state
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <Dumbbell className="h-10 w-10 text-primary" />
        </div>
      </div>
    );
  }

  // Show configuration error only if Stripe is not configured
  const missingKeys = getMissingConfig();
  if (missingKeys.length > 0) {
    return <ConfigErrorScreen missingKeys={missingKeys} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[250px] bg-primary/10 rounded-full blur-[100px] -z-10" />

      <Card className="w-full max-w-sm bg-card/95 backdrop-blur border-border/20 shadow-2xl">
        {/* Header */}
        <CardHeader className="text-center pb-3 pt-5">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Dumbbell className="h-7 w-7 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] rounded-md p-1 text-white" />
            <span className="font-bold text-xl">Spordate</span>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  step === s
                    ? "bg-primary text-primary-foreground scale-110"
                    : step > s
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-3.5 w-3.5" /> : s}
              </div>
            ))}
          </div>

          <CardTitle className="text-lg">
            {step === 1 && "Créer un compte"}
            {step === 2 && "Tes sports"}
            {step === 3 && "Bienvenue ! 🎉"}
          </CardTitle>
          <CardDescription className="text-xs">
            {step === 1 && "Entre tes identifiants pour commencer."}
            {step === 2 && "Sélectionne tes sports favoris."}
            {step === 3 && "Invite tes amis à rejoindre Spordate !"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-5">
          {step === 1 && (
            <Step1
              data={data}
              onDataChange={handleDataChange}
              onNext={handleNextStep}
              referredBy={data.referredBy}
            />
          )}

          {step === 2 && (
            <Step2
              data={data}
              onDataChange={handleDataChange}
              onBack={handlePrevStep}
              onSubmit={handleSubmit}
              loading={loading}
              sports={sports}
            />
          )}

          {step === 3 && userProfile && (
            <StepGrowth
              referralCode={userProfile.referralCode}
              onGoToProfile={handleGoToProfile}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
