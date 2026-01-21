"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  Dumbbell, 
  ArrowLeft,
  Zap,
  Music,
  Footprints,
  ToggleLeft,
  ToggleRight,
  Lock,
  Unlock,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSports, saveSports, addSport, deleteSport, toggleSportActive, DEFAULT_SPORTS, type Sport } from "@/lib/sports";
import { isFirebaseConfigured } from "@/lib/firebase";
import Link from "next/link";

// Code secret admin
const ADMIN_SECRET_CODE = "AFRO2026";
const ADMIN_STORAGE_KEY = "spordate_admin_unlocked";

// Available icons
const AVAILABLE_ICONS = [
  { name: "Dumbbell", label: "Fitness" },
  { name: "Footprints", label: "Running" },
  { name: "Music", label: "Danse" },
  { name: "Zap", label: "Energie" },
  { name: "Tennis", label: "Tennis" },
  { name: "Paddle", label: "Padel" },
];

export default function AdminSportsPage() {
  const { toast } = useToast();
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSport, setNewSport] = useState({ label: "", icon: "Dumbbell" });
  
  // Admin access control
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  // Check if already unlocked on mount
  useEffect(() => {
    const unlocked = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (unlocked === "true") {
      setIsUnlocked(true);
    }
  }, []);

  // Load sports on mount
  useEffect(() => {
    const load = async () => {
      try {
        const loadedSports = await getSports();
        setSports(loadedSports);
      } catch (e) {
        setSports(DEFAULT_SPORTS);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Verify secret code
  const handleUnlock = () => {
    if (secretCode === ADMIN_SECRET_CODE) {
      setIsUnlocked(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
      toast({
        title: "Accès débloqué ! 🔓",
        description: "Vous pouvez maintenant gérer les sports.",
      });
      setSecretCode("");
      setShowCodeInput(false);
    } else {
      toast({
        variant: "destructive",
        title: "Code incorrect",
        description: "Le code secret est invalide.",
      });
    }
  };

  // Lock admin
  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    toast({
      title: "Accès verrouillé 🔒",
      description: "L'administration est maintenant protégée.",
    });
  };

  // Add new sport
  const handleAddSport = async () => {
    if (!isUnlocked) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Entrez le code secret pour modifier les sports.",
      });
      setShowCodeInput(true);
      return;
    }

    if (!newSport.label.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom du sport est requis.",
      });
      return;
    }

    try {
      const sport = await addSport({
        label: newSport.label.trim(),
        icon: newSport.icon,
        active: true,
      });
      setSports(prev => [...prev, sport]);
      setNewSport({ label: "", icon: "Dumbbell" });
      toast({
        title: "Sport ajouté ! ✅",
        description: `${sport.label} a été ajouté avec succès.`,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le sport.",
      });
    }
  };

  // Delete sport
  const handleDeleteSport = async (sportId: string) => {
    if (!isUnlocked) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Entrez le code secret pour modifier les sports.",
      });
      setShowCodeInput(true);
      return;
    }

    try {
      await deleteSport(sportId);
      setSports(prev => prev.filter(s => s.id !== sportId));
      toast({
        title: "Sport supprimé",
        description: "Le sport a été supprimé.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le sport.",
      });
    }
  };

  // Toggle sport active
  const handleToggleActive = async (sportId: string) => {
    if (!isUnlocked) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Entrez le code secret pour modifier les sports.",
      });
      setShowCodeInput(true);
      return;
    }

    try {
      await toggleSportActive(sportId);
      setSports(prev => prev.map(s => 
        s.id === sportId ? { ...s, active: !s.active } : s
      ));
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le sport.",
      });
    }
  };

  // Reset to defaults
  const handleResetDefaults = async () => {
    if (!isUnlocked) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Entrez le code secret pour réinitialiser.",
      });
      setShowCodeInput(true);
      return;
    }

    try {
      await saveSports(DEFAULT_SPORTS);
      setSports(DEFAULT_SPORTS);
      toast({
        title: "Réinitialisé ✅",
        description: "Les sports par défaut ont été restaurés.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réinitialiser.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Dumbbell className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Admin - Sports
              </h1>
              <p className="text-xs text-muted-foreground">
                {isFirebaseConfigured ? "Firestore connecté" : "Mode localStorage"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <Button variant="outline" size="sm" onClick={handleLock}>
                <Unlock className="h-4 w-4 mr-1 text-green-500" />
                Verrouiller
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowCodeInput(!showCodeInput)}>
                <Lock className="h-4 w-4 mr-1 text-red-500" />
                Déverrouiller
              </Button>
            )}
          </div>
        </div>

        {/* Code Secret Input */}
        {showCodeInput && !isUnlocked && (
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Code secret admin..."
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  className="flex-1"
                />
                <Button onClick={handleUnlock}>
                  Valider
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Badge */}
        <div className={`text-center py-2 px-4 rounded-lg text-sm ${
          isUnlocked 
            ? "bg-green-500/10 text-green-400 border border-green-500/30" 
            : "bg-red-500/10 text-red-400 border border-red-500/30"
        }`}>
          {isUnlocked ? "🔓 Mode édition activé" : "🔒 Mode lecture seule"}
        </div>

        {/* Add Sport Form */}
        <Card className={`bg-card/80 border-border/30 ${!isUnlocked && "opacity-60"}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un sport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Nom du sport</Label>
                <Input
                  placeholder="ex: Yoga"
                  value={newSport.label}
                  onChange={(e) => setNewSport(prev => ({ ...prev, label: e.target.value }))}
                  className="h-9"
                  disabled={!isUnlocked}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Icône</Label>
                <select
                  value={newSport.icon}
                  onChange={(e) => setNewSport(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm"
                  disabled={!isUnlocked}
                >
                  {AVAILABLE_ICONS.map(icon => (
                    <option key={icon.name} value={icon.name}>{icon.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button 
              onClick={handleAddSport}
              className="w-full h-9 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63]"
              disabled={!isUnlocked}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </CardContent>
        </Card>

        {/* Sports List */}
        <Card className="bg-card/80 border-border/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Sports ({sports.length})</CardTitle>
                <CardDescription className="text-xs">
                  Gérez les sports disponibles pour les utilisateurs
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetDefaults}
                disabled={!isUnlocked}
              >
                Réinitialiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sports.map((sport) => (
                <div
                  key={sport.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    sport.active 
                      ? "border-border/30 bg-background/50" 
                      : "border-border/10 bg-background/20 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${sport.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {sport.icon === "Zap" && <Zap className="h-4 w-4" />}
                      {sport.icon === "Music" && <Music className="h-4 w-4" />}
                      {sport.icon === "Footprints" && <Footprints className="h-4 w-4" />}
                      {sport.icon === "Dumbbell" && <Dumbbell className="h-4 w-4" />}
                      {(sport.icon === "Tennis" || sport.icon === "Paddle") && <Dumbbell className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{sport.label}</p>
                      <p className="text-xs text-muted-foreground">ID: {sport.id} | Icône: {sport.icon}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(sport.id)}
                      className="h-8 w-8"
                      disabled={!isUnlocked}
                    >
                      {sport.active ? (
                        <ToggleRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSport(sport.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={!isUnlocked}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
