import { clamp, isFiniteNumber } from './utils.js';
import { t } from './i18n.js';

/**
 * Polar coords: angle 0 = right, PI/2 = top, PI = left (SVG y-down).
 */
function polar(cx, cy, r, angleRad) {
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy - r * Math.sin(angleRad)
    };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
    const s = polar(cx, cy, r, startAngle);
    const e = polar(cx, cy, r, endAngle);
    // For upper semicircle: angle goes from PI (left) to 0 (right)
    // We need sweep=1 to draw the arc along the top
    const sweep = 1;
    const delta = Math.abs(endAngle - startAngle);
    const large = delta > Math.PI ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} ${sweep} ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

function angleForValue(v) {
    return Math.PI * (1 - clamp(v, 0, 100) / 100);
}

const ZONE_COLORS = {
    red: '#ef4444',
    yellow: '#eab308',
    green: '#22c55e'
};

function buildZoneArcs(cx, cy, r, strokeWidth) {
    const t40 = Math.PI * (1 - 0.4);
    const t70 = Math.PI * (1 - 0.7);
    const paths = [
        { d: arcPath(cx, cy, r, Math.PI, t40), stroke: ZONE_COLORS.red },
        { d: arcPath(cx, cy, r, t40, t70), stroke: ZONE_COLORS.yellow },
        { d: arcPath(cx, cy, r, t70, 0), stroke: ZONE_COLORS.green }
    ];
    return paths
        .map(
            (p) =>
                `<path d="${p.d}" fill="none" stroke="${p.stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="0.92"/>`
        )
        .join('');
}

function needleLine(cx, cy, rInner, value) {
    const th = angleForValue(value);
    const tip = polar(cx, cy, rInner, th);
    return `<line x1="${cx}" y1="${cy}" x2="${tip.x.toFixed(2)}" y2="${tip.y.toFixed(2)}" class="cockpit-gauge-needle" stroke-width="3" stroke-linecap="round"/>`;
}

/**
 * Mount a semi-circular 0–100 gauge with red/yellow/green zones into `container`.
 */
export function mountSemiGauge(container, value, options = {}) {
    if (!container) return;
    const { size = 'lg' } = options;
    const w = size === 'lg' ? 300 : 168;
    const h = size === 'lg' ? 158 : 92;
    const cx = w / 2;
    const cy = h - 4;
    const r = size === 'lg' ? 118 : 64;
    const stroke = size === 'lg' ? 16 : 9;
    const v = isFiniteNumber(value) ? clamp(value, 0, 100) : 0;

    const zones = buildZoneArcs(cx, cy, r, stroke);
    const needle = needleLine(cx, cy, r - stroke * 0.35, v);
    const hub = `<circle cx="${cx}" cy="${cy}" r="${size === 'lg' ? 6 : 4}" class="cockpit-gauge-hub"/>`;

    container.innerHTML = `
        <svg class="cockpit-gauge-svg cockpit-gauge-svg--${size}" viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${t('gauge.value', { value: Math.round(v) })}">
            ${zones}
            ${needle}
            ${hub}
        </svg>
    `;
}

function trainingStatusPngFilename() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `training-status-${y}-${m}-${day}.png`;
}

function triggerPngDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function cockpitCaptureBackgroundColor(dialogEl) {
    const bg = dialogEl ? getComputedStyle(dialogEl).backgroundColor : '';
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return bg;
    }
    const solid = getComputedStyle(document.documentElement).getPropertyValue('--cockpit-surface-solid').trim();
    return solid || '#f8fafc';
}

export function setupCockpitModal() {
    const modal = document.getElementById('cockpit-modal');
    const closeBtn = document.getElementById('cockpit-close');
    const saveBtn = document.getElementById('cockpit-save-picture');
    const overlay = document.getElementById('cockpit-capture-overlay');

    if (!modal) return;

    function closeCockpit() {
        modal.classList.add('hidden');
        document.body.classList.remove('cockpit-modal-open');
    }

    async function saveCockpitPicture() {
        const root = document.getElementById('cockpit-root');
        const dialog = modal.querySelector('.cockpit-modal__dialog');
        const h2c = typeof window !== 'undefined' ? window.html2canvas : undefined;
        if (!root || !dialog || !saveBtn) return;
        if (typeof h2c !== 'function') {
            console.error('html2canvas is not loaded');
            return;
        }

        const backgroundColor = cockpitCaptureBackgroundColor(dialog);
        saveBtn.disabled = true;
        if (overlay) {
            overlay.hidden = false;
            overlay.setAttribute('aria-hidden', 'false');
        }

        try {
            const canvas = await h2c(root, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor,
                onclone: (doc) => {
                    const cloneRoot = doc.getElementById('cockpit-root');
                    if (cloneRoot) {
                        cloneRoot.style.backgroundColor = backgroundColor;
                    }
                }
            });
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png');
            });
            triggerPngDownload(blob, trainingStatusPngFilename());
        } catch (e) {
            console.error(e);
        } finally {
            if (overlay) {
                overlay.hidden = true;
                overlay.setAttribute('aria-hidden', 'true');
            }
            saveBtn.disabled = false;
        }
    }

    saveBtn?.addEventListener('click', () => {
        void saveCockpitPicture();
    });

    closeBtn?.addEventListener('click', () => closeCockpit());

    modal.addEventListener('click', (e) => {
        if (e.target.closest('[data-cockpit-dismiss]')) {
            closeCockpit();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (modal.classList.contains('hidden')) return;
        const help = document.getElementById('metric-help-modal');
        if (help && !help.classList.contains('hidden')) return;
        closeCockpit();
    });
}

/**
 * After `renderCockpit` fills the DOM, paint SVG gauges from metrics.
 */
export function paintCockpitGauges(metrics) {
    const recovery = metrics?.top?.recoveryScore;
    const strength = metrics?.performance?.strengthReadiness;
    const aerobic = metrics?.performance?.aerobicReadiness;

    mountSemiGauge(document.getElementById('cockpit-gauge-recovery'), recovery, { size: 'lg' });
    mountSemiGauge(document.getElementById('cockpit-gauge-strength'), strength, { size: 'sm' });
    mountSemiGauge(document.getElementById('cockpit-gauge-aerobic'), aerobic, { size: 'sm' });
}
