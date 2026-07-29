const MELODIES = {
    light: {
        'Баю-баюшки': {
            notes: ['Фа', 'Фа', 'Ми', 'Ми', 'Ре', 'Ре', 'Ре', 'Фа', 'Фа', 'Ми', 'Ми', 'Ре', 'Ре', 'Ре', 'Фа', 'Фа', 'Ми', 'Ми', 'Ре', 'Ре', 'Фа', 'Фа', 'Ми', 'Ми', 'Ре', 'Ре'],
            durations: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 1, 1, 0.5, 0.5, 0.5, 0.5, 1, 1],
            lyrics: ['ба', 'ю', 'ба', 'ю', 'шки', 'ба', 'ю', 'глаз', 'кам', 'пе', 'сен', 'ку', 'спо', 'ю', 'рас', 'ска', 'жу', 'и', 'сказ', 'ку', 'за', 'кры', 'вай', 'тесь', 'глаз', 'ки']
        }
    },
    hard: {
        'Ты да я, да мы с тобой': {
            notes: [
                'Ля', 'Ля', 'Ля', 'Ля', 'Ля', 'Фа', 'Ре', 'Ре', '-',
                'Ля', 'Ля', 'Ля', 'Ля', 'Ля', 'Фа', 'Ре', 'Ре', '-',
                'Ля', 'Ля', 'Ля', 'Ля', 'Ля', 'Си♭', 'До2', 'Си♭', 'Ля', 'Ре', 'Си♭','-',
                'Си♭', 'Си♭', 'Си♭', 'Си♭', 'Си♭', 'Ля', 'Соль', 'Фа2', 'Ми2', '-',
                'Ля', 'Ля', 'Ля', 'Ля', 'Ля', 'Соль', 'Фа', 'Ми2', 'Ре2', '-',
                'Соль', 'Соль', 'Соль', 'Соль', 'Соль', 'Си♭', 'Ля', 'Соль', 'Фа', 'Соль', 'Ля', '-',
                'Си♭', 'Си♭', 'Си♭', 'Си♭', 'Си♭', 'Ля', 'Соль', 'Фа2', 'Ми2', '-',
                'Ля', 'Ля', 'Ля', 'Ля', 'Ля', 'Соль', 'Фа', 'Ми2', 'Ре2', '-',
                'Соль', 'Соль', 'Соль', 'Соль', 'Соль', 'Си♭', 'Ля', 'Соль', 'Фа', 'Ми', 'Ре','-'
            ],
            durations: [
                0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 2, 2,
                0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 2, 2,
                0.5, 0.5, 0.5, 0.5, 1.5, 0.5, 1, 1, 1, 1,
                2, 2, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 1, 1,
                2, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 1, 1, 2,
                0.5, 0.5, 0.5, 0.5, 1.5, 0.5, 1, 1, 1, 1, 2,
                2, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 1, 1,
                2, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 1, 1, 2,
                0.5, 0.5, 0.5, 0.5, 1.5, 0.5, 1, 1, 1, 1, 2, 2
            ],
            lyrics: [
                'ты', 'да', 'я', 'да', 'мы', 'сто', 'бой', '-', ' ',
                'ты', 'да', 'я', 'да', 'мы', 'сто', 'бой','-', ' ',
                'здо', 'ро', 'во',  'ког', 'да', 'на', 'све', 'те', 'есть', 'дру', 'зья', ' ',
                'е', 'слиб', 'жи', 'ли', 'все', 'во', 'ди', 'ноч', 'ку', ' ',
                'то', 'у', 'же', 'дав', 'но', 'на', 'ку', 'соч', 'ки', ' ',
                'раз', 'ва', 'ли', 'лась', 'бы', 'на', 'вер', 'но', 'е', 'Зем', 'ля', ' ',
                'е', 'слиб', 'жи', 'ли', 'все', 'во', 'ди', 'ноч', 'ку', ' ',
                'то', 'у', 'же', 'дав', 'но', 'на', 'ку', 'соч', 'ки', ' ',
                'раз', 'ва', 'ли', 'лась', 'бы', 'на', 'вер', 'но', 'е', 'Зем', 'ля', ' '
            ]
        }
    },
    user: {}
};

let melodyState = {
    currentMelody: null,
    currentMelodyKey: null,
    currentMelodyType: null,
    currentNoteIndex: 0,
    notes: [],
    durations: [],
    lyrics: [],
    isPlaying: false,
    isRecording: false,
    isPaused: false,
    isComplete: false,
    score: 0,
    totalNotes: 0,
    hitTime: 0,
    lastHitTime: null,
    isHit: false,
    startTime: null,
    noteStartTime: null,
    results: [],
    melodyProgress: {},
    audioContext: null,
    analyser: null,
    isRecordingMic: false,
    animationId: null,
    stream: null,
    playTimeout: null,
    sendInterval: null,
    lastSendTime: 0,
    totalRecordingTime: 0,
    successfulHits: 0,
    totalAttempts: 0,
    noteEls: [],
    melodyName: '',
    isAutoPlaying: false,
    autoPlayTimeout: null,
    recordingStartTimestamp: null,
    blockTimings: [],
    totalHitTime: 0,
    noteHitTimes: [],
    movingNoteStart: null,
    blockProgress: 0,
    bestPercentage: 0,
    totalScore: 0,
    segmentHits: 0,
    segmentAttempts: 0,
    segmentTime: 0
};

let melodyNoteBlocks = [];
let melodyBlockAnimId = null;
let blockAnimationActive = false;

function clearMelodyBlocks() {
    const track = document.getElementById('melodyTunerTrack');
    if (track) {
        track.querySelectorAll('.melody-note-block').forEach(b => b.remove());
    }
    melodyNoteBlocks = [];
    blockAnimationActive = false;
    if (melodyBlockAnimId) {
        cancelAnimationFrame(melodyBlockAnimId);
        melodyBlockAnimId = null;
    }
}

function getNoteTopPercent(noteName, isHard) {
    if (!isHard) {
        const notePositions = { 'Си': 10, 'Ля': 22, 'Соль': 34, 'Фа': 46, 'Ми': 58, 'Ре': 70, 'До': 82 };
        for (const [name, pos] of Object.entries(notePositions)) {
            if (noteName.includes(name)) return pos;
        }
        return 50;
    }
    
    let minFreq = Infinity;
    let maxFreq = -Infinity;
    const validNotes = melodyState.notes.filter(n => n !== '-');
    
    validNotes.forEach(n => {
        const data = NOTES_RU[n];
        if (data && data.freq) {
            if (data.freq < minFreq) minFreq = data.freq;
            if (data.freq > maxFreq) maxFreq = data.freq;
        }
    });
    
    if (noteName === '-') return 50;
    
    const noteData = NOTES_RU[noteName];
    if (!noteData || !noteData.freq) return 50;
    
    const freqRange = maxFreq - minFreq;
    if (freqRange === 0) return 50;
    
    const normalized = (noteData.freq - minFreq) / freqRange;
    return 90 - normalized * 80;
}

