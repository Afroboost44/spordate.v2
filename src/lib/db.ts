import { db, isFirebaseConfigured } from './firebase';
import { doc, setDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';

// Types
export interface UserProfile {
  uid: string;
  email: string;
  sports: string[];
  level: string;
  referralCode: string;
  referredBy?: string;
  createdAt: Date;
}

/**
 * Generate a unique referral code in format SPORT-XXXX
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SPORT-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create a new user profile in Firestore
 */
export async function createUserProfile(
  uid: string,
  email: string,
  sports: string[],
  level: string,
  referredBy?: string
): Promise<UserProfile> {
  const referralCode = generateReferralCode();
  
  const userProfile: UserProfile = {
    uid,
    email,
    sports,
    level,
    referralCode,
    referredBy: referredBy || undefined,
    createdAt: new Date(),
  };

  // Save to Firestore only if configured
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'users', uid), {
      ...userProfile,
      createdAt: userProfile.createdAt.toISOString(),
    });
  } else {
    console.warn('Firebase not configured - profile stored locally only');
  }

  return userProfile;
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase not configured');
    return null;
  }
  
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    } as UserProfile;
  }
  return null;
}

/**
 * Find user by referral code
 */
export async function findUserByReferralCode(code: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase not configured');
    return null;
  }
  
  const q = query(collection(db, 'users'), where('referralCode', '==', code));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const data = querySnapshot.docs[0].data();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    } as UserProfile;
  }
  return null;
}
