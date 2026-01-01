import React from 'react';
import { MemoryStick } from 'lucide-react';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { MemoryStats, DisplayMode, CardSize } from '../types/glances';

interface MemoryCardProps {
  data: MemoryStats | null;
  displayMode?: DisplayMode;
  size?: CardSize;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const MemoryCard: React.FC<MemoryCardProps> = ({ data, displayMode = 'verbose', size = 'small' }) => {
  if (!data) {
    return (
      <StatCard title="Memory" icon={<MemoryStick size={24} />} size={size}>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </StatCard>
    );
  }

  if (displayMode === 'minimal') {
    return (
      <StatCard title="MEM" icon={<MemoryStick size={24} />} size={size}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {data.percent.toFixed(1)}%
          </span>
        </div>
        <ProgressBar value={data.percent} showPercentage={false} />
      </StatCard>
    );
  }

  return (
    <StatCard title="Memory" icon={<MemoryStick size={24} />} size={size}>
      <div className="space-y-3">
        <ProgressBar value={data.percent} label="Usage" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Total:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{formatBytes(data.total)}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Used:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{formatBytes(data.used)}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Free:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{formatBytes(data.free)}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Available:</span>
          <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{formatBytes(data.available)}</span>
        </div>
      </div>
    </StatCard>
  );
};
