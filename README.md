# 🎵 AI Mood Based Music Generator · [Live Demo 🌐](https://mooodifyai.netlify.app/)

A web application that detects a user's **emotions from text input** and plays **personalized Spotify songs** that match the mood — using Hugging Face NLP models and Spotify API integration..

---

## 🛠️ Tech Stack

- ⚛️ React (Frontend)
- 🟩 Node.js + Express (Backend)
- 🤗 Hugging Face (Emotion Detection Model)
- 🎧 Spotify Web API (Music Fetching)
- 🌐 Netlify (Frontend Hosting)
- ☁️ Render (Backend Hosting)

---

## 🌟 Features

- 🤖 AI-based mood detection from user input (text)
- 🎧 Personalized Spotify music recommendations
- ⚛️ Full-stack application: React + Node.js
- 🎨 Clean and responsive UI

---

## 🖼️ Demo

https://mooodifyai.netlify.app/

---

## ✅ Prerequisites

- Node.js & npm
- Spotify Developer account
- Hugging Face API key

---

## 🔑 API Keys Required

Before running the app, create accounts and obtain API keys:

### 🔹 Hugging Face Inference API
- Sign up at: https://huggingface.co
- Get your access token from: https://huggingface.co/settings/tokens

### 🔹 Spotify Web API
- Go to: https://developer.spotify.com/dashboard
- Create a new app to get:
  - `Client ID`
  - `Client Secret`

---

## 🛠️ Local Setup Guide

### ⚙️ Step 1: Clone the Repository

```bash
git clone https://github.com/NidhiTulsyan/AI_mood_based_music_generator.git
cd AI_mood_based_music_generator
```
----
### 🖥️ Step 2: Backend Setup (Node + Express)

```bash
cd server
npm install

```
----
### 🖥️ Step 3: Create a .env file inside the server/ folder

```bash
HUGGING_FACE_API_KEY=your_huggingface_token
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

```
---
### ⚙️ Step 4: Start the backend server

```bash
node server.js
```

Server will run on: http://localhost:8000


### 🌐 Step 3: Frontend Setup (React)

```bash
cd ../client
npm install
npm start
```

Frontend will run on: http://localhost:3000

## 🤝 Contributing

Contributions are welcome!  
Feel free to **fork the repo**, **submit pull requests**, or **report bugs and suggestions**.

---

## 📃 License

This project is licensed under the **MIT License**  
© 2025 **Nidhi Tulsyan**

---

## 🙌 Acknowledgements

- [Hugging Face](https://huggingface.co/)
- [Spotify for Developers](https://developer.spotify.com/)
- [Render](https://render.com/)
- [Netlify](https://www.netlify.com/)
