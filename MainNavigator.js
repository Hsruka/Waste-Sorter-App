import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./AuthContext";

import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SettingScreen from "./screens/SettingScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ClassifyScreen from "./screens/ClassifyScreen"; // 1. Import หน้าใหม่

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "History") iconName = focused ? "time" : "time-outline";
          else if (route.name === "Setting") iconName = focused ? "settings" : "settings-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingBottom: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // หรือ Splash Screen

  return (
    <NavigationContainer>
      {/* 2. แก้ไข Stack.Navigator หลักที่นี่ */}
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabs} 
              options={{ headerShown: false }} // ซ่อน Header ของหน้า Tab หลัก
            />
            <Stack.Screen 
              name="Classify" 
              component={ClassifyScreen} 
              options={{
                // 3. ตั้งค่า Header ให้แสดงผลตามตัวอย่าง
                headerShown: true, 
                title: 'คัดแยกขยะด้วยรูปภาพ',
                headerBackTitle: 'กลับ', // ข้อความปุ่มย้อนกลับ (สำหรับ iOS)
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}