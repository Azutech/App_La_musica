export interface DistributionI {
  name: string;
  email: string;
  password: string;
  website: string;
}

export interface DistributionProfileI {
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
