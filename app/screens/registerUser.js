import { auth, db } from "./firebaseConfig"; // Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const registerUser = async (email, password, name, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      registeredAt: new Date().toISOString(),
    });

    console.log("User registered:", user.uid);
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

// Fetch user data
const getUser = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data() : null;
};
