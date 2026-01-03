# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Set default environment variables
ENV GLANCES_HOST=glances
ENV GLANCES_PORT=61208

# Expose port 80
EXPOSE 80

# nginx:alpine automatically processes templates with envsubst
CMD ["nginx", "-g", "daemon off;"]
