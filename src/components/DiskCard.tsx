import React from 'react';
import { HardDrive } from 'lucide-react';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { DiskStats, DisplayMode, CardSize } from '../types/glances';

interface DiskCardProps {
  data: DiskStats[] | null;
  displayMode?: DisplayMode;
  size?: CardSize;
  enabledDisks?: string[];
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const DiskCard: React.FC<DiskCardProps> = ({
  data,
  displayMode = 'verbose',
  size = 'medium',
  enabledDisks = []
}) => {
  if (!data || data.length === 0) {
    return (
      <StatCard title="Disk" icon={<HardDrive size={24} />} size={size}>
        <p className="text-gray-500 dark:text-gray-400">No disk data available</p>
      </StatCard>
    );
  }

  const filteredDisks = enabledDisks.length > 0
    ? data.filter(disk => enabledDisks.includes(disk.mount_point))
    : data;

  if (filteredDisks.length === 0) {
    return (
      <StatCard title="Disk" icon={<HardDrive size={24} />} size={size}>
        <p className="text-gray-500 dark:text-gray-400">No enabled disks</p>
      </StatCard>
    );
  }

  if (displayMode === 'minimal') {
    const avgUsage = filteredDisks.reduce((sum, disk) => sum + disk.percent, 0) / filteredDisks.length;
    return (
      <StatCard title="DISK" icon={<HardDrive size={24} />} size={size}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {avgUsage.toFixed(1)}%
          </span>
        </div>
        <ProgressBar value={avgUsage} showPercentage={false} />
      </StatCard>
    );
  }

  return (
    <StatCard title="Disk" icon={<HardDrive size={24} />} size={size}>
      <div className="space-y-4">
        {filteredDisks.map((disk, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3 last:pb-0">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">{disk.mount_point}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{disk.device_name}</span>
            </div>
            <ProgressBar value={disk.percent} showPercentage={true} />
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">{formatBytes(disk.size)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Used:</span>
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">{formatBytes(disk.used)}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Free:</span>
                <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">{formatBytes(disk.free)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </StatCard>
  );
};
