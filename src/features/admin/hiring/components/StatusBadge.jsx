import React from "react";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      icon: Clock,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Pending",
    },
    accepted: {
      icon: CheckCircle,
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Accepted",
    },
    rejected: {
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Rejected",
    },
    expired: {
      icon: AlertCircle,
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: "Expired",
    },
  };

  const { icon: Icon, bg, text, label } = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export default StatusBadge;
