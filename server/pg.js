import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.POSTGRESQL_CONNECTION_STRING;

const db = new Pool({
  connectionString: connectionString,
});

export { db };
