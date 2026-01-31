import { Controller, Get } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  @Get('health')
  health() {
    return { ok: true, module: 'orders' };
  }
}
