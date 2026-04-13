# AI Clinical Decision Support System 🏥

## Overview
A full-stack AI-powered clinical assistant that helps analyze patient symptoms using Google Gemini AI and stores patient history in MySQL.

## Tech Stack
- Frontend: React.js
- Backend: Node.js, Express
- AI: Google Gemini API
- Database: MySQL

## Features
- AI-powered symptom analysis
- Risk classification (Low, Medium, High)
- Patient history storage
- Clean medical report UI

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/minasty/ai-clinical-decision-support-system
cd ai-clinical-decision-support-system

# Environment Variables:
Create a .env file inside the backend folder:
AI_API_KEY=your_api_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clinical_ai
PORT=5000

#Database Setup:
    ##Create Database:
    CREATE DATABASE clinical_db;

    ##Create Table:
    CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symptoms TEXT NOT NULL,
    diagnosis TEXT,
    risk_level VARCHAR(10),
    recommendation TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    );

## How to run:

### Backend:
```bash
cd backend
npm install
node server.js

### frontend
```bash
cd frontend
npm install
npm start

## Screenshots

### Patient Form
![Form](app-screenshots/input_UI.jpg)

### AI Result
![Result](app-screenshots/result_UI.jpg)

### Patient History
![History](app-screenshots/patient_history_UI.jpg)

# Author:
Anastase Minani
    - Software Developer
    - AI & Embedded Systems Enthusiast

⚠️ Disclaimer:
    This application is intended for support purposes only.
    It does not replace professional medical advice or diagnosis.
