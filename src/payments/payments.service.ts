import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  createIntent(orderId?: string) {
    return {
      ok: true,
      orderId: orderId ?? null,
      message: 'Payment intent created (stub)',
    };
  }

  verify(reference?: string) {
    return {
      ok: true,
      reference: reference ?? null,
      message: 'Payment verification (stub)',
    };
  }

  handleWebhook(payload: any) {
    return {
      ok: true,
      received: true,
      message: 'Webhook received (stub)',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload,
    };
  }
}
