export interface CPUStats {
  total: number;
  user: number;
  system: number;
  idle: number;
  nice?: number;
  iowait?: number;
  irq?: number;
  softirq?: number;
  steal?: number;
  guest?: number;
  cpucore?: number;
}

export interface MemoryStats {
  total: number;
  used: number;
  free: number;
  available: number;
  percent: number;
  cached?: number;
  buffers?: number;
}

export interface SwapStats {
  total: number;
  used: number;
  free: number;
  percent: number;
}

export interface DiskStats {
  device_name: string;
  mount_point: string;
  fs_type: string;
  size: number;
  used: number;
  free: number;
  percent: number;
  options: string;
}

export interface NetworkStats {
  interface_name: string;
  rx: number;
  tx: number;
  speed?: number;
  time_since_update: number;
  cumulative_rx?: number;
  cumulative_tx?: number;
}

export interface ProcessStats {
  pid: number;
  name: string;
  username: string;
  cpu_percent: number;
  memory_percent: number;
  status: string;
  cmdline?: string;
}

export interface SensorStats {
  label: string;
  value: number;
  warning?: number;
  critical?: number;
  unit?: string;
}

export interface SystemStats {
  hostname: string;
  os_name: string;
  platform: string;
  uptime?: string;
}

export interface GlancesData {
  cpu?: CPUStats;
  mem?: MemoryStats;
  memswap?: SwapStats;
  fs?: DiskStats[];
  network?: NetworkStats[];
  processlist?: ProcessStats[];
  sensors?: SensorStats[];
  system?: SystemStats;
  load?: {
    min1: number;
    min5: number;
    min15: number;
  };
}

export type StatisticType =
  | 'cpu'
  | 'memory'
  | 'swap'
  | 'disk'
  | 'network'
  | 'processes'
  | 'sensors'
  | 'system'
  | 'load';

export type CardSize = 'small' | 'medium' | 'large';
export type DisplayMode = 'minimal' | 'verbose';

export interface StatisticConfig {
  id: StatisticType;
  label: string;
  enabled: boolean;
  size?: CardSize;
}

export interface AppSettings {
  statistics: StatisticConfig[];
  displayMode: DisplayMode;
  darkMode: boolean;
  enabledDisks: string[];
}
