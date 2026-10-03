import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService as NestConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthAccountAggregate } from './domain/aggregates/auth-account.aggregate';
import { AuthAccountRepository } from './domain/repositories/auth-account.repository';
import { AuthAccountRepositoryImpl } from './infrastructure/repositories/auth-account.repository';
import { JwtTokenIssuer } from './infrastructure/token/jwt-token-issuer.adapter';
import { TokenIssuer } from './application/ports/token-issuer.port';
import { LoginCommandHandler } from './application/commands/login.command';
import { AuthController } from './presentation/auth.controller';
import { JwtAuthGuard } from './presentation/jwt-auth.guard';
import { RolesGuard } from './presentation/roles.guard';
import { AuthBootstrap } from './auth.bootstrap';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthAccountAggregate]),
    CqrsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [NestConfigService],
      useFactory: (config: NestConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret-change-me'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: AuthAccountRepository, useClass: AuthAccountRepositoryImpl },
    { provide: TokenIssuer, useClass: JwtTokenIssuer },
    LoginCommandHandler,
    JwtAuthGuard,
    RolesGuard,
    AuthBootstrap,
  ],
  exports: [JwtAuthGuard, RolesGuard, TokenIssuer],
})
export class AuthModule {}