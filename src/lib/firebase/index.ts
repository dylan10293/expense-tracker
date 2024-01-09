// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBo925Fk-NZ_GExG4n-POF497_taP41XDA',
	authDomain: 'finance-tracker-baefe.firebaseapp.com',
	projectId: 'finance-tracker-baefe',
	storageBucket: 'finance-tracker-baefe.appspot.com',
	messagingSenderId: '38425703306',
	appId: '1:38425703306:web:08c614b565f40781d04e73',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
