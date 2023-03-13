import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: "AIzaSyDCgTC69M-lkV-tncEkuK-CLLxqGWOgPW4",
	authDomain: "calendar-1e267.firebaseapp.com",
	projectId: "calendar-1e267",
	storageBucket: "calendar-1e267.appspot.com",
	messagingSenderId: "903496679634",
	appId: "1:903496679634:web:79f814c5045c4c1a0e2d0b"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore()