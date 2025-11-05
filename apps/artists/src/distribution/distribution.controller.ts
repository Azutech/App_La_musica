import { Controller } from '@nestjs/common';
import { DistributionService } from './distribution.service';

@Controller('distribution')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}
}
