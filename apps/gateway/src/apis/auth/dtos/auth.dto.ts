export class CreateUserDto {
  email: string;
  password: string;
}
export class LoginDto {
  email: string;
  password: string;
}
export class CodeDto {
  code: number;
}

export class OnboardUserDto {
  readonly firstName: string;
  readonly lastName: string;
  userId: string;
}