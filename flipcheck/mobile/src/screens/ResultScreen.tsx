import { useMemo } from 'react';
import {
  Alert,
  Image,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../App';
import { colors, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ route, navigation }: Props) {
  const { imageUri, result } = route.params;

  const priceRange = useMemo(() => {
    const { low, high } = result.estimatedValue;
    if (low === high) return `$${low}`;
    return `$${low}–$${high}`;
  }, [result]);

  const copyTitle = async () => {
    try {
      await Clipboard.setStringAsync(result.suggestedTitle);
      Alert.alert('Copied', 'Listing title copied to clipboard.');
    } catch {
      Alert.alert('Copy failed');
    }
  };

  const shareResult = async () => {
    try {
      await Share.share({
        message: `${result.suggestedTitle}\n\nExpected: ${priceRange} on ${result.bestPlatform}\n\nAppraised with FlipCheck.`,
      });
    } catch {
      // user canceled
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Estimated resale value</Text>
          <Text style={styles.price}>{priceRange}</Text>
          <Text style={styles.confidence}>
            {confidenceLabel(result.confidence)} confidence
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>What it is</Text>
          <Text style={styles.cardMain}>{result.itemName}</Text>
          <Text style={styles.meta}>
            {[
              result.brand,
              result.category,
              `Condition: ${result.conditionEstimate}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>List it on</Text>
          <Text style={styles.cardMain}>{result.bestPlatform}</Text>
          <Text style={styles.meta}>{result.platformReasoning}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Suggested title</Text>
          <Text style={styles.titleText}>{result.suggestedTitle}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyTitle}>
            <Text style={styles.copyButtonText}>Copy title</Text>
          </TouchableOpacity>
        </View>

        {result.sellingTips.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Selling tips</Text>
            {result.sellingTips.map((tip, idx) => (
              <View key={idx} style={styles.tipRow}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {result.warnings.length > 0 && (
          <View style={[styles.card, styles.warning]}>
            <Text style={[styles.cardLabel, { color: colors.danger }]}>
              Heads up
            </Text>
            {result.warnings.map((w, idx) => (
              <Text key={idx} style={styles.warningText}>
                {w}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primary}
            onPress={() => navigation.replace('Camera')}
          >
            <Text style={styles.primaryText}>Scan another</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondary} onPress={shareResult}>
            <Text style={styles.secondaryText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function confidenceLabel(c: 'high' | 'medium' | 'low') {
  switch (c) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
  },
  priceCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceLabel: {
    color: colors.muted,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  price: {
    color: colors.accent,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
    marginVertical: spacing.xs,
  },
  confidence: {
    color: colors.muted,
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: {
    color: colors.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  cardMain: {
    color: colors.fg,
    fontSize: 20,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  titleText: {
    color: colors.fg,
    fontSize: 16,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  copyButton: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(249,115,22,0.12)',
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    color: colors.accent,
    fontWeight: '700',
  },
  tipRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  tipBullet: {
    color: colors.accent,
    fontSize: 16,
    marginRight: spacing.sm,
    lineHeight: 22,
  },
  tipText: {
    color: colors.fg,
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  warning: {
    borderColor: colors.danger,
  },
  warningText: {
    color: colors.fg,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primary: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.bg,
    fontWeight: '700',
    fontSize: 16,
  },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.fg,
    fontWeight: '600',
    fontSize: 16,
  },
});
