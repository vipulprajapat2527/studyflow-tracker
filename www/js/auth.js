import { signup, login, logout } from "./firebase.js";

function manageAuthScreen() {
    const authScreen = document.getElementById('authScreen');
    const isLogged = localStorage.getItem('userLoggedIn') === 'true';

    if (authScreen) {
        if (isLogged) {
            authScreen.style.setProperty('display', 'none', 'important');
        } else {
            authScreen.style.setProperty('display', 'flex', 'important');
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', manageAuthScreen);
} else {
    manageAuthScreen();
}

// Baki buttons ko bina disturb kiye sirf auth buttons ko handle karne wala listener
document.addEventListener('click', async (e) => {
    if (!e.target) return;

    // 1. Sign Up Click Handler
    if (e.target.id === 'signupBtn' || e.target.id === 'newSignupBtn') {
        e.preventDefault();
        const email = document.getElementById("loginEmail")?.value;
        const password = document.getElementById("loginPassword")?.value;
        
        if (!email || !password) {
            alert("Please fill all fields!");
            return;
        }
        try {
            await signup(email, password);
            alert("Signup Successful!");
            localStorage.setItem('userLoggedIn', 'true');
            location.reload();
        } catch (error) {
            alert("Signup Error: " + error.message);
        }
    }

    // 2. Login Click Handler
    if (e.target.id === 'loginBtn' || e.target.id === 'newLoginBtn') {
        e.preventDefault();
        const email = document.getElementById("loginEmail")?.value;
        const password = document.getElementById("loginPassword")?.value;
        
        if (!email || !password) {
            alert("Please fill all fields!");
            return;
        }
        try {
            await login(email, password);
            alert("Login Successful!");
            localStorage.setItem('userLoggedIn', 'true');
            location.reload();
        } catch (error) {
            alert("Login Error: " + error.message);
        }
    }
});