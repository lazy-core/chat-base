# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /server
# Copy package and tsconfig files and install dependencies
COPY package*.json tsconfig.json ./
RUN npm install
# Copy the rest of your source code
COPY . .
# Build the project (ensure your tsconfig.json is set with an outDir of "dist")
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /server
COPY package*.json ./
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
  then export $(cat .env | xargs) && npm install; \
  else npm install --only=production; \
  fi
# Copy the compiled output from the builder stage
COPY --from=builder /server/dist ./dist
# Expose port 5000
EXPOSE 5001
# Run the compiled server entry point (adjusted from index.js to run.js)
CMD ["node", "./dist/index.js"]