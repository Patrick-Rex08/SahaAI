import { SchemeData } from '../../types';

export const MUDRA_SCHEME: SchemeData = {
  id: 'pm-mudra-yojana',
  nameEn: 'Pradhan Mantri Mudra Yojana (PMMY)',
  nameTa: 'பிரதம மந்திரி முத்ரா கடன் திட்டம் (PMMY)',
  ministryEn: 'Ministry of Finance, Govt of India',
  ministryTa: 'நிதி அமைச்சகம், இந்திய அரசு',
  descriptionEn:
    'Provides 100% collateral-free business loans up to ₹10 Lakh to women entrepreneurs, self-help groups, and micro-enterprises to start or expand small businesses.',
  descriptionTa:
    'பெண்கள் சுயதொழில் தொடங்க, தையல், பெட்டிக்கடை அல்லது சிறு வணிகம் நடத்த எந்தவொரு அடமானமும் இன்றி ₹10 லட்சம் வரை வணிகக் கடன் வழங்கும் மத்திய அரசு திட்டம்.',
  benefitsEn: [
    '100% Collateral-Free: No property or gold guarantee required',
    'Three Loan Tiers: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), Tarun (₹5 Lakh to ₹10 Lakh)',
    'Low interest rates with affordable monthly EMIs',
    'Special preference and processing priority for women entrepreneurs',
    'Mudra Card (pre-loaded debit card) provided for working capital expenses',
  ],
  benefitsTa: [
    'எந்தவொரு அடமானமும் தேவையில்லை (சொத்து அல்லது தங்கம் அடமானம் வைக்க வேண்டியதில்லை)',
    'மூன்று வகையான கடன்கள்: சிசு (₹50,000 வரை), கிஷோர் (₹50,000 முதல் ₹5 லட்சம் வரை), தருண் (₹5 லட்சம் முதல் ₹10 லட்சம் வரை)',
    'குறைந்த வட்டி விகிதம் மற்றும் எளிய மாதாந்திர தவணைகள்',
    'பெண் தொழில்முனைவோர் மற்றும் சுயஉதவி குழுக்களுக்கு சிறப்பு முன்னுரிமை',
    'வணிக செலவுகளுக்கு பயன்படும் வகையில் முத்ரா டெபிட் கார்டு வசதி',
  ],
  documentsEn: [
    'Applicant Woman’s Aadhaar Card and PAN Card',
    'Proof of Residence (Ration Card, Voter ID, or Electricity bill)',
    'Passport-size photographs (2 copies)',
    'Brief business idea proposal / quotations of machinery or stock to be purchased',
    'Bank account statement (last 6 months, if existing business)',
  ],
  documentsTa: [
    'விண்ணப்பதாரர் பெண்ணின் ஆதார் அட்டை மற்றும் பான் கார்டு',
    'இருப்பிடச் சான்று (குடும்ப அட்டை, வாக்காளர் அட்டை அல்லது மின் கட்டண ரசீது)',
    'பாஸ்போர்ட் அளவு புகைப்படங்கள் (2 பிரதிகள்)',
    'தொழில் திட்டம் மற்றும் வாங்க உத்தேசித்துள்ள பொருட்களின் விலை பட்டியல் (Quotation)',
    'வங்கி கணக்கு அறிக்கை (கடந்த 6 மாதங்கள்)',
  ],
  stepsEn: [
    'Step 1: Choose loan category: Shishu (up to ₹50K for new small trade/tailoring) or Kishore (up to ₹5L for expanding).',
    'Step 2: Prepare your Aadhaar, PAN card, photo, and business estimate quotation.',
    'Step 3: Visit any public/private bank (SBI, Indian Bank, Canara, BoB), Rural Bank (RRB), or Microfinance institution.',
    'Step 4: Fill the simple Mudra Loan Application Form (available free at bank or udyamimitra.in).',
    'Step 5: After bank verification, loan amount is sanctioned directly to your business account with a Mudra Debit Card.',
  ],
  stepsTa: [
    'படி 1: கடன் அளவை தேர்வு செய்யவும்: சிசு (புதிய சிறுதொழில் அல்லது தையல் கடைக்கு ₹50,000 வரை) அல்லது கிஷோர் (வளர்ந்த தொழிலுக்கு ₹5 லட்சம் வரை).',
    'படி 2: ஆதார், பான் கார்டு, புகைப்படம் மற்றும் வாங்க வேண்டிய இயந்திரங்களின் விலை பட்டியலை தயார் செய்யவும்.',
    'படி 3: அருகிலுள்ள ஏதேனும் ஒரு அரசு/தனியார் வங்கி அல்லது கிராம வங்கிக்கு (RRB) செல்லவும்.',
    'படி 4: முத்ரா விண்ணப்ப படிவத்தை இலவசமாக பெற்று பூர்த்தி செய்து சமர்ப்பிக்கவும்.',
    'படி 5: வங்கி சரிபார்ப்பிற்கு பிறகு கடன் தொகை உங்கள் கணக்கில் நேரடியாக வழங்கப்படும்.',
  ],
  officialUrl: 'https://www.mudra.org.in',
  helpline: '1800-180-1111 (National Toll-Free Helpline)',
  isVerified: true,
  verificationSource: 'Micro Units Development & Refinance Agency Ltd (mudra.org.in)',
  eligibilityQuestions: [
    {
      id: 'business_purpose',
      questionEn: 'Do you want to start or run a non-farming micro-business, shop, or service?',
      questionTa: 'நீங்கள் விவசாயம் அல்லாத சிறுதொழில், கடை அல்லது சேவை தொழில் தொடங்க விரும்புகிறீர்களா?',
      options: [
        {
          labelEn: 'Yes (tailoring, food, retail shop, beauty parlor, handicrafts, etc.)',
          labelTa: 'ஆம் (தையல், மளிகை கடை, உணவு தொழில், அழகு நிலையம், கைவினை போன்றவை)',
          isEligible: true,
          reasonEn: 'Eligible! Mudra loans cover all non-farm micro-enterprises and women artisans.',
          reasonTa: 'தகுதியுண்டு! விவசாயம் அல்லாத அனைத்து சிறுதொழில்களுக்கும் முத்ரா கடன் கிடைக்கும்.',
        },
        {
          labelEn: 'No, personal loan or agriculture farming',
          labelTa: 'இல்லை, தனிநபர் செலவு அல்லது விவசாய பயிர் கடன்',
          isEligible: false,
          reasonEn: 'Mudra is exclusively for income-generating micro-businesses, not personal loans.',
          reasonTa: 'முத்ரா கடன் வணிகத்திற்கு மட்டுமே பொருந்தும், தனிநபர் தேவைக்கு அல்ல.',
        },
      ],
    },
  ],
};
