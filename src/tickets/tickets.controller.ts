import { Controller, Get } from '@nestjs/common';

@Controller('tickets')
export class TicketsController {
  @Get('health')
  health() {
    return { ok: true, module: 'tickets' };
  }
}
