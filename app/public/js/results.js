function saveTrainingResults(data, url = '/training/pitch/result') {
    if (!data._csrf_token) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            data._csrf_token = csrfToken;
        }
    }
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.text().then(text => {
            try {
                const json = JSON.parse(text);
                if (!response.ok) {
                    throw new Error(json.error || `Server error: ${response.status}`);
                }
                return json;
            } catch (e) {
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} - ${text}`);
                }
                return { success: true };
            }
        });
    })
    .then(result => {
        if (result.success) {
            if (result.newTotalScore !== undefined) {
                updateScoreDisplay(result.newTotalScore);
            }
            if (result.newStreak !== undefined) {
                updateStreakDisplay(result.newStreak);
            }
            if (result.newPlace !== undefined) {
                updatePlaceDisplay(result.newPlace);
            }
            if (result.isActiveToday !== undefined) {
                updateStreakIcon(result.isActiveToday);
            }
        }
    })
    .catch(error => {
        console.error('Ошибка сохранения:', error);
    });
}

function updateScoreDisplay(newScore) {
    const scoreSelectors = [
        '#profileScore', 
        '#headerScore',
        '.user-score',
        '#finalScore'
    ];
    
    scoreSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el) {
                if (!el.id?.includes('Streak') && !el.className?.includes('streak')) {
                    animateScoreUpdate(el, newScore);
                }
            }
        });
    });
}


function updateStreakDisplay(newStreak) {
    const streakSelectors = [
        '#streakText',
        '#profileStreak',
        '#headerStreak',
        '.streak-value',
        '#finalStreak'
    ];
    
    streakSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el) {
                el.textContent = newStreak;
            }
        });
    });
}

function updatePlaceDisplay(newPlace) {
    const placeSelectors = [
        '#placeText',
        '#profilePlace',
        '.place-value',
        '#headerPlace',
        '#finalPlace'
    ];
    
    placeSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el) {
                el.textContent = newPlace;
            }
        });
    });
}

function updateStreakIcon(isActive) {
    const streakIcons = document.querySelectorAll('.streak-icon');
    if (isActive) {
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

function animateScoreUpdate(element, newScore) {
    const currentScore = parseInt(element.textContent) || 0;
    const duration = 1500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(currentScore + (newScore - currentScore) * eased);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}