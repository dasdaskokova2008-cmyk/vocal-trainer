// training-intervals.js

function getTodayUserDate() {
    const now = new Date();
    return now.getFullYear() + '-' + 
           String(now.getMonth() + 1).padStart(2, '0') + '-' + 
           String(now.getDate()).padStart(2, '0');
}

const intervalGameState = {
    difficulty: 'easy',
    totalTests: 10,
    currentTest: 0,
    score: 0,
    currentInterval: null,
    currentPair: null,
    results: [],
    isWaitingForAnswer: false,
    isGameActive: false,
    shuffledNames: [],
};

// --- Инициализация ---
function selectIntervalDifficulty(difficulty) {
    intervalGameState.difficulty = difficulty;
    startIntervalGame();
}

function startIntervalGame() {
    const totalTests = parseInt(document.getElementById('testCountRange').value);
    intervalGameState.totalTests = totalTests;
    intervalGameState.currentTest = 0;
    intervalGameState.score = 0;
    intervalGameState.results = [];
    intervalGameState.isGameActive = true;

    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    document.getElementById('resultScreen').style.display = 'none';

    const staff = document.getElementById('intervalsStaff');
    if (intervalGameState.difficulty === 'hard') {
        staff.style.display = 'none';
        document.getElementById('intervalsHint').textContent = '🎵 Сложная версия! Определи интервал на слух';
    } else {
        staff.style.display = 'flex';
        document.getElementById('intervalsHint').textContent = '🎵 Послушай интервал и определи его';
    }

    populateSelects();
    showNextInterval();
}

// --- Заполнение выпадающих списков ---
function populateSelects() {
    const shorts = INTERVAL_ORDER;
    const names = INTERVAL_ORDER.map(key => INTERVAL_NAMES[key]);
    const shuffledNames = shuffleArray([...names]);
    const tones = [...new Set(INTERVAL_ORDER.map(key => INTERVALS_DATA[key].tones))].sort((a, b) => a - b);
    const steps = [...new Set(INTERVAL_ORDER.map(key => INTERVALS_DATA[key].steps))].sort((a, b) => a - b);

    intervalGameState.shuffledNames = shuffledNames;

    populateSelect('answerShort', shorts);
    populateSelect('answerName', shuffledNames);
    populateSelect('answerTones', tones.map(t => t + ' тонов'));
    populateSelect('answerSteps', steps.map(s => s + ' ступеней'));
}

function populateSelect(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Выберите...';
    defaultOption.style.color = 'var(--text-muted)';
    select.appendChild(defaultOption);
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
}

// --- Показать следующий интервал ---
function showNextInterval() {
    if (intervalGameState.currentTest >= intervalGameState.totalTests) {
        finishIntervalTest();
        return;
    }

    intervalGameState.currentTest++;
    intervalGameState.isWaitingForAnswer = true;

    const interval = getRandomInterval();
    intervalGameState.currentInterval = interval;
    intervalGameState.currentPair = getRandomPair(interval.key);

    document.getElementById('intervalFeedback').style.display = 'none';
    document.getElementById('submitIntervalBtn').style.display = 'none';

    ['cardShort', 'cardName', 'cardTones', 'cardSteps'].forEach(id => {
        const card = document.getElementById(id);
        card.classList.remove('card-correct', 'card-wrong');
        const resultEl = card.querySelector('.interval-card-result');
        if (resultEl) {
            resultEl.innerHTML = '';
            resultEl.className = 'interval-card-result';
        }
    });

    populateSelects();

    document.getElementById('answerShort').value = '';
    document.getElementById('answerName').value = '';
    document.getElementById('answerTones').value = '';
    document.getElementById('answerSteps').value = '';

    if (intervalGameState.difficulty === 'easy') {
        drawIntervalOnStaff(intervalGameState.currentPair);
    } else {
        document.getElementById('intervalsStaffWrapper').innerHTML = '';
    }

    updateIntervalProgress();

    setTimeout(() => {
        playCurrentInterval();
    }, 500);

    checkAllFieldsFilled();
}

