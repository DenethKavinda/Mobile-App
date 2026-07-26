<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6C63FF,100:00C9A7&height=220&section=header&text=Mobile%20App&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Built%20with%20Expo%20%2B%20React%20Native%20%2B%20Firebase&descAlignY=55&descSize=18" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=800&color=6C63FF&center=true&vCenter=true&width=600&lines=Cross-platform+mobile+app+%F0%9F%93%B1;Built+with+Expo+%26+React+Native+%E2%9A%9B%EF%B8%8F;Powered+by+Firebase+%F0%9F%94%A5;File-based+routing+with+Expo+Router+%F0%9F%A7%AD" alt="Typing SVG" />

<br/>

<a href="https://expo.dev"><img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" /></a>
<a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /></a>
<a href="https://firebase.google.com"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" /></a>
<a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /></a>

<br/><br/>

![GitHub repo size](https://img.shields.io/github/repo-size/DenethKavinda/Mobile-App?style=flat-square&color=6C63FF)
![GitHub last commit](https://img.shields.io/github/last-commit/DenethKavinda/Mobile-App?style=flat-square&color=00C9A7)
![GitHub stars](https://img.shields.io/github/stars/DenethKavinda/Mobile-App?style=flat-square&color=yellow)
![GitHub license](https://img.shields.io/github/license/DenethKavinda/Mobile-App?style=flat-square&color=blue)

</div>

<br/>

## 📖 About

Welcome to **Mobile App** 👋 — a cross-platform mobile application built with [Expo](https://expo.dev), [React Native](https://reactnative.dev), and [Firebase](https://firebase.google.com) for authentication, database, and backend services. This project uses **file-based routing** via [Expo Router](https://docs.expo.dev/router/introduction), so you can start developing right inside the `app` directory.

<br/>

## 🧰 Tech Stack

<div align="center">
<img src="https://skillicons.dev/icons?i=react,firebase,typescript,nodejs,npm,vscode&theme=dark" />
</div>

<br/>

| Layer | Technology |
|---|---|
| 🎨 Frontend | React Native, Expo, Expo Router |
| 🔥 Backend / Services | Firebase (Auth, Firestore, Storage) |
| 🧪 Language | TypeScript / JavaScript |
| 📦 Package Manager | npm |
| 🛠️ Tooling | Expo CLI, Metro Bundler |

<br/>

## ✨ Features

- 📱 Cross-platform — runs on **Android**, **iOS**, and **Web**
- 🔐 Firebase Authentication (Email/Password, Google, etc.)
- ☁️ Real-time data with Firestore
- 🖼️ Media storage via Firebase Storage
- 🧭 File-based navigation with Expo Router
- 🌙 Clean, extensible project structure
- ⚡ Fast refresh & hot reload during development

<br/>

## 🎬 Preview

<div align="center">
<img src="https://user-images.githubusercontent.com/placeholder/demo.gif" width="280" alt="App demo preview - replace with your own screen recording" />

<sub>👆 Replace this with a real screen recording or GIF of your app in action</sub>
</div>

<br/>

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/DenethKavinda/Mobile-App.git
cd Mobile-App
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure Firebase

Create a `firebaseConfig.ts` (or `.js`) file in your project root or `config` folder:

```ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
```

> 🔒 Add `firebaseConfig.ts` to your `.gitignore` if it contains real keys, or use environment variables via `expo-constants` / `.env` + `app.config.js`.

### 4️⃣ Start the app

```bash
npx expo start
```

In the output, you'll find options to open the app in a:

- 🏗️ [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- 🤖 [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- 🍏 [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- 📦 [Expo Go](https://expo.dev/go) — a limited sandbox for trying out app development with Expo

<br/>

## 📁 Project Structure

```
Mobile-App/
├── app/                # File-based routes (screens & layouts)
├── app-example/        # Starter code (after running reset-project)
├── assets/             # Images, fonts, icons
├── components/         # Reusable UI components
├── config/             # Firebase & app configuration
├── constants/          # Theme, colors, constants
├── hooks/              # Custom React hooks
├── package.json
└── README.md
```

<br/>

## 🔄 Get a Fresh Project

When you're ready to start from scratch:

```bash
npm run reset-project
```

This moves the starter code into `app-example` and creates a blank `app` directory for your own development.

<br/>

## 📚 Learn More

<div align="center">

[![Expo Docs](https://img.shields.io/badge/Expo_Docs-000020?style=for-the-badge&logo=expo&logoColor=white)](https://docs.expo.dev/)
[![Expo Tutorial](https://img.shields.io/badge/Learn_Expo_Tutorial-4630EB?style=for-the-badge&logo=expo&logoColor=white)](https://docs.expo.dev/tutorial/introduction/)
[![Firebase Docs](https://img.shields.io/badge/Firebase_Docs-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/docs)

</div>

<br/>

## 🌍 Join the Community

<div align="center">

[![Expo GitHub](https://img.shields.io/badge/Expo_on_GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/expo/expo)
[![Discord](https://img.shields.io/badge/Join_Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://chat.expo.dev)

</div>

<br/>

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br/>

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<br/>

<div align="center">

### 👨‍💻 Author

**Deneth Kavinda**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DenethKavinda)

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C9A7,100:6C63FF&height=120&section=footer" width="100%"/>

</div>
