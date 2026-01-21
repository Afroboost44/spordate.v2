import { db, isFirebaseConfigured } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

// Types
export interface Sport {
  id: string;
  label: string;
  icon: string; // Lucide icon name or 'custom'
  emoji?: string;
  active: boolean;
}

// LocalStorage key for sports
const SPORTS_STORAGE_KEY = 'spordate_sports';

// Default sports list with Danse and Afroboost
export const DEFAULT_SPORTS: Sport[] = [
  { id: 'tennis', label: 'Tennis', icon: 'Tennis', active: true },
  { id: 'padel', label: 'Padel', icon: 'Paddle', active: true },
  { id: 'running', label: 'Running', icon: 'Footprints', active: true },
  { id: 'fitness', label: 'Fitness', icon: 'Dumbbell', active: true },
  { id: 'danse', label: 'Danse', icon: 'Music', active: true },
  { id: 'afroboost', label: 'Afroboost', icon: 'Zap', active: true },
];

/**
 * Get all sports from Firestore or localStorage
 */
export async function getSports(): Promise<Sport[]> {
  // Try Firestore first if configured
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'sports'));
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Sport[];
      }
    } catch (error) {
      console.warn('[Sports] Firestore read failed:', error);
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(SPORTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[Sports] localStorage read failed:', e);
    }
  }

  // Return defaults
  return DEFAULT_SPORTS;
}

/**
 * Save sports to Firestore or localStorage
 */
export async function saveSports(sports: Sport[]): Promise<void> {
  // Save to Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      for (const sport of sports) {
        await setDoc(doc(db, 'sports', sport.id), {
          label: sport.label,
          icon: sport.icon,
          emoji: sport.emoji || null,
          active: sport.active,
        });
      }
      console.log('[Sports] Saved to Firestore');
    } catch (error) {
      console.warn('[Sports] Firestore save failed:', error);
    }
  }

  // Always save to localStorage as backup
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SPORTS_STORAGE_KEY, JSON.stringify(sports));
      console.log('[Sports] Saved to localStorage');
    } catch (e) {
      console.warn('[Sports] localStorage save failed:', e);
    }
  }
}

/**
 * Add a new sport
 */
export async function addSport(sport: Omit<Sport, 'id'>): Promise<Sport> {
  const newSport: Sport = {
    ...sport,
    id: sport.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
  };

  const currentSports = await getSports();
  const updatedSports = [...currentSports, newSport];
  await saveSports(updatedSports);

  return newSport;
}

/**
 * Delete a sport
 */
export async function deleteSport(sportId: string): Promise<void> {
  const currentSports = await getSports();
  const updatedSports = currentSports.filter(s => s.id !== sportId);
  await saveSports(updatedSports);

  // Also delete from Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'sports', sportId));
    } catch (error) {
      console.warn('[Sports] Firestore delete failed:', error);
    }
  }
}

/**
 * Toggle sport active status
 */
export async function toggleSportActive(sportId: string): Promise<void> {
  const currentSports = await getSports();
  const updatedSports = currentSports.map(s => 
    s.id === sportId ? { ...s, active: !s.active } : s
  );
  await saveSports(updatedSports);
}
