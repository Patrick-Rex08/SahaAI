import React, { useState } from 'react';
import { X, CheckCircle2, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export interface UserProfile {
  name: string;
  authMethod: 'google' | 'facebook' | 'phone';
  identifier: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Google User',
        authMethod: 'google',
        identifier: 'user@gmail.com',
      });
      onClose();
    }, 600);
  };

  const handleFacebookAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Facebook User',
        authMethod: 'facebook',
        identifier: 'user@facebook.com',
      });
      onClose();
    }, 600);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMessage('Please enter a 4-digit verification OTP (e.g. 1234).');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: `User (${phone.slice(-4)})`,
        authMethod: 'phone',
        identifier: `+91 ${phone}`,
      });
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-2">
            🤝
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900">
            {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Login is completely optional. You can always use Saha as a guest!
          </p>

          {/* Tabs: Login / Sign Up */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mt-4">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mx-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Body content */}
        <div className="p-6 pt-2 space-y-4">
          {/* Social Sign-In Buttons */}
          <div className="space-y-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-2xl font-semibold text-sm text-slate-700 transition-all shadow-xs min-h-[48px]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{activeTab === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={handleFacebookAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-2xl font-semibold text-sm transition-all shadow-xs min-h-[48px]"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{activeTab === 'login' ? 'Continue with Facebook' : 'Sign up with Facebook'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Or with Mobile Number
            </span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Mobile Phone / OTP Form */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-2xl px-3 py-2.5 focus-within:border-indigo-600 bg-white">
                  <span className="text-sm font-bold text-slate-500">🇮🇳 +91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile number"
                    className="flex-1 text-sm text-slate-900 outline-none bg-transparent"
                  />
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-2xl font-bold text-sm transition-all shadow-md min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>Send OTP (Get Code)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-900 flex items-center justify-between">
                <span>Code sent to +91 {phone}</span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="font-bold underline text-indigo-700 ml-2"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter 4-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter OTP (e.g. 1234)"
                  className="w-full text-center tracking-widest text-lg font-bold border border-slate-200 rounded-2xl py-2.5 focus:border-indigo-600 outline-none bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length < 4}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-2xl font-bold text-sm transition-all shadow-md min-h-[48px] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & {activeTab === 'login' ? 'Login' : 'Sign Up'}</span>
              </button>
            </form>
          )}

          {/* Continue as Guest Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Skip and continue as Guest →
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Your personal information is secure and never shared.</span>
        </div>
      </div>
    </div>
  );
};
