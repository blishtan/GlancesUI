# Glances UI

A beautiful, modern web interface for monitoring system statistics using [Glances](https://github.com/nicolargo/glances).

![Glances UI](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## Features

- **Real-time Monitoring** - Updates every 2 seconds with live system statistics
- **Customizable Dashboard** - Show/hide statistics via the settings panel
- **Dark Mode** - Toggle between light and dark themes
- **Display Modes** - Switch between MINIMAL (compact cards with key metrics) and VERBOSE (detailed information)
- **Flexible Card Sizes** - Cards automatically adjust to small, medium, or large layouts
- **Disk Filtering** - Select which disks to display in the settings
- **Opaque Cards** - Modern frosted glass effect with backdrop blur
- **Beautiful UI** - Modern, responsive design with Tailwind CSS
- **Comprehensive Stats** - Monitor CPU, Memory, Disk, Network, Processes, and more
- **Persistent Settings** - All preferences saved to localStorage
- **Easy Setup** - Simple configuration and installation

## Statistics Available

- System Information (hostname, OS, platform, uptime, load average)
- CPU Usage (total, user, system, I/O wait)
- Memory Usage (total, used, free, available)
- Disk Usage (multiple partitions supported)
- Network Activity (RX/TX for all interfaces)
- Top Processes (sorted by CPU usage)

## Prerequisites

1. **Glances** must be installed and running in API mode
2. **Node.js** 18+ and npm/yarn/pnpm

## Installation

### 1. Install and Start Glances

```bash
# Install Glances (if not already installed)
pip install glances

# Start Glances in web server mode
glances -w
```

By default, Glances runs on `http://localhost:61208`. The API is available at `http://localhost:61208/api/4`.

### 2. Install and Run Glances UI

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Configuration

### Glances API Endpoint

By default, the UI expects Glances to run on `localhost:61208`. If your Glances instance runs on a different host/port, update the proxy configuration in [vite.config.ts](vite.config.ts):

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-glances-host:port',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api/4')
    }
  }
}
```

### Customizing Display Settings

Click the "Settings" button in the top-right corner to access the settings panel where you can:

- **Switch Display Mode**: Toggle between MINIMAL and VERBOSE modes
  - **MINIMAL**: Compact cards showing only essential metrics (percentage + progress bar)
  - **VERBOSE**: Detailed cards with comprehensive information
- **Toggle Dark Mode**: Switch between light and dark themes
- **Select Statistics**: Choose which statistics to display on the dashboard
- **Filter Disks**: Select specific disks to monitor (leave all unchecked to show all)

All settings are automatically saved to browser localStorage and persist across sessions.

## Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The build output will be in the `dist` directory.

## Development

```bash
# Run development server with hot reload
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/          # React components
│   ├── CPUCard.tsx
│   ├── MemoryCard.tsx
│   ├── DiskCard.tsx
│   ├── NetworkCard.tsx
│   ├── ProcessCard.tsx
│   ├── SystemCard.tsx
│   ├── SettingsPanel.tsx
│   ├── StatCard.tsx
│   ├── ProgressBar.tsx
│   └── ErrorBoundary.tsx
├── hooks/              # Custom React hooks
│   └── useGlancesData.ts
├── services/           # API services
│   └── glancesApi.ts
├── types/              # TypeScript type definitions
│   └── glances.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Error Handling

The application includes comprehensive error handling:

- **Connection Errors**: Clear error messages with troubleshooting steps
- **Timeout Protection**: 10-second timeout for API requests
- **Retry Functionality**: Manual retry button when connection fails
- **Cached Data**: Shows last known data during temporary connection loss
- **Error Boundary**: Catches React errors to prevent white screen crashes
- **Detailed Logging**: Console errors for debugging

## Troubleshooting

### Connection Error

If you see a connection error:

1. **Install Glances** (if not already installed):
   ```bash
   pip install glances
   ```

2. **Start Glances server**:
   ```bash
   glances -w
   ```

3. **Verify Glances is running**:
   - Open `http://localhost:61208` in your browser
   - You should see the Glances web interface
   - API should be accessible at `http://localhost:61208/api/4/all`

4. **Check the application**:
   - Refresh the Glances UI page
   - Click "Retry Connection" button if error persists

### White Screen / Application Crash

If you see a white screen or the app crashes:

1. Open browser DevTools (F12) and check the Console tab
2. Look for error messages in red
3. Try clearing browser cache and localStorage
4. The app includes an Error Boundary that should show error details
5. If the error boundary appears, try clicking "Reload Application"

### No Data Showing

1. Check that Glances API is responding:
   ```bash
   curl http://localhost:61208/api/4/all
   ```

2. Verify proxy configuration in [vite.config.ts](vite.config.ts) matches your Glances URL

3. Open browser DevTools Network tab to see API requests

4. Check that statistics are enabled in the Settings panel

### Performance Issues

1. Increase refresh interval (modify `refreshInterval` in [App.tsx](src/App.tsx))
2. Disable unused statistics in Settings
3. Use MINIMAL display mode for better performance
4. Check Glances server performance with `glances -t`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
