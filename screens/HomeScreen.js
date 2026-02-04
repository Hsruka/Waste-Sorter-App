import React, { useState } from "react"; 
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

const trashTypes = [
  { 
    name: "Recycle", 
    image: require("../assets/recycle.png"), //
    info: "ใช้สำหรับ ขวดพลาสติก, กระป๋อง, กระดาษแข็ง, แก้ว" 
  },
  { 
    name: "Organic", 
    image: require("../assets/organic.png"), //
    info: "ใช้สำหรับ เศษอาหาร, เศษผักผลไม้, ของเหลือจากครัว" 
  },
  { 
    name: "General", 
    image: require("../assets/general.png"), //
    info: "ใช้สำหรับ ขยะที่ไม่สามารถรีไซเคิลได้ เช่น ซองขนม, กล่องโฟม" 
  },
  { 
    name: "Hazardous", 
    image: require("../assets/hazard.png"), //
    info: "ใช้สำหรับ ขยะอันตราย เช่น ถ่านไฟฉาย, หลอดไฟ, สารเคมี" 
  },
];

export default function HomeScreen({ navigation }) {
  const [selectedTrash, setSelectedTrash] = useState(null);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      
      <View style={styles.headerContainer}>
        <Image 
          source={require("../assets/logo_symbol.png")}
          style={styles.headerImage} 
        />
        <Text style={styles.headerTitle}>สวัสดี!</Text>
        <Text style={styles.headerSubtitle}>มาร่วมกันคัดแยกขยะเพื่อโลกของเรา</Text>
      </View>

      <Text style={styles.sectionTitle}>Waste Types</Text>
      
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
            <Image 
              source={t.image} 
              style={styles.trashImage} 
            />
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

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('Classify')}
        activeOpacity={0.8}
      >
        <Ionicons name="scan" size={24} color="#fff" style={styles.scanButtonIcon} />
        <Text style={styles.scanButtonText}>Scan Waste</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FDFB", 
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  headerImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A3B20',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A3B20',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  
  trashTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  trashCard: {
    width: "48%", 
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#198754",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  trashCardSelected: {
    borderColor: "#198754",
    backgroundColor: "#e9fbe5",
  },
  trashImage: {
    width: 70,
    height: 70, 
    marginBottom: 15,
    resizeMode: "contain",
  },
  trashText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#198754",
  },

  // 7. Style กล่องข้อมูล
  infoBox: {
    backgroundColor: "#fffbe7",
    padding: 18,
    borderRadius: 18,
    width: "100%",
    marginBottom: 30,
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

  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#198754', 
    paddingVertical: 18,
    width: '100%',
    borderRadius: 30,
    shadowColor: "#198754",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  scanButtonIcon: {
    marginRight: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});