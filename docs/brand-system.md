# RepAlong — Brand System

Status: Phase 1B.3 — the RA mark shown on the approved brand board is now implemented
as production artwork (§7), replacing the interlocking-stroke placeholder from earlier
in Phase 1B. Built on top of the Phase 1A auth/Firestore foundation
(`docs/architecture.md`); no backend, Firestore rules, or auth-contract changes.

## 1. Brand positioning

RepAlong is a fitness/wellness marketplace centered on training alongside experienced
gym-goers. The identity aims for: health, vitality, movement, confidence, fitness,
wellness, community, human connection, accessibility, premium quality — fresh, healthy,
energetic, modern, social, polished, welcoming.

Deliberately avoided: gym-bro clichés, black/red bodybuilding aesthetics, supplement
branding, dumbbell iconography, medical/clinical looks, generic SaaS blue, neon,
childish palettes.

## 2. Naming

- **RepAlong** is the primary, consumer-facing product name and wordmark — used on
  every screen.
- **Corporate attribution** is a two-line lockup, not an inline suffix:
  ```
  RepAlong
  By TechDen Technologies LLC
  ```
  It appears only in selective, low-frequency contexts: splash/loading branding,
  about/legal screens, marketing/footer areas — never as clutter on every screen. This
  is `RepAlongMark`'s `variant="corporate"` (§7) — the one place this pairing lives;
  don't hand-type the attribution line elsewhere.

## 3. Color system

All tokens live in `src/constants/theme.ts` (`Colors.light` / `Colors.dark`). Components
must reach for a semantic token (`theme.brandPrimary`, `themeColor="textSecondary"`,
etc.) — never a raw hex value.

### Light

| Token | Hex | Role |
|---|---|---|
| `background` | `#FBFAF6` | Warm off-white page background |
| `backgroundElevated` | `#FFFFFF` | Cards, inputs, sheets — sits above `background` |
| `surface` | `#F1F3EF` | Neutral panel fill (chips, icon buttons, empty states) |
| `surfaceSecondary` | `#E7EAE4` | One step deeper than `surface` |
| `textPrimary` | `#1F2A24` | Headlines, body copy |
| `textSecondary` | `#55625C` | Supporting copy |
| `textMuted` | `#647169` | Captions/meta only — not for body copy (see note below) |
| `textInverse` | `#FFFFFF` | Text on top of `brandPrimary`-filled surfaces |
| `brandPrimary` | `#0B8050` | Vitality green — primary CTA fill, brand mark |
| `brandPrimaryPressed` | `#086A42` | Pressed/active state of `brandPrimary` |
| `brandPrimarySoft` | `#E4F5EC` | Tinted background for green badges/chips |
| `brandSecondary` | `#0C7A88` | Teal/aqua — secondary accents, avatar fills |
| `brandSecondarySoft` | `#E1F4F6` | Tinted background for teal usage |
| `accent` | `#D9622E` | Warm coral/sunrise — decorative only, see note below |
| `accentSoft` | `#FDEAE3` | Tinted background for coral usage |
| `border` | `#DDE2DC` | Default hairline borders |
| `borderStrong` | `#B9C2BB` | Emphasized borders (secondary button outline) |
| `success` / `successSoft` | `#0B8050` / `#E4F5EC` | Reuses `brandPrimary` — green already reads as "healthy/good" in this brand |
| `warning` / `warningSoft` | `#B54708` / `#FDF3E7` | |
| `danger` / `dangerSoft` | `#C1401F` / `#FDF1EC` | |
| `info` / `infoSoft` | `#1B63C4` / `#EEF4FD` | |

### Dark

Dark mode is a deep warm slate, not pure black — brand colors shift brighter to stay
vivid and keep contrast against the dark background.

