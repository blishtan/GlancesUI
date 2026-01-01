import React from 'react';
import { Monitor } from 'lucide-react';
import { StatCard } from './StatCard';
import { SystemStats, DisplayMode, CardSize } from '../types/glances';

interface SystemCardProps {
  data: SystemStats | null;
  load?: { min1: number; min5: number; min15: number } | null;
  displayMode?: DisplayMode;
  size?: CardSize;
}

export const SystemCard: React.FC<SystemCardProps> = ({ data, load, displayMode = 'verbose', size = 'small' }) => {
  if (!data) {
    return (
      <StatCard title="System" icon={<Monitor size={24} />} size={size}>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </StatCard>
    );
  }

  if (displayMode === 'minimal') {
    return (
      <StatCard title="SYS" icon={<Monitor size={24} />} size={size}>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{data.hostname}</div>
          {load && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Load: {load.min1.toFixed(2)}
            </div>
          )}
        </div>
      </StatCard>
    );
  }

  return (
    <StatCard title="System" icon={<Monitor size={24} />} size={size}>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Hostname:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{data.hostname}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">OS:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{data.os_name}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Platform:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{data.platform}</span>
        </div>
        {data.uptime && (
          <div>
            <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{data.uptime}</span>
          </div>
        )}
        {load && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Load Average</div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-gray-600 dark:text-gray-400">1m:</span>
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">{load.min1.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">5m:</span>
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">{load.min5.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">15m:</span>
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">{load.min15.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </StatCard>
  );
};
