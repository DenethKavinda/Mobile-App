import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
    Auth,
    getAuth,
    // @ts-ignore: getReactNativePersistence exists in RN bundle but missing from Web TS definitions
    getReactNativePersistence,
    initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 1. Config using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 2. Prevent re-initialization during hot-reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Initialize Auth with persistent storage
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // Fallback if already initialized during Expo hot-reloads
  auth = getAuth(app);
}

// 4. Initialize Database and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

