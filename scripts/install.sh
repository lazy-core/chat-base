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