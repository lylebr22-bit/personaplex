import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../App';
import { getHistory, type HistoryEntry } from '@/lib/storage';
import { colors, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function HistoryScreen({ navigation }: Props) {
  const [items, setItems] = useState<HistoryEntry[]>([]);

  const load = useCallback(async () => {
    setItems(await getHistory());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.empty} edges={['bottom']}>
        <Text style={styles.emptyText}>No scans yet.</Text>
        <TouchableOpacity
          style={styles.primary}
          onPress={() => navigation.replace('Camera')}
        >
          <Text style={styles.primaryText}>Scan your first item</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      contentContainerStyle={{ padding: spacing.md }}
      ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            navigation.navigate('Result', {
              imageUri: item.imageUri,
              result: item.result,
            })
          }
        >
          <Image source={{ uri: item.imageUri }} style={styles.thumb} />
          <View style={styles.rowBody}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {item.result.itemName}
            </Text>
            <Text style={styles.rowMeta} numberOfLines={1}>
              ${item.result.estimatedValue.low}–${item.result.estimatedValue.high} ·{' '}
              {item.result.bestPlatform}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  primary: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryText: {
    color: colors.bg,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radii.sm,
    backgroundColor: colors.border,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    color: colors.fg,
    fontSize: 15,
    fontWeight: '600',
  },
  rowMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
});
