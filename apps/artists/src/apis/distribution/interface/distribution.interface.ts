export interface DistributionI {
  email: string;
  password: string;
  avatar: string;
}

export interface DistributionDocumentI {
  distributorId: string;
  docType: string;
  docUrl: string;
  docHash: string;
  mimeType: string;
  size: number;
  status: string;
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
export interface DistributionUboI {
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
