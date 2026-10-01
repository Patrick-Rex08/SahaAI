import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Ensure .env variables are loaded server-side with override
dotenv.config({ override: true });

const SAHA_SYSTEM_INSTRUCTION = `
You are "Saha", an empathetic, respectful, and accessible AI citizen companion designed to help women across all of India understand and access government schemes, services, and opportunities independently.

MULTILINGUAL CAPABILITIES (CORE PRINCIPLE):
- Saha is built for all of India. You MUST NOT treat English or Tamil as default.
- Automatically identify the language of the user's input words and reply in that EXACT same language:
  • Match the LANGUAGE/SCRIPT OF THE QUERY, NOT the state or location mentioned in the text. For example, if a user writes in English asking about Tamil Nadu (e.g. "scholarship for woman in tamilnadu"), reply in ENGLISH.
  • If the user writes in Tamil, reply in Tamil.
  • If the user writes in Hindi, reply in Hindi.
  • If the user writes in Bengali, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, or Urdu, reply in that language.
  • Never switch to a regional language just because the user mentioned a state name.
- Supported Indian languages include:
  • Hindi (हिंदी)
  • Bengali (বাংলা)
  • Telugu (తెలుగు)
  • Marathi (मराठी)
  • Tamil (தமிழ்)
  • Gujarati (ગુજરાતી)
  • Kannada (ಕನ್ನಡ)
  • Malayalam (മലയാളം)
  • Odia (ଓଡ଼ିଆ)
  • Punjabi (ਪੰਜਾਬੀ)
  • Assamese (অসমীয়া)
  • Urdu (اردو)
  • Sindhi (سنڌي / सिंधी)
  • Indian English & regional transliterations (Hinglish, Tanglish, etc.)
- When the user communicates in any of these languages or their Romanized transliteration, reply naturally in that language.
- DO NOT show or ask for language selection. Never ask what language they are comfortable in.
- Avoid bureaucratic jargon and intimidating paragraphs. Keep replies simple, conversational, and respectful.

CONVERSATION CONTEXT & FOLLOW-UP CONTINUITY:
- The user may ask short follow-up questions (e.g., "What documents?", "How to apply?", "ஆவணங்கள் என்ன?", "दस्तावेज क्या हैं?").
- Always connect follow-up questions to the ongoing conversation topic.

GROUNDING & SOURCE OF TRUTH (CRITICAL RULE):
- Gemini must NOT invent government schemes, eligibility criteria, document requirements, benefit amounts, or official URLs.
- Use the verified structured data below as the absolute source of truth.

VERIFIED GOVERNMENT RESOURCE (PM UJJWALA YOJANA 2.0):
- Scheme/Service Name: Pradhan Mantri Ujjwala Yojana (PMUY 2.0)
- Purpose: To safeguard the health of women and children by providing clean cooking fuel (LPG) to poor households, eliminating health hazards associated with burning firewood, coal, and cow-dung.
- Intended Users: Adult women (aged 18+) from poor, underprivileged, and migrant households across India who currently do not possess an active LPG gas connection.
- Basic Eligibility:
  1. Applicant must be an adult woman aged 18 years or older.
  2. Applicant must belong to an economically deprived household (BPL, Antyodaya Anna Yojana, Priority Household ration card, or SECC categories).
  3. No one in the applicant’s entire household must have an active LPG connection with any Oil Marketing Company (Indane, Bharat Gas, or HP Gas).
  4. Migrant workers do not need local ration cards or local address proof; a self-declaration is accepted under Ujjwala 2.0.
- Required Documents:
  1. State Ration Card (or Family Composition Certificate confirming family members)
  2. Aadhaar Card of the applicant woman (as mandatory proof of identity and residence)
  3. Aadhaar cards of all adult (18+) family members living in the household
  4. Bank Account Passbook (linked with Aadhaar for Direct Benefit Transfer of ongoing gas subsidies)
  5. Passport-size photograph of the applicant woman
- Benefit/Service:
  1. 100% Deposit-Free LPG connection: ₹0 security deposit for the gas cylinder and pressure regulator.
  2. First filled 14.2 kg LPG cylinder refill provided completely free of charge.
  3. High-efficiency certified 2-burner gas stove (hotplate) and Suraksha safety hose pipe provided 100% free.
  4. Eligible for direct government refill subsidies credited straight into the woman’s bank account (DBT).
- Application/Access Steps:
  1. Step 1 (Check Eligibility): Ensure you are an adult woman (18+) from a poor household with no existing gas connection.
  2. Step 2 (Prepare Documents): Keep copies of your Ration Card, Aadhaar Card, family Aadhaar cards, bank passbook, and photo.
  3. Step 3 (Submit Application): Visit your nearest LPG distributor (Indane, Bharat Gas, or HP Gas) OR apply online at the official portal: https://www.pmuy.gov.in.
  4. Step 4 (KYC Form): Fill the simple Ujjwala 2.0 KYC form (free of charge at distributor) and attach document copies.
  5. Step 5 (Delivery): After distributor verification, receive your deposit-free cylinder, regulator, free stove, and 1st refill at zero cost.
- Official Government URL: https://www.pmuy.gov.in
- Source: Ministry of Petroleum and Natural Gas, Government of India (Official Portal: pmuy.gov.in)

NATURAL CONVERSATION DISCOVERY FLOW:
1. When a user says "I need government help but I don't know which scheme I need" (or similar open-ended need):
   - Acknowledge and empathize with their request.
   - Ask ONLY ONE simple, clarifying question at a time to determine their immediate household need (e.g. asking whether they need clean cooking fuel / gas connection at home, financial aid for pregnancy, savings for a daughter, or a business loan). Do NOT ask multiple questions or write walls of text.
2. When the user responds with their need (e.g. "Gas connection" or "Cooking gas"):
   - Identify the available resource: Pradhan Mantri Ujjwala Yojana (PMUY 2.0).
   - Explain it simply in friendly, everyday language.
   - Clearly present:
     • Basic Eligibility
     • Required Documents
     • Next Steps to Apply
     • Official Government Link: https://www.pmuy.gov.in
   - Ground strictly in the verified structured data. Do not invent any facts.

OTHER VERIFIED SCHEMES REFERENCE:
1. Pradhan Mantri Matru Vandana Yojana (PMMVY):
   • Eligibility: Pregnant & lactating women (19+, excluding govt staff).
   • Benefits: ₹5,000 in two installments for 1st child; ₹6,000 for 2nd child if a girl. DBT.
   • Documents: MCP card, Woman Aadhaar, Husband Aadhaar, Bank Passbook.
   • Apply: Anganwadi Centre (AWC) / pmmvy.wcd.gov.in. Helpline: 1800-11-6555.

2. Sukanya Samriddhi Yojana (SSY):
   • Eligibility: Girl children from birth up to age 10 (max 2 daughters).
   • Benefits: ~8.2% annual compound interest, 100% tax-free. Min ₹250/year.
   • Documents: Birth Certificate, Parent Aadhaar & PAN, address proof, photos.
   • Apply: Post Office or authorized bank. Helpline: 1800-266-6868.

3. Pradhan Mantri Mudra Yojana (PMMY):
   • Eligibility: Women starting/growing micro-businesses, shops, tailoring, food, crafts.
   • Benefits: 100% collateral-free loans up to ₹10 Lakh (Shishu: up to ₹50K; Kishore: ₹50K-₹5L; Tarun: ₹5L-₹10L).
   • Documents: Aadhaar, PAN card, address proof, business quotation.
   • Apply: Any bank branch or udyamimitra.in. Helpline: 1800-180-1111.

4. Ayushman Bharat (PM-JAY):
   • Eligibility: Families in SECC / Priority Ration Card.
   • Benefits: ₹5 Lakh cashless hospital treatment per family per year.
   • Documents: Ration card, Aadhaar card.
   • Apply: beneficiary.nha.gov.in or CSC kiosk. Helpline: 14555.

5. 181 Women Helpline & Sakhi One Stop Centre:
   • 24x7 toll-free helpline (181) for safety, emergency medical aid, and counseling.

6. Tamil Nadu Women Scholarships & Higher Education Aid:
   • Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme):
     - Eligibility: Girl students who studied from Class 6 to 12 in Tamil Nadu Government schools and are pursuing undergraduate degrees, polytechnic, ITI, or professional courses.
     - Benefits: ₹1,000 per month deposited directly into the student's bank account until degree completion.
     - Documents: 6-12th Govt School study proof / EMIS ID, 10th & 12th marksheets, College Bonafide/ID, Student Aadhaar, Bank Passbook in student's name.
     - How to Apply: Apply through the college scholarship nodal officer or online at https://www.pudhumaipenn.tn.gov.in.
   • AICTE Pragati Scholarship for Girls: ₹50,000 per year for female students in technical degree/diploma courses via National Scholarship Portal: https://scholarships.gov.in.
   • Tamil Nadu Post-Matric & BC/MBC/DNC Welfare Scholarships: Full tuition fee waivers, exam fees, and maintenance allowances for eligible women college students.
`;

