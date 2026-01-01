import React from 'react';
import { Cpu } from 'lucide-react';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { CPUStats, DisplayMode, CardSize } from '../types/glances';

interface CPUCardProps {
  data: CPUStats | null;
  displayMode?: DisplayMode;
  size?: CardSize;
}

export const CPUCard: React.FC<CPUCardProps> = ({ data, displayMode = 'verbose', size = 'small' }) => {
  if (!data) {
    return (
      <StatCard title="CPU" icon={<Cpu size={24} />} size={size}>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </StatCard>
    );
  }

  if (displayMode === 'minimal') {
    return (
      <StatCard title="CPU" icon={<Cpu size={24} />} size={size}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data.total.toFixed(1)}%
          </span>
        </div>
        <ProgressBar value={data.total} showPercentage={false} />
      </StatCard>
    );
  }

  return (
    <StatCard title="CPU" icon={<Cpu size={24} />} size={size}>
      <div className="space-y-3">
        <ProgressBar value={data.total} label="Total" />
        <ProgressBar value={data.user} label="User" />
        <ProgressBar value={data.system} label="System" />
        {data.iowait !== undefined && (
          <ProgressBar value={data.iowait} label="I/O Wait" />
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Idle:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{data.idle.toFixed(1)}%</span>
        </div>
        {data.cpucore !== undefined && (
          <div>
            <span className="text-gray-600 dark:text-gray-400">Cores:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{data.cpucore}</span>
          </div>
        )}
      </div>
    </StatCard>
  );
};
