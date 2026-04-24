import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsKnhviL9UW-iFkk1z0LTj0UHKB1aUt4Q",
  authDomain: "simkita-a0429.firebaseapp.com",
  projectId: "simkita-a0429",
  storageBucket: "simkita-a0429.firebasestorage.app",
  messagingSenderId: "500307406343",
  appId: "1:500307406343:web:67b1c6d9278741fd19c4a2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Referensi dokumen utama SIMKITA di Firestore
export const SIMKITA_DOC = doc(db, "simkita", "data");

// Ambil data sekali (untuk load awal)
export async function loadData() {
  const snap = await getDoc(SIMKITA_DOC);
  return snap.exists() ? snap.data().payload : null;
}

// Simpan data ke Firestore
export async function saveData(data) {
  await setDoc(SIMKITA_DOC, { payload: data, updatedAt: new Date().toISOString() });
}

// Subscribe realtime — callback dipanggil setiap ada perubahan dari siapapun
export function subscribeData(callback) {
  return onSnapshot(SIMKITA_DOC, (snap) => {
    if (snap.exists()) callback(snap.data().payload);
  });
}
