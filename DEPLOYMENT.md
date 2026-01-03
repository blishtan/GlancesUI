# Deployment Guide

This guide explains how to deploy GlancesUI using Docker images from GitHub Container Registry.

**NEW**: Glances is now included in the docker-compose setup! No need to install or run Glances separately.

## Prerequisites

- Docker and Docker Compose installed
- GitHub account

## Setup Steps

### 1. Push Code to GitHub

First, push your repository to GitHub:

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/glancesui.git
git push -u origin develop
```

### 2. Enable GitHub Container Registry

The GitHub Actions workflow will automatically build and push Docker images when you push to `main` or `develop` branches.

**Make sure the package is public:**
1. Go to your GitHub repository
2. After the first workflow run, go to your profile → Packages
3. Find the `glancesui` package
4. Click on it → Package settings
5. Scroll down and click "Change visibility" → Make it Public (or keep it private if you prefer)

### 3. Deploy with Docker Compose

On your deployment server:

**Step 1: Create a directory for deployment**
```bash
mkdir glancesui-deployment
cd glancesui-deployment
```

**Step 2: Download the docker-compose.yml**
```bash
curl -O https://raw.githubusercontent.com/YOUR-USERNAME/glancesui/develop/docker-compose.yml
```

**Step 3: Create .env file**
```bash
cat > .env << EOF
# Replace with your GitHub username (lowercase)
GITHUB_USERNAME=your-github-username

# UI Port (default: 3000)
UI_PORT=3000

# Optional: Glances port (default: 61208)
GLANCES_PORT=61208
EOF
```

> **Note**: Glances will run automatically in its own container. You don't need to install or configure it separately!

**Step 4: Pull and run**
```bash
docker-compose pull
docker-compose up -d
```

The UI will be available at `http://localhost:3000`

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_USERNAME` | Your GitHub username (lowercase) | Required |
| `GLANCES_PORT` | Port where Glances will be accessible (optional) | `61208` |
| `UI_PORT` | Port where UI will be accessible | `3000` |

### What Gets Deployed

The docker-compose setup includes **two containers**:

1. **glances** - The Glances monitoring system (official image)
   - Runs with host PID namespace for accurate system monitoring
   - Automatically starts in web server mode
   - Monitors Docker containers (if available)

2. **glances-ui** - The beautiful UI (your custom image)
   - Connects to the Glances container automatically
   - Serves the web interface

### Example Configurations

**Standard Setup (Recommended):**
```env
GITHUB_USERNAME=yourname
UI_PORT=3000
```

**Custom Ports:**
```env
GITHUB_USERNAME=yourname
UI_PORT=8080
GLANCES_PORT=61208
```

### Using an External Glances Server

If you already have Glances running elsewhere and don't want the bundled Glances container:

1. Edit `docker-compose.yml` and comment out the `glances` service
2. Update the `glances-ui` environment:
   ```yaml
   environment:
     - GLANCES_HOST=your-external-server
     - GLANCES_PORT=61208
   ```

## Docker Image Tags

The GitHub Actions workflow creates multiple tags:

- `latest` - Latest build from the default branch (main)
- `develop` - Latest build from develop branch
- `main` - Latest build from main branch
- `v1.0.0` - Semantic version tags (if you create git tags)
- `sha-<commit>` - Specific commit builds

To use a specific tag, modify your `.env`:
```env
# Use develop branch
IMAGE_TAG=develop

# Use specific version
IMAGE_TAG=v1.0.0
```

Then update your `docker-compose.yml`:
```yaml
image: ghcr.io/${GITHUB_USERNAME}/glancesui:${IMAGE_TAG:-latest}
```

## Updating

To update to the latest version:

```bash
docker-compose pull
docker-compose up -d
```

## Troubleshooting

### Cannot pull image

If you get authentication errors:
1. Make sure the package is public on GitHub
2. Or login to GitHub Container Registry:
   ```bash
   echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
   ```

### UI shows connection error

1. Check both containers are running:
   ```bash
   docker-compose ps
   ```

2. Check Glances container logs:
   ```bash
   docker-compose logs glances
   ```

3. Check UI container logs:
   ```bash
   docker-compose logs glances-ui
   ```

4. Test Glances API directly:
   ```bash
   curl http://localhost:61208/api/4/all
   ```

5. Verify containers can communicate:
   ```bash
   docker-compose exec glances-ui ping -c 3 glances
   ```

3. Verify environment variables:
   ```bash
   docker-compose config
   ```

### Check container status

```bash
# View logs
docker-compose logs -f glances-ui

# Check running containers
docker-compose ps

# Restart container
docker-compose restart

# Stop and remove
docker-compose down
```

## Advanced: Private Registry

If you want to keep your image private, create a GitHub Personal Access Token:

1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `read:packages` scope
3. Login to registry:
   ```bash
   echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
   ```

## CI/CD Workflow Details

The workflow (`.github/workflows/docker-publish.yml`) automatically:
- Builds on push to `main`, `develop`, or tags
- Supports multi-platform builds (amd64, arm64)
- Uses GitHub Actions cache for faster builds
- Creates multiple tags for easy versioning
- Requires no secrets (uses built-in `GITHUB_TOKEN`)

Trigger manually:
1. Go to your repository on GitHub
2. Actions → Build and Push Docker Image
3. Run workflow → Select branch → Run

## Production Deployment

For production, consider:

1. **Use specific version tags** instead of `latest`
2. **Set up monitoring** for the container
3. **Configure reverse proxy** (nginx/Traefik) for HTTPS
4. **Set resource limits** in docker-compose:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 256M
   ```
5. **Enable automatic updates** with Watchtower or similar tools
