/* eslint-disable @typescript-eslint/require-await */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/decorators/roles.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
};

@Injectable()
export class AuthService {
  // In-memory demo store (swap with DB later)
  private readonly users = new Map<string, UserRecord>(); // key: email

  constructor(private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    if (this.users.has(email)) throw new ConflictException('Email already used');

    const role: Role = dto.role ?? 'user';
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user: UserRecord = {
      id: `usr_${Math.random().toString(36).slice(2, 10)}`,
      email,
      passwordHash,
      role,
    };

    this.users.set(email, user);

    const token = await this.sign(user);

    return {
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = this.users.get(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = await this.sign(user);

    return {
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
      accessToken: token,
    };
  }

  async me(user: { userId: string; email: string; role: Role }) {
    return { ok: true, user };
  }

  private async sign(user: UserRecord) {
    return this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
