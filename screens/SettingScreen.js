import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../AuthContext";

export default function SettingScreen() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert("ออกจากระบบ", "คุณต้องการออกจากระบบหรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ออกจากระบบ",
        style: "destructive",
        onPress: () => setUser(null),
      },
    ]);
  };

  const userInfo = user?.user;

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <View style={styles.avatarIcon}>
          <Text style={styles.avatarIconText}>
            {userInfo?.username ? userInfo.username[0].toUpperCase() : "G"}
          </Text>
        </View>
        <Text style={styles.username}>{userInfo?.username || "Guest"}</Text>
        <Text style={styles.email}>{userInfo?.email || "No email provided"}</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F7FDFB", alignItems: "center" },
  profileBox: { alignItems: "center", marginTop: 60, marginBottom: 30 },
  avatarIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#d1f7c4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarIconText: { fontSize: 48, fontWeight: "bold", color: "#198754" },
  username: { fontSize: 22, fontWeight: "bold", color: "#333" },
  email: { fontSize: 16, color: "#777", marginTop: 4 },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    shadowColor: "#198754",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    alignItems: "center",
  },
  logoutButtonText: { color: "#fff", fontWeight: "bold", fontSize: 17 },
});