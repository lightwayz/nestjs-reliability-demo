import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  ping() {
    return 'orders service ok';
  }
}