// --- Проверка заполнения всех полей ---
function checkAllFieldsFilled() {
    const short = document.getElementById('answerShort')?.value;
    const name = document.getElementById('answerName')?.value;
    const tones = document.getElementById('answerTones')?.value;
    const steps = document.getElementById('answerSteps')?.value;
    const submitBtn = document.getElementById('submitIntervalBtn');

    if (short && name && tones && steps) {
        submitBtn.style.display = 'block';
        submitBtn.style.opacity = '1';
        submitBtn.style.transform = 'scale(1)';
    } else {
        submitBtn.style.display = 'none';
    }
}

// --- Рисование интервала на нотном стане ---
function drawIntervalOnStaff(pair) {
    const wrapper = document.getElementById('intervalsStaffWrapper');
    wrapper.innerHTML = '';

    const linesContainer = document.createElement('div');
    linesContainer.className = 'staff-lines';
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'staff-line';
        line.style.top = (i * 20) + 'px';
        linesContainer.appendChild(line);
    }
    wrapper.appendChild(linesContainer);

    const note1 = pair[0];
    const note2 = pair[1];
    
    drawNoteOnIntervalStaff(wrapper, note1, 38);
    drawNoteOnIntervalStaff(wrapper, note2, 38);
}

// --- Отрисовка одной ноты с добавочными линиями ---
function drawNoteOnIntervalStaff(wrapper, noteName, leftPos) {
    const noteData = NOTES_RU[noteName];
    if (!noteData) {
        console.warn('❌ Нота не найдена:', noteName);
        return;
    }

    const staffY = 20;
    const spacing = 20;
    const noteY = staffY + noteData.position * spacing + 2;
    const pos = noteData.position;

    const containerWidth = wrapper.offsetWidth || 600;
    const lineWidth = Math.max(28, containerWidth * 0.045);
    const lineLeftOffset = parseFloat(leftPos) - 2.5;

    // ДОБАВОЧНЫЕ ЛИНИИ
    if (pos < 0) {
        for (let i = 0; i >= Math.ceil(pos); i--) {
            const y = staffY + i * spacing;
            const line = document.createElement('div');
            line.className = 'ledger-line';
            line.style.cssText = `
                position: absolute;
                top: ${y}px;
                left: ${lineLeftOffset}%;
                width: ${lineWidth}px;
                height: 2px;
                background: var(--text-muted);
                opacity: 0.5;
                z-index: 1;
                border-radius: 1px;
            `;
            wrapper.appendChild(line);
        }
    }
    
    if (pos > 4.5) {
        for (let i = 5; i <= Math.floor(pos); i++) {
            const y = staffY + i * spacing;
            const line = document.createElement('div');
            line.className = 'ledger-line';
            line.style.cssText = `
                position: absolute;
                top: ${y}px;
                left: ${lineLeftOffset}%;
                width: ${lineWidth}px;
                height: 2px;
                background: var(--text-muted);
                opacity: 0.5;
                z-index: 1;
                border-radius: 1px;
            `;
            wrapper.appendChild(line);
        }
    }

    // НОТА
    const noteEl = document.createElement('div');
    noteEl.className = 'staff-note clickable';
    noteEl.style.left = leftPos + '%';
    noteEl.style.position = 'absolute';
    noteEl.style.zIndex = '2';
    noteEl.style.width = '20px';
    noteEl.style.height = '30px';
    noteEl.style.cursor = 'pointer';
    noteEl.title = noteName;

    // Кружок
    const dot = document.createElement('div');
    dot.className = 'note-dot';
    dot.style.cssText = `
        position: absolute;
        width: 16px;
        height: 12px;
        border-radius: 50%;
        background: #4a9eff;
        left: 0;
        top: ${noteY}px;
        transform: translateY(-50%);
        box-shadow: 0 0 10px rgba(74,158,255,0.3);
        transition: all 0.2s ease;
    `;
    noteEl.appendChild(dot);

    // Штиль
    const stem = document.createElement('div');
    stem.className = 'note-stem';
    stem.style.cssText = `
        position: absolute;
        width: 2px;
        height: 40px;
        background: #4a9eff;
        left: 16px;
        top: ${noteY}px;
        transform: translateY(-100%);
        border-radius: 1px;
    `;
    noteEl.appendChild(stem);

    // ДИЕЗ ИЛИ БЕМОЛЬ
    const hasSharp = noteName.includes('♯');
    const hasFlat = noteName.includes('♭');

    if (hasSharp || hasFlat) {
        const accEl = document.createElement('div');
        accEl.style.cssText = `
            position: absolute;
            left: -20px;
            top: ${noteY - 14}px;
            font-size: 18px;
            font-weight: 900;
            z-index: 4;
            user-select: none;
            pointer-events: none;
            font-family: 'Times New Roman', serif;
            text-shadow: 0 0 12px rgba(74,158,255,0.15);
        `;
        
        if (hasSharp) {
            accEl.textContent = '♯';
            accEl.style.color = '#4a9eff';
        } else if (hasFlat) {
            accEl.textContent = '♭';
            accEl.style.color = '#6c5ce7';
        }
        noteEl.appendChild(accEl);
    }

    // КЛИК
    const freq = noteData.freq;
    noteEl.addEventListener('click', function(e) {
        e.stopPropagation();
        playNoteByFrequency(freq);
        const dotEl = this.querySelector('.note-dot');
        dotEl.style.transform = 'translateY(-50%) scale(1.4)';
        dotEl.style.boxShadow = '0 0 30px rgba(74,158,255,0.8)';
        setTimeout(() => {
            dotEl.style.transform = 'translateY(-50%) scale(1)';
            dotEl.style.boxShadow = '0 0 10px rgba(74,158,255,0.3)';
        }, 300);
    });

    wrapper.appendChild(noteEl);
}