function initMelodyTunerBlocks() {
    clearMelodyBlocks();
    
    const track = document.getElementById('melodyTunerTrack');
    if (!track) {
        return;
    }
    
    const trackWidth = track.offsetWidth || 800;
    const startX = trackWidth * 0.85;
    const isHard = melodyState.currentMelodyType === 'hard';
    const PIXELS_PER_SECOND = 160;
    const GAP = 6;
    
    let currentX = startX;
    let totalBlocksWidth = 0;
    
    melodyState.durations.forEach((duration, index) => {
        const noteName = melodyState.notes[index] || '-';
        const isPause = noteName === '-';
        
        let topPercent = 50;
        
        if (isHard) {
            let minFreq = Infinity;
            let maxFreq = -Infinity;
            const validNotes = melodyState.notes.filter(n => n !== '-');
            
            validNotes.forEach(n => {
                const data = NOTES_RU[n];
                if (data && data.freq) {
                    if (data.freq < minFreq) minFreq = data.freq;
                    if (data.freq > maxFreq) maxFreq = data.freq;
                }
            });
            
            if (noteName !== '-') {
                const noteData = NOTES_RU[noteName];
                if (noteData && noteData.freq) {
                    const freqRange = maxFreq - minFreq;
                    if (freqRange > 0) {
                        const normalized = (noteData.freq - minFreq) / freqRange;
                        topPercent = 90 - normalized * 80;
                    }
                }
            } else {
                topPercent = 50;
            }
        } else {
            const notePositions = { 'Си': 10, 'Ля': 22, 'Соль': 34, 'Фа': 46, 'Ми': 58, 'Ре': 70, 'До': 82 };
            for (const [name, pos] of Object.entries(notePositions)) {
                if (noteName.includes(name)) {
                    topPercent = pos;
                    break;
                }
            }
        }
        
        const blockWidth = Math.max(duration * PIXELS_PER_SECOND, 20);
        
        const block = document.createElement('div');
        block.className = 'melody-note-block waiting';
        block.dataset.index = index;
        
        if (isPause) {
            block.style.cssText = `
                position: absolute;
                top: calc(${topPercent}%);
                height: 32px;
                width: ${blockWidth}px;
                left: ${currentX}px;
                background: transparent;
                border: 2px solid transparent;
                border-radius: 4px;
                z-index: 2;
                pointer-events: none;
                box-sizing: border-box;
                transition: none;
                opacity: 0;
            `;
        } else {
            block.style.cssText = `
                position: absolute;
                top: calc(${topPercent}%);
                height: 32px;
                width: ${blockWidth}px;
                left: ${currentX}px;
                background: rgba(74, 158, 255, 0.7);
                border: 2px solid #4a9eff;
                border-radius: 4px;
                z-index: 2;
                pointer-events: none;
                box-sizing: border-box;
                transition: none;
                opacity: 0.7;
            `;
        }
        
        track.appendChild(block);
        melodyNoteBlocks.push({
            el: block,
            startX: currentX,
            duration: duration,
            index: index,
            noteName: noteName,
            blockWidth: blockWidth,
            isPause: isPause,
            topPercent: topPercent
        });
        
        currentX += blockWidth + GAP;
        totalBlocksWidth += blockWidth + GAP;
    });
    
}

function startMovingBlocks() {
    if (melodyBlockAnimId) {
        cancelAnimationFrame(melodyBlockAnimId);
        melodyBlockAnimId = null;
    }
    
    const track = document.getElementById('melodyTunerTrack');
    if (!track) return;
    
    const trackWidth = track.offsetWidth || 800;
    const targetLineX = trackWidth * 0.3;
    const totalDuration = melodyState.durations.reduce((a, b) => a + b, 0);
    const PIXELS_PER_SECOND = 160;
    
    blockAnimationActive = true;
    melodyState.recordingStartTimestamp = Date.now();
    
    function animate() {
        if (!blockAnimationActive) {
            melodyBlockAnimId = null;
            return;
        }
        
        if (!melodyState.isRecording) {
            blockAnimationActive = false;
            melodyBlockAnimId = null;
            return;
        }
        
        const now = Date.now();
        const elapsed = (now - melodyState.recordingStartTimestamp) / 1000;
        
        let currentIndex = 0;
        let accumulated = 0;
        for (let i = 0; i < melodyState.durations.length; i++) {
            accumulated += melodyState.durations[i];
            if (elapsed < accumulated) {
                currentIndex = i;
                break;
            }
            currentIndex = i + 1;
        }
        
        if (currentIndex < melodyState.totalNotes && melodyState.currentNoteIndex !== currentIndex) {
            melodyState.currentNoteIndex = currentIndex;
            updateCurrentNote();
            const isPause = melodyState.notes[currentIndex] === '-';
        }
        
        melodyNoteBlocks.forEach((blockData) => {
            const block = blockData.el;
            const index = blockData.index;
            const blockWidth = blockData.blockWidth;
            const duration = blockData.duration;
            const isPause = blockData.isPause;
            
            let blockStart = 0;
            for (let i = 0; i < index; i++) {
                blockStart += melodyState.durations[i];
            }
            const blockEnd = blockStart + duration;
            
            const centerTime = blockStart + duration / 2;
            const offset = (centerTime - elapsed) * PIXELS_PER_SECOND;
            const newLeft = targetLineX + offset - blockWidth / 2;
            
            block.style.left = newLeft + 'px';
            
            const isDone = elapsed > blockEnd;
            const isCurrent = elapsed >= blockStart && elapsed < blockEnd;
            
            if (isPause) {
                block.style.opacity = '0';
                block.style.background = 'transparent';
                block.style.borderColor = 'transparent';
                block.style.boxShadow = 'none';
                return;
            }
            
            if (isDone) {
                block.style.opacity = '0.3';
                block.style.background = 'rgba(74, 158, 255, 0.3)';
                block.style.borderColor = 'rgba(74, 158, 255, 0.3)';
                block.style.boxShadow = 'none';
            } else if (isCurrent) {
                block.style.opacity = '1';
                block.style.background = 'rgba(74, 158, 255, 0.9)';
                block.style.borderColor = '#4a9eff';
                block.style.boxShadow = '0 0 25px rgba(74, 158, 255, 0.6)';
            } else {
                block.style.opacity = '0.6';
                block.style.background = 'rgba(74, 158, 255, 0.5)';
                block.style.borderColor = '#4a9eff';
                block.style.boxShadow = 'none';
            }
        });
        
        if (elapsed >= totalDuration + 0.5) {
            blockAnimationActive = false;
            melodyBlockAnimId = null;
            
            if (melodyState.isRecording) {
                melodyState.isRecording = false;
                melodyStop();
            }
            return;
        }
        
        melodyBlockAnimId = requestAnimationFrame(animate);
    }
    
    animate();
}

