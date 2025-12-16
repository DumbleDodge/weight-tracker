import React from 'react';

export const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl shadow-xl">
        <p className="text-slate-900 dark:text-white text-sm font-bold flex items-center gap-2">
          <span className="text-slate-500 font-normal capitalize">{label}:</span>
          {payload[0].value} 
          <span className="text-xs text-slate-400 font-medium">{unit}</span>
        </p>
      </div>
    );
  }
  return null;
};