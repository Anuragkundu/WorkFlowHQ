import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDtKJgKMrEAh89O82mRox7rJOSXO8O2RtA",
    authDomain: "workflowhq.firebaseapp.com",
    projectId: "workflowhq",
    storageBucket: "workflowhq.firebasestorage.app",
    messagingSenderId: "1084253295476",
    appId: "1:1084253295476:web:83ed7d2fa5727a23a4d221",
    measurementId: "G-CN03YZT65S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
