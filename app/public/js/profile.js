let currentStatsMode = 'light';
let selectedAvatar = null;
let unlockedAvatars = [];

document.addEventListener('DOMContentLoaded', function() {
    loadStats('light');
    loadUserStats();
    preloadAvatars();
});

function preloadAvatars() {
    for (let i = 1; i <= 63; i++) {
        const img = new Image();
        img.src = '/images/avatars/avatar_' + i + '.png';
    }
}

function loadUserStats() {
    fetch('/api/user/stats')
        .then(response => response.json())
        .then(data => {
            const scoreEl = document.getElementById('profileScore');
            const streakEl = document.getElementById('profileStreak');
            const headerScore = document.getElementById('headerScore');
            const headerStreak = document.getElementById('headerStreak');
            
            if (scoreEl) scoreEl.textContent = data.score || 0;
            if (streakEl) streakEl.textContent = data.streak || 0;
            if (headerScore) headerScore.textContent = data.score || 0;
            if (headerStreak) headerStreak.textContent = data.streak || 0;
        })
        .catch(err => console.error('Ошибка загрузки статистики пользователя:', err));
}

function loadStats(mode) {
    currentStatsMode = mode;
    fetch('/profile/stats')
        .then(response => response.json())
        .then(data => {
            const voice = mode === 'light' ? data.voiceLight : data.voiceHard;
            const hearing = mode === 'light' ? data.hearingLight : data.hearingHard;
            updateStatCircle('voiceCircle', 'voiceValue', voice);
            updateStatCircle('hearingCircle', 'hearingValue', hearing);
        })
        .catch(err => console.error('Ошибка загрузки статистики:', err));
}

function switchStatsMode(mode) {
    document.querySelectorAll('.stats-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });
    loadStats(mode);
}

function updateStatCircle(circleId, valueId, percent) {
    const circle = document.getElementById(circleId);
    const value = document.getElementById(valueId);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    percent = Math.min(100, Math.max(0, percent || 0));

    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;

    value.textContent = Math.round(percent) + '%';
}

function openEditProfile() {
    document.getElementById('editProfileModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeEditProfile() {
    document.getElementById('editProfileModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openAvatarEditor() {
    document.getElementById('avatarEditorModal').style.display = 'flex';
    loadAvatars();
}

function closeAvatarEditor() {
    document.getElementById('avatarEditorModal').style.display = 'none';
}

function saveAvatar() {
    if (!selectedAvatar) {
        showToast('Выберите аватар', 'error');
        return;
    }
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    fetch('/profile/update', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken  
        },
        body: JSON.stringify({ 
            avatar: selectedAvatar,
            _csrf_token: csrfToken  
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Аватар обновлён!', 'success');
            updateAllAvatars(selectedAvatar);
            closeAvatarEditor();
        } else {
            showToast(data.error || 'Ошибка', 'error');
        }
    })
    .catch(() => showToast('Ошибка сервера', 'error'));
}

function updateAllAvatars(avatarName) {
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) profileAvatar.src = '/images/avatars/' + avatarName;
    
    const editAvatar = document.getElementById('editAvatar');
    if (editAvatar) editAvatar.src = '/images/avatars/' + avatarName;
    
    const headerAvatar = document.querySelector('.user-avatar');
    if (headerAvatar) headerAvatar.src = '/images/avatars/' + avatarName;
}

function openUsernameEditor() {
    document.getElementById('usernameEditorModal').style.display = 'flex';
    document.getElementById('editUsername').value = document.getElementById('displayUsername').textContent;
    document.getElementById('editUsernameStatus').innerHTML = '';
    document.getElementById('editUsernameStatus').className = 'input-status';
}

function closeUsernameEditor() {
    document.getElementById('usernameEditorModal').style.display = 'none';
}

function saveUsername() {
    const username = document.getElementById('editUsername').value.trim();
    const status = document.getElementById('editUsernameStatus');

    if (!username) {
        status.innerHTML = 'Введите логин';
        status.className = 'input-status error';
        return;
    }

    if (!/^[A-Za-z0-9]+$/.test(username)) {
        status.innerHTML = 'Только латиница и цифры';
        status.className = 'input-status error';
        return;
    }

    status.innerHTML = 'Проверка...';
    status.className = 'input-status loading';

    fetch('/check-username?username=' + encodeURIComponent(username))
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                status.innerHTML = 'Логин занят';
                status.className = 'input-status error';
                return;
            }
            
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            fetch('/profile/update', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ 
                    username: username,
                    _csrf_token: csrfToken  
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    status.innerHTML = 'Логин обновлён!';
                    status.className = 'input-status success';
                    
                    document.getElementById('displayUsername').textContent = username;
                    const atSymbol = document.querySelector('.profile-name .at-symbol');
                    if (atSymbol && atSymbol.nextSibling) {
                        atSymbol.nextSibling.textContent = ' ' + username;
                    }
                    document.querySelector('.user-info .username').textContent = username;
                    
                    setTimeout(() => closeUsernameEditor(), 500);
                } else {
                    status.innerHTML = data.error || 'Ошибка';
                    status.className = 'input-status error';
                }
            })
            .catch(() => {
                status.innerHTML = 'Ошибка сервера при сохранении';
                status.className = 'input-status error';
            });
        })
        .catch(() => {
            status.innerHTML = 'Ошибка проверки логина';
            status.className = 'input-status error';
        });
}

