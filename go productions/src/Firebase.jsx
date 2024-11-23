import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAP5PHGZzfwWmpokGKo3CZOJVLo-r0w4Zg',
  authDomain: 'go-productions.firebaseapp.com',
  databaseURL: 'https://go-productions-default-rtdb.firebaseio.com',
  projectId: 'go-productions',
  storageBucket: 'go-productions.firebasestorage.app',
  messagingSenderId: '518642601161',
  appId: '1:518642601161:web:8bae0f4dcd0f5ec76dd118',
  measurementId: 'G-WV6RVR1TZV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, getDocs, doc, getDoc };