// --- Воспроизведение ---
function playCurrentInterval() {
    const pair = intervalGameState.currentPair;
    if (!pair) return;
    
    const note1 = pair[0];
    const note2 = pair[1];
    const freq1 = NOTES_RU[note1]?.freq;
    const freq2 = NOTES_RU[note2]?.freq;
    
    
    if (freq1 && freq2) {
        playTwoNotes(freq1, freq2);
    }
}

function playTwoNotes(freq1, freq2) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);
        gainNode.connect(ctx.destination);

        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = freq1;
        osc1.connect(gainNode);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 2.5);

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = freq2;
        osc2.connect(gainNode);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 2.5);
        
    } catch (err) {
        console.error('Audio error:', err);
    }
}

function playNoteByFrequency(freq) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
    } catch (err) {
        console.error('Audio error:', err);
    }
}

// --- Отправка ответа ---
function submitIntervalAnswer() {
    if (!intervalGameState.isWaitingForAnswer) return;

    const short = document.getElementById('answerShort').value;
    const name = document.getElementById('answerName').value;
    const tones = document.getElementById('answerTones').value.replace(' тонов', '');
    const steps = document.getElementById('answerSteps').value.replace(' ступеней', '');

    if (!short || !name || !tones || !steps) {
        showIntervalFeedback('📝 Заполните все поля!', 'info');
        return;
    }

    const correct = intervalGameState.currentInterval.data;
    const isShortCorrect = short === correct.short;
    const isNameCorrect = name === correct.name;
    const isTonesCorrect = parseFloat(tones) === correct.tones;
    const isStepsCorrect = parseInt(steps) === correct.steps;

    let points = 0;
    if (isShortCorrect) points += 2;
    if (isNameCorrect) points += 1;
    if (isTonesCorrect) points += 1;
    if (isStepsCorrect) points += 1;

    const multiplier = intervalGameState.difficulty === 'hard' ? 3 : 1;
    points *= multiplier;

    intervalGameState.score += points;
    intervalGameState.results.push({
        interval: correct.short,
        correct: isShortCorrect && isNameCorrect && isTonesCorrect && isStepsCorrect,
        points: points,
        shortCorrect: isShortCorrect,
        nameCorrect: isNameCorrect,
        tonesCorrect: isTonesCorrect,
        stepsCorrect: isStepsCorrect
    });

    showIntervalFeedbackWithAnswers(isShortCorrect, isNameCorrect, isTonesCorrect, isStepsCorrect, correct);
    
    document.getElementById('submitIntervalBtn').style.display = 'none';
    intervalGameState.isWaitingForAnswer = false;

    setTimeout(() => {
        showNextInterval();
    }, 3000);
}