function showMelodyGame() {
    const header = document.querySelector('.learning-header');
    const list = document.querySelector('.melody-container');
    const game = document.getElementById('melodyGame');
    const tuner = document.getElementById('melodyTuner');
    const result = document.getElementById('melodyResult');
    
    if (header) {
        header.style.display = 'none';
        header.setAttribute('style', 'display: none !important;');
    }
    if (list) {
        list.style.display = 'none';
        list.setAttribute('style', 'display: none !important;');
    }
    if (game) {
        game.style.display = 'flex';
        game.setAttribute('style', 'display: flex !important;');
    }
    if (tuner) {
        tuner.style.display = 'block';
        tuner.setAttribute('style', 'display: block !important;');
    }
    if (result) {
        result.style.display = 'none';
        result.setAttribute('style', 'display: none !important;');
    }
}

function showMelodyList() {
    const header = document.querySelector('.learning-header');
    const list = document.querySelector('.melody-container');
    const game = document.getElementById('melodyGame');
    const tuner = document.getElementById('melodyTuner');
    const result = document.getElementById('melodyResult');
    
    if (header) {
        header.style.display = 'block';
        header.setAttribute('style', 'display: block !important;');
    }
    if (list) {
        list.style.display = 'block';
        list.setAttribute('style', 'display: block !important;');
    }
    if (game) {
        game.style.display = 'none';
        game.setAttribute('style', 'display: none !important;');
    }
    if (tuner) {
        tuner.style.display = 'none';
        tuner.setAttribute('style', 'display: none !important;');
    }
    if (result) {
        result.style.display = 'none';
        result.setAttribute('style', 'display: none !important;');
    }
}

function showTuner() {
    const tuner = document.getElementById('melodyTuner');
    if (tuner) {
        tuner.style.display = 'block';
        tuner.setAttribute('style', 'display: block !important;');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadMelodyProgress();
    const urlParams = new URLSearchParams(window.location.search);
    const melody = urlParams.get('melody');
    const type = urlParams.get('type');
    const index = urlParams.get('index');
    
    if (melody && type && index !== null) {
        setTimeout(() => {
            selectMelody(type, parseInt(index));
        }, 100);
    }
});

function toggleMelodySection(header) {
    const section = header.parentElement;
    section.classList.toggle('open');
}

function loadMelodyProgress() {
    fetch('/api/user/melody-progress')
        .then(response => response.json())
        .then(data => {
            melodyState.melodyProgress = data;
            updateMelodyUI();
        })
        .catch(err => console.error('Ошибка загрузки прогресса мелодий:', err));
}

function updateMelodyUI() {
    
    if (melodyState.melodyProgress) {
        if (melodyState.melodyProgress.light) {
            const lightKeys = Object.keys(melodyState.melodyProgress.light);
            lightKeys.forEach((key, index) => {
                const progress = melodyState.melodyProgress.light[key];
                const el = document.getElementById(`melodyLight${index}`);
                if (el) el.textContent = progress + '%';
            });
        }
        
        if (melodyState.melodyProgress.hard) {
            const hardKeys = Object.keys(melodyState.melodyProgress.hard);
            hardKeys.forEach((key, index) => {
                const progress = melodyState.melodyProgress.hard[key];
                const el = document.getElementById(`melodyHard${index}`);
                if (el) el.textContent = progress + '%';
            });
        }
    }
}

function selectMelody(type, index) {const melodies = type === 'light' ? MELODIES.light : type === 'hard' ? MELODIES.hard : MELODIES.user;
    const keys = Object.keys(melodies);
    const key = keys[index];
    
    if (!key) return;
    
    const url = new URL(window.location);
    url.searchParams.set('melody', key);
    url.searchParams.set('type', type);
    url.searchParams.set('index', index);
    window.history.pushState({}, '', url);
    
    const melody = melodies[key];
    
    melodyState.currentMelody = key;
    melodyState.currentMelodyKey = key;
    melodyState.currentMelodyType = type;
    melodyState.notes = melody.notes;
    melodyState.durations = melody.durations;
    melodyState.lyrics = melody.lyrics;
    melodyState.totalNotes = melody.notes.length;
    melodyState.currentNoteIndex = 0;
    melodyState.score = 0;
    melodyState.results = [];
    melodyState.hitTime = 0;
    melodyState.successfulHits = 0;
    melodyState.totalAttempts = 0;
    melodyState.totalRecordingTime = 0;
    melodyState.isComplete = false;
    melodyState.noteEls = [];
    melodyState.melodyName = key;
    melodyState.isAutoPlaying = false;
    melodyState.totalHitTime = 0;
    melodyState.noteHitTimes = [];
    melodyState.blockProgress = 0;
    melodyState.bestPercentage = 0;
    melodyState.totalScore = 0;
    melodyState.segmentHits = 0;
    melodyState.segmentAttempts = 0;
    melodyState.segmentTime = 0;
    
    showMelodyGame();
    
    const title = document.getElementById('melodyTitle');
    if (title) {
        title.textContent = key;
    }
    
    const playBtn = document.getElementById('melodyPlayBtn');
    const recordBtn = document.getElementById('melodyRecordBtn');
    
    if (playBtn) {
        playBtn.style.display = 'none';
    }
    if (recordBtn) {
        recordBtn.textContent = 'Идет воспроизведение...';
        recordBtn.disabled = true;
        recordBtn.style.background = 'linear-gradient(135deg, #888, #666)';
        recordBtn.style.cursor = 'not-allowed';
    }
    
    resetMelodyArrow();
    drawMelodyStaff();
    
    const scale = document.getElementById('melodyTunerScale');
    if (scale) {
        if (melodyState.currentMelodyType === 'hard') {
            scale.style.display = 'none';
        } else {
            scale.style.display = 'block';
        }
    }
    
    setTimeout(() => {
        startAutoPlay();
    }, 300);
}

function startAutoPlay() {
    if (melodyState.isAutoPlaying) return;
    if (melodyState.isRecording) return;
    
    melodyState.isAutoPlaying = true;
    melodyState.currentNoteIndex = 0;
    melodyState.isComplete = false;
    skipRequested = false;
    document.getElementById('melodyResult').style.display = 'none';
    
    const recordBtn = document.getElementById('melodyRecordBtn');
    if (recordBtn) {
        recordBtn.textContent = 'Пропустить';
        recordBtn.disabled = false;
        recordBtn.style.background = 'linear-gradient(135deg, #888, #666)';
        recordBtn.style.cursor = 'pointer';
        recordBtn.onclick = function() {
            skipAutoPlay();
        };
    }
    
    playNextNoteAuto();
}

function playNextNoteAuto() {
    if (!melodyState.isAutoPlaying) return;
    
    const index = melodyState.currentNoteIndex;
    if (index >= melodyState.totalNotes) {
        finishAutoPlay();
        return;
    }
    
    const noteName = melodyState.notes[index];
    const duration = melodyState.durations[index];
    
    if (noteName !== '-') {
        playNoteByFrequency(NOTE_FREQ_MAP[noteName]);
    }
    updateCurrentNote();
    
    const delay = duration * 1000 + 50;
    melodyState.autoPlayTimeout = setTimeout(() => {
        if (melodyState.isAutoPlaying) {
            melodyState.currentNoteIndex++;
            playNextNoteAuto();
        }
    }, delay);
}

