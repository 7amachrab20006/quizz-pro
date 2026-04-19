import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use the explicit database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Connection test as per instructions
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '__test__', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('permission-denied')) {
      console.log("Firebase connection established (permissions denied as expected).");
    } else {
      console.error("Firebase connection test failed:", error);
    }
  }
}
testConnection();
