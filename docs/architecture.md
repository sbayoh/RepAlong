# RepAlong — Foundation Architecture

Status: Phase 1A — Authentication + Firestore foundation. Email/Password auth, plus
password reset added in Phase 1B (§9a) (Google Sign-In, Apple Sign-In, and mandatory
email verification remain later, separately reviewed phases).

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

## 8. What had intentionally NOT been implemented as of Phase 0B

Login/signup, Firestore schema and security rules, user/host profiles, location
matching, maps, gym data, Shadow Sessions, bookings, Stripe, messaging, push
notifications, identity verification, Firebase Storage, Cloud Functions, Firebase
Hosting, App Check, production analytics events. Phase 1A (below) adds
Email/Password auth and the first Firestore user document; everything else in this
list remains a later, separately reviewed phase.

## 9. Phase 1A — Authentication

Auth client code lives in `src/services/firebase/`, alongside the existing Firebase
app init:

- `authInstance.ts` / `authInstance.web.ts` — a single `Auth` instance, split by
  Metro's platform-file convention (see `use-color-scheme.web.ts` for the existing
  precedent). Native and web need different persistence setup (next section), so this
  split lives at the instance level rather than branching on `Platform.OS` inside one
  file.
- `auth.ts` — the only place that calls Firebase Auth SDK functions
  (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`,
  `onAuthStateChanged`). Screens never import `firebase/auth` directly.
- `authErrors.ts` — maps Firebase Auth error codes to plain-language messages. Raw
  Firebase error objects/codes are never shown to the user; unmapped codes fall back
  to a generic message and log the code in dev only.

### 9a. Password reset (Phase 1B)

`sendPasswordReset(email)` in `auth.ts` wraps Firebase's `sendPasswordResetEmail` — the
only new Auth SDK call added. `AuthContext.resetPassword(email)` is the screen-facing
entry point (`src/app/(auth)/forgot-password.tsx`).

**Privacy-safe by design:** Firebase throws `auth/user-not-found` when no account
matches the given email. `resetPassword` catches that one code specifically via
`isAccountNotFoundError` (`authErrors.ts`) and resolves normally instead of
re-throwing — every other error still maps through `getAuthErrorMessage` and surfaces
to the user as usual. The screen therefore always renders the same "check your email"
success state regardless of whether the account exists, so the UI never confirms or
denies account existence for a given email address.

### Auth persistence

Firebase owns all credential/session storage — the app never reads or writes tokens
itself. But the Firebase JS SDK needs different persistence configuration per platform,
which is why `authInstance.ts` and `authInstance.web.ts` are split rather than shared:

- **Native (iOS/Android):** `firebase/auth`'s package.json `exports` map only resolves
  `getReactNativePersistence` under Metro's `"react-native"` condition. Calling
  `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })` is
  required — without it, Auth state does not survive an app restart on native (it
  silently falls back to in-memory-only). This is why
  `@react-native-async-storage/async-storage` was added as a dependency: it's the
  storage engine Firebase's React Native persistence layer writes to, not something the
  app touches directly.
- **Web:** `getAuth(app)` already defaults to `indexedDBLocalPersistence` (falling back
  to `browserLocalPersistence`), which persists across reloads with no extra
  configuration.

Source: [Expo's Firebase JS SDK Auth setup guide](https://expo.fyi/firebase-js-auth-setup),
cross-checked against the installed `firebase@12.17.1` package's `exports` map.

**Resilience to Fast Refresh:** `initializeAuth` may only be called once per
`FirebaseApp` instance — a second call throws `auth/already-initialized`. In dev, Metro
Fast Refresh can re-execute this module without tearing down the native/JS bridge,
which does hit that path. `authInstance.ts` wraps the call in a try/catch that falls
back to `getAuth(firebaseApp)` (retrieving the already-configured instance) on that
specific error code, so Fast Refresh never crashes the app. A real cold start always
succeeds on the first `initializeAuth` call, so this only ever engages in dev.

**Verified on-device (iOS Simulator, Expo Go):** the full flow — create account, sign
out, sign in, force-quit via `simctl terminate`, relaunch — was tested directly on an
iPhone 17 Simulator, not just assumed from the web behavior. Persistence across a true
process relaunch (not just a JS reload) was confirmed working. One real environmental
gotcha surfaced during that testing, worth recording: on a **brand-new** Expo Go
"experience" data directory, the very first `AsyncStorage` write (any key, not
Firebase-specific — confirmed by testing a plain round-trip write independent of
Firebase entirely) can fail with `NSCocoaErrorDomain Code=512 ... "Not a directory"`,
because Expo Go's own per-experience sandbox folder
(`ExponentExperienceData/@anonymous/<experience>/`) and `AsyncStorage`'s native module
race to create overlapping parts of that same directory tree on first use. It resolves
itself on the very next write/read in the same session (confirmed by retry — no code
change needed), or immediately if that experience's `ExponentExperienceData` directory
is deleted and recreated fresh. This is specific to Expo Go's multi-experience sandbox
mechanism — it has no equivalent in a standalone/EAS build, where the app owns its
Documents directory outright with no such intermediary namespacing — so it isn't
expected to affect a production build, only first-run Expo Go dev testing.

### Route protection

`src/app/_layout.tsx` wraps the app in `AuthProvider`
(`src/features/auth/AuthContext.tsx`) and uses Expo Router's `Stack.Protected` guard
API (current SDK 57 recommended pattern — see
[Expo Router authentication guide](https://docs.expo.dev/router/advanced/authentication/))
to mount exactly one of two route groups based on session state:

- `src/app/(auth)/` — `index.tsx` (Welcome), `sign-up.tsx`, `sign-in.tsx`,
  `forgot-password.tsx`. Mounted when `firebaseUser` is null.
- `src/app/(app)/` — `index.tsx` (signed-in foundation screen). Mounted when
  `firebaseUser` is present.

Because the guard conditions (`!!firebaseUser` / `!firebaseUser`) are strict opposites
of the same state, exactly one group is ever mounted — there's no window where both or
neither route tree is active, which is what avoids redirect loops.

The native splash screen (`SplashScreen.preventAutoHideAsync()` in `_layout.tsx`) stays
up until `AuthProvider`'s `isAuthLoading` flips to `false` (the first
`onAuthStateChanged` callback), so the very first frame the user sees already has the
correct route tree mounted — no flash of the wrong screen. `isAuthLoading` intentionally
tracks only Auth hydration, not the Firestore profile fetch, so a slow Firestore read
never blocks the splash screen or auth routing.

## 10. Phase 1A — Firestore user document

- `firestoreInstance.ts` — the shared `Firestore` client, targeting the project's
  `(default)` database (`nam7`).
- `firestore.ts` — typed helpers, the only place that calls Firestore SDK functions
  for the user document:
  - `ensureUserProfile(user, seed?)` — idempotent, transaction-based create-if-missing
    at `users/{uid}`. Runs inside `runTransaction` specifically so two concurrent
    callers for a brand-new uid (e.g. the sign-up screen and a future social-login
    flow) can never race into duplicate/overwriting writes — the loser of the race
    just reads back what the winner created.
  - `fetchUserProfile(uid)` — plain read, used by `AuthContext` to populate `profile`
    on every sign-in.
  - `updateUserProfile(uid, fields)` — restricted at the type level
    (`UpdatableUserProfileFields`) to `firstName` / `lastName` / `displayName` /
    `onboardingCompleted`; `uid`, `email`, `createdAt`, `accountStatus` are not
    reachable through this helper at all.
- `src/types/user.ts` — `UserProfile` (read shape, `Timestamp` fields) and
  `UserProfileWrite` (write shape, `FieldValue` sentinels from `serverTimestamp()`).

### Partial-failure handling (Auth succeeds, Firestore fails)

Registration is two separate writes — a Firebase Auth user, then a Firestore document —
and `AuthContext.signUp` treats them as such:

1. `signUpWithEmail` creates the Auth user. If this throws, sign-up fails outright (no
   Firestore call is attempted).
2. `ensureUserProfile(user, { firstName, lastName })` then creates the Firestore
   document. If this throws, `signUp` throws a distinguishable `ProfileSetupError` —
   the sign-up screen catches this specifically and still navigates the user into the
   app (they ARE authenticated; telling them registration failed would be false) rather
   than the generic form error path.
3. The signed-in screen (`src/app/(app)/index.tsx`) detects `profile === null` after
   loading and shows a "Retry profile setup" button, calling `ensureUserProfile` again
   with no seed. Because `ensureUserProfile` is transactional and idempotent, retrying
   never creates a duplicate document — it either creates the missing one or returns
   the existing one untouched.

## 11. Firestore security rules (`firestore.rules`)

Default-deny everywhere except `users/{uid}`, where the owner may read/create/update
their own document (never another user's, never unauthenticated). Delete is fully
denied — no client-side account deletion in this phase.

Field-level protection, enforced in the `isValidNewUserDoc` / `isValidUserUpdate`
rule functions:

- **On create:** `uid` must equal the authenticated caller's own uid; `accountStatus`
  must be exactly `'active'` (a client can't self-create as e.g. `'suspended'`); both
  `createdAt` and `updatedAt` must equal `request.time` (rejects backdating); the
  document's keys must exactly match the expected field set (rejects smuggling extra
  fields in at creation).
- **On update:** `uid`, `email`, `createdAt`, and `accountStatus` must be byte-for-byte
  unchanged from the existing document — the spec's minimum bar (`uid`/`createdAt`/
  `accountStatus`) plus `email`, which was added because it's tied to the Auth
  identity and letting it drift from the real Auth email would be misleading.
  `updatedAt` must equal `request.time`. Only `firstName`/`lastName`/`displayName`/
  `onboardingCompleted` can actually change, and the key set is re-validated.

**Tradeoff:** `accountStatus` has no client-writable path to change after creation at
all in this phase — there's no Cloud Function or trusted backend yet (out of scope for
Phase 1A) to own transitions like `active` → `suspended`. This is intentional: the
safer default is "immutable until a trusted server path exists" rather than opening any
client-writable path to a security-sensitive field, even a narrow one.

**Status: rules are written and validated locally, but NOT deployed.** Deploying
requires `firebase login` (interactive; not run — see the completion report for the
exact command) and explicit approval per AGENTS.md. Until deployed, the Firebase
Console's existing production-mode rules apply, which are expected to reject client
writes — this is expected, not a bug, and is why Phase 1A testing should go through the
`firebase emulators:start` toggle instead (below) rather than weakening cloud rules.

## 12. Emulator Suite (local development toggle)

`firebase.json` configures Auth (port 9099) and Firestore (port 8080) emulators plus
the Emulator UI (port 4000), and `.firebaserc` pins the CLI to the one valid project,
`repalong-49bc9` — no other project should ever be selected.

The app defaults to production Firebase. To opt into the emulator, set
`EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env`; `emulatorConfig.ts` gates
`connectAuthEmulator` / `connectFirestoreEmulator` calls in `authInstance*.ts` /
`firestoreInstance.ts` behind `__DEV__ && EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true'`,
so it can never accidentally activate in a release build. Android's emulator needs
`10.0.2.2` instead of `127.0.0.1` to reach the host machine (a well-known Android
emulator networking quirk); `FIREBASE_EMULATOR_HOST` branches on `Platform.OS` for
this. Physical devices aren't supported by this toggle (would need the host's LAN IP).

