import React from 'react';
import { CardSize } from '../types/glances';

interface StatCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: CardSize;
}

const sizeClasses = {
  small: 'col-span-1',
  medium: 'col-span-1 md:col-span-2',
  large: 'col-span-1 md:col-span-2 lg:col-span-3',
};

export const StatCard: React.FC<StatCardProps> = ({ title, children, icon, size = 'small' }) => {
  return (
    <div className={`${sizeClasses[size]} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        {icon && <div className="text-blue-500 dark:text-blue-400">{icon}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};
