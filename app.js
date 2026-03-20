import * as utils from './utils.js';
import * as charts from './charts.js';

const LATEST_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/latest.json';
const HISTORY_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/history.json';

let latestData = null;
let historyData = null;
let currentFitnessView = 90;

async function fetchData() {
    try {
        const cacheKey = 'trainingData';
        const cacheTimeKey = 'trainingDataTime';
        const cacheExpiry = 5 * 60 * 1000;
        
        const cachedTime = sessionStorage.getItem(cacheTimeKey);
        const now = Date.now();
        
        if (cachedTime && (now - parseInt(cachedTime)) < cacheExpiry) {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                latestData = data.latest;
                historyData = data.history;
                return { latestData, historyData };
            }
        }

        const [latestResponse, historyResponse] = await Promise.all([
            fetch(LATEST_URL),
            fetch(HISTORY_URL)
        ]);

        if (!latestResponse.ok || !historyResponse.ok) {
            throw new Error('Failed to fetch data from GitHub');
        }

        latestData = await latestResponse.json();
        historyData = await historyResponse.json();

        sessionStorage.setItem(cacheKey, JSON.stringify({ latest: latestData, history: historyData }));
        sessionStorage.setItem(cacheTimeKey, now.toString());

        return { latestData, historyData };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function showError(message) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('error-message').textContent = message;
    console.error('Dashboard error:', message);
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
}

function populateReadinessCard() {
    const readiness = latestData.readiness_decision;
    const config = utils.getReadinessConfig(readiness.recommendation);

    const card = document.getElementById('readiness-card');
    card.classList.add(config.borderColor);

    document.getElementById('readiness-icon').textContent = config.icon;
    document.getElementById('readiness-status').textContent = config.label;
    document.getElementById('readiness-status').className = `text-3xl font-bold mb-2 ${config.color}`;
    
    document.getElementById('readiness-priority').textContent = utils.getPriorityLabel(readiness.priority);
    document.getElementById('readiness-priority').className = `text-sm font-medium mb-3 ${config.color}`;
    
    document.getElementById('readiness-reason').textContent = readiness.reason;

    const signals = readiness.signal_summary;
    document.getElementById('signals-green').textContent = `${signals.green} Green`;
    document.getElementById('signals-amber').textContent = `${signals.amber} Amber`;
    document.getElementById('signals-red').textContent = `${signals.red} Red`;
}

function populateQuickStats() {
    const weekly = latestData.weekly_summary;
    const fitness = latestData.current_status.fitness;
    const derived = latestData.derived_metrics;
    const phase = latestData.derived_metrics.phase_detection;

    document.getElementById('stat-hours').textContent = weekly.total_training_formatted || '0h';
    document.getElementById('stat-tss').textContent = `${weekly.total_tss || 0} TSS`;

    const tsb = fitness.tsb;
    const tsbColors = utils.getTSBColor(tsb);
    document.getElementById('stat-tsb').textContent = tsb ? tsb.toFixed(1) : 'N/A';
    document.getElementById('stat-tsb').className = `text-2xl font-bold ${tsbColors.text}`;
    document.getElementById('stat-tsb-label').textContent = utils.getTSBLabel(tsb);

    const acwr = derived.acwr;
    document.getElementById('stat-acwr').textContent = acwr ? acwr.toFixed(2) : 'N/A';
    document.getElementById('stat-acwr').className = `text-2xl font-bold ${acwr ? utils.getACWRColor(acwr) : 'text-gray-900'}`;
    document.getElementById('stat-acwr-label').textContent = derived.acwr_interpretation || 'N/A';

    document.getElementById('stat-phase').textContent = phase.phase || 'N/A';
    document.getElementById('stat-phase-week').textContent = phase.phase_week ? `Week ${phase.phase_week}` : '';

    document.getElementById('last-updated').textContent = 
        `Last updated: ${utils.formatDate(latestData.metadata.last_updated)}`;
}

function populateAlerts() {
    const alerts = latestData.alerts;
    if (alerts && alerts.length > 0) {
        const banner = document.getElementById('alert-banner');
        banner.classList.remove('hidden');
        
        const content = document.getElementById('alert-content');
        content.innerHTML = alerts.map(alert => 
            `<div class="mb-2"><strong>${alert.metric}:</strong> ${alert.context}</div>`
        ).join('');
    }
}

