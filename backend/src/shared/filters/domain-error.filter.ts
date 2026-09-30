import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * Maps uncaught domain `Error` instances to 422 Unprocessable Entity.
 * Handlers throw plain `Error` on invariant violations (e.g. "listing
 * is not AVAILABLE", "dispute is not OPEN"). Without this filter those
 * would surface as 500s, leaking internal reasoning to the client.
 *
 * Already-typed Nest exceptions (`BadRequestException`, `NotFoundException`,
 * etc.) are routed by Nest's default filter and never reach this code.
 */
@Catch(Error)
export class DomainErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainErrorFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(
      `Domain invariant violation at ${request.method} ${request.url}: ${exception.message}`,
    );

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: 'DomainInvariantViolation',
      message: exception.message,
      path: request.url,
    });
  }
}