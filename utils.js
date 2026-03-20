// Utility functions for data parsing and formatting

export function formatDuration(hours) {
    if (!hours) return 'N/A';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h${m}m`;
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function getTSBColor(tsb) {
    if (tsb > -10) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-400' };
    if (tsb > -30) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-400' };
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-400' };
}

export function getTSBLabel(tsb) {
    if (tsb > -10) return 'Fresh';
    if (tsb > -30) return 'Moderate Fatigue';
    return 'High Fatigue';
}

export function getACWRColor(acwr) {
    if (acwr >= 0.8 && acwr <= 1.3) return 'text-green-600';
    if (acwr >= 0.5 && acwr < 0.8) return 'text-blue-600';
    return 'text-red-600';
}

export function getACWRLabel(acwr) {
    if (acwr >= 0.8 && acwr <= 1.3) return 'Optimal';
    if (acwr >= 0.5 && acwr < 0.8) return 'Detraining';
    return 'High Risk';
}

export function getReadinessConfig(recommendation) {
    const configs = {
        'go': {
            icon: '✅',
            color: 'text-green-600',
            borderColor: 'border-green-500',
            bgColor: 'bg-green-50',
            label: 'GO'
        },
        'modify': {
            icon: '⚠️',
            color: 'text-yellow-600',
            borderColor: 'border-yellow-500',
            bgColor: 'bg-yellow-50',
            label: 'MODIFY'
        },
        'skip': {
            icon: '🛑',
            color: 'text-red-600',
            borderColor: 'border-red-500',
            bgColor: 'bg-red-50',
            label: 'SKIP'
        }
    };
    return configs[recommendation] || configs['go'];
}

export function getPriorityLabel(priority) {
    const labels = {
        0: 'P0 - Safety',
        1: 'P1 - Overload',
        2: 'P2 - Fatigue',
        3: 'P3 - Green Light'
    };
    return labels[priority] || `P${priority}`;
}

export function getActivityTypeColor(type) {
    const colors = {
        'WeightTraining': '#8b5cf6',
        'VirtualRide': '#3b82f6',
        'Ride': '#10b981',
        'Run': '#ef4444',
        'Swim': '#06b6d4',
        'Hike': '#f59e0b',
        'Badminton': '#ec4899'
    };
    return colors[type] || '#6b7280';
}

export function getActivityTypeLabel(type) {
    const labels = {
        'WeightTraining': 'Strength',
        'VirtualRide': 'Indoor Cycling',
        'Ride': 'Cycling',
        'Run': 'Running',
        'Swim': 'Swimming',
        'Hike': 'Hiking',
        'Badminton': 'Badminton'
    };
    return labels[type] || type;
}

export function secondsToFormatted(seconds) {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h${minutes}m`;
    }
    return `${minutes}m`;
}

export function calculateZonePercentages(zones) {
    const total = Object.values(zones).reduce((sum, val) => sum + val, 0);
    if (total === 0) return {};
    
    const percentages = {};
    for (const [zone, seconds] of Object.entries(zones)) {
        percentages[zone] = (seconds / total) * 100;
    }
    return percentages;
}

export function getZoneColor(zone) {
    const colors = {
        'z1': '#22c55e',
        'z2': '#84cc16',
        'z3': '#eab308',
        'z4': '#f97316',
        'z5': '#ef4444',
        'z6': '#dc2626',
        'z7': '#991b1b'
    };
    return colors[zone] || '#6b7280';
}

export function getZoneLabel(zone) {
    const labels = {
        'z1': 'Z1 (Recovery)',
        'z2': 'Z2 (Endurance)',
        'z3': 'Z3 (Tempo)',
        'z4': 'Z4 (Threshold)',
        'z5': 'Z5 (VO2max)',
        'z6': 'Z6 (Anaerobic)',
        'z7': 'Z7 (Sprint)'
    };
    return labels[zone] || zone.toUpperCase();
}

export function normalizeZoneKey(key) {
    return key && key.endsWith('_time') ? key.replace('_time', '') : key;
}
