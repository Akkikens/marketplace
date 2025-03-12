import { db } from "./firebaseConfig"; // Firebase Firestore instance
import { collection, addDoc, query, getDocs } from "firebase/firestore";

const savePost = async (topic, post) => {
  try {
    const docRef = await addDoc(collection(db, `topics/${topic}/posts`), post);
    console.log("Post written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const fetchPosts = async (topic) => {
  const q = query(collection(db, `topics/${topic}/posts`));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
