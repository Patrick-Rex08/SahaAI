import { SchemeData } from '../../types';

export const PMUY_SCHEME: SchemeData = {
  id: 'pm-ujjwala-yojana',
  nameEn: 'Pradhan Mantri Ujjwala Yojana (Ujjwala 2.0)',
  nameTa: 'பிரதம மந்திரி உஜ்வாலா திட்டம் (Ujjwala 2.0)',
  ministryEn: 'Ministry of Petroleum and Natural Gas, Govt of India',
  ministryTa: 'பெட்ரோலியம் மற்றும் இயற்கை எரிவாயு அமைச்சகம், இந்திய அரசு',
  descriptionEn:
    'Provides deposit-free LPG gas connections to adult women from poor households without an existing gas connection.',
  descriptionTa:
    'ஏழை குடும்பங்களைச் சேர்ந்த வயது வந்த பெண்களுக்கு வைப்புத்தொகை இல்லாத புதிய சமையல் எரிவாயு (LPG) இணைப்பு வழங்கும் மத்திய அரசு திட்டம்.',
  benefitsEn: [
    'Free deposit-free LPG gas cylinder connection',
    'Free first LPG cylinder refill',
    'Free gas stove (hotplate) and Suraksha hose pipe',
    'Direct Benefit Transfer (DBT) subsidy support',
  ],
  benefitsTa: [
    'வைப்புத்தொகை இல்லாத இலவச சமையல் எரிவாயு இணைப்பு',
    'முதல் எரிவாயு சிலிண்டர் ரீஃபில் முற்றிலும் இலவசம்',
    'இலவச எரிவாயு அடுப்பு (Stove) மற்றும் பாதுகாப்பு குழாய்',
    'வங்கி கணக்கில் நேரடி மானிய உதவி (DBT)',
  ],
  documentsEn: [
    'Applicant Woman’s Aadhaar Card (identity & address proof)',
    'Ration Card issued by State Govt (or Family Composition Certificate)',
    'Aadhaar copies of all adult family members',
    'Bank Account Passbook (linked with Aadhaar for subsidy)',
    'Passport-size photograph of the applicant',
  ],
  documentsTa: [
    'விண்ணப்பதாரர் பெண்ணின் ஆதார் அட்டை (அடையாள மற்றும் முகவரி சான்று)',
    'குடும்ப அட்டை (Ration Card) அல்லது குடும்ப உறுப்பினர் சான்றிதழ்',
    'குடும்பத்தில் உள்ள 18 வயதுக்கு மேற்பட்டோரின் ஆதார் நகல்கள்',
    'வங்கி கணக்கு புத்தக நகல் (Passbook)',
    'பாஸ்போர்ட் அளவு புகைப்படம்',
  ],
  stepsEn: [
    'Step 1: Check eligibility (Woman aged 18+, poor household, no existing gas connection in house).',
    'Step 2: Collect Aadhaar, Ration Card, and Bank Passbook.',
    'Step 3: Visit your nearest LPG distributor (Indane, Bharat Gas, or HP Gas) or apply online at pmuy.gov.in.',
    'Step 4: Fill the Ujjwala KYC application form and attach photocopies.',
    'Step 5: After verification, receive your new gas cylinder, regulator, free stove, and 1st free refill.',
  ],
  stepsTa: [
    'படி 1: தகுதியை சரிபார்க்கவும் (18 வயது நிரம்பிய பெண், வீட்டில் வேறு எரிவாயு இணைப்பு இருக்கக்கூடாது).',
    'படி 2: ஆதார் அட்டை, குடும்ப அட்டை (Ration Card), வங்கி பாஸ்புக் ஆகியவற்றை தயாராக வைக்கவும்.',
    'படி 3: அருகிலுள்ள எரிவாயு ஏஜென்சி (Indane / Bharat / HP) செல்லவும் அல்லது pmuy.gov.in இணையதளத்தில் விண்ணப்பிக்கவும்.',
    'படி 4: உஜ்வாலா விண்ணப்பப் படிவத்தை (KYC) பூர்த்தி செய்து ஆவணங்களை இணைக்கவும்.',
    'படி 5: சரிபார்ப்பிற்குப் பின், சிலிண்டர், இலவச அடுப்பு மற்றும் முதல் இலவச ரீஃபில் பெற்றுக்கொள்ளவும்.',
  ],
  officialUrl: 'https://www.pmuy.gov.in',
  helpline: '1800-266-6696 / 1906 (Toll-Free Helpline)',
  isVerified: true,
  verificationSource: 'Official PMUY Portal (pmuy.gov.in) & Ministry of Petroleum and Natural Gas',
  eligibilityQuestions: [
    {
      id: 'gender_age',
      questionEn: 'Are you a woman aged 18 years or older?',
      questionTa: 'நீங்கள் 18 வயது அல்லது அதற்கு மேற்பட்ட பெண்மணியா?',
      options: [
        { labelEn: 'Yes', labelTa: 'ஆம்', isEligible: true },
        {
          labelEn: 'No',
          labelTa: 'இல்லை',
          isEligible: false,
          reasonEn: 'Ujjwala 2.0 connections are issued only in the name of an adult woman (18+).',
          reasonTa: 'உஜ்வாலா இணைப்பு 18 வயது நிரம்பிய பெண்மணியின் பெயரில் மட்டுமே வழங்கப்படுகிறது.',
        },
      ],
    },
    {
      id: 'existing_connection',
      questionEn: 'Does anyone in your household already have an LPG gas connection?',
      questionTa: 'உங்கள் வீட்டில் ஏற்கனவே யாருக்காவது சமையல் எரிவாயு இணைப்பு உள்ளதா?',
      options: [
        { labelEn: 'No (We have no connection)', labelTa: 'இல்லை (எங்களிடம் இணைப்பு இல்லை)', isEligible: true },
        {
          labelEn: 'Yes (We already have one)',
          labelTa: 'ஆம் (ஏற்கனவே எங்களிடம் உள்ளது)',
          isEligible: false,
          reasonEn: 'Households that already have an LPG cylinder connection are not eligible for a new Ujjwala connection.',
          reasonTa: 'ஏற்கனவே வீட்டில் எரிவாயு இணைப்பு உள்ள குடும்பங்கள் புதிய உஜ்வாலா இணைப்பு பெற முடியாது.',
        },
      ],
    },
    {
      id: 'household_category',
      questionEn: 'Does your family have a Ration Card (BPL / Antyodaya / Priority Household) or low-income status?',
      questionTa: 'உங்கள் குடும்பத்திடம் குடும்ப அட்டை (Ration Card) அல்லது குறைந்த வருமான நிலை உள்ளதா?',
      options: [
        { labelEn: 'Yes', labelTa: 'ஆம்', isEligible: true },
        {
          labelEn: 'Not sure',
          labelTa: 'தெரியவில்லை',
          isEligible: true,
          reasonEn: 'You can submit a standard Deprivation Declaration at the nearest distributor if not listed.',
          reasonTa: 'பட்டியலில் இல்லாவிட்டாலும் தகுதி உறுதிமொழிப் படிவம் மூலம் ஏஜென்சியில் சரிபார்க்கலாம்.',
        },
      ],
    },
  ],
};
