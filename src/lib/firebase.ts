import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

let app;
let auth: any;
let db: any;
let storage: any;

try {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error("firebase-applet-config.json is missing or invalid.");
  }
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  storage = getStorage(app);
} catch (e) {
  console.error("Firebase Initialization Error:", e);
  // Throwing here will be caught by the window.onerror we added to index.html
  throw e;
}

export { auth, db, storage };

// Connection test as per instructions
async function testConnection() {
  try {
    // We expect this to fail with permission-denied if we're not logged in,
    // which still proves the configuration is correct and the server is reachable.
    await getDocFromServer(doc(db, 'system', 'connection_check'));
  } catch (error: any) {
    const errorMessage = error?.message || '';
    const isPermissionError = errorMessage.includes('permission-denied') || 
                             errorMessage.includes('insufficient permissions');
    
    if (isPermissionError) {
      console.log("Firebase connection verified (Server responded correctly).");
    } else if (errorMessage.includes('offline')) {
      console.error("Firebase is offline. Check your network or configuration.");
    } else {
      console.error("Firebase connection test failed:", error);
    }
  }
}
testConnection();
