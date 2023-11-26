import { getAuth, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import doc, setDoc, and getDoc from Firestore
import { app, firestore } from "../firebase"; // Make sure to import 'firestore' from your Firebase configuration

import { generateRandomPassword } from './Utility';

const auth = getAuth(app);

// Helper function to fetch user role from Firestore
const fetchUserRole = async (userId) => {
  try {
    const userDocRef = doc(firestore, 'users', userId); // Reference to the user document
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data().role : null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};

const AuthService = {
  // Function to sign in a user with email and password
  signInWithEmailAndPassword: (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const role = await fetchUserRole(userCredential.user.uid);
        return { ...userCredential.user, role };
      })
      .catch((error) => {
        console.error('Error signing in with email and password:', error);
        throw error;
      });
  },

  // Function to sign out the user
  signOut: () => {
    return signOut(auth)
      .catch((error) => {
        console.error('Error signing out:', error);
        throw error;
      });
  },

  // Function to sign in a user with Google
  signInWithGoogle: () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then(async (result) => {
        const role = await fetchUserRole(result.user.uid);
        return { ...result.user, role };
      })
      .catch((error) => {
        console.error('Error signing in with Google:', error);
        throw error;
      });
  },

  // Function to register a new user with email and password
  registerWithEmailAndPassword: async (email, password, role) => {
    const randomPassword = generateRandomPassword();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, randomPassword);
      const newUser = userCredential.user;

      const userDocRef = doc(firestore, 'users', newUser.uid); // Reference to the user document
      await setDoc(userDocRef, { role }); // Set the user's role in Firestore

      const userRole = await fetchUserRole(newUser.uid);

      return { ...newUser, role: userRole };
    } catch (error) {
      console.error('Error registering the user:', error);
      throw error;
    }
  },

  // Function to get the current user
  getCurrentUser: () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          resolve(user);
        } else {
          // User is signed out
          resolve(null);
        }
      }, reject);
    });
  },
};

export default AuthService;
