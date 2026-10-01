import { GoogleGenAI } from '@google/genai';

const SAHA_SYSTEM_INSTRUCTION = `
You are "Saha", an empathetic, respectful, and accessible AI citizen companion designed to help women across all of India understand and access government schemes, services, and opportunities independently.

MULTILINGUAL CAPABILITIES (CORE PRINCIPLE):
- Saha is built for all of India. You MUST NOT treat English or Tamil as default.
- Automatically identify the user's language (typed or spoken) and reply in that EXACT same language and script.
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
- The user may ask short follow-up questions (e.g., "Gas connection", "What documents?", "How to apply?", "ஆவணங்கள் என்ன?", "दस्तावेज क्या हैं?").
- Always connect follow-up questions to the ongoing conversation topic. For example, if the user previously asked for government help and now says "Gas connection", understand that they are looking for government gas assistance (PM Ujjwala Yojana).

STRICT GROUNDING & ACCURACY RULES:
- DO NOT invent or fabricate scheme eligibility criteria, document requirements, application procedures, or official links.
- For Pradhan Mantri Ujjwala Yojana (PMUY 2.0), use ONLY these verified facts:
  • Eligibility: Adult woman (age 18+), from a poor/deprived household (BPL/SECC/priority ration card), NO existing LPG connection in the household.
  • Benefits: 100% deposit-free LPG gas connection, 1st cylinder refill completely free, free gas stove (hotplate) & safety hose pipe.
  • Required Documents: State Ration Card / family composition certificate, Applicant woman's Aadhaar Card, Bank passbook copy, Aadhaar of adult family members.
  • How to Apply: Visit nearest LPG distributor (Indane, Bharat Gas, HP Gas) with KYC form, or online via verified portal pmuy.gov.in.
  • Toll-Free Helpline: 1800-266-6696 or 1906.
- For other schemes or unverified queries, provide helpful general guidance and clearly indicate when verified government confirmation is required. Never provide fake or unverified links.
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

  // 1. If GEMINI_API_KEY is available, use Gemini 2.5 Flash for multimodal multilingual intelligence
  if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Handle multimodal audio recording directly
      if (audio && audio.data) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
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
      }

      // Standard multi-turn conversation with memory
      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text || m.content || '' }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: SAHA_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      if (response.text) {
        return { text: response.text };
      }
    } catch (geminiError: unknown) {
      console.warn('Gemini API request failed, falling back to intelligent offline multilingual handler:', geminiError);
      // Graceful fallback to offline multilingual dataset if API key quota/network fails
    }
  }

  // 2. Intelligent multilingual fallback when API key is not yet set or during network failure
  const fullConversationHistory = messages
    ? messages.map((m: any) => (m.text || m.content || '')).join(' ').toLowerCase()
    : '';

  const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1] : null;
  const lastMessage = lastMsg ? (lastMsg.text || (lastMsg as any).content || '') : '';
  const text = lastMessage.trim();
  const lower = text.toLowerCase();

  // Multi-script detection
  const isTelugu = /[\u0C00-\u0C7F]/.test(text);
  const isBengali = /[\u0980-\u09FF]/.test(text);
  const isKannada = /[\u0C80-\u0CFF]/.test(text);
  const isMalayalam = /[\u0D00-\u0D7F]/.test(text);
  const isGujarati = /[\u0A80-\u0AFF]/.test(text);
  const isTamil = /[\u0B80-\u0BFF]/.test(text);
  const isPunjabi = /[\u0A00-\u0A7F]/.test(text);
  const isOdia = /[\u0B00-\u0B7F]/.test(text);
  const isUrdu = /[\u0600-\u06FF]/.test(text);
  const isDevanagari = /[\u0900-\u097F]/.test(text); // Hindi, Marathi

  // Follow-up context handling (multi-turn conversation memory)
  const isOngoingGasTopic =
    fullConversationHistory.includes('gas') ||
    fullConversationHistory.includes('cylinder') ||
    fullConversationHistory.includes('ujjwala') ||
    fullConversationHistory.includes('pmuy') ||
    fullConversationHistory.includes('गैस') ||
    fullConversationHistory.includes('எரிவாயு');

  const isDocumentFollowUp =
    isOngoingGasTopic &&
    (lower.includes('document') ||
      lower.includes('documents') ||
      lower.includes('aadhaar') ||
      lower.includes('ration') ||
      lower.includes('kaagaz') ||
      lower.includes('aavanam') ||
      lower.includes('दस्तावेज') ||
      lower.includes('ஆவணங்கள்'));

  if (isDocumentFollowUp) {
    if (isTamil) {
      return {
        text: 'பிரதம மந்திரி உஜ்வாலா திட்டத்திற்கு (PMUY 2.0) தேவையான ஆவணங்கள்:\n1. குடும்ப அட்டை (Ration Card) அல்லது குடும்ப உறுப்பினர் சான்றிதழ்\n2. விண்ணப்பதாரர் பெண்ணின் ஆதார் அட்டை\n3. குடும்பத்தில் உள்ள வயது வந்தோரின் ஆதார் நகல்கள்\n4. வங்கி கணக்கு புத்தக நகல் (Bank Passbook)\n5. பாஸ்போர்ட் அளவு புகைப்படம்',
      };
    }
    if (isDevanagari) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना 2.0 के लिए आवश्यक दस्तावेज:\n1. राशन कार्ड (या परिवार संरचना प्रमाण पत्र)\n2. महिला आवेदक का आधार कार्ड\n3. परिवार के सभी 18+ सदस्यों का आधार कार्ड\n4. बैंक पासबुक की फोटोकॉपी (सब्सिडी हेतु)\n5. पासपोर्ट साइज फोटो',
      };
    }
    if (lower.includes('venum') || lower.includes('theva')) {
      return {
        text: 'Ujjwala 2.0 gas connection-ku thevaiyana documents:\n1. Ration Card\n2. Vinnappadharar pennin Aadhaar Card\n3. Kudumbathu periyavanga ellaroda Aadhaar copy\n4. Bank Passbook copy\n5. Passport size photo',
      };
    }
    return {
      text: 'Key documents required for PM Ujjwala Yojana (PMUY 2.0):\n1. State Ration Card (or Family Composition Certificate)\n2. Applicant Woman’s Aadhaar Card\n3. Aadhaar copies of all adult family members\n4. Bank Passbook copy (linked to Aadhaar)\n5. Passport-size photograph',
    };
  }

  // (A) Gas / Cylinder / Stove / PMUY Queries
  const isGasQuery =
    lower.includes('gas') ||
    lower.includes('cylinder') ||
    lower.includes('stove') ||
    lower.includes('aduppu') ||
    lower.includes('chulha') ||
    lower.includes('ujjwala') ||
    lower.includes('pmuy') ||
    lower.includes('எரிவாயு') ||
    lower.includes('गैस') ||
    lower.includes('ಗ್ಯಾಸ್') ||
    lower.includes('గ్యాస్') ||
    lower.includes('গ্যাস');

  if (isGasQuery) {
    if (isTelugu) {
      return {
        text: 'ప్రధాన మంత్రి ఉజ్వల యోజన (Ujjwala 2.0) ద్వారా అర్హులైన పేద కుటుంబాల మహిళలకు డిపాజిట్ లేని ఉచిత గ్యాస్ కనెక్షన్, మొదటి సిలిండర్ మరియు ఉచిత పొయ్యి ఇవ్వబడుతుంది.\n\nకావలసిన పత్రాలు:\n1. రేషన్ కార్డు\n2. ఆధార్ కార్డు\n3. బ్యాంక్ పాస్‌బుక్\n\nదరఖాస్తు విధానం: సమీపంలోని గ్యాస్ ఏజెన్సీ (ఇండేన్, భారత్, హెచ్‌పి) వద్ద లేదా pmuy.gov.in ద్వారా దరఖాస్తు చేసుకోవచ్చు.',
      };
    }
    if (isBengali) {
      return {
        text: 'প্রধানমন্ত্রী উজ্জ্বলা যোজনা (Ujjwala 2.0)-এর মাধ্যমে দরিদ্র পরিবারের যোগ্য মহিলাদের বিনামূল্যে নতুন গ্যাস সংযোগ, প্রথম সিলিন্ডার এবং গ্যাস ওভেন দেওয়া হয়।\n\nপ্রয়োজনীয় নথি:\n1. রেশন কার্ড\n2. আধার কার্ড\n3. ব্যাঙ্ক পাসবুক\n\nনিকটবর্তী গ্যাস এজেন্সিতে গিয়ে অথবা pmuy.gov.in-এর মাধ্যমে আবেদন করতে পারেন।',
      };
    }
    if (isKannada) {
      return {
        text: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಉಜ್ವಲ ಯೋಜನೆ (Ujjwala 2.0) ಅಡಿಯಲ್ಲಿ ಬಡ ಕುಟುಂಬಗಳ ಮಹಿಳೆಯರಿಗೆ ಠೇವಣಿ ರಹಿತ ಉಚಿತ ಗ್ಯಾಸ್ ಸಂಪರ್ಕ, ಮೊದಲ ಸಿಲಿಂಡರ್ ಮತ್ತು ಉಚಿತ ಸ್ಟೌವ್ ನೀಡಲಾಗುತ್ತದೆ.\n\nಅಗತ್ಯ ದಾಖಲೆಗಳು:\n1. ರೇಷನ್ ಕಾರ್ಡ್\n2. ಆಧಾರ್ ಕಾರ್ಡ್\n3. ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್\n\nಹತ್ತಿರದ ಗ್ಯಾಸ್ ಏಜೆನ್ಸಿಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ pmuy.gov.in ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.',
      };
    }
    if (isMalayalam) {
      return {
        text: 'പ്രധാനമന്ത്രി ഉജ്ജ്വല യോജന (Ujjwala 2.0) വഴി അർഹരായ സ്ത്രീകൾക്ക് സൗജന്യ ഗ്യാസ് കണക്ഷൻ, ആദ്യ സിലിണ്ടർ, സൗജന്യ അടുപ്പ് എന്നിവ ലഭിക്കും.\n\nആവശ്യമായ രേഖകൾ:\n1. റേഷൻ കാർഡ്\n2. ആധార్ കാർഡ്\n3. ബാങ്ക് പാസ്ബുക്ക്\n\nഅടുത്തുള്ള ഗ്യാസ് ഏജൻസിയിലോ pmuy.gov.in വഴിയോ അപേക്ഷിക്കാം.',
      };
    }
    if (isGujarati) {
      return {
        text: 'પ્રધાનમંત્રી ઉજ્જવલા યોજના (Ujjwala 2.0) હેઠળ ગરીબ પરિવારોની મહિલાઓને ડિપોઝિટ વિના મફત ગેસ કનેક્શન, પહેલો સિલિન્ડર અને મફત ચૂલો આપવામાં આવે છે.\n\nજરૂરી દસ્તાવેજો:\n1. રેશન કાર્ડ\n2. આધાર કાર્ડ\n3. બેંક પાસબુક\n\nનજીકની ગેસ એજન્સી અથવા pmuy.gov.in દ્વારા અરજી કરી શકાય છે.',
      };
    }
    if (isTamil) {
      return {
        text: 'பிரதம மந்திரி உஜ்வாலா திட்டம் (Ujjwala 2.0) மூலம் ஏழை குடும்பங்களின் பெண்களுக்கு இலவச புதிய சமையல் எரிவாயு இணைப்பு, இலவச முதல் சிலிண்டர் மற்றும் இலவச அடுப்பு வழங்கப்படுகிறது.\n\nதேவையான ஆவணங்கள்: குடும்ப அட்டை, ஆதார் அட்டை, வங்கி பாஸ்புக்.\nவிண்ணப்பிக்க அருகிலுள்ள கேஸ் ஏஜென்சியை அணுகலாம் அல்லது pmuy.gov.in மூலம் விண்ணப்பிக்கலாம்.',
      };
    }
    if (isOdia) {
      return {
        text: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ଉଜ୍ଜ୍ୱଳା ଯୋଜନା (Ujjwala 2.0) ଅଧୀନରେ ଗରିବ ପରିବାରର ମହିଳାମାନଙ୍କୁ ମାଗଣା ଗ୍ୟାସ ସଂଯୋଗ, ପ୍ରଥମ ସିଲିଣ୍ଡର ଏବଂ ଚୁଲି ପ୍ରଦାନ କରାଯାଏ।\n\nଆବଶ୍ୟକୀୟ କାଗଜପତ୍ର: ରାସନ କାର୍ଡ, ଆଧାର କାର୍ଡ ଏବଂ ବ୍ୟାଙ୍କ ପାସବୁକ।\n\npmuy.gov.in ବା ନିକଟସ୍ଥ ଗ୍ୟାସ ଏଜେନ୍ସିରେ ଆବେଦନ କରିପାରିବେ।',
      };
    }
    if (isPunjabi) {
      return {
        text: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਉੱਜਵਲਾ ਯੋਜਨਾ (Ujjwala 2.0) ਅਧੀਨ ਗਰੀਬ ਪਰਿਵਾਰਾਂ ਦੀਆਂ ਔਰਤਾਂ ਨੂੰ ਮੁਫ਼ਤ ਗੈਸ ਕੁਨੈਕਸ਼ਨ, ਪਹਿਲਾ ਸਿਲੰਡਰ ਅਤੇ ਮੁਫ਼ਤ ਚੁੱਲ੍ਹਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।\n\nਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼: ਰਾਸ਼ਨ ਕਾਰਡ, ਆਧਾਰ ਕਾਰਡ, ਬੈਂਕ ਪਾਸਬੁੱਕ।\n\npmuy.gov.in ਜਾਂ ਨਜ਼ਦੀਕੀ ਗੈਸ ਏਜੰਸੀ ਰਾਹੀਂ ਅਰਜ਼ੀ ਦੇ ਸਕਦੇ ਹੋ।',
      };
    }
    if (isUrdu) {
      return {
        text: 'وزیر اعظم اجولا یوجنا (Ujjwala 2.0) کے تحت غریب خاندانوں کی خواتین کو مفت گیس کنکشن، پہلا بھرا ہوا سلنڈر اور مفت چولہا دیا جاتا ہے۔\n\nضروری دستاویزات: راشن کارڈ، آدھار کارڈ، بینک پاس بک۔\n\nقریبی گیس ایجنسی یا pmuy.gov.in کے ذریعے درخواست دی جا سکتی ہے۔',
      };
    }
    if (isDevanagari) {
      if (/\b(आहे|नाही|करा|झाले|पाहिजे|मिळेल|माहिती)\b/.test(text)) {
        return {
          text: 'प्रधानमंत्री उज्ज्वला योजना (Ujjwala 2.0) अंतर्गत गरीब कुटुंबांतील महिलांना मोफत एलपीजी गॅस जोडणी, पहिला सिलिंडर आणि मोफत शेगडी दिली जाते.\n\nआवश्यक कागदपत्रे: रेशन कार्ड, महिलेचे आधार कार्ड, बँक पासबुक.\n\nअर्ज कसा करावा: जवळच्या गॅस एजन्सीला भेट द्या किंवा pmuy.gov.in वर ऑनलाइन अर्ज करा.',
        };
      }
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना (Ujjwala 2.0) के तहत गरीब परिवारों की वयस्क महिलाओं को मुफ्त एलपीजी गैस कनेक्शन, पहला भरा हुआ सिलेंडर और चूल्हा दिया जाता है।\n\nआवश्यक दस्तावेज:\n1. राशन कार्ड\n2. महिला का आधार कार्ड\n3. बैंक पासबुक\n\nआवेदन कैसे करें: अपनी नजदीकी गैस एजेंसी (Indane, Bharat, HP) पर जाएं या pmuy.gov.in पर ऑनलाइन आवेदन करें।',
      };
    }
    // Tanglish / Romanized
    if (lower.includes('venum') || lower.includes('epdi') || lower.includes('theva') || lower.includes('solunga')) {
      return {
        text: 'Pradhan Mantri Ujjwala Yojana (Ujjwala 2.0) moolama eliya kudumbathu pengalukku deposit-illaatha free LPG gas connection, free first cylinder and free gas stove kedaikkum.\n\nThevaiyana documents: Ration Card, Aadhaar Card, Bank passbook copy.\n\nApply panna pakkathula irukkura gas agency (Indane, Bharat, HP)-la apply panlaam, illana pmuy.gov.in portal-la apply panlaam.',
      };
    }
    // Hinglish
    if (lower.includes('chahiye') || lower.includes('kaise') || lower.includes('mil') || lower.includes('batao')) {
      return {
        text: 'PM Ujjwala Yojana (Ujjwala 2.0) ke tehat zarooratmand parivaron ki mahilaon ko free gas connection, pehla bhara cylinder aur chulha milta hai.\n\nZaroori documents: Ration Card, Aadhaar Card, Bank Passbook.\n\nAap apni nearest gas agency ya pmuy.gov.in se apply kar sakte hain.',
      };
    }
    return {
      text: 'Under PM Ujjwala Yojana (Ujjwala 2.0), eligible adult women from poor households receive a deposit-free LPG gas connection, a free stove, and the first cylinder refill free.\n\nKey documents: Ration Card, Aadhaar Card, and Bank Passbook.\n\nYou can apply at your nearest LPG distributor or online at pmuy.gov.in.',
    };
  }

  // (B) Hindi / Hinglish Request or Devanagari Hindi Text
  const isHindiTrigger =
    (isDevanagari && !/\b(आहे|नाही|करा|झाले|पाहिजे|मिळेल|माहिती)\b/.test(text)) ||
    lower.includes('hindi') ||
    lower.includes('hindu') ||
    lower.includes('namaste') ||
    lower.includes('kya ') ||
    lower.includes('kaise') ||
    lower.includes('kaun') ||
    lower.includes('batao') ||
    lower.includes('madad') ||
    lower.includes('mujhe') ||
    lower.includes('aapka') ||
    lower.includes('tum ') ||
    lower.includes('bolo') ||
    lower.includes('baat');

  if (isHindiTrigger) {
    return {
      text: 'नमस्ते! मैं सहा (Saha) हूँ। आप मुझसे हिंदी में बात कर सकती हैं।\n\nमैं महिलाओं के लिए सरकारी योजनाओं (जैसे उज्ज्वला योजना 2.0 मुफ्त गैस कनेक्शन), उनके अधिकारों और आवश्यक दस्तावेजों के बारे में आपकी पूरी सहायता करूँगी। आज आपको क्या जानकारी चाहिए?',
    };
  }

  // (C) Tamil / Tanglish Request or Tamil Text
  const isTamilTrigger =
    isTamil ||
    lower.includes('tamil') ||
    lower.includes('tamizh') ||
    lower.includes('vanakkam') ||
    lower.includes('epdi') ||
    lower.includes('enna') ||
    lower.includes('solunga') ||
    lower.includes('theva') ||
    lower.includes('udhavi') ||
    lower.includes('kekkalaam') ||
    lower.includes('pesu');

  if (isTamilTrigger) {
    return {
      text: 'வணக்கம்! நான் சஹா (Saha). நீங்கள் என்னிடம் தமிழில் பேசலாம்.\n\nபெண்களுக்கான அரசு நலத்திட்டங்கள் (உஜ்வாலா 2.0 இலவச எரிவாயு இணைப்பு போன்றவை), தகுதிகள் மற்றும் ஆவணங்கள் பற்றி உங்களுக்கு வழிகாட்ட நான் தயாராக உள்ளேன். இன்று உங்களுக்கு என்ன உதவி வேண்டும்?',
    };
  }

  // (D) Telugu Request or Telugu Text
  const isTeluguTrigger =
    isTelugu ||
    lower.includes('telugu') ||
    lower.includes('namaskaram') ||
    lower.includes('cheppandi') ||
    lower.includes('bagunnara');

  if (isTeluguTrigger) {
    return {
      text: 'నమస్కారం! నేను సహా (Saha). మీరు నాతో తెలుగులో మాట్లాడవచ్చు.\n\nప్రభుత్వ సంక్షేమ పథకాలు (ఉజ్వల యోజన 2.0 ఉచిత గ్యాస్ కనెక్షన్ వంటివి) మరియు మహిళా సాధికారత సేవల గురించి తెలుసుకోవడానికి నేను మీకు సహాయం చేస్తాను. ఈరోజు మీకు ఎలాంటి సహాయం కావాలి?',
    };
  }

  // (E) Bengali Request or Bengali Text
  const isBengaliTrigger =
    isBengali ||
    lower.includes('bengali') ||
    lower.includes('bangla') ||
    lower.includes('nomoshkar') ||
    lower.includes('kemon');

  if (isBengaliTrigger) {
    return {
      text: 'নমস্কার! আমি সাহা (Saha)। আপনি আমার সাথে বাংলায় কথা বলতে পারেন।\n\nসরকারি প্রকল্প (যেমন উজ্জ্বলা যোজনা 2.0 বিনামূল্যে গ্যাস সংযোগ) এবং নারীদের সহায়তার বিষয়ে আমি আপনাকে সম্পূর্ণ গাইড করতে পারি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
    };
  }

  // (F) Marathi Request or Marathi Text
  const isMarathiTrigger =
    (isDevanagari && /\b(आहे|नाही|करा|झाले|पाहिजे|मिळेल|माहिती)\b/.test(text)) ||
    lower.includes('marathi') ||
    lower.includes('namaskar') ||
    lower.includes('kasa') ||
    lower.includes('sang');

  if (isMarathiTrigger) {
    return {
      text: 'नमस्कार! मी सहा (Saha) आहे. तुम्ही माझ्याशी मराठीत बोलू शकता.\n\nशासकीय योजना (जसे की प्रधानमंत्री उज्ज्वला योजना 2.0 मोफत गॅस जोडणी) आणि महिलांसाठीच्या लाभांबद्दल माहिती मिळवण्यासाठी मी तुम्हाला मदत करू शकते. आज मी तुम्हाला काय मदत करू?',
    };
  }

  // (G) Gujarati Request or Gujarati Text
  const isGujaratiTrigger =
    isGujarati ||
    lower.includes('gujarati') ||
    lower.includes('kem cho');

  if (isGujaratiTrigger) {
    return {
      text: 'નમસ્તે! હું સહા (Saha) છું. તમે મારી સાથે ગુજરાતીમાં વાત કરી શકો છો.\n\nસરકારી કલ્યાણકારી યોજનાઓ (જેમ કે પ્રધાનમંત્રી ઉજ્જવલા યોજના 2.0) અને મહિલા સહાય વિશે માહિતી મેળવવામાં હું તમને મદદ કરી શકું છું. આજે તમને શી માહિતી જોઈએ છે?',
    };
  }

  // (H) Kannada Request or Kannada Text
  const isKannadaTrigger =
    isKannada ||
    lower.includes('kannada') ||
    lower.includes('namaskara') ||
    lower.includes('heli');

  if (isKannadaTrigger) {
    return {
      text: 'ನಮಸ್ಕಾರ! ನಾನು ಸಹಾ (Saha). ನೀವು ನನ್ನೊಂದಿಗೆ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಹುದು.\n\nಸರ್ಕಾರದ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು (ಉದಾಹರಣೆಗೆ ಉಜ್ವಲ ಯೋಜನೆ 2.0) ಮತ್ತು ಮಹಿಳಾ ಕಲ್ಯಾಣ ಸೇವೆಗಳ ಬಗ್ಗೆ ತಿಳಿಯಲು ನಾನು ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತೇನೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
    };
  }

  // (I) Malayalam Request or Malayalam Text
  const isMalayalamTrigger =
    isMalayalam ||
    lower.includes('malayalam') ||
    lower.includes('parayu');

  if (isMalayalamTrigger) {
    return {
      text: 'നമസ്കാരം! ഞാൻ സഹ (Saha). നിങ്ങൾക്ക് എന്നോട് മലയാളത്തിൽ സംസാരിക്കാം.\n\nസ്ത്രീ ശാക്തീകരണ പദ്ധതികളെക്കുറിച്ചും സർക്കാർ ആനുകൂല്യങ്ങളെക്കുറിച്ചും (ഉജ്ജ്വല യോജന 2.0 പോലുള്ളവ) ഞാൻ നിങ്ങളെ സഹായിക്കാം. ഇന്ന് നിങ്ങൾക്ക് എന്താണ് അറിയേണ്ടത്?',
    };
  }

  // (J) Odia Request or Odia Text
  const isOdiaTrigger =
    isOdia ||
    lower.includes('odia') ||
    lower.includes('oriya') ||
    lower.includes('kuha');

  if (isOdiaTrigger) {
    return {
      text: 'ନମସ୍କାର! ମୁଁ ସାହା (Saha)। ଆପଣ ମୋ ସହିତ ଓଡ଼ିଆରେ କଥା ହୋଇପାରିବେ।\n\nସରକାରୀ ଯୋଜନା (ଯେପରିକି ଉଜ୍ଜ୍ୱଳା ଯୋଜନା 2.0) ଏବଂ ମହିଳା କଲ୍ୟାଣ ବିଷୟରେ ଜାଣିବା ପାଇଁ ମୁଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବି। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
    };
  }

  // (K) Punjabi Request or Punjabi Text
  const isPunjabiTrigger =
    isPunjabi ||
    lower.includes('punjabi') ||
    lower.includes('sat sri akal') ||
    lower.includes('dasso');

  if (isPunjabiTrigger) {
    return {
      text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਸਹਾ (Saha) ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਨਾਲ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ।\n\nਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ (ਜਿਵੇਂ ਉੱਜਵਲਾ ਯੋਜਨਾ 2.0) ਅਤੇ ਔਰਤਾਂ ਦੀ ਭਲਾਈ ਸਬੰਧੀ ਜਾਣਕਾਰੀ ਲਈ ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ?',
    };
  }

  // (L) Urdu Request or Urdu Text
  const isUrduTrigger =
    isUrdu ||
    lower.includes('urdu') ||
    lower.includes('adaab') ||
    lower.includes('salam');

  if (isUrduTrigger) {
    return {
      text: 'آداب! میں سہا (Saha) ہوں۔ آپ مجھ سے اردو میں بات کر سکتی ہیں۔\n\nخواتین کے لیے سرکاری فلاحی اسکیموں (جیسے اجولا یوجنا 2.0) کی معلومات حاصل کرنے میں، میں آپ کی مدد کر سکتی ہوں۔ آج میں آپ کی کیا مدد کر سکتی ہوں؟',
    };
  }

  // (M) General English greeting or query
  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.startsWith('hi ') || lower.startsWith('hello ')) {
    return {
      text: 'Hello! I am Saha, your AI companion for Indian government welfare schemes and citizen benefits. You can speak or type in any Indian language. How can I help you today?',
    };
  }

  return {
    text: 'Hello! I am Saha. You can speak or type in Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Urdu, English, Hinglish, or Tanglish. How can I help you with government schemes today?',
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