// --- Обратная связь ---
function showIntervalFeedbackWithAnswers(shortOk, nameOk, tonesOk, stepsOk, correct) {
    ['cardShort', 'cardName', 'cardTones', 'cardSteps'].forEach(id => {
        const card = document.getElementById(id);
        card.classList.remove('card-correct', 'card-wrong');
        const resultEl = card.querySelector('.interval-card-result');
        resultEl.innerHTML = '';
        resultEl.className = 'interval-card-result';
    });

    updateCardResult('cardShort', 'answerShort', shortOk, correct.short);
    updateCardResult('cardName', 'answerName', nameOk, correct.name);
    updateCardResult('cardTones', 'answerTones', tonesOk, correct.tones + ' тонов');
    updateCardResult('cardSteps', 'answerSteps', stepsOk, correct.steps + ' ступеней');

    const fb = document.getElementById('intervalFeedback');
    fb.innerHTML = '';
    fb.className = 'result-feedback';
    fb.style.display = 'none';
}

function updateCardResult(cardId, selectId, isCorrect, correctValue) {
    const card = document.getElementById(cardId);
    const select = document.getElementById(selectId);
    const resultEl = card.querySelector('.interval-card-result');
    const userValue = select.value || '—';
    
    if (isCorrect) {
        card.classList.add('card-correct');
        resultEl.className = 'interval-card-result correct';
        resultEl.innerHTML = `
            <span style="font-size: 20px; margin-right: 6px;">✅</span>
            <span style="font-weight: 600;">${correctValue}</span>
        `;
    } else {
        card.classList.add('card-wrong');
        resultEl.className = 'interval-card-result wrong';
        resultEl.innerHTML = `
            <span style="font-size: 18px; margin-right: 4px;">❌</span>
            <span class="strikethrough" style="font-weight: 500; opacity: 0.6;">${userValue}</span>
            <span style="margin: 0 6px; color: var(--text-muted);">→</span>
            <span style="font-weight: 700; color: #00c853;">${correctValue}</span>
        `;
    }
}

function showIntervalFeedback(message, type) {
    const fb = document.getElementById('intervalFeedback');
    fb.innerHTML = `<div style="padding: 12px 16px; text-align: center; font-size: 18px; color: var(--text-muted);">${message}</div>`;
    fb.className = 'result-feedback ' + type;
    fb.style.display = 'block';
}

// --- Прогресс ---
function updateIntervalProgress() {
    const p = ((intervalGameState.currentTest - 1) / intervalGameState.totalTests) * 100;
    document.getElementById('progressFill').style.width = p + '%';
    document.getElementById('progressText').textContent = `${intervalGameState.currentTest} из ${intervalGameState.totalTests}`;
    document.getElementById('scoreText').textContent = `⭐ ${intervalGameState.score} баллов`;
}

// --- Завершение ---
function finishIntervalTest() {
    intervalGameState.isGameActive = false;
    document.getElementById('gameScreen').style.display = 'none';

    const maxPointsPerNote = 5;
    const multiplier = intervalGameState.difficulty === 'hard' ? 3 : 1;
    const maxTotalScore = intervalGameState.totalTests * maxPointsPerNote * multiplier;
    
    let percentage = 0;
    if (maxTotalScore > 0) {
        percentage = Math.round((intervalGameState.score / maxTotalScore) * 100);
    }
    percentage = Math.min(100, Math.max(0, percentage));

    animateIntervalProgressCircle(percentage);
    const motivationText = getMotivationByPercentage(percentage);
    document.getElementById('motivationText').textContent = motivationText;
    document.getElementById('resultScreen').style.display = 'flex';

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    // 👇 ДОБАВЛЯЕМ ДАТУ ПОЛЬЗОВАТЕЛЯ
    const userDate = getTodayUserDate();

    const data = {
        type: 'hearing',
        difficulty: intervalGameState.difficulty,
        totalTests: intervalGameState.totalTests,
        totalScore: intervalGameState.score,
        results: intervalGameState.results.map(r => ({ 
            hitTime: r.points, 
            success: r.correct 
        })),
        percentage: percentage,
        userDate: userDate, // 👈 ДОБАВЛЯЕМ
        _csrf_token: csrfToken
    };

    saveTrainingResults(data, '/training/pitch/result');
}

// --- Анимация круга ---
function animateIntervalProgressCircle(percentage) {
    const circle = document.getElementById('progressCircleFill');
    const percentText = document.getElementById('progressPercent');
    if (!circle || !percentText) return;
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = circumference;
    percentText.textContent = '0%';
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
        let current = 0;
        const duration = 1500;
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(percentage * eased);
            percentText.textContent = current + '%';
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }, 100);
}

