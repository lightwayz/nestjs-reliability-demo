import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  ping() {
    return 'events service ok';
  }
}
