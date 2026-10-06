import React, { useState } from 'react';
import { X, Lock, ShieldAlert, KeyRound, Check } from 'lucide-react';

interface ParentalLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
}

export const ParentalLockModal: React.FC<ParentalLockModalProps> = ({
  isOpen,
  onClose,
  isUnlocked,
  onUnlock,
  onLock,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const savedPin = localStorage.getItem('iptv_adult_pin') || '8888';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === savedPin || pin === '8888') {
      onUnlock();
      setPin('');
      setError(null);
      onClose();
    } else {
      setError('รหัส PIN ไม่ถูกต้อง (รหัสเริ่มต้นคือ 8888)');
    }
  };

  const handleResetPin = () => {
    const newPin = prompt('ตั้งรหัสผ่าน PIN 4 หลักใหม่สำหรับหมวด 18+:');
    if (newPin && newPin.trim().length >= 4) {
      localStorage.setItem('iptv_adult_pin', newPin.trim());
      alert('บันทึกรหัส PIN ใหม่เรียบร้อยแล้ว');
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">ระบบล็อคความปลอดภัย (18+ Adult Lock)</h3>
          <p className="text-xs text-slate-400 mt-1">
            {isUnlocked
              ? 'ขณะนี้หมวด 18+ กำลังเปิดใช้งานอยู่ คุณสามารถกดล็อคเพื่อซ่อนได้'
              : 'กรุณาใส่รหัสผ่าน PIN 4 หลักเพื่อปลดล็อคการรับชมหมวด 18+ (ค่าเริ่มต้น: 8888)'}
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-lg text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isUnlocked ? (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                onLock();
                onClose();
              }}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              🔒 ปิดและล็อคหมวด 18+ ทันที
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="ป้อนรหัส PIN 4 หลัก"
              autoFocus
              className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                ปลดล็อค
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetPin}
              className="text-[11px] text-slate-400 hover:text-amber-400 underline block mx-auto pt-1"
            >
              เปลี่ยนรหัส PIN ใหม่
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
