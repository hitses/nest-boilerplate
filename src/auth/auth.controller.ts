import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import type { Request } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request & { user: User }) {
    const user = req.user;

    const result = await this.authService.findOrCreateOAuthUser(user);

    return {
      success: true,
      message: 'Google authentication successful',
      data: result,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@CurrentUser() user: AuthUserDto) {
    const currentUser = await this.authService.getCurrentUser(user.sub);
    return { user: currentUser };
  }

  @Post('renew')
  @UseGuards(AuthGuard('jwt'))
  async renew(@CurrentUser() user: AuthUserDto) {
    const token = await this.authService.generateJwt(user);
    const currentUser = await this.authService.getCurrentUser(user.sub);

    return {
      user: currentUser,
      token,
    };
  }

  @Post('logout-all')
  @UseGuards(AuthGuard('jwt'))
  async logoutAll(@CurrentUser() user: AuthUserDto) {
    await this.authService.invalidateAllSessions(user.sub);

    return { success: true, message: 'All sessions have been invalidated.' };
  }
}
