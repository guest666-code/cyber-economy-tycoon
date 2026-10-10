import { auth, googleProvider } from "./config.js";
import { 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const authModal = document.getElementById('auth-modal');
const authActionBtn = document.getElementById('auth-action-btn');
const closeModalBtn = document.getElementById('close-modal');
const userDisplayName = document.getElementById('user-display-name');

const googleLoginBtn = document.getElementById('google-login-btn');
const emailAuthForm = document.getElementById('email-auth-form');
const modalTitle = document.getElementById('modal-title');
const nameGroup = document.getElementById('name-group');
const submitAuthBtn = document.getElementById('submit-auth-btn');
const toggleAuthBtn = document.getElementById('toggle-auth-btn');
const toggleText = document.getElementById('toggle-text');

let isSignUpMode = false;

export function initAuth() {
    authActionBtn.addEventListener('click', () => {
        if (auth.currentUser) {
            signOut(auth);
        } else {
            authModal.classList.remove('hidden');
        }
    });

    closeModalBtn.addEventListener('click', () => authModal.classList.add('hidden'));

    toggleAuthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isSignUpMode = !isSignUpMode;
        if (isSignUpMode) {
            modalTitle.innerText = "KAYIT OL";
            submitAuthBtn.innerText = "Kayıt Ol";
            nameGroup.style.display = "flex";
            toggleText.innerText = "Zaten hesabın var mı?";
            toggleAuthBtn.innerText = "Giriş Yap";
        } else {
            modalTitle.innerText = "GİRİŞ YAP";
            submitAuthBtn.innerText = "Giriş Yap";
            nameGroup.style.display = "none";
            toggleText.innerText = "Hesabın yok mu?";
            toggleAuthBtn.innerText = "Kayıt Ol";
        }
    });

    googleLoginBtn.addEventListener('click', () => {
        signInWithPopup(auth, googleProvider)
            .then(() => authModal.classList.add('hidden'))
            .catch(err => alert("Google Giriş Hatası: " + err.message));
    });

    emailAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const name = document.getElementById('auth-name').value;

        if (isSignUpMode) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCred) => {
                    updateProfile(userCred.user, { displayName: name || email.split('@')[0] });
                    authModal.classList.add('hidden');
                })
                .catch(err => alert("Kayıt Hatası: " + err.message));
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => authModal.classList.add('hidden'))
                .catch(err => alert("Giriş Hatası: " + err.message));
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            userDisplayName.innerText = user.displayName || user.email.split('@')[0];
            authActionBtn.innerText = "Çıkış Yap";
        } else {
            userDisplayName.innerText = "Misafir";
            authActionBtn.innerText = "Giriş Yap";
        }
    });
}
