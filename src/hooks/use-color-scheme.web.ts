import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const noopSubscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * useSyncExternalStore lets us report a stable server snapshot ('light') during SSR/hydration and
 * the real value once mounted, without the extra render triggered by setState-in-effect.
 */
export function useColorScheme() {
  const isHydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const colorScheme = useRNColorScheme();

  return isHydrated ? colorScheme : 'light';
}