| Token | Hex | Role |
|---|---|---|
| `background` | `#121815` | |
| `backgroundElevated` | `#1B221E` | |
| `surface` | `#212A25` | |
| `surfaceSecondary` | `#2A342E` | |
| `textPrimary` | `#F3F5F1` | |
| `textSecondary` | `#C4CCC5` | |
| `textMuted` | `#8FA095` | |
| `textInverse` | `#121815` | Dark text on bright `brandPrimary` fills |
| `brandPrimary` | `#22C081` | |
| `brandPrimaryPressed` | `#1AA06B` | |
| `brandPrimarySoft` | `#163828` | |
| `brandSecondary` | `#2DD4E0` | |
| `brandSecondarySoft` | `#123338` | |
| `accent` | `#FF8A5B` | |
| `accentSoft` | `#3A2419` | |
| `border` | `#34403A` | |
| `borderStrong` | `#46554D` | |
| `success` / `successSoft` | `#22C081` / `#163828` | |
| `warning` / `warningSoft` | `#F0A020` / `#3A2A12` | |
| `danger` / `dangerSoft` | `#FF6B57` / `#3A1D17` | |
| `info` / `infoSoft` | `#5B9DFF` / `#16283F` | |

### Contrast

Every pairing above that's used for real text/button-label content was checked against
WCAG 2.1 relative-luminance contrast (4.5:1 normal text, 3:1 large text/UI components),
not eyeballed — `brandPrimary`-on-`textInverse`, `textSecondary`/`textMuted`-on-
`background`, and each semantic color against both its `*Soft` background and the page
background, in both themes. All pass AA at their intended usage.

**`accent` is the one deliberate exception.** `#D9622E` (light) only reaches ≈3.5:1
against white — enough for large/bold text and icons/UI components (WCAG 1.4.11) but not
small body copy. Use `accent` for backgrounds, icon fills, decorative shapes, and large
headline text; never for small standalone body text. `textMuted` similarly sits at
≈4.9:1 against `background` — fine for captions/meta, not recommended for primary body
copy (use `textSecondary` there).

**Color is never the sole signal.** `BrandBadge` pairs every tone with a glyph
(✓ / ! / ✕ / i / •) in addition to color and label text.

### Brand-mark colors (fixed, not theme-dependent) — fixed artwork vs. functional UI

The RA mark (§7) and its raster exports (`assets/brand/`) use their own small fixed
palette — the approved board's colors verbatim, `BrandMark` in
`src/constants/theme.ts` — independent of `Colors.light`/`Colors.dark`. This is a
deliberate split, not an oversight:

- **`Colors.light` / `Colors.dark`** are the *functional* UI palette: every value is
  WCAG-checked for the specific role it plays (button fill, body text, border), and
  they invert/adjust between light and dark mode like any other UI chrome.
- **`BrandMark`** is *fixed logo artwork*: the RA mark's colors come from the approved
  brand board, not from an accessibility pass, and stay constant across the app rather
  than inverting — a logo has to stay recognizable as the same mark everywhere it
  appears. Components must never reach into `BrandMark` for anything except the RA mark
  itself (screens still use `Colors` tokens for every other surface, text, or control).

| Token | Hex | Role |
|---|---|---|
| `deepForest` | `#0F3D2E` | The R (light-surface variant); app-icon/badge background |
| `vitalityGreen` | `#1DB56A` | The A gradient — start stop |
| `aquaTeal` | `#22C1B1` | The A gradient — end stop |
| `warmCoral` | `#FF6B6B` | Reserved brand accent — not currently used in the mark itself |
| `warmOffWhite` | `#FAFAF6` | The R (dark-surface variant, and the page background off-white) |
| `slate` | `#2B2F33` | Reserved brand neutral — not currently used in the mark itself |

`warmOffWhite` R on `deepForest`: 12.9:1. `deepForest` R on `warmOffWhite`: 12.9:1. Both
comfortably pass AA. Because `deepForest` (`#0F3D2E`) and the app's dark-mode
`background` (`#121815`) are close in value, a `deepForest` R would nearly disappear
against the dark-mode page — `MarkSymbol` switches the R to `warmOffWhite` whenever
`useColorScheme()` reports `'dark'` (§8, §14) rather than relying on a fixed ring or
badge treatment.

## 4. Typography

`Typography` in `src/constants/theme.ts`, consumed via `<ThemedText type="...">`:

