# Spordateur - Product Requirements Document

## Overview
Spordateur est une plateforme web de communauté sportive permettant aux utilisateurs de découvrir des partenaires d'entraînement et de réserver des séances dans des lieux partenaires.

## Current Status
✅ **Application prête pour les paiements Stripe**
⚠️ **Les clés Stripe fournies sont invalides** - Veuillez vérifier vos clés sur https://dashboard.stripe.com/test/apikeys

## Core Features

### 1. Onboarding Flow ✅
- Inscription multi-étapes (Email/Pass -> Sports/Niveau -> Referral)
- Code de parrainage unique (format SPORT-XXXX)
- Mode localStorage si Firebase non configuré

### 2. Discovery Page ✅
- Swipe-style profile cards
- Match system avec réservation de séance
- Section "Où pratiquer ?" avec partenaires

### 3. Payment & Booking System ✅
- **Intégration Stripe Checkout** complète
  - `POST /api/checkout` - Crée une session de paiement
  - `GET /api/checkout/status/[sessionId]` - Vérifie le statut
  - `POST /api/webhooks/stripe` - Webhook pour confirmation serveur
- **Option Duo** (J'invite mon partenaire) - 50€ pour 2 places
- **Pré-sélection du lieu** depuis la section partenaires
- Prix fixes côté serveur (Solo: 25€, Duo: 50€) - sécurisé
- **Loader anti-double clic** sur le bouton Payer

### 4. Email Notifications ✅
- **Service Resend** (`/lib/email.ts`) avec templates HTML professionnels
- **Email confirmation client** : "Ton ticket pour [LIEU] est prêt !" 
- **Email notification partenaire** : "Nouveau RDV sportif confirmé !"
- Templates responsive avec design violet/rose cohérent
- Fallback console.log si Resend non configuré

### 5. Success Modal Features ✅
- Confirmation visuelle avec badge Solo/Duo
- **Ajouter à mon calendrier:**
  - Google Calendar (lien direct)
  - Fichier .ics téléchargeable
- **Message WhatsApp dynamique:**
  - Solo: invitation à rejoindre
  - Duo: message cadeau avec place offerte

## Environment Variables

### Stripe (REQUIRED - Clés actuelles invalides)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... 
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Firebase (Optional - localStorage fallback disponible)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

### Email - Resend (Optional)
```
RESEND_API_KEY=re_...
SENDER_EMAIL=Spordateur <noreply@votredomaine.com>
```

## API Routes
- `POST /api/checkout` - Crée une session Stripe Checkout
- `GET /api/checkout/status/[sessionId]` - Vérifie le statut du paiement
- `POST /api/webhooks/stripe` - Reçoit les événements Stripe

## Latest Changes (Jan 22, 2026)
- ✅ Clés Stripe configurées dans .env.local
- ✅ Écran de blocage retiré (app fonctionne sans Firebase)
- ✅ Mode localStorage pour auth sans Firebase
- ⚠️ Clés Stripe invalides - à remplacer

## Files of Reference
- `/app/src/app/discovery/page.tsx` - Page Discovery
- `/app/src/app/api/checkout/route.ts` - API Stripe Checkout
- `/app/src/app/api/webhooks/stripe/route.ts` - Webhook Stripe
- `/app/src/lib/email.ts` - Service email Resend
- `/app/src/lib/firebase.ts` - Configuration Firebase
- `/app/.env.local` - Variables d'environnement

## Next Steps
- [ ] **URGENT** : Vérifier/remplacer les clés Stripe (invalides)
- [ ] Configurer webhook URL dans Stripe Dashboard
- [ ] Configurer Resend avec domaine vérifié
- [ ] Ajouter clés Firebase (optionnel)

## Credentials (Dev)
- **Admin Sports:** Code `AFRO2026`
- **Admin Dashboard:** Email `contact.artboost@gmail.com`
