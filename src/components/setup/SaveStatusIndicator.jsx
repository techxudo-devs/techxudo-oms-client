import React from "react";
import { Cloud, CloudOff, Check, AlertCircle, Loader2 } from "lucide-react";
import { SaveStatus } from "@/hooks/useAutoSave";

/**
 * SaveStatusIndicator Component
 * Displays the current auto-save status with visual feedback
 *
 * @param {Object} props
 * @param {string} props.status - Current save status
 * @param {Date|null} props.lastSavedAt - Timestamp of last successful save
 * @param {boolean} props.isOnline - Network connectivity status
 */
const SaveStatusIndicator = ({ status, lastSavedAt, isOnline }) => {
  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSavedAt) return null;

    const now = new Date();
    const diffMs = now - new Date(lastSavedAt);
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 60) {
      return "Saved just now";
    } else if (diffMins === 1) {
      return "Saved 1 minute ago";
    } else if (diffMins < 60) {
      return `Saved ${diffMins} minutes ago`;
    } else {
      return `Saved at ${lastSavedAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  // Render based on status
  const renderStatus = () => {
    switch (status) {
      case SaveStatus.SAVING:
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Saving...</span>
          </div>
        );

      case SaveStatus.SAVED:
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">{getLastSavedText()}</span>
          </div>
        );

      case SaveStatus.ERROR:
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Save failed - Retrying...</span>
          </div>
        );

      case SaveStatus.OFFLINE:
        return (
          <div className="flex items-center gap-2 text-orange-600">
            <CloudOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline - Will sync when online</span>
          </div>
        );

      case SaveStatus.IDLE:
      default:
        return isOnline ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Cloud className="w-4 h-4" />
            <span className="text-sm font-medium">
              {lastSavedAt ? getLastSavedText() : "Auto-save enabled"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-orange-600">
            <CloudOff className="w-4 h-4" />
            <span className="text-sm font-medium">Offline mode</span>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center py-2 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {renderStatus()}
    </div>
  );
};

export default SaveStatusIndicator;
