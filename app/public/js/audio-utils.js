let audioContext = null;
let analyser = null;
let isRecording = false;
let animationId = null;
let stream = null;
async function startMicrophone() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                sampleRate: 44100
            } 
        });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 4096;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        isRecording = true;
        return true;
    } catch (err) {
        alert('Не удалось получить доступ к микрофону: ' + err.message);
        return false;
    }
}

function stopMicrophone() {
    isRecording = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
        audioContext = null;
    }
}

function getAudioData() {
    if (!isRecording || !analyser) return null;
        const dataArray = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(dataArray);
    return dataArray;
}

function getAudioEnergy(dataArray) {
    let energy = 0;
    for (let i = 0; i < dataArray.length; i++) {energy += dataArray[i] * dataArray[i];}
    return Math.sqrt(energy / dataArray.length);
}

function detectPitch(buffer, sampleRate) {
    const size = buffer.length;
    let energy = 0;
    for (let i = 0; i < size; i++) {energy += buffer[i] * buffer[i];}
    energy = Math.sqrt(energy / size);
    if (energy < 0.005) return null;
    let sum = 0;
    for (let i = 0; i < size; i++) sum += buffer[i];
    const mean = sum / size;
    for (let i = 0; i < size; i++) buffer[i] = buffer[i] - mean;
    let maxCorrelation = 0;
    let bestLag = 0;
    const minLag = Math.floor(sampleRate / 1000);
    const maxLag = Math.floor(sampleRate / 70);
    for (let lag = minLag; lag < Math.min(maxLag, size / 2); lag++) {
        let correlation = 0;
        let norm1 = 0;
        let norm2 = 0;
        for (let i = 0; i < size - lag; i++) {
            correlation += buffer[i] * buffer[i + lag];
            norm1 += buffer[i] * buffer[i];
            norm2 += buffer[i + lag] * buffer[i + lag];
        }
        const norm = Math.sqrt(norm1 * norm2);
        if (norm > 0) correlation /= norm;
        if (correlation > maxCorrelation) {
            maxCorrelation = correlation;
            bestLag = lag;
        }
    }
    if (maxCorrelation < 0.1) return null;
    let pitch = sampleRate / bestLag;
    if (pitch < 70 || pitch > 1000) return null;
    return pitch;
}

async function startVoiceRecording() {
    const success = await startMicrophone();
    if (!success) return;
    voiceGameState.isWaitingForStart = false;
    updateMicButton(true);
    startTimer();
    startMovingNote();
    analyzeVoiceAudio();
    const micBtn = document.getElementById('micButton');
    if (micBtn) {
        micBtn.disabled = true;
        micBtn.classList.add('locked');
        const status = document.getElementById('micStatus');
        if (status) status.textContent = 'Запись...';
    }
}

function stopVoiceRecording() {
    stopMicrophone();
    updateMicButton(false);
    voiceGameState.isWaitingForStart = true;
}

function toggleVoiceRecording() {
    const micBtn = document.getElementById('micButton');
    if (micBtn && micBtn.disabled) return;
    if (voiceGameState.isWaitingForStart) return;
    if (isRecording) {
        stopVoiceRecording();
    } else {
        if (!voiceGameState.isGameActive) return;
        startVoiceRecording();
    }
}

function updateMicButton(isRecording) {
    const micBtn = document.getElementById('micButton');
    if (!micBtn) return;
    if (isRecording) {
        micBtn.classList.add('recording');
        micBtn.querySelector('img').src = '/images/mic-icon-active.png';
    } else {
        micBtn.classList.remove('recording');
        micBtn.querySelector('img').src = '/images/mic-icon.png';
    }
}
