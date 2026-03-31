import {
    average,
    clamp,
    median,
    recentItems,
    safeDivide,
    slope,
    stdDev,
    isFiniteNumber
} from './utils.js';

function getLatestValue(series) {
    if (!series?.length) return null;
    const value = series[series.length - 1]?.value;
    return isFiniteNumber(value) ? value : null;
}

function getRecentValues(series, count) {
    return recentItems(series || [], count).map((entry) => entry.value).filter(isFiniteNumber);
}

function levelFromScore(score) {
    if (!isFiniteNumber(score)) return 1;
    if (score < 20) return 1;
    if (score < 40) return 2;
    if (score < 60) return 3;
    if (score < 80) return 4;
    return 5;
}

function scoreBandLabel(level) {
    const labels = {
        1: 'Very Low',
        2: 'Low',
        3: 'Moderate',
        4: 'Good',
        5: 'Excellent'
    };
    return labels[level] || 'Moderate';
}

function statusByThreshold(value, ranges) {
    if (!isFiniteNumber(value)) return { label: 'N/A', color: 'text-gray-600' };
    return ranges(value);
}

function formStatus(form) {
    return statusByThreshold(form, (v) => {
        if (v > 15) return { label: 'Super Recovered', color: 'text-blue-600' };
        if (v > 5) return { label: 'Fresh', color: 'text-green-600' };
        if (v >= -5) return { label: 'Neutral', color: 'text-yellow-600' };
        if (v >= -20) return { label: 'Fatigue', color: 'text-orange-600' };
        return { label: 'High Fatigue', color: 'text-red-600' };
    });
}

function acwrStatus(acwr) {
    return statusByThreshold(acwr, (v) => {
        if (v < 0.8) return { label: 'Under-training', color: 'text-blue-600' };
        if (v <= 1.3) return { label: 'Optimal Zone', color: 'text-green-600' };
        if (v <= 1.5) return { label: 'High Load', color: 'text-orange-600' };
        return { label: 'Injury Risk', color: 'text-red-600' };
    });
}

function hrvRatioStatus(ratio) {
    return statusByThreshold(ratio, (v) => {
        if (v > 1.1) return { label: 'Super Recovery', color: 'text-blue-600' };
        if (v >= 0.95) return { label: 'Normal', color: 'text-green-600' };
        if (v >= 0.85) return { label: 'Trainable', color: 'text-yellow-600' };
        return { label: 'Recovery Stress', color: 'text-red-600' };
    });
}

function trendStatus(value) {
    return statusByThreshold(value, (v) => {
        if (v > 0.05) return { label: 'Improving', color: 'text-green-600' };
        if (v < -0.05) return { label: 'Declining', color: 'text-red-600' };
        return { label: 'Stable', color: 'text-yellow-600' };
    });
}

function variabilityStatus(value) {
    return statusByThreshold(value, (v) => {
        if (v < 6) return { label: 'Stable', color: 'text-green-600' };
        if (v <= 12) return { label: 'Normal Variation', color: 'text-yellow-600' };
        return { label: 'Autonomic Stress', color: 'text-red-600' };
    });
}

function sleepStatus(hours) {
    return statusByThreshold(hours, (v) => {
        if (v > 7) return { label: 'Excellent', color: 'text-green-600' };
        if (v >= 6) return { label: 'Good', color: 'text-yellow-600' };
        return { label: 'Poor', color: 'text-red-600' };
    });
}

function rhrDeltaStatus(delta) {
    return statusByThreshold(delta, (v) => {
        if (v <= -2) return { label: 'Recovered', color: 'text-green-600' };
        if (v >= 3) return { label: 'Fatigue', color: 'text-red-600' };
        return { label: 'Normal', color: 'text-yellow-600' };
    });
}

function zScoreStatus(value) {
    return statusByThreshold(value, (v) => {
        if (v > 1) return { label: 'Super Recovery', color: 'text-blue-600' };
        if (v < -1) return { label: 'Recovery Drop', color: 'text-orange-600' };
        return { label: 'Normal', color: 'text-green-600' };
    });
}

function strengthWorkout(workout) {
    const text = JSON.stringify(workout?.raw || {}).toLowerCase();
    return ['力量', 'strength', 'squat', 'deadlift', 'bench', '5rm'].some((keyword) => text.includes(keyword));
}

