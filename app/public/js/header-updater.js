// header-updater.js

function updateHeaderStats() {
    fetch('/api/user/stats')
        .then(response => {
            // Если 401 (не авторизован) — показываем кнопку "Войти"
            if (response.status === 401) {
                showLoggedOutState();
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                showLoggedInState(data);
            }
        })
        .catch(err => {
            console.error('❌ Ошибка обновления шапки:', err);
            // Если ошибка — показываем кнопку "Войти"
            showLoggedOutState();
        });
}

function showLoggedInState(data) {
    // Обновляем счёт
    document.querySelectorAll('#headerScore, #profileScore, #scoreText').forEach(el => {
        if (el) el.textContent = data.score;
    });
    
    // Обновляем стрик
    document.querySelectorAll('#headerStreak, #profileStreak, #streakText').forEach(el => {
        if (el) el.textContent = data.streak;
    });
    
    // Обновляем огонёк
    document.querySelectorAll('.streak-icon').forEach(el => {
        if (data.isActiveToday) {
            el.classList.add('active');
            el.classList.remove('inactive');
        } else {
            el.classList.remove('active');
            el.classList.add('inactive');
        }
    });
    
    // 👇 ПОКАЗЫВАЕМ ИМЯ ПОЛЬЗОВАТЕЛЯ И АВАТАР
    const usernameEl = document.querySelector('.username');
    if (usernameEl) usernameEl.textContent = data.username;
    
    // 👇 СКРЫВАЕМ КНОПКУ "ВОЙТИ", ПОКАЗЫВАЕМ АВАТАР
    const loginBtn = document.querySelector('.login-btn');
    const userInfo = document.querySelector('.user-info');
    const avatarLink = document.querySelector('.user-avatar-link');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    if (avatarLink) avatarLink.style.display = 'inline-block';
}

function showLoggedOutState() {
    // 👇 ПОКАЗЫВАЕМ КНОПКУ "ВОЙТИ"
    const loginBtn = document.querySelector('.login-btn');
    const userInfo = document.querySelector('.user-info');
    const avatarLink = document.querySelector('.user-avatar-link');
    const userStats = document.querySelector('.user-stats');
    
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (userInfo) userInfo.style.display = 'flex';
    if (avatarLink) avatarLink.style.display = 'none';
    if (userStats) userStats.style.display = 'none';
}

// Обновляем при загрузке страницы
document.addEventListener('DOMContentLoaded', updateHeaderStats);

// Обновляем при возврате на страницу
window.addEventListener('pageshow', updateHeaderStats);

// Обновляем при переключении вкладки
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        updateHeaderStats();
    }
});