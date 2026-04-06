import { t } from './i18n.js';

let loadChart = null;
let hrvRhrChart = null;

function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark
        ? { text: '#94a3b8', grid: 'rgba(148, 163, 184, 0.12)' }
        : { text: '#64748b', grid: 'rgba(100, 116, 139, 0.18)' };
}

function buildScales() {
    const { text, grid } = getChartColors();
    return {
        x: {
            type: 'time',
            time: { unit: 'day' },
            ticks: { color: text },
            grid: { color: grid },
            border: { color: grid }
        },
        y: {
            ticks: { color: text },
            grid: { color: grid },
            border: { color: grid }
        }
    };
}

function destroyCharts() {
    if (loadChart) loadChart.destroy();
    if (hrvRhrChart) hrvRhrChart.destroy();
}

function applyColorsToChart(chart, text, grid) {
    chart.options.plugins.legend.labels.color = text;
    chart.options.scales.x.ticks.color = text;
    chart.options.scales.x.grid.color = grid;
    chart.options.scales.x.border.color = grid;
    chart.options.scales.y.ticks.color = text;
    chart.options.scales.y.grid.color = grid;
    chart.options.scales.y.border.color = grid;
    chart.update('none');
}

export function refreshChartsTheme() {
    const { text, grid } = getChartColors();
    [loadChart, hrvRhrChart].forEach((chart) => {
        if (!chart) return;
        applyColorsToChart(chart, text, grid);
    });
}

export function renderCharts(model) {
    destroyCharts();

    const loadCtx = document.getElementById('load-chart').getContext('2d');
    const hrvRhrCtx = document.getElementById('hrv-rhr-chart').getContext('2d');
    const { text } = getChartColors();
    const scales = buildScales();

    const atl = model.atlSeries.slice(-60);
    const ctl = model.ctlSeries.slice(-60);
    const labels = atl.map((entry) => entry.date);

    loadChart = new Chart(loadCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: t('metricTitles.atl'),
                    data: atl.map((entry) => entry.value),
                    borderColor: '#f97316',
                    tension: 0.25
                },
                {
                    label: t('metricTitles.ctl'),
                    data: ctl.slice(-labels.length).map((entry) => entry.value),
                    borderColor: '#3b82f6',
                    tension: 0.25
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: text }
                }
            },
            scales
        }
    });

    const hrv = model.hrvSeries.slice(-60);
    const rhr = model.rhrSeries.slice(-60);
    const hrLabels = hrv.map((entry) => entry.date);
    hrvRhrChart = new Chart(hrvRhrCtx, {
        type: 'line',
        data: {
            labels: hrLabels,
            datasets: [
                {
                    label: t('table.hrv'),
                    data: hrv.map((entry) => entry.value),
                    borderColor: '#10b981',
                    tension: 0.25
                },
                {
                    label: t('table.rhr'),
                    data: rhr.slice(-hrLabels.length).map((entry) => entry.value),
                    borderColor: '#ef4444',
                    tension: 0.25
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: text }
                }
            },
            scales
        }
    });
}