function openPasswordEditor() {
    document.getElementById('passwordEditorModal').style.display = 'flex';
    document.getElementById('editOldPassword').value = '';
    document.getElementById('editNewPassword').value = '';
    document.getElementById('editConfirmPassword').value = '';
    document.getElementById('editPasswordStatus').innerHTML = '';
    document.getElementById('editPasswordStatus').className = 'input-status';
}

function closePasswordEditor() {
    document.getElementById('passwordEditorModal').style.display = 'none';
}

function savePassword() {
    const oldPassword = document.getElementById('editOldPassword').value;
    const newPassword = document.getElementById('editNewPassword').value;
    const confirmPassword = document.getElementById('editConfirmPassword').value;
    const status = document.getElementById('editPasswordStatus');

    if (!oldPassword || !newPassword || !confirmPassword) {
        status.innerHTML = 'Заполните все поля';
        status.className = 'input-status error';
        return;
    }

    if (newPassword.length < 6) {
        status.innerHTML = 'Пароль минимум 6 символов';
        status.className = 'input-status error';
        return;
    }

    if (newPassword !== confirmPassword) {
        status.innerHTML = 'Пароли не совпадают';
        status.className = 'input-status error';
        return;
    }

    status.innerHTML = 'Проверка...';
    status.className = 'input-status loading';

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    fetch('/profile/change-password', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken  
        },
        body: JSON.stringify({ 
            oldPassword, 
            newPassword, 
            confirmPassword,
            _csrf_token: csrfToken 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            status.innerHTML = 'Пароль изменён!';
            status.className = 'input-status success';
            setTimeout(() => closePasswordEditor(), 500);
        } else {
            status.innerHTML = data.error || 'Ошибка';
            status.className = 'input-status error';
        }
    })
    .catch(() => {
        status.innerHTML = 'Ошибка сервера';
        status.className = 'input-status error';
    });
}

function bindEmail() {
    window.location.href = '/google/login';
}

function loadAvatars() {
    fetch('/profile/avatars')
        .then(response => response.json())
        .then(data => {
            unlockedAvatars = data.unlocked || [];
            const currentAvatar = data.current;
            const grid = document.getElementById('avatarSelector');
            grid.innerHTML = '';
            
            unlockedAvatars.sort((a, b) => a - b);
            
            unlockedAvatars.forEach(id => {
                const avatarName = 'avatar_' + id + '.png';
                const img = document.createElement('img');
                img.loading = 'lazy';
                img.src = '/images/avatars/' + avatarName;
                img.className = 'avatar-option';
                img.dataset.avatar = avatarName;
                img.dataset.id = id;
                if (avatarName === currentAvatar) {
                    img.classList.add('selected');
                }
                img.onclick = function() { selectAvatar(this); };
                grid.appendChild(img);
            });
            
            if (currentAvatar) {
                selectedAvatar = currentAvatar;
                document.getElementById('editAvatar').src = '/images/avatars/' + currentAvatar;
            }
        })
        .catch(err => console.error('Ошибка загрузки аватаров:', err));
}

function selectAvatar(el) {
    document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
    selectedAvatar = el.dataset.avatar;
    document.getElementById('editAvatar').src = '/images/avatars/' + selectedAvatar;
}

function unlockRandomAvatar() {
    const status = document.getElementById('avatarUnlockStatus');
    status.innerHTML = 'Проверка...';
    status.className = 'input-status loading';

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    fetch('/profile/unlock-avatar', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken  
        },
        body: JSON.stringify({ 
            _csrf_token: csrfToken  
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            status.innerHTML = data.message;
            status.className = 'input-status success';
            
            const scoreEl = document.getElementById('profileScore');
            const headerScore = document.getElementById('headerScore');
            if (scoreEl) scoreEl.textContent = data.newScore || 0;
            if (headerScore) headerScore.textContent = data.newScore || 0;
            
            loadAvatars();
            updateAllAvatars(data.avatar);
            selectedAvatar = data.avatar;
        } else {
            status.innerHTML = data.error;
            status.className = 'input-status error';
        }
    })
    .catch(() => {
        status.innerHTML = 'Ошибка сервера';
        status.className = 'input-status error';
    });
}

function confirmLogout() {
    document.getElementById('confirmLogoutModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeConfirmLogout() {
    document.getElementById('confirmLogoutModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function logoutUser() {
    window.location.href = '/logout';
}

function confirmDelete() {
    document.getElementById('confirmDeleteModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeConfirmDelete() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function deleteAccount() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    fetch('/profile/delete', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken  
        },
        body: JSON.stringify({ 
            confirm: true,
            _csrf_token: csrfToken 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/training';
        }
    })
    .catch(err => console.error('Ошибка удаления:', err));
}

function showToast(message, type) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification ' + type;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 14px 32px;
        border-radius: 14px;
        font-weight: 600;
        font-size: 16px;
        z-index: 99999;
        background: ${type === 'success' ? '#00c853' : '#ff1744'};
        color: white;
        box-shadow: 0 4px 25px rgba(0,0,0,0.2);
        animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEditProfile();
        closeAvatarEditor();
        closeUsernameEditor();
        closePasswordEditor();
        closeConfirmDelete();
        closeConfirmLogout();
    }
});