# RepAlong — Foundation Architecture

Status: Phase 0B — universal app foundation only. No product features implemented.

## 1. Universal Expo architecture

Single codebase built with Expo + Expo Router + TypeScript, targeting iOS, Android, and
web from the same `app/` route tree and `src/` source. Platform-specific files use the
standard `.web.tsx` suffix convention where behavior must diverge (see
`src/hooks/use-color-scheme.web.ts`); everything else is shared.

## 2. iOS / Android / web relationship

All three platforms render the same Expo Router routes and React components. Native
projects (`ios/`, `android/`) are not checked in — the app stays in the Expo managed
workflow and is git-ignored per `.gitignore`, generated on demand via
`npx expo prebuild` or an EAS Development Build when native modules are introduced.
Web builds to static output (`"output": "static"` in `app.json`).

## 3. Firebase project identity

- Firebase project: `repalong-49bc9`
- Registered apps already exist in the Firebase console: RepAlong Web, RepAlong iOS,
  RepAlong Android. This phase does not create or register any Firebase apps.

## 4. Firebase client configuration location

All Firebase client code is isolated under `src/services/firebase/`:

- `config.ts` — reads the web config from `EXPO_PUBLIC_FIREBASE_*` env vars and validates
  they're present.
- `app.ts` — initializes a single `firebaseApp` instance (`initializeApp`, reusing an
  existing instance via `getApps()`/`getApp()` if already initialized).
- `index.ts` — barrel export.

Only `firebase/app` (the modular JS SDK) is initialized. No Auth, Firestore, Storage, or
Functions clients are created yet — those are added in later phases as each feature needs
them, still inside `src/services/firebase/`.

**Why the Firebase JS SDK and not React Native Firebase:** the JS modular SDK works
without any native module or `prebuild` step, which keeps this foundation phase runnable
in Expo Go and avoids native complexity before there's a product reason for it. React
Native Firebase (which wraps the native iOS/Android SDKs and unlocks things like
Crashlytics, native Google Sign-In, or background push) requires a Development Build and
native config files. It should be introduced later, deliberately, when a specific feature
needs a native-only capability — not as part of this foundation.

**`GoogleService-Info.plist` / `google-services.json` are not required at this stage.**
The current foundation only uses the Firebase JS SDK against the Web app config (env
vars, above), which those files have nothing to do with — they configure the *native*
iOS/Android Firebase SDKs that React Native Firebase (or an Expo config plugin) would
read during a native build. They become relevant only if/when a later phase introduces
React Native Firebase or another native Firebase integration (e.g. Crashlytics, native
push, App Check) that requires a Development Build. Until then, there is nothing to
place or reference.

## 5. Environment-variable strategy

- `.env.example` — committed template listing every `EXPO_PUBLIC_FIREBASE_*` var, no
  values.
- `.env` — local-only, git-ignored, holds real values. Expo inlines `EXPO_PUBLIC_*` vars
  into the JS bundle at build time (this is how public Firebase web config reaches the
  client) — nothing prefixed `EXPO_PUBLIC_` should ever hold a true secret.
- `.gitignore` additionally blocks service-account JSON (`*serviceAccount*.json`,
  `firebase-adminsdk*.json`), signing/keystore files (`*.jks`, `*.keystore`, `*.p8`,
  `*.p12`, `*.mobileprovision`), and any `.env*` override.

## 6. Native bundle / package IDs

- iOS bundle identifier: `com.techden.repalong`
- Android package: `com.techden.repalong`

Set in `app.json` under `expo.ios.bundleIdentifier` and `expo.android.package`.

## 7. Current project structure

```
app.json                  Expo config (name, slug, bundle/package IDs, plugins)
src/app/                  Expo Router routes (currently: root layout + one screen)
src/components/           Shared UI primitives (ThemedView, ThemedText)
src/constants/            Theme tokens (colors, spacing, fonts)
src/hooks/                Shared hooks (color scheme / theme)
src/services/firebase/    Firebase client initialization (isolated service layer)
assets/                   App icons, splash image
docs/                     This document
.env.example              Env var template (committed)
.env                       Real local values (git-ignored)
```

`src/features/`, `src/types/`, and `src/utils/` are intentionally not created yet — they
have no content until product work begins, and empty scaffold directories aren't worth
the noise.

## 8. What has intentionally NOT been implemented yet

Login/signup, Firestore schema and security rules, user/host profiles, location
matching, maps, gym data, Shadow Sessions, bookings, Stripe, messaging, push
notifications, identity verification, Firebase Storage, Cloud Functions, Firebase
Hosting, App Check, production analytics events. All of these are later, separately
reviewed phases.
