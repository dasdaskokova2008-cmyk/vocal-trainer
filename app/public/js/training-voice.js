function getTodayUserDate() {
    const now = new Date();
    return now.getFullYear() + '-' + 
           String(now.getMonth() + 1).padStart(2, '0') + '-' + 
           String(now.getDate()).padStart(2, '0');
}
const voiceGameState = {
    difficulty: 'easy',
    totalTests: 10,
    currentTest: 0,
    score: 0,
    startTime: null,
    currentNote: null,
    results: [],
    hitTime: 0,
    lastCheckTime: null,
    isHit: false,
    movingNoteStart: null,
    isGameActive: false,
    isWaitingForStart: true,
};

let selectedDifficulty = null;
let noteTimer = null;
let isExerciseActive = false;

function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    startVoiceGame();
}

function startVoiceGame() {
    const totalTests = parseInt(document.getElementById('testCountRange').value);
    if (!selectedDifficulty) {
        alert('Выберите сложность!');
        return;
    }
    voiceGameState.difficulty = selectedDifficulty;
    voiceGameState.totalTests = totalTests;
    voiceGameState.currentTest = 0;
    voiceGameState.score = 0;
    voiceGameState.results = [];
    voiceGameState.isGameActive = true;
    voiceGameState.isWaitingForStart = true;
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    document.getElementById('resultScreen').style.display = 'none';
    showNextVoiceNote();
}

function showNextVoiceNote() {
    if (voiceGameState.currentTest >= voiceGameState.totalTests) {
        finishVoiceTest();
        return;
    }
    voiceGameState.currentTest++;
    voiceGameState.startTime = Date.now();
    voiceGameState.currentNote = getRandomNote();
    voiceGameState.hitTime = 0;
    voiceGameState.lastCheckTime = null;
    voiceGameState.isHit = false;
    voiceGameState.movingNoteStart = null;
    voiceGameState.isWaitingForStart = true;
    clearTimeout(noteTimer);
    updateProgressBar();
    drawNoteOnStaff(voiceGameState.currentNote);
    const feedback = document.getElementById('resultFeedback');
    feedback.style.display = 'none';
    feedback.className = 'result-feedback';
    resetVoiceLine();
    resetMovingNote();
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.textContent = '5.0s';
    const micBtn = document.getElementById('micButton');
    if (micBtn) {
        micBtn.disabled = true;
        micBtn.classList.remove('recording');
        micBtn.querySelector('img').src = '/images/mic-icon.png';
        const status = document.getElementById('micStatus');
        if (status) status.textContent = 'Подготовка...';}
    if (isRecording) {
        stopMicrophone();
        updateMicButton(false);}
    if (voiceGameState.difficulty === 'easy') {
        setTimeout(() => {
            playNoteByName(voiceGameState.currentNote);
            setTimeout(() => {
                if (micBtn) {
                    micBtn.disabled = false;
                    micBtn.classList.remove('locked');
                    const status = document.getElementById('micStatus');
                    if (status) status.textContent = 'Начать петь';
                }
                voiceGameState.isWaitingForStart = false;
            }, 2000);
        }, 500);
    } else {
        setTimeout(() => {
            if (micBtn) {
                micBtn.disabled = false;
                micBtn.classList.remove('locked');
                const status = document.getElementById('micStatus');
                if (status) status.textContent = 'Начать петь';
            }
            voiceGameState.isWaitingForStart = false;
        }, 2000);
    }
}

function updateMicStatus(text) {
    const status = document.getElementById('micStatus');
    if (status) status.textContent = text;
}

function playNoteByName(noteName) {
    if (voiceGameState.difficulty === 'hard') return;
    const freq = NOTE_FREQ_MAP[noteName];
    if (!freq) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = ctx.createGain();
        const harmonics = [
            { freq: freq, gain: 0.5 },
            { freq: freq * 2, gain: 0.25 },
            { freq: freq * 3, gain: 0.15 },
            { freq: freq * 4, gain: 0.08 }
        ];
        const oscillators = [];
        harmonics.forEach(harmonic => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = harmonic.freq;
            oscGain.gain.value = harmonic.gain;
            osc.connect(oscGain);
            oscGain.connect(gainNode);
            oscillators.push(osc);
        });
        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.6, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.1, now + 1.5);
        gainNode.connect(ctx.destination);
        oscillators.forEach(osc => {
            osc.start(now);
            osc.stop(now + 1.5);
        });
    } catch (err) {console.error('Play error:', err);}
}

