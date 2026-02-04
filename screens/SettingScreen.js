import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // 1. ต้องใช้ Ionicons
import { AuthContext } from "../AuthContext";

export default function SettingScreen() {
  const { user, setUser } = useContext(AuthContext); 

  const handleLogout = () => {
    Alert.alert("Logout", "Do you want to logout?", [
      { text: "cancle", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => setUser(null), 
      },
    ]);
  };

  const userInfo = user?.user; 

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Setting</Text>
      </View>

      {/* Profile Card (เหมือนเดิม) */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIconText}>
            {userInfo?.username ? userInfo.username[0].toUpperCase() : "G"}
          </Text>
        </View>
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{userInfo?.username || "Guest"}</Text>
          <Text style={styles.profileEmail}>{userInfo?.email || "No email provided"}</Text>
        </View>
      </View>

      {/* Logout Button (อัปเดต) */}
      <View style={styles.menuCard}>
        <TouchableOpacity 
          style={styles.menuItem} // 2. Style menuItem ถูกอัปเดต
          activeOpacity={0.7} 
          onPress={handleLogout}
        >
          {/* 3. ไอคอนซ้าย */}
          <View style={styles.menuIcon}>
            <Ionicons name="log-out-outline" size={22} color="#D9534F" />
          </View>
          {/* 4. ข้อความ (Style menuItemText ถูกอัปเดต) */}
          <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

// 5. อัปเดต Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F7FDFB", 
  },
  contentContainer: {
    padding: 24,
    alignItems: "center"
  },
  header: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A3B20',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 25,
    shadowColor: "#198754",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarIconText: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#198754" 
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  menuCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15, 
    shadowColor: "#198754",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden', 
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'center', // 6. จัดกลุ่ม (ไอคอน+ข้อความ) ให้อยู่ตรงกลาง
  },
  menuIcon: {
    // 7. ลบ width: 30 ออก
    alignItems: 'center',
  },
  menuItemText: {
    // 8. ลบ flex: 1 ออก
    fontSize: 17,
    color: '#444',
    marginLeft: 15, // 9. ยังคงเว้นระยะห่างจากไอคอน
  },
  logoutText: {
    color: '#D9534F', 
    fontWeight: '600',
  },
});