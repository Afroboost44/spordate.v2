"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Check } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { createUserProfile, type UserProfile } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
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

  // Capturer le code de parrainage depuis l'URL et restaurer l'état
  useEffect(() => {
    // Récupérer le code de parrainage depuis l'URL
    const refCode = searchParams.get("ref");
    
    // Restaurer depuis localStorage
    try {
      const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ne restaurer que si on n'est pas à l'étape 3 (compte créé)
        if (parsed.step && parsed.step < 3) {
          setStep(parsed.step);
          setData(prev => ({
            ...prev,
            ...parsed.data,
            // Le code de parrainage de l'URL a priorité
            referredBy: refCode || parsed.data?.referredBy || null,
          }));
        }
      } else if (refCode) {
        setData(prev => ({ ...prev, referredBy: refCode }));
      }
    } catch (e) {
      console.error("Erreur restauration localStorage:", e);
      if (refCode) {
        setData(prev => ({ ...prev, referredBy: refCode }));
      }
    }
    
    setIsHydrated(true);
  }, [searchParams]);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (!isHydrated) return;
    
    // Ne pas sauvegarder si le compte est créé
    if (step >= 3) {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      return;
    }

    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({
        step,
        data: {
          email: data.email,
          // Ne pas sauvegarder les mots de passe pour des raisons de sécurité
          selectedSports: data.selectedSports,
          selectedLevel: data.selectedLevel,
          referredBy: data.referredBy,
        },
      }));
    } catch (e) {
      console.error("Erreur sauvegarde localStorage:", e);
    }
  }, [step, data, isHydrated]);

  // Mettre à jour les données
  const handleDataChange = useCallback((newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  // Passer à l'étape suivante
  const handleNextStep = useCallback(() => {
    setStep(prev => prev + 1);
  }, []);

  // Revenir à l'étape précédente
  const handlePrevStep = useCallback(() => {
    setStep(prev => prev - 1);
  }, []);

  // Soumettre le formulaire (Step 2)
  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      let uid: string;
      
      // Si Firebase est configuré, créer le compte auth
      if (isFirebaseConfigured && auth) {
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          data.email, 
          data.password
        );
        uid = userCredential.user.uid;
      } else {
        // Mode démo - générer un UID fictif
        uid = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.warn('Firebase not configured - running in demo mode');
      }

      // Créer le profil (local ou Firestore selon config)
      const profile = await createUserProfile(
        uid,
        data.email,
        data.selectedSports,
        data.selectedLevel,
        data.referredBy || undefined
      );

      setUserProfile(profile);
      setStep(3);
      
      // Nettoyer le localStorage après succès
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);

      toast({
        title: "Compte créé !",
        description: isFirebaseConfigured 
          ? "Bienvenue dans la communauté Spordate."
          : "Mode démo - Firebase non configuré.",
      });
    } catch (error: any) {
      console.error("Erreur inscription:", error);
      
      let errorMessage = "Une erreur est survenue lors de l'inscription.";
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

  // Aller au profil
  const handleGoToProfile = useCallback(() => {
    router.push("/profile");
  }, [router]);

  // Attendre l'hydratation pour éviter les problèmes de SSR
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="animate-pulse">
          <Dumbbell className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      <Card className="w-full max-w-md bg-card border-border/20 shadow-xl">
        {/* Header avec logo */}
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Dumbbell className="h-8 w-8 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] rounded-md p-1 text-white" />
            <span className="font-bold text-2xl">Spordate</span>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step === s
                    ? "bg-primary text-primary-foreground scale-110"
                    : step > s
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
            ))}
          </div>

          <CardTitle className="text-xl">
            {step === 1 && "Créer un compte"}
            {step === 2 && "Tes sports"}
            {step === 3 && "Bienvenue ! 🎉"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Entre tes identifiants pour commencer."}
            {step === 2 && "Sélectionne tes sports favoris et ton niveau."}
            {step === 3 && "Invite tes amis à rejoindre Spordate !"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* STEP 1: Email & Password */}
          {step === 1 && (
            <Step1
              data={data}
              onDataChange={handleDataChange}
              onNext={handleNextStep}
              referredBy={data.referredBy}
            />
          )}

          {/* STEP 2: Sports & Niveau */}
          {step === 2 && (
            <Step2
              data={data}
              onDataChange={handleDataChange}
              onBack={handlePrevStep}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}

          {/* STEP 3: Growth - Partage */}
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