function populateHistoricalSummary() {
    const summaries = historyData.summaries;

    if (summaries['90d']) {
        document.getElementById('hist-90d-tss').textContent = `${summaries['90d'].avg_weekly_tss} TSS/wk`;
        document.getElementById('hist-90d-hours').textContent = `${summaries['90d'].avg_weekly_hours}h/wk`;
        document.getElementById('hist-90d-rest').textContent = `${summaries['90d'].rest_days} rest days`;
        document.getElementById('hist-total-activities').textContent = summaries['90d'].total_activities;
    }

    if (summaries['180d']) {
        document.getElementById('hist-180d-tss').textContent = `${summaries['180d'].avg_weekly_tss} TSS/wk`;
        document.getElementById('hist-180d-ctl').textContent = 
            `CTL: ${summaries['180d'].ctl_start.toFixed(1)} → ${summaries['180d'].ctl_end.toFixed(1)}`;
    }

    if (summaries['1y']) {
        document.getElementById('hist-1y-peak').textContent = `CTL ${summaries['1y'].ctl_peak.toFixed(1)}`;
        document.getElementById('hist-1y-low').textContent = `Low: ${summaries['1y'].ctl_low.toFixed(1)}`;
    }

    const dataRange = historyData.data_range;
    if (dataRange) {
        document.getElementById('hist-data-range').textContent = 
            `${dataRange.earliest} to ${dataRange.latest}`;
    }
}

function populateActivitiesTable() {
    const activities = latestData.recent_activities;
    const tbody = document.getElementById('activities-table');
    tbody.innerHTML = '';

    activities.forEach((activity, index) => {
        const row = document.createElement('tr');
        row.className = 'activity-row';
        row.innerHTML = `
            <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                ${utils.formatDate(activity.date).split(',')[0]}
            </td>
            <td class="px-2 sm:px-4 py-4 text-xs sm:text-sm text-gray-900">${activity.name}</td>
            <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-medium" 
                      style="background-color: ${utils.getActivityTypeColor(activity.type)}20; color: ${utils.getActivityTypeColor(activity.type)}">
                    ${utils.getActivityTypeLabel(activity.type)}
                </span>
            </td>
            <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                ${utils.formatDuration(activity.duration_hours)}
            </td>
            <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">${activity.tss || '-'}</td>
            <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">${activity.avg_hr ? activity.avg_hr + ' bpm' : '-'}</td>
            <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                <button class="text-blue-600 hover:text-blue-800 font-medium" onclick="toggleActivityDetails(${index})">
                    <span class="hidden sm:inline">Details</span>
                    <span class="sm:hidden">+</span>
                </button>
            </td>
        `;
        tbody.appendChild(row);

        const detailsRow = document.createElement('tr');
        detailsRow.id = `activity-details-${index}`;
        detailsRow.className = 'activity-details';
        detailsRow.innerHTML = `
            <td colspan="7" class="px-2 sm:px-4 py-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <div class="font-medium text-gray-700 mb-2">Metrics</div>
                        <div class="space-y-1">
                            <div><span class="text-gray-600">Time:</span> ${utils.formatTime(activity.date)}</div>
                            <div><span class="text-gray-600">Max HR:</span> ${activity.max_hr ? activity.max_hr + ' bpm' : 'N/A'}</div>
                            <div><span class="text-gray-600">Intensity Factor:</span> ${activity.intensity_factor ? activity.intensity_factor.toFixed(1) + '%' : 'N/A'}</div>
                            <div><span class="text-gray-600">Calories:</span> ${activity.calories || 'N/A'}</div>
                            <div><span class="text-gray-600">RPE:</span> ${activity.rpe || 'N/A'}</div>
                            ${activity.hrrc ? `<div><span class="text-gray-600">HR Recovery:</span> ${activity.hrrc} bpm</div>` : ''}
                        </div>
                    </div>
                    <div>
                        <div class="font-medium text-gray-700 mb-2">Heart Rate Zones</div>
                        ${renderZoneDistribution(activity.zone_distribution)}
                    </div>
                </div>
                ${activity.coach_notes && activity.coach_notes.length > 0 ? `
                    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div class="font-medium text-gray-700 mb-1">Notes</div>
                        <div class="text-gray-600">${activity.coach_notes.join(', ')}</div>
                    </div>
                ` : ''}
            </td>
        `;
        tbody.appendChild(detailsRow);
    });
}

