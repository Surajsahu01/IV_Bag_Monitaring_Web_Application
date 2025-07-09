# 💧 IV Bag Monitoring System 🚑

An IoT-based smart **IV Monitoring System** to remotely monitor IV fluid levels in real-time using an ESP32 microcontroller, weight sensor (HX711 + load cell), and a MERN stack web application. The system alerts medical staff before the IV bag runs empty or battery level drops critically.

---

## 📌 Features

- 📶 Real-time monitoring of IV bag weight
- ⚡ Battery level tracking
- 🚨 Alerts & notifications via Email/SMS
- 📡 WebSocket support for real-time updates
- 📈 Dashboard with live data & historical trends
- 👨‍⚕️ Admin panel for monitoring multiple patients
- 📤 CSV export of sensor data
- 🔔 Critical alerts for low battery or empty IV

---

## 🛠️ System Architecture

[ESP32 + HX711] ---> [Node.js + Express API] ---> [MongoDB]
| ▲
▼ |
WiFi + HTTP [React Web App]
▲ ▲
[Socket.IO] [Email/SMS Alerts]



---

## ⚙️ Hardware Components

| Component         | Quantity | Description                             |
|------------------|----------|-----------------------------------------|
| ESP32            | 1        | WiFi-enabled microcontroller            |
| HX711 Module     | 1        | 24-bit ADC for load cell                |
| Load Cell        | 1        | To measure weight of IV fluid           |
| 18650 Battery    | 1        | Power source (battery level monitoring) |
| Voltage Divider  | 1        | For battery voltage sensing             |
| Jumper Wires     | —        | For connections                         |
| Breadboard       | 1        | (Optional)                              |

---

## 🖥️ Software Stack

| Layer          | Technologies                         |
|----------------|--------------------------------------|
| Frontend       | React.js, Material UI                |
| Backend        | Node.js, Express.js, Socket.IO       |
| Database       | MongoDB (with Mongoose)              |
| Microcontroller| ESP32 (Arduino Framework)            |
| Communication  | Wi-Fi (HTTP POST), WebSockets        |
| Alerts         | Nodemailer (Email), Twilio (SMS)     |


## 🚀 Installation & Setup

### 1. ESP32 Firmware

- Install Arduino IDE and ESP32 board support
- Install `HX711` library
- Upload code that:
  - Reads from HX711
  - Monitors battery voltage via analog pin
  - Sends HTTP POST to backend server

### 2. Backend (Node.js + Express)

```bash
git clone https://github.com/your-username/iv-monitoring-backend.git
cd iv-monitoring-backend
npm install
node server.js


Frontend (React + Material UI)

git clone https://github.com/your-username/iv-monitoring-frontend.git
cd iv-monitoring-frontend
npm install
npm start


📊 Dashboard Features
Live display of IV weight and battery

Real-time update via WebSocket

Graph view of trends

Export logs as CSV

Alert page to acknowledge/clear issues

Historical data view with filtering


📤 API Endpoints

| Method | Route                 | Description                |
| ------ | --------------------- | -------------------------- |
| POST   | `/api/sensor`         | Send IV & battery data     |
| GET    | `/api/sensor/latest`  | Get last 10 records        |
| GET    | `/api/sensor/average` | Get 5-min average data     |
| GET    | `/api/sensor/history` | Get all historical records |
| POST   | `/api/alert`          | Trigger alert manually     |


📦 Sample Data Format

{
  "weight": 320.4,
  "battery": 85,
  "patientId": "abc123",
  "timestamp": "2025-07-09T13:00:00Z"
}


✅ Future Improvements
Predict IV exhaustion using ML

Android/iOS mobile app for nurses

MQTT protocol support

Integration with hospital management systems



👨‍⚕️ Real-World Use
Used in ICUs, hospitals, and home care where real-time IV monitoring reduces nurse workload and prevents dry IV incidents.