# Docker Guide for CivicTrack Frontend

This guide explains how to build and run the CivicTrack frontend using Docker.

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- Docker Compose 2.0+

## Quick Start

### Production Build

```bash
# Build the image
docker build -t civictrack-frontend .

# Run the container
docker run -d \
  -p 3000:80 \
  -e VITE_API_BASE_URL=http://localhost:8080 \
  --name civictrack-frontend \
  civictrack-frontend
```

### Development Build

```bash
# Build the dev image
docker build -f Dockerfile.dev -t civictrack-frontend-dev .

# Run the dev container
docker run -d \
  -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e VITE_API_BASE_URL=http://localhost:8080 \
  --name civictrack-frontend-dev \
  civictrack-frontend-dev
```

## Using Docker Compose

### Development

```bash
# Start development server
docker-compose up frontend-dev

# Or in detached mode
docker-compose up -d frontend-dev
```

Access the app at: http://localhost:5173

### Production

```bash
# Build and start production server
docker-compose up -d frontend

# Or use production-specific compose file
docker-compose -f docker-compose.prod.yml up -d
```

Access the app at: http://localhost:3000

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=CivicTrack
NODE_ENV=production
```

## Docker Commands

### Build

```bash
# Production build
docker build -t civictrack-frontend .

# Development build
docker build -f Dockerfile.dev -t civictrack-frontend-dev .
```

### Run

```bash
# Production
docker run -p 3000:80 civictrack-frontend

# Development (with hot reload)
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules civictrack-frontend-dev
```

### Stop and Remove

```bash
# Stop container
docker stop civictrack-frontend

# Remove container
docker rm civictrack-frontend

# Stop and remove in one command
docker-compose down
```

### View Logs

```bash
# View logs
docker logs civictrack-frontend

# Follow logs
docker logs -f civictrack-frontend

# Using docker-compose
docker-compose logs -f frontend
```

### Execute Commands in Container

```bash
# Open shell in running container
docker exec -it civictrack-frontend sh

# Run npm command
docker exec -it civictrack-frontend-dev npm run lint
```

## Multi-Stage Build

The production Dockerfile uses a multi-stage build:

1. **Builder stage**: Installs dependencies and builds the app
2. **Production stage**: Uses lightweight Nginx to serve static files

This results in a smaller final image (~25MB vs ~200MB+).

## Nginx Configuration

The `nginx.conf` file includes:

- Gzip compression for better performance
- Security headers (CSP, X-Frame-Options, etc.)
- Static asset caching
- SPA routing support
- API proxy (optional)
- Health check endpoint

## Production Deployment

### With Environment Variables

```bash
docker run -d \
  -p 80:80 \
  -e VITE_API_BASE_URL=https://api.yourdomain.com \
  --name civictrack-frontend \
  civictrack-frontend
```

### With Docker Compose

```bash
# Set environment variables
export VITE_API_BASE_URL=https://api.yourdomain.com

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

### Behind a Reverse Proxy (Traefik/Nginx)

The production compose file includes Traefik labels. Adjust the `docker-compose.prod.yml` file with your domain:

```yaml
labels:
  - "traefik.http.routers.frontend.rule=Host(`yourdomain.com`)"
```

## Health Checks

The container includes a health check endpoint:

```bash
# Check health
curl http://localhost:3000/health
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Use different port
docker run -p 8080:80 civictrack-frontend
```

### Permission Issues (Linux)

```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and log back in
```

### Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t civictrack-frontend .
```

### Container Won't Start

```bash
# Check logs
docker logs civictrack-frontend

# Check container status
docker ps -a
```

## Development Workflow

1. Make code changes
2. Changes are automatically reloaded (dev mode)
3. Test locally
4. Build production image: `docker build -t civictrack-frontend .`
5. Test production build: `docker run -p 3000:80 civictrack-frontend`

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t civictrack-frontend .
      - name: Run tests
        run: docker run civictrack-frontend npm test
```

## Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use multi-stage builds** - Reduces image size
3. **Set health checks** - Monitor container health
4. **Use specific tags** - Avoid `latest` tag in production
5. **Scan images** - Use `docker scan` to check for vulnerabilities
6. **Keep base images updated** - Regularly update `node:20-alpine`

## Image Sizes

- **Production**: ~25-30MB (multi-stage build with Nginx)
- **Development**: ~200MB+ (includes Node.js and dev dependencies)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/)

