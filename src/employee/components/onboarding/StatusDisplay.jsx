import React from "react";
import { useNavigate } from "react-router-dom";

export const StatusDisplay = ({
  icon,
  title,
  message,
  showLoginButton = false,
  onAction,
  actionText
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="text-center py-12 w-full">
      <div className="flex justify-center mb-6">
        {icon}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

      <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto">
        {message}
      </p>

      {showLoginButton && (
        <button
          onClick={handleLogin}
          className="px-8 py-3 bg-brand-primary text-white font-semibold rounded-lg
            hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
            transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          Go to Login
        </button>
      )}

      {onAction && actionText && (
        <button
          onClick={onAction}
          className="px-8 py-3 bg-brand-primary text-white font-semibold rounded-lg
            hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
            transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
