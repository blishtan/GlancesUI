import { GlancesData } from '../types/glances';

class GlancesAPI {
  private baseUrl: string;
  private version: string;

  constructor(baseUrl: string = '/api', version: string = '4') {
    this.baseUrl = baseUrl;
    this.version = version;
  }

  private async fetchData<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Glances API endpoint not found: ${endpoint}`);
        } else if (response.status === 500) {
          throw new Error('Glances server error. Please check your Glances installation.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. Check Glances authentication settings.');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format. Expected JSON from Glances API.');
      }

      const data = await response.json();
      console.log('Response received:', data);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Connection timeout. Glances server is not responding.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot reach Glances server. Is it running on localhost:61208?');
        }
      }
      throw error;
    }
  }

  async getAllStats(): Promise<GlancesData> {
    return this.fetchData<GlancesData>('all');
  }

  async getCPU() {
    return this.fetchData('cpu');
  }

  async getMemory() {
    return this.fetchData('mem');
  }

  async getSwap() {
    return this.fetchData('memswap');
  }

  async getDisks() {
    return this.fetchData('fs');
  }

  async getNetwork() {
    return this.fetchData('network');
  }

  async getProcesses() {
    return this.fetchData('processlist');
  }

  async getSensors() {
    return this.fetchData('sensors');
  }

  async getSystem() {
    return this.fetchData('system');
  }

  async getLoad() {
    return this.fetchData('load');
  }
}

export const glancesApi = new GlancesAPI();
