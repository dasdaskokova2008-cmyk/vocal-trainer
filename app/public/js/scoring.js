function calculateScore(hitSeconds, difficulty) {
    let coefficient = 1;
    if (difficulty === 'medium') coefficient = 2;
    else if (difficulty === 'hard') coefficient = 3;
    if (hitSeconds >= 4) return 5 * coefficient;
    if (hitSeconds >= 3) return 4 * coefficient;
    if (hitSeconds >= 2) return 3 * coefficient;
    if (hitSeconds >= 1) return 2 * coefficient;
    if (hitSeconds > 0) return 1 * coefficient;
    return 0;
}

function calculatePercentage(results) {
    let totalHitTime = 0;
    let successCount = 0;
    results.forEach(r => {
        if (r.success) {
            successCount++;
            totalHitTime += r.hitTime;}
    });
    const avgTime = successCount > 0 ? (totalHitTime / successCount) : 0;
    return Math.min(100, Math.round((avgTime / 5) * 100));
}