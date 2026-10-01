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

        {/* Actions: Reset, Helpline, and Optional Login / Sign Up */}
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-colors min-h-[38px] touch-manipulation"
            title="Official Toll-Free Helpline: 1800-266-6696"
            aria-label="Helpline 1800-266-6696"
          >
            <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">1800-266-6696</span>
          </a>

          {/* User Profile or Login/Sign Up Button */}
          {user ? (
            <div className="flex items-center gap-1.5 bg-slate-100 pl-2.5 pr-1 py-1 rounded-xl">
              <span className="text-xs font-bold text-indigo-900">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#5448C8] hover:bg-[#4338CA] rounded-xl transition-all shadow-xs min-h-[38px] touch-manipulation active:scale-95"
              title="Login or Sign Up (Optional)"
              aria-label="Login or Sign Up"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / Sign up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
