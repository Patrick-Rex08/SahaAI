export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
  schemeCardId?: string; // Optional reference to show structured scheme guidance card
}

export interface SchemeQuestion {
  id: string;
  questionEn: string;
  questionTa: string;
  options: {
    labelEn: string;
    labelTa: string;
    isEligible: boolean;
    reasonEn?: string;
    reasonTa?: string;
  }[];
}

export interface SchemeData {
  id: string;
  // Core government resource schema
  schemeName: string;
  purpose: string;
  intendedUsers: string;
  basicEligibility: string[];
  requiredDocuments: string[];
  benefitService: string[];
  applicationSteps: string[];
  officialUrl: string;
  source: string;

  // Multilingual & guidance presentation fields
  nameEn: string;
  nameTa: string;
  ministryEn: string;
  ministryTa: string;
  descriptionEn: string;
  descriptionTa: string;
  benefitsEn: string[];
  benefitsTa: string[];
  documentsEn: string[];
  documentsTa: string[];
  stepsEn: string[];
  stepsTa: string[];
  helpline: string;
  isVerified: boolean;
  verificationSource: string;
  eligibilityQuestions: SchemeQuestion[];
}
