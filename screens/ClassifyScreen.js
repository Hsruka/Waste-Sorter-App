import React, { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../AuthContext";
import API from "../api";
import { Ionicons } from '@expo/vector-icons';

const trashImages = {
  Recycle: require("../assets/recycle.png"), 
  Organic: require("../assets/organic.png"), 
  General: require("../assets/general.png"), 
  Hazardous: require("../assets/hazard.png"), 
};

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
            <Ionicons name="image-outline" size={80} color="#c0e0d0" />
            <Text style={styles.placeholderText}>No picture</Text>
          </View>
        )}
      </View>

      {result ? (
        <View style={styles.resultBox}>
          {trashImages[result] && (
            <Image 
              source={trashImages[result]}
              style={styles.resultImage}
            />
          )}
          <Text style={styles.resultText}>
            {result === "กำลังวิเคราะห์..." || result === "ไม่สามารถวิเคราะห์ได้"
              ? result
              : `Results: ${result}`}
          </Text>
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonSolid} 
          onPress={takePhoto}
          activeOpacity={0.85}
        >
          <Ionicons name="camera" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonSolidText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonOutline} 
          onPress={pickImage}
          activeOpacity={0.85}
        >
          <Ionicons name="images" size={20} color="#198754" style={styles.buttonIcon} />
          <Text style={styles.buttonOutlineText}>Upload from Gallery</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F7FDFB", 
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 300, 
    marginBottom: 25,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#EDFBF5", 
    borderWidth: 2,
    borderColor: "#d0ece7",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 10,
  },
  resultBox: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16,
    backgroundColor: "#d1f7c4",
    borderRadius: 15,
    marginBottom: 25,
    width: "100%",
    shadowColor: "#198754",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  resultImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 15, 
  },
  resultText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#198754",
    flexShrink: 1, 
  },
  buttonContainer: {
    width: "100%",
    marginTop: 5,
  },
  buttonSolid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#198754',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: "#198754",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 15, 
  },
  buttonSolidText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 14, 
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#198754',
  },
  buttonOutlineText: {
    color: "#198754",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginRight: 10,
  }
});