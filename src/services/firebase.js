import { getApp, getApps, initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export function getFirebaseApp() {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
