export const CASSANDRA_CONFIG = {
  host: process.env.CASSANDRA_HOST || '127.0.0.1',
  port: parseInt(process.env.CASSANDRA_PORT || '9042'),
  keyspace: process.env.CASSANDRA_KEYSPACE || 'lazychat-dev',
  datacenter: process.env.CASSANDRA_DATACENTER || 'datacenter1',
  username: process.env.CASSANDRA_USERNAME || 'cassandra',
  password: process.env.CASSANDRA_PASSWORD || 'cassandra',
};
