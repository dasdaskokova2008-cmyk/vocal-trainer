function getTodayUserDate() {
    const now = new Date();
    return now.getFullYear() + '-' + 
           String(now.getMonth() + 1).padStart(2, '0') + '-' + 
           String(now.getDate()).padStart(2, '0');
}

const hearingGameState = {
    difficulty: 'easy',
    totalTests: 10,
    currentTest: 0,
    score: 0,
    currentNote: null,
    selectedNote: null,
    results: [],
    attempts: 0,
    isWaitingForAnswer: false,
    isGameActive: false,
};

const POSITION_TO_NOTE = {
    0: 'Фа2',
    0.5: 'Ми2',
    1: 'Ре2',
    1.5: 'До2',
    2: 'Си',
    2.5: 'Ля',
    3: 'Соль',
    3.5: 'Фа',
    4: 'Ми',
    4.5: 'Ре',
    5: 'До',
    5.5: 'Си1',
    6: 'Ля1',
};

const EASY_NOTES = ['До', 'Ре', 'Ми', 'Фа', 'Соль', 'Ля', 'Си'];
const HARD_NOTES = ['Фа2', 'Ми2', 'Ре2', 'До2', 'Си', 'Ля', 'Соль', 'Фа', 'Ми', 'Ре', 'До', 'Си1', 'Ля1'];

function selectHearingDifficulty(difficulty) {
    hearingGameState.difficulty = difficulty;
    startHearingGame();
}

function startHearingGame() {
    const totalTests = parseInt(document.getElementById('testCountRange').value);
    hearingGameState.totalTests = totalTests;
    hearingGameState.currentTest = 0;
    hearingGameState.score = 0;
    hearingGameState.results = [];
    hearingGameState.isGameActive = true;

    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    document.getElementById('resultScreen').style.display = 'none';

    const pianoContainer = document.getElementById('pianoContainer');
    if (hearingGameState.difficulty === 'hard') {
        pianoContainer.style.display = 'none';
        document.getElementById('hearingHint').textContent = 'Сложная версия! Угадай ноту без подсказок';
    } else {
        pianoContainer.style.display = 'flex';
        buildPiano();
        document.getElementById('hearingHint').textContent = 'Послушай ноту и найди её на нотном стане';
    }

    buildClickableStaff();
    showNextHearingNote();
}

function buildPiano() {
    const piano = document.getElementById('piano');
    piano.innerHTML = '';

    const whiteNotes = ['Ля1', 'Си1', 'До', 'Ре', 'Ми', 'Фа', 'Соль', 'Ля', 'Си', 'До2', 'Ре2', 'Ми2', 'Фа2', 'Соль2'];
    const totalWhite = whiteNotes.length;
    const keyWidth = 100 / totalWhite;

    whiteNotes.forEach((note, i) => {
        const key = document.createElement('div');
        key.className = 'key white';
        key.dataset.note = note;
        key.textContent = note;
        key.style.width = keyWidth + '%';
        key.onclick = () => playPianoKey(note);
        piano.appendChild(key);
    });

    const blackData = [
        { index: 0, note: 'Ля#1' },
        { index: 2, note: 'До#' },
        { index: 3, note: 'Ре#' },
        { index: 5, note: 'Фа#' },
        { index: 6, note: 'Соль#' },
        { index: 7, note: 'Ля#' },
        { index: 9, note: 'До#2' },
        { index: 10, note: 'Ре#2' },
        { index: 12, note: 'Фа#2' },
    ];

    blackData.forEach(({ index, note }) => {
        const key = document.createElement('div');
        key.className = 'key black';
        key.dataset.note = note;
        key.textContent = note.replace('#', '♯');
        const leftPos = (index + 0.7) * keyWidth;
        key.style.left = leftPos + '%';
        key.style.width = (keyWidth * 0.6) + '%';
        key.style.transform = 'none';
        key.onclick = (e) => {
            e.stopPropagation();
            playPianoKey(note);
        };
        piano.appendChild(key);
    });
}

function playPianoKey(note) {
    const noteData = NOTES_RU[note];
    if (!noteData) return;
    playNoteByFrequency(noteData.freq);
}

function buildClickableStaff() {
    const wrapper = document.getElementById('staffWrapperScroll');
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

    const positions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
    const staffY = 25;
    
    positions.forEach(pos => {
        const zone = document.createElement('div');
        zone.className = 'staff-zone';
        zone.dataset.position = pos;
        const yPos = staffY + pos * 20 - 10;
        zone.style.top = yPos + 'px';
        zone.style.height = '20px';
        zone.style.left = '0';
        zone.style.right = '0';
        zone.style.position = 'absolute';
        zone.style.zIndex = '3';
        zone.style.cursor = 'pointer';
        
        zone.addEventListener('mouseenter', function() {
            if (hearingGameState.isWaitingForAnswer) {
                showHoverNote(pos);
            }
        });
        zone.addEventListener('mouseleave', function() {
            if (hearingGameState.isWaitingForAnswer) {
                hideHoverNote();
            }
        });
        
        zone.onclick = () => selectNoteOnStaff(pos);
        wrapper.appendChild(zone);
    });
}

