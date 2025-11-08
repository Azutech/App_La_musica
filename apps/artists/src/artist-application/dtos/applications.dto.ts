export class ApplyArtistDto {
  userId: string; // from Auth service
  stageName: string;
  distributorId: string;
  genre?: string;
  bio?: string;
}
