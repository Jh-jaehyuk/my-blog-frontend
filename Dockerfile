# Stage 1: Build the Vue.js application
FROM node:20-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: This stage is intentionally left empty.
# The build artifacts from the 'builder' stage will be copied by the Nginx Dockerfile.
# This prevents the final deployment from including the node_modules and other build-time dependencies.
FROM scratch
