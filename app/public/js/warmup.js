const WARMUP_VIDEOS = [
    '/videos/warmup1.mp4',
    '/videos/warmup2.mp4',
    '/videos/warmup3.mp4',
    '/videos/warmup4.mp4',
    '/videos/warmup5.mp4',
    '/videos/warmup6.mp4',
    '/videos/warmup7.mp4',
    '/videos/warmup8.mp4',
    '/videos/warmup9.mp4',
    '/videos/warmup10.mp4',
    '/videos/warmup11.mp4',
];

let currentStage = 'intro';
let countdownInterval = null;
let videoEnded = false;
let isPlaying = false;
let currentVideoIndex = 0;
let pointsAdded = false;

function shouldShowIntro() {
    const skipIntro = localStorage.getItem('skip_warmup_intro');
    return skipIntro !== 'true';
}

function skipIntroForever() {
    // Сохраняем в localStorage
    localStorage.setItem('skip_warmup_intro', 'true');
    
    // Сохраняем в БД
    fetch('/profile/skip-intro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
        } else {
            console.error('❌ Ошибка сохранения skip_intro');
        }
    })
    .catch(err => console.error('❌ Ошибка:', err));
    
    document.getElementById('warmupIntro').style.display = 'none';
    startCountdown();
}

function startIntro() {
    const introEl = document.getElementById('warmupIntro');
    const timerEl = document.getElementById('introTimer');
    let seconds = 10;
    if (!shouldShowIntro()) {
        introEl.style.display = 'none';
        startCountdown();
        return;
    }
    introEl.style.display = 'block';
    timerEl.textContent = seconds;
    const interval = setInterval(() => {
        seconds--;
        timerEl.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(interval);
            introEl.style.display = 'none';
            startCountdown();
        }
    }, 1000);
}

function startCountdown() {
    const countdownEl = document.getElementById('warmupCountdown');
    const numberEl = document.getElementById('countdownNumber');
    let count = 3;
    currentStage = 'countdown';
    countdownEl.style.display = 'flex';
    numberEl.textContent = count;
    countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            numberEl.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownEl.style.display = 'none';
            startVideo();
        }
    }, 1000);
}

function startVideo() {
    currentStage = 'video';
    const videoEl = document.getElementById('warmupPlayer');
    const sourceEl = document.getElementById('videoSource');
    const overlay = document.getElementById('videoOverlay');
    const playIcon = document.getElementById('playIcon');
    const repeatIcon = document.getElementById('repeatIcon');
    pointsAdded = false;
    currentVideoIndex = Math.floor(Math.random() * WARMUP_VIDEOS.length);
    const videoPath = WARMUP_VIDEOS[currentVideoIndex];
    sourceEl.src = videoPath;
    videoEl.load();
    document.getElementById('warmupVideo').style.display = 'block';
    document.getElementById('continueBtn').style.display = 'none';
    playIcon.classList.remove('hidden');
    repeatIcon.classList.add('hidden');
    overlay.style.display = 'flex';
    isPlaying = false;
    videoEnded = false;
    videoEl.addEventListener('timeupdate', updateProgress);
    videoEl.addEventListener('loadedmetadata', function() {
        updateTimeDisplay();
        videoEl.play().catch(() => playIcon.classList.remove('hidden'));
    });
    videoEl.addEventListener('play', function() {
        isPlaying = true;
        playIcon.classList.add('hidden');
    });
    videoEl.addEventListener('pause', function() {
        isPlaying = false;
        playIcon.classList.remove('hidden');
    });
    videoEl.addEventListener('ended', onVideoEnd);
}

function updateProgress() {
    const videoEl = document.getElementById('warmupPlayer');
    const progressBar = document.getElementById('progressBar');
    if (videoEl.duration > 0) {
        const percent = (videoEl.currentTime / videoEl.duration) * 100;
        progressBar.style.width = percent + '%';
        updateTimeDisplay();
    }
}

function updateTimeDisplay() {
    const videoEl = document.getElementById('warmupPlayer');
    const timeDisplay = document.getElementById('videoTime');
    if (videoEl.duration > 0) {
        timeDisplay.textContent = formatTime(videoEl.currentTime) + ' / ' + formatTime(videoEl.duration);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + String(secs).padStart(2, '0');
}

function handleOverlayClick() {
    if (videoEnded) {
        restartVideo();
        return;
    }
    togglePlay();
}

function togglePlay() {
    const videoEl = document.getElementById('warmupPlayer');
    const playIcon = document.getElementById('playIcon');
    if (videoEl.paused) {
        videoEl.play();
        playIcon.classList.add('hidden');
        isPlaying = true;
    } else {
        videoEl.pause();
        playIcon.classList.remove('hidden');
        isPlaying = false;
    }
}

function onVideoEnd() {
    videoEnded = true;
    currentStage = 'done';
    const playIcon = document.getElementById('playIcon');
    const repeatIcon = document.getElementById('repeatIcon');
    const overlay = document.getElementById('videoOverlay');
    if (playIcon) playIcon.classList.add('hidden');
    if (repeatIcon) repeatIcon.classList.remove('hidden');
    if (overlay) overlay.style.display = 'flex';
    const result = document.getElementById('warmupResult');
    if (result) result.style.display = 'block';
    
    if (!pointsAdded) {
        // 👇 ПОЛУЧАЕМ CSRF ТОКЕН
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        // 👇 ФОРМИРУЕМ ПРАВИЛЬНЫЕ ДАННЫЕ
        const data = {
            type: 'voice',
            difficulty: 'easy',
            totalTests: 1,
            totalScore: 10,
            results: [
                { hitTime: 4.5, success: true },
                { hitTime: 4.5, success: true }
            ],
            percentage: 100,
            userDate: getTodayUserDate(), // 👈 ДОБАВЛЯЕМ ДАТУ
            _csrf_token: csrfToken
        };
        
        if (typeof saveTrainingResults === 'function') {
            saveTrainingResults(data, '/training/pitch/result');
            pointsAdded = true;
        }
    }
}

// 👇 ДОБАВЬ ФУНКЦИЮ getTodayUserDate() В warmup.js
function getTodayUserDate() {
    const now = new Date();
    return now.getFullYear() + '-' + 
           String(now.getMonth() + 1).padStart(2, '0') + '-' + 
           String(now.getDate()).padStart(2, '0');
}

function restartVideo() {
    const videoEl = document.getElementById('warmupPlayer');
    videoEnded = false;
    isPlaying = false;
    document.getElementById('warmupResult').style.display = 'none';
    document.getElementById('playIcon').classList.remove('hidden');
    document.getElementById('repeatIcon').classList.add('hidden');
    videoEl.currentTime = 0;
    videoEl.play();
}

function continueToTraining() {
    window.location.href = '/training/voice';
}

document.addEventListener('DOMContentLoaded', function() {
    startIntro();
});