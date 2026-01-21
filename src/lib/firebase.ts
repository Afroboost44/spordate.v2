import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId &&
  firebaseConfig.apiKey.length > 10 &&
  !firebaseConfig.apiKey.includes('your_')
);

// Check if Stripe is configured
export const isStripeConfigured = Boolean(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.length > 10
);

// Check if app is in production mode (requires all services)
export const isProductionMode = isFirebaseConfigured && isStripeConfigured;

// Get missing configuration for error display
export function getMissingConfig(): string[] {
  const missing: string[] = [];
  
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 10) {
    missing.push('NEXT_PUBLIC_FIREBASE_API_KEY');
  }
  if (!firebaseConfig.projectId) {
    missing.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  }
  if (!firebaseConfig.authDomain) {
    missing.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  }
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    missing.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  }
  
  return missing;
}

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  if (isFirebaseConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('[Firebase] Successfully initialized');
  } else {
    console.warn('[Firebase] Configuration manquante - veuillez configurer les variables d\'environnement');
  }
} catch (error) {
  console.error('[Firebase] Initialization failed:', error);
  app = null;
  auth = null;
  db = null;
}

export { auth, db };
export default app;
