import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../App';
import { canScan, FREE_SCAN_LIMIT } from '@/lib/storage';
import { colors, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [remaining, setRemaining] = useState<number>(FREE_SCAN_LIMIT);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const refresh = useCallback(async () => {
    const { remaining: r, allowed } = await canScan();
    setRemaining(Number.isFinite(r) ? r : FREE_SCAN_LIMIT);
    setIsSubscribed(allowed && !Number.isFinite(r) ? false : r === Infinity);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onScan = async () => {
    const { allowed } = await canScan();
    if (!allowed) {
      navigation.navigate('Paywall');
      return;
    }
    navigation.navigate('Camera');
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.hero}>
        <Text style={styles.wordmark}>
          flip<Text style={styles.wordmarkAccent}>check</Text>
        </Text>
        <Text style={styles.tagline}>Snap a tag. Know what it's worth.</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primary]}
          onPress={onScan}
          accessibilityRole="button"
        >
          <Text style={styles.primaryText}>Scan an item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondary}
          onPress={() => navigation.navigate('History')}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryText}>Recent scans</Text>
        </TouchableOpacity>

        <View style={styles.statusWrap}>
          {isSubscribed ? (
            <Text style={styles.statusSubscribed}>Unlimited scans</Text>
          ) : (
            <Text style={styles.statusFree}>
              {remaining} of {FREE_SCAN_LIMIT} free scans left
            </Text>
          )}
          {!isSubscribed && (
            <TouchableOpacity onPress={() => navigation.navigate('Paywall')}>
              <Text style={styles.upgradeLink}>Upgrade →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  wordmark: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.fg,
    marginBottom: spacing.sm,
  },
  wordmarkAccent: {
    color: colors.accent,
  },
  tagline: {
    fontSize: 17,
    color: colors.muted,
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  primary: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.bg,
    fontSize: 17,
    fontWeight: '700',
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.fg,
    fontSize: 16,
    fontWeight: '600',
  },
  statusWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginTop: spacing.sm,
  },
  statusFree: {
    color: colors.muted,
    fontSize: 14,
  },
  statusSubscribed: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  upgradeLink: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});
