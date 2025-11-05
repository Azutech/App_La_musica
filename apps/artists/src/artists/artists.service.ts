import { Injectable, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApplyArtistDto } from 'src/artist-application/dtos/applications.dto';
import { ArtistApplicationRepository } from 'src/artist-application/repository/application.repository';

@Injectable()
export class ArtistsService {}
