import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Sparkles, Star, Flame, Trophy, Film, Tv } from 'lucide-react';
import { LiveStream, VodStream, SeriesItem } from '../types/iptv';

export interface HeroItem {
  id: string | number;
  type: 'live' | 'vod' | 'series' | 'custom_series';
  title: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  backdrop: string;
  rating?: string | number;
  year?: string;
  genre?: string;
  streamItem: LiveStream | VodStream | SeriesItem;
}

interface HeroCarouselProps {
  onPlay: (item: HeroItem) => void;
  onOpenDetail?: (item: HeroItem) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onPlay, onOpenDetail }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 15 Curated Trending Hero Items
  const heroItems: HeroItem[] = [
    {
      id: 'h1',
      type: 'live',
      title: 'ถ่ายทอดสด: พรีเมียร์ลีก อังกฤษ (True Premier Football HD 1)',
      tagline: 'บิ๊กแมตช์สุดเดือด คมชัดระดับ 4K UHD 60FPS เสียงพากย์ไทย สดตรงจากสนาม',
      badge: '⚽ ถ่ายทอดสดกีฬา',
      badgeColor: 'bg-red-600',
      backdrop: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&auto=format&fit=crop&q=80',
      rating: '9.8',
      year: '2026',
      genre: 'Sports, Football, Premier League',
      streamItem: {
        stream_id: 'demo_live_tpf1',
        name: '⚽ True Premier Football HD 1 [พรีเมียร์ลีก]',
        category_id: 'live_sports',
      },
    },
    {
      id: 'h2',
      type: 'vod',
      title: 'หลานม่า (How to Make Millions Before Grandma Dies)',
      tagline: 'ภาพยนตร์ไทยอันดับ 1 แห่งปี ซาบซึ้งกินใจ เรื่องราวความผูกพันของหลานชายและอาม่า',
      badge: '🏆 ภาพยนตร์ยอดเยี่ยม',
      badgeColor: 'bg-amber-500 text-slate-950',
      backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&auto=format&fit=crop&q=80',
      rating: '9.1',
      year: '2024',
      genre: 'Drama, Family',
      streamItem: {
        stream_id: 'vod_5',
        name: 'หลานม่า (LAHN MAH)',
        category_id: 'vod_thai',
      },
    },
    {
      id: 'h3',
      type: 'series',
      title: 'Moving (ยอดมนุษย์พลังพิเศษ)',
      tagline: 'ซีรีส์เกาหลีแอ็กชันฟอร์มยักษ์ การรวมตัวของเหล่ามนุษย์กลายพันธุ์ที่ต้องปกป้องครอบครัว',
      badge: '🔥 ซีรีส์ยอดนิยม',
      badgeColor: 'bg-indigo-600',
      backdrop: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80',
      rating: '8.9',
      year: '2023',
      genre: 'Action, Sci-Fi, Drama',
      streamItem: {
        series_id: 'ser_1',
        name: 'Moving (ยอดมนุษย์พลังพิเศษ)',
        category_id: 'series_korea',
      },
    },
    {
      id: 'h4',
      type: 'live',
      title: 'beIN SPORTS 1 HD [UEFA Champions League]',
      tagline: 'ศึกแห่งศักดิ์ศรีเจ้ายุโรป ยูฟ่าแชมเปียนส์ลีก สตรีมมิ่งลื่นไหล ไม่ดีเลย์',
      badge: '⚽ ยูฟ่าแชมเปียนส์ลีก',
      badgeColor: 'bg-red-600',
      backdrop: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&auto=format&fit=crop&q=80',
      rating: '9.5',
      year: '2026',
      genre: 'Live, Champions League',
      streamItem: {
        stream_id: 'demo_live_bein1',
        name: '⚽ beIN SPORTS 1 HD [ยูฟ่าแชมเปียนส์ลีก]',
        category_id: 'live_sports',
      },
    },
    {
      id: 'h5',
      type: 'vod',
      title: 'Dune: Part Two (ดูน ภาค 2) [4K Atmos]',
      tagline: 'มหากาพย์ไซไฟแห่งทศวรรษ พอล อะทรีดีส ก้าวขึ้นสู่บัลลังก์แห่งดวงดาวทราย',
      badge: '💎 4K UHD Atmos',
      badgeColor: 'bg-cyan-600',
      backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
      rating: '8.9',
      year: '2024',
      genre: 'Sci-Fi, Adventure',
      streamItem: {
        stream_id: 'vod_3',
        name: 'Dune: Part Two (ดูน ภาค 2)',
        category_id: 'vod_4k',
      },
    },
    {
      id: 'h6',
      type: 'series',
      title: 'House of the Dragon Season 2 (ตระกูลมังกร)',
      tagline: 'สงครามบัลลังก์เลือดแห่งเวสเตอรอส ไฟมังกรคำราม ชะตากรรมทาร์แกเรียน',
      badge: '🐉 HBO Original',
      badgeColor: 'bg-purple-600',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      rating: '8.8',
      year: '2024',
      genre: 'Fantasy, Drama',
      streamItem: {
        series_id: 'ser_3',
        name: 'House of the Dragon Season 2',
        category_id: 'series_west',
      },
    },
    {
      id: 'h7',
      type: 'live',
      title: 'ช่อง 3 HD (Ch3 Thailand) 1080p',
      tagline: 'รับชมละครหลังข่าว ข่าวเด่น 3 มิติ วาไรตี้ครบครัน สัญญาณดิจิทัลแท้',
      badge: '🇹🇭 ดิจิทัลทีวีไทย',
      badgeColor: 'bg-blue-600',
      backdrop: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1600&auto=format&fit=crop&q=80',
      rating: '9.0',
      year: 'สด',
      genre: 'News, Drama, Variety',
      streamItem: {
        stream_id: 'demo_live_3hd',
        name: 'ช่อง 3 HD (Ch3 Thailand 33)',
        category_id: 'live_th_all',
      },
    },
    {
      id: 'h8',
      type: 'vod',
      title: 'ธี่หยด 2 (Tee Yod 2) [Full HD Master]',
      tagline: 'เสียงหลอนปริศนาในเงามืดกลับมาอีกครั้ง ตำนานสยองขวัญที่ทำลายทุกสถิติ',
      badge: '👻 สยองขวัญอันดับ 1',
      badgeColor: 'bg-emerald-700',
      backdrop: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1600&auto=format&fit=crop&q=80',
      rating: '8.6',
      year: '2024',
      genre: 'Horror, Thriller',
      streamItem: {
        stream_id: 'vod_2',
        name: 'ธี่หยด 2 (Tee Yod 2)',
        category_id: 'vod_horror',
      },
    },
    {
      id: 'h9',
      type: 'series',
      title: 'Shogun (โชกุน 2024) [4K Master]',
      tagline: 'ซีรีส์อิงประวัติศาสตร์ยอดเยี่ยมแห่งปี 18 รางวัลเอมมี สงครามซามูไรและอำนาจ',
      badge: '⚔️ Emmy Award Winner',
      badgeColor: 'bg-amber-600',
      backdrop: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=1600&auto=format&fit=crop&q=80',
      rating: '9.1',
      year: '2024',
      genre: 'History, War, Drama',
      streamItem: {
        series_id: 'ser_5',
        name: 'Shogun (โชกุน 2024)',
        category_id: 'series_trending',
      },
    },
    {
      id: 'h10',
      type: 'vod',
      title: 'John Wick: Chapter 4 (จอห์น วิค 4)',
      tagline: 'การต่อสู้ระดับพระกาฬเพื่ออิสรภาพ แอ็กชันน็อนสต็อป ทั่วทุกมุมโลก',
      badge: '💥 แอ็กชันมาสเตอร์',
      badgeColor: 'bg-orange-600',
      backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&auto=format&fit=crop&q=80',
      rating: '8.7',
      year: '2023',
      genre: 'Action, Crime',
      streamItem: {
        stream_id: 'vod_4',
        name: 'John Wick: Chapter 4',
        category_id: 'vod_action',
      },
    },
    {
      id: 'h11',
      type: 'live',
      title: 'ช่อง ONE 31 HD (ละคร & ข่าว & รายการดัง)',
      tagline: 'รวมซิทคอม ข่าวสาร และละครเรตติ้งอันดับ 1 ของประเทศ ภาพคมชัด 1080p',
      badge: '🇹🇭 ดิจิทัลทีวีไทย',
      badgeColor: 'bg-blue-600',
      backdrop: 'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=1600&auto=format&fit=crop&q=80',
      rating: '8.8',
      year: 'สด',
      genre: 'Drama, Show',
      streamItem: {
        stream_id: 'demo_live_one31',
        name: 'ช่อง ONE 31 HD',
        category_id: 'live_th_all',
      },
    },
    {
      id: 'h12',
      type: 'series',
      title: 'Marry My Husband (สามีคนนี้แจกฟรีให้เธอ)',
      tagline: 'การย้อนเวลาเพื่อล้างแค้นชะตากรรม ละครเกาหลีที่สร้างปรากฏการณ์ทั่วเอเชีย',
      badge: '🌸 K-Drama ยอดฮิต',
      badgeColor: 'bg-pink-600',
      backdrop: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&auto=format&fit=crop&q=80',
      rating: '8.6',
      year: '2024',
      genre: 'Romance, Revenge',
      streamItem: {
        series_id: 'ser_2',
        name: 'Marry My Husband',
        category_id: 'series_korea',
      },
    },
    {
      id: 'h13',
      type: 'vod',
      title: 'สัปเหร่อ (The Undertaker) [1080p พากย์ไทย]',
      tagline: 'ภาพยนตร์แห่งจักรวาลไทบ้านที่กวาดรายได้กว่า 700 ล้านบาท',
      badge: '🎬 หนังไทย 700 ล้าน',
      badgeColor: 'bg-emerald-600',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      rating: '8.8',
      year: '2023',
      genre: 'Comedy, Horror',
      streamItem: {
        stream_id: 'vod_1',
        name: 'สัปเหร่อ (The Undertaker)',
        category_id: 'vod_thai',
      },
    },
    {
      id: 'h14',
      type: 'live',
      title: '🏎️ beIN SPORTS 3 HD [F1 & เทนนิส]',
      tagline: 'ถ่ายทอดสดความเร็วระดับโลก ฟอร์มูลาวัน F1 ครบทุกสนาม พร้อมกีฬาระดับโลก',
      badge: '🏎️ มอเตอร์สปอร์ต',
      badgeColor: 'bg-red-600',
      backdrop: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&auto=format&fit=crop&q=80',
      rating: '9.2',
      year: '2026',
      genre: 'Motorsport, Tennis',
      streamItem: {
        stream_id: 'demo_live_bein3',
        name: '🏎️ beIN SPORTS 3 HD [F1 & เทนนิส]',
        category_id: 'live_sports',
      },
    },
    {
      id: 'h15',
      type: 'vod',
      title: 'Deadpool & Wolverine (เดดพูล & วูล์ฟเวอรีน)',
      tagline: 'คู่หูคู่กัดแห่งจักรวาลมาร์เวล แอ็กชันสุดมัน มุกตลกทะลุมิติแบบจัดเต็ม',
      badge: '🔥 Marvel Blockbuster',
      badgeColor: 'bg-rose-600',
      backdrop: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80',
      rating: '8.4',
      year: '2024',
      genre: 'Action, Comedy',
      streamItem: {
        stream_id: 'vod_7',
        name: 'Deadpool & Wolverine',
        category_id: 'vod_recent',
      },
    },
  ];

  // Auto-play interval for hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroItems.length]);

  const current = heroItems[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800/80 mb-6 select-none group">
      {/* Background Image with Gradient Overlays */}
      <div className="relative h-[280px] sm:h-[340px] md:h-[420px] w-full overflow-hidden">
        <img
          src={current.backdrop}
          alt={current.title}
          className="w-full h-full object-cover object-center transform scale-105 transition-all duration-700 filter brightness-90 group-hover:scale-110"
        />
        {/* Dark Vignette & Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent w-full md:w-3/4" />

        {/* Content Box */}
        <div className="absolute inset-0 p-5 sm:p-8 md:p-12 flex flex-col justify-end max-w-3xl z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${current.badgeColor}`}
            >
              {current.badge}
            </span>

            {current.rating && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                {current.rating}
              </span>
            )}

            {current.year && (
              <span className="text-xs text-slate-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/50">
                {current.year}
              </span>
            )}

            {current.genre && (
              <span className="hidden sm:inline-block text-xs text-slate-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/50">
                {current.genre}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md line-clamp-2 leading-tight">
            {current.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl drop-shadow leading-relaxed">
            {current.tagline}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onPlay(current)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>รับชมทันที (Play Now)</span>
            </button>

            {onOpenDetail && (
              <button
                onClick={() => onOpenDetail(current)}
                className="px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700/80 backdrop-blur transition-all cursor-pointer"
              >
                <Info className="w-4 h-4 text-slate-300" />
                <span>รายละเอียด</span>
              </button>
            )}
          </div>
        </div>

        {/* Carousel Prev/Next Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-3 right-6 flex items-center gap-1.5 z-20">
          {heroItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-6 bg-amber-400 shadow-md'
                  : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
