import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../App';
import { setSubscribed } from '@/lib/storage';
import { colors, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;
type Plan = 'monthly' | 'annual';

export default function PaywallScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<Plan>('annual');

  const subscribe = () => {
    // TODO (production): call RevenueCat `purchasePackage()` here.
    // iOS requires Apple IAP for auto-renewing subscriptions — Stripe is NOT allowed
    // for digital subscriptions consumed inside the app. Integrate RevenueCat
    // (https://www.revenuecat.com), configure the product in App Store Connect,
    // and replace the stub below with:
    //
    //   await Purchases.purchasePackage(selectedPackage);
    //   await setSubscribed(true);
    //
    Alert.alert(
      'Payment stubbed',
      'RevenueCat / Apple IAP not wired up yet. For now, this will mark you as subscribed locally so you can test the unlimited flow.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark subscribed (dev)',
          onPress: async () => {
            await setSubscribed(true);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headline}>Unlimited scans.</Text>
        <Text style={styles.subhead}>
          Keep flipping. No more counting free scans.
        </Text>

        <View style={styles.bullets}>
          {[
            'Unlimited AI appraisals',
            'Platform + title recommendations',
            'Counterfeit & safety warnings',
            'Scan history on-device',
            'Cancel anytime',
          ].map((b) => (
            <View key={b} style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>✓</Text>
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.planRow,
            selected === 'annual' && styles.planRowSelected,
          ]}
          onPress={() => setSelected('annual')}
        >
          <View style={styles.planText}>
            <Text style={styles.planTitle}>Annual</Text>
            <Text style={styles.planSub}>$39 / year · $3.25 / mo</Text>
          </View>
          <View style={styles.savings}>
            <Text style={styles.savingsText}>Save 67%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.planRow,
            selected === 'monthly' && styles.planRowSelected,
          ]}
          onPress={() => setSelected('monthly')}
        >
          <View style={styles.planText}>
            <Text style={styles.planTitle}>Monthly</Text>
            <Text style={styles.planSub}>$9.99 / month</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cta} onPress={subscribe}>
          <Text style={styles.ctaText}>Start unlimited</Text>
        </TouchableOpacity>

        <Text style={styles.fine}>
          Subscriptions auto-renew. Cancel anytime in your Apple ID settings. Payment
          charged to your Apple ID on confirmation.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, gap: spacing.md },
  headline: {
    color: colors.fg,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: spacing.md,
  },
  subhead: {
    color: colors.muted,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  bullets: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletCheck: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 15,
    marginRight: spacing.sm,
    width: 18,
  },
  bulletText: {
    color: colors.fg,
    fontSize: 15,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.card,
  },
  planRowSelected: {
    borderColor: colors.accent,
  },
  planText: { flex: 1 },
  planTitle: {
    color: colors.fg,
    fontSize: 17,
    fontWeight: '700',
  },
  planSub: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  savings: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  savingsText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  ctaText: {
    color: colors.bg,
    fontWeight: '800',
    fontSize: 17,
  },
  fine: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
