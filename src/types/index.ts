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
  officialUrl: string;
  helpline: string;
  isVerified: boolean;
  verificationSource: string;
  eligibilityQuestions: SchemeQuestion[];
}
