export enum Status {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export enum BusinessType {
  LABEL = 'label',
  AGGREGATOR = 'aggregator',
  PUBLISHER = 'publisher',
  INDIE = 'indie',
  MANAGEMENT = 'management',
  DISTRIBUTION_COMPANY = 'distribution_company',
  SERVICE_PROVIDER = 'service_provider',
  OTHER = 'other',
}

export enum IdType {
  PASSPORT = 'international_passport',
  NATIONAL_ID = 'national_Id',
  DRIVER_LICENSE = 'driver_license',
  OTHER = 'other',
}

export enum DocumentType {
  INCORPORATION_CERTIFICATE = 'incorporation_certificate',
  PROOF_OF_ADDRESS = 'proof_of_address',
  TAX_DOCUMENT = 'tax_document',
  ID_DOCUMENT = 'id_document',
}

export enum MimeType {
  PDF = 'application/pdf',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
}

export enum DocumentStatus {
  VERIFIED = 'verified',
  PENDING = 'pending',
  REJECTED = 'rejected',
}
