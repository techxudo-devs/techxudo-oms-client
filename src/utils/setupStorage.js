/**
 * Local Storage utility for Setup Wizard offline backup
 * Provides safe localStorage operations with error handling
 */

const STORAGE_KEY = "setup_wizard_draft";
const STORAGE_VERSION = 1;

/**
 * Save setup wizard data to localStorage
 * @param {Object} data - Setup form data
 * @returns {boolean} Success status
 */
export const saveToLocalStorage = (data) => {
  try {
    const payload = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      data,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    return false;
  }
};

/**
 * Load setup wizard data from localStorage
 * @returns {Object|null} Saved data or null
 */
export const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const payload = JSON.parse(stored);

    // Check version compatibility
    if (payload.version !== STORAGE_VERSION) {
      console.warn("localStorage version mismatch, clearing old data");
      clearLocalStorage();
      return null;
    }

    // Check if data is stale (older than 7 days)
    const timestamp = new Date(payload.timestamp);
    const daysSinceUpdate = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate > 7) {
      console.warn("localStorage data is stale, clearing");
      clearLocalStorage();
      return null;
    }

    return payload.data;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
};

/**
 * Clear setup wizard data from localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};

/**
 * Check if localStorage has saved data
 * @returns {boolean}
 */
export const hasLocalStorageData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return !!stored;
  } catch (error) {
    return false;
  }
};
