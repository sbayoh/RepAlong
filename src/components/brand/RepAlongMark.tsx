import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { BrandMark, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type RepAlongMarkVariant = 'symbol' | 'wordmark' | 'full' | 'corporate';
export type RepAlongMarkSize = 'sm' | 'md' | 'lg';

export type RepAlongMarkProps = {
  variant?: RepAlongMarkVariant;
  size?: RepAlongMarkSize;
};

/** Source geometry is drawn on a 230×190 viewBox — see assets/brand/repalong-mark.svg. */
const MARK_ASPECT_RATIO = 230 / 190;

const SYMBOL_HEIGHT: Record<RepAlongMarkSize, number> = { sm: 32, md: 44, lg: 64 };
const WORDMARK_TYPE: Record<RepAlongMarkSize, 'title' | 'headline' | 'headlineLarge'> = {
  sm: 'title',
  md: 'headline',
  lg: 'headlineLarge',
};

/**
 * RepAlong's logo system — one component, four lockups. `MarkSymbol` renders the
 * approved RA mark (assets/brand/repalong-mark.svg is the same geometry, exported as a
 * flat asset for contexts outside React Native) — no screen imports the path data
 * directly, all four variants call it through `RepAlongMark`.
 */
export function RepAlongMark({ variant = 'full', size = 'md' }: RepAlongMarkProps) {
  if (variant === 'symbol') return <MarkSymbol size={size} decorative={false} />;
  if (variant === 'wordmark') return <Wordmark size={size} />;
  if (variant === 'corporate') return <CorporateLockup size={size} />;

  return (
    <View style={styles.row}>
      <MarkSymbol size={size} decorative />
      <Wordmark size={size} />
    </View>
  );
}

function Wordmark({ size }: { size: RepAlongMarkSize }) {
  return (
    <ThemedText type={WORDMARK_TYPE[size]} style={styles.wordmark}>
      REPALONG
    </ThemedText>
  );
}

/** Mark + wordmark + selective corporate attribution — splash, about/legal, footer contexts. */
function CorporateLockup({ size }: { size: RepAlongMarkSize }) {
  return (
    <View style={styles.corporateStack}>
      <MarkSymbol size={size} decorative />
      <Wordmark size={size} />
      <ThemedText type="caption" themeColor="textMuted" style={styles.corporateCaption}>
        By TechDen Technologies LLC
      </ThemedText>
    </View>
  );
}

/**
 * The approved interlocking RA mark — filled geometric forms, not the retired stroke
 * placeholder. The R's diagonal leg crosses in front of the A, with the A's gradient
 * body reading through behind it (see docs/brand-system.md §7 for the construction
 * notes). No circle: that treatment is reserved for the separate favicon "simple
 * monogram" badge (assets/brand/repalong-favicon.svg), not the primary in-app mark.
 *
 * The R flips between Deep Forest and Warm Off White by color scheme so it never
 * disappears against a dark surface; the A's Vitality Green → Aqua Teal gradient stays
 * constant in both themes, matching the approved board.
 */
function MarkSymbol({ size, decorative }: { size: RepAlongMarkSize; decorative: boolean }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const height = SYMBOL_HEIGHT[size];
  const width = height * MARK_ASPECT_RATIO;
  const rFill = isDark ? BrandMark.warmOffWhite : BrandMark.deepForest;

  const accessibilityProps = decorative
    ? {
        accessible: false as const,
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants' as const,
      }
    : {
        accessible: true as const,
        accessibilityRole: 'image' as const,
        accessibilityLabel: 'RepAlong',
      };

  return (
    <View style={{ width, height }} {...accessibilityProps}>
      <Svg width={width} height={height} viewBox="0 0 230 190">
        <Defs>
          <LinearGradient id="repalongAGradient" x1="10%" y1="0%" x2="90%" y2="100%">
            <Stop offset="0%" stopColor={BrandMark.vitalityGreen} />
            <Stop offset="100%" stopColor={BrandMark.aquaTeal} />
          </LinearGradient>
        </Defs>
        {/* A — bold triangular mountain form, one outward flame-kink on the right edge */}
        <Path fill="url(#repalongAGradient)" d="M150,60 L210,146 L196,172 L92,172 Z" />
        {/* R — broad top bar, rounded closed-counter bowl, kicking diagonal leg crosses the A */}
        <Path
          fill={rFill}
          fillRule="evenodd"
          d="M14,14 L108,14 C132,14 132,50 118,64 C108,76 98,86 86,86
             L156,170 L128,170 L58,86 L40,86 L40,170 L14,170 Z
             M40,40 L92,40 C112,40 112,64 100,74 C92,80 84,80 74,80 L40,80 Z"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  corporateStack: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  wordmark: {
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  corporateCaption: {
    textAlign: 'center',
  },
});
