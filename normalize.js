import {
    parseIsoDate,
    parseMonthDayDate,
    parseChineseDateTime,
    parseDurationHoursFromText,
    toNumber,
    sortByDateAsc
} from './utils.js';

function normalizeSeries(items, dateKey, valueKey) {
    if (!Array.isArray(items)) return [];
    const normalized = items.map((item) => {
        const date = parseIsoDate(item?.[dateKey]);
        const value = toNumber(item?.[valueKey]);
        if (!date || value === null) return null;
        return { date, value, raw: item };
    }).filter(Boolean);
    return sortByDateAsc(normalized, (entry) => entry.date);
}

function inferDefaultYear(atlSeries, ctlSeries) {
    const candidates = [...atlSeries, ...ctlSeries];
    if (!candidates.length) return new Date().getFullYear();
    return candidates[candidates.length - 1].date.getFullYear();
}

function normalizeCustomWorkouts(workouts, defaultYear) {
    if (!Array.isArray(workouts)) return [];
    return workouts.map((workout, index) => {
        const parsedDate = parseMonthDayDate(workout?.date, defaultYear) || parseIsoDate(workout?.date);
        return {
            id: `workout-${index}`,
            parsedDate,
            raw: workout || {},
            type: workout?.type || 'Unknown',
            durationMin: toNumber(workout?.duration_min),
            rpe: toNumber(workout?.rpe),
            avgHr: toNumber(workout?.avg_hr),
            maxHr: toNumber(workout?.max_hr)
        };
    }).sort((a, b) => (b.parsedDate?.getTime() || 0) - (a.parsedDate?.getTime() || 0));
}

function normalizeCustomSleepSessions(sessions) {
    if (!Array.isArray(sessions)) return [];
    return sessions.map((session, index) => {
        const start = parseChineseDateTime(session?.start) || parseIsoDate(session?.start);
        const end = parseChineseDateTime(session?.end) || parseIsoDate(session?.end);
        return {
            id: `sleep-${index}`,
            start,
            end,
            totalHours: parseDurationHoursFromText(session?.total),
            raw: session || {}
        };
    }).sort((a, b) => (b.start?.getTime() || 0) - (a.start?.getTime() || 0));
}

function buildSleepSeriesFromSessions(sessions) {
    return sessions.map((entry) => {
        const date = entry.end || entry.start;
        if (!date || entry.totalHours === null) return null;
        return { date, value: entry.totalHours };
    }).filter(Boolean).sort((a, b) => a.date - b.date);
}

/** Daily training load (e.g. TSS) for monotony; zeros included for rest days. */
function normalizeDailyLoadSeries(items, defaultYear) {
    if (!Array.isArray(items)) return [];
    const normalized = items.map((item) => {
        const date = parseIsoDate(item?.date) || parseMonthDayDate(item?.date, defaultYear);
        if (!date) return null;
        const v = toNumber(item?.total_tss ?? item?.tss ?? item?.load);
        return { date, value: v !== null ? v : 0, raw: item };
    }).filter(Boolean);
    return sortByDateAsc(normalized, (entry) => entry.date);
}

export function normalizeCustomData(raw) {
    const userName = String(raw?.user_name || '').trim();
    if (!userName) {
        throw new Error('`user_name` is required and must be non-empty for custom JSON.');
    }

    const atlSeries = normalizeSeries(raw?.atl, 'date', 'atl');
    const ctlSeries = normalizeSeries(raw?.ctl, 'date', 'ctl');
    const defaultYear = inferDefaultYear(atlSeries, ctlSeries);

    const workouts = normalizeCustomWorkouts(raw?.workouts, defaultYear);
    const sleepSessions = normalizeCustomSleepSessions(raw?.sleep_sessions);
    const sleepSeries = buildSleepSeriesFromSessions(sleepSessions);

    const hrvSeries = normalizeSeries(raw?.hrv, 'date', 'hrv');
    const rhrSeries = normalizeSeries(raw?.rhr, 'date', 'rhr');

    const comments = Array.isArray(raw?.comments) ? raw.comments : [];
    const dailyLoadSeries = normalizeDailyLoadSeries(raw?.daily, defaultYear);

    return {
        source: 'custom',
        userName,
        atlSeries,
        ctlSeries,
        hrvSeries,
        rhrSeries,
        sleepSeries,
        sleepSessions,
        workouts,
        dailyLoadSeries,
        comments,
        raw
    };
}

