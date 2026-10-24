import { getApp, getApps, initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDPLdyjwjHyv591WyMn4O4ChWiDMStEM3I',
  authDomain: 'bhargav-5435a.firebaseapp.com',
  databaseURL: 'https://bhargav-5435a-default-rtdb.firebaseio.com',
  projectId: 'bhargav-5435a',
  storageBucket: 'bhargav-5435a.firebasestorage.app',
  messagingSenderId: '976472421100',
  appId: '1:976472421100:web:fd86c854a1151d6a0c2bc9',
  measurementId: 'G-T8GESBDJX2',
}

export function getFirebaseApp() {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || firebaseConfig.databaseURL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
    messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId,
  }
  const missingKeys = ['apiKey', 'databaseURL', 'projectId', 'appId'].filter(
    (key) => !config[key]
  )

  if (missingKeys.length > 0) {
    throw new Error(
      'Firebase is not configured. Add the Firebase settings to your .env file and restart the app.'
    )
  }

  return getApps().length > 0 ? getApp() : initializeApp(config)
}

export function getFirebaseDatabase() {
  return getDatabase(getFirebaseApp())
}
