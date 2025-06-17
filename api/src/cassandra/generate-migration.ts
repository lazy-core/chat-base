import fs from 'fs';
import path from 'path';

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Please provide a migration name.');
  process.exit(1);
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-:T.]/g, '')
  .slice(0, 14);
const filename = `${timestamp}_${migrationName}.cql`;
const filePath = path.join(__dirname, 'migrations', filename);

const template = `-- Migration: ${migrationName}
-- Created at: ${new Date().toISOString()}

-- Write your CQL statements here
`;

fs.writeFileSync(filePath, template);
