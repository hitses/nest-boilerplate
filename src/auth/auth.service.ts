import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthResponseDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async findOrCreateOAuthUser(profile: any): Promise<AuthResponseDto> {
    const { email, firstName, lastName, profilePicture } = profile;
    const providerId = profile.googleId;

    // Check if user exists by email
    let user: Partial<User> | null = await this.userService.findOneByEmail(
      email as string,
    );

    if (!user) {
      const userData: CreateUserDto = {
        email,
        firstName,
        lastName,
        authProvider: AuthProvider.GOOGLE,
        providerId,
        profilePicture,
        lastLoginAt: new Date(),
      };

      user = await this.userService.create(userData);

      if (!user) throw new NotFoundException('User not found');
    }

    const authUser = {
      sub: user._id!.toString(),
      sv: user.sessionVersion!,
      role: user.role!,
    };

    const token = await this.generateJwt(authUser);

    return {
      user: {
        email: user.email!,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      },
      token,
    };
  }

  async getCurrentUser(userId: string): Promise<Partial<User>> {
    const user = await this.userService.findOne(userId);

    if (!user) throw new NotFoundException('User not found');

    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
    };
  }

  async generateJwt(authUser: AuthUserDto): Promise<string> {
    const payload = {
      sub: authUser.sub,
      sv: authUser.sv,
      role: authUser.role,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      secret: process.env.JWT_SECRET,
    });
  }

  async invalidateAllSessions(userId: string): Promise<void> {
    await this.userService.incrementSessionVersion(userId);
  }
}
