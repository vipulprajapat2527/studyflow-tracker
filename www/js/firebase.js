import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5GgOy9iay_fTJvCrLjVIexlZL9PWwkmo",
  authDomain: "studyflow-tracker-3c8a5.firebaseapp.com",
  projectId: "studyflow-tracker-3c8a5",
  storageBucket: "studyflow-tracker-3c8a5.firebasestorage.app",
  messagingSenderId: "183185955176",
  appId: "1:183185955176:web:4ffeb45fee2a7b79261edd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
window.auth = auth;

export async function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}
  