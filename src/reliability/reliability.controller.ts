/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ReliabilityService } from "./reliability.service";

@Controller() // root + health + payments endpoints
export class ReliabilityController {
  constructor(private readonly svc: ReliabilityService) {}

  @Get()
  root() {
    return {
      ok: true,
      service: "nestjs-reliability-demo",
      docs: "/docs",
      health: "/health",
    };
  }

  @Get("health")
  health() {
    return this.svc.health(); // keep your service-driven health
  }

  @Post("payments/intents")
  @HttpCode(HttpStatus.CREATED)
  createIntent(
    @Headers("idempotency-key") idempotencyKey: string | undefined,
    @Body() body: { amount: number; currency?: "NGN" | "USD" },
  ) {
    if (!idempotencyKey?.trim()) {
      return {
        ok: false,
        error: "missing_idempotency_key",
        hint: "Send header: idempotency-key: <unique-value>",
      };
    }

    if (!body?.amount || body.amount <= 0) {
      return { ok: false, error: "invalid_amount" };
    }

    const intent = this.svc.createIntent({
      amount: body.amount,
      currency: body.currency,
      idempotencyKey: idempotencyKey.trim(),
    });

    return { ok: true, intent };
  }

  @Post("payments/verify")
  @HttpCode(HttpStatus.OK)
  verify(@Body() body: { intentId: string; reference: string }) {
    if (!body?.intentId?.trim() || !body?.reference?.trim()) {
      return { ok: false, error: "missing_intentId_or_reference" };
    }

    return this.svc.verifyIntent({
      intentId: body.intentId.trim(),
      reference: body.reference.trim(),
    });
  }
}
