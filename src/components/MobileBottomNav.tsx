import React from 'react';
import { Tv, Film, Clapperboard, History, Sparkles, Heart } from 'lucide-react';
import { MainTabType } from './Navbar';

interface MobileBottomNavProps {
  currentTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
  onOpenSubscription: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onChangeTab,
  onOpenSubscription,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-2 select-none">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onChangeTab('live')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'live' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv className={`w-5 h-5 ${currentTab === 'live' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">ทีวีสด</span>
        </button>

        <button
          onClick={() => onChangeTab('vod')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'vod' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className={`w-5 h-5 ${currentTab === 'vod' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">หนัง</span>
        </button>

        <button
          onClick={() => onChangeTab('series')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'series' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clapperboard className={`w-5 h-5 ${currentTab === 'series' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">ซีรีส์</span>
        </button>

        <button
          onClick={() => onChangeTab('history')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'history' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className={`w-5 h-5 ${currentTab === 'history' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">ประวัติ</span>
        </button>

        <button
          onClick={() => onChangeTab('favorites')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'favorites' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${currentTab === 'favorites' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">ที่ชอบ</span>
        </button>

        <button
          onClick={onOpenSubscription}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-amber-400 font-bold hover:scale-105 transition-transform"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-[9px] shadow-md">
            ฿
          </div>
          <span className="text-[10px]">แพ็กเกจ</span>
        </button>
      </div>
    </div>
  );
};
