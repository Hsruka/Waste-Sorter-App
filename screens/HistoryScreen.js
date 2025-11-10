import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../AuthContext";
import API from "../api";
import { Ionicons } from "@expo/vector-icons";

const trashInfo = {
  Recycle: { icon: "leaf", color: "#28a745" },
  Organic: { icon: "nutrition", color: "#fd7e14" },
  General: { icon: "trash-bin", color: "#6c757d" },
  Hazardous: { icon: "warning", color: "#dc3545" },
  Default: { icon: "help-circle", color: "#6c757d" },
};

export default function HistoryScreen() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = user?.token;

  const fetchHistory = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get("/waste/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.warn("Error fetching history:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory])
  );

  const renderItem = ({ item }) => {
    const info = trashInfo[item.waste_type] || trashInfo.Default;
    return (
      <View style={styles.itemCard}>
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Ionicons name={info.icon} size={22} color={info.color} />
            <Text style={[styles.type, { color: info.color }]}>{item.waste_type}</Text>
          </View>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleString("th-TH", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="archive-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>No sorting history yet</Text>
      <Text style={styles.emptySubText}>Try taking a photo of your trash to get started!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sorting history</Text>
      {loading && history.length === 0 ? ( 
        <ActivityIndicator size="large" color="#198754" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={fetchHistory}
          refreshing={loading}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: "#F7FDFB",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#198754",
    letterSpacing: 0.5,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 12,
    shadowColor: "#198754",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  thumbnail: {
    width: 65,
    height: 65,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  itemContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  type: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#aaa",
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 5,
  },
});