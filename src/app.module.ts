import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './config/env.validation';
import { AppController } from './app.controller';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';

// If you already have this module in your repo, keep it.
// If not, remove it from imports.
import { ReliabilityModule } from './reliability/reliability.module';

@Module({
  imports: [
    // Loads .env into process.env and validates required keys

    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,

      validate: validateEnv,
      expandVariables: true,
    }),

    // Core identity and access
    AuthModule,
    UsersModule,

    // Domain modules
    EventsModule,
    TicketsModule,
    OrdersModule,

    // Integrations
    PaymentsModule,
    NotificationsModule,

    // Ops / SRE style module (health checks etc.)
    ReliabilityModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
