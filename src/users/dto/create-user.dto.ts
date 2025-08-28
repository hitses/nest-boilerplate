export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  authProvider: string;
  providerId: string;
  profilePicture: string;
  lastLoginAt: Date;
}
