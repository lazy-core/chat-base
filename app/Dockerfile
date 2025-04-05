# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
# Copy rest of the application code
COPY . .
# Build the Vite app (adjust this script if your build command is different)
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
  then export $(cat .env | xargs) && npm install; \
  else npm install --only=production; \
  fi
# Only copy the built files (adjust if you need additional assets)
COPY --from=builder /app/dist ./dist
# Expose the port that Vite preview will run on
EXPOSE 4173
# Run the Vite preview server, binding to all interfaces
CMD ["npx", "vite", "preview", "--port", "4173", "--host"]