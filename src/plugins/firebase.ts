import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
// ... other firebase imports

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyBionvbltmBYBeyhTq1Muhh9MX2UpDF0uM",
  authDomain: "school-nutrition-by-lrs.firebaseapp.com",
  projectId: "school-nutrition-by-lrs",
  storageBucket: "school-nutrition-by-lrs.appspot.com",
  messagingSenderId: "295693533837",
  appId: "1:295693533837:web:40bdff6710e8f1d95758c4"
})

// used for the firestore refs
export const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const alumnosRef = collection(db, 'alumnos')
