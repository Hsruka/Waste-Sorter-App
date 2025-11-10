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
        // 4. (ไม่จำเป็น) โหลด Fonts หรือ Assets อื่นๆ ที่นี่
        // await Font.loadAsync(...);
        // await new Promise(resolve => setTimeout(resolve, 2000)); // จำลองการโหลด 2 วินาที

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
      // 5. ซ่อน Splash Screen เมื่อแอปพร้อม
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // หรือจะส่งคืน View เปล่าๆ ก็ได้
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </View>
  );
};