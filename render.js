import { formatDate, formatNumber, formatPercent, formatValue } from './utils.js';

function metricCard(title, value, status) {
    return `
        <div class="metric-card">
            <p class="text-xs uppercase text-gray-500">${title}</p>
            <p class="text-lg font-semibold text-gray-900 mt-1">${value}</p>
            <p class="text-xs mt-1 ${status?.color || 'text-gray-500'}">${status?.label || ''}</p>
        </div>
    `;
}

function setMetricGrid(containerId, entries) {
    const container = document.getElementById(containerId);
    container.innerHTML = entries.map((entry) => metricCard(entry.title, entry.value, entry.status)).join('');
}

function renderDynamicTable(headId, bodyId, rows) {
    const head = document.getElementById(headId);
    const body = document.getElementById(bodyId);
    body.innerHTML = '';

    if (!rows.length) {
        head.innerHTML = '<tr><th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Info</th></tr>';
        body.innerHTML = '<tr><td class="px-3 py-3 text-sm text-gray-500">No data.</td></tr>';
        return;
    }

    const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
    head.innerHTML = `<tr>${keys.map((key) => `<th class="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">${key}</th>`).join('')}</tr>`;
    body.innerHTML = rows.map((row) => `<tr>${keys.map((key) => `<td class="px-3 py-3 text-sm text-gray-700 align-top">${formatValue(row[key])}</td>`).join('')}</tr>`).join('');
}

function renderStructures(list) {
    document.getElementById('training-structures').innerHTML = list.map((item) => `
        <div class="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p class="font-semibold text-gray-900">${item.name}</p>
            <p class="text-sm text-gray-600 mt-1">${item.detail}</p>
        </div>
    `).join('');
}

