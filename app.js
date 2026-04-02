import { normalizeCustomData, normalizeGithubData } from './normalize.js';
import { calculateMetrics } from './metrics.js';
import { renderDashboard, renderCockpit, setupMetricHelpModal, setupCollapsibleSections } from './render.js';
import { setupCockpitModal } from './cockpit.js';
import { renderCharts, refreshChartsTheme } from './charts.js';
import {
    clearStoredCustomJson,
    parseJsonText,
    readFileAsText,
    readStoredCustomJson,
    saveCustomJson
} from './customDataSource.js';

const LATEST_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/latest.json';
const HISTORY_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/history.json';
const THEME_STORAGE_KEY = 'training-dashboard-theme';

function getStoredTheme() {
    try {
        const v = localStorage.getItem(THEME_STORAGE_KEY);
        return v === 'dark' ? 'dark' : 'light';
    } catch {
        return 'light';
    }
}

function applyTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
        /* ignore quota / private mode */
    }
    refreshChartsTheme();
}

function initTheme() {
    applyTheme(getStoredTheme());
}

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
    renderCockpit(model, metrics);
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

function setupHeaderMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const dropdown = document.getElementById('header-dropdown');
    const wrap = document.querySelector('.header-menu-wrap');
    const pastePanel = document.getElementById('paste-panel');

    function setMenuOpen(open) {
        if (open) {
            dropdown.classList.remove('hidden');
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            dropdown.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const opening = dropdown.classList.contains('hidden');
        setMenuOpen(opening);
    });

    document.addEventListener('click', (e) => {
        if (wrap && !wrap.contains(e.target)) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setMenuOpen(false);
        }
    });

    document.getElementById('menu-upload-json').addEventListener('click', () => {
        setMenuOpen(false);
        document.getElementById('json-file-input').click();
    });

    document.getElementById('menu-paste-json').addEventListener('click', () => {
        setMenuOpen(false);
        pastePanel.classList.toggle('hidden');
        if (!pastePanel.classList.contains('hidden')) {
            document.getElementById('json-paste-input').focus();
        }
    });

    const pastePanelClose = document.getElementById('paste-panel-close');
    if (pastePanelClose) {
        pastePanelClose.addEventListener('click', () => {
            pastePanel.classList.add('hidden');
        });
    }

    document.getElementById('menu-clear-custom').addEventListener('click', async () => {
        setMenuOpen(false);
        clearStoredCustomJson();
        await loadFromGithub();
    });

    document.getElementById('menu-load-github').addEventListener('click', async () => {
        setMenuOpen(false);
        clearStoredCustomJson();
        await loadFromGithub();
    });

    document.getElementById('menu-toggle-theme').addEventListener('click', () => {
        setMenuOpen(false);
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    document.getElementById('menu-open-cockpit')?.addEventListener('click', () => {
        setMenuOpen(false);
        document.getElementById('cockpit-modal')?.classList.remove('hidden');
        document.body.classList.add('cockpit-modal-open');
        document.getElementById('cockpit-close')?.focus();
    });
}

function setupEvents() {
    setupHeaderMenu();

    document.getElementById('json-file-input').addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
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
}

async function initialize() {
    try {
        initTheme();
        setupMetricHelpModal();
        setupCockpitModal();
        setupCollapsibleSections();
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
