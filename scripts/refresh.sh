#!/bin/bash

# Path to the .env file
WORK_DIR=$(pwd)
ENV_FILE="${WORK_DIR}/../.env"

# Function to update HOST_IP in the .env file
update_env_ip() {
  # Retrieve the current public IP (using ifconfig.me, change service if necessary)
  SERVER_IP=$(curl -4 -s ifconfig.me)
  echo "Detected public IP: $SERVER_IP"

  # Check if HOST_IP already exists in the .env file
  if grep -q "^HOST_IP=" "$ENV_FILE"; then
    # Update the existing value
    sed -i "s/^HOST_IP=.*/HOST_IP=${SERVER_IP}/" "$ENV_FILE"
  else
    # Append the key if it doesn't exist
    echo "HOST_IP=${SERVER_IP}" >> "$ENV_FILE"
  fi
}

# First, update the .env file with the current dynamic IP
update_env_ip

# Watch the .env file for changes, e.g., modifications (close_write event)
docker compose down && docker compose up -d

while inotifywait -e close_write "$ENV_FILE"; do
  echo ".env has changed. Restarting Docker Compose..."
  docker compose down && docker compose up -d
  echo "Docker Compose updated."
done