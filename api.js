import axios from 'axios';

// ✅ 1. เปลี่ยน URL เป็น Render (ของจริง)
const API_URL = 'https://waste-sorter-backend-api.onrender.com/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 2. เพิ่มฟังก์ชัน Login ที่ถูกต้อง (ส่ง email แทน username)
export const login = async (email, password) => {
  try {
    const response = await API.post('/auth/login', {
      email: email,       // <--- หัวใจสำคัญ! ต้องส่ง key ชื่อ "email" เท่านั้น
      password: password
    });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// ฟังก์ชันอื่นๆ (ถ้ามี)
export const signup = async (userData) => {
  try {
    const response = await API.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default API;