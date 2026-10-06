import React, { useState } from 'react';
import {
  Play,
  Heart,
  Star,
  Tv,
  Film,
  Search,
  SlidersHorizontal,
  Flame,
  Info,
  Calendar,
} from 'lucide-react';
import { LiveStream, VodStream, SeriesItem } from '../types/iptv';

interface ContentGridProps {
  type: 'live' | 'vod' | 'series' | 'favorites' | 'history';
  liveItems?: LiveStream[];
  vodItems?: VodStream[];
  seriesItems?: SeriesItem[];
  favoritesSet: Set<string>;
  onToggleFavorite: (id: string, type: 'live' | 'vod' | 'series', item: any) => void;
  onSelectLive: (item: LiveStream) => void;
  onSelectVod: (item: VodStream) => void;
  onSelectSeries: (item: SeriesItem) => void;
  onOpenDetail?: (item: VodStream | SeriesItem, mediaType: 'vod' | 'series') => void;
  categoryTitle?: string;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  type,
  liveItems = [],
  vodItems = [],
  seriesItems = [],
  favoritesSet,
  onToggleFavorite,
  onSelectLive,
  onSelectVod,
  onSelectSeries,
  onOpenDetail,
  categoryTitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'rating'>('default');

  const q = searchQuery.toLowerCase().trim();

  // Filter and sort items
  let displayLive = liveItems.filter((i) => !q || i.name.toLowerCase().includes(q));
  let displayVod = vodItems.filter((i) => !q || i.name.toLowerCase().includes(q));
  let displaySeries = seriesItems.filter((i) => !q || i.name.toLowerCase().includes(q));

  if (sortBy === 'name') {
    displayLive = [...displayLive].sort((a, b) => a.name.localeCompare(b.name));
    displayVod = [...displayVod].sort((a, b) => a.name.localeCompare(b.name));
    displaySeries = [...displaySeries].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'rating') {
    displayVod = [...displayVod].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    displaySeries = [...displaySeries].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  }

  const totalCount =
    type === 'live'
      ? displayLive.length
      : type === 'vod'
      ? displayVod.length
      : type === 'series'
      ? displaySeries.length
      : displayLive.length + displayVod.length + displaySeries.length;

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{categoryTitle || 'รายการทั้งหมด'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-normal">
              {totalCount} รายการ
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อช่อง, หนัง, ซีรีส์..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="default">จัดเรียง: แนะนำ</option>
            <option value="name">ชื่อ A - Z</option>
            <option value="rating">คะแนนเรตติ้ง</option>
          </select>
        </div>
      </div>

      {/* Live TV Channels Grid */}
      {(type === 'live' || (type === 'favorites' && displayLive.length > 0)) && (
        <div className="space-y-3">
          {type === 'favorites' && <h3 className="text-sm font-semibold text-amber-400">📺 ช่องทีวีสดที่ชอบ</h3>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {displayLive.map((item) => {
              const favKey = `live_${item.stream_id}`;
              const isFav = favoritesSet.has(favKey);

              return (
                <div
                  key={item.stream_id}
                  onClick={() => onSelectLive(item)}
                  className="group relative bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
                >
                  <div className="relative aspect-video rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden mb-2.5 border border-slate-800/80">
                    {item.stream_icon ? (
                      <img
                        src={item.stream_icon}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Tv className="w-8 h-8 text-slate-600" />
                    )}

                    {/* LIVE badge */}
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                      LIVE
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(favKey, 'live', item);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        isFav ? 'bg-rose-600 text-white' : 'bg-black/50 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      Full HD 1080p • สด
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Movies Grid */}
      {(type === 'vod' || (type === 'favorites' && displayVod.length > 0)) && (
        <div className="space-y-3">
          {type === 'favorites' && <h3 className="text-sm font-semibold text-amber-400">🎬 ภาพยนตร์ที่ชอบ</h3>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {displayVod.map((item) => {
              const favKey = `vod_${item.stream_id}`;
              const isFav = favoritesSet.has(favKey);

              return (
                <div
                  key={item.stream_id}
                  onClick={() => (onOpenDetail ? onOpenDetail(item, 'vod') : onSelectVod(item))}
                  className="group relative bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-[2/3] bg-slate-950 overflow-hidden">
                    {item.stream_icon ? (
                      <img
                        src={item.stream_icon}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Film className="w-10 h-10 text-slate-700 m-auto mt-16" />
                    )}

                    {/* 4K / UHD Badge */}
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded shadow">
                      4K UHD
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(favKey, 'vod', item);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        isFav ? 'bg-rose-600 text-white' : 'bg-black/50 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Hover Play Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{item.year || '2024'}</span>
                      {item.rating && (
                        <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {item.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Series Grid */}
      {(type === 'series' || (type === 'favorites' && displaySeries.length > 0)) && (
        <div className="space-y-3">
          {type === 'favorites' && <h3 className="text-sm font-semibold text-amber-400">🍿 ซีรีส์ที่ชอบ</h3>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {displaySeries.map((item) => {
              const favKey = `series_${item.series_id}`;
              const isFav = favoritesSet.has(favKey);

              return (
                <div
                  key={item.series_id}
                  onClick={() => (onOpenDetail ? onOpenDetail(item, 'series') : onSelectSeries(item))}
                  className="group relative bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-[2/3] bg-slate-950 overflow-hidden">
                    {item.cover ? (
                      <img
                        src={item.cover}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Film className="w-10 h-10 text-slate-700 m-auto mt-16" />
                    )}

                    <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                      SERIES
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(favKey, 'series', item);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        isFav ? 'bg-rose-600 text-white' : 'bg-black/50 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{item.releaseDate || 'ครบทุกตอน'}</span>
                      {item.rating && (
                        <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {item.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalCount === 0 && (
        <div className="text-center py-16 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">ไม่พบรายการเนื้อหา</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นจากแถบเมนูด้านซ้าย
          </p>
        </div>
      )}
    </div>
  );
};
