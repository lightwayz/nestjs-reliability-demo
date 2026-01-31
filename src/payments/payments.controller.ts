import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intents')
  createIntent(@Body() body: { orderId?: string }) {
    return this.paymentsService.createIntent(body?.orderId);
  }

  @Post('verify')
  verify(@Body() body: { reference?: string }) {
    return this.paymentsService.verify(body?.reference);
  }
}
