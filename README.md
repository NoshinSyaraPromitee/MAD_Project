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

- React Native 0.88 (New Architecture)
- Expo SDK 58
- React 19
- React Navigation 7 (Native Stack + Bottom Tabs)
- Context API (Auth, Plants, Cart, Wishlist, Theme)
- Google Gemini API (AI Doctor)
- Rive (`rive-react-native`, `@rive-app/canvas`, `react-native-webview`)
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

```bash
git --version
```

## 3. Visual Studio Code

https://code.visualstudio.com/

Recommended extensions: ESLint, Prettier, React Native Tools.

## 4. Expo Go (SDK 58) on your phone

- Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- iOS: https://apps.apple.com/app/expo-go/id982107779

> Expo Go must support **SDK 58**. If it says the project is incompatible, update Expo Go from the store.

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/NoshinSyaraPromitee/MAD_Project.git
cd MAD_Project
git checkout till-progress-presentations
```

Install dependencies

```bash
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

# ▶️ Running the Project

```bash
npx expo start -c
```

- **Phone:** open **Expo Go** and scan the QR code
- **Browser:** press `w`
- **Android emulator:** press `a`

---

# 🐾 About the Rive Mascot

The mascot (`assets/animations/totoro.riv`) plays everywhere, using a different player depending on where the app runs:

| Where you run it | Player used |
|---|---|
| Browser (`w`) | `@rive-app/canvas` |
| Expo Go | Rive web player inside a WebView |
| Development build | Native `rive-react-native` |

Tapping the mascot toggles `mouthOpen`, steps `numState` (0 → 1 → 2) and fires `trigState`.

> In Expo Go and the browser, the Rive player loads from a CDN, so the device needs **internet**. Without it, a GIF is shown instead.

### Optional: build your own development app (native Rive, no Android Studio)

```bash
npm install -g eas-cli
eas login
npx expo install expo-dev-client
eas build:configure
eas build -p android --profile development
```

Install the APK from the link EAS gives you, then run:

```bash
npx expo start --dev-client -c
```

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

Use `expo install` so the versions match SDK 58:

```bash
npx expo install package-name
```

---

# 🔧 Common Commands

| Task | Command |
|---|---|
| Install dependencies | `npm install` |
| Start dev server | `npx expo start` |
| Start with cache cleared | `npx expo start -c` |
| Run in browser | `npx expo start --web` |
| Start for a development build | `npx expo start --dev-client` |
| Check package versions | `npx expo install --check` |

---

# ⚠️ Troubleshooting

### "Project is incompatible with this version of Expo Go"

Update Expo Go from the Play Store or App Store so it supports SDK 58.

### `View config not found for component RiveReactNativeView`

Native Rive isn't available in Expo Go. Make sure `react-native-webview` and `expo-asset` are installed:

```bash
npx expo install react-native-webview expo-asset @rive-app/canvas
```

### Mascot shows a GIF instead of the animation

The device has no internet (the Rive player loads from a CDN).

### AI Doctor says the key is missing / requests fail

Check `.env` exists with `EXPO_PUBLIC_GEMINI_API_KEY`, then restart with `npx expo start -c`.

### `stream-buffers` / `streambuffer.js` missing during install

`package.json` already pins it through `overrides`. Delete `node_modules` and `package-lock.json`, then run `npm install`.

---

# 📄 License

This project is for educational purposes.
