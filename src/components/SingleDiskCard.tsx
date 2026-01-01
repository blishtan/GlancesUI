import React from 'react';
import { HardDrive } from 'lucide-react';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { DiskStats, DisplayMode, CardSize } from '../types/glances';

interface SingleDiskCardProps {
  disk: DiskStats;
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

export const SingleDiskCard: React.FC<SingleDiskCardProps> = ({
  disk,
  displayMode = 'verbose',
  size = 'small'
}) => {
  if (displayMode === 'minimal') {
    return (
      <StatCard title={`Disk - ${disk.device_name}`} icon={<HardDrive size={24} />} size={size}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {disk.percent.toFixed(1)}%
          </span>
        </div>
        <ProgressBar value={disk.percent} showPercentage={false} />
      </StatCard>
    );
  }

  return (
    <StatCard title="Disk" icon={<HardDrive size={24} />} size={size}>
      <div className="mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">{disk.device_name}</span>
      </div>
      <ProgressBar value={disk.percent} showPercentage={true} />
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Total:</span>
          <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100 block">
            {formatBytes(disk.size)}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Used:</span>
          <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100 block">
            {formatBytes(disk.used)}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Free:</span>
          <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100 block">
            {formatBytes(disk.free)}
          </span>
        </div>
      </div>
    </StatCard>
  );
};
