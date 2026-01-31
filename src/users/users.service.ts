import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  ping() {
    return 'users service ok';
  }
}