To run it locally: `npx firebase emulators:start` (requires no login for pure local
emulation, since `.firebaserc` already pins the project ID).

### Java requirement (Firestore emulator only)

The Firestore emulator (unlike the Auth emulator, which is pure Node) is a JVM
program bundled by `firebase-tools` and requires **Java 21+**. firebase-tools spawns
the `java` binary by bare name (`child_process.spawn('java', ...)` — see
`node_modules/firebase-tools/lib/emulator/downloadableEmulators.js`), so whatever
`java` resolves to first on `PATH` is what runs it; it does not consult `JAVA_HOME`.

This machine's only registered system JVM was Java 8 (`/usr/libexec/java_home -V`),
which is too old and throws `UnsupportedClassVersionError`. Fixed by installing
`openjdk@21` via Homebrew (`brew install openjdk@21`) — this is a *keg-only* formula,
meaning Homebrew deliberately does not symlink it into `/opt/homebrew/bin` or the
system JVM registry (`/Library/Java/JavaVirtualMachines/`), so **Java 8 remains the
untouched system default**. (Homebrew's own install output suggests a
`sudo ln -sfn ... /Library/Java/JavaVirtualMachines/openjdk-21.jdk` step to register
it system-wide; that was deliberately skipped — it needs `sudo`, and isn't necessary
for this use case.)

