import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import API from '../api';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) return alert('กรุณากรอกข้อมูลให้ครบ');
    setLoading(true);
    try {
      await API.post('/auth/register', { username, email, password });
      alert('สมัครสมาชิกสำเร็จ');
      navigation.goBack();
    } catch (err) {
      console.warn(err.response || err.message);
      alert('สมัครไม่สำเร็จ: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.innerContainer}>
        <Image 
          source={require('../assets/logo_symbol.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>สร้างบัญชีใหม่</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="ชื่อผู้ใช้"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="อีเมล"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="รหัสผ่าน"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>กลับไปหน้าเข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#748c6b',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 25, 
    color: '#DDE0C8'
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3A3F35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { 
    color: '#DDE0C8',
    fontWeight: 'bold', 
    fontSize: 16 
  },
  link: { 
    color: '#DDE0C8',
    fontWeight: '600',
    marginTop: 10,
    fontSize: 16,
  },
});