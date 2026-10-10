import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDAhgAFVIUthvVojfLvZHx2acA7KEwOinM",
    authDomain: "cyber-economy-tycoon.firebaseapp.com",
    projectId: "cyber-economy-tycoon",
    storageBucket: "cyber-economy-tycoon.firebasestorage.app",
    messagingSenderId: "199466299849",
    appId: "1:199466299849:web:10e6c30aabdd7b5c88b818",
    measurementId: "G-LP825ER9LQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
