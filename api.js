import axios from 'axios';

// ใช้ IP Address ของเครื่องคอมพิวเตอร์ที่คุณรัน Backend
// (ห้ามใช้ localhost เพราะในมือถือจะหมายถึงตัวมันเอง)
// สามารถหา IP ได้โดยใช้คำสั่ง `ipconfig` (Windows)
const API_URL = 'http://172.20.10.2:3000/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;