function finishAutoPlay() {
    melodyState.isAutoPlaying = false;
    melodyState.isComplete = true;
    
    const skipBtn = document.getElementById('melodySkipBtn');
    if (skipBtn) {
        skipBtn.style.display = 'none';
    }
    
    const recordBtn = document.getElementById('melodyRecordBtn');
    if (recordBtn) {
        recordBtn.textContent = 'Записать';
        recordBtn.disabled = false;
        recordBtn.style.background = 'linear-gradient(135deg, #ff1744, #ff5252)';
        recordBtn.style.cursor = 'pointer';
        recordBtn.onclick = function() {
            melodyRecord();
        };
    }
}

function stopAutoPlay() {
    melodyState.isAutoPlaying = false;
    clearTimeout(melodyState.autoPlayTimeout);
    if (melodyBlockAnimId) {
        cancelAnimationFrame(melodyBlockAnimId);
        melodyBlockAnimId = null;
    }
}

function goBackToMelodyList() {
    stopAutoPlay();
    clearMelodyBlocks();
    
    const url = new URL(window.location);
    url.searchParams.delete('melody');
    url.searchParams.delete('type');
    url.searchParams.delete('index');
    window.history.pushState({}, '', url);
    
    if (melodyState.isRecording) {
        melodyStop();
    }
    
    const resultScreen = document.getElementById('melodyResultScreen');
    if (resultScreen) {
        resultScreen.style.display = 'none';
        resultScreen.classList.remove('active');
    }
    
    const result = document.getElementById('melodyResult');
    if (result) {
        result.style.display = 'none';
    }
    
    const recordBtn = document.getElementById('melodyRecordBtn');
    if (recordBtn) {
        recordBtn.textContent = 'Записать';
        recordBtn.disabled = false;
        recordBtn.style.background = 'linear-gradient(135deg, #ff1744, #ff5252)';
        recordBtn.onclick = function() {
            melodyRecord();
        };
    }
    
    showMelodyList();
    melodyState.currentNoteIndex = 0;
    melodyState.isComplete = false;
}

function drawMelodyStaff() {
    const wrapper = document.getElementById('melodyStaffWrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';
    melodyState.noteEls = [];
    
    const linesContainer = document.createElement('div');
    linesContainer.className = 'staff-lines';
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'staff-line';
        line.style.top = (i * 20) + 'px';
        linesContainer.appendChild(line);
    }
    wrapper.appendChild(linesContainer);
    
    const staffY = 20;
    const spacing = 20;
    const noteSpacing = 80;
    const isHard = melodyState.currentMelodyType === 'hard';
    
    melodyState.notes.forEach((noteName, index) => {
        const noteLeft = 50 + index * noteSpacing;
        const duration = melodyState.durations[index];
        const isPause = noteName === '-';
        
        let actualNoteName = noteName;
        if (isPause) {
            actualNoteName = 'Фа';
        }
        
        const noteData = NOTES_RU[actualNoteName];
        if (!noteData) return;
        
        const noteY = staffY + noteData.position * spacing + 2;
        const isCurrent = index === melodyState.currentNoteIndex;
        
        const noteEl = document.createElement('div');
        noteEl.className = 'melody-note';
        if (isCurrent && !isPause) noteEl.classList.add('current');
        noteEl.style.left = noteLeft + 'px';
        noteEl.style.position = 'absolute';
        noteEl.style.zIndex = '2';
        noteEl.dataset.index = index;
        noteEl.title = actualNoteName;
        
        drawNoteOnStaffFunc(noteEl, duration, noteY, isCurrent, isPause, actualNoteName);
        
        const lyric = document.createElement('div');
        lyric.className = 'melody-lyric';
        lyric.textContent = melodyState.lyrics[index] || '';
        lyric.style.cssText = `
            position: absolute;
            top: -10px; 
            left: 50%;
            transform: translateX(-50%);
            font-size: ${isCurrent && !isPause ? '1.8' : '1.5'}vh;
            font-weight: 700;
            color: ${isPause ? 'transparent' : (isCurrent ? '#4a9eff' : '#888')};
            white-space: nowrap;
            text-shadow: ${isCurrent && !isPause ? '0 0 30px rgba(74,158,255,0.5)' : 'none'};
            transition: all 0.3s ease;
            background: ${isCurrent && !isPause ? 'rgba(74,158,255,0.2)' : 'transparent'};
            padding: 0.2vh 0.8vh;
            border-radius: 0.5vh;
            pointer-events: none;
        `;
        noteEl.appendChild(lyric);
        
        noteEl.addEventListener('click', function(e) {
            e.stopPropagation();
            const freq = NOTE_FREQ_MAP[actualNoteName];
            if (freq) playNoteByFrequency(freq);
        });
        
        wrapper.appendChild(noteEl);
        melodyState.noteEls.push(noteEl);
    });
    
    const totalWidth = 50 + melodyState.notes.length * noteSpacing + 200;
    wrapper.style.width = totalWidth + 'px';
    wrapper.style.minWidth = '100%';
    
    setTimeout(() => {
        const container = document.getElementById('melodyStaffScroll');
        const currentNote = wrapper.querySelector('.melody-note.current');
        if (currentNote && container) {
            const left = parseInt(currentNote.style.left);
            container.scrollLeft = left - 150;
        }
    }, 100);
}

