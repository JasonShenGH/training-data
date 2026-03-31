import { normalizeCustomData, normalizeGithubData } from './normalize.js';
import { calculateMetrics } from './metrics.js';
import { renderDashboard } from './render.js';
import { renderCharts } from './charts.js';
import {
    clearStoredCustomJson,
    parseJsonText,
    readFileAsText,
    readStoredCustomJson,
    saveCustomJson
} from './customDataSource.js';

const LATEST_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/latest.json';
const HISTORY_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/history.json';

function showError(message) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('error-message').textContent = message;
}

function showDashboard() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
}

async function fetchGithubData() {
    const [latestRes, historyRes] = await Promise.all([fetch(LATEST_URL), fetch(HISTORY_URL)]);
    if (!latestRes.ok || !historyRes.ok) {
        throw new Error('Failed to fetch GitHub JSON files.');
    }
    const [latest, history] = await Promise.all([latestRes.json(), historyRes.json()]);
    return normalizeGithubData(latest, history);
}

function renderFromModel(model) {
    const metrics = calculateMetrics(model);
    renderDashboard(model, metrics);
    renderCharts(model);
    showDashboard();
}

async function loadFromGithub() {
    document.getElementById('loading').classList.remove('hidden');
    const model = await fetchGithubData();
    renderFromModel(model);
}

function loadFromCustomObject(customObject, rawTextToStore = null) {
    const model = normalizeCustomData(customObject);
    if (rawTextToStore) {
        saveCustomJson(rawTextToStore);
    } else {
        saveCustomJson(JSON.stringify(customObject));
    }
    renderFromModel(model);
}

function setupEvents() {
    document.getElementById('load-github-btn').addEventListener('click', async () => {
        clearStoredCustomJson();
        await loadFromGithub();
    });

    document.getElementById('json-file-input').addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const text = await readFileAsText(file);
        const json = parseJsonText(text);
        loadFromCustomObject(json, text);
    });

    document.getElementById('load-paste-btn').addEventListener('click', () => {
        const text = document.getElementById('json-paste-input').value;
        const json = parseJsonText(text);
        loadFromCustomObject(json, text);
    });

    document.getElementById('clear-paste-btn').addEventListener('click', () => {
        document.getElementById('json-paste-input').value = '';
    });

    document.getElementById('clear-custom-btn').addEventListener('click', async () => {
        clearStoredCustomJson();
        await loadFromGithub();
    });
}

async function initialize() {
    try {
        setupEvents();
        const stored = readStoredCustomJson();
        if (stored) {
            loadFromCustomObject(stored);
            return;
        }
        await loadFromGithub();
    } catch (error) {
        showError(`Failed to initialize dashboard: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', initialize);