function inPastHours(date, hours) {
    if (!(date instanceof Date)) return false;
    const delta = Date.now() - date.getTime();
    return delta >= 0 && delta <= (hours * 3600 * 1000);
}

function scoreFromRatio(ratio) {
    if (!isFiniteNumber(ratio)) return 50;
    if (ratio > 1.1) return 100;
    if (ratio >= 0.95) return 85;
    if (ratio >= 0.85) return 60;
    return 25;
}

function scoreFromSleep(hours) {
    if (!isFiniteNumber(hours)) return 50;
    if (hours > 7) return 100;
    if (hours >= 6) return 70;
    return 25;
}

function scoreFromRhrDelta(delta) {
    if (!isFiniteNumber(delta)) return 50;
    if (delta <= -2) return 95;
    if (delta < 3) return 70;
    return 25;
}

function scoreFromAcwr(acwr) {
    if (!isFiniteNumber(acwr)) return 50;
    if (acwr >= 0.8 && acwr <= 1.3) return 90;
    if (acwr > 1.3 && acwr <= 1.5) return 55;
    if (acwr < 0.8) return 65;
    return 25;
}

function scoreFromForm(form) {
    if (!isFiniteNumber(form)) return 50;
    if (form > 5 && form <= 15) return 90;
    if (form >= -5 && form <= 5) return 70;
    if (form >= -20) return 45;
    return 20;
}

function scoreFromMonotony(monotony) {
    if (!isFiniteNumber(monotony)) return 50;
    if (monotony < 1.8) return 90;
    if (monotony <= 2.3) return 60;
    return 25;
}

function riskFromFactors(acwr, monotony, atlSpike, density) {
    let points = 0;
    if (isFiniteNumber(acwr)) {
        if (acwr > 1.5) points += 2;
        else if (acwr > 1.3) points += 1;
    }
    if (isFiniteNumber(monotony)) {
        if (monotony > 2.3) points += 2;
        else if (monotony > 1.8) points += 1;
    }
    if (isFiniteNumber(atlSpike)) {
        if (atlSpike > 0.25) points += 2;
        else if (atlSpike >= 0.10) points += 1;
    }
    if (isFiniteNumber(density)) {
        if (density > 1.2) points += 2;
        else if (density > 1.0) points += 1;
    }
    if (points >= 6) return 'High';
    if (points >= 3) return 'Moderate';
    return 'Low';
}

function intensityGuidance(readinessScore, cnsFatigue) {
    if (cnsFatigue || readinessScore < 40) {
        return { recommended: 'Easy recovery session', avoid: 'VO2max / heavy strength', rpe: '2-4', zone: 'Z1-Z2', duration: '20-45 min' };
    }
    if (readinessScore < 70) {
        return { recommended: 'Steady aerobic + light technique', avoid: 'Maximal intervals', rpe: '4-6', zone: 'Z2-Z3', duration: '40-75 min' };
    }
    return { recommended: 'Quality training session', avoid: 'None specific, monitor fatigue', rpe: '6-8', zone: 'Z2-Z4', duration: '45-90 min' };
}

