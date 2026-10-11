import { auth, googleProvider } from "./config.js";
import { 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    deleteUser
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { playSound, loadGameFromCloud } from "./game.js";

export function initAuth() {
    const authModal = document.getElementById('auth-modal');
    const authActionBtn = document.getElementById('auth-action-btn');
    const userDisplayName = document.getElementById('user-display-name');

    const googleLoginBtn = document.getElementById('google-login-btn');
    const emailAuthForm = document.getElementById('email-auth-form');
    const modalTitle = document.getElementById('modal-title');
    const nameGroup = document.getElementById('name-group');
    const submitAuthBtn = document.getElementById('submit-auth-btn');
    const toggleAuthBtn = document.getElementById('toggle-auth-btn');
    const toggleText = document.getElementById('toggle-text');
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    let isSignUpMode = false;

    authActionBtn.addEventListener('click', () => {
        playSound('click');
        if (auth.currentUser) {
            signOut(auth).then(() => location.reload());
        } else {
            authModal.classList.remove('hidden');
        }
    });

    toggleAuthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('click');
        isSignUpMode = !isSignUpMode;
        if (isSignUpMode) {
            modalTitle.innerText = "KAYIT OL";
            submitAuthBtn.innerText = "Kayıt Ol";
            nameGroup.style.display = "flex";
            toggleText.innerText = "Zaten hesabın var mı?";
            toggleAuthBtn.innerText = "Giriş Yap";
            if (forgotPasswordLink) forgotPasswordLink.style.display = "none";
        } else {
            modalTitle.innerText = "GİRİŞ YAP (Zorunlu)";
            submitAuthBtn.innerText = "Giriş Yap";
            nameGroup.style.display = "none";
            toggleText.innerText = "Hesabın yok mu?";
            toggleAuthBtn.innerText = "Kayıt Ol";
            if (forgotPasswordLink) forgotPasswordLink.style.display = "inline-block";
        }
    });

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            playSound('click');
            const email = document.getElementById('auth-email').value;
            if (!email) {
                alert("Lütfen önce E-Posta kutucuğuna mail adresinizi yazın!");
                return;
            }
            sendPasswordResetEmail(auth, email)
                .then(() => alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!"))
                .catch(err => alert("Hata: " + err.message));
        });
    }

    googleLoginBtn.addEventListener('click', () => {
        playSound('click');
        signInWithPopup(auth, googleProvider)
            .then(() => {
                authModal.classList.add('hidden');
                loadGameFromCloud();
            })
            .catch(err => alert("Google Giriş Hatası: " + err.message));
    });

    emailAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        playSound('click');
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const name = document.getElementById('auth-name').value;

        if (isSignUpMode) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCred) => {
                    updateProfile(userCred.user, { displayName: name || email.split('@')[0] });
                    authModal.classList.add('hidden');
                    loadGameFromCloud();
                })
                .catch(err => alert("Kayıt Hatası: " + err.message));
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    authModal.classList.add('hidden');
                    loadGameFromCloud();
                })
                .catch(err => alert("Giriş Hatası: " + err.message));
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            userDisplayName.innerText = user.displayName || user.email.split('@')[0];
            authActionBtn.innerText = "Çıkış Yap";
            authModal.classList.add('hidden');
            loadGameFromCloud();
        } else {
            userDisplayName.innerText = "Giriş Yapılmadı";
            authActionBtn.innerText = "Giriş Yap";
            authModal.classList.remove('hidden');
        }
    });

    const changeEmailBtn = document.getElementById('change-email-btn');
    if (changeEmailBtn) {
        changeEmailBtn.addEventListener('click', () => {
            const newEmail = prompt("Yeni e-posta adresinizi girin:");
            if (newEmail && auth.currentUser) {
                updateEmail(auth.currentUser, newEmail)
                    .then(() => alert("E-posta adresiniz güncellendi!"))
                    .catch(e => alert("Hata: " + e.message));
            }
        });
    }

    const changePassBtn = document.getElementById('change-pass-btn');
    if (changePassBtn) {
        changePassBtn.addEventListener('click', () => {
            const newPass = prompt("Yeni şifrenizi girin:");
            if (newPass && auth.currentUser) {
                updatePassword(auth.currentUser, newPass)
                    .then(() => alert("Şifreniz güncellendi!"))
                    .catch(e => alert("Hata: " + e.message));
            }
        });
    }

    const deleteAccBtn = document.getElementById('delete-acc-btn');
    if (deleteAccBtn) {
        deleteAccBtn.addEventListener('click', () => {
            if (confirm("Hesabınızı kalıcı olarak silmek istediğinize emin misiniz?") && auth.currentUser) {
                deleteUser(auth.currentUser)
                    .then(() => alert("Hesabınız silindi."))
                    .catch(e => alert("Hata: " + e.message));
            }
        });
    }
}
