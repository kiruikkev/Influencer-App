import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyBh-flMMtJ0rybNWtaaYwazT_CUePkVgYU",
  authDomain: "influencer-marketing-app-62c92.firebaseapp.com",
  projectId: "influencer-marketing-app-62c92",
  storageBucket: "influencer-marketing-app-62c92.appspot.com",
  messagingSenderId: "446684125939",
  appId: "1:446684125939:web:2512b124d3d3359fe8f586",
  measurementId: "G-GY8K1GGJ1H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { app, analytics, firestore,getAuth,firebaseConfig }; // Export the app and analytics, and firestore