function drawNoteOnStaffFunc(noteEl, duration, noteY, isCurrent, isPause, noteName) {
    const color = isCurrent ? '#4a9eff' : '#888';
    const opacity = isPause ? 0 : 1;
    const isHard = melodyState.currentMelodyType === 'hard';
    
    const hasAccidental = noteName && (noteName.includes('♭') || noteName.includes('♯'));
    
    const dotSize = duration >= 4 ? 20 : duration >= 2 ? 18 : duration >= 1 ? 16 : duration >= 0.5 ? 14 : 12;
    const dotHeight = duration >= 4 ? 14 : duration >= 2 ? 12 : duration >= 1 ? 12 : duration >= 0.5 ? 10 : 8;
    if (duration === 3) {
        const dot = document.createElement('div');
        dot.className = 'note-dot';
        dot.style.cssText = `
            position: absolute;
            width: 18px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid ${color};
            background: transparent;
            left: 0;
            top: ${noteY}px;
            transform: translateY(-50%);
            box-sizing: border-box;
            opacity: ${opacity};
        `;
        noteEl.appendChild(dot);
        
        const stem = document.createElement('div');
        stem.className = 'note-stem';
        stem.style.cssText = `
            position: absolute;
            width: 2px;
            height: 40px;
            background: ${color};
            left: 18px;
            top: ${noteY}px;
            transform: translateY(-100%);
            border-radius: 1px;
            opacity: ${opacity};
        `;
        noteEl.appendChild(stem);
        
        const dotPoint = document.createElement('div');
        dotPoint.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${color};
            left: 24px;
            top: ${noteY}px;
            transform: translateY(-50%);
            box-sizing: border-box;
            opacity: ${opacity};
        `;
        noteEl.appendChild(dotPoint);
        
        if (isHard && hasAccidental) {
            const acc = document.createElement('div');
            acc.style.cssText = `
                position: absolute;
                font-size: 16px;
                font-weight: 700;
                color: ${color};
                left: -18px;
                top: ${noteY}px;
                transform: translateY(-50%);
                opacity: ${opacity};
            `;
            acc.textContent = noteName.includes('♭') ? '♭' : '♯';
            noteEl.appendChild(acc);
        }
        return;
    }
    if (duration === 1.5) {
        const dot = document.createElement('div');
        dot.className = 'note-dot';
        dot.style.cssText = `
            position: absolute;
            width: 16px;
            height: 12px;
            border-radius: 50%;
            background: ${color};
            left: 0;
            top: ${noteY}px;
            transform: translateY(-50%);
            box-sizing: border-box;
            opacity: ${opacity};
        `;
        noteEl.appendChild(dot);
        
        const stem = document.createElement('div');
        stem.className = 'note-stem';
        stem.style.cssText = `
            position: absolute;
            width: 2px;
            height: 40px;
            background: ${color};
            left: 16px;
            top: ${noteY}px;
            transform: translateY(-100%);
            border-radius: 1px;
            opacity: ${opacity};
        `;
        noteEl.appendChild(stem);
        
        const dotPoint = document.createElement('div');
        dotPoint.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${color};
            left: 22px;
            top: ${noteY}px;
            transform: translateY(-50%);
            box-sizing: border-box;
            opacity: ${opacity};
        `;
        noteEl.appendChild(dotPoint);
        
        if (isHard && hasAccidental) {
            const acc = document.createElement('div');
            acc.style.cssText = `
                position: absolute;
                font-size: 16px;
                font-weight: 700;
                color: ${color};
                left: -18px;
                top: ${noteY}px;
                transform: translateY(-50%);
                opacity: ${opacity};
            `;
            acc.textContent = noteName.includes('♭') ? '♭' : '♯';
            noteEl.appendChild(acc);
        }
        return;
    }
    if (duration === 2) {
        const dot = document.createElement('div');
        dot.className = 'note-dot';
        dot.style.cssText = `
            position: absolute;
            width: 18px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid ${color};
            background: transparent;
            left: 0;
            top: ${noteY}px;
            transform: translateY(-50%);
            box-sizing: border-box;
            opacity: ${opacity};
        `;
        noteEl.appendChild(dot);
        
        const stem = document.createElement('div');
        stem.className = 'note-stem';
        stem.style.cssText = `
            position: absolute;
            width: 2px;
            height: 40px;
            background: ${color};
            left: 18px;
            top: ${noteY}px;
            transform: translateY(-100%);
            border-radius: 1px;
            opacity: ${opacity};
        `;
        noteEl.appendChild(stem);
        
        if (isHard && hasAccidental) {
            const acc = document.createElement('div');
            acc.style.cssText = `
                position: absolute;
                font-size: 16px;
                font-weight: 700;
                color: ${color};
                left: -18px;
                top: ${noteY}px;
                transform: translateY(-50%);
                opacity: ${opacity};
            `;
            acc.textContent = noteName.includes('♭') ? '♭' : '♯';
            noteEl.appendChild(acc);
        }
        return;
    }
    if (duration === 1) {
        const dot = document.createElement('div');
        dot.className = 'note-dot';
        dot.style.cssText = `
            position: absolute;
            width: 16px;
            height: 12px;
            border-radius: 50%;
            background: ${color};
            left: 0;
            top: ${noteY}px;
            transform: translateY(-50%);
            box-sizing: border-box;
            opacity: ${opacity};
        `;
        noteEl.appendChild(dot);
        
        const stem = document.createElement('div');
        stem.className = 'note-stem';
        stem.style.cssText = `
            position: absolute;
            width: 2px;
            height: 40px;
            background: ${color};
            left: 16px;
            top: ${noteY}px;
            transform: translateY(-100%);
            border-radius: 1px;
            opacity: ${opacity};
        `;
        noteEl.appendChild(stem);
        
        if (isHard && hasAccidental) {
            const acc = document.createElement('div');
            acc.style.cssText = `
                position: absolute;
                font-size: 16px;
                font-weight: 700;
                color: ${color};
                left: -18px;
                top: ${noteY}px;
                transform: translateY(-50%);
                opacity: ${opacity};
            `;
            acc.textContent = noteName.includes('♭') ? '♭' : '♯';
            noteEl.appendChild(acc);
        }
        return;
    }
    if (duration === 0.5) {
        const dot = document.createElement('div');
        dot.className = 'note-dot';
        dot.style.cssText = `
            position: absolute;
            width: 14px;
            height: 10px;
            border-radius: 50%;
            background: ${color};
            left: 0;
            top: ${noteY}px;
            transform: translateY(-50%);
            box-sizing: border-box;
            opacity: ${opacity};
        `;
        noteEl.appendChild(dot);
        
        const stem = document.createElement('div');
        stem.className = 'note-stem';
        stem.style.cssText = `
            position: absolute;
            width: 2px;
            height: 40px;
            background: ${color};
            left: 14px;
            top: ${noteY}px;
            transform: translateY(-100%);
            border-radius: 1px;
            opacity: ${opacity};
        `;
        noteEl.appendChild(stem);
    
        const flag = document.createElement('div');
        flag.className = 'note-flag';
        flag.style.cssText = `
            position: absolute;
            width: 16px;
            height: 2px;
            background: ${color};
            left: 16px;
            top: ${noteY - 40}px;
            transform: rotate(60deg);
            border-radius: 1px;
            transform-origin: left center;
            opacity: ${opacity};
        `;
        noteEl.appendChild(flag);

        const flag1 = document.createElement('div');
        flag1.className = 'note-flag';
        flag1.style.cssText = `
            position: absolute;
            width: 16px;
            height: 2px;
            background: ${color};
            left: 24px;
            top: ${noteY - 29}px;
            transform: rotate(90deg);
            border-radius: 1px;
            transform-origin: left center;
            opacity: ${opacity};
        `;
        noteEl.appendChild(flag1);

        if (isHard && hasAccidental) {
            const acc = document.createElement('div');
            acc.style.cssText = `
                position: absolute;
                font-size: 16px;
                font-weight: 700;
                color: ${color};
                left: -18px;
                top: ${noteY}px;
                transform: translateY(-50%);
                opacity: ${opacity};
            `;
            acc.textContent = noteName.includes('♭') ? '♭' : '♯';
            noteEl.appendChild(acc);
        }
        return;
    }
    const dot = document.createElement('div');
    dot.className = 'note-dot';
    dot.style.cssText = `
        position: absolute;
        width: 12px;
        height: 8px;
        border-radius: 50%;
        background: ${color};
        left: 0;
        top: ${noteY}px;
        transform: translateY(-50%);
        box-sizing: border-box;
        opacity: ${opacity};
    `;
    noteEl.appendChild(dot);
    
    const stem = document.createElement('div');
    stem.className = 'note-stem';
    stem.style.cssText = `
        position: absolute;
        width: 2px;
        height: 40px;
        background: ${color};
        left: 12px;
        top: ${noteY}px;
        transform: translateY(-100%);
        border-radius: 1px;
        opacity: ${opacity};
    `;
    noteEl.appendChild(stem);
    
    const flag1 = document.createElement('div');
    flag1.className = 'note-flag';
    flag1.style.cssText = `
        position: absolute;
        width: 14px;
        height: 2px;
        background: ${color};
        left: 14px;
        top: ${noteY - 18}px;
        transform: rotate(135deg);
        border-radius: 1px;
        transform-origin: left center;
        opacity: ${opacity};
    `;
    noteEl.appendChild(flag1);
    
    const flag2 = document.createElement('div');
    flag2.className = 'note-flag';
    flag2.style.cssText = `
        position: absolute;
        width: 12px;
        height: 2px;
        background: ${color};
        left: 14px;
        top: ${noteY - 12}px;
        transform: rotate(135deg);
        border-radius: 1px;
        transform-origin: left center;
        opacity: ${opacity};
    `;
    noteEl.appendChild(flag2);
    
    if (isHard && hasAccidental) {
        const acc = document.createElement('div');
        acc.style.cssText = `
            position: absolute;
            font-size: 16px;
            font-weight: 700;
            color: ${color};
            left: -18px;
            top: ${noteY}px;
            transform: translateY(-50%);
            opacity: ${opacity};
        `;
        acc.textContent = noteName.includes('♭') ? '♭' : '♯';
        noteEl.appendChild(acc);
    }
}

