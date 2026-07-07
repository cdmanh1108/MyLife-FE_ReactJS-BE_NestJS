import { plainToInstance } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsOptional, IsString, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsOptional()
  @IsIn(['development', 'test', 'production'])
  NODE_ENV?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  PORT?: number;

  @IsOptional()
  @IsString()
  API_PREFIX?: string;

  @IsString()
  MONGODB_URI: string;

  @IsOptional()
  @IsString()
  REDIS_URL?: string;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsOptional()
  @IsString()
  JWT_ACCESS_EXPIRES_IN?: string;

  @IsOptional()
  @IsString()
  JWT_REFRESH_EXPIRES_IN?: string;

  @IsOptional()
  @IsString()
  CORS_ORIGIN?: string;

  @IsOptional()
  @IsString()
  STORAGE_DRIVER?: string;

  @IsOptional()
  @IsString()
  LOCAL_STORAGE_PATH?: string;

  @IsOptional()
  @IsEmail()
  SEED_OWNER_EMAIL?: string;

  @IsOptional()
  @IsString()
  SEED_OWNER_PASSWORD?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
