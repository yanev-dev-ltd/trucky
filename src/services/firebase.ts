// import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { FirebaseOptions, getApp, initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.TRUCKY_API_KEY,
  authDomain: process.env.TRUCKY_AUTH_DOMAIN,
  databaseURL: process.env.TRUCKY_DATABASE_URL,
  projectId: process.env.TRUCKY_PROJECT_ID,
  storageBucket: process.env.TRUCKY_STORAGE_BUCKET,
  messagingSenderId: process.env.TRUCKY_MESSAGING_SENDER_ID,
  appId: process.env.TRUCKY_APP_ID,
  measurementId: process.env.TRUCKY_MEASUREMENT_ID,
};

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

const app = createFirebaseApp(firebaseConfig)

export const db = getDatabase(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
