// header-updater.js

function updateHeaderStats() {
    fetch('/api/user/stats')
        .then(response => response.json())
        .then(data => {
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
        })
        .catch(err => console.error('❌ Ошибка обновления шапки:', err));
}

// Обновляем при загрузке страницы
document.addEventListener('DOMContentLoaded', updateHeaderStats);

// Обновляем при возврате на страницу (стрелка "назад")
window.addEventListener('pageshow', updateHeaderStats);

// Обновляем при переключении вкладки
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        updateHeaderStats();
    }
});