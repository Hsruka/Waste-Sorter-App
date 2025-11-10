import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; // 1. Import StackNavigator
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingScreen from './screens/SettingScreen';
import ClassifyScreen from './screens/ClassifyScreen'; // 2. Import หน้าใหม่

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // 3. สร้าง Stack Navigator

// 4. สร้าง Component สำหรับ Stack ของหน้า Home
// หน้านี้จะจัดการการนำทางระหว่าง Home และ Classify
function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }} // ซ่อน Header ในหน้า Home หลัก
      />
      <Stack.Screen 
        name="Classify" 
        component={ClassifyScreen}
        options={{ 
          title: 'คัดแยกขยะด้วยรูปภาพ', // ตั้งชื่อ Header
          headerBackTitle: 'กลับ', // เปลี่ยนข้อความปุ่มย้อนกลับ (สำหรับ iOS)
        }}
      />
    </Stack.Navigator>
  );
}

// 5. ไฟล์หลักของ Navigator
export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Setting') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#198754',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // ซ่อน Header ของ Tab (เพราะ Stack จะจัดการเอง)
      })}
    >
      {/* 6. เปลี่ยน component ของ Tab "Home" ให้เป็น HomeStackNavigator */}
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
}