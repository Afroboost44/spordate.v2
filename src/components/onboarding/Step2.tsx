"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  Dumbbell,
  Footprints,
  Trophy,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Step2Props } from "./types";
import { SPORTS, LEVELS } from "./types";

// Mapping des icônes pour les sports
const SportIcons: Record<string, React.ReactNode> = {
  tennis: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-1.5 3-1.5 6 0 9s1.5 6 0 9" />
      <path d="M3 12c3-1.5 6-1.5 9 0s6 1.5 9 0" />
    </svg>
  ),
  padel: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="8" rx="5" ry="6" />
      <line x1="12" y1="14" x2="12" y2="22" />
      <circle cx="7" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="17" cy="6" r="1" fill="currentColor" />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
    </svg>
  ),
  running: <Footprints className="h-8 w-8" />,
  fitness: <Dumbbell className="h-8 w-8" />,
};

// Icônes pour les niveaux
const LevelIcons: Record<string, React.ReactNode> = {
  debutant: <Target className="h-4 w-4" />,
  intermediaire: <Trophy className="h-4 w-4" />,
  confirme: <Trophy className="h-4 w-4" />,
  expert: <Trophy className="h-4 w-4" />,
};

export function Step2({ data, onDataChange, onBack, onSubmit, loading }: Step2Props) {
  const { toast } = useToast();

  const toggleSport = (sportId: string) => {
    const newSports = data.selectedSports.includes(sportId)
      ? data.selectedSports.filter((s) => s !== sportId)
      : [...data.selectedSports, sportId];
    onDataChange({ selectedSports: newSports });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data.selectedSports.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins un sport.",
      });
      return;
    }

    if (!data.selectedLevel) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner votre niveau.",
      });
      return;
    }

    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sports selection */}
      <div className="space-y-3">
        <Label className="text-base">Sélectionne tes sports</Label>
        <div className="grid grid-cols-2 gap-3">
          {SPORTS.map((sport) => (
            <div
              key={sport.id}
              onClick={() => toggleSport(sport.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center group hover:scale-[1.02] ${
                data.selectedSports.includes(sport.id)
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border/20 hover:border-border/50 bg-background/30"
              }`}
              data-testid={`sport-${sport.id}`}
            >
              <div className={`mx-auto mb-2 transition-colors ${
                data.selectedSports.includes(sport.id) 
                  ? "text-primary" 
                  : "text-muted-foreground group-hover:text-foreground"
              }`}>
                {SportIcons[sport.id]}
              </div>
              <span className="text-sm font-medium">{sport.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Level selection */}
      <div className="space-y-3">
        <Label className="text-base">Ton niveau</Label>
        <div className="grid grid-cols-2 gap-2">
          {LEVELS.map((level) => (
            <div
              key={level.id}
              onClick={() => onDataChange({ selectedLevel: level.id })}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center hover:scale-[1.02] ${
                data.selectedLevel === level.id
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border/20 hover:border-border/50 bg-background/30"
              }`}
              data-testid={`level-${level.id}`}
            >
              <span className="text-sm font-medium block">{level.label}</span>
              <span className="text-xs text-muted-foreground">{level.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          data-testid="step2-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-semibold"
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
  );
}
