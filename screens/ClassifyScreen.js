import React, { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../AuthContext";
import API from "../api";

// หน้านี้จะรับผิดชอบการเลือก/ถ่ายภาพ และการวิเคราะห์ผล
export default function ClassifyScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
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
    setResult("กำลังวิเคราะห์..."); 

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

      const res = await API.post('/waste', form, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${user.token}`, 
          },
      });

      if (res.data && res.data.waste_type) {
        setResult(res.data.waste_type);
      } else {
        setResult("ไม่สามารถวิเคราะห์ได้");
      }

    } catch (err) {
      console.warn("Upload error", err.response?.data || err);
      setResult(""); 
      alert('อัปโหลดรูปภาพไม่สำเร็จ');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

// นำ Styles ที่เกี่ยวข้องมาจาก HomeScreen
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#e3f6f5",
    alignItems: "center",
    paddingTop: 30, // เพิ่มช่องว่างด้านบน
  },
  imageContainer: {
    width: "100%",
    height: 300, // เพิ่มความสูง
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