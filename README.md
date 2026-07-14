# 🍎 FarmVision AI
### AI-Based Pomegranate Disease Detection and Management Platform

FarmVision AI is a full-stack Artificial Intelligence powered web application that helps farmers detect pomegranate fruit diseases from images using Deep Learning. The platform provides real-time disease prediction, confidence score, diagnosis, pesticide recommendations, preventive precautions, prediction history, and analytics dashboard through an interactive web interface.

---

## 📌 Features

- 🔐 Farmer & Admin Authentication
- 📸 Image Upload for Disease Detection
- 🤖 CNN-Based Disease Prediction
- 📊 Confidence Score Generation
- 💊 Pesticide Recommendation System
- 🩺 Disease Diagnosis & Precautions
- 📈 Admin Analytics Dashboard
- 📜 Prediction History Management
- 💾 MongoDB Database Integration
- 🎨 Modern Responsive Glassmorphism UI
- ⚡ REST API Based Architecture

---

## 🚀 Project Workflow

```text
Farmer/Admin
      │
      ▼
React Frontend
      │
      ▼
Flask REST API
      │
      ▼
Image Preprocessing
(OpenCV)
      │
      ▼
TensorFlow CNN Model
      │
      ▼
Disease Prediction
      │
      ▼
Recommendation Generation
      │
      ▼
MongoDB Storage
      │
      ▼
Prediction History & Analytics
```

---

# 🏗️ System Architecture

```
User
 │
 ▼
React.js Frontend
 │
 ▼
Flask Backend API
 │
 ├── Authentication
 ├── Image Upload
 ├── Prediction API
 ├── History API
 └── Analytics API
 │
 ▼
TensorFlow CNN Model
 │
 ▼
MongoDB Database
```

---

# 🧠 AI Model

The project uses a Convolutional Neural Network (CNN) developed using TensorFlow for pomegranate disease classification.

### Disease Classes

- Healthy
- Anthracnose
- Alternaria
- Cercospora
- Bacterial Blight

---

# 💊 Prediction Output

The system predicts

- Disease Name
- Confidence Score
- Diagnosis
- Recommended Pesticide
- Preventive Precautions

---

# 💻 Tech Stack

## Frontend

- React.js
- CSS3
- JavaScript
- Framer Motion

## Backend

- Flask
- Flask-CORS
- REST API

## AI / Machine Learning

- TensorFlow
- Keras
- OpenCV
- NumPy

## Database

- MongoDB

## Tools

- Visual Studio Code
- Git
- GitHub
- Postman

---

# 📂 Project Structure

```
FarmVision-AI
│
├── backend
│   ├── app.py
│   ├── requirements.txt
│   └── model
│
├── farmvision-frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── screenshots
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Dk-GiT81/FarmVision-AI.git
```

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

python app.py
```

---

## Frontend Setup

```bash
cd farmvision-frontend

npm install

npm start
```

---

## 📊 Key Functionalities

✅ User Registration

✅ Login Authentication

✅ Role-Based Access (Farmer/Admin)

✅ Image Upload

✅ CNN-Based Prediction

✅ Disease Diagnosis

✅ Pesticide Recommendation

✅ Prediction History

✅ Analytics Dashboard

---

## 🎯 Real World Applications

- Smart Agriculture
- Precision Farming
- Crop Health Monitoring
- Early Disease Detection
- Decision Support for Farmers
- AI-Based Agricultural Advisory

---

## 📈 Future Scope

- Mobile Application
- Multi-Fruit Disease Detection
- Multilingual Support
- IoT Sensor Integration
- Weather-Based Disease Prediction
- Cloud Deployment
- Email/SMS Notifications
- Explainable AI (XAI)
- Drone-Based Disease Detection

---

## 📚 References

This project is inspired by recent research in

- CNN-Based Fruit Disease Detection
- Transfer Learning
- Computer Vision
- Deep Learning
- Precision Agriculture
- AI-Based Recommendation Systems

---

## ⭐ If you found this project useful, consider giving it a Star.
