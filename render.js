import { formatNumber, formatPercent, formatValue, isFiniteNumber } from './utils.js';
import { getDataReferenceDate } from './metrics.js';
import { paintCockpitGauges } from './cockpit.js';
import {
    applyStaticTranslations,
    getLocale,
    getMetricHelp,
    getMetricTitle,
    getTrainingStructureDetail,
    getTrainingStructureName,
    localizeStatus,
    t,
    translateGuidanceText,
    translatePhrase,
    translateReadinessBand,
    translateTableHeader,
    translateTrendText
} from './i18n.js';

function metricCard(metricKey, value, status) {
    const title = getMetricTitle(metricKey);
    const hasHelp = Boolean(getMetricHelp(getLocale(), metricKey)?.paragraphs?.length);
    const safeAttr = title.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const helpBtn = hasHelp
        ? `<button type="button" class="metric-help-btn" data-metric-help="${encodeURIComponent(metricKey)}" aria-label="${t('metricHelp.label', { title: safeAttr })}" title="${t('metricHelp.about')}"><svg class="metric-help-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></button>`
        : '';

    return `
        <div class="metric-card">
            <div class="metric-card-header">
                <p class="text-xs uppercase th-muted metric-card-title">${title}</p>
                ${helpBtn}
            </div>
            <p class="text-lg font-semibold th-strong mt-1">${formatLocalizedValue(value)}</p>
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
        const help = getMetricHelp(getLocale(), key);
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
    container.innerHTML = entries.map((entry) => metricCard(entry.metricKey, entry.value, entry.status)).join('');
}

function formatLocalizedValue(value) {
    const text = formatValue(value);
    return text === 'N/A' ? t('statuses.nA') : text;
}

function renderDynamicTable(headId, bodyId, rows) {
    const head = document.getElementById(headId);
    const body = document.getElementById(bodyId);
    body.innerHTML = '';

    if (!rows.length) {
        head.innerHTML = `<tr><th class="px-3 py-2 text-left text-xs font-semibold th-muted uppercase">${t('table.info')}</th></tr>`;
        body.innerHTML = `<tr><td class="px-3 py-3 text-sm th-muted">${t('table.noData')}</td></tr>`;
        return;
    }

    const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
    head.innerHTML = `<tr>${keys.map((key) => `<th class="px-3 py-2 text-left text-xs font-semibold th-muted uppercase">${translateTableHeader(key)}</th>`).join('')}</tr>`;
    body.innerHTML = rows.map((row) => `<tr>${keys.map((key) => `<td class="px-3 py-3 text-sm th-primary align-top">${formatLocalizedValue(row[key])}</td>`).join('')}</tr>`).join('');
}

function formatLocalizedDate(dateInput) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return t('statuses.nA');
    const locale = getLocale() === 'en' ? 'en-US' : 'zh-CN';
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function renderStructures(list) {
    const el = document.getElementById('training-structures');
    const item = Array.isArray(list) ? list[0] : null;
    if (!item) {
        el.innerHTML = `<p class="text-sm th-muted">${t('structure.noRecommendation')}</p>`;
        return;
    }
    const type = item.trainingType || item.name;
    el.innerHTML = `
        <div class="training-structure-card">
            <p class="font-semibold th-strong">${getTrainingStructureName(type)}</p>
            <p class="text-sm th-secondary mt-1">${getTrainingStructureDetail(type, item.intensityLevel, item.readinessLevel, item.sessionFocus)}</p>
        </div>
    `;
}

export function renderDashboard(model, metrics) {
    applyStaticTranslations(document);
    document.getElementById('greeting-text').textContent = t('header.greeting', { name: model.userName });
    document.getElementById('source-status').textContent = `${t('source.prefix')}${model.source === 'custom' ? t('source.customJson') : t('source.githubJson')}${model.sourceNote ? ` | ${translatePhrase(model.sourceNote)}` : ''}`;

    document.getElementById('recovery-score-value').textContent = Math.round(metrics.top.recoveryScore);
    document.getElementById('status-level-value').textContent = t('hero.level', { level: metrics.top.statusLevel });
    document.getElementById('status-level-label').textContent = translateReadinessBand(metrics.top.statusLabel);

    setMetricGrid('recovery-system-metrics', [
        { metricKey: 'hrvBaseline', value: formatNumber(metrics.recoverySystem.hrvBaseline, 1) },
        { metricKey: 'hrvRatio', value: formatNumber(metrics.recoverySystem.hrvRatio, 2), status: localizeStatus(metrics.recoverySystem.hrvRatioStatus) },
        { metricKey: 'hrvTrend', value: formatPercent(metrics.recoverySystem.hrvTrend, 1), status: localizeStatus(metrics.recoverySystem.hrvTrendStatus) },
        { metricKey: 'hrvVariability', value: formatNumber(metrics.recoverySystem.hrvVariability, 2), status: localizeStatus(metrics.recoverySystem.hrvVariabilityStatus) },
        { metricKey: 'sleep', value: formatNumber(metrics.recoverySystem.sleep, 2, ' h'), status: localizeStatus(metrics.recoverySystem.sleepStatus) },
        { metricKey: 'rhrDelta', value: formatNumber(metrics.recoverySystem.rhrDelta, 1), status: localizeStatus(metrics.recoverySystem.rhrStatus) }
    ]);

    setMetricGrid('neural-system-metrics', [
        { metricKey: 'hrvZ', value: formatNumber(metrics.neural.hrvZ, 2), status: localizeStatus(metrics.neural.hrvZStatus) },
        { metricKey: 'neuralReadiness', value: metrics.neural.neuralReadiness === null ? t('statuses.nA') : (metrics.neural.neuralReadiness ? t('statuses.ready') : t('statuses.limited')) },
        { metricKey: 'cnsFatigue', value: metrics.neural.cnsFatigue ? t('statuses.yes') : t('statuses.no'), status: metrics.neural.cnsFatigue ? { label: t('statuses.warning'), color: 'text-rose-400' } : { label: t('statuses.clear'), color: 'text-emerald-400' } }
    ]);

    setMetricGrid('training-load-metrics', [
        { metricKey: 'atl', value: formatNumber(metrics.load.atl, 1) },
        { metricKey: 'ctl', value: formatNumber(metrics.load.ctl, 1) },
        { metricKey: 'form', value: formatNumber(metrics.load.form, 1), status: localizeStatus(metrics.load.formStatus) },
        { metricKey: 'acwr', value: formatNumber(metrics.load.acwr, 2), status: localizeStatus(metrics.load.acwrStatus) },
        { metricKey: 'atlSpike', value: formatPercent(metrics.load.atlSpike, 1) },
        { metricKey: 'fatigueMomentum', value: formatPercent(metrics.load.fatigueMomentum, 1), status: localizeStatus(metrics.load.fatigueMomentumStatus) }
    ]);

    setMetricGrid('training-structure-metrics', [
        { metricKey: 'monotony', value: formatNumber(metrics.structure.monotony, 2) },
        { metricKey: 'strain', value: formatNumber(metrics.structure.strain, 1) },
        { metricKey: 'strengthFatigue', value: metrics.structure.strengthFatigue ? t('statuses.high') : t('statuses.normal') },
        { metricKey: 'strengthFrequency', value: formatValue(metrics.structure.strengthFrequency) }
    ]);

    setMetricGrid('fatigue-risk-metrics', [
        { metricKey: 'trainingDensity', value: formatNumber(metrics.fatigueRisk.trainingDensity, 2) },
        { metricKey: 'fatigueRiskScore', value: translateReadinessBand(metrics.fatigueRisk.fatigueRiskScore) },
        { metricKey: 'structuralFatigue', value: metrics.fatigueRisk.structuralFatigue ? t('statuses.high') : t('statuses.normal') }
    ]);

    setMetricGrid('performance-readiness-metrics', [
        { metricKey: 'readinessScore', value: formatNumber(metrics.performance.readinessScore, 1) },
        { metricKey: 'strengthReadiness', value: formatNumber(metrics.performance.strengthReadiness, 1) },
        { metricKey: 'aerobicReadiness', value: formatNumber(metrics.performance.aerobicReadiness, 1) }
    ]);

    document.getElementById('suggest-recommended').textContent = translateGuidanceText(metrics.guidance.recommended);
    document.getElementById('suggest-avoid').textContent = translateGuidanceText(metrics.guidance.avoid);
    document.getElementById('suggest-intensity').textContent = t('guidance.rpe', { rpe: metrics.guidance.rpe });
    document.getElementById('suggest-zone-duration').textContent = t('guidance.zoneDuration', {
        zone: translateGuidanceText(metrics.guidance.zone),
        duration: metrics.guidance.duration
    });

    renderStructures([{
        trainingType: metrics.trainingRecommendation.trainingType,
        intensityLevel: metrics.trainingRecommendation.intensityLevel,
        readinessLevel: metrics.top.statusLevel,
        sessionFocus: metrics.trainingRecommendation.sessionFocus
    }]);
    document.getElementById('trend-fatigue').textContent = translateTrendText(metrics.trend.fatigueTrend);
    document.getElementById('trend-ctl').textContent = translateTrendText(metrics.trend.ctlTrend);
    document.getElementById('trend-window').textContent = translateTrendText(metrics.trend.window48h);
    document.getElementById('trend-risk').textContent = translateTrendText(metrics.trend.futureRisk);

    renderDynamicTable('workouts-head', 'workouts-body', model.workouts.map((workout) => ({
        parsed_date: workout.parsedDate ? formatLocalizedDate(workout.parsedDate) : t('statuses.nA'),
        ...workout.raw
    })));
    renderDynamicTable('sleep-head', 'sleep-body', model.sleepSessions.map((session) => ({
        parsed_start: session.start ? formatLocalizedDate(session.start) : t('statuses.nA'),
        parsed_end: session.end ? formatLocalizedDate(session.end) : t('statuses.nA'),
        total_hours: session.totalHours,
        ...session.raw
    })));
    renderDynamicTable('hrv-head', 'hrv-body', model.hrvSeries.map((entry) => ({ date: formatLocalizedDate(entry.date), hrv: entry.value, ...entry.raw })));
    renderDynamicTable('rhr-head', 'rhr-body', model.rhrSeries.map((entry) => ({ date: formatLocalizedDate(entry.date), rhr: entry.value, ...entry.raw })));

    const ctlByDate = new Map(model.ctlSeries.map((entry) => [entry.date.toISOString().slice(0, 10), entry.value]));
    renderDynamicTable('load-head', 'load-body', model.atlSeries.map((entry) => {
        const key = entry.date.toISOString().slice(0, 10);
        const ctl = ctlByDate.get(key);
        return {
            date: key,
            atl: entry.value,
            ctl: ctl ?? t('statuses.nA'),
            form: ctl !== undefined ? ctl - entry.value : t('statuses.nA')
        };
    }));

    const comments = model.comments || [];
    document.getElementById('comments-list').innerHTML = comments.length
        ? `<ul class="space-y-2">${comments.map((comment) => `<li class="comment-item">${formatLocalizedValue(comment)}</li>`).join('')}</ul>`
        : `<p class="th-muted">${t('comment.none')}</p>`;
}

function cockpitIcon(kind) {
    switch (kind) {
        case 'ok':
            return '<svg class="cockpit-icon--ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
        case 'warn':
            return '<svg class="cockpit-icon--warn" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L2 20h20L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z"/></svg>';
        case 'bad':
            return '<svg class="cockpit-icon--bad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>';
        case 'up':
            return '<svg class="cockpit-icon--ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12l7-7 7 7"/></svg>';
        case 'down':
            return '<svg class="cockpit-icon--bad" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M5 12l7 7 7-7"/></svg>';
        default:
            return '<svg class="cockpit-icon--neutral" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="2"/></svg>';
    }
}

function statusToCockpitIcon(status) {
    if (!status || !status.label) return 'neutral';
    const l = status.label.toLowerCase();
    const c = (status.color || '').toLowerCase();
    if (c.includes('rose') || c.includes('red')) return 'bad';
    if (c.includes('amber') || c.includes('yellow')) return 'warn';
    if (c.includes('emerald') || c.includes('green')) return 'ok';
    if (l.includes('improving') || l.includes('super')) return 'up';
    if (l.includes('declining')) return 'down';
    if (l.includes('warning') || l.includes('high') || l.includes('unstable') || l.includes('limited')) return 'warn';
    if (l.includes('stable') || l.includes('normal') || l.includes('clear') || l.includes('optimal')) return 'ok';
    return 'neutral';
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function cockpitMetricRow(label, valueText, iconKind) {
    const safeBody = escapeHtml(formatLocalizedValue(valueText));
    const safeAttr = safeBody.replace(/"/g, '&quot;');
    return `
        <div class="cockpit-metric-row">
            <span class="cockpit-metric-icon">${cockpitIcon(iconKind)}</span>
            <span class="cockpit-metric-label">${escapeHtml(label)}</span>
            <span class="cockpit-metric-value" title="${safeAttr}">${safeBody}</span>
        </div>
    `;
}

function cockpitRowFromStatus(label, valueText, status) {
    return cockpitMetricRow(label, valueText, statusToCockpitIcon(status));
}

function iconForAtlSpike(spike) {
    if (!isFiniteNumber(spike)) return 'neutral';
    if (spike > 0.25) return 'bad';
    if (spike >= 0.1) return 'warn';
    return 'ok';
}

/**
 * Populate the Training Status cockpit modal from the same `calculateMetrics()` output as the main dashboard.
 */
export function renderCockpit(model, metrics) {
    const root = document.getElementById('cockpit-root');
    const dateEl = document.getElementById('cockpit-header-date');
    if (!root) return;

    const refDate = getDataReferenceDate(model);
    if (dateEl) {
        dateEl.textContent = formatLocalizedDate(refDate);
    }

    const rs = metrics.top.recoveryScore;
    const recoveryDisplay = Number.isFinite(rs) ? String(Math.round(rs)) : '—';

    const neuralIcon = metrics.neural.neuralReadiness === true ? 'ok' : metrics.neural.neuralReadiness === false ? 'warn' : 'neutral';
    const neuralLabel = metrics.neural.neuralReadiness === null ? t('statuses.nA') : (metrics.neural.neuralReadiness ? t('statuses.ready') : t('statuses.limited'));
    const cnsIcon = metrics.neural.cnsFatigue ? 'bad' : 'ok';

    const strengthFatigueIcon = metrics.structure.strengthFatigue ? 'warn' : 'ok';

    root.innerHTML = `
        <div class="cockpit-recovery-block">
            <div class="cockpit-recovery-wrap">
                <div id="cockpit-gauge-recovery" class="cockpit-gauge cockpit-gauge--large" aria-hidden="true"></div>
                <div class="cockpit-recovery-score">
                    <div id="cockpit-recovery-value" class="cockpit-recovery-score__value">${recoveryDisplay}</div>
                    <div class="cockpit-recovery-score__suffix">${t('cockpit.recoveryScore')}</div>
                </div>
            </div>
        </div>

        <div class="cockpit-panels-grid">
            <div class="cockpit-panel">
                <h3 class="cockpit-panel__title">${t('cockpit.recoverySystem')}</h3>
                ${cockpitRowFromStatus(t('metricTitles.hrvRatio'), formatNumber(metrics.recoverySystem.hrvRatio, 2), metrics.recoverySystem.hrvRatioStatus)}
                ${cockpitRowFromStatus(t('metricTitles.hrvTrend'), formatPercent(metrics.recoverySystem.hrvTrend, 1), metrics.recoverySystem.hrvTrendStatus)}
                ${cockpitRowFromStatus(t('metricTitles.hrvVariability'), formatNumber(metrics.recoverySystem.hrvVariability, 2), metrics.recoverySystem.hrvVariabilityStatus)}
                ${cockpitRowFromStatus(t('metricTitles.sleep'), formatNumber(metrics.recoverySystem.sleep, 2, ' h'), metrics.recoverySystem.sleepStatus)}
                ${cockpitRowFromStatus(t('metricTitles.rhrDelta'), formatNumber(metrics.recoverySystem.rhrDelta, 1), metrics.recoverySystem.rhrStatus)}
            </div>
            <div class="cockpit-panel">
                <h3 class="cockpit-panel__title">${t('cockpit.neuralSystem')}</h3>
                ${cockpitRowFromStatus(t('metricTitles.hrvZ'), formatNumber(metrics.neural.hrvZ, 2), metrics.neural.hrvZStatus)}
                ${cockpitMetricRow(t('metricTitles.neuralReadiness'), neuralLabel, neuralIcon)}
                ${cockpitMetricRow(t('metricTitles.cnsFatigue'), metrics.neural.cnsFatigue ? t('statuses.yes') : t('statuses.no'), cnsIcon)}
            </div>
            <div class="cockpit-panel">
                <h3 class="cockpit-panel__title">${t('cockpit.trainingLoad')}</h3>
                ${cockpitMetricRow(t('metricTitles.atl'), formatNumber(metrics.load.atl, 1), 'neutral')}
                ${cockpitMetricRow(t('metricTitles.ctl'), formatNumber(metrics.load.ctl, 1), 'neutral')}
                ${cockpitRowFromStatus(t('metricTitles.form'), formatNumber(metrics.load.form, 1), metrics.load.formStatus)}
                ${cockpitRowFromStatus(t('metricTitles.acwr'), formatNumber(metrics.load.acwr, 2), metrics.load.acwrStatus)}
                ${cockpitMetricRow(t('metricTitles.atlSpike'), formatPercent(metrics.load.atlSpike, 1), iconForAtlSpike(metrics.load.atlSpike))}
                ${cockpitRowFromStatus(t('metricTitles.fatigueMomentum'), formatPercent(metrics.load.fatigueMomentum, 1), metrics.load.fatigueMomentumStatus)}
            </div>
            <div class="cockpit-panel">
                <h3 class="cockpit-panel__title">${t('cockpit.trainingStructure')}</h3>
                ${cockpitMetricRow(t('metricTitles.monotony'), formatNumber(metrics.structure.monotony, 2), statusToCockpitIcon(
                    isFiniteNumber(metrics.structure.monotony) && metrics.structure.monotony > 2
                        ? { label: 'High', color: 'text-amber-400' }
                        : { label: 'Normal', color: 'text-emerald-400' }
                ))}
                ${cockpitMetricRow(t('metricTitles.strengthFatigue'), metrics.structure.strengthFatigue ? t('statuses.yes') : t('statuses.no'), strengthFatigueIcon)}
                ${cockpitMetricRow(t('metricTitles.trainingDensity'), formatNumber(metrics.fatigueRisk.trainingDensity, 2), statusToCockpitIcon(
                    isFiniteNumber(metrics.fatigueRisk.trainingDensity) && metrics.fatigueRisk.trainingDensity > 1.2
                        ? { label: 'High', color: 'text-amber-400' }
                        : { label: 'Normal', color: 'text-emerald-400' }
                ))}
            </div>
        </div>

        <div class="cockpit-readiness-row">
            <div class="cockpit-readiness-card">
                <div class="cockpit-readiness-card__label">${t('cockpit.strengthReadiness')}</div>
                <div id="cockpit-gauge-strength" class="cockpit-gauge cockpit-gauge--sm" aria-hidden="true"></div>
                <div id="cockpit-strength-readiness-value" class="cockpit-readiness-value">${formatNumber(metrics.performance.strengthReadiness, 0)}</div>
            </div>
            <div class="cockpit-readiness-card">
                <div class="cockpit-readiness-card__label">${t('cockpit.aerobicReadiness')}</div>
                <div id="cockpit-gauge-aerobic" class="cockpit-gauge cockpit-gauge--sm" aria-hidden="true"></div>
                <div id="cockpit-aerobic-readiness-value" class="cockpit-readiness-value">${formatNumber(metrics.performance.aerobicReadiness, 0)}</div>
            </div>
        </div>

        <div class="cockpit-rec-table-wrap">
            <table class="cockpit-rec-table">
                <colgroup>
                    <col class="cockpit-rec-col cockpit-rec-col--recommended" />
                    <col class="cockpit-rec-col cockpit-rec-col--avoid" />
                    <col class="cockpit-rec-col cockpit-rec-col--rpe" />
                    <col class="cockpit-rec-col cockpit-rec-col--zone" />
                    <col class="cockpit-rec-col cockpit-rec-col--duration" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">${t('cockpit.recommendedTraining')}</th>
                        <th scope="col">${t('cockpit.avoidTraining')}</th>
                        <th scope="col">${t('cockpit.rpeRange')}</th>
                        <th scope="col">${t('cockpit.heartRateZone')}</th>
                        <th scope="col">${t('cockpit.duration')}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${escapeHtml(formatValue(translateGuidanceText(metrics.guidance.recommended)))}</td>
                        <td>${escapeHtml(formatValue(translateGuidanceText(metrics.guidance.avoid)))}</td>
                        <td>${escapeHtml(formatValue(metrics.guidance.rpe))}</td>
                        <td>${escapeHtml(formatValue(translateGuidanceText(metrics.guidance.zone)))}</td>
                        <td>${escapeHtml(formatValue(metrics.guidance.duration))}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    paintCockpitGauges(metrics);
}
