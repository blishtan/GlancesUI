import React from 'react';
import { Activity } from 'lucide-react';
import { StatCard } from './StatCard';
import { ProcessStats, DisplayMode, CardSize } from '../types/glances';

interface ProcessCardProps {
  data: ProcessStats[] | null;
  displayMode?: DisplayMode;
  size?: CardSize;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({ data, displayMode = 'verbose', size = 'large' }) => {
  if (!data || data.length === 0) {
    return (
      <StatCard title="Top Processes" icon={<Activity size={24} />} size={size}>
        <p className="text-gray-500 dark:text-gray-400">No process data available</p>
      </StatCard>
    );
  }

  const topProcesses = data
    .sort((a, b) => b.cpu_percent - a.cpu_percent)
    .slice(0, displayMode === 'minimal' ? 5 : 10);

  if (displayMode === 'minimal') {
    return (
      <StatCard title="PROC" icon={<Activity size={24} />} size={size}>
        <div className="space-y-1">
          {topProcesses.map((process) => (
            <div key={process.pid} className="flex justify-between items-center text-sm">
              <span className="truncate flex-1 text-gray-900 dark:text-gray-100">{process.name}</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 ml-2">{process.cpu_percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </StatCard>
    );
  }

  return (
    <StatCard title="Top Processes" icon={<Activity size={24} />} size={size}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 text-gray-600 dark:text-gray-400 font-medium">PID</th>
              <th className="text-left py-2 text-gray-600 dark:text-gray-400 font-medium">Name</th>
              <th className="text-right py-2 text-gray-600 dark:text-gray-400 font-medium">CPU%</th>
              <th className="text-right py-2 text-gray-600 dark:text-gray-400 font-medium">MEM%</th>
            </tr>
          </thead>
          <tbody>
            {topProcesses.map((process) => (
              <tr key={process.pid} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <td className="py-2 text-gray-700 dark:text-gray-300">{process.pid}</td>
                <td className="py-2 text-gray-700 dark:text-gray-300 truncate max-w-xs" title={process.name}>
                  {process.name}
                </td>
                <td className="py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
                  {process.cpu_percent.toFixed(1)}%
                </td>
                <td className="py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
                  {process.memory_percent.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StatCard>
  );
};
