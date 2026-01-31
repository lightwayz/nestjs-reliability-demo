import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class WebhooksController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  webhook(@Body() payload: any) {
    // signature verification will be added later
    return this.paymentsService.handleWebhook(payload);
  }
}
