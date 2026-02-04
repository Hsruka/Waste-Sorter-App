import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ฟังก์ชันนี้จะทำงานครั้งเดียวตอนแอปเริ่ม
    // เพื่อเช็คว่ามีข้อมูลผู้ใช้ที่เคยล็อกอินไว้ในเครื่องหรือไม่
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // สร้างฟังก์ชัน setUser เพื่อจัดการการบันทึกข้อมูล
  const setUser = async (userData) => {
    try {
      if (userData) {
        // ถ้ามีการล็อกอิน ให้บันทึกข้อมูลลง AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        // ถ้าเป็นการล็อกเอาท์ ให้ลบข้อมูลออกจาก AsyncStorage
        await AsyncStorage.removeItem('user');
      }
      setUserState(userData);
    } catch (e) {
      console.error("Failed to save user to storage", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};