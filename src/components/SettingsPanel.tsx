import React from 'react';
import { Settings, X, Moon, Sun } from 'lucide-react';
import { StatisticConfig, DisplayMode, DiskStats } from '../types/glances';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: StatisticConfig[];
  onToggle: (id: string) => void;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  availableDisks: DiskStats[];
  enabledDisks: string[];
  onDiskToggle: (mountPoint: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  statistics,
  onToggle,
  displayMode,
  onDisplayModeChange,
  darkMode,
  onDarkModeToggle,
  availableDisks,
  enabledDisks,
  onDiskToggle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={24} className="text-blue-500 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Display Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Close settings"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Display Mode Toggle */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Display Mode</h3>
            <div className="flex gap-3">
              <button
                onClick={() => onDisplayModeChange('minimal')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  displayMode === 'minimal'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                MINIMAL
              </button>
              <button
                onClick={() => onDisplayModeChange('verbose')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  displayMode === 'verbose'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                VERBOSE
              </button>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Theme</h3>
            <label className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-yellow-500" />}
                <span className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={onDarkModeToggle}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Statistics Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Visible Statistics</h3>
            <div className="space-y-2">
              {statistics.map((stat) => (
                <label
                  key={stat.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={stat.enabled}
                    onChange={() => onToggle(stat.id)}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{stat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Disk Usage Section */}
          {availableDisks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Disk Usage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Select which disks to display (leave all unchecked to show all)
              </p>
              <div className="space-y-2">
                {availableDisks.map((disk) => (
                  <label
                    key={disk.device_name}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={enabledDisks.includes(disk.device_name)}
                      onChange={() => {
                        console.log('Available disks:', availableDisks, 'Enabled disks:', enabledDisks, 'Current device name:', disk.device_name);
                        onDiskToggle(disk.device_name);
                      }}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-700 dark:text-gray-300">{disk.device_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{disk.mount_point}</div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {disk.percent.toFixed(1)}% used
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
