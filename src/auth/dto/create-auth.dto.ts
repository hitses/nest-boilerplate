export class AuthResponseDto {
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
  token: string;
}