export interface ChatRequestBody {
  messages: Array<{
    role: 'user' | 'assistant';
    text: string;
  }>;
  audio?: {
    data: string; // base64
    mimeType: string;
  };
}

export async function handleChatRequest(body: ChatRequestBody): Promise<{ text: string; language?: string }> {
  const { messages, audio } = body;
  if ((!messages || messages.length === 0) && !audio) {
    throw new Error('Messages or audio input is required');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isValidApiKey =
    apiKey &&
    apiKey.trim() !== '' &&
    apiKey !== 'YOUR_API_KEY_HERE' &&
    apiKey !== 'your_gemini_api_key_here' &&
    !apiKey.startsWith('YOUR_');

  // 1. If a valid GEMINI_API_KEY is configured, call Gemini with resilient candidate fallback
  if (isValidApiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const CANDIDATE_MODELS = [
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-3.8-flash',
        'gemini-3.5-flash',
      ];

      if (audio && audio.data) {
        for (const modelName of CANDIDATE_MODELS) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: 'Listen to the user query in this voice recording. Automatically identify the Indian language or dialect spoken (Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Urdu, Sindhi, or English). Understand the user intent and reply directly and helpfully in that same language. Do not ask for language preference.',
                    },
                    {
                      inlineData: {
                        mimeType: audio.mimeType || 'audio/webm',
                        data: audio.data,
                      },
                    },
                  ],
                },
              ],
              config: {
                systemInstruction: SAHA_SYSTEM_INSTRUCTION,
                temperature: 0.7,
              },
            });

            if (response.text) {
              return { text: response.text };
            }
          } catch (modelErr: any) {
            console.warn(`Voice request with ${modelName} failed (${modelErr?.message || modelErr}), trying next candidate...`);
          }
        }
      }

      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text || m.content || '' }],
      }));

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: SAHA_SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });

          if (response.text) {
            return { text: response.text };
          }
        } catch (modelErr: any) {
          console.warn(`Text request with ${modelName} failed (${modelErr?.message || modelErr}), trying next candidate...`);
        }
      }
    } catch (geminiError: unknown) {
      console.warn('Gemini API client failure, falling back to intelligent offline multilingual handler:', geminiError);
    }
  }

  // 2. Intelligent Grounded Multilingual Fallback Handler
  return generateFallbackResponse(messages);
}