function showHoverNote(position) {
    document.querySelectorAll('.staff-note.hover').forEach(el => el.remove());

    const note = POSITION_TO_NOTE[position];
    if (!note) return;

    const wrapper = document.getElementById('staffWrapperScroll');
    const noteData = NOTES_RU[note];
    if (!noteData) return;

    const noteY = 20 + noteData.position * 20 + 2;
    const noteEl = document.createElement('div');
    noteEl.className = 'staff-note hover';
    noteEl.style.left = '30%';
    noteEl.style.position = 'absolute';
    noteEl.style.pointerEvents = 'none';
    noteEl.style.zIndex = '2';

    const dot = document.createElement('div');
    dot.className = 'note-dot';
    dot.style.cssText = `position:absolute;width:16px;height:12px;border-radius:50%;background:rgba(74,158,255,0.3);left:0;top:${noteY}px;transform:translateY(-50%);`;
    noteEl.appendChild(dot);

    const stem = document.createElement('div');
    stem.className = 'note-stem';
    stem.style.cssText = `position:absolute;width:2px;height:40px;background:rgba(74,158,255,0.3);left:16px;top:${noteY}px;transform:translateY(-100%);`;
    noteEl.appendChild(stem);

    wrapper.appendChild(noteEl);
    drawLedgerLines(wrapper, note, 30);
}

function hideHoverNote() {
    document.querySelectorAll('.staff-note.hover').forEach(el => el.remove());
}

function selectNoteOnStaff(position) {
    if (!hearingGameState.isWaitingForAnswer) return;

    const note = POSITION_TO_NOTE[position];
    if (!note) return;

    document.querySelectorAll('.staff-note.selected, .staff-note.hover').forEach(el => el.remove());

    const wrapper = document.getElementById('staffWrapperScroll');
    const noteData = NOTES_RU[note];
    if (!noteData) return;

    const noteY = 20 + noteData.position * 20 + 2;
    const noteEl = document.createElement('div');
    noteEl.className = 'staff-note selected';
    noteEl.style.left = '30%';
    noteEl.style.position = 'absolute';
    noteEl.style.zIndex = '2';

    const dot = document.createElement('div');
    dot.className = 'note-dot';
    dot.style.cssText = `position:absolute;width:16px;height:12px;border-radius:50%;background:#4a9eff;left:0;top:${noteY}px;transform:translateY(-50%);box-shadow:0 0 20px rgba(74,158,255,0.6);`;
    noteEl.appendChild(dot);

    const stem = document.createElement('div');
    stem.className = 'note-stem';
    stem.style.cssText = `position:absolute;width:2px;height:40px;background:#4a9eff;left:16px;top:${noteY}px;transform:translateY(-100%);`;
    noteEl.appendChild(stem);

    const label = document.createElement('div');
    label.className = 'note-label';
    label.textContent = note;
    label.style.cssText = `position:absolute;left:50%;transform:translateX(-50%);font-size:14px;font-weight:700;color:white;background:#4a9eff;border:2px solid #4a9eff;border-radius:6px;padding:2px 10px;white-space:nowrap;top:${noteY - 45}px;box-shadow:0 0 15px rgba(74,158,255,0.4);`;
    noteEl.appendChild(label);

    wrapper.appendChild(noteEl);
    drawLedgerLines(wrapper, note, 30);

    hearingGameState.selectedNote = note;
    document.getElementById('submitAnswerBtn').style.display = 'block';
    document.getElementById('resultFeedback').style.display = 'none';
}

function drawLedgerLines(wrapper, noteName, noteLeftPercent) {
    const noteData = NOTES_RU[noteName];
    if (!noteData) return;
    const pos = noteData.position;
    const staffY = 20;
    const spacing = 20;
    const lineWidth = 30;

    if (pos > 5) {
        for (let i = 5; i <= Math.floor(pos); i++) {
            const y = staffY + i * spacing;
            const line = document.createElement('div');
            line.className = 'ledger-line';
            line.style.cssText = `top:${y}px;left:${noteLeftPercent - 0.7}%;width:${lineWidth}px;height:2px;background:var(--text-muted);position:absolute;opacity:0.6;z-index:1;`;
            wrapper.appendChild(line);
        }
    }
}

