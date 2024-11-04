import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD16k-BCZ5vme3uokyoDQvJTsNh0U0RXHk",
  authDomain: "clark-marketplace.firebaseapp.com",
  projectId: "clark-marketplace",
  storageBucket: "clark-marketplace.appspot.com",
  messagingSenderId: "32698717777",
  appId: "1:32698717777:web:7b989d17e69ae917eeca70",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP); // Exported as FIRESTORE_DB