`display` (40/46, 700) · `headlineLarge` (32/38, 700) · `headline` (26/32, 700) ·
`title` (22/28, 600) · `bodyLarge` (18/26, 500) · `body` (16/24, 400) ·
`bodySmall` (14/20, 400) · `caption` (12/16, 500) · `button` (16/20, 600) ·
`label` (13/16, 600, +0.2 tracking).

Uses the platform system font (`Fonts.sans` — SF/Roboto/system-ui) rather than a custom
webfont package; the existing `--font-display` CSS variable stack (`src/global.css`)
supplies `Spline Sans`/`Inter` on web where available, falling back to system fonts
everywhere else. No new font dependency was added for this phase.

## 5. Spacing, shape, elevation

- `Spacing` (`half`…`six` = 2/4/8/16/24/32/64) — unchanged from Phase 1A, reused as-is.
- `Radii` — one radius per surface kind: `button`/`input` = 14, `card` = 20,
  `chip`/`avatar` = pill (999), `sheet` = 28. Don't invent a new radius per screen.
- `BorderWidths`, `IconSizes` (16/20/24/32), `ControlHeights` (36/48/56).
- `Shadows.sm` / `.md` / `.lg` — cross-platform elevation (`shadow*` for iOS/web,
  `elevation` for Android).
- `Motion.quick` / `.base` / `.slow` (120/200/320ms) — restrained durations for the
  handful of animated interactions (button press, screen entrance).

## 6. Components

All in `src/components/brand/`, each a thin, single-purpose primitive — this is not
meant to grow into a large library:

`BrandButton` (primary/secondary/ghost, loading, press-scale) · `BrandTextField`
(label + error/helper text, focus ring) · `BrandCard` · `BrandChip` (selectable) ·
`BrandBadge` (status, tone + glyph) · `BrandIconButton` (glyph-based, no icon-font
dependency) · `BrandAvatar` (initials fallback) · `BrandDivider` · `BrandScreen`
(safe-area + centered max-width column + optional scroll/keyboard-avoiding + entrance
fade) · `BrandSectionHeader` · `BrandEmptyState` · `BrandErrorState` (section/screen
failure + retry — distinct from `ErrorBanner`, which is the inline form-validation
banner in `src/features/auth/components/`) · `BrandLoadingState`.

`ThemedText` / `ThemedView` (`src/components/`) remain the low-level primitives Brand
components are built on — they carry the color/typography token wiring, not brand
opinion.

## 7. Logo / mark

**This is the approved RepAlong logo direction.** The mark, wordmark, lockups, and
color treatment below all reconstruct the brand board TechDen approved for RepAlong.
Two earlier placeholders are retired and no longer used anywhere in the app or its
assets:

- The original "R+A" text-in-a-rounded-square mark (Phase 1B start).
- The interlocking-stroke RA monogram (a thin-line placeholder used earlier in
  Phase 1B, drawn with `<Path>` `stroke`s and no fills).

### Construction

`RepAlongMark` (`src/components/brand/RepAlongMark.tsx`) renders the mark as **filled
geometric shapes** (not strokes) on a `0 0 230 190` viewBox:

- **R** — a broad flat top bar, a rounded bowl with a fully closed counter (drawn via
  `fillRule="evenodd"` with an inner hole subpath), and a strong diagonal leg kicking
  out from the bowl's base.
- **A** — a bold filled triangular "mountain" form: a sharp apex, a straight left edge,
  and a single outward kink partway down the right edge (a restrained flame/flag
  silhouette, not a literal notch cut-out).
- **The interlock** — the A sits behind the R in paint order, so the R's diagonal leg
  crosses in front of the A's body; a thin sliver of the A's gradient shows past the
  R's leg near the base, which is what reads as the two letters being *one connected
  mark* rather than two shapes placed side by side.

This is a **hand-reconstructed implementation**, built by eye from the approved brand
board — not a traced import of a professionally supplied master vector file. It is
still the approved design direction; if an agency-produced master SVG becomes
available later, only the path `d` data in `RepAlongMark.tsx` and `assets/brand/*.svg`
needs to change, since every asset in this system shares the same two path strings.

