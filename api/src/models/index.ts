import { Client, auth, mapping } from 'cassandra-driver';
import { CASSANDRA_CONFIG } from '../config/database';

export const cassandraClient = new Client({
  contactPoints: [CASSANDRA_CONFIG.host],
  localDataCenter: CASSANDRA_CONFIG.datacenter,
  keyspace: CASSANDRA_CONFIG.keyspace,
  authProvider: new auth.PlainTextAuthProvider(CASSANDRA_CONFIG.username, CASSANDRA_CONFIG.password),
});

export const mapper = new mapping.Mapper(cassandraClient);

export const initCassandra = async () => {
  try {
    await cassandraClient.connect();
    console.log('Connected to Cassandra');

    await cassandraClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${CASSANDRA_CONFIG.keyspace}
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 3
      }
    `);
  } catch (error) {
    console.error('Failed to connect to Cassandra:', error);
    throw error;
  }
};

export const closeCassandra = async () => {
  await cassandraClient.shutdown();
};
