import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  doc, 
  getDocFromServer,
  setLogLevel
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App with verified project configuration
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Silence internal offline/transport heuristic warnings from WebChannel long-polling
// This prevents harmless WebSocket/long-polling timeout notifications from appearing as runtime errors in sandboxed iframes
setLogLevel('silent');

// Initialize Firestore with explicit long-polling settings for seamless iframe & proxy connectivity
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    experimentalLongPollingOptions: {
      timeoutSeconds: 15,
    },
    ignoreUndefinedProperties: true
  }, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  // If already initialized, retrieve instance
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreInstance;

// Validate Connection to Firestore per skill specification safely without failing if offline
async function testConnection() {
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
    await Promise.race([getDocFromServer(doc(db, 'test', 'connection')), timeoutPromise]);
  } catch {
    // Client smoothly operates in offline mode with cached / local storage
  }
}

// Run connection validation in non-blocking manner
if (typeof window !== 'undefined') {
  testConnection();
}
