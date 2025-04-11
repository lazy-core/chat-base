#!/bin/bash
# 1. CHECK FOR PACKAGE OR PULL
# 2. INSTALL ALL NECESSARY DEPENDENCIES
# 3. BUILD & RUN CONTAINERS
# CREATE JWT TOKEN
# CREATE MONGODB PASSWORD

# 4. CREATE DEFAULT USER IN MONGODB
# 5. ASK FOR USER EMAIL

# SERVER_URL="http://localhost:5000/user/create-root"
# JSON_DATA='{"email": "penkra.emmanuel@gmail.com"}'

# echo "Sending POST request to ${SERVER_URL}..."
# echo "Payload: ${JSON_DATA}"

# response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST -H "Content-Type: application/json" \
#   -d "${JSON_DATA}" "${SERVER_URL}")

# echo "Response received:"
# echo "${response}"

###

### CREATE SERVICE TO WATCH .ENV

#!/bin/bash

# Variables to customize
WORK_DIR=$(pwd)
SERVICE_NAME="chat-base.service"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}"

# Stop the service if it is running.
if systemctl is-active --quiet "${SERVICE_NAME}"; then
  echo "Stopping ${SERVICE_NAME}..."
  sudo systemctl stop "${SERVICE_NAME}"
fi

# Disable the service if it is enabled.
if systemctl is-enabled --quiet "${SERVICE_NAME}"; then
  echo "Disabling ${SERVICE_NAME}..."
  sudo systemctl disable "${SERVICE_NAME}"
fi

# Remove the service file if it exists.
if [ -f "${SERVICE_FILE}" ]; then
  echo "Removing ${SERVICE_FILE}..."
  sudo rm -f "${SERVICE_FILE}"
fi

# Reload systemd so it forgets about the removed service.
echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

# Optionally, reset failed state if needed.
sudo systemctl reset-failed

echo "The ${SERVICE_NAME} has been completely removed."

SCRIPT_PATH="${WORK_DIR}/refresh.sh"

# Reload systemd daemon so systemd forgets the old service.
sudo systemctl daemon-reload

# Create the systemd service file using a here-document.
echo "Creating systemd service file..."
sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Watch .env and Update Docker Compose on Changes
After=network.target

[Service]
Type=simple
ExecStart=${SCRIPT_PATH}
WorkingDirectory=${WORK_DIR}
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "Service file created at ${SERVICE_FILE}"

# Reload systemd to pick up the new service file.
echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

# Start the service.
echo "Starting the service..."
sudo systemctl start chat-base.service

# Enable the service to start at boot.
echo "Enabling the service to run on boot..."
sudo systemctl enable chat-base.service

echo "The chat-base service has been successfully installed and started."