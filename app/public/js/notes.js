const NOTES_RU = {
    'Соль2': { freq: 786.885, position: -1 },
    'Фа2': { freq: 705.882, position: 0 },
    'Ми2': { freq: 666.666, position: 0.5 },
    'Ре2': { freq: 592.592, position: 1 },
    'До2': { freq: 527.472, position: 1.5 },
    
    'Си': { freq: 500, position: 2 },
    'Ля': { freq: 444.444, position: 2.5 },
    'Соль': { freq: 396.694, position: 3 },
    'Фа': { freq: 352.941, position: 3.5 },
    'Ми': { freq: 333.333, position: 4 },
    'Ре': { freq: 296.296, position: 4.5 },
    'До': { freq: 262.295, position: 5 },
    
    'Си1': { freq: 248.704, position: 5.5 },
    'Ля1': { freq: 221.198, position: 6 },
    'Соль1': { freq: 197.530, position: 6.5 },

    'До♯': { freq: 279.069, position: 5 },
    'Ре♯': { freq: 315.789, position: 4.5 },
    'Фа♯': { freq: 377.952, position: 3.5 },
    'Соль♯': { freq: 417.391, position: 3 },
    'Ля♯': { freq: 470.588, position: 2.5 },
    'До2♯': { freq: 558.139, position: 1.5 },
    'Ре2♯': { freq: 623.376, position: 1 },
    'Фа2♯': { freq: 750, position: 0 },
    'Ля1♯': { freq: 233.08, position: 6 },

    'Ре♭': { freq: 279.069, position: 4.5 },
    'Ми♭': { freq: 315.789, position: 4 },
    'Соль♭': { freq: 377.952, position: 3 },
    'Ля♭': { freq: 417.391, position: 2.5 },
    'Си♭': { freq: 470.588, position: 2 },     
    'Ре2♭': { freq: 558.139, position: 1 },
    'Ми2♭': { freq: 623.376, position: 0.5 },
    'Фа2♭': { freq: 666.666, position: 0 },
    'Си1♭': { freq: 235.294, position: 5.5 },  

    'Си♯': { freq: 527.472, position: 2 },     
    'Ми♯': { freq: 352.941, position: 3.5 },
    'Фа♭': { freq: 333.333, position: 4 },
    'До2♭': { freq: 500, position: 2 },
    'Си1♯': { freq: 262.295, position: 5.5 },  
    'Ми2♯': { freq: 705.882, position: 0.5 },
    'Фа2♭': { freq: 666.666, position: 0.5 },
};

const AVAILABLE_NOTES = ['До', 'Ре', 'Ми', 'Фа', 'Соль', 'Ля', 'Си'];
const NOTE_FREQ_MAP = {};
Object.keys(NOTES_RU).forEach(key => {
    NOTE_FREQ_MAP[key] = NOTES_RU[key].freq;
});

const NOTE_POSITIONS_SMULE = {
    'Си': 10,
    'Ля': 22,
    'Соль': 34,
    'Фа': 46,
    'Ми': 58,
    'Ре': 70,
    'До': 82,
};

function getRandomNote() {
    return AVAILABLE_NOTES[Math.floor(Math.random() * AVAILABLE_NOTES.length)];
}

function normalizeToOctave(detectedFreq, targetFreq) {
    let freq = detectedFreq;
    while (freq < 100) {
        freq = 100;
    }
    while (freq > 800) {
        freq = 800;
    }
    
    return freq;
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

function playTwoNotes(freq1, freq2) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
        
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = freq1;
        osc1.connect(gainNode);
        
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = freq2;
        osc2.connect(gainNode);
        
        gainNode.connect(ctx.destination);
        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 2);
        osc2.stop(ctx.currentTime + 2);
    } catch (err) {
        console.error('Audio error:', err);
    }
}