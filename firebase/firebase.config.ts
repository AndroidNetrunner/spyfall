import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
  throw new Error("FIREBASE_CONFIG 환경 변수가 정의되지 않았습니다.");
}

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) as FirebaseConfig;

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const db = getFirestore(app);
export default db;
