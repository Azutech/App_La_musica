import { Injectable, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApplyArtistDto } from 'src/apis/artist-application/dtos/applications.dto';
import { ArtistApplicationRepository } from 'src/apis/artist-application/repository/application.repository';

@Injectable()
export class ArtistsService {}
