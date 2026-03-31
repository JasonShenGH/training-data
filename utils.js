export function isFiniteNumber(value) {
    return Number.isFinite(value);
}

export function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

export function safeDivide(numerator, denominator) {
    if (!isFiniteNumber(numerator) || !isFiniteNumber(denominator) || denominator === 0) {
        return null;
    }
    return numerator / denominator;
}

export function clamp(value, min, max) {
    if (!isFiniteNumber(value)) {
        return min;
    }
    return Math.max(min, Math.min(max, value));
}

export function average(values) {
    const valid = values.filter(isFiniteNumber);
    if (!valid.length) return null;
    return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

export function median(values) {
    const valid = values.filter(isFiniteNumber).slice().sort((a, b) => a - b);
    if (!valid.length) return null;
    const mid = Math.floor(valid.length / 2);
    if (valid.length % 2) {
        return valid[mid];
    }
    return (valid[mid - 1] + valid[mid]) / 2;
}

export function stdDev(values) {
    const valid = values.filter(isFiniteNumber);
    if (valid.length < 2) return null;
    const mean = average(valid);
    const variance = valid.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / valid.length;
    return Math.sqrt(variance);
}

export function stdDevSample(values) {
    const valid = values.filter(isFiniteNumber);
    if (valid.length < 2) return null;
    const mean = average(valid);
    const variance = valid.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (valid.length - 1);
    return Math.sqrt(variance);
}

export function parseIsoDate(value) {
    if (typeof value !== 'string') return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date;
}

export function parseMonthDayDate(value, defaultYear = new Date().getFullYear()) {
    if (typeof value !== 'string') return null;
    const match = value.match(/^(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
    if (!match) return null;
    const month = Number(match[1]) - 1;
    const day = Number(match[2]);
    const hour = Number(match[3]);
    const minute = Number(match[4]);
    return new Date(defaultYear, month, day, hour, minute, 0, 0);
}

export function parseChineseDateTime(value) {
    if (typeof value !== 'string') return null;
    const match = value.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);
    const second = Number(match[6]);
    return new Date(year, month, day, hour, minute, second, 0);
}

export function parseDurationHoursFromText(value) {
    if (typeof value !== 'string') return null;
    const match = value.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/i);
    if (!match) return null;
    const h = Number(match[1] || 0);
    const m = Number(match[2] || 0);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    return h + (m / 60);
}

export function formatDate(dateInput) {
    const date = dateInput instanceof Date ? dateInput : parseIsoDate(dateInput);
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(dateInput) {
    const date = dateInput instanceof Date ? dateInput : parseIsoDate(dateInput);
    if (!date) return 'N/A';
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatNumber(value, digits = 1, suffix = '') {
    if (!isFiniteNumber(value)) return 'N/A';
    return `${value.toFixed(digits)}${suffix}`;
}

export function formatPercent(value, digits = 1) {
    if (!isFiniteNumber(value)) return 'N/A';
    return `${(value * 100).toFixed(digits)}%`;
}

export function formatValue(value) {
    if (value === null || value === undefined || value === '') {
        return 'N/A';
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
}

export function sortByDateAsc(list, getDate) {
    return list.slice().sort((a, b) => {
        const aDate = getDate(a)?.getTime() || 0;
        const bDate = getDate(b)?.getTime() || 0;
        return aDate - bDate;
    });
}

export function recentItems(list, count) {
    if (count <= 0) return [];
    return list.slice(Math.max(0, list.length - count));
}

export function slope(lastItems) {
    if (!lastItems || lastItems.length < 2) return null;
    const first = lastItems[0];
    const last = lastItems[lastItems.length - 1];
    if (!isFiniteNumber(first) || !isFiniteNumber(last)) return null;
    return (last - first) / (lastItems.length - 1);
}
