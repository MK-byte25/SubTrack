import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAneBOU4zwgNzkigtC3bNk8QLJG9fOGjsU",
  authDomain: "subtrack-7e4e7.firebaseapp.com",
  projectId: "subtrack-7e4e7",
  storageBucket: "subtrack-7e4e7.firebasestorage.app",
  messagingSenderId: "813611542261",
  appId: "1:813611542261:web:e363f7525cc5c3471387bc",
  measurementId: "G-J0E49SX3TL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
