function updateHeaderStats() {
    fetch('/api/user/stats')
        .then(response => {
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
            showLoggedOutState();
        });
}

function showLoggedInState(data) {
    document.querySelectorAll('#headerScore, #profileScore, #scoreText').forEach(el => {
        if (el) el.textContent = data.score;
    });
    
    document.querySelectorAll('#headerStreak, #profileStreak, #streakText').forEach(el => {
        if (el) el.textContent = data.streak;
    });
    
    document.querySelectorAll('.streak-icon').forEach(el => {
        if (data.isActiveToday) {
            el.classList.add('active');
            el.classList.remove('inactive');
        } else {
            el.classList.remove('active');
            el.classList.add('inactive');
        }
    });
    
    const usernameEl = document.querySelector('.username');
    if (usernameEl) usernameEl.textContent = data.username;
    
    const loginBtn = document.querySelector('.login-btn');const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.style.alignItems = 'center';
        userInfo.style.display = 'flex';
    }
    const avatarLink = document.querySelector('.user-avatar-link');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (avatarLink) avatarLink.style.display = 'inline-block';
}

function showLoggedOutState() {
    const loginBtn = document.querySelector('.login-btn');
    const userInfo = document.querySelector('.user-info');
    const avatarLink = document.querySelector('.user-avatar-link');
    const userStats = document.querySelector('.user-stats');
    
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (userInfo) userInfo.style.display = 'flex';
    if (avatarLink) avatarLink.style.display = 'none';
    if (userStats) userStats.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', updateHeaderStats);

window.addEventListener('pageshow', updateHeaderStats);

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        updateHeaderStats();
    }
});