import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../App';
import { analyzeImage } from '@/api/client';
import {
  addHistoryEntry,
  incrementScanCount,
  isSubscribed,
} from '@/lib/storage';
import { colors, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export default function CameraScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [busy, setBusy] = useState<
    'idle' | 'capturing' | 'resizing' | 'analyzing'
  >('idle');

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const capture = useCallback(async () => {
    if (!cameraRef.current || busy !== 'idle') return;

    try {
      setBusy('capturing');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
      });
      if (!photo?.uri) throw new Error('Camera returned no image.');

      setBusy('resizing');
      const resized = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1024 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );
      if (!resized.base64) throw new Error('Could not encode image.');

      setBusy('analyzing');
      const result = await analyzeImage(resized.base64, 'image/jpeg');

      if (!(await isSubscribed())) {
        await incrementScanCount();
      }

      await addHistoryEntry({
        id: `${Date.now()}`,
        createdAt: Date.now(),
        imageUri: resized.uri,
        result,
      });

      navigation.replace('Result', { imageUri: resized.uri, result });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      Alert.alert('Scan failed', msg);
    } finally {
      setBusy('idle');
    }
  }, [busy, navigation]);

  if (!permission) {
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.placeholder}>
        <Text style={styles.permissionText}>
          FlipCheck needs camera access to appraise items.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant camera access</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.hintRow}>
          <Text style={styles.hint}>Center the tag or the item in the frame.</Text>
        </View>

        <View style={styles.bottomBar}>
          {busy !== 'idle' ? (
            <View style={styles.busy}>
              <ActivityIndicator color={colors.accent} size="large" />
              <Text style={styles.busyText}>{busyLabel(busy)}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.shutter}
              onPress={capture}
              accessibilityRole="button"
              accessibilityLabel="Scan"
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function busyLabel(busy: Exclude<'capturing' | 'resizing' | 'analyzing', 'idle'>) {
  switch (busy) {
    case 'capturing':
      return 'Capturing…';
    case 'resizing':
      return 'Preparing image…';
    case 'analyzing':
      return 'Appraising…';
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    padding: spacing.lg,
  },
  permissionText: {
    color: colors.fg,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
  },
  permissionButtonText: {
    color: colors.bg,
    fontWeight: '700',
  },
  hintRow: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  hint: {
    color: colors.fg,
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  shutter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.fg,
  },
  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.fg,
  },
  busy: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  busyText: {
    color: colors.fg,
    fontSize: 15,
    marginTop: spacing.sm,
  },
});
