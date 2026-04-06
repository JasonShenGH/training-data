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
import {
    applyDocumentLocale,
    applyStaticTranslations,
    getLocale,
    setLocale,
    toggleLocale,
    t
} from './i18n.js';

const LATEST_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/latest.json';
const HISTORY_URL = 'https://raw.githubusercontent.com/JasonShenGH/training-data/main/history.json';
const THEME_STORAGE_KEY = 'training-dashboard-theme';
let currentModel = null;

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
        throw new Error(t('errors.fetchFailed'));
    }
    const [latest, history] = await Promise.all([latestRes.json(), historyRes.json()]);
    return normalizeGithubData(latest, history);
}

function renderFromModel(model) {
    currentModel = model;
    const metrics = calculateMetrics(model);
    renderDashboard(model, metrics);
    renderCockpit(model, metrics);
    renderCharts(model);
    showDashboard();
}

async function loadFromGithub() {
    try {
        document.getElementById('loading').classList.remove('hidden');
        const model = await fetchGithubData();
        renderFromModel(model);
    } catch (error) {
        showError(error?.message || t('errors.fetchFailed'));
    }
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
    const languageToggle = document.getElementById('language-toggle');
    const languageToggleLabel = document.getElementById('locale-toggle-label');
    const dropdown = document.getElementById('header-dropdown');
    const wrap = document.querySelector('.header-menu-wrap');
    const pastePanel = document.getElementById('paste-panel');

    function refreshLocaleToggleUi(locale = getLocale()) {
        if (!languageToggle) return;
        const nextLabel = locale === 'en' ? t('menu.languageToggleToChinese') : t('menu.languageToggleToEnglish');
        languageToggle.setAttribute('aria-label', nextLabel);
        languageToggle.title = nextLabel;
        if (languageToggleLabel) {
            languageToggleLabel.textContent = nextLabel;
        }
    }

    function setMenuOpen(open) {
        if (open) {
            dropdown.classList.remove('hidden');
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            dropdown.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    if (menuToggle) {
        menuToggle.setAttribute('aria-label', t('menu.open'));
        menuToggle.title = t('menu.open');
    }
    refreshLocaleToggleUi();

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const opening = dropdown.classList.contains('hidden');
        setMenuOpen(opening);
    });

    languageToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        const next = toggleLocale(getLocale());
        setLocale(next);
        applyStaticTranslations(document);
        refreshLocaleToggleUi(next);
        menuToggle?.setAttribute('aria-label', t('menu.open'));
        menuToggle?.setAttribute('title', t('menu.open'));
        if (currentModel) {
            renderFromModel(currentModel);
        }
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
        setLocale(getLocale());
        applyDocumentLocale(getLocale());
        applyStaticTranslations(document);
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
        showError(t('errors.initFailed', { message: error.message }));
    }
}

document.addEventListener('DOMContentLoaded', initialize);
