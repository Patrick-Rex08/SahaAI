import { SchemeData } from '../../types';
import { PMUY_SCHEME } from './pmuy';
import { PMMVY_SCHEME } from './pmmvy';
import { SUKANYA_SCHEME } from './sukanya';
import { MUDRA_SCHEME } from './mudra';
import { AYUSHMAN_SCHEME } from './ayushman';

export const ALL_SCHEMES: SchemeData[] = [
  PMUY_SCHEME,
  PMMVY_SCHEME,
  SUKANYA_SCHEME,
  MUDRA_SCHEME,
  AYUSHMAN_SCHEME,
];

export const getSchemeById = (id: string): SchemeData | undefined => {
  return ALL_SCHEMES.find((s) => s.id === id);
};

export const detectSchemeFromText = (text: string): SchemeData | undefined => {
  const lower = text.toLowerCase();

  // Gas / LPG / Ujjwala
  if (
    lower.includes('gas') ||
    lower.includes('cylinder') ||
    lower.includes('stove') ||
    lower.includes('ujjwala') ||
    lower.includes('pmuy') ||
    lower.includes('aduppu') ||
    lower.includes('chulha') ||
    lower.includes('எரிவாயு') ||
    lower.includes('உஜ்வாலா') ||
    lower.includes('गैस') ||
    lower.includes('उज्ज्वला')
  ) {
    return PMUY_SCHEME;
  }

  // Pregnancy / Maternity / PMMVY
  if (
    lower.includes('pregnant') ||
    lower.includes('pregnancy') ||
    lower.includes('maternity') ||
    lower.includes('mother') ||
    lower.includes('baby') ||
    lower.includes('pmmvy') ||
    lower.includes('vandana') ||
    lower.includes('matru') ||
    lower.includes('கர்ப்பிணி') ||
    lower.includes('மகப்பேறு') ||
    lower.includes('பிரசவம்') ||
    lower.includes('गर्भवती') ||
    lower.includes('मातृत्व')
  ) {
    return PMMVY_SCHEME;
  }

  // Daughter / Girl Child / Sukanya
  if (
    lower.includes('sukanya') ||
    lower.includes('daughter') ||
    lower.includes('girl child') ||
    lower.includes('girl savings') ||
    lower.includes('ssy') ||
    lower.includes('செல்வ மகள்') ||
    lower.includes('பெண் குழந்தை') ||
    lower.includes('सुकन्या') ||
    lower.includes('बेटी')
  ) {
    return SUKANYA_SCHEME;
  }

  // Business Loan / Self-employment / Mudra
  if (
    lower.includes('mudra') ||
    lower.includes('business loan') ||
    lower.includes('shop loan') ||
    lower.includes('loan') ||
    lower.includes('shishu') ||
    lower.includes('kishore') ||
    lower.includes('tarun') ||
    lower.includes('கடன்') ||
    lower.includes('முத்ரா') ||
    lower.includes('தொழில் கடன்') ||
    lower.includes('लोन') ||
    lower.includes('मुद्रा') ||
    lower.includes('ऋण')
  ) {
    return MUDRA_SCHEME;
  }

  // Healthcare / Ayushman / Hospital
  if (
    lower.includes('ayushman') ||
    lower.includes('health card') ||
    lower.includes('hospital') ||
    lower.includes('treatment') ||
    lower.includes('insurance') ||
    lower.includes('pmjay') ||
    lower.includes('golden card') ||
    lower.includes('மருத்துவ காப்பீடு') ||
    lower.includes('ஆயுஷ்மான்') ||
    lower.includes('சிகிச்சை') ||
    lower.includes('आयुष्मान') ||
    lower.includes('इलाज')
  ) {
    return AYUSHMAN_SCHEME;
  }

  return undefined;
};

export {
  PMUY_SCHEME,
  PMMVY_SCHEME,
  SUKANYA_SCHEME,
  MUDRA_SCHEME,
  AYUSHMAN_SCHEME,
};
