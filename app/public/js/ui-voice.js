function drawNoteOnStaff(noteName) {
    const wrapper = document.getElementById('staffWrapperScroll');
    if (!wrapper) return;

    wrapper.querySelectorAll('.staff-note.current').forEach(el => {
        el.classList.remove('current');
        el.classList.add('passed');
    });
    wrapper.querySelectorAll('.ledger-line.current').forEach(el => {
        el.classList.remove('current');
        el.classList.add('passed');
    });
    const existingNotes = wrapper.querySelectorAll('.staff-note').length;
    const noteLeft = 50 + existingNotes * 100;
    const noteData = NOTES_RU[noteName];
    if (!noteData) return;
    const staffY = 20;
    const spacing = 20;
    const position = noteData.position;
    const noteY = staffY + position * spacing + 2;
    const noteEl = document.createElement('div');
    noteEl.className = 'staff-note current';
    noteEl.style.left = noteLeft + 'px';
    const label = document.createElement('div');
    label.className = 'note-label';
    label.textContent = noteName;
    label.style.top = (noteY - 75) + 'px';
    const dot = document.createElement('div');
    dot.className = 'note-dot';
    dot.style.top = noteY + 'px';
    const stem = document.createElement('div');
    stem.className = 'note-stem';
    stem.style.top = noteY + 'px';
    noteEl.append(label, dot, stem);
    noteEl.addEventListener('click', () => {
        if (voiceGameState.difficulty === 'hard') return;
        playNoteByName(noteName);
    });
    wrapper.appendChild(noteEl);
    if (position > 4.5) {
        for (let i = 5; i <= Math.floor(position); i++) {
            const y = staffY + i * spacing;
            const line = document.createElement('div');
            line.className = 'ledger-line current';
            line.style.cssText = `top:${y}px;left:${noteLeft-5}px;width:40px;`;
            wrapper.appendChild(line);
        }
    }
    const newWidth = Math.max(800, noteLeft + 150);
    wrapper.style.minWidth = newWidth + 'px';
    const scrollContainer = document.getElementById('staffNotesScroll');
    if (scrollContainer) scrollContainer.scrollLeft = noteLeft - 100;
}

function updateVoiceLine(freq, target) {
    const arrow = document.getElementById('voiceArrow');
    const track = document.getElementById('smuleTunerTrack');
    if (!arrow || !track) return;
    
    const h = track.offsetHeight;
    if (h === 0) return;
    
    const notePositions = {
        'Си': 10,
        'Ля': 22,
        'Соль': 34,
        'Фа': 46,
        'Ми': 58,
        'Ре': 70,
        'До': 82
    };
    
    let closestPos = 50;
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
    
    const pixelPos = ((closestPos / 100) * h - 14);
    const minPixel = -14;
    const maxPixel = h - 14;
    const clampedTop = Math.max(minPixel, Math.min(maxPixel, pixelPos));
    
    arrow.style.top = clampedTop + 'px';
    
    const cents = Math.abs(1200 * Math.log2(freq / target));
    const isInTune = cents < 30;
    
    const head = arrow.querySelector('.arrow-head');
    if (isInTune) {
        arrow.style.color = '#00c853'; 
        if (head) {
            head.style.color = 'white';
            head.style.textShadow = '0 0 10px rgba(0,0,0,0.5)';
        }
    } else {
        arrow.style.color = '#ff6b6b'; 
        if (head) {
            head.style.color = 'white';
            head.style.textShadow = '0 0 10px rgba(0,0,0,0.5)';
        }
    }
}

function resetVoiceLine() {
    const arrow = document.getElementById('voiceArrow');
    const track = document.getElementById('smuleTunerTrack');
    if (!arrow || !track) return;
    
    const h = track.offsetHeight;
    if (h === 0) return;
    
    const notePositions = {
        'Си': 10,
        'Ля': 22,
        'Соль': 34,
        'Фа': 46,
        'Ми': 58,
        'Ре': 70,
        'До': 82
    };
    
    const pos = notePositions[voiceGameState.currentNote] || 50;
    const pixelPos = ((pos / 100) * h - 14);
    
    arrow.style.top = pixelPos + 'px';
    arrow.className = 'voice-arrow';
    arrow.style.color = '#4a9eff';
    
    const head = arrow.querySelector('.arrow-head');
    if (head) {
        head.style.color = 'white';
        head.style.textShadow = '0 0 10px rgba(0,0,0,0.5)';
    }
}

function resetMovingNote() {
    const n = document.getElementById('movingNote');
    if (n) { 
        n.style.left = '0px'; 
        n.style.top = '50%'; 
    }
}

function startMovingNote() {
    const note = document.getElementById('movingNote');
    const track = document.getElementById('smuleTunerTrack');
    if (!note || !track) return;
    
    voiceGameState.movingNoteStart = Date.now();
    const duration = 5000;
    const tw = track.offsetWidth;
    const th = track.offsetHeight;
    
    const notePositions = {
        'Си': 10,
        'Ля': 22,
        'Соль': 34,
        'Фа': 46,
        'Ми': 58,
        'Ре': 70,
        'До': 82
    };
    
    const pos = notePositions[voiceGameState.currentNote] || 50;
    const pixelTop = ((pos / 100) * th - 10);
    note.style.top = pixelTop + 'px';
    
    const start = tw * 0.3;
    const end = start - 250;
    
    function move() {
        const p = Math.min(1, (Date.now() - voiceGameState.movingNoteStart) / duration);
        note.style.left = (start + (end - start) * p) + 'px';
        if (p < 1) {
            noteTimer = requestAnimationFrame(move);
        }
    }
    move();
}

function showResult(points, hitSeconds) {
    const fb = document.getElementById('resultFeedback');
    if (!fb) return;
    fb.textContent = points > 0
        ? `+${points} баллов (${hitSeconds.toFixed(1)}с в ноте)`
        : '0 баллов';
    fb.className = 'result-feedback ' + (points > 0 ? 'success' : 'fail');
    fb.style.display = 'block';
}

function updateProgressBar() {
    const p = (voiceGameState.currentTest / voiceGameState.totalTests) * 100;
    document.getElementById('progressFill').style.width = p + '%';
    document.getElementById('progressText').textContent = `${voiceGameState.currentTest} из ${voiceGameState.totalTests}`;
    document.getElementById('scoreText').textContent = `⭐ ${voiceGameState.score} баллов`;
}