// --- Продолжить ---
function continueIntervalTraining() {
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('setupScreen').style.display = 'flex';
    document.getElementById('gameScreen').style.display = 'none';
    intervalGameState.isGameActive = false;
    intervalGameState.results = [];
    intervalGameState.score = 0;
    intervalGameState.currentTest = 0;
    document.getElementById('intervalsStaffWrapper').innerHTML = '';
}

// ============================================================
// ТЕОРИЯ
// ============================================================

function openIntervalTheory() {
    const modal = document.getElementById('theoryModal');
    const content = document.getElementById('theoryContent');
    
    let html = `
        <div style="margin-bottom: 20px; text-align: center; color: var(--text-secondary); font-size: 14px; letter-spacing: 0.5px;">
            🎵 Нажми на интервал, чтобы развернуть информацию
        </div>
        <div class="theory-accordion">
    `;
    
    INTERVAL_ORDER.forEach(key => {
        const data = INTERVALS_DATA[key];
        const pairExample = data.pairs[0] || ['', ''];
        const freq1 = NOTES_RU[pairExample[0]]?.freq;
        const freq2 = NOTES_RU[pairExample[1]]?.freq;
        
        html += `
            <div class="theory-item">
                <div class="theory-header" onclick="toggleTheoryItem(this)">
                    <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
                        <span class="theory-short">${data.short}</span>
                        <span class="theory-name">${data.name}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button onclick="event.stopPropagation(); playTwoNotes(${freq1 || 440}, ${freq2 || 440})" class="theory-play-btn">
                            🔊
                        </button>
                        <svg class="theory-chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="theory-body" style="display: none;">
                    <div style="padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="theory-detail-card" style="border-left-color: #4a9eff;">
                            <div class="theory-detail-label">Сокращение</div>
                            <div class="theory-detail-value" style="color: #4a9eff;">${data.short}</div>
                        </div>
                        <div class="theory-detail-card" style="border-left-color: #6c5ce7;">
                            <div class="theory-detail-label">Название</div>
                            <div class="theory-detail-value" style="color: #6c5ce7;">${data.name}</div>
                        </div>
                        <div class="theory-detail-card" style="border-left-color: #00c853;">
                            <div class="theory-detail-label">Тонов</div>
                            <div class="theory-detail-value" style="color: #00c853;">${data.tones}</div>
                        </div>
                        <div class="theory-detail-card" style="border-left-color: #ffc107;">
                            <div class="theory-detail-label">Ступеней</div>
                            <div class="theory-detail-value" style="color: #ffc107;">${data.steps}</div>
                        </div>
                    </div>
                    <div class="theory-association">
                        <div class="theory-association-label">🎵 Ассоциация</div>
                        <div class="theory-association-value">(будет добавлена позже)</div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    content.innerHTML = html;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeIntervalTheory() {
    document.getElementById('theoryModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function toggleTheoryItem(header) {
    const body = header.nextElementSibling;
    const chevron = header.querySelector('.theory-chevron');
    
    if (body.style.display === 'none') {
        body.style.display = 'block';
        chevron.style.transform = 'rotate(180deg)';
        document.querySelectorAll('.theory-body').forEach(el => {
            if (el !== body) {
                el.style.display = 'none';
                const otherChevron = el.previousElementSibling?.querySelector('.theory-chevron');
                if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
            }
        });
    } else {
        body.style.display = 'none';
        chevron.style.transform = 'rotate(0deg)';
    }
}

function playIntervalSound(key) {
    const data = INTERVALS_DATA[key];
    if (!data || data.pairs.length === 0) return;
    const pair = data.pairs[0];
    const freq1 = NOTES_RU[pair[0]]?.freq;
    const freq2 = NOTES_RU[pair[1]]?.freq;
    if (freq1 && freq2) {
        playTwoNotes(freq1, freq2);
    }
}

// ============================================================
// КОНТРОЛЬ ЗАПОЛНЕНИЯ ПОЛЕЙ
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    ['answerShort', 'answerName', 'answerTones', 'answerSteps'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', checkAllFieldsFilled);
        }
    });
});