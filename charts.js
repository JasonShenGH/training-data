let loadChart = null;
let hrvRhrChart = null;

function destroyCharts() {
    if (loadChart) loadChart.destroy();
    if (hrvRhrChart) hrvRhrChart.destroy();
}

export function renderCharts(model) {
    destroyCharts();

    const loadCtx = document.getElementById('load-chart').getContext('2d');
    const hrvRhrCtx = document.getElementById('hrv-rhr-chart').getContext('2d');

    const atl = model.atlSeries.slice(-60);
    const ctl = model.ctlSeries.slice(-60);
    const labels = atl.map((entry) => entry.date);

    loadChart = new Chart(loadCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'ATL',
                    data: atl.map((entry) => entry.value),
                    borderColor: '#f97316',
                    tension: 0.25
                },
                {
                    label: 'CTL',
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
                legend: { position: 'bottom' }
            },
            scales: {
                x: { type: 'time', time: { unit: 'day' } }
            }
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
                    label: 'HRV',
                    data: hrv.map((entry) => entry.value),
                    borderColor: '#10b981',
                    tension: 0.25
                },
                {
                    label: 'RHR',
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
                legend: { position: 'bottom' }
            },
            scales: {
                x: { type: 'time', time: { unit: 'day' } }
            }
        }
    });
}
