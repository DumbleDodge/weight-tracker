import React from 'react';
import { Card } from '../ui/Card'; // Asumiendo que creaste el componente Card del paso anterior

const StatsSkeleton = () => {
  return (
    <div className="pb-32 pt-16 px-4 animate-in fade-in duration-500">
      {/* Título Skeleton */}
      <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-6 ml-2"></div>

      {/* Tarjetas Skeleton */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-64 flex flex-col justify-center items-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-800 to-transparent animate-pulse opacity-50" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsSkeleton;