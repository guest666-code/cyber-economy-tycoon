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
import { playSound } from "./game.js";

export function initAuth() {
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
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    let isSignUpMode = false;

    // Modal Aç / Kapat & Çıkış Yap
    authActionBtn.addEventListener('click', () => {
        playSound('click');
        if (auth.currentUser) {
            signOut(auth)
                .then(() => alert("Çıkış yapıldı."))
                .catch(err => alert("Çıkış hatası: " + err.message));
        } else {
            authModal.classList.remove('hidden');
        }
    });

    closeModalBtn.addEventListener('click', () => {
        playSound('click');
        authModal.classList.add('hidden');
    });

    // Giriş / Kayıt Modu Geçişi
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
            modalTitle.innerText = "GİRİŞ YAP";
            submitAuthBtn.innerText = "Giriş Yap";
            nameGroup.style.display = "none";
            toggleText.innerText = "Hesabın yok mu?";
            toggleAuthBtn.innerText = "Kayıt Ol";
            if (forgotPasswordLink) forgotPasswordLink.style.display = "inline-block";
        }
    });

    // Şifremi Unuttum (Forgot Password)
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

    // Google ile Hızlı Giriş
    googleLoginBtn.addEventListener('click', () => {
        playSound('click');
        signInWithPopup(auth, googleProvider)
            .then(() => {
                authModal.classList.add('hidden');
                playSound('buy');
            })
            .catch(err => alert("Google Giriş Hatası: " + err.message));
    });

    // Form Gönderimi (E-Posta & Şifre)
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
                    playSound('buy');
                })
                .catch(err => alert("Kayıt Hatası: " + err.message));
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    authModal.classList.add('hidden');
                    playSound('buy');
                })
                .catch(err => alert("Giriş Hatası: " + err.message));
        }
    });

    // Kullanıcı Oturum Takibi
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

// --- HESAP YÖNETİMİ YARDIMCI FONKSİYONLARI ---

// E-Posta Değiştirme
export function changeUserEmail(newEmail) {
    if (auth.currentUser) {
        updateEmail(auth.currentUser, newEmail)
            .then(() => alert("E-posta adresi başarıyla güncellendi!"))
            .catch(err => alert("E-posta Güncelleme Hatası: " + err.message));
    }
}

// Şifre Değiştirme
export function changeUserPassword(newPassword) {
    if (auth.currentUser) {
        updatePassword(auth.currentUser, newPassword)
            .then(() => alert("Şifre başarıyla güncellendi!"))
            .catch(err => alert("Şifre Güncelleme Hatası: " + err.message));
    }
}

// Hesabı Silme
export function deleteUserAccount() {
    if (auth.currentUser) {
        if (confirm("Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
            deleteUser(auth.currentUser)
                .then(() => alert("Hesabınız silindi."))
                .catch(err => alert("Hesap Silme Hatası: " + err.message));
        }
    }
}
