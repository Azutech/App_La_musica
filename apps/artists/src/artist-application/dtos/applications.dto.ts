export class ApplyArtistDto {
  userId: string; // from Auth service
  stageName: string;
  genre?: string;
  bio?: string;
}
