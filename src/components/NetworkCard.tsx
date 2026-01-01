import React from 'react';
import { Network } from 'lucide-react';
import { StatCard } from './StatCard';
import { NetworkStats, DisplayMode, CardSize } from '../types/glances';

interface NetworkCardProps {
  data: NetworkStats[] | null;
  displayMode?: DisplayMode;
  size?: CardSize;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const NetworkCard: React.FC<NetworkCardProps> = ({ data, displayMode = 'verbose', size = 'small' }) => {
  if (!data || data.length === 0) {
    return (
      <StatCard title="Network" icon={<Network size={24} />} size={size}>
        <p className="text-gray-500 dark:text-gray-400">No network data available</p>
      </StatCard>
    );
  }

  if (displayMode === 'minimal') {
    const totalRx = data.reduce((sum, iface) => sum + iface.rx, 0);
    const totalTx = data.reduce((sum, iface) => sum + iface.tx, 0);
    return (
      <StatCard title="NET" icon={<Network size={24} />} size={size}>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-center">
            <div className="text-green-600 dark:text-green-400">↓</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{formatBytes(totalRx)}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 dark:text-blue-400">↑</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{formatBytes(totalTx)}</div>
          </div>
        </div>
      </StatCard>
    );
  }

  return (
    <StatCard title="Network" icon={<Network size={24} />} size={size}>
      <div className="space-y-3">
        {data.map((iface, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3 last:pb-0">
            <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">{iface.interface_name}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <span className="text-green-600 dark:text-green-400">↓</span>
                <span className="ml-1 text-gray-600 dark:text-gray-400">RX:</span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{formatBytes(iface.rx)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 dark:text-blue-400">↑</span>
                <span className="ml-1 text-gray-600 dark:text-gray-400">TX:</span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">{formatBytes(iface.tx)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </StatCard>
  );
};
