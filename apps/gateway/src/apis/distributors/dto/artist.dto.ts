export class ApplyArtistDto {
  userId: string; // from Auth service
  stageName: string;
  genre?: string;
  bio?: string;
  distributorId?: string;
}

export class DistributionDto {
  name: string;
  email: string;
  password: string;
  website: string;
}

export class LoginDto {
  email: string;
  password: string;
}
export class CodeDto {
  code: number;
}
