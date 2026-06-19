# 🌍 TripLens(Still Under Development)

TripLens is an intelligent travel planning platform that helps users organize trips, manage budgets, discover hotels, compare transport options, and track travel activities—all from a single dashboard.

Built with React, TypeScript, Firebase, and Gemini AI integration, TripLens aims to make trip planning simple, transparent, and personalized.

---

## ✨ Features

### 🔐 Authentication

* Google Sign-In
* Email & Password Authentication
* Traveler Verification
* Profile Management
* Custom Display Names

### 👤 User Profiles

* Edit Profile
* Traveler Verification Status
* Payment Methods Management
* Dynamic Travel Statistics
* Personalized Dashboard Greetings

### ✈️ Trip Planning

* Create and manage trips
* Destination-based recommendations
* Budget planning
* Travel date management
* Real-time trip updates

### 🏨 Hotel Recommendations

* Smart hotel suggestions
* Price comparison
* Hotel booking workflow
* Hotel detail cards
* Budget-aware recommendations

### 🚗 Transport Planning

* Flight options
* Train recommendations
* Bus suggestions
* Road trip planning
* Transport cost estimation

### 💰 Expense Management

* Trip expense tracking
* Budget monitoring
* Expense categorization
* Real-time cost calculations

### ⚙️ Settings

* Notification preferences
* Currency preferences
* Distance units
* User personalization

### 📊 Travel Analytics

* Trips Planned
* Budget Managed
* Active Trips
* Destinations Explored

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* React Router
* Lucide React Icons

### Backend

* Firebase Authentication
* Cloud Firestore
* Firebase Hosting

### AI

* Google Gemini API

### Database

* Cloud Firestore

---

## 📂 Project Structure

```bash
src/
│
├── app/
│   ├── pages/
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── PaymentMethodsScreen.tsx
│   │   ├── TravelerVerificationScreen.tsx
│   │   └── EditProfileScreen.tsx
│   │
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── theme/
│
├── firebase/
│   ├── config.ts
│   └── auth.ts
│
└── App.tsx
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/triplens.git
cd triplens
```

### Install dependencies

```bash
npm install
```

### Create environment variables

Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

VITE_GEMINI_API_KEY=YOUR_GEMINI_KEY
```

### Run development server

```bash
npm run dev
```

---

## 🔒 Security

Sensitive keys are stored using environment variables and are not committed to GitHub.

Protected:

* Firebase API Keys
* Gemini API Keys
* Authentication Credentials

---

## 🎯 Roadmap

### Upcoming Features

* AI Travel Assistant
* Smart Itinerary Generation
* Hotel Detail Pages
* Google Maps Integration
* Trip Sharing
* Collaborative Planning
* Real-Time Travel Alerts
* Multi-Currency Support
* Advanced Analytics

---
---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the project
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Abdul Aziz**

Computer Science Engineering (Data Science)

Built with ❤️ using React, Firebase, and Gemini AI.
