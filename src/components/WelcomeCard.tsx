import React from 'react';
import { Flame, ShieldCheck, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

interface WelcomeCardProps {
  onSelectPrompt: (promptText: string) => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onSelectPrompt }) => {
  return (
    <div className="space-y-4 my-2">
      {/* Friendly Banner */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-amber-500 text-white rounded-xl shadow-xs">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-snug">
              வணக்கம்! அரசு திட்ட உதவிகளை எளிதாக அறியலாம்.
            </h2>
            <p className="text-sm text-stone-700 mt-1 leading-relaxed">
              உள்நுழைவு அல்லது கணக்கு தேவையில்லை. கீழே உள்ள மைக்ரோஃபோன் அல்லது எழுத்து மூலம் உங்கள் தேவையை கேளுங்கள்.
            </p>
            <p className="text-xs text-stone-500 mt-1">
              (No signup needed. Speak or type naturally in your own language. All Indian languages supported.)
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center gap-2 text-xs text-stone-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>அங்கீகரிக்கப்பட்ட அதிகாரப்பூர்வ உஜ்வாலா (PMUY) தகவல்கள் மட்டுமே வழங்கப்படும்.</span>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1 mb-2">
          கேட்கக்கூடிய பொதுவான கேள்விகள் (Common Questions):
        </p>
        <div className="space-y-2">
          {APP_CONFIG.samplePrompts.map((item, index) => (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.ta)}
              className="w-full text-left p-3.5 bg-white hover:bg-stone-50 border border-stone-200 hover:border-amber-300 rounded-xl transition-all shadow-xs flex items-center justify-between group min-h-[50px] touch-manipulation"
            >
              <div className="pr-2">
                <p className="text-sm font-semibold text-stone-900 group-hover:text-amber-900">
                  {item.ta}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {item.en}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
