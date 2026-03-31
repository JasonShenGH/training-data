const STORAGE_KEY = 'trainingDashboardCustomJsonV1';

export function readStoredCustomJson() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return parseJsonText(raw);
}

export function saveCustomJson(rawText) {
    localStorage.setItem(STORAGE_KEY, rawText);
}

export function clearStoredCustomJson() {
    localStorage.removeItem(STORAGE_KEY);
}

export function parseJsonText(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) {
        throw new Error('JSON text is empty.');
    }
    let parsed;
    try {
        parsed = JSON.parse(trimmed);
    } catch (error) {
        throw new Error(`Invalid JSON: ${error.message}`);
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('JSON root must be an object.');
    }
    return parsed;
}

export function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read the selected file.'));
        reader.readAsText(file);
    });
}
