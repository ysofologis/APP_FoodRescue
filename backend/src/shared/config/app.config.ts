export interface AppConfig {
  port: number;
  dbPath: string;
  dbSynchronize: boolean;
  dbLogging: boolean;
  nodeEnv: string;
}

function envString(key: string, fallback: string): string {
  const value = process.env[key];
  return value !== undefined && value !== '' ? value : fallback;
}

function envInt(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function envBool(key: string, fallback: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value === 'true';
}

export const appConfig: AppConfig = {
  port: envInt('PORT', 3000),
  dbPath: envString('DB_PATH', './food-rescue.db'),
  dbSynchronize: envBool('DB_SYNCHRONIZE', true),
  dbLogging: envBool('DB_LOGGING', false),
  nodeEnv: envString('NODE_ENV', 'development'),
};