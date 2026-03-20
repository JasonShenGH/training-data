import * as utils from './utils.js';

let fitnessChart = null;
let tssChart = null;
let activityPieChart = null;
let sleepChart = null;
let rhrChart = null;
let tidChart = null;

export function initializeFitnessChart(dailyData, days = 90) {
    const ctx = document.getElementById('fitness-chart').getContext('2d');
    
    const data = dailyData.slice(-days);
    const dates = data.map(d => d.date);
    const ctl = data.map(d => d.ctl);
    const atl = data.map(d => d.atl);
    const tsb = data.map(d => d.tsb);

    if (fitnessChart) {
        fitnessChart.destroy();
    }

    fitnessChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'CTL (Fitness)',
                    data: ctl,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                },
                {
                    label: 'ATL (Fatigue)',
                    data: atl,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#f97316',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                },
                {
                    label: 'TSB (Form)',
                    data: tsb,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    segment: {
                        borderColor: ctx => {
                            const value = ctx.p1.parsed.y;
                            return value < -30 ? '#ef4444' : value < -10 ? '#eab308' : '#10b981';
                        }
                    }
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        title: (items) => utils.formatDate(items[0].label),
                        label: (context) => {
                            const label = context.dataset.label;
                            const value = context.parsed.y.toFixed(1);
                            if (label === 'TSB (Form)') {
                                return `${label}: ${value} (${utils.getTSBLabel(parseFloat(value))})`;
                            }
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: days > 60 ? 'week' : 'day',
                        displayFormats: {
                            day: 'MMM d',
                            week: 'MMM d'
                        }
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

export function updateFitnessChart(dailyData, days) {
    initializeFitnessChart(dailyData, days);
}

export function initializeTSSChart(last7Days) {
    const ctx = document.getElementById('tss-chart').getContext('2d');
    
    const dates = last7Days.map(d => utils.formatDate(d.date).split(',')[0]);
    const tss = last7Days.map(d => d.total_tss);
    const types = last7Days.map(d => d.activity_types);
    
    const colors = last7Days.map(d => {
        if (d.activity_types === 'Rest') return '#d1d5db';
        const mainType = d.activity_types.split(',')[0].trim();
        return utils.getActivityTypeColor(mainType);
    });

    if (tssChart) {
        tssChart.destroy();
    }

    tssChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'TSS',
                data: tss,
                backgroundColor: colors,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: (context) => {
                            const index = context.dataIndex;
                            return [
                                `TSS: ${context.parsed.y}`,
                                `Type: ${types[index]}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

export function initializeActivityPieChart(byActivityType) {
    const ctx = document.getElementById('activity-pie-chart').getContext('2d');
    
    const types = Object.keys(byActivityType);
    const counts = types.map(type => byActivityType[type].count);
    const colors = types.map(type => utils.getActivityTypeColor(type));
    const labels = types.map(type => utils.getActivityTypeLabel(type));

    if (activityPieChart) {
        activityPieChart.destroy();
    }

    activityPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: (context) => {
                            const type = types[context.dataIndex];
                            const data = byActivityType[type];
                            return [
                                `${context.label}: ${context.parsed} activities`,
                                `Duration: ${utils.formatDuration(data.duration_decimal_hours)}`,
                                `TSS: ${data.tss}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

export function initializeSleepChart(wellnessData) {
    const ctx = document.getElementById('sleep-chart').getContext('2d');
    
    const dates = wellnessData.map(d => utils.formatDate(d.date).split(',')[0]);
    const sleepHours = wellnessData.map(d => d.sleep_hours);
    
    const colors = sleepHours.map(hours => {
        if (!hours) return '#d1d5db';
        if (hours >= 7.5) return '#10b981';
        if (hours >= 6.5) return '#eab308';
        return '#ef4444';
    });

    if (sleepChart) {
        sleepChart.destroy();
    }

    sleepChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Sleep Hours',
                data: sleepHours,
                backgroundColor: colors,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Sleep Duration',
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: (context) => {
                            const hours = context.parsed.y;
                            if (!hours) return 'No data';
                            const status = hours >= 7.5 ? 'Good' : hours >= 6.5 ? 'Fair' : 'Poor';
                            return `${hours.toFixed(1)} hours (${status})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 10,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        stepSize: 2,
                        callback: (value) => `${value}h`
                    }
                }
            }
        }
    });
}

export function initializeRHRChart(wellnessData, baseline) {
    const ctx = document.getElementById('rhr-chart').getContext('2d');
    
    const dates = wellnessData.map(d => utils.formatDate(d.date).split(',')[0]);
    const rhr = wellnessData.map(d => d.resting_hr);
    const baselineData = wellnessData.map(() => baseline);

    if (rhrChart) {
        rhrChart.destroy();
    }

    rhrChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Resting HR',
                    data: rhr,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ef4444'
                },
                {
                    label: '7d Baseline',
                    data: baselineData,
                    borderColor: '#94a3b8',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                            size: 11
                        },
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'Resting Heart Rate',
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: (context) => {
                            if (context.datasetIndex === 0) {
                                const value = context.parsed.y;
                                if (!value) return 'No data';
                                const delta = baseline ? (value - baseline).toFixed(1) : null;
                                return delta ? `RHR: ${value} bpm (${delta > 0 ? '+' : ''}${delta})` : `RHR: ${value} bpm`;
                            }
                            return `Baseline: ${context.parsed.y.toFixed(1)} bpm`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: (value) => `${value} bpm`
                    }
                }
            }
        }
    });
}

export function initializeTIDChart(derivedMetrics) {
    const ctx = document.getElementById('tid-chart').getContext('2d');
    
    const tid7d = derivedMetrics.seiler_tid_7d;
    const tid28d = derivedMetrics.seiler_tid_28d;

    document.getElementById('tid-7d-class').textContent = tid7d.classification;
    document.getElementById('tid-28d-class').textContent = tid28d.classification;

    const z1_7d_pct = tid7d.z1_pct;
    const z2_7d_pct = tid7d.z2_pct;
    const z3_7d_pct = tid7d.z3_pct;

    const z1_28d_pct = tid28d.z1_pct;
    const z2_28d_pct = tid28d.z2_pct;
    const z3_28d_pct = tid28d.z3_pct;

    if (tidChart) {
        tidChart.destroy();
    }

    tidChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['7 Days', '28 Days'],
            datasets: [
                {
                    label: 'Zone 1 (Low Intensity)',
                    data: [z1_7d_pct, z1_28d_pct],
                    backgroundColor: '#22c55e',
                    borderRadius: 6
                },
                {
                    label: 'Zone 2 (Moderate)',
                    data: [z2_7d_pct, z2_28d_pct],
                    backgroundColor: '#eab308',
                    borderRadius: 6
                },
                {
                    label: 'Zone 3 (High Intensity)',
                    data: [z3_7d_pct, z3_28d_pct],
                    backgroundColor: '#ef4444',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        },
                        usePointStyle: true,
                        pointStyle: 'rectRounded'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed.y;
                            const period = context.label;
                            const zone = context.dataset.label;
                            
                            let seconds;
                            if (period === '7 Days') {
                                if (zone.includes('Zone 1')) seconds = tid7d.z1_seconds;
                                else if (zone.includes('Zone 2')) seconds = tid7d.z2_seconds;
                                else seconds = tid7d.z3_seconds;
                            } else {
                                if (zone.includes('Zone 1')) seconds = tid28d.z1_seconds;
                                else if (zone.includes('Zone 2')) seconds = tid28d.z2_seconds;
                                else seconds = tid28d.z3_seconds;
                            }
                            
                            return `${zone}: ${value.toFixed(1)}% (${utils.secondsToFormatted(seconds)})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: (value) => `${value}%`
                    }
                }
            }
        }
    });
}
