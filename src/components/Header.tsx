import React from 'react';
import { PhoneCall, RotateCcw, User, LogOut } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { SahaLogo } from './SahaLogo';
import { UserProfile } from './AuthModal';

interface HeaderProps {
  onReset: () => void;
  hasMessages: boolean;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasMessages,
  user,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-indigo-50/80 px-4 py-3 shadow-xs">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <SahaLogo className="w-8 h-8 flex-shrink-0" />
          <div>
            <h1 className="text-lg font-bold text-[#1E1B4B] tracking-tight leading-none">
              {APP_CONFIG.name}
            </h1>
          </div>
        </div>

        {/* Actions: Reset, Toll-Free Helpline, and Login / User Profile */}
        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[38px] touch-manipulation"
              title="Start a new question"
              aria-label="New conversation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>New</span>
            </button>
          )}

          <a
            href="tel:18002666696"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-colors min-h-[38px] touch-manipulation"
            title="Official PM Ujjwala Toll-Free Helpline: 1800-266-6696"
            aria-label="Helpline 1800-266-6696"
          >
            <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
            <span>1800-266-6696</span>
          </a>

          {user ? (
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/80 rounded-xl px-2.5 py-1 min-h-[38px]">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-indigo-950 max-w-[85px] sm:max-w-[120px] truncate">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs min-h-[38px] touch-manipulation"
              title="Login or Sign Up with Mobile OTP"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
