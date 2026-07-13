# AI Blog Generator

A sophisticated AI-powered blog content generator built with **React + TypeScript + Firebase + OpenAI**.

## Features
- Google sign-in (Firebase Authentication)
- Generate:
  - SEO-friendly title options
  - Blog outlines
  - Full articles
- Tone control: professional, casual, persuasive
- Length control: short, medium, long
- Keyword integration
- SEO suggestions (title/meta length, keyword density, heading structure)
- Readability scoring (Flesch Reading Ease + grade level estimate)
- Firestore-backed generation history (per signed-in user)

## Tech stack
- Vite + React + TypeScript
- Tailwind CSS (black / gold / violet theme)
- Firebase Auth, Firestore, Cloud Functions, Hosting
- OpenAI Chat Completions API (called from a Cloud Function so the API key is never exposed to the browser)

## Project structure
```
ai-blog-generator/
  src/                # React app
  functions/          # Firebase Cloud Functions (OpenAI proxy)
  firebase.json        # Hosting + Functions + Firestore config
  firestore.rules       # Per-user access rules for history
  firestore.indexes.json
  .env.example          # Frontend Firebase web config template
```

## Local setup
1. Install dependencies:
   ```bash
   npm install
   npm --prefix functions install
   ```
2. Configure the frontend environment:
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase web app config values (from Firebase Console > Project Settings).
3. Point the Firebase CLI at your project:
   ```bash
   firebase use <your-firebase-project-id>
   ```
   (or edit `.firebaserc` directly)
4. Set the OpenAI key as a Functions secret (never commit it):
   ```bash
   firebase functions:secrets:set OPENAI_API_KEY
   ```
5. Enable Google as a sign-in provider in Firebase Console > Authentication > Sign-in method.
6. Run locally:
   ```bash
   npm run dev
   ```

## Deploy to Firebase
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy hosting, functions, and Firestore rules/indexes:
   ```bash
   firebase deploy
   ```

## Why the stack was kept intentionally simple
To keep the project shippable and maintainable, the following complexity was deliberately avoided:
- Multi-provider AI fallback logic (OpenAI only, single model)
- Custom auth system (Google sign-in via Firebase Auth only)
- Collaborative editing / draft branching and versioning
- Heavy rich-text editor integrations (markdown output is sufficient)
- Advanced analytics dashboards
- Redux or other heavy state management (React Context + hooks is enough)

These would add engineering overhead without meaningfully improving the core generator experience.
