import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../application/commands/login.command';
import { LoginDto, LoginResponseDto } from '../application/dto/login.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
@Controller('auth')
export class AuthController {
  constructor(private readonly commands: CommandBus) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.commands.execute<LoginCommand, LoginResponseDto>(
      new LoginCommand(dto.email, dto.password),
    );
  }
}