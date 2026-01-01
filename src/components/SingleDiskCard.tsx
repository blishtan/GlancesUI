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

const getDiskType = (disk: DiskStats): string => {
  const deviceName = (disk.device_name || '').toLowerCase();
  const mountPoint = (disk.mount_point || '').toLowerCase();
  const fsType = (disk.fs_type || '').toLowerCase();

  // Image/Loop devices
  if (deviceName.includes('loop') || fsType === 'squashfs' || fsType === 'iso9660') {
    return 'Image';
  }

  // Network/Remote filesystems
  if (fsType.includes('nfs') || fsType.includes('smb') || fsType.includes('cifs') ||
      deviceName.startsWith('//') || deviceName.includes(':')) {
    return 'Network';
  }

  // Virtual/Temporary filesystems
  if (fsType === 'tmpfs' || fsType === 'devtmpfs' || mountPoint.includes('/snap/')) {
    return 'Virtual';
  }

  // External USB/Removable drives
  if (mountPoint.includes('/media/') || mountPoint.includes('/mnt/') ||
      mountPoint.includes('removable') || deviceName.includes('usb')) {
    return 'External';
  }

  // Internal drives (default)
  if (deviceName.startsWith('/dev/sd') || deviceName.startsWith('/dev/nvme') ||
      deviceName.startsWith('/dev/hd') || deviceName.startsWith('disk')) {
    return 'Internal';
  }

  return 'Other';
};

export const SingleDiskCard: React.FC<SingleDiskCardProps> = ({
  disk,
  displayMode = 'verbose',
  size = 'small'
}) => {
  const diskType = getDiskType(disk);

  if (displayMode === 'minimal') {
    return (
      <StatCard title={`Disk - ${disk.device_name}`} icon={<HardDrive size={24} />} size={size}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {disk.percent.toFixed(1)}%
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium">
            {diskType}
          </span>
        </div>
        <ProgressBar value={disk.percent} showPercentage={false} />
      </StatCard>
    );
  }

  return (
    <StatCard title="Disk" icon={<HardDrive size={24} />} size={size}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">{disk.device_name}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium">
          {diskType}
        </span>
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