function updateCurrentNote() {
    const notes = document.querySelectorAll('.melody-note');
    notes.forEach((el, index) => {
        el.classList.remove('current');
        const isCurrent = index === melodyState.currentNoteIndex;
        const isPause = melodyState.notes[index] === '-';
        
        if (isCurrent && !isPause) {
            el.classList.add('current');
            const dot = el.querySelector('.note-dot');
            const stem = el.querySelector('.note-stem');
            const lyric = el.querySelector('.melody-lyric');
            const flags = el.querySelectorAll('.note-flag');
            const acc = el.querySelector('.note-accidental');
            const color = '#4a9eff';
            
            if (dot) {
                dot.style.borderColor = color;
                const duration = melodyState.durations[index];
                if (duration >= 2) {
                    dot.style.background = 'transparent';
                } else {
                    dot.style.background = color;
                }
                dot.style.opacity = '1';
            }
            if (stem) {
                stem.style.background = color;
                stem.style.opacity = '1';
            }
            if (lyric) {
                lyric.style.color = color;
                lyric.style.background = 'rgba(74,158,255,0.2)';
                lyric.style.textShadow = '0 0 30px rgba(74,158,255,0.5)';
                lyric.style.fontSize = '1.8vh';
                lyric.style.opacity = '1';
            }
            if (acc) {
                acc.style.color = color;
                acc.style.opacity = '1';
            }
            flags.forEach(f => {
                f.style.background = color;
                f.style.opacity = '1';
            });
        } else {
            const dot = el.querySelector('.note-dot');
            const stem = el.querySelector('.note-stem');
            const lyric = el.querySelector('.melody-lyric');
            const flags = el.querySelectorAll('.note-flag');
            const acc = el.querySelector('.note-accidental');
            
            if (isPause) {
                if (dot) dot.style.opacity = '0';
                if (stem) stem.style.opacity = '0';
                if (lyric) {
                    lyric.style.color = 'transparent';
                    lyric.style.background = 'transparent';
                    lyric.style.textShadow = 'none';
                    lyric.style.fontSize = '1.5vh';
                    lyric.style.opacity = '0';
                }
                if (acc) acc.style.opacity = '0';
                flags.forEach(f => f.style.opacity = '0');
                return;
            }
            
            const color = '#888';
            
            if (dot) {
                dot.style.borderColor = color;
                const duration = melodyState.durations[index];
                if (duration >= 2) {
                    dot.style.background = 'transparent';
                } else {
                    dot.style.background = color;
                }
                dot.style.opacity = '1';
            }
            if (stem) {
                stem.style.background = color;
                stem.style.opacity = '1';
            }
            if (lyric) {
                lyric.style.color = color;
                lyric.style.background = 'transparent';
                lyric.style.textShadow = 'none';
                lyric.style.fontSize = '1.5vh';
                lyric.style.opacity = '1';
            }
            if (acc) {
                acc.style.color = color;
                acc.style.opacity = '1';
            }
            flags.forEach(f => {
                f.style.background = color;
                f.style.opacity = '1';
            });
        }
    });
    
    const container = document.getElementById('melodyStaffScroll');
    const currentNote = document.querySelector('.melody-note.current');
    if (currentNote && container) {
        const left = parseInt(currentNote.style.left);
        container.scrollTo({ left: left - 150, behavior: 'smooth' });
    }
}

function melodyRecord() {
    if (melodyState.isAutoPlaying) stopAutoPlay();
    if (melodyState.isRecording) {
        return;
    }
    
    const recordBtn = document.getElementById('melodyRecordBtn');
    if (recordBtn) {
        recordBtn.onclick = function() {
            melodyRecord();
        };
    }
    
    Object.assign(melodyState, {
        currentNoteIndex: 0,
        hitTime: 0,
        isHit: false,
        lastHitTime: null,
        results: [],
        successfulHits: 0,
        totalAttempts: 0,
        totalRecordingTime: 0,
        isComplete: false,
        isRecording: true,
        recordingStartTimestamp: Date.now(),
        segmentHits: 0,
        segmentAttempts: 0,
        totalScore: 0,
        bestPercentage: 0,
        lastSendTime: Date.now()
    });
    
    document.getElementById('melodyResult').style.display = 'none';
    
    if (recordBtn) {
        recordBtn.textContent = 'Идет запись...';
        recordBtn.disabled = true;
        recordBtn.style.background = 'linear-gradient(135deg, #555, #333)';
    }
    
    initMelodyTunerBlocks();
    
    setTimeout(() => {
        startMovingBlocks();
    }, 100);
    
    startMicrophone().then(success => {
        if (!success) {
            showMelodyFeedback('Нет доступа к микрофону', 'error');
            melodyStop();
            return;
        }
        melodyState.isRecordingMic = true;
        startRecordingLoop();
        startSendInterval();
    });
}

function melodyStop() {
    blockAnimationActive = false;
    if (melodyBlockAnimId) {
        cancelAnimationFrame(melodyBlockAnimId);
        melodyBlockAnimId = null;
    }
    
    if (melodyState.isRecording) {
        melodyState.isRecording = false;
        stopMicrophone();
        cancelAnimationFrame(melodyState.animationId);
        clearInterval(melodyState.sendInterval);
        
        const recordBtn = document.getElementById('melodyRecordBtn');
        if (recordBtn) {
            recordBtn.textContent = 'Записать';
            recordBtn.style.background = 'linear-gradient(135deg, #ff1744, #ff5252)';
            recordBtn.disabled = false;
        }
        
        showMelodyResultFinal();
    } else {
        if (melodyState.bestPercentage > 0 || melodyState.totalScore > 0) {
            showMelodyResultFinal();
        } 
    }
    
    melodyState.isPaused = false;
}

