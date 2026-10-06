import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Heart,
  Star,
  Calendar,
  Clock,
  Film,
  Tv,
  ExternalLink,
  Check,
  ListVideo,
  Layers,
} from 'lucide-react';
import { VodStream, SeriesItem, SeriesDetail, Episode } from '../types/iptv';
import { XtreamClient } from '../services/iptvApi';

interface MediaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: VodStream | SeriesItem | null;
  mediaType: 'vod' | 'series';
  client: XtreamClient | null;
  onPlayVod: (vod: VodStream) => void;
  onPlayEpisode: (series: SeriesItem, episode: Episode, episodeIndex: number) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  isOpen,
  onClose,
  media,
  mediaType,
  client,
  onPlayVod,
  onPlayEpisode,
  isFavorite,
  onToggleFavorite,
}) => {
  const [seriesDetail, setSeriesDetail] = useState<SeriesDetail | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('1');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !media || mediaType !== 'series' || !client) return;

    const loadSeries = async () => {
      setIsLoading(true);
      try {
        const detail = await client.getSeriesInfo((media as SeriesItem).series_id);
        setSeriesDetail(detail);
        const seasons = Object.keys(detail.episodes || {});
        if (seasons.length > 0) {
          setSelectedSeason(seasons[0]);
        }
      } catch (err) {
        console.error('Failed to load series info', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSeries();
  }, [isOpen, media, mediaType, client]);

  if (!isOpen || !media) return null;

  const isVod = mediaType === 'vod';
  const vod = media as VodStream;
  const series = media as SeriesItem;

  const title = media.name;
  const poster = isVod ? vod.stream_icon : series.cover;
  const rating = isVod ? vod.rating : series.rating || seriesDetail?.info?.rating;
  const year = isVod ? vod.year : series.releaseDate || seriesDetail?.info?.releaseDate;
  const plot =
    seriesDetail?.info?.plot ||
    series.plot ||
    'เพลิดเพลินกับภาพยนตร์และซีรีส์คุณภาพคมชัดระดับ Master Full HD & 4K พร้อมระบบเสียงไทยและซับไทยคุณภาพเยี่ยม';

  const episodesForSeason: Episode[] =
    seriesDetail?.episodes && seriesDetail.episodes[selectedSeason]
      ? seriesDetail.episodes[selectedSeason]
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Backdrop / Header Image */}
        <div className="relative h-48 md:h-64 bg-slate-950 overflow-hidden">
          {poster && (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover opacity-30 blur-sm scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Content */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-5">
            {poster && (
              <img
                src={poster}
                alt={title}
                className="w-24 md:w-32 aspect-[2/3] object-cover rounded-xl shadow-2xl border border-slate-700 shrink-0"
              />
            )}
            <div className="space-y-1.5 pb-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase border border-amber-500/30">
                  {isVod ? 'ภาพยนตร์ VOD' : 'ซีรีส์'}
                </span>
                {rating && (
                  <span className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {rating}
                  </span>
                )}
                {year && (
                  <span className="text-xs text-slate-400">
                    • {year}
                  </span>
                )}
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-white line-clamp-2 leading-tight">
                {title}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {isVod ? (
              <button
                onClick={() => onPlayVod(vod)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>เล่นภาพยนตร์ (Play Movie)</span>
              </button>
            ) : (
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>กรุณาเลือกตอนที่ต้องการรับชมด้านล่าง</span>
              </div>
            )}

            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
              className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                isFavorite
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'ถูกใจแล้ว' : 'รายการโปรด'}</span>
            </button>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              เรื่องย่อ / Synopsis
            </h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {plot}
            </p>
          </div>

          {/* Series Season & Episodes Picker */}
          {!isVod && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  เลือกตอนรับชม (Episodes)
                </h4>

                {/* Season tabs */}
                {seriesDetail?.episodes && Object.keys(seriesDetail.episodes).length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {Object.keys(seriesDetail.episodes).map((sNum) => (
                      <button
                        key={sNum}
                        onClick={() => setSelectedSeason(sNum)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          selectedSeason === sNum
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        Season {sNum}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-xs text-slate-400 animate-pulse">
                  กำลังดาวน์โหลดรายชื่อตอน...
                </div>
              ) : episodesForSeason.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {episodesForSeason.map((ep, idx) => (
                    <button
                      key={ep.id || idx}
                      onClick={() => onPlayEpisode(series, ep, idx)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-medium text-white truncate">
                            {ep.title || `ตอนที่ ${ep.episode_num || idx + 1}`}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            ตอนที่ {ep.episode_num || idx + 1}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  ไม่พบตอนในซีซั่นนี้
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
