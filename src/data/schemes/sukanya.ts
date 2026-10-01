import { SchemeData } from '../../types';

export const SUKANYA_SCHEME: SchemeData = {
  id: 'sukanya-samriddhi-yojana',
  nameEn: 'Sukanya Samriddhi Yojana (SSY)',
  nameTa: 'சுகன்யா சம்ரித்தி திட்டம் (செல்வ மகள் சேமிப்புத் திட்டம்)',
  ministryEn: 'Ministry of Finance & Ministry of Women and Child Development, Govt of India',
  ministryTa: 'நிதி அமைச்சகம் மற்றும் மகளிர் மேம்பாட்டு அமைச்சகம், இந்திய அரசு',
  descriptionEn:
    'Government-backed high-interest savings scheme designed for the higher education, financial security, and future of girl children, offering guaranteed 8.2% annual interest and tax exemption.',
  descriptionTa:
    'பெண் குழந்தைகளின் உயர்கல்வி மற்றும் எதிர்கால பாதுகாப்பிற்காக 8.2% அதிக வட்டியுடன் இந்திய அரசு வழங்கும் மிகச் சிறந்த செல்வ மகள் சேமிப்புத் திட்டம்.',
  benefitsEn: [
    'High sovereign-guaranteed interest rate (~8.2% per annum, compounded annually)',
    '100% Tax Exemption (EEE category: deposit, interest, and maturity amount are tax-free)',
    'Start with as little as ₹250 per year (maximum ₹1,50,000 per financial year)',
    '50% partial withdrawal allowed after girl child turns 18 for college/higher education',
    'Account matures 21 years from account opening or upon marriage after age 18',
  ],
  benefitsTa: [
    'அரசு உத்தரவாதத்துடன் கூடிய 8.2% அதிக ஆண்டு கூட்டு வட்டி',
    'முழுமையான வருமான வரி விலக்கு (பணம், வட்டி, முதிர்வு தொகை அனைத்தும் வரி இல்லாதவை)',
    'ஆண்டிற்கு குறைந்தபட்சம் ₹250 முதல் சேமிப்பை தொடங்கலாம் (அதிகபட்சம் ₹1,50,000)',
    'பெண் குழந்தைக்கு 18 வயது முடிந்ததும் கல்லூரி படிப்பிற்காக 50% தொகையை எடுத்துக்கொள்ளலாம்',
    '21 ஆண்டுகள் அல்லது 18 வயதுக்கு மேல் நடக்கும் திருமணத்தின் போது முழு முதிர்வு தொகை வழங்கப்படும்',
  ],
  documentsEn: [
    'Birth Certificate of the girl child (with child’s name)',
    'Identity proof of Parent/Legal Guardian (Aadhaar Card / PAN Card)',
    'Address proof of Parent/Legal Guardian (Aadhaar / Ration Card / Electricity Bill)',
    'Passport-size photos of the girl child and parent/guardian',
  ],
  documentsTa: [
    'பெண் குழந்தையின் பிறப்புச் சான்றிதழ் (பெயர் பதிவு செய்யப்பட்டது)',
    'பெற்றோர் அல்லது காப்பாளரின் ஆதார் அட்டை / பான் கார்டு',
    'பெற்றோரின் முகவரி சான்று (ஆதார் / ரேஷன் கார்டு / மின்சார ரசீது)',
    'பெண் குழந்தை மற்றும் பெற்றோரின் பாஸ்போர்ட் அளவு புகைப்படங்கள்',
  ],
  stepsEn: [
    'Step 1: Verify eligibility (Girl child aged 10 years or younger; maximum 2 accounts per family).',
    'Step 2: Collect the girl child’s birth certificate and parent’s Aadhaar card.',
    'Step 3: Visit your nearest Post Office (India Post) or authorized commercial bank branch (SBI, PNB, Canara Bank, Indian Bank, etc.).',
    'Step 4: Fill the SSY Account Opening Form and make an initial deposit (minimum ₹250).',
    'Step 5: Receive your Sukanya Samriddhi Passbook to track deposits and yearly interest.',
  ],
  stepsTa: [
    'படி 1: பெண் குழந்தையின் வயது 10 அல்லது அதற்குள் இருப்பதை உறுதி செய்யவும் (ஒரு குடும்பத்தில் 2 பெண் குழந்தைகளுக்கு மட்டும்).',
    'படி 2: குழந்தையின் பிறப்புச் சான்றிதழ் மற்றும் பெற்றோரின் ஆதார் அட்டையை எடுத்துக்கொள்ளவும்.',
    'படி 3: அருகிலுள்ள தபால் நிலையம் (Post Office) அல்லது தேசியமயமாக்கப்பட்ட வங்கிக்கு (SBI, Indian Bank, Canara Bank) செல்லவும்.',
    'படி 4: செல்வ மகள் சேமிப்பு படிவத்தை பூர்த்தி செய்து ஆரம்ப தொகையாக குறைந்தது ₹250 செலுத்தவும்.',
    'படி 5: பாஸ்புக் பெற்றுக்கொண்டு ஆண்டுதோறும் உங்கள் சேமிப்பை தொடரலாம்.',
  ],
  officialUrl: 'https://www.indiapost.gov.in',
  helpline: '1800-266-6868 (India Post Helpline)',
  isVerified: true,
  verificationSource: 'National Savings Institute, Ministry of Finance (indiapost.gov.in)',
  eligibilityQuestions: [
    {
      id: 'girl_age',
      questionEn: 'Is your daughter aged 10 years or younger?',
      questionTa: 'உங்கள் பெண் குழந்தையின் வயது 10 அல்லது அதற்குள் உள்ளதா?',
      options: [
        {
          labelEn: 'Yes, 10 years or younger',
          labelTa: 'ஆம், 10 வயது அல்லது அதற்குள்',
          isEligible: true,
          reasonEn: 'Eligible! Sukanya Samriddhi account can be opened from birth up to 10 years.',
          reasonTa: 'தகுதியுண்டு! பிறந்தது முதல் 10 வயது வரை இக்கணக்கை தொடங்கலாம்.',
        },
        {
          labelEn: 'No, older than 10 years',
          labelTa: 'இல்லை, 10 வயதுக்கு மேல்',
          isEligible: false,
          reasonEn: 'SSY can only be opened for girl children up to 10 years of age. Consider Mahila Samman Certificate instead.',
          reasonTa: '10 வயதுக்கு மேற்பட்ட பெண்களுக்கு இத்திட்டம் பொருந்தாது. மஹிளா சம்மான் திட்டத்தை அணுகலாம்.',
        },
      ],
    },
  ],
};