export function calculateMetrics(model) {
    const hrv7 = getRecentValues(model.hrvSeries, 7);
    const rhr7 = getRecentValues(model.rhrSeries, 7);
    const atl7 = getRecentValues(model.atlSeries, 7);
    const ctl7 = getRecentValues(model.ctlSeries, 7);

    const todayHRV = getLatestValue(model.hrvSeries);
    const hrvBaseline = median(hrv7);
    const hrvRatio = safeDivide(todayHRV, hrvBaseline);
    const hrv3ago = model.hrvSeries.length >= 4 ? model.hrvSeries[model.hrvSeries.length - 4].value : null;
    const hrvTrend = (isFiniteNumber(todayHRV) && isFiniteNumber(hrv3ago) && isFiniteNumber(hrvBaseline))
        ? safeDivide(todayHRV - hrv3ago, hrvBaseline)
        : null;
    const hrvVariability = stdDev(hrv7);

    const sleepToday = getLatestValue(model.sleepSeries);
    const rhrToday = getLatestValue(model.rhrSeries);
    const rhrAvg7 = average(rhr7);
    const rhrDelta = (isFiniteNumber(rhrToday) && isFiniteNumber(rhrAvg7)) ? (rhrToday - rhrAvg7) : null;

    const hrvMean7 = average(hrv7);
    const hrvStd7 = stdDev(hrv7);
    const hrvZ = (isFiniteNumber(todayHRV) && isFiniteNumber(hrvMean7) && isFiniteNumber(hrvStd7) && hrvStd7 > 0)
        ? (todayHRV - hrvMean7) / hrvStd7
        : null;

    const neuralReady = (isFiniteNumber(hrvRatio) && isFiniteNumber(rhrDelta)) ? (hrvRatio > 0.9 && rhrDelta <= 2) : null;
    const cnsTriggers = [
        isFiniteNumber(hrvRatio) && hrvRatio < 0.90,
        isFiniteNumber(hrvZ) && hrvZ < -1,
        isFiniteNumber(rhrDelta) && rhrDelta >= 3
    ].filter(Boolean).length;
    const cnsFatigue = cnsTriggers >= 2;

    const atlToday = getLatestValue(model.atlSeries);
    const ctlToday = getLatestValue(model.ctlSeries);
    const form = (isFiniteNumber(atlToday) && isFiniteNumber(ctlToday)) ? (ctlToday - atlToday) : null;
    const acwr = safeDivide(atlToday, ctlToday);

    const atlYesterday = model.atlSeries.length >= 2 ? model.atlSeries[model.atlSeries.length - 2].value : null;
    const atl3daysAgo = model.atlSeries.length >= 4 ? model.atlSeries[model.atlSeries.length - 4].value : null;
    const atlSpike = (isFiniteNumber(atlToday) && isFiniteNumber(atlYesterday) && atlYesterday !== 0)
        ? (atlToday - atlYesterday) / atlYesterday
        : null;
    const fatigueMomentum = (isFiniteNumber(atlToday) && isFiniteNumber(atl3daysAgo) && atl3daysAgo !== 0)
        ? (atlToday - atl3daysAgo) / atl3daysAgo
        : null;

    const loadProxy7 = atl7;
    const loadMean7 = average(loadProxy7);
    const loadSd7 = stdDev(loadProxy7);
    const monotony = (isFiniteNumber(loadMean7) && isFiniteNumber(loadSd7) && loadSd7 > 0) ? (loadMean7 / loadSd7) : null;
    const strain = (isFiniteNumber(loadMean7) && isFiniteNumber(monotony)) ? (loadMean7 * 7 * monotony) : null;

    const strength48h = model.workouts.some((workout) => strengthWorkout(workout) && inPastHours(workout.parsedDate, 48));
    const strength7d = model.workouts.filter((workout) => strengthWorkout(workout) && inPastHours(workout.parsedDate, 24 * 7)).length;

    const workouts7d = model.workouts.filter((workout) => inPastHours(workout.parsedDate, 24 * 7)).length;
    const trainingDensity = workouts7d / 7;
    const structuralFatigue = isFiniteNumber(monotony) && monotony > 2 && trainingDensity > 1.2;
    const fatigueRiskScore = riskFromFactors(acwr, monotony, atlSpike, trainingDensity);

    const recoverySystemScore = average([
        scoreFromRatio(hrvRatio),
        scoreFromSleep(sleepToday),
        scoreFromRhrDelta(rhrDelta),
        trendStatus(hrvTrend).label === 'Improving' ? 90 : trendStatus(hrvTrend).label === 'Stable' ? 70 : 35,
        variabilityStatus(hrvVariability).label === 'Stable' ? 90 : variabilityStatus(hrvVariability).label === 'Normal Variation' ? 65 : 30
    ]);
    const neuralScore = average([
        zScoreStatus(hrvZ).label === 'Super Recovery' ? 90 : zScoreStatus(hrvZ).label === 'Normal' ? 70 : 35,
        neuralReady === true ? 85 : neuralReady === false ? 45 : 60,
        cnsFatigue ? 20 : 85
    ]);
    const trainingLoadScore = average([
        scoreFromForm(form),
        scoreFromAcwr(acwr),
        trendStatus(fatigueMomentum).label === 'Declining' ? 85 : trendStatus(fatigueMomentum).label === 'Stable' ? 70 : 45,
        isFiniteNumber(atlSpike) ? (atlSpike > 0.25 ? 25 : atlSpike >= 0.1 ? 55 : 80) : 55
    ]);
    const trainingStructureScore = average([
        scoreFromMonotony(monotony),
        strength48h ? 35 : 80,
        strength7d >= 2 && strength7d <= 4 ? 85 : strength7d === 5 ? 60 : strength7d > 5 ? 35 : 65
    ]);
    const fatigueRiskNumeric = fatigueRiskScore === 'High' ? 25 : fatigueRiskScore === 'Moderate' ? 55 : 85;
    const fatigueRiskSectionScore = average([
        fatigueRiskNumeric,
        isFiniteNumber(trainingDensity) ? (trainingDensity > 1.2 ? 25 : trainingDensity >= 0.7 ? 70 : 85) : 50,
        structuralFatigue ? 30 : 80
    ]);

    const readinessScore = clamp(
        (recoverySystemScore * 0.30)
        + (neuralScore * 0.20)
        + (trainingLoadScore * 0.25)
        + (trainingStructureScore * 0.15)
        + (fatigueRiskSectionScore * 0.10),
        0,
        100
    );

    const readinessLevel = levelFromScore(readinessScore);
    const strengthReadiness = clamp((readinessScore * 0.6) + (strength48h ? -15 : 10), 0, 100);
    const aerobicReadiness = clamp((readinessScore * 0.7) + (isFiniteNumber(hrvRatio) ? (hrvRatio - 1) * 40 : 0), 0, 100);

    const guidance = intensityGuidance(readinessScore, cnsFatigue);
    const atlSlope = slope(getRecentValues(model.atlSeries, 4));
    const ctlSlope = slope(getRecentValues(model.ctlSeries, 4));

    return {
        top: {
            recoveryScore: readinessScore,
            statusLevel: readinessLevel,
            statusLabel: scoreBandLabel(readinessLevel)
        },
        recoverySystem: {
            hrvBaseline,
            hrvRatio,
            hrvRatioStatus: hrvRatioStatus(hrvRatio),
            hrvTrend,
            hrvTrendStatus: trendStatus(hrvTrend),
            hrvVariability,
            hrvVariabilityStatus: variabilityStatus(hrvVariability),
            sleep: sleepToday,
            sleepStatus: sleepStatus(sleepToday),
            rhrDelta,
            rhrStatus: rhrDeltaStatus(rhrDelta)
        },
        neural: {
            hrvZ,
            hrvZStatus: zScoreStatus(hrvZ),
            neuralReadiness: neuralReady,
            cnsFatigue
        },
        load: {
            atl: atlToday,
            ctl: ctlToday,
            form,
            formStatus: formStatus(form),
            acwr,
            acwrStatus: acwrStatus(acwr),
            atlSpike,
            fatigueMomentum,
            fatigueMomentumStatus: trendStatus(fatigueMomentum)
        },
        structure: {
            monotony,
            strain,
            strengthFatigue: strength48h,
            strengthFrequency: strength7d
        },
        fatigueRisk: {
            trainingDensity,
            structuralFatigue,
            fatigueRiskScore
        },
        performance: {
            readinessScore,
            strengthReadiness,
            aerobicReadiness
        },
        guidance,
        structures: [
            { name: 'Plan A Aerobic', detail: 'Z2 steady aerobic, keep cadence smooth and controlled.' },
            { name: 'Plan B Strength + Aerobic', detail: 'Brief strength block then short aerobic cooldown.' },
            { name: 'Plan C Recovery', detail: 'Mobility, easy spin/walk, and extra sleep emphasis.' }
        ],
        trend: {
            fatigueTrend: isFiniteNumber(atlSlope) ? (atlSlope > 0 ? 'Accumulating' : atlSlope < 0 ? 'Releasing' : 'Stable') : 'N/A',
            ctlTrend: isFiniteNumber(ctlSlope) ? (ctlSlope > 0 ? 'Rising' : ctlSlope < 0 ? 'Dropping' : 'Stable') : 'N/A',
            window48h: cnsFatigue ? 'Recovery-first window' : readinessScore >= 70 ? 'Quality session window open' : 'Controlled volume window',
            futureRisk: fatigueRiskScore === 'High'
                ? 'High risk if intensity increases'
                : fatigueRiskScore === 'Moderate'
                    ? 'Manageable with careful load progression'
                    : 'Low near-term fatigue risk'
        }
    };
}