function showNextHearingNote() {
    if (hearingGameState.currentTest >= hearingGameState.totalTests) {
        finishHearingTest();
        return;
    }

    hearingGameState.currentTest++;
    hearingGameState.attempts = 0;
    hearingGameState.selectedNote = null;
    hearingGameState.isWaitingForAnswer = true;

    const notes = hearingGameState.difficulty === 'easy' ? EASY_NOTES : HARD_NOTES;
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    hearingGameState.currentNote = randomNote;

    document.querySelectorAll('.staff-note.selected, .staff-note.hover').forEach(el => el.remove());
    document.getElementById('submitAnswerBtn').style.display = 'none';
    document.getElementById('resultFeedback').style.display = 'none';

    updateHearingProgress();

    document.getElementById('hearingHint').textContent = 'Послушай ноту и найди её на нотном стане';

    setTimeout(() => {
        playCurrentHearingNote();
    }, 500);
}

function playCurrentHearingNote() {
    const note = hearingGameState.currentNote;
    const noteData = NOTES_RU[note];
    if (!noteData) return;
    playNoteByFrequency(noteData.freq);
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

function submitHearingAnswer() {
    if (!hearingGameState.isWaitingForAnswer) return;
    if (!hearingGameState.selectedNote) {
        showHearingFeedback('Сначала выбери ноту на стане!', 'info');
        return;
    }

    const isCorrect = hearingGameState.selectedNote === hearingGameState.currentNote;
    hearingGameState.attempts++;

    let points = 0;
    if (isCorrect) {
        if (hearingGameState.attempts === 1) points = 5;
        else if (hearingGameState.attempts === 2) points = 4;
        else if (hearingGameState.attempts === 3) points = 3;
        else if (hearingGameState.attempts === 4) points = 2;
        else points = 1;
    }

    const multiplier = hearingGameState.difficulty === 'hard' ? 3 : 1;
    const finalPoints = points * multiplier;

    hearingGameState.results.push({
        note: hearingGameState.currentNote,
        userAnswer: hearingGameState.selectedNote,
        attempts: hearingGameState.attempts,
        success: isCorrect,
        score: finalPoints,
    });

    if (isCorrect) {
        hearingGameState.score += finalPoints;
        
        showHearingFeedback(`Отлично! Это нота ${hearingGameState.currentNote}. +${finalPoints} баллов!`, 'success');
        
        document.getElementById('submitAnswerBtn').style.display = 'none';
        hearingGameState.isWaitingForAnswer = false;
        setTimeout(() => {
            showNextHearingNote();
        }, 1500);
    } else {
        showHearingFeedback(`Неверно. Попробуйте ещё раз!`, 'fail');
        document.querySelectorAll('.staff-note.selected').forEach(el => el.remove());
        hearingGameState.selectedNote = null;
        document.getElementById('submitAnswerBtn').style.display = 'none';
    }
}

function showHearingFeedback(message, type) {
    const fb = document.getElementById('resultFeedback');
    fb.textContent = message;
    fb.className = 'result-feedback ' + type;
    fb.style.display = 'block';
}

function updateHearingProgress() {
    const p = ((hearingGameState.currentTest - 1) / hearingGameState.totalTests) * 100;
    document.getElementById('progressFill').style.width = p + '%';
    document.getElementById('progressText').textContent = `${hearingGameState.currentTest} из ${hearingGameState.totalTests}`;
    
    document.getElementById('scoreText').textContent = `⭐ ${hearingGameState.score} баллов`;
}

function finishHearingTest() {
    hearingGameState.isGameActive = false;
    document.getElementById('gameScreen').style.display = 'none';

    const maxPointsPerNote = 5;
    const multiplier = hearingGameState.difficulty === 'hard' ? 3 : 1;
    const maxTotalScore = hearingGameState.totalTests * maxPointsPerNote * multiplier;
    
    let percentage = 0;
    if (maxTotalScore > 0) {
        percentage = Math.round((hearingGameState.score / maxTotalScore) * 100);
    }
    percentage = Math.min(100, Math.max(0, percentage));

    animateHearingProgressCircle(percentage);
    const motivationText = getMotivationByPercentage(percentage);
    document.getElementById('motivationText').textContent = motivationText;
    document.getElementById('resultScreen').style.display = 'flex';

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    const userDate = getTodayUserDate();

    const data = {
        type: 'hearing',
        difficulty: hearingGameState.difficulty,
        totalTests: hearingGameState.totalTests,
        totalScore: hearingGameState.score,
        results: hearingGameState.results.map(r => ({ 
            hitTime: r.score, 
            success: r.success 
        })),
        percentage: percentage,
        userDate: userDate, 
        _csrf_token: csrfToken
    };

    saveTrainingResults(data, '/training/pitch/result');
}
function animateHearingProgressCircle(percentage) {
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

function continueHearingTraining() {
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('setupScreen').style.display = 'flex';
    document.getElementById('gameScreen').style.display = 'none';
    hearingGameState.isGameActive = false;
    hearingGameState.results = [];
    hearingGameState.score = 0;
    hearingGameState.currentTest = 0;
    document.getElementById('staffWrapperScroll').innerHTML = '';
}