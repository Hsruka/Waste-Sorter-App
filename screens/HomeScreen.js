import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const trashTypes = [
  { 
    name: "Recycle", 
    image: require("../assets/recycle.png"),
    info: "ใช้สำหรับ ขวดพลาสติก, กระป๋อง, กระดาษแข็ง, แก้ว" 
  },
  { 
    name: "Organic", 
    image: require("../assets/organic.png"),
    info: "ใช้สำหรับ เศษอาหาร, เศษผักผลไม้, ของเหลือจากครัว" 
  },
  { 
    name: "General", 
    image: require("../assets/general.png"),
    info: "ใช้สำหรับ ขยะที่ไม่สามารถรีไซเคิลได้ เช่น ซองขนม, กล่องโฟม" 
  },
  { 
    name: "Hazardous", 
    image: require("../assets/hazard.png"),
    info: "ใช้สำหรับ ขยะอันตราย เช่น ถ่านไฟฉาย, หลอดไฟ, สารเคมี" 
  },
];

export default function HomeScreen({ navigation }) {
  const [selectedTrash, setSelectedTrash] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <TouchableOpacity
        style={styles.classifyCard}
        onPress={() => navigation.navigate('Classify')}
        activeOpacity={0.85}
      >
        <Image source={require("../assets/trash.png")} style={styles.classifyCardImage} />
        <View style={styles.classifyCardTextBox}>
          <Text style={styles.classifyCardTitle}>คัดแยกขยะ</Text>
          <Text style={styles.classifyCardText}>คัดแยกขยะที่คุณต้องการด้วยรูปภาพ</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#198754" />
      </TouchableOpacity>

      <Text style={styles.title}>4 Types of Waste</Text>

      <View style={styles.trashTypes}>
        {trashTypes.map((t, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.trashCard,
              selectedTrash?.name === t.name && styles.trashCardSelected,
            ]}
            onPress={() => setSelectedTrash(selectedTrash?.name === t.name ? null : t)}
            activeOpacity={0.8}
          >
            <Image source={t.image} style={styles.trashImage} />
            <Text style={styles.trashText}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTrash && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>{selectedTrash.name}</Text>
          <Text style={styles.infoText}>{selectedTrash.info}</Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#e3f6f5",
    alignItems: "center",
  },
  classifyCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70, // ขยับลงมาจากขอบบน
    marginBottom: 30,
    shadowColor: "#198754",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  classifyCardImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    resizeMode: 'contain',
  },
  classifyCardTextBox: {
    flex: 1, // ทำให้ข้อความขยายเต็มพื้นที่ที่เหลือ
  },
  classifyCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#198754',
    marginBottom: 3,
  },
  classifyCardText: {
    fontSize: 14,
    color: '#555',
  },
  // จบส่วน Style ของปุ่มใหม่

  title: {
    fontSize: 26,
    fontWeight: "bold",
    // marginTop: 70, // (ลบ marginTop เดิม)
    marginBottom: 30,
    textAlign: "center",
    color: "#198754",
    letterSpacing: 1,
  },
  trashTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
    width: "100%",
  },
  trashCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 22,
    marginBottom: 18,
    alignItems: "center",
    shadowColor: "#198754",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  trashCardSelected: {
    borderColor: "#198754",
    backgroundColor: "#e9fbe5",
  },
  trashImage: {
    width: 65,
    height: 65,
    marginBottom: 10,
    resizeMode: "contain",
  },
  trashText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#198754",
    letterSpacing: 0.5,
  },
  infoBox: {
    backgroundColor: "#fffbe7",
    padding: 18,
    borderRadius: 18,
    marginBottom: 25,
    width: "100%",
    shadowColor: "#fbc02d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#b8860b",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
});