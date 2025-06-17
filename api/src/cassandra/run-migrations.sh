#!/bin/bash
set -e

KEYSPACE_NAME=$1
CASSANDRA_HOST=${2:-"127.0.0.1"}

if [ -z "$KEYSPACE_NAME" ]; then
  echo "Usage: ./run-migrations.sh <keyspace_name> [cassandra_host]"
  exit 1
fi

echo "📦 Running Cassandra migrations on keyspace: $KEYSPACE_NAME at host: $CASSANDRA_HOST"

echo "➡️ Keyspace name is: [$KEYSPACE_NAME]"


cqlsh "$CASSANDRA_HOST" <<EOF
CREATE KEYSPACE IF NOT EXISTS $KEYSPACE_NAME
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
EOF


# Ensure migration history table exists
cqlsh "$CASSANDRA_HOST" -k "$KEYSPACE_NAME" -e "CREATE TABLE IF NOT EXISTS migration_history (filename text PRIMARY KEY, applied_at timestamp);"


# Get already applied filenames
APPLIED_FILES=$(cqlsh "$CASSANDRA_HOST" -k "$KEYSPACE_NAME" -e "SELECT filename FROM migration_history;" | tail -n +4 | sed '$d' | sed '$d' | awk '{print $1}')

applied=()
while IFS= read -r line; do
  applied+=("$line")
done <<< "$APPLIED_FILES"


# Function to check if file was already applied
was_applied() {
  local target="$1"
  for f in "${applied[@]}"; do
    if [[ "$f" == "$target" ]]; then
      return 0
    fi
  done
  return 1
}

for file in $(ls src/cassandra/migrations/*.cql | sort); do
  filename=$(basename "$file")

  if was_applied "$filename"; then
    echo "⏩ Skipping already applied migration: $filename"
    continue
  fi

  echo "🚀 Applying migration: $filename"
  cqlsh "$CASSANDRA_HOST" -k "$KEYSPACE_NAME" -f "$file"

  echo "Recording migration: $filename"
  cqlsh "$CASSANDRA_HOST" -k "$KEYSPACE_NAME" -e "INSERT INTO migration_history (filename, applied_at) VALUES ('$filename', toTimestamp(now()));"

done

echo "All migrations applied!"
