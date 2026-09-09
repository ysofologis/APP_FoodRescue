import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@typeorm/sqlite';

import { DonorModule } from './donor/donor.module';
import { RecipientModule } from './recipient/recipient.module';
import { LogisticsModule } from './logistics/logistics.module';
import { TrustModule } from './trust/trust.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_PATH', './food-rescue.db'),
        autoLoadEntities: true,
        synchronize: config.get<boolean>('DB_SYNCHRONIZE', true),
        logging: config.get<boolean>('DB_LOGGING', false),
      }),
    }),
    DonorModule,
    RecipientModule,
    LogisticsModule,
    TrustModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
