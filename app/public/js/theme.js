function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (!themeIcon) return;
    if (theme === 'dark') {
        themeIcon.src = '/images/moon-icon.png';
        themeIcon.alt = 'Тёмная тема';
    } else {
        themeIcon.src = '/images/sun-icon.png';
        themeIcon.alt = 'Светлая тема';
    }
}

function updateHeaderStats() {
    fetch('/api/user/stats')
        .then(response => response.json())
        .then(data => {
            
            if (data.score !== undefined) {
                document.querySelectorAll('#headerScore, #profileScore, #scoreText').forEach(el => {
                    if (el) el.textContent = data.score;
                });
            }
            
            if (data.streak !== undefined) {
                document.querySelectorAll('#headerStreak, #profileStreak, #streakText').forEach(el => {
                    if (el) el.textContent = data.streak;
                });
            }
            
            if (data.isActiveToday !== undefined) {
                const streakIcons = document.querySelectorAll('.streak-icon');
                if (data.isActiveToday) {
                    streakIcons.forEach(el => {
                        el.classList.add('active');
                        el.classList.remove('inactive');
                    });
                } else {
                    streakIcons.forEach(el => {
                        el.classList.remove('active');
                        el.classList.add('inactive');
                    });
                }
            }
            
            if (data.place !== undefined) {
                document.querySelectorAll('#headerPlace, #profilePlace, #placeText').forEach(el => {
                    if (el) el.textContent = data.place;
                });
            }
        })
        .catch(err => console.error('Ошибка обновления шапки:', err));
}

document.addEventListener('DOMContentLoaded', function() {
    updateHeaderStats();
});

window.addEventListener('pageshow', function() {
    updateHeaderStats();
});

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        updateHeaderStats();
    }
});