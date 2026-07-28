function openAuth() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetModal();
}

function closeAuth() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (!loginForm || !registerForm) return;
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector('.modal-tab[data-tab="' + tab + '"]');
    if (activeTab) activeTab.classList.add('active');
    resetModal();
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

function showRegistrationSuccess(username) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelector('.modal-tabs');
    const divider = document.querySelector('.modal-divider');
    const googleBtn = document.querySelector('.modal-btn-google');
    const successDiv = document.getElementById('registrationSuccess');
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (tabs) tabs.style.display = 'none';
    if (divider) divider.style.display = 'none';
    if (googleBtn) googleBtn.style.display = 'none';
    if (successDiv) {
        document.getElementById('newUsername').textContent = username;
        successDiv.style.display = 'block';
        updateHeader(username, score, place, streak);
        setTimeout(function() {
            closeAuth();
        }, 2000);
    }
}

function skipGoogle() {
    closeAuth();
}

function updateHeader(username, score, place, streak) {
    const usernameSpan = document.querySelector('.user-info .username');
    if (usernameSpan) {
        usernameSpan.textContent = username;
    }
    const scoreSpan = document.getElementById('headerScore');
    if (scoreSpan) {
        scoreSpan.textContent = score || 0;
    }
    const placeSpan = document.getElementById('headerPlace');
    if (placeSpan) {
        placeSpan.textContent = place || 0;
    }
    const streakSpan = document.getElementById('headerStreak');
    if (streakSpan) {
        streakSpan.textContent = streak || 0;
    }
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.style.display = 'none';
    }
}

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const img = button.querySelector('img');
    if (!img) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        img.src = '/images/eye2-icon.png';
        img.alt = 'Скрыть пароль';
    } else {
        input.type = 'password';
        img.src = '/images/eye-icon.png';
        img.alt = 'Показать пароль';
    }
}

function closeAuthAndRefresh() {
    closeAuth();
    location.reload();
}

function showLoginSuccess() {
    const modal = document.getElementById('loginSuccessModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginSuccess() {
    const modal = document.getElementById('loginSuccessModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    location.reload();
}