function normalizeGithubWorkouts(activities) {
    if (!Array.isArray(activities)) return [];
    return activities.map((activity, index) => ({
        id: `gh-workout-${index}`,
        parsedDate: parseIsoDate(activity?.date),
        raw: activity || {},
        type: activity?.type || activity?.activity_type || 'Unknown',
        durationMin: toNumber(activity?.duration_minutes) ?? (toNumber(activity?.duration_hours) !== null ? toNumber(activity.duration_hours) * 60 : null),
        rpe: toNumber(activity?.rpe),
        avgHr: toNumber(activity?.avg_hr),
        maxHr: toNumber(activity?.max_hr)
    })).sort((a, b) => (b.parsedDate?.getTime() || 0) - (a.parsedDate?.getTime() || 0));
}

export function normalizeGithubData(latest, history) {
    const daily = Array.isArray(history?.daily_90d) ? history.daily_90d : [];
    const atlSeries = daily.map((row) => {
        const date = parseIsoDate(row?.date);
        const value = toNumber(row?.atl);
        if (!date || value === null) return null;
        return { date, value, raw: row };
    }).filter(Boolean);

    const ctlSeries = daily.map((row) => {
        const date = parseIsoDate(row?.date);
        const value = toNumber(row?.ctl);
        if (!date || value === null) return null;
        return { date, value, raw: row };
    }).filter(Boolean);

    const wellness = Array.isArray(latest?.wellness_data) ? latest.wellness_data : [];
    const hrvSeries = wellness.map((entry) => {
        const date = parseIsoDate(entry?.date);
        const value = toNumber(entry?.hrv);
        if (!date || value === null) return null;
        return { date, value, raw: entry };
    }).filter(Boolean);

    const rhrSeries = wellness.map((entry) => {
        const date = parseIsoDate(entry?.date);
        const value = toNumber(entry?.resting_hr);
        if (!date || value === null) return null;
        return { date, value, raw: entry };
    }).filter(Boolean);

    const sleepSeries = wellness.map((entry) => {
        const date = parseIsoDate(entry?.date);
        const value = toNumber(entry?.sleep_hours);
        if (!date || value === null) return null;
        return { date, value, raw: entry };
    }).filter(Boolean);

    const dailyLoadSeries = daily.map((row) => {
        const date = parseIsoDate(row?.date);
        if (!date) return null;
        const v = toNumber(row?.total_tss);
        return { date, value: v !== null ? v : 0, raw: row };
    }).filter(Boolean);

    return {
        source: 'github',
        userName: latest?.metadata?.athlete_name || 'Athlete',
        atlSeries: sortByDateAsc(atlSeries, (entry) => entry.date),
        ctlSeries: sortByDateAsc(ctlSeries, (entry) => entry.date),
        hrvSeries: sortByDateAsc(hrvSeries, (entry) => entry.date),
        rhrSeries: sortByDateAsc(rhrSeries, (entry) => entry.date),
        sleepSeries: sortByDateAsc(sleepSeries, (entry) => entry.date),
        dailyLoadSeries: sortByDateAsc(dailyLoadSeries, (entry) => entry.date),
        sleepSessions: [],
        workouts: normalizeGithubWorkouts(latest?.recent_activities),
        comments: [],
        raw: { latest, history },
        sourceNote: 'Per-session sleep stages are not available in GitHub mode.'
    };
}
