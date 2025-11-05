import React, { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../AuthContext";
import API from "../api";

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

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [selectedTrash, setSelectedTrash] = useState(null);
  const { user } = useContext(AuthContext);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return alert("ต้องการสิทธิ์เข้าถึงรูปภาพ!");
    
    const pickerResult = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (pickerResult.canceled) return;
    const uri = pickerResult.assets[0].uri;
    setImage(uri);
    await classifyImage(uri);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return alert("ต้องการสิทธิ์ใช้กล้อง!");

    const pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (pickerResult.canceled) return;
    const uri = pickerResult.assets[0].uri;
    setImage(uri);
    await classifyImage(uri);
  };

  const classifyImage = async (uri) => {
    setResult("กำลังวิเคราะห์..."); // แสดงสถานะให้ผู้ใช้ทราบ

    try {
      if (!user?.token) return alert("กรุณาล็อกอินก่อน");

      const form = new FormData();
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1] : "jpg";
      
      form.append("image", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        name: filename,
        type: `image/${ext}`,
      });

      // ใช้ API instance ที่สร้างจาก axios
      const res = await API.post('/waste', form, {
          headers: {
              'Content-Type': 'multipart/form-data',
              // ส่ง Token ในรูปแบบ "Bearer <token>"
              'Authorization': `Bearer ${user.token}`, 
          },
      });

      // นำผลลัพธ์ที่ได้จาก Backend มาแสดงผล
      if (res.data && res.data.waste_type) {
        setResult(res.data.waste_type);
      } else {
        setResult("ไม่สามารถวิเคราะห์ได้");
      }

    } catch (err) {
      console.warn("Upload error", err.response?.data || err);
      setResult(""); // ล้างผลลัพธ์หากเกิดข้อผิดพลาด
      alert('อัปโหลดรูปภาพไม่สำเร็จ');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>4 Types of Waste</Text>

      <View style={styles.trashTypes}>
        {trashTypes.map((t, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.trashCard,
              selectedTrash?.name === t.name && styles.trashCardSelected,
            ]}
            onPress={() => setSelectedTrash(t)}
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

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "#aaa" }}>No pictures</Text>
          </View>
        )}
      </View>

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Results: {result}</Text>
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          onPress={takePhoto}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>📷 Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.galleryButton]}
          onPress={pickImage}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>🖼️ Choose Photo</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 70,
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
  imageContainer: {
    width: "100%",
    height: 230,
    marginBottom: 22,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f6f6f6",
    borderWidth: 1.5,
    borderColor: "#d0ece7",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  placeholder: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  resultBox: {
    padding: 16,
    backgroundColor: "#d1f7c4",
    borderRadius: 15,
    marginBottom: 22,
    alignItems: "center",
    width: "100%",
    shadowColor: "#198754",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#198754",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: "#43b581",
  },
  galleryButton: {
    backgroundColor: "#3b82f6",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});