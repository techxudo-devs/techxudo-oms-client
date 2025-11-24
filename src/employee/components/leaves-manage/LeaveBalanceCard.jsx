import React from 'react';
import { Calendar, Syringe, Sun } from 'lucide-react';

const LeaveBalanceCard = ({ type, balance, progress, isLoading }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'casual':
        return <Sun className="w-6 h-6 text-blue-500" />;
      case 'sick':
        return <Syringe className="w-6 h-6 text-red-500" />;
      case 'annual':
        return <Calendar className="w-6 h-6 text-green-500" />;
      default:
        return <Sun className="w-6 h-6 text-blue-500" />;
    }
  };

  const getCardStyle = (balance) => {
    if (balance.remaining === 0) {
      return "border-2 border-red-500 bg-red-50";
    }
    return "border border-gray-200 bg-white";
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg shadow-sm ${getCardStyle(balance)} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center space-x-3 mb-4">
        {getIcon(type)}
        <h3 className="font-semibold text-gray-900 capitalize">
          {type} Leave
        </h3>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Available: {balance.remaining} / {balance.total}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              balance.remaining === 0 
                ? 'bg-red-500' 
                : progress > 80 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        Used: {balance.used} days
      </div>
    </div>
  );
};

export default LeaveBalanceCard;