function resetMelodyArrow() {
    melodyArrowSmooth = 50;
    melodyVoiceArrow = document.getElementById('melodyVoiceArrow');
    melodyTunerTrack = document.getElementById('melodyTunerTrack');
    if (melodyVoiceArrow) {
        melodyVoiceArrow.style.top = '50%';
        melodyVoiceArrow.className = 'voice-arrow';
        melodyVoiceArrow.style.color = '#4a9eff';
        const head = melodyVoiceArrow.querySelector('.arrow-head');
        if (head) {
            head.style.color = 'white';
            head.style.textShadow = '0 0 10px rgba(0,0,0,0.5)';
        }
    }
}

function startRecordingLoop() {
    if (!melodyState.isRecording || melodyState.isPaused) {
        melodyState.animationId = requestAnimationFrame(startRecordingLoop);
        return;
    }
    
    if (!isRecording || !analyser) {
        melodyState.animationId = requestAnimationFrame(startRecordingLoop);
        return;
    }
    
    const dataArray = getAudioData();
    if (!dataArray) {
        melodyState.animationId = requestAnimationFrame(startRecordingLoop);
        return;
    }
    
    const energy = getAudioEnergy(dataArray);
    const currentNote = melodyState.notes[melodyState.currentNoteIndex];
    const isPause = currentNote === '-';
    
    if (isPause) {
        const arrow = document.getElementById('melodyVoiceArrow');
        if (arrow) {
            arrow.style.color = '#00c853';
            arrow.classList.add('hit');
            const head = arrow.querySelector('.arrow-head');
            if (head) {
                head.style.background = 'linear-gradient(135deg, #00E676, #69F0AE)';
                head.style.boxShadow = '0 0 30px rgba(0, 230, 118, 0.9)';
            }
        }
        
        if (!melodyState.isHit) {
            melodyState.isHit = true;
            melodyState.lastHitTime = Date.now();
        }
        melodyState.successfulHits++;
        melodyState.segmentHits++;
        melodyState.totalHitTime += 0.1;
        melodyState.totalAttempts++;
        melodyState.segmentAttempts++;
        
        melodyState.animationId = requestAnimationFrame(startRecordingLoop);
        return;
    }
    
    if (energy > 0.01) {
        const pitch = detectPitch(dataArray, audioContext.sampleRate);
        if (pitch) {
            const currentNote = melodyState.notes[melodyState.currentNoteIndex];
            if (currentNote && currentNote !== '-') {
                const targetFreq = NOTE_FREQ_MAP[currentNote];
                if (targetFreq) {
                    const normalizedPitch = normalizeToOctave(pitch, targetFreq);
                    updateMelodyArrow(normalizedPitch, targetFreq);
                    checkMelodyHit(normalizedPitch, targetFreq);
                }
            }
        }
    } else {
        const arrow = document.getElementById('melodyVoiceArrow');
        if (arrow) {
            arrow.style.color = '#ff6b6b';
            arrow.classList.remove('hit');
            const head = arrow.querySelector('.arrow-head');
            if (head) {
                head.style.background = 'linear-gradient(135deg, #ff1744, #ff5252)';
                head.style.boxShadow = '0 0 20px rgba(255, 23, 68, 0.7)';
            }
        }
    }
    
    melodyState.animationId = requestAnimationFrame(startRecordingLoop);
}

function updateMelodyArrow(freq, target) {
    const arrow = melodyVoiceArrow || document.getElementById('melodyVoiceArrow');
    const track = melodyTunerTrack || document.getElementById('melodyTunerTrack');
    if (!arrow || !track) return;
    
    const h = track.offsetHeight;
    const isHard = melodyState.currentMelodyType === 'hard';
    
    let closestPos = 50;
    
    if (isHard) {
        let minFreq = Infinity;
        let maxFreq = -Infinity;
        const validNotes = melodyState.notes.filter(n => n !== '-');
        
        validNotes.forEach(n => {
            const data = NOTES_RU[n];
            if (data && data.freq) {
                if (data.freq < minFreq) minFreq = data.freq;
                if (data.freq > maxFreq) maxFreq = data.freq;
            }
        });
        
        const freqRange = maxFreq - minFreq;
        if (freqRange > 0) {
            let closestFreq = Infinity;
            let closestDiff = Infinity;
            
            validNotes.forEach(n => {
                const data = NOTES_RU[n];
                if (data && data.freq) {
                    const diff = Math.abs(freq - data.freq);
                    if (diff < closestDiff) {
                        closestDiff = diff;
                        closestFreq = data.freq;
                    }
                }
            });
            
            if (closestFreq !== Infinity) {
                const normalized = (closestFreq - minFreq) / freqRange;
                closestPos = 90 - normalized * 80;
            }
        }
    } else {
        const notePositions = NOTE_POSITIONS_SMULE;
        let closestDiff = Infinity;
        
        for (const [note, pos] of Object.entries(notePositions)) {
            const noteFreq = NOTE_FREQ_MAP[note];
            if (!noteFreq) continue;
            
            const octaves = [0.25, 0.5, 1, 2, 4];
            for (const octave of octaves) {
                const testFreq = noteFreq * octave;
                const diff = Math.abs(freq - testFreq);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestPos = pos;
                }
            }
        }
    }
    
    const pixelPos = ((closestPos / 100) * h - 14);
    const minPixel = -14;
    const maxPixel = h - 14;
    const clampedTop = Math.max(minPixel, Math.min(maxPixel, pixelPos));
    
    arrow.style.top = clampedTop + 'px';
    
    const currentNote = melodyState.notes[melodyState.currentNoteIndex];
    const isPause = currentNote === '-';
    
    if (isPause) {
        arrow.style.color = '#00c853';
        arrow.classList.add('hit');
        const head = arrow.querySelector('.arrow-head');
        if (head) {
            head.style.background = 'linear-gradient(135deg, #00E676, #69F0AE)';
            head.style.boxShadow = '0 0 30px rgba(0, 230, 118, 0.9)';
        }
        return;
    }
    
    const cents = Math.abs(1200 * Math.log2(freq / target));
    const isInTune = cents < 90;
    
    if (isInTune) {
        arrow.style.color = '#00c853';
        arrow.classList.add('hit');
        const head = arrow.querySelector('.arrow-head');
        if (head) {
            head.style.background = 'linear-gradient(135deg, #00E676, #69F0AE)';
            head.style.boxShadow = '0 0 30px rgba(0, 230, 118, 0.9)';
        }
    } else {
        arrow.style.color = '#ff6b6b';
        arrow.classList.remove('hit');
        const head = arrow.querySelector('.arrow-head');
        if (head) {
            head.style.background = 'linear-gradient(135deg, #ff1744, #ff5252)';
            head.style.boxShadow = '0 0 20px rgba(255, 23, 68, 0.7)';
        }
    }
}

