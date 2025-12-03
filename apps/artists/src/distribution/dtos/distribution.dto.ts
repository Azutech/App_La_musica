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

export class DistributionProfileDto {
  distributorId: string;
  legalName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  country: string;
  state: string;
  address: string;
  website: string;
  city: string;
  verificationScore: number;
}

export class DistributionUboDto {
  distributorId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  idType: string;
  idNumber: string;
  idDocumentUrl: string;
  ownershipPercentage: number;
}
