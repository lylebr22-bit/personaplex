import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from '@/screens/HomeScreen';
import CameraScreen from '@/screens/CameraScreen';
import ResultScreen from '@/screens/ResultScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import PaywallScreen from '@/screens/PaywallScreen';
import { colors } from '@/theme';
import type { AnalyzeResponse } from '@/api/client';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Result: { imageUri: string; result: AnalyzeResponse };
  History: undefined;
  Paywall: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: colors.accent,
            background: colors.bg,
            card: colors.bg,
            text: colors.fg,
            border: colors.border,
            notification: colors.accent,
          },
          fonts: {
            regular: { fontFamily: 'System', fontWeight: '400' },
            medium: { fontFamily: 'System', fontWeight: '500' },
            bold: { fontFamily: 'System', fontWeight: '700' },
            heavy: { fontFamily: 'System', fontWeight: '900' },
          },
        }}
      >
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.fg,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'FlipCheck' }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: 'Scan item', headerTransparent: true, headerTitle: '' }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{ title: 'Appraisal' }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: 'Scan history' }}
          />
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{ title: 'Go unlimited', presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