function checkMelodyHit(detectedFreq, targetFreq) {
    const currentNote = melodyState.notes[melodyState.currentNoteIndex];
    
    if (currentNote === '-') {
        if (!melodyState.isHit) {
            melodyState.isHit = true;
            melodyState.lastHitTime = Date.now();
        }
        melodyState.successfulHits++;
        melodyState.segmentHits++;
        melodyState.totalHitTime += 0.1;
        melodyState.totalAttempts++;
        melodyState.segmentAttempts++;
        return;
    }
    
    const cents = Math.abs(1200 * Math.log2(detectedFreq / targetFreq));
    const isInTune = cents < 100;
    
    melodyState.totalAttempts++;
    melodyState.segmentAttempts++;
    
    if (isInTune) {
        if (!melodyState.isHit) {
            melodyState.isHit = true;
            melodyState.lastHitTime = Date.now();
        }
        melodyState.successfulHits++;
        melodyState.segmentHits++;
        melodyState.totalHitTime += 0.1;
    } else {
        if (melodyState.isHit) {
            const hitDuration = Date.now() - melodyState.lastHitTime;
            melodyState.hitTime += hitDuration;
            melodyState.isHit = false;
        }
    }
}

function startSendInterval() {
    clearInterval(melodyState.sendInterval);
    melodyState.sendInterval = setInterval(() => {
        if (!melodyState.isRecording || melodyState.isPaused) {
            return;
        }
        
        const now = Date.now();
        const elapsed = (now - melodyState.lastSendTime) / 1000;
        melodyState.lastSendTime = now;
        melodyState.totalRecordingTime += elapsed;
        
        const totalAttempts = melodyState.segmentAttempts || 0;
        const totalHits = melodyState.segmentHits || 0;
        
        const segmentPercent = totalAttempts > 0 
            ? (totalHits / totalAttempts) * 100 
            : 0;
        
        const roundedPercent = Math.round(segmentPercent);
        const segmentPoints = Math.min(roundedPercent, 100);
        
        melodyState.totalScore += segmentPoints;
        melodyState.score += segmentPoints;
        
        melodyState.results.push({
            time: elapsed,
            success: totalHits > 0,
            percent: roundedPercent,
            points: segmentPoints,
            attempts: totalAttempts,
            hits: totalHits
        });
        
        if (roundedPercent > melodyState.bestPercentage) {
            melodyState.bestPercentage = roundedPercent;
        }
        
        melodyState.segmentHits = 0;
        melodyState.segmentAttempts = 0;
        
    }, 5000);
}

function showMelodyResultFinal() {
    const totalDuration = melodyState.durations.reduce((a, b) => a + b, 0);
    
    const currentPercent = Math.min(100, Math.round((melodyState.hitTime / 1000 / totalDuration) * 100));
    const totalPoints = melodyState.totalScore || 0;
    
    let bestFromDB = 0;
    if (melodyState.melodyProgress && melodyState.melodyProgress.light) {
        bestFromDB = melodyState.melodyProgress.light[melodyState.currentMelodyKey] || 0;
    }
    
    const displayPercent = currentPercent;
    
    let pointsToAdd = 0;
    if (melodyState.currentMelodyType === 'light') {
        pointsToAdd = Math.ceil(currentPercent / 2);
    } else if (melodyState.currentMelodyType === 'hard') {
        pointsToAdd = currentPercent * 2;
    } else {
        pointsToAdd = currentPercent;
    }
    
    saveMelodyResult(currentPercent, pointsToAdd);
    
    const game = document.getElementById('melodyGame');
    const tuner = document.getElementById('melodyTuner');
    const resultScreen = document.getElementById('melodyResultScreen');
    
    if (game) game.style.display = 'none';
    if (tuner) tuner.style.display = 'none';
    if (resultScreen) {
        resultScreen.style.display = 'flex';
        resultScreen.classList.add('active');
    }
    
    const circle = document.getElementById('melodyProgressCircleFill');
    const percentText = document.getElementById('melodyProgressPercent');
    
    if (circle && percentText) {
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (displayPercent / 100) * circumference;
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
                current = Math.round(displayPercent * eased);
                percentText.textContent = current + '%';
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            requestAnimationFrame(update);
        }, 100);
    }
    
    const bestScore = document.getElementById('melodyBestScore');
    const motivation = document.getElementById('melodyMotivationText');
    
    if (bestScore) bestScore.textContent = bestFromDB + '%';
    if (motivation) motivation.textContent = getMotivationByPercentage(displayPercent);
    
    const finalScore = document.getElementById('melodyFinalScore');
    if (finalScore) {
        finalScore.parentElement.style.display = 'none';
    }
    
    const recordBtn = document.getElementById('melodyRecordBtn');
    if (recordBtn) {
        recordBtn.textContent = 'Записать';
        recordBtn.style.background = 'linear-gradient(135deg, #ff1744, #ff5252)';
        recordBtn.disabled = false;
    }
}

function saveMelodyResult(percent, pointsToAdd) {
    let currentProgress = 0;
    if (melodyState.melodyProgress && melodyState.melodyProgress.light) {
        currentProgress = melodyState.melodyProgress.light[melodyState.currentMelodyKey] || 0;
    }
    
    const bestPercent = Math.max(currentProgress, percent);
    
    const data = {
        type: melodyState.currentMelodyType,
        melodyKey: melodyState.currentMelodyKey,
        percentage: bestPercent,
        score: pointsToAdd  
    };
    
    fetch('/api/melody/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            if (!melodyState.melodyProgress.light) {
                melodyState.melodyProgress.light = {};
            }
            melodyState.melodyProgress.light[melodyState.currentMelodyKey] = bestPercent;
            
            const el = document.getElementById('melodyLight0');
            if (el) {
                el.textContent = bestPercent + '%';
            }
            
            if (result.newTotalScore !== undefined) {
                const scoreElements = document.querySelectorAll('#headerScore, #profileScore');
                scoreElements.forEach(el => {
                    if (el) el.textContent = result.newTotalScore;
                });
            }
        }
    })
    .catch(err => console.error('Ошибка сохранения:', err));
}

function showMelodyFeedback(message, type) {
    const container = document.getElementById('melodyResult');
    if (!container) return;
    container.style.display = 'block';
    container.className = 'result-feedback ' + type;
    container.textContent = message;
    setTimeout(() => {
        if (!container.textContent.includes('🎉') && !container.textContent.includes('⛔')) {
            container.style.display = 'none';
        }
    }, 3000);
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

function addUserMelody() {
    showMelodyFeedback('Функция добавления мелодий будет доступна позже!', 'info');
}

let skipRequested = false;

function skipAutoPlay() {
    skipRequested = true;
    if (melodyState.isAutoPlaying) {
        melodyState.isAutoPlaying = false;
        clearTimeout(melodyState.autoPlayTimeout);
    }
    
    clearMelodyBlocks();
    if (melodyBlockAnimId) {
        cancelAnimationFrame(melodyBlockAnimId);
        melodyBlockAnimId = null;
    }
    
    const recordBtn = document.getElementById('melodyRecordBtn');
    if (recordBtn) {
        recordBtn.textContent = 'Записать';
        recordBtn.disabled = false;
        recordBtn.style.background = 'linear-gradient(135deg, #ff1744, #ff5252)';
        recordBtn.style.cursor = 'pointer';
        recordBtn.onclick = function() {
            melodyRecord();
        };
    }
    
    melodyState.currentNoteIndex = 0;
    melodyState.isComplete = true;
    updateCurrentNote();
}