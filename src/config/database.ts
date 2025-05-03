import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

const getConfig = (): DatabaseConfig => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'p2Teach'
});

export const initializeSequelize = (): Sequelize => {
	const config = getConfig();
	return new Sequelize(config.database, config.username, config.password, {
		host: config.host,
		port: config.port,
		dialect: "postgres",
		logging: console.log,
		define: {
			timestamps: true,
			underscored: true,
		},
	});
};
  

export const ensureDatabaseExists = async (): Promise<void> => {
  const config = getConfig();

  
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: 'postgres'
  });

  try {
    await client.connect();
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [config.database]
    );

    if (result.rowCount === 0) {
      console.log(`Creating database: ${config.database}`);
      await client.query(`CREATE DATABASE "${config.database}"`);
      console.log(`Database ${config.database} created successfully`);
    }
  } catch (error) {
    console.error('Database creation error:', error);
    throw error;
  } finally {
    await client.end();
  }
};

// Singleton database instance
let sequelizeInstance: Sequelize;

export const getDatabase = async (): Promise<Sequelize> => {
  if (!sequelizeInstance) {
    await ensureDatabaseExists();
    sequelizeInstance = initializeSequelize();
    
    try {
      await sequelizeInstance.authenticate();
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }
  return sequelizeInstance;
};