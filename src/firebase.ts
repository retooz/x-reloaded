import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDznN7teVZkdXsnk4Cw9iadYLJNemnhk8Q",
  authDomain: "x-reloaded-b2f60.firebaseapp.com",
  projectId: "x-reloaded-b2f60",
  storageBucket: "x-reloaded-b2f60.appspot.com",
  messagingSenderId: "282139525968",
  appId: "1:282139525968:web:8c397e2624c194a3db6255"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);