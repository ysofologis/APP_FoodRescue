import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
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
 * etc.) extend `HttpException` and are routed by Nest's default filter.
 * We re-throw those so they don't get reclassified as domain violations.
 */
@Catch()
export class DomainErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof HttpException) {
      // Defer to Nest's built-in HttpException filter for transport-layer
      // errors (404, 400, 401, etc.) so the response shape stays correct.
      throw exception;
    }

    const err = exception as Error;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = err?.message ?? 'Unknown domain error';

    this.logger.error(
      `Domain invariant violation at ${request.method} ${request.url}: ${message}`,
    );

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: 'DomainInvariantViolation',
      message,
      path: request.url,
    });
  }
}