import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDbmMTFoxda9SbDF7Te5z3OOlLdricL9Fc",
  authDomain: "eventorganizerapp-de42b.firebaseapp.com",
  projectId: "eventorganizerapp-de42b",
  storageBucket: "eventorganizerapp-de42b.appspot.com",
  messagingSenderId: "24187199885",
  appId: "1:24187199885:web:079e5ab0241477fb859dc4",
  measurementId: "G-QX9GT0V9CC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const firestore = getFirestore(app);

export { auth, firestore };