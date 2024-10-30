// firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD16k-BCZ5vme3uokyoDQvJTsNh0U0RXHk",
  authDomain: "clark-marketplace.firebaseapp.com",
  projectId: "clark-marketplace",
  storageBucket: "clark-marketplace.appspot.com",
  messagingSenderId: "32698717777",
  appId: "1:32698717777:web:7b989d17e69ae917eeca70",
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
