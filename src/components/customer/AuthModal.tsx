import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  User as UserIcon,
  MapPin,
  Sparkles,
  Gift,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { User, Address } from '../../types';
import { StorageService } from '../../services/storageService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  const [step, setStep] = useState<'LOGIN_PHONE' | 'LOGIN_OTP' | 'PROFILE'>('PROFILE');
  const [phoneInput, setPhoneInput] = useState(currentUser.phone);
  const [otpInput, setOtpInput] = useState('');
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [emailInput, setEmailInput] = useState(currentUser.email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length < 8) return;
    setStep('LOGIN_OTP');
    // Simulate SMS dispatch
    StorageService.logNotification({
      recipientPhone: phoneInput,
      channel: 'SMS',
      title: 'Izhaan Login OTP',
      body: 'Your Izhaan Mart verification code is 123456. Valid for 5 minutes. Do not share.'
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Accept 123456 or any 6 digit input for smooth demo
    const updated = {
      ...currentUser,
      phone: phoneInput,
      name: nameInput || currentUser.name
    };
    StorageService.saveUser(updated);
    onUpdateUser(updated);
    setStep('PROFILE');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name: nameInput,
      email: emailInput,
      phone: phoneInput
    };
    StorageService.saveUser(updated);
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-white flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">Resident Account</h3>
              <p className="text-[11px] text-emerald-100">Izhaan Hyperlocal Customer Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Loyalty & Rewards Card */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> Neighborhood Rewards
              </span>
              <div className="text-2xl font-black font-mono">
                {currentUser.loyaltyPoints} Points
              </div>
              <p className="text-[11px] text-amber-100">
                Earn 1 point per $10 spent · Redeem on future groceries
              </p>
            </div>
            <div className="bg-white/20 px-3 py-2 rounded-xl text-center backdrop-blur-xs">
              <span className="text-[10px] block font-semibold text-amber-100">Value</span>
              <span className="font-mono font-bold text-sm">${(currentUser.loyaltyPoints * 0.1).toFixed(2)}</span>
            </div>
          </div>

          {step === 'LOGIN_PHONE' ? (
            /* Step 1: Mobile Phone input */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-400">
                  We'll send a 6-digit one-time password (OTP) via SMS.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs"
              >
                Send 6-Digit OTP
              </button>
            </form>
          ) : step === 'LOGIN_OTP' ? (
            /* Step 2: OTP Entry */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpInput('123456')}
                    className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                  >
                    Auto-fill (123456)
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="• • • • • •"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-center text-lg font-bold font-mono tracking-widest focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 text-center">
                  Sent to {phoneInput} · Code expires in 5:00
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs"
              >
                Verify & Continue
              </button>

              <button
                type="button"
                onClick={() => setStep('LOGIN_PHONE')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
              >
                Change Mobile Number
              </button>
            </form>
          ) : (
            /* Step 3: Profile view & Address manager */
            <div className="space-y-4">
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Profile Information</span>
                  <button
                    type="button"
                    onClick={() => setStep('LOGIN_PHONE')}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Change Phone / Relogin
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Save Profile Changes
                </button>

                {savedSuccess && (
                  <p className="text-xs text-emerald-700 font-bold text-center">
                    Profile updated successfully!
                  </p>
                )}
              </form>

              {/* Saved Addresses List */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Saved Addresses ({currentUser.addresses.length})
                  </span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                          {addr.label}
                        </span>
                        <span className="font-mono text-slate-500 text-[10px]">{addr.pincode}</span>
                      </div>
                      <p className="text-slate-700 truncate">{addr.streetAddress}</p>
                      <p className="text-[10px] text-slate-400">{addr.zoneName}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
