# 🌿 MyPlantPal

MyPlantPal is a React Native mobile application built with **Expo** that helps users identify plants, learn about plant care, and manage their gardening journey through an easy-to-use interface.

---

## 📱 Features

- 🌱 Plant Identification
- 📷 Scan plants using the camera
- 🖼️ Select images from the gallery
- 💡 AI-powered plant information
- 📖 Plant care guide
- ❤️ Save favorite plants
- 👤 User profile
- 🛍️ Plant shop section
- 🔐 Authentication (Login & Register)

---

# 🛠️ Technologies Used

- React Native
- Expo SDK 57
- React Navigation
- Expo Camera
- Expo Image Picker
- Expo Font
- Axios
- JavaScript

---

# 📋 Prerequisites

Before running the project, install the following:

## 1. Node.js

Download and install:

https://nodejs.org/

Verify installation:

```bash
node -v
npm -v
```

---

## 2. Git (Optional)

Download:

https://git-scm.com/

Verify:

```bash
git --version
```

---

## 3. Visual Studio Code

Download:

https://code.visualstudio.com/

Recommended Extensions:

- ESLint
- Prettier
- React Native Tools

---

## 4. Expo Go (Android/iOS)

Install the Expo Go application on your phone.

Android:
https://play.google.com/store/apps/details?id=host.exp.exponent

iOS:
https://apps.apple.com/app/expo-go/id982107779

---

# 📦 Installation

Clone the repository

```bash
git clone <repository-url>
```

or download the ZIP and extract it.

Move into the project folder

```bash
cd MyPlantPal
```

Install all dependencies

```bash
npm install
```

or

```bash
npm install --legacy-peer-deps
```

if dependency conflicts occur.

---

# ▶️ Running the Project

Start the Expo development server.

```bash
npx expo start
```

or

```bash
npm start
```

You will see a QR Code.

Open **Expo Go** on your mobile device and scan the QR code.

The application will launch automatically.

---

# 📂 Project Structure

```
MyPlantPal/
│
├── assets/
├── components/
├── screens/
├── navigation/
├── services/
├── utils/
├── App.js
├── package.json
└── README.md
```

---

# 📷 How to Use

## Plant Scan

1. Open the app.
2. Navigate to the Scan page.
3. Allow camera permission.
4. Capture a plant image or select one from the gallery.
5. Wait for the analysis.
6. View the plant information and care guide.

---

## Plant Care Guide

- Browse plant information.
- Read watering schedules.
- Learn sunlight requirements.
- View maintenance tips.

---

## Favorites

- Tap the ❤️ icon to save a plant.
- Access saved plants from your profile.

---

## User Account

- Register a new account.
- Log in using your credentials.
- View your saved plants.

---

# 📦 Installing New Packages

If additional packages are needed, install them using:

```bash
npx expo install package-name
```

or

```bash
npm install package-name
```

Example:

```bash
npx expo install expo-camera
```

---

# 🔧 Common Commands

Install dependencies

```bash
npm install
```

Start development server

```bash
npx expo start
```

Run on Android

```bash
npx expo run:android
```

Run on iOS

```bash
npx expo run:ios
```

Clear Expo cache

```bash
npx expo start --clear
```

---

# ⚠️ Troubleshooting

### Module not found

Run

```bash
npm install
```

---

### Expo cache issue

```bash
npx expo start --clear
```

---

### Camera permission denied

Grant Camera permission from your phone settings.

---

### Metro Bundler errors

Delete `node_modules` and reinstall.

```bash
rm -rf node_modules
npm install
```

---

# 👩‍💻 Developer

Developed using React Native and Expo.

---

# 📄 License

This project is for educational purposes.