### Color

- R: `BrandMark.deepForest` on light surfaces, `BrandMark.warmOffWhite` on dark
  surfaces (switches on `useColorScheme()` — see §14).
- A: a fixed `BrandMark.vitalityGreen → BrandMark.aquaTeal` linear gradient
  (`react-native-svg`'s `<LinearGradient>`), constant in both themes.
- No circle. The primary mark is never placed in a roundel/badge shape — see the
  "simple monogram" exception below.

### Variants

`RepAlongMark` supports four lockups through one component and a `variant` prop — no
screen imports the mark's path data directly, all four call it through `RepAlongMark`:

- `variant="symbol"` — RA mark only
- `variant="wordmark"` — "REPALONG" wordmark only (uppercase, wide tracking)
- `variant="full"` (default) — mark + wordmark, horizontal
- `variant="corporate"` — mark, then "REPALONG", then "By TechDen Technologies LLC"
  caption, stacked vertically — for the selective contexts in §2

**Screens using the RA system:** Welcome (`variant="full"`, large), Sign In, Create
Account, and Forgot Password (all `variant="symbol"`, `size="md"` — bumped up from the
placeholder's `size="sm"` so the mark's bowl/counter/flag detail stays legible), and
Authenticated Foundation (`variant="symbol"`, `size="sm"`, toolbar context).

### Simple monogram (favicon only)

The approved board includes one circular-badge treatment ("simple monogram") reserved
for contexts where the flat mark loses contrast against arbitrary surrounding chrome —
in this app, that's the web favicon only (§13). It is **not** a `RepAlongMark` variant
and is never used for in-app symbol/full/corporate lockups; it lives solely as
`assets/brand/repalong-favicon.svg`.

### Source-of-truth assets

`assets/brand/` holds the one authoritative vector construction — every file's `d`
path data is copy-identical to `RepAlongMark.tsx`'s `MarkSymbol`, only fill/canvas
differs:

| File | Purpose |
|---|---|
| `repalong-mark.svg` | Symbol, light-surface colorway (Deep Forest R) |
| `repalong-mark-dark.svg` | Symbol, dark-surface colorway (Warm Off White R) |
| `repalong-lockup-light.svg` / `-dark.svg` | Flattened mark + wordmark, for static/marketing export (the in-app wordmark is always live system-font text, not this SVG's `<text>` node — see §6) |
| `repalong-favicon.svg` / `.png` | The circular simple-monogram badge (§13) |
| `repalong-app-icon.svg` / `.png` | iOS/general app icon — flat square, Deep Forest fill, off-white R (§11) |
| `repalong-app-icon-foreground.svg` / `.png` | Android adaptive-icon foreground layer, transparent, mark kept inside the OS's safe zone (§11) |
| `repalong-app-icon-monochrome.svg` / `.png` | Android 13+ themed-icon silhouette layer (§11) |
| `repalong-splash.svg` / `.png` | Splash mark, dark-surface colorway, transparent (§12) |

### App icon, splash & favicon

`app.json` points at the rasterized versions of the assets above (all generated from
the same source SVGs via `@resvg/resvg-js`, a dev-only dependency added for this phase
purely to export raster artwork — it isn't used at app runtime):

- **App icon** (`expo.icon`, `expo.ios.icon`) — `repalong-app-icon.png`, a flat
  1024×1024 Deep Forest square with the off-white-R mark centered with generous
  padding. iOS applies its own corner-rounding mask, so this stays an unrounded square
  per Apple's guidelines — no pre-rounded rect baked into the asset.
- **Android adaptive icon** (`android.adaptiveIcon`) — `foregroundImage` is
  `repalong-app-icon-foreground.png` (transparent, mark kept inside the OS's ~66%
  safe-zone diameter so no adaptive mask shape clips it), `backgroundColor` is set
  directly to `#0F3D2E` (Deep Forest) rather than a separate background image, and
  `monochromeImage` is `repalong-app-icon-monochrome.png` (a flat-white silhouette —
  Android 13+ themed icons tint this themselves, so only its alpha shape matters).
- **Splash** (`expo-splash-screen` plugin) — `image: repalong-splash.png` (the symbol
  mark, dark-surface colorway, transparent background) over `backgroundColor: #0F3D2E`.
  Restrained on purpose: mark only, no wordmark or tagline, no TechDen attribution.
- **Web favicon** (`web.favicon`) — `repalong-favicon.png`, the circular simple-monogram
  badge described above, the one place a circle around the mark is correct.

## 8. Light/dark behavior

Every screen reads colors through `useTheme()` (`src/hooks/use-theme.ts`), which
switches on the OS color scheme — there is no manual toggle in this phase. Dark mode is
a distinct warm-slate palette (§3), not an inverted/pure-black theme.

## 9. Accessibility

- All body-text/button-label color pairings verified against WCAG AA contrast (§3).
- Every interactive control (`BrandButton`, `BrandChip`, `BrandIconButton`,
  `BrandTextField`) sets `accessibilityRole`/`accessibilityState`/`accessibilityLabel`
  and keeps touch targets at `ControlHeights.md` (48) or larger, `BrandIconButton` via
  `hitSlop`.
- Status is never color-only (`BrandBadge` glyphs, §3).
- Entrance/press motion in `BrandScreen` and `BrandButton` checks
  `useReducedMotion()` (Reanimated) and skips the animation entirely when enabled —
  it doesn't just shorten it.
- Form errors (`ErrorBanner`, `BrandTextField`'s error helper text) and section-level
  failures (`BrandErrorState`) all set `accessibilityRole="alert"` so screen readers
  announce them.
- The RA mark (§7) is accessibility-aware per instance: when `RepAlongMark` renders the
  mark alone (`variant="symbol"`, no adjacent wordmark text), `MarkSymbol` sets
  `accessibilityRole="image"` and `accessibilityLabel="RepAlong"`. When the mark is
  paired with the live "REPALONG" wordmark (`variant="full"`/`"corporate"`), the symbol
  is marked decorative (`accessible={false}`, `accessibilityElementsHidden`,
  `importantForAccessibility="no-hide-descendants"`) since the adjacent text already
  identifies the brand — screen readers shouldn't announce "RepAlong" twice.

## 10. What NOT to do visually

No stock photography yet. No dumbbell/barbell iconography. No pure-black-and-red gym
aesthetic. No inventing a new radius, spacing value, or shadow outside
`src/constants/theme.ts` — extend the token file instead. No putting small body text in
raw `accent` color (§3). No adding a webfont/icon-font dependency without a concrete
product reason — the current system runs on system fonts and glyph/shape-based
iconography (`react-native-svg`, added earlier this phase, is for the brand mark
specifically, not general iconography). No circle around the primary RA mark — see the
simple-monogram exception in §7.

## 11. Forgot Password / reset flow

`/(auth)/forgot-password` uses the same system as every other auth screen: `BrandScreen`
+ `BrandSectionHeader` + `BrandTextField` + `BrandButton`, `RepAlongMark
variant="symbol"` in the header. Two states, no separate route for the second:

- **Form** — email field, local validation before any network call
  (`validateForgotPasswordForm`), inline `ErrorBanner` on failure.
- **Success** — `BrandEmptyState` ("Check your email" + the submitted address), with
  "Back to sign in" and a "Send again" that's disabled for a 30s cooldown
  (`RESEND_COOLDOWN_SECONDS`) after each send, as basic submission-spam protection.

Sign In links to it via a small `ThemedText` "Forgot password?" (not a `BrandButton` —
a full-width button would compete with the primary Sign In CTA), right-aligned under
the password field.

Firebase's `sendPasswordResetEmail` throws `auth/user-not-found` when no account
matches. `AuthContext.resetPassword` catches that specific code via
`isAccountNotFoundError` (`src/services/firebase/authErrors.ts`) and resolves
successfully instead of throwing — the UI always shows the same success state, so it
never reveals whether an email address has a RepAlong account.
