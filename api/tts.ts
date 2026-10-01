export function detectScriptLanguage(text: string): string {
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
  // Bengali / Assamese
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
  // Gurmukhi / Punjabi
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';
  // Odia
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or';
  // Urdu / Sindhi (Arabic script)
  if (/[\u0600-\u06FF]/.test(text)) return 'ur';
  // Devanagari (Hindi, Marathi, Sindhi)
  if (/[\u0900-\u097F]/.test(text)) {
    // Check common Marathi verb endings (उदा. आहे, नाही, करा)
    if (/\b(आहे|नाही|करा|झाले|पाहिजे|मिळेल)\b/.test(text)) {
      return 'mr';
    }
    return 'hi';
  }
  // Default to Indian English / Romanized
  return 'en-IN';
}

export async function handleTtsRequest(text: string, fallbackLang?: string): Promise<{ buffer: ArrayBuffer; contentType: string }> {
  if (!text || !text.trim()) {
    throw new Error('Text parameter is required');
  }

  // Clean text for speech
  const cleaned = text
    .replace(/\*\*/g, '')
    .replace(/[*#_~`]/g, '')
    .replace(/•/g, '')
    .replace(/💡/g, '')
    .replace(/🤝/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 200);

  // Automatically detect the script/language
  const targetLang = fallbackLang && fallbackLang !== 'auto' ? fallbackLang : detectScriptLanguage(cleaned);

  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(targetLang)}&q=${encodeURIComponent(cleaned)}`;

  const response = await fetch(ttsUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/',
    },
  });

  if (!response.ok) {
    throw new Error(`TTS service responded with status ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  return {
    buffer,
    contentType: 'audio/mpeg',
  };
}

export default async function handler(req: any, res: any) {
  try {
    const text = (req.query?.text as string) || (req.body?.text as string) || '';
    const lang = (req.query?.lang as string) || (req.body?.lang as string) || 'auto';

    const { buffer, contentType } = await handleTtsRequest(text, lang);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(Buffer.from(buffer));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'TTS Error';
    return res.status(500).json({ error: message });
  }
}
