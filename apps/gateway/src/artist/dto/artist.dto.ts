export class ApplyArtistDto {
  userId: string; // from Auth service
  stageName: string;
  genre?: string;
  bio?: string;
}

export class DistributionDto {
  name: string;
  email: string;
  password: string;
  website: string;
}

