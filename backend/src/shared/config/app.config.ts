export interface AppConfig {
  port: number;
  dbPath: string;
  dbSynchronize: boolean;
  dbLogging: boolean;
  nodeEnv: string;
}

export const appConfig = {
  port: parseInt(process.env.PORT, 10) || 3000,
  dbPath: process.env.DB_PATH || './food-rescue.db',
  dbSynchronize: process.env.DB_SYNCHRONIZE !== 'false',
  dbLogging: process.env.DB_LOGGING === 'true',
  nodeEnv: process.env.NODE_ENV || 'development',
};
