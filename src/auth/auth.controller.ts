import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    this.authService.logout(response);
  }
}
