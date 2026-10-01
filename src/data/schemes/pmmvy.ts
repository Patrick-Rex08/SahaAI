import { SchemeData } from '../../types';

export const PMMVY_SCHEME: SchemeData = {
  id: 'pm-matru-vandana-yojana',
  nameEn: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
  nameTa: 'பிரதம மந்திரி மாத்ரு வந்தனா திட்டம் (PMMVY)',
  ministryEn: 'Ministry of Women and Child Development, Govt of India',
  ministryTa: 'மகளிர் மற்றும் குழந்தைகள் மேம்பாட்டு அமைச்சகம், இந்திய அரசு',
  descriptionEn:
    'Maternity benefit scheme providing direct cash assistance up to ₹6,000 into the bank account of pregnant women and lactating mothers for health, nutrition, and wage compensation.',
  descriptionTa:
    'கர்ப்பிணி பெண்கள் மற்றும் பாலூட்டும் தாய்மார்களுக்கு ஊட்டச்சத்து மற்றும் மருத்துவ உதவிக்காக ₹5,000 முதல் ₹6,000 வரை நேரடி வங்கி நிதி உதவி வழங்கும் மத்திய அரசு திட்டம்.',
  benefitsEn: [
    '₹5,000 direct cash transfer in two installments for the first child',
    'Additional ₹6,000 in a single installment for the second child (if girl child)',
    'Direct Benefit Transfer (DBT) straight into the woman’s bank account',
    'Encourages safe institutional delivery and timely immunization',
  ],
  benefitsTa: [
    'முதல் குழந்தைக்கு இரண்டு தவணைகளில் ₹5,000 நேரடி வங்கி உதவி',
    'இரண்டாவது குழந்தை பெண் குழந்தையாக இருந்தால் ஒரே தவணையில் ₹6,000 நிதி',
    'தொகை நேரடியாக பெண்ணின் சொந்த வங்கி கணக்கிற்கு செல்லும் (DBT)',
    'பாதுகாப்பான மருத்துவமனை பிரசவம் மற்றும் தடுப்பூசி ஊக்குவிப்பு',
  ],
  documentsEn: [
    'Mother and Child Protection (MCP) Card / RCH ID',
    'Applicant Woman’s Aadhaar Card',
    'Husband’s Aadhaar Card',
    'Bank Account Passbook (linked with Aadhaar)',
    'Child Birth Registration Certificate (for 2nd installment)',
  ],
  documentsTa: [
    'தாய்-சேய் நல பாதுகாப்பு அட்டை (MCP Card / RCH ID)',
    'கர்ப்பிணிப் பெண்ணின் ஆதார் அட்டை',
    'கணவரின் ஆதார் அட்டை',
    'பெண்ணின் வங்கி பாஸ்புக் நகல் (ஆதார் இணைக்கப்பட்டது)',
    'குழந்தையின் பிறப்புச் சான்றிதழ் மற்றும் தடுப்பூசி பதிவு',
  ],
  stepsEn: [
    'Step 1: Register pregnancy within 570 days of LMP at nearest Anganwadi Centre (AWC) or government health center.',
    'Step 2: Submit Form 1A along with MCP card and Aadhaar copies to the ASHA worker / Anganwadi worker.',
    'Step 3: 1st installment (₹3,000) is credited after at least one Antenatal Check-up (ANC).',
    'Step 4: 2nd installment (₹2,000) is credited after childbirth registration and first cycle of vaccinations.',
    'Step 5: You can also apply directly online at pmmvy.wcd.gov.in.',
  ],
  stepsTa: [
    'படி 1: கர்ப்பம் உறுதி செய்யப்பட்டவுடன் அருகிலுள்ள அங்கன்வாடி மையம் அல்லது ஆரம்ப சுகாதார நிலையத்தில் பதிவு செய்யவும்.',
    'படி 2: படிவம் 1A உடன் ஆதார் நகல், தாய்-சேய் அட்டை மற்றும் வங்கி பாஸ்புக் ஆகியவற்றை ஆஷா பணியாளரிடம் வழங்கவும்.',
    'படி 3: முதல் தவணை (₹3,000) மருத்துவ பரிசோதனைக்குப் பின் வங்கி கணக்கில் வரவு வைக்கப்படும்.',
    'படி 4: குழந்தை பிறப்பு பதிவு மற்றும் முதல் தடுப்பூசிக்குப் பின் இரண்டாம் தவணை (₹2,000) வரவு வைக்கப்படும்.',
    'படி 5: pmmvy.wcd.gov.in இணையதளம் மூலமாகவும் ஆன்லைனில் விண்ணப்பிக்கலாம்.',
  ],
  officialUrl: 'https://pmmvy.wcd.gov.in',
  helpline: '1800-11-6555 / 1098 (Women & Child Helpline)',
  isVerified: true,
  verificationSource: 'Ministry of Women and Child Development (pmmvy.wcd.gov.in)',
  eligibilityQuestions: [
    {
      id: 'pregnant_lactating',
      questionEn: 'Are you currently pregnant or have you recently given birth?',
      questionTa: 'நீங்கள் தற்போது கர்ப்பமாக உள்ளீர்களா அல்லது சமீபத்தில் குழந்தை பிறந்துள்ளதா?',
      options: [
        {
          labelEn: 'Yes',
          labelTa: 'ஆம்',
          isEligible: true,
          reasonEn: 'PMMVY is designed specifically for pregnant and lactating mothers.',
          reasonTa: 'கர்ப்பிணி மற்றும் பாலூட்டும் தாய்மார்களுக்கு இத்திட்டம் பொருந்தும்.',
        },
        {
          labelEn: 'No',
          labelTa: 'இல்லை',
          isEligible: false,
          reasonEn: 'This maternity scheme is specifically for pregnant and nursing mothers.',
          reasonTa: 'இத்திட்டம் கர்ப்பிணிப் பெண்களுக்கு மட்டுமே பொருந்தும்.',
        },
      ],
    },
    {
      id: 'govt_employment',
      questionEn: 'Are you in regular employment with Central or State Government / PSU?',
      questionTa: 'நீங்கள் மத்திய/மாநில அரசு அல்லது பொதுத்துறை நிறுவனத்தில் நிரந்தரப் பணியாளரா?',
      options: [
        {
          labelEn: 'No, self-employed / informal / homemaker',
          labelTa: 'இல்லை, இல்லத்தரசி / முறைசாரா தொழில்',
          isEligible: true,
          reasonEn: 'Eligible! Women in informal/unorganized sectors and homemakers qualify.',
          reasonTa: 'தகுதியுண்டு! அரசு பணி இல்லாத பெண்கள் விண்ணப்பிக்கலாம்.',
        },
        {
          labelEn: 'Yes, government employee',
          labelTa: 'ஆம், அரசு ஊழியர்',
          isEligible: false,
          reasonEn: 'Govt employees receiving paid maternity leave are not covered under PMMVY.',
          reasonTa: 'சம்பளத்துடன் கூடிய மகப்பேறு விடுப்பு பெறும் அரசு ஊழியர்களுக்கு இத்திட்டம் பொருந்தாது.',
        },
      ],
    },
  ],
};