function generateFallbackResponse(messages: Array<{ role: string; text: string }>): { text: string } {
  const fullConversationHistory = messages
    ? messages.map((m: any) => (m.text || m.content || '')).join(' ').toLowerCase()
    : '';

  const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1] : null;
  const lastMessage = lastMsg ? (lastMsg.text || (lastMsg as any).content || '') : '';
  const text = lastMessage.trim();
  const lower = text.toLowerCase();

  // Script detection
  const isTamil = /[\u0B80-\u0BFF]/.test(text) || /\b(venum|theva|epdi|solunga|kedaikkuma|udhavi|aavanam|thakuthi)\b/.test(lower);
  const isDevanagari = /[\u0900-\u097F]/.test(text);
  const isHindi = isDevanagari || /\b(chahiye|kaise|kya|batao|madad|mujhe|yojana|paise|dastavez|patrata|hai|hain|kahan|kaun)\b/.test(lower);

  // 0. NATURAL DISCOVERY FLOW: "I need government help but I don't know which scheme I need"
  const isNeedUnknownSchemeQuery =
    (lower.includes('need') && lower.includes('help') && (lower.includes("don't know") || lower.includes("dont know") || lower.includes("not know") || lower.includes("which scheme"))) ||
    lower.includes('dont know which scheme') ||
    lower.includes("don't know which scheme") ||
    lower.includes('not sure which scheme') ||
    lower.includes('which scheme i need') ||
    lower.includes('எந்த திட்டம் என்று தெரியவில்லை') ||
    lower.includes('திட்டம் தெரியவில்லை') ||
    lower.includes('योजना नहीं पता') ||
    lower.includes('कौन सी योजना चाहिए') ||
    (lower.includes('government help') && (lower.includes('which') || lower.includes('need')));

  if (isNeedUnknownSchemeQuery) {
    if (isTamil) {
      return {
        text: 'நிச்சயமாக, உங்களுக்கு உதவ நான் தயாராக உள்ளேன்! உங்களுக்கு மிகவும் பொருத்தமான அரசு நலத்திட்டத்தை தேர்வு செய்ய ஒரு எளிய கேள்வி: உங்களுக்கு இந்த நேரத்தில் வீட்டில் எந்த வகையான உதவி மிகவும் தேவை — எடுத்துக்காட்டாக, சுத்தமான சமையல் எரிவாயு (கேஸ் சிலிண்டர்) இணைப்பா, கர்ப்பிணிப் பெண்களுக்கான நிதி உதவியா, பெண் குழந்தைக்கான சேமிப்பா, அல்லது தொழில் தொடங்க கடனா?',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'मैं आपकी पूरी मदद करूँगी। आपके लिए सबसे सही सरकारी योजना जानने के लिए केवल एक बात बताएं: इस समय आपकी सबसे मुख्य आवश्यकता क्या है — क्या आपको घर के लिए मुफ्त रसोई गैस (LPG) कनेक्शन चाहिए, गर्भावस्था में पोषण सहायता, बेटी के भविष्य हेतु बचत, या व्यवसाय शुरू करने के लिए लोन?',
      };
    }
    return {
      text: 'I understand and I am here to help you find the right support. To find the best scheme for you, what is your most urgent need at home right now — for example, do you need a clean cooking gas connection at home, financial aid for pregnancy, savings for a daughter, or a loan to start a business?',
    };
  }

  // 1. SPECIFIC CHECK: Asking if Saha only knows Ujjwala or what other schemes exist
  const isOnlyUjjwalaQuery =
    (lower.includes('only') && (lower.includes('ujjwala') || lower.includes('gas'))) ||
    lower.includes('nothing more') ||
    lower.includes('other than ujjwala') ||
    lower.includes('besides ujjwala') ||
    lower.includes('more than that') ||
    lower.includes('வேறு திட்டம்') ||
    lower.includes('உஜ்வாலா மட்டும்') ||
    lower.includes('सिर्फ उज्ज्वला') ||
    lower.includes('केवळ उज्ज्वला');

  if (isOnlyUjjwalaQuery) {
    if (isTamil) {
      return {
        text: 'இல்லை! சஹா (Saha) உஜ்வாலா திட்டத்தை மட்டுமல்லாமல், இந்திய பெண்களுக்கான பல்வேறு முக்கிய அரசு நலத்திட்டங்களுக்கும் முழு வழிகாட்டலை வழங்குகிறது:\n\n1. பிரதம மந்திரி உஜ்வாலா திட்டம் (PMUY): ஏழைப் பெண்களுக்கு இலவச சமையல் எரிவாயு இணைப்பு, அடுப்பு மற்றும் முதல் சிலிண்டர்.\n2. பிரதான் மந்திரி மாத்ரு வந்தனா திட்டம் (PMMVY): கர்ப்பிணிப் பெண்கள் மற்றும் பாலூட்டும் தாய்மார்களுக்கு ₹6,000 வரை நேரடி வங்கி உதவி.\n3. சுகன்யா சம்ரித்தி திட்டம் (செல்வ மகள் சேமிப்பு): பெண் குழந்தைகளின் கல்வி மற்றும் எதிர்காலத்திற்கான 8.2% அதிக வட்டி தரும் வரி விலக்கு சேமிப்புத் திட்டம்.\n4. PM முத்ரா கடன் திட்டம்: பெண்கள் சுயதொழில் தொடங்க ₹10 லட்சம் வரை பிணையில்லா வணிகக் கடன்.\n5. ஆயுஷ்மான் பாரத் (PM-JAY): ஏழை குடும்பங்களுக்கு ஆண்டுக்கு ₹5,00,000 வரை இலவச மருத்துவமனை சிகிச்சை.\n6. 181 மகளிர் உதவி எண் & ஒன் ஸ்டாப் சென்டர் (Sakhi): பெண்களின் பாதுகாப்பு, அவசர உதவி மற்றும் சட்ட ஆலோசனை.\n\nஇந்த திட்டங்களின் தகுதி, தேவையான ஆவணங்கள் மற்றும் விண்ணப்பிக்கும் முறை பற்றி நீங்கள் எந்த கேள்வியும் கேட்கலாம்!',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'जी नहीं! सहा (Saha) केवल उज्ज्वला तक सीमित नहीं है। मैं भारत की महिलाओं और परिवारों के लिए सरकार की कई प्रमुख योजनाओं में पूरी सहायता करती हूँ:\n\n1. प्रधानमंत्री उज्ज्वला योजना 2.0: गरीब महिलाओं को मुफ्त एलपीजी गैस कनेक्शन, चूल्हा व पहला सिलेंडर।\n2. प्रधानमंत्री मातृ वंदना योजना (PMMVY): गर्भवती व धात्री महिलाओं को पोषण सहायता हेतु ₹6,00,000 तक की सीधी बैंक सहायता।\n3. सुकन्या समृद्धि योजना: बेटियों की उच्च शिक्षा के लिए 8.2% ब्याज वाली पूर्ण कर-मुक्त सरकारी बचत योजना।\n4. प्रधानमंत्री मुद्रा योजना (PMMY): महिलाओं को स्वरोजगार व दुकान शुरू करने हेतु बिना किसी गारंटी ₹10 लाख तक का ऋण।\n5. आयुष्मान भारत (PM-JAY): प्रत्येक पात्र परिवार को प्रतिवर्ष ₹5,00,000 तक का मुफ्त अस्पताल इलाज।\n6. 181 महिला हेल्पलाइन व वन स्टॉप सेंटर: महिलाओं की सुरक्षा, कानूनी सलाह व संकट में 24x7 आपातकालीन सहायता।\n\nआप इनमें से किसी भी योजना की पात्रता, आवश्यक दस्तावेज या आवेदन प्रक्रिया के बारे में सीधे पूछ सकती हैं!',
      };
    }
    return {
      text: 'No, Saha covers multiple flagship government welfare schemes for women and families across India:\n\n1. PM Ujjwala Yojana 2.0 (PMUY): Free LPG gas connection, stove, and 1st cylinder for eligible women.\n2. Pradhan Mantri Matru Vandana Yojana (PMMVY): Direct cash assistance up to ₹6,000 for pregnant women and lactating mothers.\n3. Sukanya Samriddhi Yojana (SSY): High-interest (8.2%) government savings scheme for girl children up to age 10 for higher education.\n4. PM Mudra Yojana (PMMY): 100% collateral-free business loans up to ₹10 Lakh for women entrepreneurs and small shops.\n5. Ayushman Bharat (PM-JAY): ₹5,00,000 cashless secondary and tertiary hospital treatment per family per year.\n6. One Stop Centre (Sakhi) & 181 Helpline: 24x7 emergency medical, legal, and counseling safety assistance.\n\nYou can ask about eligibility, required documents, benefits, and how to apply for any of these schemes!',
    };
  }

  // 1.5 SCHOLARSHIPS & EDUCATION FOR WOMEN (Tamil Nadu & India)
  const isScholarshipQuery =
    lower.includes('scholarship') ||
    lower.includes('pudhumai penn') ||
    lower.includes('pudhumai') ||
    lower.includes('college fee') ||
    lower.includes('higher education') ||
    lower.includes('கல்வி உதவித்தொகை') ||
    lower.includes('ஸ்காலர்ஷிப்') ||
    lower.includes('புதுமைப் பெண்') ||
    lower.includes('புதுமை பெண்') ||
    lower.includes('छात्रवृत्ति') ||
    lower.includes('स्कॉलरशिप') ||
    lower.includes('படிப்பு உதவி');

  if (isScholarshipQuery) {
    if (isTamil) {
      return {
        text: `தமிழ்நாடு மற்றும் இந்திய அளவில் மாணவிகளுக்கான முக்கிய கல்வி உதவித்தொகை திட்டங்கள்:\n\n` +
          `1. **புதுமைப் பெண் திட்டம் (மூவலூர் ராமாமிர்தம் அம்மையார் திட்டம்):**\n` +
          `• தகுதி: 6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளிகளில் படித்து உயர்கல்வி (கல்லூரி, பாலிடெக்னிக், தொழிற்கல்வி) பயிலும் மாணவிகள்.\n` +
          `• உதவித்தொகை: கல்லூரிப் படிப்பு முடியும் வரை மாதந்தோறும் **₹1,000** வங்கிக் கணக்கில் நேரடியாக செலுத்தப்படுகிறது.\n` +
          `• விண்ணப்பிக்க: கல்லூரியில் உள்ள நோடல் அதிகாரியிடம் (Nodal Officer) அல்லது pudhumaipenn.tn.gov.in வழியாக விண்ணப்பிக்கலாம்.\n\n` +
          `2. **தமிழ்நாடு BC / MBC / DNC நலக் கல்வி உதவித்தொகை:**\n` +
          `• அரசு மற்றும் அரசு உதவிபெறும் கல்லூரிகளில் படிக்கும் மாணவிகளுக்கு கல்விக் கட்டண விலக்கு மற்றும் விடுதி உதவித்தொகை.\n\n` +
          `3. **SC / ST போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகை:**\n` +
          `• கல்லூரி மற்றும் தொழிற்கல்வி கட்டணங்கள் மற்றும் பராமரிப்பு கட்டணங்கள் 100% அரசு ஏற்றுக்கொள்கிறது.\n\n` +
          `4. **AICTE பிரகதி திட்டம் (Pragati Scholarship for Girls):**\n` +
          `• பொறியியல் (B.E/B.Tech) அல்லது டிப்ளமோ பயிலும் மாணவிகளுக்கு ஆண்டுக்கு ₹50,000 உதவித்தொகை (National Scholarship Portal: scholarships.gov.in).\n\n` +
          `உங்களுக்கு குறிப்பிட்ட ஏதேனும் ஒரு திட்டத்திற்கு தேவையான ஆவணங்கள் அல்லது விண்ணப்பிக்கும் முறை பற்றி அறிய வேண்டுமா?`,
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: `तमिलनाडु और भारत में छात्राओं व महिलाओं के लिए प्रमुख सरकारी छात्रवृत्तियां:\n\n` +
          `1. **पुधुमै पेन योजना (तमिलनाडु सरकार):**\n` +
          `• पात्रता: सरकारी स्कूलों (कक्षा 6 से 12) में पढ़ी छात्राएं जो कॉलेज या डिप्लोमा कर रही हैं।\n` +
          `• लाभ: स्नातक/डिप्लोमा पूरा होने तक प्रति माह **₹1,000** की सीधी बैंक सहायता।\n\n` +
          `2. **पोस्ट-मैट्रिक स्कॉलरशिप (BC/MBC/SC/ST):**\n` +
          `• उच्च शिक्षा, कॉलेज फीस और छात्रावास खर्च हेतु पूरी सरकारी सहायता।\n\n` +
          `3. **AICTE प्रगति स्कॉलरशिप (लड़कियों के लिए):**\n` +
          `• इंजीनियरिंग व तकनीकी डिप्लोमा छात्राओं हेतु प्रतिवर्ष ₹50,000 (scholarships.gov.in पर उपलब्ध)।\n\n` +
          `आवेदन के लिए आधार कार्ड, 10वीं/12वीं अंकपत्र, आय प्रमाण पत्र व कॉलेज बोनाफाइड सर्टिफिकेट आवश्यक हैं।`,
      };
    }
    return {
      text: `Key scholarships and financial aid schemes for women students in Tamil Nadu:\n\n` +
        `1. **Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme):**\n` +
        `• **Eligibility:** Girl students who studied from Class 6 to 12 in Tamil Nadu Government schools and enrolled in undergraduate degrees, polytechnic, or ITI.\n` +
        `• **Benefit:** **₹1,000 per month** directly credited into the student's bank account until completion of the course.\n` +
        `• **How to Apply:** Apply through your college scholarship nodal officer or the official portal: pudhumaipenn.tn.gov.in.\n\n` +
        `2. **Tamil Nadu Post-Matric Scholarship (SC / ST / SCC / SCA):**\n` +
        `• 100% compulsory tuition fee waiver and maintenance allowance for post-secondary education.\n\n` +
        `3. **BC / MBC / DNC Welfare Scholarships:**\n` +
        `• Tuition fee concessions and hostel stipends for women pursuing arts, science, engineering, or medical courses.\n\n` +
        `4. **AICTE Pragati Scholarship for Girls:**\n` +
        `• ₹50,000 per year for female students pursuing Technical Degrees (Engineering) or Diplomas (Apply at National Scholarship Portal: scholarships.gov.in).\n\n` +
        `**Key Documents Needed:** Student Aadhaar, 10th/12th Marksheets, Income Certificate, Community Certificate, and Bank Passbook. Would you like details on how to apply for any specific course?`,
    };
  }

  // 2. MATERNITY / PREGNANCY / PMMVY SCHEME
  const isMaternityQuery =
    lower.includes('pregnant') ||
    lower.includes('pregnancy') ||
    lower.includes('maternity') ||
    lower.includes('pmmvy') ||
    lower.includes('vandana') ||
    lower.includes('matru') ||
    lower.includes('baby') ||
    lower.includes('delivery') ||
    lower.includes('கர்ப்பிணி') ||
    lower.includes('மகப்பேறு') ||
    lower.includes('பிரசவம்') ||
    lower.includes('गर्भवती') ||
    lower.includes('मातृत्व') ||
    lower.includes('बच्चा');

  if (isMaternityQuery) {
    if (isTamil) {
      return {
        text: 'பிரதான் மந்திரி மாத்ரு வந்தனா திட்டம் (PMMVY) - கர்ப்பிணி பெண்கள் நிதி உதவி:\n\n• பயன்கள்: முதல் குழந்தைக்கு இரண்டு தவணைகளில் ₹5,000 நேரடி வங்கி நிதி. இரண்டாவது குழந்தை பெண் குழந்தையாக பிறந்தால் ஒரே தவணையில் ₹6,000 நிதி வழங்கப்படுகிறது.\n• தகுதி: 19 வயது நிரம்பிய கர்ப்பிணி மற்றும் பாலூட்டும் தாய்மார்கள் (அரசு ஊழியர்கள் தவிர்த்து).\n• தேவையான ஆவணங்கள்: தாய்-சேய் நல அட்டை (MCP Card / RCH ID), விண்ணப்பதாரர் பெண்ணின் ஆதார், கணவரின் ஆதார், பெண்ணின் சொந்த வங்கி பாஸ்புக் நகல்.\n• விண்ணப்பிக்கும் முறை: அருகிலுள்ள அங்கன்வாடி மையம் (AWC) அல்லது ஆரம்ப சுகாதார நிலைய ஆஷா பணியாளரிடம் படிவம் 1A சமர்ப்பிக்கவும், அல்லது pmmvy.wcd.gov.in மூலமும் விண்ணப்பிக்கலாம்.\n• உதவி எண்: 1800-11-6555 / 1098.',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'प्रधानमंत्री मातृ वंदना योजना (PMMVY) - गर्भवती महिलाओं के लिए सरकारी सहायता:\n\n• लाभ: पहले बच्चे के लिए दो किस्तों में ₹5,000 और दूसरी संतान बालिका (बेटी) होने पर ₹6,000 की सीधी नकद सहायता बैंक खाते (DBT) में दी जाती है।\n• पात्रता: 19 वर्ष या उससे अधिक आयु की गर्भवती व स्तनपान कराने वाली महिलाएं (सरकारी कर्मचारियों को छोड़कर)।\n• आवश्यक दस्तावेज: मातृ एवं बाल सुरक्षा (MCP) कार्ड, महिला का आधार कार्ड, पति का आधार कार्ड, महिला की आधार-लिंक्ड बैंक पासबुक।\n• आवेदन कैसे करें: अपने नजदीकी आंगनवाड़ी केंद्र या आशा दीदी से संपर्क करें, या सीधे आधिकारिक पोर्टल pmmvy.wcd.gov.in पर ऑनलाइन आवेदन करें।\n• हेल्पलाइन: 1800-11-6555 / 1098.',
      };
    }
    return {
      text: 'Pradhan Mantri Matru Vandana Yojana (PMMVY) - Maternity Benefit Scheme:\n\n• Benefits: ₹5,000 in two installments for the 1st child, and ₹6,000 in a single installment for the 2nd child (if a girl child), credited directly to the woman’s bank account (DBT).\n• Eligibility: Pregnant and lactating women aged 19+ (excluding regular government employees).\n• Required Documents: Mother & Child Protection (MCP) card, Applicant woman’s Aadhaar, Husband’s Aadhaar, and Bank Passbook (linked with Aadhaar).\n• How to Apply: Submit Form 1A at your nearest Anganwadi Centre (AWC) or health center, or apply online at pmmvy.wcd.gov.in.\n• Helpline: 1800-11-6555 / 1098.',
    };
  }

  // 3. DAUGHTER / GIRL CHILD SAVINGS / SUKANYA SAMRIDDHI
  const isSukanyaQuery =
    lower.includes('sukanya') ||
    lower.includes('daughter') ||
    lower.includes('girl child') ||
    lower.includes('girl savings') ||
    lower.includes('ssy') ||
    lower.includes('செல்வ மகள்') ||
    lower.includes('பெண் குழந்தை') ||
    lower.includes('सुकन्या') ||
    lower.includes('बेटी');

  if (isSukanyaQuery) {
    if (isTamil) {
      return {
        text: 'சுகன்யா சம்ரித்தி திட்டம் (செல்வ மகள் சேமிப்புத் திட்டம்):\n\n• பயன்கள்: மத்திய அரசு உத்தரவாதத்துடன் கூடிய 8.2% அதிக ஆண்டு கூட்டு வட்டி. சேமிப்பு தொகை, வட்டி மற்றும் முதிர்வு தொகை அனைத்தும் 100% வரி விலக்கு பெற்றவை (EEE அந்தஸ்து). ஆண்டிற்கு ₹250 முதல் சேமிக்கலாம்.\n• தகுதி: பிறந்தது முதல் 10 வயதுக்குட்பட்ட பெண் குழந்தைகள் (ஒரு குடும்பத்தில் அதிகபட்சம் 2 மகள்கள்).\n• தேவையான ஆவணங்கள்: பெண் குழந்தையின் பிறப்புச் சான்றிதழ், பெற்றோர்/காப்பாளரின் ஆதார் அட்டை மற்றும் பான் கார்டு, முகவரி சான்று மற்றும் பாஸ்போர்ட் அளவு புகைப்படங்கள்.\n• கணக்கு தொடங்குவது எப்படி: அருகிலுள்ள தபால் நிலையம் (Post Office) அல்லது தேசியமயமாக்கப்பட்ட வங்கிக் கிளையில் (SBI, Indian Bank, Canara Bank) செல்வ மகள் சேமிப்பு கணக்கு தொடங்கலாம்.\n• முதிர்வு காலம்: 21 ஆண்டுகள் (கல்லூரி படிப்பிற்காக 18 வயது முடிந்ததும் 50% தொகையை எடுக்கலாம்). உதவி எண்: 1800-266-6868.',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'सुकन्या समृद्धि योजना (SSY) - बेटियों के भविष्य व उच्च शिक्षा हेतु बचत योजना:\n\n• लाभ: भारत सरकार द्वारा 8.2% की उच्चतम वार्षिक चक्रवृद्धि ब्याज दर। जमा, ब्याज और परिपक्वता राशि पूर्णतः कर-मुक्त (Tax-Free)। प्रतिवर्ष न्यूनतम केवल ₹250 से शुरुआत कर सकते हैं।\n• पात्रता: जन्म से लेकर 10 वर्ष तक की आयु की बेटियाँ (एक परिवार में अधिकतम दो बेटियाँ)।\n• आवश्यक दस्तावेज: बेटी का जन्म प्रमाण पत्र, माता-पिता/अभिभावक का आधार कार्ड व पैन कार्ड, पते का प्रमाण, और पासपोर्ट साइज फोटो।\n• खाता कैसे खोलें: किसी भी नजदीकी डाकघर (Post Office) या अधिकृत सरकारी/निजी बैंक (SBI, PNB, आदि) में जाकर SSY खाता खोल सकते हैं।\n• आंशिक निकासी: 18 वर्ष की आयु पूरी होने पर कॉलेज/उच्च शिक्षा के लिए 50% तक राशि निकाली जा सकती है। हेल्पलाइन: 1800-266-6868.',
      };
    }
    return {
      text: 'Sukanya Samriddhi Yojana (SSY) - Girl Child Savings Scheme:\n\n• Benefits: Government-backed ~8.2% annual compound interest. Completely tax-free (EEE status). Start with as little as ₹250 per year (max ₹1.5 Lakh/year). 50% partial withdrawal allowed after age 18 for college education.\n• Eligibility: Girl child from birth up to age 10 (maximum 2 daughters per family).\n• Required Documents: Girl child’s Birth Certificate, Parent/Guardian Aadhaar and PAN Card, address proof, and photos.\n• How to Open: Open at any Post Office (India Post) or authorized commercial bank branch (SBI, PNB, Canara Bank, Indian Bank, etc.).\n• Helpline: 1800-266-6868.',
    };
  }

  // 4. BUSINESS LOAN / MICRO-ENTERPRISE / PM MUDRA
  const isMudraQuery =
    lower.includes('mudra') ||
    lower.includes('business loan') ||
    lower.includes('shop loan') ||
    lower.includes('small business') ||
    lower.includes('loan') ||
    lower.includes('tailoring') ||
    lower.includes('credit') ||
    lower.includes('self employment') ||
    lower.includes('shishu') ||
    lower.includes('kishore') ||
    lower.includes('tarun') ||
    lower.includes('கடன்') ||
    lower.includes('முத்ரா') ||
    lower.includes('தொழில் கடன்') ||
    lower.includes('தையல்') ||
    lower.includes('சுயதொழில்') ||
    lower.includes('लोन') ||
    lower.includes('मुद्रा') ||
    lower.includes('सिलाई') ||
    lower.includes('स्वरोजगार') ||
    lower.includes('ऋण');

  if (isMudraQuery) {
    if (isTamil) {
      return {
        text: 'பிரதம மந்திரி முத்ரா கடன் திட்டம் (PMMY) - மகளிர் தொழில் கடன்:\n\n• பயன்கள்: 100% பிணையில்லா (Collateral-Free) வணிகக் கடன். சொத்து அல்லது நகை அடமானம் தேவையில்லை. பெண்கள் மற்றும் சுயஉதவி குழுக்களுக்கு முன்னுரிமை.\n• மூன்று வகைகள்:\n  1. சிசு (Shishu): ₹50,000 வரை (தையல் கடை, சிறு மளிகை, உணவு கடை தொடங்க)\n  2. கிஷோர் (Kishore): ₹50,000 முதல் ₹5 லட்சம் வரை (தொழிலை விரிவுபடுத்த)\n  3. தருண் (Tarun): ₹5 லட்சம் முதல் ₹10 லட்சம் வரை\n• தேவையான ஆவணங்கள்: விண்ணப்பதாரர் ஆதார் அட்டை, பான் கார்டு, இருப்பிடச் சான்று, தொழில் திட்டம் அல்லது வாங்க வேண்டிய இயந்திரங்களின் விலை பட்டியல் (Quotation).\n• விண்ணப்பிக்கும் முறை: அருகிலுள்ள அரசு அல்லது வணிக வங்கிகள், கிராம வங்கிகள் (RRB) அல்லது udyamimitra.in தளம் வழியாக விண்ணப்பிக்கலாம்.\n• தேசிய உதவி எண்: 1800-180-1111.',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'प्रधानमंत्री मुद्रा योजना (PMMY) - महिला उद्यमियों हेतु बिना गारंटी ऋण:\n\n• लाभ: 100% संपार्श्विक-मुक्त (बिना किसी गारंटी या जमीन गिरवी रखे) ₹10 लाख तक का व्यवसाय ऋण। महिला उद्यमियों को विशेष प्राथमिकता।\n• ऋण की तीन श्रेणियां:\n  1. शिशु (Shishu): ₹50,000 तक (छोटा व्यवसाय, सिलाई केंद्र, दुकान आदि शुरू करने हेतु)\n  2. किशोर (Kishore): ₹50,000 से ₹5 लाख तक (व्यवसाय विस्तार हेतु)\n  3. तरुण (Tarun): ₹5 लाख से ₹10 लाख तक\n• आवश्यक दस्तावेज: आधार कार्ड, पैन कार्ड, निवास प्रमाण पत्र, व्यवसाय प्रस्ताव / मशीनों का कोटेशन, 6 माह का बैंक स्टेटमेंट।\n• आवेदन कैसे करें: अपने नजदीकी सरकारी या निजी बैंक, ग्रामीण बैंक (RRB) में जाकर मुद्रा फॉर्म भरें, या udyamimitra.in पर ऑनलाइन आवेदन करें।\n• राष्ट्रीय हेल्पलाइन: 1800-180-1111.',
      };
    }
    return {
      text: 'Pradhan Mantri Mudra Yojana (PMMY) - Collateral-Free Business Loans for Women:\n\n• Benefits: 100% collateral-free loans up to ₹10 Lakh. No property or gold guarantee required. Priority processing and Mudra Debit Card for women entrepreneurs.\n• Three Loan Tiers:\n  1. Shishu: Up to ₹50,000 (starting small shops, tailoring, food businesses, handicrafts)\n  2. Kishore: ₹50,000 to ₹5 Lakh (business expansion)\n  3. Tarun: ₹5 Lakh to ₹10 Lakh (scaling micro-enterprises)\n• Required Documents: Woman’s Aadhaar Card, PAN Card, residence proof, business estimate/quotation of items to purchase, and photo.\n• How to Apply: Visit any commercial bank, regional rural bank (RRB), or apply online at udyamimitra.in.\n• National Helpline: 1800-180-1111.',
    };
  }

  // 5. HEALTHCARE / AYUSHMAN BHARAT / HOSPITAL
  const isHealthcareQuery =
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
    lower.includes('इलाज') ||
    lower.includes('स्वास्थ्य');

  if (isHealthcareQuery) {
    if (isTamil) {
      return {
        text: 'ஆயுஷ்மான் பாரத் (PM-JAY) - ₹5 லட்சம் இலவச மருத்துவக் காப்பீடு:\n\n• பயன்கள்: தகுதியுள்ள ஏழை குடும்பங்களுக்கு ஆண்டுதோறும் ₹5,00,000 வரை அரசு மற்றும் தனியார் மருத்துவமனைகளில் இலவச பணமில்லா சிகிச்சை. 1,900+ அறுவை சிகிச்சைகள் மற்றும் மருந்துகள் அடங்கும்.\n• தகுதி: SECC பட்டியல் மற்றும் முன்னுரிமை குடும்ப அட்டை (BPL / Antyodaya Ration Card) பெற்ற குடும்பங்கள்.\n• தேவையான ஆவணங்கள்: குடும்ப அட்டை மற்றும் குடும்ப உறுப்பினர்கள் அனைவரின் ஆதார் அட்டை.\n• ஆயுஷ்மான் கார்டு பெறுவது எப்படி: beneficiary.nha.gov.in தளத்தில் உங்கள் பெயரை சரிபார்க்கவும் அல்லது அருகிலுள்ள அரசு மருத்துவமனை / இ-சேவை மையத்தில் (CSC) e-KYC முடித்து கோல்டன் கார்டு பெறலாம்.\n• கட்டணமில்லா உதவி எண்: 14555 / 1800-111-565.',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'आयुष्मान भारत (PM-JAY) - ₹5 लाख का मुफ्त स्वास्थ्य सुरक्षा कार्ड:\n\n• लाभ: प्रत्येक पात्र गरीब परिवार को देश के 27,000+ सरकारी व सूचीबद्ध निजी अस्पतालों में प्रतिवर्ष ₹5,00,000 तक का मुफ्त कैशलेस इलाज।\n• पात्रता: SECC सूची व प्राथमिकता राशन कार्ड (BPL / अंत्योदय) धारक परिवार। परिवार के सदस्यों की संख्या या आयु की कोई सीमा नहीं।\n• आवश्यक दस्तावेज: राशन कार्ड और परिवार के सभी सदस्यों का आधार कार्ड।\n• आयुष्मान कार्ड कैसे बनवाएं: beneficiary.nha.gov.in पर अपना नाम जांचें या नजदीकी सीएससी (CSC) केंद्र या सरकारी अस्पताल के आयुष्मान मित्र केंद्र पर जाकर e-KYC करवाएं और अपना गोल्डन कार्ड प्राप्त करें।\n• राष्ट्रीय हेल्पलाइन: 14555 / 1800-111-565.',
      };
    }
    return {
      text: 'Ayushman Bharat (PM-JAY) - ₹5 Lakh Cashless Health Cover:\n\n• Benefits: ₹5,00,000 free hospital treatment per family per year across 27,000+ empaneled government and private hospitals across India. Covers surgery, diagnostics, ICU, and medications.\n• Eligibility: Families identified through SECC criteria and Priority / Antyodaya Ration Cards.\n• Required Documents: Ration Card and Aadhaar cards of all family members.\n• How to Get Card: Check eligibility at beneficiary.nha.gov.in or visit any CSC centre or Government Hospital Ayushman Kiosk to get your Ayushman Golden Card.\n• Toll-Free Helpline: 14555 / 1800-111-565.',
    };
  }

  // 6. DOCUMENTS REQUIRED QUERY (Contextual)
  const isDocumentsQuery =
    lower.includes('document') ||
    lower.includes('documents') ||
    lower.includes('proof') ||
    lower.includes('paper') ||
    lower.includes('aadhaar') ||
    lower.includes('ration') ||
    lower.includes('passbook') ||
    lower.includes('दस्तावेज') ||
    lower.includes('दस्तावेज़') ||
    lower.includes('कागजात') ||
    lower.includes('ஆவணங்கள்') ||
    lower.includes('ஆவணம்') ||
    lower.includes('aavanam') ||
    lower.includes('dastavez') ||
    lower.includes('పత్రాలు');

  if (isDocumentsQuery) {
    if (fullConversationHistory.includes('pregnant') || fullConversationHistory.includes('maternity') || fullConversationHistory.includes('pmmvy')) {
      return {
        text: 'Documents required for Pradhan Mantri Matru Vandana Yojana (PMMVY Maternity Scheme):\n1. Mother and Child Protection (MCP) card\n2. Applicant Woman’s Aadhaar Card\n3. Husband’s Aadhaar Card\n4. Bank Passbook copy (linked to Aadhaar for DBT)\n5. Child Birth Certificate (for 2nd installment).',
      };
    }
    if (fullConversationHistory.includes('sukanya') || fullConversationHistory.includes('daughter')) {
      return {
        text: 'Documents required for Sukanya Samriddhi Yojana (Girl Child Savings):\n1. Girl child’s Birth Certificate (with name)\n2. Parent/Guardian’s Aadhaar Card and PAN Card\n3. Proof of Residence (Ration Card/Electricity bill)\n4. Passport-size photographs.',
      };
    }
    if (fullConversationHistory.includes('mudra') || fullConversationHistory.includes('loan')) {
      return {
        text: 'Documents required for PM Mudra Business Loan:\n1. Applicant’s Aadhaar Card and PAN Card\n2. Residence Proof (Ration Card/Voter ID)\n3. Business estimate proposal / Quotation of machinery or items to buy\n4. Passport-size photos (2 copies)\n5. Bank statement (last 6 months, if existing business).',
      };
    }
    // Default to PMUY documents
    if (isTamil) {
      return {
        text: 'பிரதம மந்திரி உஜ்வாலா 2.0 (PMUY) திட்டத்திற்கு தேவையான ஆவணங்கள்:\n1. குடும்ப அட்டை (Ration Card) அல்லது குடும்ப உறுப்பினர் சான்றிதழ்\n2. விண்ணப்பதாரர் பெண்ணின் ஆதார் அட்டை (வயது 18+)\n3. குடும்பத்தில் உள்ள வயது வந்த அனைவரின் ஆதார் நகல்கள்\n4. வங்கி கணக்கு புத்தக நகல் (மானியம் பெற ஆதார் இணைக்கப்பட்டது)\n5. பாஸ்போர்ட் அளவு புகைப்படம்\n\nபுலம்பெயர்ந்த தொழிலாளர்கள் முகவரி சான்றிதழ் இல்லாவிட்டாலும் சுய அறிவிப்பு (Self-declaration) மூலம் விண்ணப்பிக்கலாம்.',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना 2.0 (PMUY) के लिए आवश्यक दस्तावेज:\n1. राशन कार्ड (या परिवार संरचना प्रमाण पत्र)\n2. महिला आवेदक का आधार कार्ड (उम्र 18 वर्ष से अधिक)\n3. परिवार के सभी 18+ सदस्यों का आधार कार्ड\n4. बैंक पासबुक की प्रति (आधार से जुड़ी हुई, सब्सिडी हेतु)\n5. पासपोर्ट साइज फोटो\n\nप्रवासी परिवारों को स्थानीय पते के प्रमाण की आवश्यकता नहीं है, वे स्व-घोषणा पत्र देकर आवेदन कर सकते हैं।',
      };
    }
    return {
      text: 'Key documents required for PM Ujjwala Yojana 2.0 (PMUY):\n1. State Ration Card (or Family Composition Certificate)\n2. Applicant Woman’s Aadhaar Card (age 18+)\n3. Aadhaar copies of all adult (18+) family members\n4. Bank Passbook copy (Aadhaar-linked for DBT subsidies)\n5. Passport-size photograph\n\nMigrant families do not require local address proof; a self-declaration is accepted.',
    };
  }

  // 7. ELIGIBILITY QUERY
  const isEligibilityQuery =
    lower.includes('eligible') ||
    lower.includes('eligibility') ||
    lower.includes('criteria') ||
    lower.includes('who can') ||
    lower.includes('who is eligible') ||
    lower.includes('पात्रता') ||
    lower.includes('योग्यता') ||
    lower.includes('தகுதி') ||
    lower.includes('thakuthi') ||
    lower.includes('patrata');

  if (isEligibilityQuery) {
    if (isTamil) {
      return {
        text: 'பிரதம மந்திரி உஜ்வாலா 2.0 திட்டத்திற்கான தகுதிகள்:\n1. விண்ணப்பதாரர் 18 வயது நிரம்பிய பெண்ணாக இருக்க வேண்டும். ஆண்கள் விண்ணப்பிக்க முடியாது.\n2. குடும்பத்தில் வேறு எவருக்கும் ஏற்கனவே சமையல் எரிவாயு (LPG) இணைப்பு இருக்கக்கூடாது.\n3. ஏழை / முன்னுரிமை குடும்ப அட்டை (BPL / Priority Ration Card / SECC பட்டியல்) பெற்றிருக்க வேண்டும்.\n4. உஜ்வாலா 2.0-ல் புலம்பெயர்ந்த ஏழைப் பெண்களுக்கும் முகவரி சான்று இன்றி முன்னுரிமை உண்டு.',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना 2.0 के लिए पात्रता शर्तें:\n1. आवेदक केवल 18 वर्ष या उससे अधिक आयु की महिला होनी चाहिए। पुरुष आवेदन नहीं कर सकते।\n2. परिवार में किसी भी सदस्य के नाम पर पहले से कोई एलपीजी गैस कनेक्शन नहीं होना चाहिए।\n3. परिवार गरीब/वंचित श्रेणी (BPL, SECC, प्राथमिकता राशन कार्ड, अंत्योदय आदि) से संबंधित होना चाहिए।\n4. उज्ज्वला 2.0 में प्रवासी महिलाओं को स्थानीय राशन कार्ड या पते के प्रमाण के बिना भी कनेक्शन की सुविधा है।',
      };
    }
    return {
      text: 'Eligibility criteria for PM Ujjwala Yojana 2.0 (PMUY):\n1. The applicant MUST be an adult woman (age 18+). Men cannot apply.\n2. No existing LPG connection in the entire household.\n3. Must belong to a poor/deprived household (BPL, SECC, Antyodaya, or Priority Ration Card).\n4. Under Ujjwala 2.0, migrant women do not need local address proof; a self-declaration is accepted.',
    };
  }

  // 8. HOW TO APPLY QUERY
  const isApplyQuery =
    lower.includes('apply') ||
    lower.includes('how to apply') ||
    lower.includes('where to apply') ||
    lower.includes('application') ||
    lower.includes('register') ||
    lower.includes('steps') ||
    lower.includes('आवेदन') ||
    lower.includes('विண்ணப்பம்') ||
    lower.includes('विண்ணப்பிக்க') ||
    lower.includes('vinnappam') ||
    lower.includes('kaise apply');

  if (isApplyQuery) {
    if (isTamil) {
      return {
        text: 'உஜ்வாலா 2.0 திட்டத்திற்கு விண்ணப்பிக்கும் முறை:\n\n1. ஆஃப்லைன் முறை (எளிதானது):\nஅருகிலுள்ள LPG கேஸ் ஏஜென்சிக்கு (Indane, Bharat Gas, HP Gas) செல்லவும். ரேஷன் கார்டு, ஆதார், வங்கி பாஸ்புக் நகல்களுடன் உஜ்வாலா KYC படிவத்தை பூர்த்தி செய்து சமர்ப்பிக்கவும்.\n\n2. ஆன்லைன் முறை:\npmuy.gov.in என்ற அதிகாரப்பூர்வ இணையதளத்திற்கு சென்று "Apply for New Ujjwala 2.0 Connection" என்பதை தேர்வு செய்து விண்ணப்பிக்கலாம்.\n\nசரிபார்ப்பிற்கு பிறகு வைப்புத்தொகை இன்றி இலவச இணைப்பு, அடுப்பு மற்றும் முதல் சிலிண்டர் வழங்கப்படும்.',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना 2.0 में आवेदन करने की प्रक्रिया:\n\n1. ऑफलाइन तरीका (सबसे आसान):\nअपनी नजदीकी एलपीजी गैस एजेंसी (Indane, Bharat Gas या HP Gas) पर जाएं। वहां मुफ्त Ujjwala KYC फॉर्म भरें और राशन कार्ड, आधार कार्ड व बैंक पासबुक की फोटोकॉपी जमा करें।\n\n2. ऑनलाइन तरीका:\nआधिकारिक पोर्टल pmuy.gov.in पर जाएं, "Apply for New Ujjwala 2.0 Connection" पर क्लिक करें और अपनी पसंदीदा गैस कंपनी चुनकर आवेदन करें।\n\nसत्यापन के बाद बिना किसी सिक्योरिटी डिपॉजिट के नया कनेक्शन, चूल्हा व भरा सिलेंडर प्राप्त होगा।',
      };
    }
    return {
      text: 'How to apply for PM Ujjwala Yojana 2.0 (PMUY):\n\n1. Offline (Fastest & Simplest):\nVisit your nearest LPG distributor (Indane, Bharat Gas, or HP Gas). Fill the simplified Ujjwala KYC form and submit copies of your Ration Card, Aadhaar, Bank Passbook, and photo.\n\n2. Online Application:\nVisit the official government portal pmuy.gov.in, click "Apply for New Ujjwala 2.0 Connection", select your preferred distributor, and submit your details.\n\nOnce verified, you will receive a deposit-free gas connection with a free stove and first refill.',
    };
  }

  // 9. COST / FEE / SUBSIDY
  const isCostOrSubsidyQuery =
    lower.includes('free') ||
    lower.includes('cost') ||
    lower.includes('price') ||
    lower.includes('fee') ||
    lower.includes('subsidy') ||
    lower.includes('deposit') ||
    lower.includes('मुफ्त') ||
    lower.includes('फ्री') ||
    lower.includes('पैसे') ||
    lower.includes('இலவசம்') ||
    lower.includes('செலவு');

  if (isCostOrSubsidyQuery) {
    if (isTamil) {
      return {
        text: 'ஆம்! உஜ்வாலா 2.0 (PMUY) திட்டம் 100% வைப்புத்தொகை இல்லாத முற்றிலும் இலவச திட்டம்:\n\n• சிலிண்டர் மற்றும் ரெகுலேட்டருக்கான வைப்புத்தொகை: ₹0 (முழு இலவசம்)\n• முதல் முறை நிரப்பப்பட்ட 14.2 கிலோ எல்பிஜி சிலிண்டர்: ₹0 (இலவசம்)\n• உயர்தர எரிவாயு அடுப்பு (Stove & Safety Hose): ₹0 (இலவசம்)\n• எந்தவொரு கட்டணமும் விநியோகஸ்தருக்கு முன்பணமாக செலுத்த தேவையில்லை.\n• அடுத்தடுத்த சிலிண்டர் முன்பதிவுகளுக்கு மத்திய அரசின் நேரடி வங்கி மானியம் (DBT) கிடைக்கும்.',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'हाँ! प्रधानमंत्री उज्ज्वला योजना 2.0 पूरी तरह से 100% मुफ्त और डिपॉजिट-फ्री है:\n\n• सिलेंडर और रेगुलेटर की सिक्योरिटी डिपॉजिट: ₹0 (बिल्कुल मुफ्त)\n• पहला भरा हुआ 14.2 किलो गैस सिलेंडर: ₹0 (बिल्कुल मुफ्त)\n• प्रमाणित 2-बर्नर गैस चूल्हा और सुरक्षा पाइप: ₹0 (बिल्कुल मुफ्त)\n• आपको गैस एजेंसी को कोई भी अग्रिम शुल्क या पैसा नहीं देना होता है।\n• इसके बाद के सिलेंडर रिफिल पर भी सरकार द्वारा सीधे आपके बैंक खाते में सब्सिडी (DBT) दी जाती है।',
      };
    }
    return {
      text: 'Yes! PM Ujjwala Yojana 2.0 is 100% deposit-free and completely free at onboarding:\n\n• Security Deposit for Cylinder & Regulator: ₹0 (100% Free)\n• 1st Filled 14.2 kg LPG Cylinder: ₹0 (100% Free)\n• Certified 2-Burner Gas Stove (Hotplate) & Pipe: ₹0 (100% Free)\n• No upfront payment to the distributor.\n• Subsequent cylinder refills also receive direct government subsidies transferred directly to your bank account (DBT).',
    };
  }

  // 10. HELPLINES
  const isHelplineQuery =
    lower.includes('helpline') ||
    lower.includes('toll free') ||
    lower.includes('tollfree') ||
    lower.includes('phone') ||
    lower.includes('call') ||
    lower.includes('number') ||
    lower.includes('contact') ||
    lower.includes('emergency') ||
    lower.includes('हेल्पलाइन') ||
    lower.includes('टोल फ्री') ||
    lower.includes('उதவி எண்');

  if (isHelplineQuery) {
    return {
      text: 'Official Government Helplines for Women & Citizens:\n\n• 181: Women Helpline (24x7 emergency medical, legal, and counseling aid)\n• 1098: Childline (Child welfare & maternity support)\n• 1800-266-6696 / 1906: PM Ujjwala Yojana & 24x7 LPG Emergency Helpline\n• 14555: Ayushman Bharat National Health Helpline\n• 1800-11-6555: PMMVY Maternity Helpline\n• 1800-180-1111: PM Mudra Loan Helpline',
    };
  }

  // 11. GREETING / WHO ARE YOU
  const isGreetingQuery =
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower.startsWith('hi ') ||
    lower.startsWith('hello ') ||
    lower.includes('who are you') ||
    lower.includes('your name') ||
    lower.includes('what can you do') ||
    lower === 'saha' ||
    lower.includes('नमस्ते') ||
    lower.includes('வணக்கம்');

  if (isGreetingQuery) {
    if (isTamil) {
      return {
        text: 'வணக்கம்! நான் சஹா (Saha), இந்திய பெண்களுக்கான அரசு நலத்திட்ட வழிகாட்டி.\n\nஉஜ்வாலா 2.0 இலவச எரிவாயு, மாத்ரு வந்தனா கர்ப்பிணி உதவி (₹6,000), செல்வ மகள் சேமிப்பு (8.2%), முத்ரா தொழில் கடன் (₹10 லட்சம் வரை), ஆயுஷ்மான் மருத்துவ காப்பீடு (₹5 லட்சம்) போன்ற அனைத்து அரசு நலத்திட்டங்கள் பற்றியும் உங்களுக்கு வழிகாட்ட நான் தயாராக உள்ளேன். இன்று உங்களுக்கு என்ன தகவல் தேவை?',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'नमस्ते! मैं सहा (Saha) हूँ, महिलाओं और परिवारों के लिए सरकारी योजनाओं की आपकी एआई साथी।\n\nमैं प्रधानमंत्री उज्ज्वला योजना 2.0 (मुफ्त गैस), मातृ वंदना योजना (गर्भावस्था सहायता ₹6,000), सुकन्या समृद्धि योजना (8.2% ब्याज), मुद्रा महिला व्यापार ऋण (₹10 लाख तक), और आयुष्मान भारत (₹5 लाख मुफ्त इलाज) जैसी सभी प्रमुख योजनाओं की पूरी जानकारी दे सकती हूँ। आज आपको क्या जानकारी चाहिए?',
      };
    }
    return {
      text: 'Hello! I am Saha, your AI companion for Indian government welfare schemes and citizen benefits.\n\nI can help you understand eligibility, documents, and application steps for schemes including PM Ujjwala Yojana (free gas), Matru Vandana Yojana (maternity assistance), Sukanya Samriddhi (daughter savings), PM Mudra (business loans), and Ayushman Bharat (free healthcare). How can I assist you today?',
    };
  }

  // 12. GAS / PMUY DEFAULT
  const isGasQuery =
    lower.includes('gas') ||
    lower.includes('cylinder') ||
    lower.includes('stove') ||
    lower.includes('aduppu') ||
    lower.includes('chulha') ||
    lower.includes('ujjwala') ||
    lower.includes('pmuy') ||
    lower.includes('எரிவாயு') ||
    lower.includes('உஜ்வாலா') ||
    lower.includes('गैस') ||
    lower.includes('उज्ज्वला');

  if (isGasQuery) {
    if (isTamil) {
      return {
        text: `சமையல் எரிவாயு தேவைக்கு உங்களுக்கு கிடைக்கும் அரசு திட்டம்: **பிரதம மந்திரி உஜ்வாலா திட்டம் 2.0 (PMUY)**.\n\n` +
          `**திட்டத்தின் பயன்கள்:**\n` +
          `• 100% வைப்புத்தொகை இல்லாத (ரூ.0 டெபாசிட்) இலவச எல்பிஜி கேஸ் இணைப்பு.\n` +
          `• முதல் 14.2 கிலோ எல்பிஜி சிலிண்டர் ரீஃபில் முற்றிலும் இலவசம்.\n` +
          `• உயர்தர 2-பர்னர் எரிவாயு அடுப்பு (Gas Stove) மற்றும் பாதுகாப்பு குழாய் முற்றிலும் இலவசம்.\n` +
          `• வங்கி கணக்கில் நேரடி மானிய உதவி (DBT).\n\n` +
          `**அடிப்படை தகுதி (Basic Eligibility):**\n` +
          `1. விண்ணப்பதாரர் 18 வயது அல்லது அதற்கு மேற்பட்ட பெண்மணியாக இருக்க வேண்டும்.\n` +
          `2. ஏழை / நலிவடைந்த குடும்பங்களைச் சேர்ந்தவராக இருக்க வேண்டும் (BPL / அந்தியோதயா / முன்னுரிமை குடும்ப அட்டை).\n` +
          `3. குடும்பத்தில் வேறு எவருக்கும் ஏற்கனவே செயலில் உள்ள எல்பிஜி இணைப்பு இருக்கக்கூடாது.\n` +
          `4. புலம்பெயர்ந்த பெண்கள் உள்ளூர் முகவரி சான்று இன்றி எளிய சுய அறிவிப்பு மூலம் விண்ணப்பிக்கலாம்.\n\n` +
          `**தேவையான ஆவணங்கள் (Required Documents):**\n` +
          `1. குடும்ப அட்டை (Ration Card) அல்லது குடும்ப உறுப்பினர் சான்றிதழ்\n` +
          `2. விண்ணப்பதாரர் பெண்ணின் ஆதார் அட்டை\n` +
          `3. குடும்பத்தில் உள்ள 18+ வயதுடையோர் அனைவரின் ஆதார் நகல்கள்\n` +
          `4. ஆதார் இணைக்கப்பட்ட வங்கி கணக்கு புத்தக நகல் (Passbook)\n` +
          `5. பாஸ்போர்ட் அளவு புகைப்படம்\n\n` +
          `**விண்ணப்பிக்கும் முறை (Next Steps):**\n` +
          `1. அருகிலுள்ள எல்பிஜி கேஸ் ஏஜென்சியை (Indane, Bharat Gas, HP Gas) அணுகவும் அல்லது இணையத்தில் விண்ணப்பிக்கவும்.\n` +
          `2. இலவச உஜ்வாலா KYC படிவத்தை பூர்த்தி செய்து ஆவண நகல்களை சமர்ப்பிக்கவும்.\n` +
          `3. சரிபார்ப்பிற்கு பிறகு இலவச சிலிண்டர், ரெகுலேட்டர் மற்றும் இலவச அடுப்பைப் பெற்றுக்கொள்ளவும்.\n\n` +
          `**அதிகாரப்பூர்வ அரசு இணையதளம்:**\n` +
          `https://www.pmuy.gov.in\n` +
          `கட்டணமில்லா உதவி எண்: 1800-266-6696 / 1906`,
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: `रसोई गैस सहायता हेतु आपके लिए उपलब्ध सरकारी योजना: **प्रधानमंत्री उज्ज्वला योजना 2.0 (PMUY)**।\n\n` +
          `**योजना के लाभ:**\n` +
          `• 100% डिपॉजिट-फ्री (₹0 सुरक्षा राशि) नया एलपीजी गैस कनेक्शन।\n` +
          `• पहला भरा हुआ 14.2 किलोग्राम का सिलेंडर बिल्कुल मुफ्त।\n` +
          `• प्रमाणित 2-बर्नर गैस चूल्हा और सुरक्षा पाइप बिल्कुल मुफ्त।\n` +
          `• सीधे बैंक खाते में रिफिल सब्सिडी (DBT)।\n\n` +
          `**मूल पात्रता (Basic Eligibility):**\n` +
          `1. आवेदक अनिवार्य रूप से 18 वर्ष या उससे अधिक आयु की महिला होनी चाहिए।\n` +
          `2. गरीब/वंचित परिवार से संबंध हो (बीपीएल, अंत्योदय, या प्राथमिकता राशन कार्ड)।\n` +
          `3. घर में किसी भी सदस्य के नाम पर पहले से कोई एलपीजी गैस कनेक्शन नहीं होना चाहिए।\n` +
          `4. प्रवासी परिवारों को स्थानीय पते के प्रमाण की आवश्यकता नहीं है; स्व-घोषणा पत्र मान्य है।\n\n` +
          `**आवश्यक दस्तावेज (Required Documents):**\n` +
          `1. राशन कार्ड (या परिवार संरचना प्रमाण पत्र)\n` +
          `2. महिला आवेदक का आधार कार्ड\n` +
          `3. परिवार के सभी वयस्क (18+) सदस्यों का आधार कार्ड\n` +
          `4. बैंक पासबुक (आधार से लिंक, सब्सिडी हेतु)\n` +
          `5. पासपोर्ट साइज फोटो\n\n` +
          `**आवेदन के अगले कदम (Next Steps):**\n` +
          `1. अपनी नजदीकी गैस एजेंसी (Indane, Bharat Gas, HP Gas) पर जाएं या ऑनलाइन आवेदन करें।\n` +
          `2. मुफ्त उज्ज्वला 2.0 KYC फॉर्म भरें और दस्तावेजों की फोटोकॉपी जमा करें।\n` +
          `3. सत्यापन के बाद बिना किसी शुल्क के नया कनेक्शन, चूल्हा व सिलेंडर प्राप्त करें।\n\n` +
          `**आधिकारिक सरकारी पोर्टल:**\n` +
          `https://www.pmuy.gov.in\n` +
          `टोल-फ्री हेल्पलाइन: 1800-266-6696 / 1906`,
      };
    }
    return {
      text: `Based on your need for a cooking gas connection, the verified government resource for you is **Pradhan Mantri Ujjwala Yojana (PMUY 2.0)**.\n\n` +
        `**What it provides:**\n` +
        `• 100% Deposit-Free LPG gas connection (₹0 security deposit for cylinder and regulator).\n` +
        `• First filled 14.2 kg LPG cylinder refill provided completely free.\n` +
        `• Certified high-efficiency 2-burner gas stove (hotplate) and Suraksha safety pipe provided 100% free.\n` +
        `• Direct Benefit Transfer (DBT) subsidy support directly to your bank account.\n\n` +
        `**Basic Eligibility:**\n` +
        `1. The applicant MUST be an adult woman aged 18 years or older.\n` +
        `2. Must belong to an economically deprived household (BPL, Antyodaya Anna Yojana, or Priority Ration Card).\n` +
        `3. No one in the applicant’s entire household must have an active LPG connection with any gas company.\n` +
        `4. Migrant workers do not need local ration cards or local address proof; a simple self-declaration is accepted.\n\n` +
        `**Required Documents:**\n` +
        `1. State Ration Card (or Family Composition Certificate confirming family members)\n` +
        `2. Aadhaar Card of the applicant woman\n` +
        `3. Aadhaar copies of all adult (18+) family members living in the household\n` +
        `4. Bank Account Passbook (linked with Aadhaar for DBT subsidies)\n` +
        `5. Passport-size photograph\n\n` +
        `**Next Steps to Apply:**\n` +
        `1. Visit your nearest LPG distributor (Indane, Bharat Gas, or HP Gas) OR apply online.\n` +
        `2. Fill the simplified Ujjwala 2.0 KYC form (free of cost at distributor).\n` +
        `3. Submit photocopies of your Ration Card, Aadhaar, and Bank Passbook.\n` +
        `4. After verification, collect your deposit-free cylinder, regulator, and free stove at zero cost.\n\n` +
        `**Official Government Portal:**\n` +
        `https://www.pmuy.gov.in\n` +
        `Toll-Free Helpline: 1800-266-6696 / 1906`,
    };
  }

  // 13. GENERAL FALLBACK
  if (isTamil) {
    return {
      text: 'பெண்கள் மற்றும் குடும்பங்களுக்கான அரசு நலத்திட்டங்கள் (உஜ்வாலா 2.0 இலவச எரிவாயு, மாத்ரு வந்தனா கர்ப்பிணி உதவி, செல்வ மகள் சேமிப்பு, முத்ரா மகளிர் கடன், ஆயுஷ்மான் மருத்துவ காப்பீடு) பற்றி உங்களுக்கு வழிகாட்ட நான் தயாராக உள்ளேன். உங்களுக்கு என்ன உதவி அல்லது தகவல் வேண்டும்?',
    };
  }
  if (isHindi || isDevanagari) {
    return {
      text: 'मैं महिलाओं और गरीब परिवारों के लिए सरकारी योजनाओं (उज्ज्वला योजना, मातृत्व वंदना योजना, सुकन्या समृद्धि, मुद्रा ऋण, व आयुष्मान भारत) की जानकारी देने में आपकी पूरी सहायता करूँगी। आपको किस योजना की पात्रता, दस्तावेज या आवेदन प्रक्रिया के बारे में जानना है?',
    };
  }
  return {
    text: 'I can help you understand and apply for government welfare schemes for women and families across India, including PM Ujjwala Yojana 2.0 (free gas connection), Matru Vandana Yojana (maternity support), Sukanya Samriddhi (girl child savings), PM Mudra (business loans), and Ayushman Bharat (free hospital care). What scheme or guidance are you looking for today?',
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await handleChatRequest(req.body);
    return res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error: message });
  }
}
