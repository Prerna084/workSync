# Base image designed for lightweight footprints
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy dependency files first to utilize Docker's cache layering
COPY package*.json ./

# Install production dependencies only (skipping nodemon and heavy tooling)
RUN npm install --omit=dev

# Copy application source code (node_modules and configs omitted via .dockerignore)
COPY . .

# Expose API traffic port
EXPOSE 5000

# Define start command
CMD ["node", "server.js"]