To make `java` resolve to 21 for a single command/session, without touching the
system default, prepend its bin directory to `PATH`:

```sh
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
npx firebase emulators:start --only auth,firestore
```

This is intentionally session-scoped (not written into `~/.zshrc`) so it never
affects other tools on this machine that expect `java` to mean Java 8.

## 13. Private vs. public profile data (future-facing decision)

`users/{uid}` is explicitly PRIVATE account data — this phase deliberately keeps it
free of anything that would later need to be publicly discoverable (location, fitness
stats, Host pricing, verification documents, etc. are all excluded from the schema on
purpose, not just deferred). A later phase will introduce a separate public
profile/discovery document. The reason to decide this now rather than retrofit it
later: `users/{uid}` will eventually hold genuinely sensitive fields (identity/
verification status, precise location, bookings, safety information), and public
discovery must never be implemented as "read the private user document" — it needs its
own collection with its own, much more permissive rules. Baking that separation into
the architecture from the first document avoids a painful migration once discovery
exists.

## 14. What is intentionally NOT implemented in Phase 1A

Google Sign-In, Apple Sign-In, mandatory email verification (the service layer exposes
`isCurrentUserEmailVerified()` for a later phase to use, but no verification flow
exists yet), Cloud Functions, deployed security rules, location, gyms, Host profiles,
Shadow Sessions, Stripe. All later, separately reviewed phases. (Password reset was
added in Phase 1B — see §9a.)
