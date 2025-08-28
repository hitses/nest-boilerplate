import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  Profile,
  StrategyOptionsWithRequest,
} from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { AuthProvider } from 'src/users/entities/user.entity';

type GoogleUser = {
  provider: AuthProvider;
  googleId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  accessToken: string;
  locale?: string;
  hd?: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);
  private readonly isConfigured: boolean;
  private readonly isProd: boolean;

  constructor(private readonly config: ConfigService) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = config.get<string>('GOOGLE_CALLBACK_URL');
    const scope = ['openid', 'email', 'profile'];

    const options: StrategyOptionsWithRequest = {
      clientID: clientID || 'dummy',
      clientSecret: clientSecret || 'dummy',
      callbackURL,
      scope,
      passReqToCallback: true,
      state: true,
      proxy: true,
      prompt: 'select_account',
    };

    super(options);

    this.isConfigured = Boolean(clientID && clientSecret && callbackURL);
    this.isProd =
      (config.get<string>('NODE_ENV') || '').toLowerCase() === 'production';

    if (!this.isConfigured) {
      if (this.isProd)
        this.logger.error(
          'Google OAuth credentials missing in production; authentication will fail.',
        );
      else
        this.logger.warn(
          'Google OAuth credentials are not configured. Strategy is loaded but will reject requests.',
        );
    } else {
      this.logger.log('Google OAuth strategy configured successfully');
    }
  }

  validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    if (!this.isConfigured)
      return done(new Error('Google OAuth is not configured'), false);

    const email = profile.emails?.[0]?.value;
    const emailVerified =
      (profile as any)?._json?.email_verified === true ||
      (profile as any)?._json?.email_verified === 'true';

    if (!email || !emailVerified)
      return done(
        new Error('Google account email is missing or not verified'),
        false,
      );

    const user: GoogleUser = {
      provider: AuthProvider.GOOGLE,
      googleId: profile.id,
      email,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      profilePicture: profile.photos?.[0]?.value,
      accessToken,
      locale: (profile as any)?._json?.locale,
      hd: (profile as any)?._json?.hd,
    };

    return done(null, user);
  }
}
