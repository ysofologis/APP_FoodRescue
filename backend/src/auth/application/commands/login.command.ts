import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthAccountRepository } from '../../domain/repositories/auth-account.repository';
import { TokenIssuer } from '../../application/ports/token-issuer.port';

export class LoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

@Injectable()
@CommandHandler(LoginCommand)
export class LoginCommandHandler
  implements ICommandHandler<LoginCommand, {
    accessToken: string;
    role: string;
    linkedId: string;
  }>
{
  constructor(
    private readonly accounts: AuthAccountRepository,
    private readonly tokens: TokenIssuer,
  ) {}

  async execute(command: LoginCommand) {
    const account = await this.accounts.findByEmail(command.email);
    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await account.verifyPassword(command.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.tokens.sign({
      sub: account.id,
      role: account.role,
      linkedId: account.linkedId,
      email: account.email,
    });
    return {
      accessToken,
      role: account.role,
      linkedId: account.linkedId,
    };
  }
}