function renderZoneDistribution(zoneDistribution) {
    if (!zoneDistribution || !zoneDistribution.hr_zones) {
        return '<div class="text-gray-500">No zone data</div>';
    }

    const zones = zoneDistribution.hr_zones;
    const percentages = utils.calculateZonePercentages(zones);
    
    let html = '<div class="zone-bar mb-2">';
    for (const [zone, pct] of Object.entries(percentages)) {
        if (pct > 0) {
            const displayZone = utils.normalizeZoneKey(zone);
            html += `<div class="zone-segment" style="width: ${pct}%; background-color: ${utils.getZoneColor(displayZone)}" 
                          title="${utils.getZoneLabel(displayZone)}: ${utils.secondsToFormatted(zones[zone])} (${pct.toFixed(1)}%)"></div>`;
        }
    }
    html += '</div>';
    
    html += '<div class="space-y-1 text-xs">';
    for (const [zone, seconds] of Object.entries(zones)) {
        if (seconds > 0) {
            const displayZone = utils.normalizeZoneKey(zone);
            html += `<div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded" style="background-color: ${utils.getZoneColor(displayZone)}"></div>
                <span>${utils.getZoneLabel(displayZone)}: ${utils.secondsToFormatted(seconds)}</span>
            </div>`;
        }
    }
    html += '</div>';
    
    return html;
}

window.toggleActivityDetails = function(index) {
    const detailsRow = document.getElementById(`activity-details-${index}`);
    detailsRow.classList.toggle('expanded');
};

async function initialize() {
    try {
        await fetchData();
        
        populateReadinessCard();
        populateQuickStats();
        populateAlerts();
        populateHistoricalSummary();
        populateActivitiesTable();
        
        charts.initializeFitnessChart(historyData.daily_90d, currentFitnessView);
        charts.initializeTSSChart(historyData.daily_90d.slice(-7));
        charts.initializeActivityPieChart(latestData.summary.by_activity_type);
        charts.initializeSleepChart(latestData.wellness_data);
        charts.initializeRHRChart(latestData.wellness_data, latestData.derived_metrics.rhr_baseline_7d);
        charts.initializeTIDChart(latestData.derived_metrics);
        
        hideLoading();
        
        setupEventListeners();
        
        setInterval(async () => {
            try {
                const oldTime = sessionStorage.getItem('trainingDataTime');
                sessionStorage.removeItem('trainingDataTime');
                await fetchData();
                
                const newTime = sessionStorage.getItem('trainingDataTime');
                if (oldTime !== newTime) {
                    console.log('New data available, refreshing...');
                    location.reload();
                }
            } catch (error) {
                console.error('Auto-refresh failed:', error);
            }
        }, 5 * 60 * 1000);
        
    } catch (error) {
        showError(`Failed to load training data: ${error.message}`);
    }
}

function setupEventListeners() {
    document.getElementById('btn-30d').addEventListener('click', () => {
        currentFitnessView = 30;
        document.getElementById('btn-30d').className = 'px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white';
        document.getElementById('btn-90d').className = 'px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200';
        charts.updateFitnessChart(historyData.daily_90d, 30);
    });

    document.getElementById('btn-90d').addEventListener('click', () => {
        currentFitnessView = 90;
        document.getElementById('btn-90d').className = 'px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white';
        document.getElementById('btn-30d').className = 'px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200';
        charts.updateFitnessChart(historyData.daily_90d, 90);
    });

    document.getElementById('refresh-btn').addEventListener('click', async () => {
        const btn = document.getElementById('refresh-btn');
        btn.disabled = true;
        btn.textContent = 'Refreshing...';
        
        try {
            sessionStorage.clear();
            await fetchData();
            location.reload();
        } catch (error) {
            btn.disabled = false;
            btn.textContent = 'Refresh Data';
            showError(`Failed to refresh data: ${error.message}`);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            document.getElementById('refresh-btn').click();
        }
    });
}

document.addEventListener('DOMContentLoaded', initialize);
