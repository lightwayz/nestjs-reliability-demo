import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  ping() {
    return 'notifications service ok';
  }
}
