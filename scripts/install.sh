#!/bin/bash
# 1. CHECK FOR PACKAGE OR PULL
# 2. INSTALL ALL NECESSARY DEPENDENCIES
# 3. BUILD & RUN CONTAINERS
# CREATE JWT TOKEN
# CREATE MONGODB PASSWORD

# 4. CREATE DEFAULT USER IN MONGODB
# 5. ASK FOR USER EMAIL

# Set variables as necessary
MONGO_HOST="localhost"
MONGO_PORT="27017"
DATABASE="chatdb"
SCRIPT="initDefaultUser.js"

# Optionally, if authentication is required, you can include -u and -p flags:
# MONGO_USER="yourUser"
# MONGO_PASS="yourPassword"

echo "Initializing MongoDB database '${DATABASE}'..."

# Run the JavaScript script using mongo shell (or mongosh)
mongo --host $MONGO_HOST --port $MONGO_PORT $DATABASE $SCRIPT

# For MongoDB with authentication, you might do:
# mongo --host $MONGO_HOST --port $MONGO_PORT -u $MONGO_USER -p $MONGO_PASS --authenticationDatabase admin $DATABASE $SCRIPT

echo "Database initialization complete."