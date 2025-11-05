import { Injectable } from '@nestjs/common';
import { DistributionRepository } from './repository/distribution.repository';

@Injectable()
export class DistributionService {
    constructor(private distributionRepository: DistributionRepository) { }
}
