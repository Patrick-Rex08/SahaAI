import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  FileText,
  ListOrdered,
  HelpCircle,
} from 'lucide-react';
import { SchemeData } from '../types';

interface SchemeGuidanceProps {
  scheme: SchemeData;
  language?: 'ta' | 'tanglish' | 'en';
}

export const SchemeGuidance: React.FC<SchemeGuidanceProps> = ({
  scheme,
  language = 'tanglish',
}) => {
  const [activeTab, setActiveTab] = useState<'eligibility' | 'documents' | 'steps'>('eligibility');

  // Eligibility flow state (one-question-at-a-time)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, { isEligible: boolean; reason?: string }>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Document checklist state
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  const isTamil = language === 'ta';
  const questions = scheme.eligibilityQuestions;
  const currentQ = questions[currentQuestionIdx];

  const handleAnswer = (option: { isEligible: boolean; reasonEn?: string; reasonTa?: string }) => {
    const updated = {
      ...userAnswers,
      [currentQ.id]: {
        isEligible: option.isEligible,
        reason: isTamil ? option.reasonTa : option.reasonEn,
      },
    };
    setUserAnswers(updated);

    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setQuizCompleted(false);
  };

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Determine eligibility outcome
  const allEligible = Object.values(userAnswers).every((ans) => ans.isEligible);
  const failedAnswer = Object.values(userAnswers).find((ans) => !ans.isEligible);

  const docs = isTamil ? scheme.documentsTa : scheme.documentsEn;
  const steps = isTamil ? scheme.stepsTa : scheme.stepsEn;
  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="mt-3 bg-white border border-indigo-100 rounded-3xl overflow-hidden shadow-xs text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-indigo-100/70">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Govt Scheme</span>
            </div>
            <h3 className="text-base font-extrabold text-[#1E1B4B] mt-1.5 leading-snug">
              {isTamil ? scheme.nameTa : scheme.nameEn}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTamil ? scheme.ministryTa : scheme.ministryEn}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 mt-3 pt-2 border-t border-indigo-100/60">
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'eligibility'
                ? 'bg-[#5448C8] text-white shadow-xs'
                : 'bg-white/80 text-slate-600 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isTamil ? 'தகுதி சரிபார்ப்பு' : 'Check Eligibility'}</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'documents'
                ? 'bg-[#5448C8] text-white shadow-xs'
                : 'bg-white/80 text-slate-600 hover:bg-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isTamil ? 'ஆவணங்கள்' : 'Documents'}</span>
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'steps'
                ? 'bg-[#5448C8] text-white shadow-xs'
                : 'bg-white/80 text-slate-600 hover:bg-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>{isTamil ? 'விண்ணப்ப முறை' : 'How to Apply'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: One-Question-at-a-Time Eligibility Flow */}
      {activeTab === 'eligibility' && (
        <div className="p-4">
          {!quizCompleted ? (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                <span>QUESTION {currentQuestionIdx + 1} OF {questions.length}</span>
                <span>{Math.round(((currentQuestionIdx) / questions.length) * 100)}% Complete</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-[#5448C8] transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question text */}
              <p className="text-sm font-bold text-slate-900 mb-3">
                {isTamil ? currentQ.questionTa : currentQ.questionEn}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-3 rounded-2xl border border-indigo-100 hover:border-[#5448C8] bg-white hover:bg-indigo-50/50 transition-all flex items-center justify-between group active:scale-98"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-indigo-900">
                      {isTamil ? option.labelTa : option.labelEn}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {allEligible ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">
                        {isTamil ? 'நீங்கள் தகுதியுள்ளவராகத் தெரிகிறீர்கள்!' : 'You Appear Preliminarily Eligible!'}
                      </h4>
                      <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                        {isTamil
                          ? 'உங்கள் பதில்களின்படி நீங்கள் உஜ்வாலா இலவச சமையல் எரிவாயு இணைப்பு பெற தகுதியானவர். உங்கள் ஆவணங்களை சரிபார்த்து விண்ணப்பிக்கலாம்.'
                          : 'Based on your answers, your household meets the basic eligibility conditions for Ujjwala 2.0.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">
                        {isTamil ? 'தகுதி வரம்பு குறிப்பு' : 'Eligibility Notice'}
                      </h4>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        {failedAnswer?.reason ||
                          (isTamil
                            ? 'அரசு விதிகளின்படி குடும்பத்தில் ஏற்கனவே கேஸ் இணைப்பு இருக்கக்கூடாது மற்றும் பெண்மணியின் பெயரில் மட்டுமே வழங்கப்படுகிறது.'
                            : 'According to official rules, connections are issued only in an adult woman’s name with no existing household connection.')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic">
                * Note: This is preliminary guidance. The LPG distributor makes the final verification based on official records.
              </p>

              <button
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isTamil ? 'மீண்டும் சரிபார்க்க' : 'Check Again'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Document Checklist */}
      {activeTab === 'documents' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Tap to check off what you have ready:</span>
            <span className="font-bold text-indigo-600">
              {checkedCount} of {docs.length} ready
            </span>
          </div>

          <div className="space-y-2">
            {docs.map((doc, idx) => {
              const isChecked = !!checkedDocs[idx];
              return (
                <button
                  key={idx}
                  onClick={() => toggleDoc(idx)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium leading-relaxed ${isChecked ? 'line-through text-emerald-800' : ''}`}>
                    {doc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Step-by-Step Application Guide */}
      {activeTab === 'steps' && (
        <div className="p-4 space-y-2.5">
          {steps.map((step, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-[#5448C8] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Footer Actions: Official Portal Link & Helpline */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#5448C8] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-xs"
        >
          <span>Open Official Portal (pmuy.gov.in)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <a
          href="tel:18002666696"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
          <span>Call 1800-266-6696</span>
        </a>
      </div>
    </div>
  );
};
