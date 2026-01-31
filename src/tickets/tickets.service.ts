import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketsService {
  ping() {
    return 'tickets service ok';
  }
}
