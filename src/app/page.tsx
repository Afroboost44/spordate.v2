"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dumbbell, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Share2, 
  Copy,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { createUserProfile, generateReferralCode, type UserProfile } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

// Sports disponibles
const SPORTS = [
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "padel", label: "Padel", emoji: "🏓" },
  { id: "running", label: "Running", emoji: "🏃" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
];

// Niveaux sportifs
const LEVELS = [
  { id: "debutant", label: "Débutant" },
  { id: "intermediaire", label: "Intermédiaire" },
  { id: "confirme", label: "Confirmé" },
  { id: "expert", label: "Expert" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // États du formulaire
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Step 1: Inscription
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Sports & Niveau
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("");

  // Referral code depuis l'URL
  const [referredBy, setReferredBy] = useState<string | null>(null);

  // Capturer le code de parrainage depuis l'URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferredBy(refCode);
    }
  }, [searchParams]);

  // Toggle sport selection
  const toggleSport = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId)
        ? prev.filter((s) => s !== sportId)
        : [...prev, sportId]
    );
  };

  // Step 1: Créer le compte Firebase
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
      });
      return;
    }

    setStep(2);
  };

  // Step 2: Enregistrer le profil et finaliser
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSports.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins un sport.",
      });
      return;
    }

    if (!selectedLevel) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner votre niveau.",
      });
      return;
    }

    setLoading(true);

    try {
      // Créer le compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Créer le profil Firestore
      const profile = await createUserProfile(
        user.uid,
        email,
        selectedSports,
        selectedLevel,
        referredBy || undefined
      );

      setUserProfile(profile);
      setStep(3);

      toast({
        title: "Compte créé !",
        description: "Bienvenue dans la communauté Spordate.",
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
  };

  // Partager le lien de parrainage
  const shareReferralLink = async () => {
    if (!userProfile) return;

    const shareUrl = `https://spordateur.com?ref=${userProfile.referralCode}`;
    const shareText = `Rejoins-moi sur Spordate pour trouver des partenaires de sport ! 🏃‍♂️🎾`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Spordate - Trouve ton partenaire de sport",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Partage annulé");
      }
    } else {
      // Fallback: copier le lien
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans le presse-papier.",
      });
    }
  };

  // Copier le lien
  const copyReferralLink = async () => {
    if (!userProfile) return;
    const shareUrl = `https://spordateur.com?ref=${userProfile.referralCode}`;
    await navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Lien copié !",
      description: "Le lien a été copié dans le presse-papier.",
    });
  };

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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === s
                    ? "bg-primary text-primary-foreground"
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

          {/* Badge parrainage */}
          {referredBy && step === 1 && (
            <div className="mt-2 px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full inline-block">
              Invité par {referredBy}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* STEP 1: Email & Password */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="email-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="password-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  data-testid="confirm-password-input"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white"
                data-testid="step1-submit"
              >
                Continuer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {/* STEP 2: Sports & Niveau */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              {/* Sports selection */}
              <div className="space-y-3">
                <Label>Sélectionne tes sports</Label>
                <div className="grid grid-cols-2 gap-3">
                  {SPORTS.map((sport) => (
                    <div
                      key={sport.id}
                      onClick={() => toggleSport(sport.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        selectedSports.includes(sport.id)
                          ? "border-primary bg-primary/10"
                          : "border-border/20 hover:border-border/50"
                      }`}
                      data-testid={`sport-${sport.id}`}
                    >
                      <span className="text-2xl block mb-1">{sport.emoji}</span>
                      <span className="text-sm font-medium">{sport.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Level selection */}
              <div className="space-y-3">
                <Label>Ton niveau</Label>
                <div className="grid grid-cols-2 gap-2">
                  {LEVELS.map((level) => (
                    <div
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center text-sm ${
                        selectedLevel === level.id
                          ? "border-primary bg-primary/10"
                          : "border-border/20 hover:border-border/50"
                      }`}
                      data-testid={`level-${level.id}`}
                    >
                      {level.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  data-testid="step2-back"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white"
                  disabled={loading}
                  data-testid="step2-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      Créer mon compte <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Growth - Partage */}
          {step === 3 && userProfile && (
            <div className="space-y-6 text-center">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="text-green-400 font-medium">
                  Ton compte est créé ! 🎉
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ton code de parrainage :
                </p>
                <div className="p-3 bg-muted rounded-lg font-mono text-lg font-bold">
                  {userProfile.referralCode}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Partage ce lien avec tes amis :
                </p>
                <div className="p-3 bg-muted rounded-lg text-xs break-all">
                  https://spordateur.com?ref={userProfile.referralCode}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  className="flex-1"
                  data-testid="copy-link"
                >
                  <Copy className="mr-2 h-4 w-4" /> Copier
                </Button>
                <Button
                  onClick={shareReferralLink}
                  className="flex-1 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white"
                  data-testid="share-link"
                >
                  <Share2 className="mr-2 h-4 w-4" /> Partager
                </Button>
              </div>

              <Button
                onClick={() => router.push("/profile")}
                variant="ghost"
                className="w-full mt-4"
                data-testid="go-to-profile"
              >
                Accéder à mon profil →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
