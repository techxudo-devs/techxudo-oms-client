import { useState, useEffect, useRef, useCallback } from "react";
import { useUpdateOrganizationMutation } from "@/shared/store/features/organizationApiSlice";
import { saveToLocalStorage } from "@/utils/setupStorage";

/**
 * Auto-save status types
 */
export const SaveStatus = {
  IDLE: "idle",
  SAVING: "saving",
  SAVED: "saved",
  ERROR: "error",
  OFFLINE: "offline",
};

/**
 * Custom hook for auto-saving setup wizard data
 * Features:
 * - Debounced auto-save on field changes
 * - Immediate localStorage backup
 * - API save with retry logic
 * - Offline detection and fallback
 * - Save status tracking
 *
 * @param {Object} formData - Current form data
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 2000)
 * @returns {Object} Auto-save utilities
 */
export const useAutoSave = (formData, debounceMs = 2000) => {
  const [saveStatus, setSaveStatus] = useState(SaveStatus.IDLE);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [updateOrganization] = useUpdateOrganizationMutation();

  // Refs
  const debounceTimerRef = useRef(null);
  const retryTimerRef = useRef(null);
  const lastSavedDataRef = useRef(null);
  const saveQueueRef = useRef([]);

  /**
   * Track online/offline status
   */
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSaveStatus(SaveStatus.IDLE);
      // Retry pending saves when back online
      processSaveQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSaveStatus(SaveStatus.OFFLINE);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /**
   * Save data to API
   */
  const saveToAPI = useCallback(
    async (data) => {
      try {
        setSaveStatus(SaveStatus.SAVING);

        await updateOrganization(data).unwrap();

        // Success
        lastSavedDataRef.current = data;
        setLastSavedAt(new Date());
        setSaveStatus(SaveStatus.SAVED);
        setRetryCount(0);

        // Clear saved status after 3 seconds
        setTimeout(() => {
          setSaveStatus(SaveStatus.IDLE);
        }, 3000);

        return true;
      } catch (error) {
        console.error("Auto-save to API failed:", error);

        // If offline or network error, add to retry queue
        if (!navigator.onLine || error?.status === 0) {
          setSaveStatus(SaveStatus.OFFLINE);
          addToSaveQueue(data);
        } else {
          setSaveStatus(SaveStatus.ERROR);

          // Retry logic for server errors
          if (retryCount < 3) {
            scheduleRetry(data);
          }
        }

        return false;
      }
    },
    [updateOrganization, retryCount]
  );

  /**
   * Add failed save to retry queue
   */
  const addToSaveQueue = useCallback((data) => {
    if (!saveQueueRef.current.includes(data)) {
      saveQueueRef.current.push(data);
    }
  }, []);

  /**
   * Process pending saves in queue
   */
  const processSaveQueue = useCallback(async () => {
    if (!isOnline || saveQueueRef.current.length === 0) return;

    const queue = [...saveQueueRef.current];
    saveQueueRef.current = [];

    for (const data of queue) {
      const success = await saveToAPI(data);
      if (!success) {
        // If failed, re-add to queue
        addToSaveQueue(data);
        break; // Stop processing queue
      }
    }
  }, [isOnline, saveToAPI, addToSaveQueue]);

  /**
   * Schedule retry after exponential backoff
   */
  const scheduleRetry = useCallback(
    (data) => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }

      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30s

      retryTimerRef.current = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        saveToAPI(data);
      }, delay);
    },
    [retryCount, saveToAPI]
  );

  /**
   * Check if data has changed
   */
  const hasDataChanged = useCallback((newData) => {
    const lastSaved = lastSavedDataRef.current;
    if (!lastSaved) return true;

    return JSON.stringify(newData) !== JSON.stringify(lastSaved);
  }, []);

  /**
   * Auto-save with debounce
   */
  const debouncedSave = useCallback(
    (data) => {
      // Always save to localStorage immediately (no debounce)
      saveToLocalStorage(data);

      // Skip API save if data hasn't changed
      if (!hasDataChanged(data)) {
        return;
      }

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced timer
      debounceTimerRef.current = setTimeout(() => {
        if (isOnline) {
          saveToAPI(data);
        } else {
          setSaveStatus(SaveStatus.OFFLINE);
          addToSaveQueue(data);
        }
      }, debounceMs);
    },
    [debounceMs, isOnline, hasDataChanged, saveToAPI, addToSaveQueue]
  );

  /**
   * Force immediate save (for navigation)
   */
  const forceSave = useCallback(
    async (data) => {
      // Cancel any pending debounced save
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Save to localStorage immediately
      saveToLocalStorage(data);

      // Skip API save if data hasn't changed
      if (!hasDataChanged(data)) {
        return true;
      }

      // Force API save
      if (isOnline) {
        return await saveToAPI(data);
      } else {
        setSaveStatus(SaveStatus.OFFLINE);
        addToSaveQueue(data);
        return false;
      }
    },
    [isOnline, hasDataChanged, saveToAPI, addToSaveQueue]
  );

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      debouncedSave(formData);
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData, debouncedSave]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  return {
    saveStatus,
    lastSavedAt,
    isOnline,
    retryCount,
    forceSave,
    debouncedSave,
  };
};
