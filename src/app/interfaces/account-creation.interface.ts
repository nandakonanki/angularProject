export interface ContactData {
  emailAddress1: string;
  mobileNumber: string;
  phoneNumber: string;
}

export interface LegalName {
  firstName: string;
  lastName: string;
  middleName?: string;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  buildingName: string;
  buildingNumber: string;
  countryCode: string;
  countrySubDivision: string;
  districtName?: string;
  floor?: string;
  postCode: string;
  room?: string;
  streetName: string;
  townLocationName?: string;
  townName: string;
}

export interface IndividualDetails {
  alternativeId: string | null;
  contactData: ContactData;
  countriesOfCitizenship: string[];
  dob: string;
  legalName: LegalName;
  parentClientId: string;
  preferredName: string;
  primaryAddress: Address;
}

export interface KycDocumentDetails {
  govtIssueAuth: string;
  govtIssueCountry: string;
  govtIssueIdNum: string;
  isDocumentary: boolean;
  otherSourceDesc: string;
  sourceOfMethodUtilized: string;
}

export interface VirtualAccountReference {
  accountReferenceType: string;
  accountReferenceValue: string;
}

export interface VirtualAccountDetails {
  accountType: string;
  allowedPaymentMethods: string[];
  country: string;
  currency: string;
  earlyWithdrawalPenalty: number;
  interestRate: number;
  isIndicator: string;
  minimumBalance: number;
  overDraftAllowed: boolean;
  overDraftLimit: number;
  ownerShipRNC: string;
  parentAccountNumber: string;
  virtualAccountName: string;
  virtualAccountReference: VirtualAccountReference[];
}

export interface AccountCreationPayload {
  individualDetails: IndividualDetails;
  productCode: string;
  taxId: string;
  taxIdType: string;
  ucmIpid: string;
  ucmPartyId: string;
  zelleProfileId: string;
  kycDocumentDetails: KycDocumentDetails;
  virtualAccountDetails: VirtualAccountDetails;
} 