function analyzeVoiceAudio() {
    if (!isRecording || !analyser) {
        animationId = requestAnimationFrame(analyzeVoiceAudio);
        return;
    }
    const dataArray = getAudioData();
    if (!dataArray) {
        animationId = requestAnimationFrame(analyzeVoiceAudio);
        return;
    }
    const energy = getAudioEnergy(dataArray);
    if (energy < 0.005) {
        voiceGameState.isHit = false;
        voiceGameState.lastCheckTime = null;
        const arrow = document.getElementById('voiceArrow');
        if (arrow) arrow.classList.remove('hit');
        animationId = requestAnimationFrame(analyzeVoiceAudio);
        return;
    }
    const pitch = detectPitch(dataArray, audioContext.sampleRate);
    if (pitch && voiceGameState.currentNote) {
        const targetFreq = NOTE_FREQ_MAP[voiceGameState.currentNote];
        if (targetFreq) {
            const normalizedPitch = normalizeToOctave(pitch, targetFreq);
            updateVoiceLine(normalizedPitch, targetFreq);
            checkVoiceHit(normalizedPitch, targetFreq, energy);
        }
    }
    animationId = requestAnimationFrame(analyzeVoiceAudio)
}

function checkVoiceHit(detectedFreq, targetFreq, energy) {
    if (energy < 0.005) {
        voiceGameState.isHit = false;
        voiceGameState.lastCheckTime = null;
        const arrow = document.getElementById('voiceArrow');
        if (arrow) arrow.classList.remove('hit');
        return;
    }
    const cents = Math.abs(1200 * Math.log2(detectedFreq / targetFreq));
    const isInTune = cents < 30;
    const now = Date.now();
    const arrow = document.getElementById('voiceArrow');
    if (isInTune) {
        if (!voiceGameState.isHit) {
            voiceGameState.isHit = true;
            voiceGameState.lastCheckTime = now;
        }
        if (arrow) arrow.classList.add('hit');
    } else {
        if (voiceGameState.isHit) {
            const hitDuration = now - voiceGameState.lastCheckTime;
            voiceGameState.hitTime += hitDuration;
            voiceGameState.isHit = false;
        }
        if (arrow) arrow.classList.remove('hit');
    }
}

function startTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const startTime = Date.now();
    const duration = 5000;
    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        if (timerDisplay) {
            timerDisplay.textContent = (remaining / 1000).toFixed(1) + 's';
        }
        if (remaining > 0) {
            noteTimer = requestAnimationFrame(updateTimer);
        } else {finishCurrentVoiceNote();}
    }
    updateTimer();
}

function finishCurrentVoiceNote() {
    isExerciseActive = false;
    if (voiceGameState.isHit) {
        const hitDuration = Date.now() - voiceGameState.lastCheckTime;
        voiceGameState.hitTime += hitDuration;
        voiceGameState.isHit = false;
    }
    const hitSeconds = voiceGameState.hitTime / 1000;
    const points = calculateScore(hitSeconds, voiceGameState.difficulty);
    voiceGameState.score += points;
    voiceGameState.results.push({
        note: voiceGameState.currentNote,
        hitTime: hitSeconds,
        score: points,
        success: points > 0
    });
    showResult(points, hitSeconds);
    stopVoiceRecording();
    const micBtn = document.getElementById('micButton');
    if (micBtn) {
        const status = document.getElementById('micStatus');
        if (status) status.textContent = 'Следующая нота...';
    }
    setTimeout(showNextVoiceNote, 2000);
}

function finishVoiceTest() {
    stopVoiceRecording();
    clearTimeout(noteTimer);
    voiceGameState.isGameActive = false;
    
    const percentage = calculatePercentage(voiceGameState.results);
    animateProgressCircle(percentage);
    const motivationText = getMotivationByPercentage(percentage);
    document.getElementById('motivationText').textContent = motivationText;
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'flex';
    
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    const data = {
        type: 'voice',
        difficulty: voiceGameState.difficulty,
        totalTests: voiceGameState.totalTests,
        totalScore: voiceGameState.score,
        results: voiceGameState.results.map(r => ({ 
            hitTime: r.hitTime || 0, 
            success: r.success || false 
        })),
        percentage: percentage,
        userDate: getTodayUserDate(),
        _csrf_token: csrfToken 
    };
    
    saveTrainingResults(data, '/training/pitch/result');
}
function animateProgressCircle(percentage) {
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

function continueTraining() {
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('setupScreen').style.display = 'flex';
    document.getElementById('gameScreen').style.display = 'none';
    selectedDifficulty = null;
    voiceGameState.isGameActive = false;
    voiceGameState.isWaitingForStart = true;
    const wrapper = document.getElementById('staffWrapperScroll');
    if (wrapper) {
        wrapper.querySelectorAll('.staff-note, .ledger-line').forEach(el => el.remove());
        wrapper.style.minWidth = '100%';
    }
    stopVoiceRecording();
}