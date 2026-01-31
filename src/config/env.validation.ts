import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  validateSync,
} from 'class-validator';

enum NodeEnv {
  development = 'development',
  test = 'test',
  production = 'production',
}

class EnvironmentVariables {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV?: NodeEnv = NodeEnv.development;

  @IsInt()
  @Min(1)
  @IsOptional()
  PORT?: number = 3000;

  @IsString()
  @IsOptional()
  JWT_SECRET?: string = 'dev_secret_change_me';

  // Payment provider keys (optional for now; you can enforce later)
  @IsString()
  @IsOptional()
  PAYSTACK_SECRET_KEY?: string;

  @IsString()
  @IsOptional()
  PAYSTACK_PUBLIC_KEY?: string;

  @IsString()
  @IsOptional()
  PAYSTACK_WEBHOOK_SECRET?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    // Show the first error clearly
    const first = errors[0];
    throw new Error(
      `Environment validation error: ${first.property} is invalid`,
    );
  }

  return validatedConfig;
}
