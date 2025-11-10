import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'; // 1. Import SplashScreen
import { useCallback, useEffect, useState } from 'react'; // 2. Import hooks
import MainNavigator from './MainNavigator'; // ตรวจสอบว่าเส้นทางนี้ถูกต้อง
import { AuthProvider } from './AuthContext'; // ตรวจสอบว่าเส้นทางนี้ถูกต้อง

// 3. ป้องกันไม่ให้ Splash Screen หายไปเอง
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // จำลองการโหลด 2 วินาที

      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </View>
  );
};