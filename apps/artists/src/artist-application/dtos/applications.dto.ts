export class ApplyArtistDto {
  userId: string; // from Auth service
  stageName: string;
  distributionId: string;
  genre?: string;
  bio?: string;
}
