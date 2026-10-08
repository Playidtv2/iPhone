import React from 'react';
import {
  Tv,
  Film,
  Clapperboard,
  Heart,
  History,
  Calendar,
  Sparkles,
  HelpCircle,
  Shield,
  ShieldAlert,
  LogOut,
  UserCheck,
  Menu,
  X,
  CreditCard,
  Layers,
} from 'lucide-react';
import { UserInfo } from '../types/iptv';

export type MainTabType = 'live' | 'vod' | 'series' | 'custom_series' | 'epg' | 'favorites' | 'history';

interface NavbarProps {
  currentTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
  userInfo: UserInfo | null;
  onOpenSubscription: () => void;
  onOpenTutorial: () => void;
  onOpenAdultModal: () => void;
  isAdultUnlocked: boolean;
  onLogout: () => void;
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onChangeTab,
  userInfo,
  onOpenSubscription,
  onOpenTutorial,
  onOpenAdultModal,
  isAdultUnlocked,
  onLogout,
  onOpenLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const formatExpDate = (exp: string | number | null | undefined) => {
    if (!exp || exp === 'null') return 'ไม่จำกัดเวลา (VIP)';
    const num = typeof exp === 'string' ? parseInt(exp, 10) : exp;
    if (isNaN(num)) return 'ไม่จำกัดเวลา';
    const d = new Date(num * 1000);
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const tabs: { id: MainTabType; label: string; icon: any }[] = [
    { id: 'live', label: 'ทีวีสด', icon: Tv },
    { id: 'vod', label: 'ภาพยนตร์', icon: Film },
    { id: 'series', label: 'ซีรีส์', icon: Clapperboard },
    { id: 'custom_series', label: 'ซีรีส์พิเศษ', icon: Layers },
    { id: 'epg', label: 'ผังรายการ EPG', icon: Calendar },
    { id: 'favorites', label: 'รายการโปรด', icon: Heart },
    { id: 'history', label: 'ประวัติ', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Tv className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base md:text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  IPTV <span className="text-amber-400">THAILAND</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                  WEB TV
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                Xtream Codes & M3U High-Speed Streaming
              </p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 text-xs font-medium">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* Adult 18+ Toggle */}
            <button
              onClick={onOpenAdultModal}
              title={isAdultUnlocked ? 'โหมด 18+ เปิดอยู่ (กดเพื่อล็อค)' : 'กดเพื่อปลดล็อคหมวด 18+'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isAdultUnlocked
                  ? 'bg-red-500/15 border-red-500 text-red-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isAdultUnlocked ? <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> : <Shield className="w-3.5 h-3.5" />}
              <span>{isAdultUnlocked ? '18+ (เปิด)' : '18+ (ซ่อน)'}</span>
            </button>

            {/* Tutorial Button */}
            <button
              onClick={onOpenTutorial}
              title="คู่มือติดตั้ง TiviMate & IPTV Smarters"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>คู่มือ TiviMate</span>
            </button>

            {/* Subscription Button */}
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>สมัครสมาชิก</span>
            </button>

            {/* User chip or Login button */}
            {userInfo ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="text-right hover:opacity-80 transition-opacity"
                  title="คลิกเพื่อสลับบัญชี หรือตั้งค่าการเชื่อมต่อ Xtream Codes"
                >
                  <div className="text-white font-medium truncate max-w-[110px]">
                    {userInfo.username}
                  </div>
                  <div className="text-[10px] text-amber-400">
                    Exp: {formatExpDate(userInfo.exp_date)}
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  title="ออกจากระบบ"
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800/80 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSubscription}
              className="px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
            >
              สมัคร
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onChangeTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                    isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2 text-xs">
            <button
              onClick={() => {
                onOpenTutorial();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 bg-slate-900 text-slate-300 rounded-xl flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>คู่มือตั้งค่า TiviMate & Smarters</span>
            </button>

            <button
              onClick={() => {
                onOpenAdultModal();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 bg-slate-900 text-slate-300 rounded-xl flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-red-400" />
              <span>{isAdultUnlocked ? 'ปิดหมวด 18+' : 'เปิดหมวด 18+ (ใส่ PIN)'}</span>
            </button>

            {userInfo && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-3 bg-red-950/40 text-red-300 rounded-xl flex items-center justify-between"
              >
                <span>ออกจากระบบ ({userInfo.username})</span>
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
