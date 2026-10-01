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

  // 1. If GEMINI_API_KEY is available, use Gemini 2.5 Flash
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
    }
  }

  // 2. Intelligent, Grounded Multilingual Offline Fallback Handler
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

  // Multi-script detection
  const isTamil = /[\u0B80-\u0BFF]/.test(text);
  const isTelugu = /[\u0C00-\u0C7F]/.test(text);
  const isBengali = /[\u0980-\u09FF]/.test(text);
  const isKannada = /[\u0C80-\u0CFF]/.test(text);
  const isMalayalam = /[\u0D00-\u0D7F]/.test(text);
  const isGujarati = /[\u0A80-\u0AFF]/.test(text);
  const isPunjabi = /[\u0A00-\u0A7F]/.test(text);
  const isOdia = /[\u0B00-\u0B7F]/.test(text);
  const isUrdu = /[\u0600-\u06FF]/.test(text);
  const isDevanagari = /[\u0900-\u097F]/.test(text);
  const isMarathi = isDevanagari && /\b(आहे|नाही|करा|झाले|पाहिजे|मिळेल|माहिती|कागदपत्रे)\b/.test(text);
  const isHindi = (isDevanagari && !isMarathi) || /\b(chahiye|kaise|kya|batao|madad|mujhe|yojana|paise|dastavez|patrata|hai|hain|kahan|kaun)\b/.test(lower);
  const isTanglish = /\b(venum|theva|epdi|solunga|kedaikkuma|udhavi|kudumbam|aavanam|thakuthi|aavadhu|illana)\b/.test(lower);

  // Intent classification
  const isDocumentsQuery =
    lower.includes('document') ||
    lower.includes('documents') ||
    lower.includes('proof') ||
    lower.includes('paper') ||
    lower.includes('aadhaar') ||
    lower.includes('ration') ||
    lower.includes('passbook') ||
    lower.includes('certificate') ||
    lower.includes('दस्तावेज') ||
    lower.includes('दस्तावेज़') ||
    lower.includes('कागजात') ||
    lower.includes('कागज') ||
    lower.includes('कागदपत्रे') ||
    lower.includes('ஆவணங்கள்') ||
    lower.includes('ஆவணம்') ||
    lower.includes('சான்றிதழ்') ||
    lower.includes('aavanam') ||
    lower.includes('dastavez') ||
    lower.includes('పత్రాలు') ||
    lower.includes('ನথি') ||
    lower.includes('ದಾಖಲೆ') ||
    lower.includes('രേഖകൾ') ||
    lower.includes('દસ્તાવેજ') ||
    lower.includes('ਦਸਤਾਵੇਜ਼') ||
    lower.includes('କାଗଜପତ୍ର') ||
    lower.includes('دستاویز');

  const isEligibilityQuery =
    lower.includes('eligible') ||
    lower.includes('eligibility') ||
    lower.includes('criteria') ||
    lower.includes('who can') ||
    lower.includes('who is eligible') ||
    lower.includes('qualify') ||
    lower.includes('condition') ||
    lower.includes('पात्रता') ||
    lower.includes('योग्यता') ||
    lower.includes('किसे मिलेगा') ||
    lower.includes('कौन') ||
    lower.includes('தகுதி') ||
    lower.includes('யாருக்கு') ||
    lower.includes('thakuthi') ||
    lower.includes('patrata') ||
    lower.includes('yogyata') ||
    lower.includes('అర్హత') ||
    lower.includes('যোগ্যতা') ||
    lower.includes('ಅರ್ಹತೆ') ||
    lower.includes('യോഗ്യത') ||
    lower.includes('પાત્રતા') ||
    lower.includes('ਯੋਗਤਾ') ||
    lower.includes('ଯୋଗ୍ୟତା') ||
    lower.includes('اہلیت');

  const isApplyQuery =
    lower.includes('apply') ||
    lower.includes('how to apply') ||
    lower.includes('where to apply') ||
    lower.includes('application') ||
    lower.includes('register') ||
    lower.includes('registration') ||
    lower.includes('form') ||
    lower.includes('steps') ||
    lower.includes('procedure') ||
    lower.includes('आवेदन') ||
    lower.includes('पंजीकरण') ||
    lower.includes('फॉर्म') ||
    lower.includes('विண்ணப்பம்') ||
    lower.includes('விண்ணப்பிக்க') ||
    lower.includes('பதிவு') ||
    lower.includes('vinnappam') ||
    lower.includes('vinnapipathu') ||
    lower.includes('kaise apply') ||
    lower.includes('kahan jana') ||
    lower.includes('దరఖాస్తు') ||
    lower.includes('আবেদন') ||
    lower.includes('ಅರ್ಜಿ') ||
    lower.includes('അപേക്ഷ') ||
    lower.includes('અરજી') ||
    lower.includes('ਅਰਜ਼ੀ') ||
    lower.includes('ଆବେଦନ') ||
    lower.includes('درخواست');

  const isCostOrSubsidyQuery =
    lower.includes('free') ||
    lower.includes('cost') ||
    lower.includes('price') ||
    lower.includes('fee') ||
    lower.includes('charge') ||
    lower.includes('money') ||
    lower.includes('rupee') ||
    lower.includes('rs') ||
    lower.includes('subsidy') ||
    lower.includes('deposit') ||
    lower.includes('मुफ्त') ||
    lower.includes('फ्री') ||
    lower.includes('खर्च') ||
    lower.includes('पैसे') ||
    lower.includes('सब्सिडी') ||
    lower.includes('இலவசம்') ||
    lower.includes('செலவு') ||
    lower.includes('பணம்') ||
    lower.includes('மானியம்') ||
    lower.includes('ilavasam') ||
    lower.includes('panam') ||
    lower.includes('muft') ||
    lower.includes('paise') ||
    lower.includes('ఉచితం') ||
    lower.includes('বিনামূল্যে') ||
    lower.includes('मोफत') ||
    lower.includes('ಮಫત') ||
    lower.includes('ಉಚಿತ') ||
    lower.includes('സൗജന്യം') ||
    lower.includes('ਮੁਫ਼ਤ') ||
    lower.includes('ମାଗଣା') ||
    lower.includes('مفت');

  const isHelplineQuery =
    lower.includes('helpline') ||
    lower.includes('toll free') ||
    lower.includes('tollfree') ||
    lower.includes('phone') ||
    lower.includes('call') ||
    lower.includes('number') ||
    lower.includes('contact') ||
    lower.includes('complaint') ||
    lower.includes('customer care') ||
    lower.includes('emergency') ||
    lower.includes('हेल्पलाइन') ||
    lower.includes('टोल फ्री') ||
    lower.includes('नंबर') ||
    lower.includes('फोन') ||
    lower.includes('उதவி எண்') ||
    lower.includes('ஹெல்ப்லைன்') ||
    lower.includes('ఫోన్ నంబర్') ||
    lower.includes('টোল ফ্রি');

  const isOtherSchemesQuery =
    lower.includes('other scheme') ||
    lower.includes('other schemes') ||
    lower.includes('all schemes') ||
    lower.includes('women scheme') ||
    lower.includes('schemes for women') ||
    lower.includes('pregnancy') ||
    lower.includes('maternity') ||
    lower.includes('loan') ||
    lower.includes('business loan') ||
    lower.includes('savings') ||
    lower.includes('अन्य योजना') ||
    lower.includes('दूसरी योजना') ||
    lower.includes('महिला योजना') ||
    lower.includes('மற்ற திட்டங்கள்') ||
    lower.includes('திட்டங்கள்');

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
    lower.includes('नमस्कार') ||
    lower.includes('வணக்கம்') ||
    lower.includes('vanakkam') ||
    lower.includes('namaste') ||
    lower.includes('नമஸ்கారం') ||
    lower.includes('నమస్కారం') ||
    lower.includes('নমস্কার') ||
    lower.includes('ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ') ||
    lower.includes('آداب');

  // 1. INTENT: DOCUMENTS REQUIRED
  if (isDocumentsQuery) {
    if (isTamil) {
      return {
        text: 'பிரதம மந்திரி உஜ்வாலா 2.0 (PMUY) திட்டத்திற்கு தேவையான ஆவணங்கள்:\n1. குடும்ப அட்டை (Ration Card) அல்லது குடும்ப உறுப்பினர் சான்றிதழ்\n2. விண்ணப்பதாரர் பெண்ணின் ஆதார் அட்டை (வயது 18+)\n3. குடும்பத்தில் உள்ள வயது வந்த அனைவரின் ஆதார் நகல்கள்\n4. வங்கி கணக்கு புத்தக நகல் (மானியம் பெற ஆதார் இணைக்கப்பட்டது)\n5. பாஸ்போர்ட் அளவு புகைப்படம்\n\nபுலம்பெயர்ந்த தொழிலாளர்கள் முகவரி சான்றிதழ் இல்லாவிட்டாலும் சுய அறிவிப்பு (Self-declaration) மூலம் விண்ணப்பிக்கலாம்.',
      };
    }
    if (isTanglish) {
      return {
        text: 'PM Ujjwala 2.0-ku thevaiyana mukkiyamaana documents:\n1. Ration Card (kudumba attai)\n2. Vinnappadharar pennin Aadhaar Card (age 18+)\n3. Kudumbathu periyavanga ellaroda Aadhaar copy\n4. Bank Passbook copy (Aadhaar linked)\n5. Passport size photo.\n\nMigrant workers address proof illanaalum self-declaration moolama apply panlaam.',
      };
    }
    if (isHindi || isDevanagari && !isMarathi) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना 2.0 (PMUY) के लिए आवश्यक दस्तावेज:\n1. राशन कार्ड (या परिवार संरचना प्रमाण पत्र)\n2. महिला आवेदक का आधार कार्ड (उम्र 18 वर्ष से अधिक)\n3. परिवार के सभी 18+ सदस्यों का आधार कार्ड\n4. बैंक पासबुक की प्रति (आधार से जुड़ी हुई, सब्सिडी हेतु)\n5. पासपोर्ट साइज फोटो\n\nप्रवासी परिवारों को स्थानीय पते के प्रमाण की आवश्यकता नहीं है, वे स्व-घोषणा पत्र देकर आवेदन कर सकते हैं।',
      };
    }
    if (isTelugu) {
      return {
        text: 'ప్రధాన మంత్రి ఉజ్వల యోజన 2.0 (PMUY) కొరకు కావలసిన ముఖ్య పత్రాలు:\n1. రేషన్ కార్డు (కుటుంబ సభ్యుల వివరాలతో)\n2. దరఖాస్తుదారు మహిళ ఆధార్ కార్డు (18+ ఏళ్లు)\n3. కుటుంబంలోని వయోజనులందరి ఆధార్ కాపీలు\n4. బ్యాంక్ పాస్‌బుక్ కాపీ (ఆధార్ లింక్ చేయబడినది)\n5. పాస్‌పోర్ట్ సైజ్ ఫోటో\n\nవలస కుటుంబాలు స్థానిక చిరునామా ధృవీకరణ పత్రం లేకుండా స్వయం ధృవీకరణ ద్వారా దరఖాస్తు చేసుకోవచ్చు.',
      };
    }
    if (isBengali) {
      return {
        text: 'প্রধানমন্ত্রী উজ্জ্বলা যোজনা 2.0 (PMUY)-এর জন্য প্রয়োজনীয় নথিপত্র:\n1. রেশন কার্ড (বা পারিবারিক শংসাপত্র)\n2. আবেদনকারী মহিলার আধার কার্ড (১৮ বছর বা তার বেশি)\n3. পরিবারের সকল প্রাপ্তবয়স্ক সদস্যের আধার কপি\n4. ব্যাঙ্ক পাসবইয়ের ফটোকপি (আধার সংযুক্ত)\n5. পাসপোর্ট সাইজ ছবি\n\nপ্রবাসী পরিবারগুলি স্থানীয় ঠিকানার প্রমাণপত্র ছাড়াই স্ব-ঘোষণার মাধ্যমে আবেদন করতে পারেন।',
      };
    }
    if (isMarathi) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना 2.0 (PMUY) साठी आवश्यक कागदपत्रे:\n1. रेशन कार्ड (किंवा कुटुंब रचना प्रमाणपत्र)\n2. अर्जदार महिलेचे आधार कार्ड (वय 18+)\n3. कुटुंबातील सर्व सज्ञान सदस्यांचे आधार कार्ड\n4. बँक पासबुक प्रत (आधार जोडलेले)\n5. पासपोर्ट आकाराचे छायाचित्र\n\nस्थलांतरित कामगारांना स्थानिक पत्त्याच्या पुराव्याशिवाय स्वयं-घोषणापत्राद्वारे अर्ज करता येतो.',
      };
    }
    if (isKannada) {
      return {
        text: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಉಜ್ವಲ ಯೋಜನೆ 2.0 (PMUY) ಗಾಗಿ ಅಗತ್ಯ ದಾಖಲೆಗಳು:\n1. ರೇಷನ್ ಕಾರ್ಡ್ (ಕುಟುಂಬ ಸದಸ್ಯರ ಪಟ್ಟಿ)\n2. ಅರ್ಜಿದಾರ ಮಹಿಳೆಯ ಆಧಾರ್ ಕಾರ್ಡ್ (18+ ವರ್ಷ)\n3. ಕುಟುಂಬದ ಎಲ್ಲಾ ವಯಸ್ಕರ ಆಧಾರ್ ಕಾರ್ಡ್ ಪ್ರತಿ\n4. ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಪ್ರತಿ (ಆಧಾರ್ ಲಿಂಕ್ ಆದ)\n5. ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಭಾವಚಿತ್ರ\n\nವಲಸೆ ಕಾರ್ಮಿಕರಿಗೆ ಸ್ಥಳೀಯ ವಿಳಾಸ ಪುರಾವೆ ಅಗತ್ಯವಿಲ್ಲ; ಸ್ವಯಂ ಘೋಷಣೆಯ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.',
      };
    }
    if (isMalayalam) {
      return {
        text: 'പ്രധാനമന്ത്രി ഉജ്ജ്വല യോജന 2.0 (PMUY) ന് ആവശ്യമായ രേഖകൾ:\n1. റേഷൻ കാർഡ് (കുടുംബാംഗങ്ങളുടെ വിവരങ്ങൾ അടങ്ങിയത്)\n2. അപേക്ഷകയായ സ്ത്രീയുടെ ആധാർ കാർഡ് (18 വയസ്സ് പൂർത്തിയായവർ)\n3. കുടുംബത്തിലെ മുതിർന്ന അംഗങ്ങളുടെ ആധാർ പകർപ്പുകൾ\n4. ബാങ്ക് പാസ്ബുക്ക് കോപ്പി (ആധാർ ലിങ്ക് ചെയ്തത്)\n5. പാസ്‌പോർട്ട് സൈസ് ഫോട്ടോ\n\nകുടിയേറ്റ തൊഴിലാളികൾക്ക് പ്രാദേശിക വിലാസ തെളിവില്ലാതെ സ്വയം സാക്ഷ്യപത്രത്തിലൂടെ അപേക്ഷിക്കാം.',
      };
    }
    if (isGujarati) {
      return {
        text: 'પ્રધાનમંત્રી ઉજ્જવલા યોજના 2.0 માટે જરૂરી દસ્તાવેજો:\n1. રેશન કાર્ડ (કુટુંબ યાદી)\n2. અરજદાર મહિલાનું આધાર કાર્ડ (18+ વર્ષ)\n3. કુટુંબના તમામ પુખ્ત સભ્યોના આધાર કાર્ડ\n4. બેંક પાસબુક નકલ (આધાર લિંક)\n5. પાસપોર્ટ સાઇઝનો ફોટો\n\nપ્રવાસી પરિવારો સ્થાનિક સરનામા વગર પણ સ્વ-ઘોષણાપત્ર આપી અરજી કરી શકે છે.',
      };
    }
    if (isPunjabi) {
      return {
        text: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਉੱਜਵਲਾ ਯੋਜਨਾ 2.0 ਲਈ ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼:\n1. ਰਾਸ਼ਨ ਕਾਰਡ (ਪਰਿਵਾਰ ਵੇਰਵਾ)\n2. ਅਰਜ਼ੀ ਦੇਣ ਵਾਲੀ ਔਰਤ ਦਾ ਆਧਾਰ ਕਾਰਡ (18+ ਸਾਲ)\n3. ਪਰਿਵਾਰ ਦੇ ਸਾਰੇ ਬਾਲਗ ਮੈਂਬਰਾਂ ਦੇ ਆਧਾਰ ਕਾਰਡ\n4. ਬੈਂਕ ਪਾਸਬੁੱਕ ਦੀ ਕਾਪੀ (ਆਧਾਰ ਲਿੰਕ)\n5. ਪਾਸਪੋਰਟ ਸਾਈਜ਼ ਫੋਟੋ\n\nਪ੍ਰਵਾਸੀ ਪਰਿਵਾਰ ਸਵੈ-ਘੋਸ਼ਣਾ ਪੱਤਰ ਦੇ ਕੇ ਵੀ ਅਰਜ਼ੀ ਦੇ ਸਕਦੇ ਹਨ।',
      };
    }
    if (isOdia) {
      return {
        text: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ଉଜ୍ଜ୍ୱଳା ଯୋଜନା 2.0 ପାଇଁ ଆବଶ୍ୟକୀୟ କାଗଜପତ୍ର:\n1. ରାସନ କାର୍ଡ (ପରିବାର ତାଲିକା)\n2. ମହିଳା ଆବେଦନକାରୀଙ୍କ ଆଧାର କାର୍ଡ (18+ ବର୍ଷ)\n3. ପରିବାରର ସମସ୍ତ ବୟସ୍କ ସଦସ୍ୟଙ୍କ ଆଧାର କାର୍ଡ\n4. ବ୍ୟାଙ୍କ ପାସବୁକ କପି (ଆଧାର ସଂଯୁକ୍ତ)\n5. ପାସପୋର୍ଟ ସାଇଜ ଫଟୋ\n\nପ୍ରବାସୀ ଶ୍ରମିକମାନେ ସ୍ୱ-ଘୋଷଣାପତ୍ର ଦ୍ୱାରା ଆବେଦନ କରିପାରିବେ।',
      };
    }
    if (isUrdu) {
      return {
        text: 'وزیر اعظم اجولا یوجنا 2.0 کے لیے ضروری دستاویزات:\n1. راشن کارڈ (خاندانی تفصیلات کے ساتھ)\n2. خاتون درخواست گزار کا آدھار کارڈ (18 سال سے زیادہ)\n3. خاندان کے تمام بالغ ارکان کے آدھار کارڈ\n4. بینک پاس بک کی کاپی (آدھار سے منسلک)\n5. پاسپورٹ سائز تصویر\n\nمہاجر خاندان مقامی پتے کے ثبوت کے بغیر خود اعلانیہ فارم کے ذریعے درخواست دے سکتے ہیں۔',
      };
    }
    return {
      text: 'Key documents required for PM Ujjwala Yojana 2.0 (PMUY):\n1. State Ration Card (or Family Composition Certificate)\n2. Applicant Woman’s Aadhaar Card (age 18+)\n3. Aadhaar copies of all adult (18+) family members\n4. Bank Passbook copy (Aadhaar-linked for DBT subsidies)\n5. Passport-size photograph\n\nMigrant families do not require local address proof; a self-declaration is accepted.',
    };
  }

  // 2. INTENT: ELIGIBILITY CRITERIA
  if (isEligibilityQuery) {
    if (isTamil) {
      return {
        text: 'பிரதம மந்திரி உஜ்வாலா 2.0 திட்டத்திற்கான தகுதிகள்:\n1. விண்ணப்பதாரர் 18 வயது நிரம்பிய பெண்ணாக இருக்க வேண்டும். ஆண்கள் விண்ணப்பிக்க முடியாது.\n2. குடும்பத்தில் வேறு எவருக்கும் ஏற்கனவே சமையல் எரிவாயு (LPG) இணைப்பு இருக்கக்கூடாது.\n3. ஏழை / முன்னுரிமை குடும்ப அட்டை (BPL / Priority Ration Card / SECC பட்டியல்) பெற்றிருக்க வேண்டும்.\n4. உஜ்வாலா 2.0-ல் புலம்பெயர்ந்த ஏழைப் பெண்களுக்கும் முகவரி சான்று இன்றி முன்னுரிமை உண்டு.',
      };
    }
    if (isTanglish) {
      return {
        text: 'Ujjwala 2.0 thaguthigal (Eligibility):\n1. 18 vayadhu nirambiya pengal mattumae apply panna mudiyum.\n2. Kudumbathula vera yaarkum munbu LPG gas connection irukka koodadhu.\n3. BPL / Priority Ration Card vaithirukkum eliya kudumbangalukku kedaikkum.\n4. Migrant kudumbangalukku local address proof thevai illai.',
      };
    }
    if (isHindi || isDevanagari && !isMarathi) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना 2.0 के लिए पात्रता शर्तें:\n1. आवेदक केवल 18 वर्ष या उससे अधिक आयु की महिला होनी चाहिए। पुरुष आवेदन नहीं कर सकते।\n2. परिवार में किसी भी सदस्य के नाम पर पहले से कोई एलपीजी गैस कनेक्शन नहीं होना चाहिए।\n3. परिवार गरीब/वंचित श्रेणी (BPL, SECC, प्राथमिकता राशन कार्ड, अंत्योदय आदि) से संबंधित होना चाहिए।\n4. उज्ज्वला 2.0 में प्रवासी महिलाओं को स्थानीय राशन कार्ड या पते के प्रमाण के बिना भी कनेक्शन की सुविधा है।',
      };
    }
    if (isTelugu) {
      return {
        text: 'ప్రధాన మంత్రి ఉజ్వల యోజన 2.0 అర్హతలు:\n1. దరఖాస్తుదారు 18 సంవత్సరాలు నిండిన మహిళ మాత్రమే అయి ఉండాలి.\n2. కుటుంబంలో ఎవరి పేరుపైనా ఇంతకుముందు ఎలాంటి ఎల్‌పీజీ గ్యాస్ కనెక్షన్ ఉండకూడదు.\n3. పేద / బిಪಿఎల్ / ప్రాధాన్యత రేషన్ కార్డు కలిగి ఉండాలి.\n4. వలస కార్మికులకు స్థానిక చిరునామా ధృవీకరణ అవసరం లేకుండా ప్రత్యేక మినహాయింపు ఉంది.',
      };
    }
    if (isBengali) {
      return {
        text: 'প্রধানমন্ত্রী উজ্জ্বলা যোজনা 2.0-এর যোগ্যতার শর্তাবলী:\n1. আবেদনকারীকে অবশ্যই ১৮ বছর বা তার বেশি বয়সী মহিলা হতে হবে।\n2. পরিবারের কারও নামে আগে থেকে কোনো রান্নার গ্যাস সংযোগ থাকা চলবে না।\n3. পরিবারটি দরিদ্র শ্রেণি (BPL, অন্ত্যোদয়, বা অগ্রাধিকার রেশন কার্ডধারী) হতে হবে।\n4. পরিযায়ী পরিবারগুলির জন্য স্থানীয় ঠিকানার প্রমাণপত্র বাধ্যতামূলক নয়।',
      };
    }
    return {
      text: 'Eligibility criteria for PM Ujjwala Yojana 2.0 (PMUY):\n1. The applicant MUST be an adult woman (age 18+). Men cannot apply.\n2. No existing LPG connection in the entire household.\n3. Must belong to a poor/deprived household (BPL, SECC, Antyodaya, or Priority Ration Card).\n4. Under Ujjwala 2.0, migrant women do not need local address proof; a self-declaration is accepted.',
    };
  }

  // 3. INTENT: HOW TO APPLY / STEPS
  if (isApplyQuery) {
    if (isTamil) {
      return {
        text: 'உஜ்வாலா 2.0 திட்டத்திற்கு விண்ணப்பிக்கும் முறை:\n\n1. ஆஃப்லைன் முறை (எளிதானது):\nஅருகிலுள்ள LPG கேஸ் ஏஜென்சிக்கு (Indane, Bharat Gas, HP Gas) செல்லவும். ரேஷன் கார்டு, ஆதார், வங்கி பாஸ்புக் நகல்களுடன் உஜ்வாலா KYC படிவத்தை பூர்த்தி செய்து சமர்ப்பிக்கவும்.\n\n2. ஆன்லைன் முறை:\npmuy.gov.in என்ற அதிகாரப்பூர்வ இணையதளத்திற்கு சென்று "Apply for New Ujjwala 2.0 Connection" என்பதை தேர்வு செய்து விண்ணப்பிக்கலாம்.\n\nசரிபார்ப்பிற்கு பிறகு வைப்புத்தொகை இன்றி இலவச இணைப்பு, அடுப்பு மற்றும் முதல் சிலிண்டர் வழங்கப்படும்.',
      };
    }
    if (isTanglish) {
      return {
        text: 'Ujjwala 2.0-ku apply panra steps:\n\n1. Offline (Romba easy):\nPakkathula irukkura Indane, Bharat Gas, or HP Gas agency-ku poyi Ujjwala KYC form fill panni, Ration Card, Aadhaar, Bank Passbook xerox kudunga.\n\n2. Online:\nOfficial portal pmuy.gov.in poyi "Apply for New Ujjwala 2.0 Connection" select panni apply panlaam.\n\nVerification mudinjavudane deposit illama free stove, cylinder delivery aagum.',
      };
    }
    if (isHindi || isDevanagari && !isMarathi) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना 2.0 में आवेदन करने की प्रक्रिया:\n\n1. ऑफलाइन तरीका (सबसे आसान):\nअपनी नजदीकी एलपीजी गैस एजेंसी (Indane, Bharat Gas या HP Gas) पर जाएं। वहां मुफ्त Ujjwala KYC फॉर्म भरें और राशन कार्ड, आधार कार्ड व बैंक पासबुक की फोटोकॉपी जमा करें।\n\n2. ऑनलाइन तरीका:\nआधिकारिक पोर्टल pmuy.gov.in पर जाएं, "Apply for New Ujjwala 2.0 Connection" पर क्लिक करें और अपनी पसंदीदा गैस कंपनी चुनकर आवेदन करें।\n\nसत्यापन के बाद बिना किसी सिक्योरिटी डिपॉजिट के नया कनेक्शन, चूल्हा व भरा सिलेंडर प्राप्त होगा।',
      };
    }
    if (isTelugu) {
      return {
        text: 'ఉజ్వల యోజన 2.0 దరఖాస్తు విధానం:\n\n1. ఆఫ్ లైన్ (సులభమైన మార్గం):\nసమీపంలోని ఇండేన్, భారత్ గ్యాస్ లేదా హెచ్‌పి గ్యాస్ ఏజెన్సీకి వెళ్లండి. రేషన్ కార్డు, ఆధార్, బ్యాంక్ పాస్‌బుక్ కాపీలతో ఉజ్వల కేవైసీ ఫారమ్‌ను పూరించండి.\n\n2. ఆన్‌లైన్:\nఅధికారిక వెబ్‌సైట్ pmuy.gov.in లో "Apply for New Ujjwala 2.0 Connection" ద్వారా దరఖాస్తు చేసుకోవచ్చు.\n\nపరిశీలన పూర్తయిన తర్వాత డిపాజిట్ లేకుండా ఉచిత స్టవ్, సిలిండర్ అందుతుంది.',
      };
    }
    return {
      text: 'How to apply for PM Ujjwala Yojana 2.0 (PMUY):\n\n1. Offline (Fastest & Simplest):\nVisit your nearest LPG distributor (Indane, Bharat Gas, or HP Gas). Fill the simplified Ujjwala KYC form and submit copies of your Ration Card, Aadhaar, Bank Passbook, and photo.\n\n2. Online Application:\nVisit the official government portal pmuy.gov.in, click "Apply for New Ujjwala 2.0 Connection", select your preferred distributor, and submit your details.\n\nOnce verified, you will receive a deposit-free gas connection with a free stove and first refill.',
    };
  }

  // 4. INTENT: COST / FEE / SUBSIDY / IS IT FREE
  if (isCostOrSubsidyQuery) {
    if (isTamil) {
      return {
        text: 'ஆம்! உஜ்வாலா 2.0 (PMUY) திட்டம் 100% வைப்புத்தொகை இல்லாத முற்றிலும் இலவச திட்டம்:\n\n• சிலிண்டர் மற்றும் ரெகுலேட்டருக்கான வைப்புத்தொகை: ₹0 (முழு இலவசம்)\n• முதல் முறை நிரப்பப்பட்ட 14.2 கிலோ எல்பிஜி சிலிண்டர்: ₹0 (இலவசம்)\n• உயர்தர எரிவாயு அடுப்பு (Stove & Safety Hose): ₹0 (இலவசம்)\n• எந்தவொரு கட்டணமும் விநியோகஸ்தருக்கு முன்பணமாக செலுத்த தேவையில்லை.\n• அடுத்தடுத்த சிலிண்டர் முன்பதிவுகளுக்கு மத்திய அரசின் நேரடி வங்கி மானியம் (DBT) கிடைக்கும்.',
      };
    }
    if (isTanglish) {
      return {
        text: 'Aam! PM Ujjwala 2.0 100% deposit-illaatha FREE connection:\n\n• Security deposit: Rs. 0 (Free)\n• First cylinder refill: Rs. 0 (Free)\n• Gas stove & safety pipe: Rs. 0 (Free)\n• Distributor-kitta yaarum fees kudukka thevai illai.\n• Adutha cylinder vangum bothu bank account-la direct subsidy (DBT) varum.',
      };
    }
    if (isHindi || isDevanagari && !isMarathi) {
      return {
        text: 'हाँ! प्रधानमंत्री उज्ज्वला योजना 2.0 पूरी तरह से 100% मुफ्त और डिपॉजिट-फ्री है:\n\n• सिलेंडर और रेगुलेटर की सिक्योरिटी डिपॉजिट: ₹0 (बिल्कुल मुफ्त)\n• पहला भरा हुआ 14.2 किलो गैस सिलेंडर: ₹0 (बिल्कुल मुफ्त)\n• प्रमाणित 2-बर्नर गैस चूल्हा और सुरक्षा पाइप: ₹0 (बिल्कुल मुफ्त)\n• आपको गैस एजेंसी को कोई भी अग्रिम शुल्क या पैसा नहीं देना होता है।\n• इसके बाद के सिलेंडर रिफिल पर भी सरकार द्वारा सीधे आपके बैंक खाते में सब्सिडी (DBT) दी जाती है।',
      };
    }
    if (isTelugu) {
      return {
        text: 'అవును! ప్రధాన మంత్రి ఉజ్వల యోజన 2.0 పూర్తిగా 100% ఉచిత పథకం:\n\n• సిలిండర్ మరియు రెగ్యులేటర్ డిపాజిట్: ₹0 (ఉచితం)\n• మొదటి గ్యాస్ సిలిండర్ రీఫిల్: ₹0 (ఉచితం)\n• గ్యాస్ పొయ్యి (స్టవ్) మరియు సేఫ్టీ పైప్: ₹0 (ఉచితం)\n• గ్యాస్ ఏజెన్సీకి ఎటువంటి ఫీజు చెల్లించాల్సిన అవసరం లేదు.\n• తరువాతి సిలిండర్లపై ప్రభుత్వం నేరుగా మీ బ్యాంక్ ఖాతాలో సబ్సిడీ (DBT) జమ చేస్తుంది.',
      };
    }
    return {
      text: 'Yes! PM Ujjwala Yojana 2.0 is 100% deposit-free and completely free at onboarding:\n\n• Security Deposit for Cylinder & Regulator: ₹0 (100% Free)\n• 1st Filled 14.2 kg LPG Cylinder: ₹0 (100% Free)\n• Certified 2-Burner Gas Stove (Hotplate) & Pipe: ₹0 (100% Free)\n• No upfront payment to the distributor.\n• Subsequent cylinder refills also receive direct government subsidies transferred directly to your bank account (DBT).',
    };
  }

  // 5. INTENT: HELPLINE / CONTACT
  if (isHelplineQuery) {
    if (isTamil) {
      return {
        text: 'உஜ்வாலா 2.0 மற்றும் எல்பிஜி தொடர்பான அதிகாரப்பூர்வ உதவி எண்கள்:\n\n• PM Ujjwala கட்டணமில்லா உதவி எண்: 1800-266-6696\n• 24 மணி நேர அவசர / எரிவாயு கசிவு உதவி எண்: 1906\n• அதிகாரப்பூர்வ இணையதளம்: pmuy.gov.in',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना और एलपीजी के आधिकारिक हेल्पलाइन नंबर:\n\n• उज्ज्वला योजना टोल-फ्री हेल्पलाइन: 1800-266-6696\n• 24x7 एलपीजी आपातकालीन व रिसाव हेल्पलाइन: 1906\n• आधिकारिक पोर्टल: pmuy.gov.in',
      };
    }
    return {
      text: 'Official Helplines for PM Ujjwala Yojana (PMUY):\n\n• PM Ujjwala Toll-Free Helpline: 1800-266-6696\n• 24x7 LPG Emergency & Leakage Helpline: 1906\n• Official Portal: pmuy.gov.in',
    };
  }

  // 6. INTENT: OTHER WELFARE SCHEMES FOR WOMEN
  if (isOtherSchemesQuery) {
    if (isTamil) {
      return {
        text: 'இந்திய பெண்களுக்கான முக்கிய அரசு நலத்திட்டங்கள்:\n\n1. PM Ujjwala 2.0: ஏழைப் பெண்களுக்கு இலவச எரிவாயு இணைப்பு, அடுப்பு மற்றும் முதல் சிலிண்டர்.\n2. பிரதான் மந்திரி மாத்ரு வந்தனா திட்டம் (PMMVY): கர்ப்பிணிப் பெண்களுக்கு ₹5,000 நேரடி வங்கி நிதி உதவி.\n3. சுகன்யா சம்ரித்தி யோஜனா: பெண் குழந்தைகளின் கல்வி மற்றும் எதிர்காலத்திற்கான அதிக வட்டி தரும் சேமிப்புத் திட்டம்.\n4. PM முத்ரா யோஜனா: மகளிர் தொழில் தொடங்க ₹10 லட்சம் வரை பிணையில்லா வணிகக் கடன்.\n5. மகளிர் உதவி மையம் (One Stop Centre): பெண்களின் பாதுகாப்பு மற்றும் அவசர உதவிக்கான 181 உதவி எண்.',
      };
    }
    if (isHindi || isDevanagari) {
      return {
        text: 'महिलाओं के लिए प्रमुख सरकारी कल्याणकारी योजनाएं:\n\n1. प्रधानमंत्री उज्ज्वला योजना 2.0: गरीब महिलाओं को मुफ्त एलपीजी गैस कनेक्शन, चूल्हा व पहला सिलेंडर।\n2. प्रधानमंत्री मातृ वंदना योजना (PMMVY): गर्भवती व धात्री महिलाओं को पोषण सहायता हेतु ₹5,000 की नकद राशि।\n3. सुकन्या समृद्धि योजना: बेटियों की शिक्षा और भविष्य के लिए उच्च ब्याज वाली सुरक्षित बचत योजना।\n4. प्रधानमंत्री मुद्रा योजना: महिला उद्यमियों व स्वयं सहायता समूहों को व्यवसाय हेतु बिना गारंटी ₹10 लाख तक का ऋण।\n5. वन स्टॉप सेंटर व महिला हेल्पलाइन 181: किसी भी संकट में महिलाओं के लिए 24x7 आपातकालीन सहायता व सुरक्षा।',
      };
    }
    return {
      text: 'Key Indian government welfare schemes for women:\n\n1. PM Ujjwala Yojana 2.0: Free LPG gas connection, stove, and first refill for eligible women.\n2. Pradhan Mantri Matru Vandana Yojana (PMMVY): ₹5,000 direct cash incentive for pregnant and lactating mothers.\n3. Sukanya Samriddhi Yojana: Government-backed high-yield savings scheme for the girl child.\n4. PM Mudra Yojana: Collateral-free micro-business loans up to ₹10 Lakh for women entrepreneurs.\n5. One Stop Centre Scheme & Helpline 181: 24x7 medical, legal, and counseling emergency assistance.',
    };
  }

  // 7. INTENT: GREETING / WHO ARE YOU / INTRODUCTION
  if (isGreetingQuery) {
    if (isTamil) {
      return {
        text: 'வணக்கம்! நான் சஹா (Saha), இந்திய பெண்களுக்கான அரசு நலத்திட்ட வழிகாட்டி.\n\nஉஜ்வாலா 2.0 இலவச எரிவாயு இணைப்பு, மகப்பேறு உதவி, மகளிர் கடன்கள் போன்ற அரசு திட்டங்களின் தகுதிகள், தேவையான ஆவணங்கள் மற்றும் விண்ணப்பிக்கும் வழிமுறைகள் பற்றி உங்களுக்கு உதவ நான் தயாராக உள்ளேன். இன்று உங்களுக்கு என்ன தகவல் தேவை?',
      };
    }
    if (isTanglish) {
      return {
        text: 'Vanakkam! Naan Saha. Pengalukkaana government welfare schemes (Ujjwala 2.0 free gas, loans, financial aid) pathi therinjukka ungalukku help pannuven. Innaiku ungalukku enna thagaval thevai?',
      };
    }
    if (isHindi || isDevanagari && !isMarathi) {
      return {
        text: 'नमस्ते! मैं सहा (Saha) हूँ, महिलाओं और परिवारों के लिए सरकारी योजनाओं की आपकी एआई साथी।\n\nमैं प्रधानमंत्री उज्ज्वला योजना 2.0 (मुफ्त गैस कनेक्शन), मातृत्व सहायता (PMMVY), व अन्य महिला कल्याण योजनाओं की पात्रता, आवश्यक दस्तावेजों और आवेदन प्रक्रिया में आपकी पूरी सहायता करूँगी। आज आपको क्या जानकारी चाहिए?',
      };
    }
    if (isTelugu) {
      return {
        text: 'నమస్కారం! నేను సహా (Saha), మహిళలు మరియు కుటుంబాల కోసం ప్రభుత్వ సంక్షేమ పథకాల మార్గదర్శిని.\n\nఉజ్వల యోజన 2.0 ఉచిత గ్యాస్ కనెక్షన్, మహిళా రుణాలు మరియు ప్రభుత్వ సహాయ పథకాల అర్హతలు, అవసరమైన పత్రాలు మరియు దరఖాస్తు విధానంపై మీకు సహాయం చేస్తాను. ఈరోజు మీకు ఎలాంటి సమాచారం కావాలి?',
      };
    }
    if (isBengali) {
      return {
        text: 'নমস্কার! আমি সাহা (Saha), সরকারি কল্যাণমূলক প্রকল্পের জন্য আপনার ডিজিটাল সহায়িকা।\n\nউজ্জ্বলা যোজনা 2.0 বিনামূল্যে গ্যাস সংযোগ, নারী সহায়তা ও অন্যান্য সরকারি প্রকল্পের যোগ্যতা, নথিপত্র এবং আবেদন পদ্ধতির বিষয়ে আপনাকে সাহায্য করতে পারি। আজ আপনার কী তথ্য প্রয়োজন?',
      };
    }
    return {
      text: 'Hello! I am Saha, your AI companion for Indian government welfare schemes and citizen benefits.\n\nI can help you understand eligibility, document requirements, and application procedures for schemes like PM Ujjwala Yojana 2.0 (free gas connection), maternity benefits, and financial support. How can I assist you today?',
    };
  }

  // 8. INTENT: GAS / CYLINDER / GENERAL PMUY TOPIC
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
    lower.includes('उज्ज्वला') ||
    lower.includes('గ్యాస్') ||
    lower.includes('গ্যাস') ||
    fullConversationHistory.includes('gas') ||
    fullConversationHistory.includes('ujjwala');

  if (isGasQuery) {
    if (isTamil) {
      return {
        text: 'பிரதம மந்திரி உஜ்வாலா திட்டம் 2.0 (PMUY) மூலம் ஏழை குடும்பங்களின் பெண்களுக்கு 100% வைப்புத்தொகை இன்றி இலவச எரிவாயு இணைப்பு, இலவச முதல் சிலிண்டர் மற்றும் இலவச எரிவாயு அடுப்பு வழங்கப்படுகிறது.\n\n• தேவையான ஆவணங்கள்: குடும்ப அட்டை, விண்ணப்பதாரர் பெண்ணின் ஆதார் அட்டை, வங்கி பாஸ்புக்.\n• விண்ணப்பிக்க: அருகிலுள்ள எல்பிஜி கேஸ் ஏஜென்சியை (Indane, Bharat, HP Gas) அணுகவும் அல்லது pmuy.gov.in வழியாக விண்ணப்பிக்கவும்.\n\nஉங்களுக்கு தகுதி அல்லது ஆவணங்கள் பற்றிய கூடுதல் விவரங்கள் தேவையா?',
      };
    }
    if (isTanglish) {
      return {
        text: 'PM Ujjwala Yojana 2.0 moolama eliya kudumbathu pengalukku deposit-illaatha free gas connection, free first cylinder and free gas stove kedaikkum.\n\nThevaiyana documents: Ration Card, Pennin Aadhaar Card, Bank passbook copy.\n\nApply panna pakkathula irukkura LPG gas agency (Indane, Bharat, HP)-la apply panlaam, illana pmuy.gov.in portal-la apply panlaam.',
      };
    }
    if (isHindi || isDevanagari && !isMarathi) {
      return {
        text: 'प्रधानमंत्री उज्ज्वला योजना 2.0 (PMUY) के तहत पात्र गरीब परिवारों की वयस्क महिलाओं को बिना किसी सिक्योरिटी डिपॉजिट के मुफ्त एलपीजी गैस कनेक्शन, पहला भरा हुआ सिलेंडर और 2-बर्नर गैस चूल्हा दिया जाता है।\n\n• आवश्यक दस्तावेज: राशन कार्ड, महिला का आधार कार्ड, बैंक पासबुक।\n• आवेदन कैसे करें: नजदीकी गैस एजेंसी (Indane, Bharat, HP Gas) में जाएं या pmuy.gov.in पर ऑनलाइन आवेदन करें।\n\nक्या आप इस योजना की पात्रता या जरूरी दस्तावेजों के बारे में विस्तार से जानना चाहती हैं?',
      };
    }
    if (isTelugu) {
      return {
        text: 'ప్రధాన మంత్రి ఉజ్వల యోజన 2.0 ద్వారా అర్హులైన పేద కుటుంబాల మహిళలకు డిపాజిట్ లేని ఉచిత గ్యాస్ కనెక్షన్, మొదటి సిలిండర్ మరియు ఉచిత పొయ్యి ఇవ్వబడుతుంది.\n\n• కావలసిన పత్రాలు: రేషన్ కార్డు, ఆధార్ కార్డు, బ్యాంక్ పాస్‌బుక్.\n• దరఖాస్తు: సమీపంలోని గ్యాస్ ఏజెన్సీ లేదా pmuy.gov.in ద్వారా చేసుకోవచ్చు.',
      };
    }
    if (isBengali) {
      return {
        text: 'প্রধানমন্ত্রী উজ্জ্বলা যোজনা 2.0-এর মাধ্যমে দরিদ্র পরিবারের যোগ্য মহিলাদের বিনামূল্যে নতুন গ্যাস সংযোগ, প্রথম সিলিন্ডার এবং গ্যাস ওভেন দেওয়া হয়।\n\n• প্রয়োজনীয় নথি: রেশন কার্ড, আধার কার্ড, ব্যাঙ্ক পাসবুক।\n• আবেদন পদ্ধতি: নিকটবর্তী গ্যাস এজেন্সিতে গিয়ে অথবা pmuy.gov.in-এর মাধ্যমে আবেদন করতে পারেন।',
      };
    }
    return {
      text: 'Under PM Ujjwala Yojana 2.0 (PMUY), eligible adult women from poor households receive a 100% deposit-free LPG gas connection, a free gas stove, and the first filled cylinder refill free.\n\n• Key Documents: Ration Card, Applicant Woman’s Aadhaar Card, and Bank Passbook.\n• How to Apply: Visit your nearest LPG distributor (Indane, Bharat Gas, HP Gas) or apply online at pmuy.gov.in.\n\nWould you like to check your eligibility or learn about the required documents?',
    };
  }

  // 9. DEFAULT / GENERAL CITIZEN ASSISTANCE
  if (isTamil) {
    return {
      text: 'பெண்கள் மற்றும் குடும்பங்களுக்கான அரசு நலத்திட்டங்கள் (உஜ்வாலா 2.0 இலவச எரிவாயு இணைப்பு, மகப்பேறு உதவி, மகளிர் தொழில் கடன்கள் போன்றவை) பற்றி உங்களுக்கு வழிகாட்ட நான் தயாராக உள்ளேன். தகுதிகள், தேவையான ஆவணங்கள் அல்லது விண்ணப்பிக்கும் முறை பற்றி உங்களுக்கு என்ன உதவி வேண்டும்?',
    };
  }
  if (isTanglish) {
    return {
      text: 'Pengalukkaana government welfare schemes (Ujjwala 2.0 free gas connection, financial aid, loans) pathi ungalukku full guidance thara naan ready. Ungalukku enna thagaval thevai?',
    };
  }
  if (isHindi || isDevanagari && !isMarathi) {
    return {
      text: 'मैं महिलाओं और गरीब परिवारों के लिए सरकारी योजनाओं (जैसे उज्ज्वला योजना 2.0 मुफ्त गैस कनेक्शन, मातृत्व सहायता, व महिला ऋण) की जानकारी देने में आपकी पूरी सहायता करूँगी। आपको किस योजना की पात्रता, दस्तावेज या आवेदन प्रक्रिया के बारे में जानना है?',
    };
  }
  if (isTelugu) {
    return {
      text: 'ప్రభుత్వ సంక్షేమ పథకాలు (ఉజ్వల యోజన 2.0 ఉచిత గ్యాస్ కనెక్షన్ వంటివి) మరియు మహిళా సాధికారత సేవల గురించి తెలుసుకోవడానికి నేను మీకు సహాయం చేస్తాను. మీకు ఎలాంటి సమాచారం లేదా సహాయం కావాలి?',
    };
  }
  if (isBengali) {
    return {
      text: 'সরকারি প্রকল্প (যেমন উজ্জ্বলা যোজনা 2.0 বিনামূল্যে গ্যাস সংযোগ) এবং নারীদের কল্যাণে সরকারি সহায়তার বিষয়ে আমি আপনাকে গাইড করতে প্রস্তুত। আপনার কী তথ্য প্রয়োজন?',
    };
  }
  return {
    text: 'I can help you understand and apply for government welfare schemes for women and families across India, including PM Ujjwala Yojana 2.0 (free gas connection, stove, and cylinder), maternity benefits, and financial support. What scheme or guidance are you looking for today?',
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
