# 🌿 MyPlantPal

MyPlantPal is a React Native mobile app built with **Expo** that helps you identify plants, diagnose problems with AI, follow care routines, and shop for gardening supplies, all wrapped in a friendly, animated UI.

---

## 📱 Features

- 🤖 **AI Doctor** – chat with PlantBot (Google Gemini) and send a leaf photo for diagnosis, treatment and fertilizer suggestions
- 📷 **Plant Scan** – capture with the camera or pick from the gallery
- 🌱 **My Plants** – health score, watering status, search and "water today" filter
- 📖 **Care Guide** – daily care challenge, essentials, pro tips and common problems
- 📅 **Care Calendar** – watering and fertilizing tasks grouped by day
- 🧪 **Fertilizer Recipes** – homemade fertilizers from kitchen scraps
- 🕓 **Plant History** – timeline of scans and watering
- 🛍️ **Shop** – categories, product details, reviews, cart, checkout and payment (Card, bKash, Nagad, COD)
- ❤️ **Wishlist** – save products for later
- 👤 **Profile** – stats, achievements and quick menu
- 🌙 **Dark Mode** – saved on the device (Settings → Appearance)
- 🐾 **Animated mascot** – interactive Rive character (tap it!)
- 🔐 **Authentication** – Login, Register and Google sign-in

---

# 🛠️ Technologies Used

- React Native (New Architecture)
- Expo
- React Navigation (Native Stack + Bottom Tabs)
- Context API (Auth, Plants, Cart, Wishlist, Theme)
- Google Gemini API (AI Doctor)
- Rive (`rive-react-native`)
- Expo Image Picker, Expo File System, Expo Secure Store, Expo Linear Gradient
- Google Fonts: Fredoka + Inter (`@expo-google-fonts`)
- JavaScript

---

# 📋 Prerequisites

## 1. Node.js (LTS)

https://nodejs.org/

```bash
node -v
npm -v
```

## 2. Git

https://git-scm.com/

## 3. Java JDK 17

https://adoptium.net/

```bash
java -version
```

## 4. Android SDK

Install the Android SDK (with **Platform-Tools**), then set the environment variables.

Windows (PowerShell). Replace the path with your SDK location:

```powershell
setx ANDROID_HOME "C:\Users\<you>\AppData\Local\Android\Sdk"
setx PATH "$env:PATH;C:\Users\<you>\AppData\Local\Android\Sdk\platform-tools"
```

Close and reopen the terminal, then check:

```bash
adb version
```

## 5. Android phone with USB debugging

1. **Settings → About phone** → tap **Build number** 7 times to enable Developer options.
2. **Settings → Developer options** → turn on **USB debugging**.
3. Connect the phone with a USB cable and accept the **Allow USB debugging?** prompt.

Check that the phone is detected:

```bash
adb devices
```

It should show your device as `device` (not `unauthorized`).

## 6. Visual Studio Code

https://code.visualstudio.com/

Recommended extensions: ESLint, Prettier, React Native Tools.

---

# 📦 Installation

```bash
git clone https://github.com/NoshinSyaraPromitee/MAD_Project.git
cd MAD_Project
git checkout till-progress-presentations
npm install
```

If dependency conflicts occur:

```bash
npm install --legacy-peer-deps
```

---

# 🔑 Environment Variables

Create a file named `.env` in the project root:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Get a key from https://aistudio.google.com/app/apikey

> ⚠️ `.env` is in `.gitignore`. **Never commit your API key.**

---

# ▶️ Running on Your Phone (USB)

With the phone connected and `adb devices` showing it:

```bash
npx expo run:android
```

The first build takes a few minutes. It installs **MyPlantPal** on your phone and opens it.

After that, you only need to start the dev server:

```bash
npx expo start --dev-client -c
```

Then open the MyPlantPal app on your phone. Rebuild with `npx expo run:android` only after adding a package that has native code.

If you have more than one device connected:

