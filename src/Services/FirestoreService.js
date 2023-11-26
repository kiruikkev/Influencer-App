import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
} from 'firebase/firestore';
import { firebaseConfig } from '../firebase'; // Adjust the path to your Firebase config

// Initialize Firebase App and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to generate a random password
const generateRandomPassword = () => {
  // Your password generation logic here
  // Example: Generate a random 8-character password
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Add a document to a Firestore collection
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id; // Returns the newly created document's ID
  } catch (error) {
    console.error('Error adding document:', error);
    return null;
  }
};

// Update a document in a Firestore collection
const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return true; // Successfully updated
  } catch (error) {
    console.error('Error updating document:', error);
    return false;
  }
};

// Delete a document from a Firestore collection
const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true; // Successfully deleted
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};

// Fetch all documents from a Firestore collection
const fetchAllDocuments = async (collectionName) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

// Fetch all users
const fetchAllUsers = async () => {
  return fetchAllDocuments('users');
};

// Fetch all campaigns
const fetchAllCampaigns = async () => {
  return fetchAllDocuments('campaigns');
};

// Fetch analytics data
const fetchAnalyticsData = async () => {
  try {
    const analyticsDoc = await getDocs(doc(db, 'analytics', 'main'));
    return analyticsDoc.exists() ? analyticsDoc.data() : {};
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {};
  }
};

// Export all functions
export { 
  addDocument, 
  updateDocument,
  deleteDocument, 
  fetchAllDocuments, 
  fetchAllUsers, 
  fetchAllCampaigns, 
  fetchAnalyticsData,
  generateRandomPassword, // Include the new function in the exports
};
