# Spordateur - Product Requirements Document

## Overview
Spordateur est une plateforme web de communauté sportive permettant aux utilisateurs de découvrir des partenaires d'entraînement et de réserver des séances dans des lieux partenaires.

## 🎉 Current Status
✅ **PAIEMENTS STRIPE LIVE ACTIVÉS !**
- Clés LIVE configurées et validées
- Checkout Stripe fonctionne avec les vrais paiements
- Montants : Solo 25€ / Duo 50€

⚠️ **ATTENTION : Les paiements sont RÉELS** (clés `pk_live_`, `sk_live_`)

## Core Features

### 1. Onboarding Flow ✅
- Inscription multi-étapes (Email/Pass -> Sports/Niveau -> Referral)
- Code de parrainage unique (format SPORT-XXXX)
- Mode localStorage si Firebase non configuré

### 2. Discovery Page ✅
- Swipe-style profile cards
- Match system avec réservation de séance
- Section "Où pratiquer ?" avec partenaires

### 3. Payment & Booking System ✅ LIVE
- **Stripe Checkout LIVE** fonctionnel
  - `POST /api/checkout` - Crée une session de paiement
  - `GET /api/checkout/status/[sessionId]` - Vérifie le statut
  - `POST /api/webhooks/stripe` - Webhook pour confirmation
- **Solo : 25€** | **Duo : 50€**
- Redirection vers checkout.stripe.com
- Support : Carte, Apple Pay, Google Pay

### 4. Email Notifications ✅
- **Service Resend** avec templates HTML
- **Email client** : "Ton ticket pour [LIEU] est prêt !"
- **Email partenaire** : "Nouveau RDV sportif confirmé !"
- Fallback console.log si Resend non configuré

### 5. Success Modal Features ✅
- Confirmation avec badge Solo/Duo
- Boutons calendrier (Google Calendar + .ics)
- Partage WhatsApp dynamique

## Environment Variables (Configured)

### Stripe LIVE ✅
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51P7B76Rs7hrWkMqg...
STRIPE_SECRET_KEY=sk_live_51P7B76Rs7hrWkMqg...
STRIPE_WEBHOOK_SECRET=whsec_hKIuiGdcswiOGYvhIpLLb0re8EaH9Po1
```

### Firebase (Optional)
Non configuré - utilise localStorage fallback

### Resend (Optional)
Non configuré - logs console

## API Routes
- `POST /api/checkout` - Crée session Stripe
- `GET /api/checkout/status/[sessionId]` - Status paiement
- `POST /api/webhooks/stripe` - Webhook Stripe

## Latest Changes (Jan 22, 2026)
- ✅ Clés Stripe LIVE configurées et validées
- ✅ Checkout Stripe fonctionnel (50€ Duo testé)
- ✅ Redirection vers checkout.stripe.com confirmée
- ✅ Produit affiché : "Séance Duo Afroboost (2 places)"

## Next Steps
- [ ] Configurer webhook URL dans Stripe Dashboard
- [ ] Configurer Resend pour emails réels
- [ ] Ajouter Firebase (optionnel)
- [ ] Tests de paiement complets

## Credentials
- **Admin Sports:** Code `AFRO2026`
- **Admin Dashboard:** Email `contact.artboost@gmail.com`
