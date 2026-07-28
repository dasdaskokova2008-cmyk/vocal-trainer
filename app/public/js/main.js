document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    const usernameInput = document.getElementById('register_username');
    const usernameStatus = document.getElementById('usernameStatus');
    if (usernameInput && usernameStatus) {
        let typingTimer;
        const doneTypingInterval = 100;
        usernameInput.addEventListener('input', function() {
            const username = this.value.trim();
            clearTimeout(typingTimer);
            if (username.length === 0) {
                usernameStatus.innerHTML = '💡 Можно пропустить - сгенерируется автоматически';
                usernameStatus.className = 'input-status info';
                return;
            }
            if (!/^[A-Za-z0-9]+$/.test(username)) {
                usernameStatus.innerHTML = '❌ Только латиница и цифры';
                usernameStatus.className = 'input-status error';
                return;
            }
            usernameStatus.innerHTML = '⏳ Проверка...';
            usernameStatus.className = 'input-status loading';
            typingTimer = setTimeout(() => {
                fetch('/check-username?username=' + encodeURIComponent(username))
                    .then(response => response.json())
                    .then(data => {
                        if (data.exists) {
                            usernameStatus.innerHTML = '❌ Логин занят';
                            usernameStatus.className = 'input-status error';
                        } else {
                            usernameStatus.innerHTML = '✅ Логин доступен';
                            usernameStatus.className = 'input-status success';
                        }
                    })
                    .catch(() => {
                        usernameStatus.innerHTML = '⚠️ Ошибка проверки';
                        usernameStatus.className = 'input-status error';
                    });
            }, doneTypingInterval);
        });
    }

    const passwordInput = document.getElementById('register_password');
    const passwordRepeatInput = document.getElementById('register_password_repeat');
    const passwordStatus = document.getElementById('passwordStatus');
    const passwordRepeatStatus = document.getElementById('passwordRepeatStatus');

    if (passwordInput && passwordStatus) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            if (password.length === 0) {
                passwordStatus.innerHTML = '';
                passwordStatus.className = 'input-status';
                return;
            }
            if (password.length < 6) {
                passwordStatus.innerHTML = '❌ Минимум 6 символов';
                passwordStatus.className = 'input-status error';
            } else {
                passwordStatus.innerHTML = '✅ Пароль подходит';
                passwordStatus.className = 'input-status success';
            }
            checkPasswordMatch();
        });
    }

    if (passwordRepeatInput && passwordRepeatStatus) {
        passwordRepeatInput.addEventListener('input', function() {
            checkPasswordMatch();
        });
    }

    function checkPasswordMatch() {
        if (!passwordInput || !passwordRepeatInput || !passwordRepeatStatus) return;
        
        const password = passwordInput.value;
        const passwordRepeat = passwordRepeatInput.value;
        
        if (passwordRepeat.length === 0) {
            passwordRepeatStatus.innerHTML = '';
            passwordRepeatStatus.className = 'input-status';
            return;
        }

        if (password === passwordRepeat && password.length >= 6) {
            passwordRepeatStatus.innerHTML = '✅ Пароли совпадают';
            passwordRepeatStatus.className = 'input-status success';
        } else if (password === passwordRepeat && password.length < 6) {
            passwordRepeatStatus.innerHTML = '❌ Пароль слишком короткий';
            passwordRepeatStatus.className = 'input-status error';
        } else {
            passwordRepeatStatus.innerHTML = '❌ Пароли не совпадают';
            passwordRepeatStatus.className = 'input-status error';
        }
    }
});

document.addEventListener('keydown', function(e) {if (e.key === 'Escape') {closeAuth();}});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Вход...';
    submitBtn.disabled = true;
    removeErrors('loginForm');
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Сервер вернул ошибку');
        }
        return response.json();
    })
    .then(data => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (data.success) {
            updateHeader(data.username, data.score, data.place, data.streak);
            closeAuth();
            setTimeout(() => location.reload(), 300);
        } else if (data.error) {
            showError('loginForm', data.error);
        }
    })
    .catch((error) => {
        console.error('Ошибка:', error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showError('loginForm', '❌ Ошибка сервера. Попробуйте позже.');
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLoginSuccess();
        closeAuth();
    }
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Регистрация...';
    submitBtn.disabled = true;
    removeErrors('registerForm');
    
    // 👇 ВЫБИРАЕМ РАНДОМНЫЙ АВАТАР ИЗ 63
    const randomAvatarId = Math.floor(Math.random() * 63) + 1;
    const avatarName = 'avatar_' + randomAvatarId + '.png';
    formData.append('avatar', avatarName);
    
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Сервер вернул ошибку');
        }
        return response.json();
    })
    .then(data => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (data.success) {
            updateHeader(data.username, data.score, data.place, data.streak);
            // 👇 ПЕРЕДАЁМ АВАТАР В МОДАЛКУ
            showRegistrationSuccess(data.username, data.score, data.place, data.streak, avatarName);
            setTimeout(() => location.reload(), 500);
        } else if (data.error) {
            showError('registerForm', data.error);
        }
    })
    .catch((error) => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showError('registerForm', '❌ Ошибка сервера');
    });
});