export function renderDashboard(model, metrics) {
    document.getElementById('greeting-text').textContent = `Hi, ${model.userName}`;
    document.getElementById('source-status').textContent = `Data source: ${model.source === 'custom' ? 'Custom JSON' : 'GitHub JSON'}${model.sourceNote ? ` | ${model.sourceNote}` : ''}`;

    document.getElementById('recovery-score-value').textContent = Math.round(metrics.top.recoveryScore);
    document.getElementById('status-level-value').textContent = `Level ${metrics.top.statusLevel}`;
    document.getElementById('status-level-label').textContent = metrics.top.statusLabel;

    setMetricGrid('recovery-system-metrics', [
        { title: 'HRV Baseline', value: formatNumber(metrics.recoverySystem.hrvBaseline, 1) },
        { title: 'HRV Ratio', value: formatNumber(metrics.recoverySystem.hrvRatio, 2), status: metrics.recoverySystem.hrvRatioStatus },
        { title: 'HRV Trend', value: formatPercent(metrics.recoverySystem.hrvTrend, 1), status: metrics.recoverySystem.hrvTrendStatus },
        { title: 'HRV Variability', value: formatNumber(metrics.recoverySystem.hrvVariability, 2), status: metrics.recoverySystem.hrvVariabilityStatus },
        { title: 'Sleep', value: formatNumber(metrics.recoverySystem.sleep, 2, ' h'), status: metrics.recoverySystem.sleepStatus },
        { title: 'RHR Delta', value: formatNumber(metrics.recoverySystem.rhrDelta, 1), status: metrics.recoverySystem.rhrStatus }
    ]);

    setMetricGrid('neural-system-metrics', [
        { title: 'HRV Z-score', value: formatNumber(metrics.neural.hrvZ, 2), status: metrics.neural.hrvZStatus },
        { title: 'Neural Readiness', value: metrics.neural.neuralReadiness === null ? 'N/A' : (metrics.neural.neuralReadiness ? 'Neural Ready' : 'Neural Limited') },
        { title: 'CNS Fatigue', value: metrics.neural.cnsFatigue ? 'Yes' : 'No', status: metrics.neural.cnsFatigue ? { label: 'Warning', color: 'text-red-600' } : { label: 'Clear', color: 'text-green-600' } }
    ]);

    setMetricGrid('training-load-metrics', [
        { title: 'ATL', value: formatNumber(metrics.load.atl, 1) },
        { title: 'CTL', value: formatNumber(metrics.load.ctl, 1) },
        { title: 'Form', value: formatNumber(metrics.load.form, 1), status: metrics.load.formStatus },
        { title: 'ACWR', value: formatNumber(metrics.load.acwr, 2), status: metrics.load.acwrStatus },
        { title: 'ATL Spike', value: formatPercent(metrics.load.atlSpike, 1) },
        { title: 'Fatigue Momentum', value: formatPercent(metrics.load.fatigueMomentum, 1), status: metrics.load.fatigueMomentumStatus }
    ]);

    setMetricGrid('training-structure-metrics', [
        { title: 'Monotony', value: formatNumber(metrics.structure.monotony, 2) },
        { title: 'Strain', value: formatNumber(metrics.structure.strain, 1) },
        { title: 'Strength Fatigue', value: metrics.structure.strengthFatigue ? 'Yes' : 'No' },
        { title: 'Strength Frequency (7d)', value: formatValue(metrics.structure.strengthFrequency) }
    ]);

    setMetricGrid('fatigue-risk-metrics', [
        { title: 'Training Density', value: formatNumber(metrics.fatigueRisk.trainingDensity, 2) },
        { title: 'Fatigue Risk Score', value: metrics.fatigueRisk.fatigueRiskScore },
        { title: 'Structural Fatigue', value: metrics.fatigueRisk.structuralFatigue ? 'High' : 'Normal' }
    ]);

    setMetricGrid('performance-readiness-metrics', [
        { title: 'Readiness Score', value: formatNumber(metrics.performance.readinessScore, 1) },
        { title: 'Strength Readiness', value: formatNumber(metrics.performance.strengthReadiness, 1) },
        { title: 'Aerobic Readiness', value: formatNumber(metrics.performance.aerobicReadiness, 1) }
    ]);

    document.getElementById('suggest-recommended').textContent = metrics.guidance.recommended;
    document.getElementById('suggest-avoid').textContent = metrics.guidance.avoid;
    document.getElementById('suggest-intensity').textContent = `RPE ${metrics.guidance.rpe}`;
    document.getElementById('suggest-zone-duration').textContent = `${metrics.guidance.zone} | ${metrics.guidance.duration}`;

    renderStructures(metrics.structures);
    document.getElementById('trend-fatigue').textContent = metrics.trend.fatigueTrend;
    document.getElementById('trend-ctl').textContent = metrics.trend.ctlTrend;
    document.getElementById('trend-window').textContent = metrics.trend.window48h;
    document.getElementById('trend-risk').textContent = metrics.trend.futureRisk;

    renderDynamicTable('workouts-head', 'workouts-body', model.workouts.map((workout) => ({
        parsed_date: workout.parsedDate ? formatDate(workout.parsedDate) : 'N/A',
        ...workout.raw
    })));
    renderDynamicTable('sleep-head', 'sleep-body', model.sleepSessions.map((session) => ({
        parsed_start: session.start ? formatDate(session.start) : 'N/A',
        parsed_end: session.end ? formatDate(session.end) : 'N/A',
        total_hours: session.totalHours,
        ...session.raw
    })));
    renderDynamicTable('hrv-head', 'hrv-body', model.hrvSeries.map((entry) => ({ date: formatDate(entry.date), hrv: entry.value, ...entry.raw })));
    renderDynamicTable('rhr-head', 'rhr-body', model.rhrSeries.map((entry) => ({ date: formatDate(entry.date), rhr: entry.value, ...entry.raw })));

    const ctlByDate = new Map(model.ctlSeries.map((entry) => [entry.date.toISOString().slice(0, 10), entry.value]));
    renderDynamicTable('load-head', 'load-body', model.atlSeries.map((entry) => {
        const key = entry.date.toISOString().slice(0, 10);
        const ctl = ctlByDate.get(key);
        return {
            date: key,
            atl: entry.value,
            ctl: ctl ?? 'N/A',
            form: ctl !== undefined ? ctl - entry.value : 'N/A'
        };
    }));

    const comments = model.comments || [];
    document.getElementById('comments-list').innerHTML = comments.length
        ? `<ul class="space-y-2">${comments.map((comment) => `<li class="p-3 bg-gray-50 rounded">${formatValue(comment)}</li>`).join('')}</ul>`
        : '<p class="text-gray-500">No comments in the JSON file.</p>';
}
