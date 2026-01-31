import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import * as rolesDecorator from '../../common/decorators/roles.decorator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  // Optional for demo (you can lock this down later)
  @IsOptional()
  role?: rolesDecorator.Role;
}
