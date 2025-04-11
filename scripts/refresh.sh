#!/bin/bash

# Path to the .env file
ENV_FILE="../.env"

# Watch the .env file for changes, e.g., modifications (close_write event)
docker compose down && docker compose up -d

while inotifywait -e close_write "$ENV_FILE"; do
  echo ".env has changed. Updating Docker Compose..."

  # Option 1: Recreate containers to pick up new env values.
  # This stops and removes the containers and then starts them up again.
  docker compose down && docker compose up -d

  # Option 2: You can also try a restart if the containers are set up to pick up new env variables:
  # docker-compose restart

  echo "Docker Compose updated."
done