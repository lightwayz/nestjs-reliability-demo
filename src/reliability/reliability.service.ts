/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

type PaymentState = 'succeeded' | 'failed' | 'unknown';

export type PaymentIntent = {
  intentId: string;
  amount: number;
  currency: 'NGN' | 'USD';
  createdAt: string;
  idempotencyKey: string;
  state: PaymentState;
  audit: Array<{ at: string; event: string; meta?: Record<string, any> }>;
};

@Injectable()
export class ReliabilityService {
  private intents = new Map<string, PaymentIntent>();
  private idempotencyIndex = new Map<string, string>();

  health() {
    return {
      ok: true,
      service: 'nestjs-reliability-demo',
      ts: new Date().toISOString(),
    };
  }

  createIntent(input: {
    amount: number;
    currency?: "NGN" | "USD";
    idempotencyKey: string;
  }) {
    // Idempotency: same key returns same intent (prevents double-charging patterns)
    const existingId = this.idempotencyIndex.get(input.idempotencyKey);
    if (existingId) return this.intents.get(existingId)!;

    const intentId = `pi_${Math.random().toString(36).slice(2, 10)}`;
    const now = new Date().toISOString();

    const intent: PaymentIntent = {
      intentId,
      amount: input.amount,
      currency: input.currency ?? "NGN",
      createdAt: now,
      idempotencyKey: input.idempotencyKey,
      state: "unknown", // explicit "unknown" avoids silent success
      audit: [
        { at: now, event: "intent_created", meta: { amount: input.amount } },
      ],
    };

    this.intents.set(intentId, intent);
    this.idempotencyIndex.set(input.idempotencyKey, intentId);

    return intent;
  }

  verifyIntent(input: { intentId: string; reference: string }) {
    const intent = this.intents.get(input.intentId);
    const now = new Date().toISOString();

    if (!intent) {
      return {
        ok: false,
        state: "failed" as const,
        reason: "intent_not_found",
        at: now,
      };
    }

    // Demo logic (IP-safe): never talk to real providers.
    // Make state deterministic-ish from reference length:
    const state: PaymentState =
      input.reference.length % 3 === 0
        ? "succeeded"
        : input.reference.length % 3 === 1
          ? "failed"
          : "unknown";

    intent.state = state;
    intent.audit.push({
      at: now,
      event: "verify_attempt",
      meta: { reference: input.reference, state },
    });

    return {
      ok: state === "succeeded",
      state,
      intentId: intent.intentId,
      at: now,
      note:
        state === "unknown"
          ? "Explicit unknown state (retry later)."
          : undefined,
    };
  }
}
