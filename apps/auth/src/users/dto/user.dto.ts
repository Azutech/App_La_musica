export class CreateUserDto {
  email: string;
  password: string;
}
export class LoginDto {
  email: string;
  password: string;
}
export class TokenDto {
  userId: string;
  email: string;
  code: number;
  expiresAt: Date;
}

export class CodeDto {
  code: number;
}
