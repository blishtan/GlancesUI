import { useState, useEffect } from 'react';
import { Settings, RefreshCw, AlertCircle } from 'lucide-react';
import { useGlancesData } from './hooks/useGlancesData';
import { StatisticConfig, DisplayMode, AppSettings } from './types/glances';
import { SettingsPanel } from './components/SettingsPanel';
import { CPUCard } from './components/CPUCard';
import { MemoryCard } from './components/MemoryCard';
import { SingleDiskCard } from './components/SingleDiskCard';
import { NetworkCard } from './components/NetworkCard';
import { SystemCard } from './components/SystemCard';
import { ProcessCard } from './components/ProcessCard';

const DEFAULT_STATISTICS: StatisticConfig[] = [
  { id: 'system', label: 'System Information', enabled: true, size: 'small' },
  { id: 'cpu', label: 'CPU Usage', enabled: true, size: 'small' },
  { id: 'memory', label: 'Memory Usage', enabled: true, size: 'small' },
  { id: 'network', label: 'Network Activity', enabled: true, size: 'small' },
  { id: 'processes', label: 'Top Processes', enabled: true, size: 'large' },
];

const DEFAULT_SETTINGS: AppSettings = {
  statistics: DEFAULT_STATISTICS,
  displayMode: 'verbose',
  darkMode: false,
  enabledDisks: [],
};

function App() {
  const { data, error, isLoading, refetch } = useGlancesData(2000);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('glances-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure enabledDisks exists
        return {
          ...parsed,
          statistics: parsed.statistics || DEFAULT_STATISTICS,
          enabledDisks: parsed.enabledDisks || [],
        };
      } catch {
        localStorage.removeItem('glances-settings');
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('glances-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const toggleStatistic = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      statistics: prev.statistics.map((stat) =>
        stat.id === id ? { ...stat, enabled: !stat.enabled } : stat
      ),
    }));
  };

  const isEnabled = (id: string) => {
    if (!settings?.statistics || !Array.isArray(settings.statistics)) {
      return false;
    }
    return settings.statistics.find((s) => s.id === id)?.enabled ?? false;
  };

  const getStatSize = (id: string) => {
    if (!settings?.statistics || !Array.isArray(settings.statistics)) {
      return 'small';
    }
    return settings.statistics.find((s) => s.id === id)?.size || 'small';
  };

  const handleDisplayModeChange = (mode: DisplayMode) => {
    setSettings((prev) => ({ ...prev, displayMode: mode }));
  };

  const handleDarkModeToggle = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleDiskToggle = (mountPoint: string) => {
    setSettings((prev) => {
      const enabledDisks = prev.enabledDisks.includes(mountPoint)
        ? prev.enabledDisks.filter((d) => d !== mountPoint)
        : [...prev.enabledDisks, mountPoint];
      return { ...prev, enabledDisks };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Glances UI</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">System Monitoring Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Refresh data"
                title="Refresh data"
              >
                <RefreshCw size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Settings size={20} />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Error Banner */}
        {error && !isLoading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 dark:text-red-300">Connection Error</h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {error}
                </p>
                <div className="mt-3 text-sm text-red-700 dark:text-red-300">
                  <p className="font-medium mb-2">To fix this:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Install Glances: <code className="bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">pip install glances</code></li>
                    <li>Start Glances server: <code className="bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">glances -w</code></li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
                <button
                  onClick={() => refetch()}
                  className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Connection Status Indicator (when error but has cached data) */}
        {error && data && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6 flex items-center gap-3">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Connection lost. Showing last known data. Attempting to reconnect...
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !data && !error && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500 dark:text-blue-400" size={48} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Connecting to Glances
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Loading system statistics...
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto text-left">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Make sure Glances is running with:
                </p>
                <code className="block mt-2 bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded text-sm text-blue-900 dark:text-blue-200">
                  glances -w
                </code>
              </div>
            </div>
          </div>
        )}

        {data && settings && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isEnabled('system') && (
              <SystemCard
                data={data.system || null}
                load={data.load}
                displayMode={settings.displayMode || 'verbose'}
                size={getStatSize('system')}
              />
            )}
            {isEnabled('cpu') && (
              <CPUCard
                data={data.cpu || null}
                displayMode={settings.displayMode || 'verbose'}
                size={getStatSize('cpu')}
              />
            )}
            {isEnabled('memory') && (
              <MemoryCard
                data={data.mem || null}
                displayMode={settings.displayMode || 'verbose'}
                size={getStatSize('memory')}
              />
            )}
            {data.fs && (
              <>
                {data.fs
                  .filter(disk =>
                    settings.enabledDisks.length === 0 ||
                    settings.enabledDisks.includes(disk.device_name)
                  )
                  .map((disk) => (
                    <SingleDiskCard
                      key={disk.device_name}
                      disk={disk}
                      displayMode={settings.displayMode || 'verbose'}
                      size="medium"
                    />
                  ))}
              </>
            )}
            {isEnabled('network') && (
              <NetworkCard
                data={data.network || null}
                displayMode={settings.displayMode || 'verbose'}
                size={getStatSize('network')}
              />
            )}
            {isEnabled('processes') && (
              <ProcessCard
                data={data.processlist || null}
                displayMode={settings.displayMode || 'verbose'}
                size={getStatSize('process')}
              />
            )}
          </div>
        )}
      </main>

      {/* Settings Panel */}
      {settings && (
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          statistics={settings.statistics || DEFAULT_STATISTICS}
          onToggle={toggleStatistic}
          displayMode={settings.displayMode || 'verbose'}
          onDisplayModeChange={handleDisplayModeChange}
          darkMode={settings.darkMode || false}
          onDarkModeToggle={handleDarkModeToggle}
          availableDisks={data?.fs || []}
          enabledDisks={settings.enabledDisks || []}
          onDiskToggle={handleDiskToggle}
        />
      )}
    </div>
  );
}

export default App;
