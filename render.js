import { formatDate, formatNumber, formatPercent, formatValue } from './utils.js';
import { METRIC_HELP } from './metricHelp.js';

function metricCard(title, value, status) {
    const hasHelp = Object.prototype.hasOwnProperty.call(METRIC_HELP, title);
    const safeAttr = title.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const helpBtn = hasHelp
        ? `<button type="button" class="metric-help-btn" data-metric-help="${encodeURIComponent(title)}" aria-label="Help: ${safeAttr}" title="About this metric"><svg class="metric-help-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></button>`
        : '';

    return `
        <div class="metric-card">
            <div class="metric-card-header">
                <p class="text-xs uppercase th-muted metric-card-title">${title}</p>
                ${helpBtn}
            </div>
            <p class="text-lg font-semibold th-strong mt-1">${value}</p>
            <p class="text-xs mt-1 ${status?.color || 'th-muted'}">${status?.label || ''}</p>
        </div>
    `;
}

export function setupMetricHelpModal() {
    const modal = document.getElementById('metric-help-modal');
    const titleEl = document.getElementById('metric-help-title');
    const bodyEl = document.getElementById('metric-help-body');
    const closeBtn = document.getElementById('metric-help-close');
    if (!modal || !titleEl || !bodyEl) return;

    function closeModal() {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    function openModal(key) {
        const help = METRIC_HELP[key];
        if (!help) return;
        titleEl.textContent = help.title;
        bodyEl.replaceChildren();
        help.paragraphs.forEach((text, i) => {
            const p = document.createElement('p');
            p.className = i === 0 ? 'text-sm th-modal-body leading-relaxed' : 'text-sm th-modal-body leading-relaxed mt-3';
            p.textContent = text;
            bodyEl.appendChild(p);
        });
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        closeBtn?.focus();
    }

    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-metric-help]');
        if (trigger) {
            e.preventDefault();
            const raw = trigger.getAttribute('data-metric-help');
            if (raw) openModal(decodeURIComponent(raw));
            return;
        }
        if (e.target.closest('[data-metric-help-dismiss]')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/** localStorage key for which data sections are expanded (collapsed is default). */
export const COLLAPSIBLE_SECTIONS_STORAGE_KEY = 'training-dashboard-collapsible-sections';

/**
 * Read persisted expanded flags: `{ [data-collapsible-id]: true }`. Omitted keys = collapsed.
 */
function readCollapsibleSectionState() {
    try {
        const raw = localStorage.getItem(COLLAPSIBLE_SECTIONS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function writeCollapsibleSectionState(state) {
    try {
        localStorage.setItem(COLLAPSIBLE_SECTIONS_STORAGE_KEY, JSON.stringify(state));
    } catch {
        /* quota / private mode */
    }
}

/**
 * Wire collapsible data sections: toggle on trigger click, smooth CSS animation,
 * ARIA + optional `inert` when collapsed, localStorage persistence.
 * Call once after DOM is ready (e.g. from app.js initialize).
 */
export function setupCollapsibleSections() {
    const sections = document.querySelectorAll('.collapsible-section[data-collapsible-id]');
    if (!sections.length) return;

    const persisted = readCollapsibleSectionState();

    function setSectionExpanded(section, expanded, persist) {
        const id = section.getAttribute('data-collapsible-id');
        const trigger = section.querySelector('.collapsible-section__trigger');
        const panel = section.querySelector('.collapsible-section__panel');
        if (!trigger || !panel) return;

        section.classList.toggle('collapsible-section--expanded', expanded);
        trigger.setAttribute('aria-expanded', String(expanded));
        panel.setAttribute('aria-hidden', expanded ? 'false' : 'true');
        if (expanded) {
            panel.removeAttribute('inert');
        } else {
            panel.setAttribute('inert', '');
        }

        if (persist && id) {
            const next = readCollapsibleSectionState();
            if (expanded) {
                next[id] = true;
            } else {
                delete next[id];
            }
            writeCollapsibleSectionState(next);
        }
    }

    sections.forEach((section) => {
        const id = section.getAttribute('data-collapsible-id');
        const expanded = id ? persisted[id] === true : false;
        setSectionExpanded(section, expanded, false);

        const trigger = section.querySelector('.collapsible-section__trigger');
        trigger?.addEventListener('click', () => {
            const isOpen = section.classList.contains('collapsible-section--expanded');
            setSectionExpanded(section, !isOpen, true);
        });
    });
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
        head.innerHTML = '<tr><th class="px-3 py-2 text-left text-xs font-semibold th-muted uppercase">Info</th></tr>';
        body.innerHTML = '<tr><td class="px-3 py-3 text-sm th-muted">No data.</td></tr>';
        return;
    }

    const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
    head.innerHTML = `<tr>${keys.map((key) => `<th class="px-3 py-2 text-left text-xs font-semibold th-muted uppercase">${key}</th>`).join('')}</tr>`;
    body.innerHTML = rows.map((row) => `<tr>${keys.map((key) => `<td class="px-3 py-3 text-sm th-primary align-top">${formatValue(row[key])}</td>`).join('')}</tr>`).join('');
}

function renderStructures(list) {
    const el = document.getElementById('training-structures');
    const item = Array.isArray(list) ? list[0] : null;
    if (!item) {
        el.innerHTML = '<p class="text-sm th-muted">No training recommendation available.</p>';
        return;
    }
    el.innerHTML = `
        <div class="training-structure-card">
            <p class="font-semibold th-strong">${item.name}</p>
            <p class="text-sm th-secondary mt-1">${item.detail}</p>
        </div>
    `;
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
        { title: 'CNS Fatigue', value: metrics.neural.cnsFatigue ? 'Yes' : 'No', status: metrics.neural.cnsFatigue ? { label: 'Warning', color: 'text-rose-400' } : { label: 'Clear', color: 'text-emerald-400' } }
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
        ? `<ul class="space-y-2">${comments.map((comment) => `<li class="comment-item">${formatValue(comment)}</li>`).join('')}</ul>`
        : '<p class="th-muted">No comments in the JSON file.</p>';
}