```bash
npx expo run:android --device
```

---

# 🐾 About the Rive Mascot

The mascot (`assets/animations/totoro.riv`) runs on the native Rive runtime.

Tapping it toggles `mouthOpen`, steps `numState` (0 → 1 → 2) and fires `trigState`.

---

# 📂 Project Structure

```
MyPlantPal/
│
├── assets/
│   ├── animations/        # totoro.riv mascot
│   └── images/            # icons, splash, fallback GIF
├── src/
│   ├── components/        # AppButton, AppCard, AppScreen, RiveMascot, ...
│   ├── context/           # Auth, Plant, Cart, Wishlist, Theme
│   ├── data/              # plants, products, fertilizers, reviews
│   ├── navigation/        # StackNavigator, BottomTabNavigator
│   ├── screens/           # all app screens
│   ├── services/          # chatApi.js (Gemini)
│   ├── theme/             # colors (light/dark), typography, themed()
│   └── utils/             # formatting helpers
├── App.js
├── app.json
├── metro.config.js        # lets Metro bundle .riv files
├── package.json
└── README.md
```

---

# 📷 How to Use

## AI Doctor

1. Open the **AI Doctor** tab.
2. Ask a question, or tap a suggestion chip.
3. Tap **+** to take a photo or choose one from the gallery.
4. Get the diagnosis, treatment, fertilizer tips and shop suggestions.

## Plant Scan

1. Open the **Scan** tab.
2. Tap **Open Camera** and allow camera permission.
3. View the result, then open the Care Guide or ask the AI Doctor.

## Care Guide & Calendar

- Tick off today's care challenge.
- Check water, sunlight, temperature, fertilizer and humidity needs.
- Mark calendar tasks as done.

## Shop

- Browse by category, search and open product details.
- Add to cart or wishlist (❤️), check out, and pick a payment method.

## Dark Mode

Profile → ⚙️ Settings → Appearance → **Dark Mode**. Your choice is remembered.

---

# 📦 Installing New Packages

```bash
npx expo install package-name
```

If the package has native code, rebuild afterwards:

```bash
npx expo run:android
```

---

# 🔧 Common Commands

| Task | Command |
|---|---|
| Install dependencies | `npm install` |
| Build and install on phone (USB) | `npx expo run:android` |
| Start dev server | `npx expo start --dev-client` |
| Start with cache cleared | `npx expo start --dev-client -c` |
| List connected devices | `adb devices` |
| Check package versions | `npx expo install --check` |

---

# ⚠️ Troubleshooting

### `adb devices` shows nothing or `unauthorized`

Use a data cable (not charge-only), turn USB debugging on, and accept the prompt on the phone. Then:

```bash
adb kill-server
adb devices
```

### `ANDROID_HOME` / SDK not found

Check that `ANDROID_HOME` points to your Android SDK folder and that `platform-tools` is in `PATH`. Reopen the terminal after changing them.

### App can't connect to the dev server

Forward the Metro port over USB:

```bash
adb reverse tcp:8081 tcp:8081
```

### Mascot shows a GIF instead of the animation

Rebuild the app so the native Rive module is included:

```bash
npx expo run:android
```

### AI Doctor says the key is missing / requests fail

Check `.env` exists with `EXPO_PUBLIC_GEMINI_API_KEY`, then restart with `npx expo start --dev-client -c`.

### `stream-buffers` / `streambuffer.js` missing during install

`package.json` already pins it through `overrides`. Delete `node_modules` and `package-lock.json`, then run `npm install`.

### Build fails after changing packages

Windows (PowerShell):

```powershell
Remove-Item -Recurse -Force node_modules, android
npm install
npx expo run:android
```

macOS / Linux:

```bash
rm -rf node_modules android
npm install
npx expo run:android
```

### Camera permission denied

Allow camera access for MyPlantPal in your phone's settings.



# 📄 License

This project is for educational purposes.
