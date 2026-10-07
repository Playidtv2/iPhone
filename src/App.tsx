import React, { useState, useEffect, useMemo } from 'react';
import {
  XtreamClient,
  parseM3uPlaylist,
} from './services/iptvApi';
import {
  UserInfo,
  Category,
  LiveStream,
  VodStream,
  SeriesItem,
  Episode,
  PlayHistoryItem,
} from './types/iptv';
import { Navbar, MainTabType } from './components/Navbar';
import { CategorySidebar } from './components/CategorySidebar';
import { ContentGrid } from './components/ContentGrid';
import { VideoPlayer } from './components/VideoPlayer';
import { MediaDetailModal } from './components/MediaDetailModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { TutorialModal } from './components/TutorialModal';
import { ParentalLockModal } from './components/ParentalLockModal';
import { LoginModal } from './components/LoginModal';
import { EpgGuideView } from './components/EpgGuideView';
import { HeroCarousel, HeroItem } from './components/HeroCarousel';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  DEMO_LIVE_CATEGORIES,
  DEMO_VOD_CATEGORIES,
  DEMO_SERIES_CATEGORIES,
  DEMO_CUSTOM_SERIES_CATEGORIES,
  DEMO_LIVE_STREAMS,
  DEMO_VOD_STREAMS,
  DEMO_SERIES_ITEMS,
  DEMO_CUSTOM_SERIES_ITEMS,
} from './services/mockData';
import { Play, Sparkles, Tv, HelpCircle, Film, ShieldAlert, RotateCcw } from 'lucide-react';

export default function App() {
  const [client, setClient] = useState<XtreamClient | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [serverUrl, setServerUrl] = useState<string>('http://103.114.203.129:8080');

  // Navigation & Category states
  const [currentTab, setCurrentTab] = useState<MainTabType>('live');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Data lists
  const [liveCategories, setLiveCategories] = useState<Category[]>(DEMO_LIVE_CATEGORIES);
  const [vodCategories, setVodCategories] = useState<Category[]>(DEMO_VOD_CATEGORIES);
  const [seriesCategories, setSeriesCategories] = useState<Category[]>(DEMO_SERIES_CATEGORIES);
  const [customSeriesCategories, setCustomSeriesCategories] = useState<Category[]>(DEMO_CUSTOM_SERIES_CATEGORIES);

  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(DEMO_LIVE_STREAMS);
  const [vodStreams, setVodStreams] = useState<VodStream[]>(DEMO_VOD_STREAMS);
  const [seriesStreams, setSeriesStreams] = useState<SeriesItem[]>(DEMO_SERIES_ITEMS);
  const [customSeriesStreams, setCustomSeriesStreams] = useState<SeriesItem[]>(DEMO_CUSTOM_SERIES_ITEMS);

  // Favorites & History (persisted)
  const [favoritesSet, setFavoritesSet] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('iptv_favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [historyItems, setHistoryItems] = useState<PlayHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('iptv_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Adult PIN lock state
  const [isAdultUnlocked, setIsAdultUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('iptv_adult_unlocked') === 'true';
  });

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isAdultModalOpen, setIsAdultModalOpen] = useState<boolean>(false);

  // Media Detail Modal (VOD & Series)
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    media: VodStream | SeriesItem | null;
    type: 'vod' | 'series';
  }>({
    open: false,
    media: null,
    type: 'vod',
  });

  // Active Video Player
  const [playerState, setPlayerState] = useState<{
    open: boolean;
    title: string;
    url: string;
    isLive: boolean;
    initialTime: number;
    episodes?: Episode[];
    currentEpisodeIndex?: number;
    currentLiveIndex?: number;
  }>({
    open: false,
    title: '',
    url: '',
    isLive: false,
    initialTime: 0,
  });

  // Load saved login on start or setup default demo client
  useEffect(() => {
    const init = async () => {
      try {
        const saved = localStorage.getItem('iptv_saved_login');
        if (saved) {
          const creds = JSON.parse(saved);
          if (creds.serverUrl && creds.username) {
            await handleLoginXtream(
              creds.serverUrl,
              creds.username,
              creds.password || '',
              creds.anyname || 'IPTV Thailand'
            );
            return;
          }
        }
      } catch {}

      // Default demo client so the interface is instantly active & playable
      const defaultClient = new XtreamClient('http://103.114.203.129:8080', 'demo_thai', 'demo1234');
      setClient(defaultClient);
      setUserInfo({
        username: 'VIP_Thailand (Demo Line)',
        auth: 1,
        status: 'Active',
        exp_date: Math.floor(Date.now() / 1000) + 86400 * 365,
        is_trial: 0,
        active_cons: 1,
        max_connections: 2,
      });
    };

    init();
  }, []);

  // Save favorites to localStorage
  const handleToggleFavorite = (key: string, _type: 'live' | 'vod' | 'series') => {
    const next = new Set(favoritesSet);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setFavoritesSet(next);
    localStorage.setItem('iptv_favorites', JSON.stringify(Array.from(next)));
  };

  // Adult lock handlers
  const handleUnlockAdult = () => {
    setIsAdultUnlocked(true);
    localStorage.setItem('iptv_adult_unlocked', 'true');
  };

  const handleLockAdult = () => {
    setIsAdultUnlocked(false);
    localStorage.setItem('iptv_adult_unlocked', 'false');
  };

  // Login with Xtream Codes
  const handleLoginXtream = async (
    server: string,
    user: string,
    pass: string,
    _anyname: string
  ) => {
    setServerUrl(server);
    const newClient = new XtreamClient(server, user, pass);
    const authData = await newClient.authenticate();
    setClient(newClient);
    setUserInfo(authData.user_info);

    // Fetch live categories and initial streams
    try {
      const [liveCats, vodCats, serCats] = await Promise.all([
        newClient.getLiveCategories(),
        newClient.getVodCategories(),
        newClient.getSeriesCategories(),
      ]);

      setLiveCategories(liveCats.length > 0 ? liveCats : DEMO_LIVE_CATEGORIES);
      setVodCategories(vodCats.length > 0 ? vodCats : DEMO_VOD_CATEGORIES);
      setSeriesCategories(serCats.length > 0 ? serCats : DEMO_SERIES_CATEGORIES);

      const [live, vod, series] = await Promise.all([
        newClient.getLiveStreams(),
        newClient.getVodStreams(),
        newClient.getSeries(),
      ]);

      setLiveStreams(live.length > 0 ? live : DEMO_LIVE_STREAMS);
      setVodStreams(vod.length > 0 ? vod : DEMO_VOD_STREAMS);
      setSeriesStreams(series.length > 0 ? series : DEMO_SERIES_ITEMS);
    } catch {
      // Use demo fallbacks if streams fail
      setLiveStreams(DEMO_LIVE_STREAMS);
      setVodStreams(DEMO_VOD_STREAMS);
      setSeriesStreams(DEMO_SERIES_ITEMS);
    }

    setIsLoginModalOpen(false);
  };

  // Login with M3U
  const handleLoginM3u = (
    categories: Category[],
    items: LiveStream[],
    playlistName: string
  ) => {
    setLiveCategories(categories);
    setLiveStreams(items);
    setUserInfo({
      username: playlistName,
      auth: 1,
      status: 'Active (M3U)',
      exp_date: null,
      is_trial: 0,
      active_cons: 1,
      max_connections: 1,
    });
    setCurrentTab('live');
    setSelectedCategoryId(null);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('iptv_saved_login');
    setUserInfo(null);
    setClient(null);
    setIsLoginModalOpen(true);
  };

  // Play Live Stream
  const handlePlayLive = (stream: LiveStream) => {
    if (!client && !stream.direct_source) return;
    const url = stream.direct_source || client?.getLiveStreamUrl(stream.stream_id) || '';

    // Record history
    addPlayHistory({
      kind: 'live',
      id: stream.stream_id,
      name: stream.name,
      cover: stream.stream_icon,
      streamUrl: url,
      timestamp: Date.now(),
    });

    const currentIndex = liveStreams.findIndex((s) => s.stream_id === stream.stream_id);

    setPlayerState({
      open: true,
      title: stream.name,
      url,
      isLive: true,
      initialTime: 0,
      currentLiveIndex: currentIndex,
    });
  };

  // Play VOD Movie
  const handlePlayVod = (vod: VodStream) => {
    if (!client) return;
    const url = client.getVodStreamUrl(vod.stream_id, vod.container_extension || 'mp4');

    const prevHistory = historyItems.find((h) => h.id === vod.stream_id && h.kind === 'vod');
    const resumePos = prevHistory?.pos || 0;

    addPlayHistory({
      kind: 'vod',
      id: vod.stream_id,
      name: vod.name,
      cover: vod.stream_icon,
      streamUrl: url,
      ext: vod.container_extension,
      pos: resumePos,
      timestamp: Date.now(),
    });

    setPlayerState({
      open: true,
      title: vod.name,
      url,
      isLive: false,
      initialTime: resumePos,
    });
    setDetailModal({ open: false, media: null, type: 'vod' });
  };

  // Play Series Episode
  const handlePlayEpisode = (series: SeriesItem, episode: Episode, episodeIndex: number) => {
    if (!client) return;
    const url = client.getSeriesStreamUrl(episode.id, episode.container_extension || 'mp4');

    addPlayHistory({
      kind: 'series',
      id: episode.id,
      seriesId: series.series_id,
      name: `${series.name} - ${episode.title}`,
      cover: series.cover,
      streamUrl: url,
      epIndex: episodeIndex,
      epTitle: episode.title,
      timestamp: Date.now(),
    });

    setPlayerState({
      open: true,
      title: `${series.name} - ${episode.title}`,
      url,
      isLive: false,
      initialTime: 0,
      currentEpisodeIndex: episodeIndex,
    });
    setDetailModal({ open: false, media: null, type: 'series' });
  };

  const addPlayHistory = (item: PlayHistoryItem) => {
    const filtered = historyItems.filter((h) => !(h.kind === item.kind && h.id === item.id));
    const updated = [item, ...filtered].slice(0, 30);
    setHistoryItems(updated);
    localStorage.setItem('iptv_history', JSON.stringify(updated));
  };

  // Live Channel Next/Prev navigation
  const handleNextLiveChannel = () => {
    if (playerState.currentLiveIndex === undefined || playerState.currentLiveIndex < 0) return;
    const nextIdx = (playerState.currentLiveIndex + 1) % liveStreams.length;
    const nextStream = liveStreams[nextIdx];
    if (nextStream) handlePlayLive(nextStream);
  };

  const handlePrevLiveChannel = () => {
    if (playerState.currentLiveIndex === undefined || playerState.currentLiveIndex < 0) return;
    const prevIdx = (playerState.currentLiveIndex - 1 + liveStreams.length) % liveStreams.length;
    const prevStream = liveStreams[prevIdx];
    if (prevStream) handlePlayLive(prevStream);
  };

  // Track progress in video player
  const handlePlayerTimeUpdate = (currentTime: number, duration: number) => {
    if (playerState.isLive || currentTime <= 0) return;
    // update current history item pos
    setHistoryItems((prev) => {
      const updated = prev.map((item, idx) => {
        if (idx === 0) {
          return { ...item, pos: currentTime, duration };
        }
        return item;
      });
      localStorage.setItem('iptv_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Determine current category list and filtered streams based on active tab
  const activeCategories = useMemo(() => {
    if (currentTab === 'live') return liveCategories;
    if (currentTab === 'vod') return vodCategories;
    if (currentTab === 'series') return seriesCategories;
    if (currentTab === 'custom_series') return customSeriesCategories;
    return [];
  }, [currentTab, liveCategories, vodCategories, seriesCategories, customSeriesCategories]);

  const currentCategoryName = useMemo(() => {
    if (selectedCategoryId === null) {
      if (currentTab === 'live') return '📺 ช่องทีวีสดทั้งหมด';
      if (currentTab === 'vod') return '🎬 ภาพยนตร์ VOD ทั้งหมด';
      if (currentTab === 'series') return '🍿 ซีรีส์ทั้งหมด';
      if (currentTab === 'custom_series') return '🌟 ซีรีส์พิเศษทั้งหมด';
      if (currentTab === 'favorites') return '❤️ รายการโปรดของคุณ';
      if (currentTab === 'history') return '🕒 ประวัติการรับชมล่าสุด';
    }
    const cat = activeCategories.find((c) => c.category_id === selectedCategoryId);
    return cat ? cat.category_name : 'รายการทั้งหมด';
  }, [selectedCategoryId, currentTab, activeCategories]);

  // Filtered by selected category
  const filteredLive = useMemo(() => {
    if (!selectedCategoryId) return liveStreams;
    return liveStreams.filter((s) => s.category_id === selectedCategoryId);
  }, [liveStreams, selectedCategoryId]);

  const filteredVod = useMemo(() => {
    if (!selectedCategoryId) return vodStreams;
    return vodStreams.filter((s) => s.category_id === selectedCategoryId);
  }, [vodStreams, selectedCategoryId]);

  const filteredSeries = useMemo(() => {
    if (!selectedCategoryId) return seriesStreams;
    return seriesStreams.filter((s) => s.category_id === selectedCategoryId);
  }, [seriesStreams, selectedCategoryId]);

  const filteredCustomSeries = useMemo(() => {
    if (!selectedCategoryId) return customSeriesStreams;
    return customSeriesStreams.filter((s) => s.category_id === selectedCategoryId);
  }, [customSeriesStreams, selectedCategoryId]);

  // Favorite items lists
  const favoriteLive = useMemo(() => {
    return liveStreams.filter((s) => favoritesSet.has(`live_${s.stream_id}`));
  }, [liveStreams, favoritesSet]);

  const favoriteVod = useMemo(() => {
    return vodStreams.filter((s) => favoritesSet.has(`vod_${s.stream_id}`));
  }, [vodStreams, favoritesSet]);

  const favoriteSeries = useMemo(() => {
    return seriesStreams.filter((s) => favoritesSet.has(`series_${s.series_id}`));
  }, [seriesStreams, favoritesSet]);

  // Handlers for HeroCarousel
  const handlePlayHero = (hero: HeroItem) => {
    if (hero.type === 'live') {
      handlePlayLive(hero.streamItem as LiveStream);
    } else if (hero.type === 'vod') {
      handlePlayVod(hero.streamItem as VodStream);
    } else {
      setDetailModal({ open: true, media: hero.streamItem as SeriesItem, type: 'series' });
    }
  };

  const handleOpenDetailHero = (hero: HeroItem) => {
    if (hero.type === 'vod') {
      setDetailModal({ open: true, media: hero.streamItem as VodStream, type: 'vod' });
    } else if (hero.type === 'series' || hero.type === 'custom_series') {
      setDetailModal({ open: true, media: hero.streamItem as SeriesItem, type: 'series' });
    } else {
      handlePlayLive(hero.streamItem as LiveStream);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          setSelectedCategoryId(null);
        }}
        userInfo={userInfo}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenAdultModal={() => setIsAdultModalOpen(true)}
        isAdultUnlocked={isAdultUnlocked}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1920px] w-full mx-auto">
        {/* Category Sidebar (only for Live, VOD, Series, and Custom Series tabs) */}
        {(currentTab === 'live' || currentTab === 'vod' || currentTab === 'series' || currentTab === 'custom_series') && (
          <CategorySidebar
            categories={activeCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            isAdultUnlocked={isAdultUnlocked}
            totalItemsCount={
              currentTab === 'live'
                ? liveStreams.length
                : currentTab === 'vod'
                ? vodStreams.length
                : currentTab === 'series'
                ? seriesStreams.length
                : customSeriesStreams.length
            }
          />
        )}

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
          {/* Hero Carousel (featured 15 items with badges) */}
          {(currentTab === 'live' || currentTab === 'vod' || currentTab === 'series' || currentTab === 'custom_series') && (
            <div className="p-4 md:px-6 md:pt-6">
              <HeroCarousel onPlay={handlePlayHero} onOpenDetail={handleOpenDetailHero} />
            </div>
          )}

          {/* Views */}
          {currentTab === 'live' && (
            <ContentGrid
              type="live"
              liveItems={filteredLive}
              categoryTitle={currentCategoryName}
              favoritesSet={favoritesSet}
              onToggleFavorite={handleToggleFavorite}
              onSelectLive={handlePlayLive}
              onSelectVod={handlePlayVod}
              onSelectSeries={(s) => setDetailModal({ open: true, media: s, type: 'series' })}
            />
          )}

          {currentTab === 'vod' && (
            <ContentGrid
              type="vod"
              vodItems={filteredVod}
              categoryTitle={currentCategoryName}
              favoritesSet={favoritesSet}
              onToggleFavorite={handleToggleFavorite}
              onSelectLive={handlePlayLive}
              onSelectVod={(v) => setDetailModal({ open: true, media: v, type: 'vod' })}
              onSelectSeries={(s) => setDetailModal({ open: true, media: s, type: 'series' })}
              onOpenDetail={(media, type) => setDetailModal({ open: true, media, type })}
            />
          )}

          {currentTab === 'series' && (
            <ContentGrid
              type="series"
              seriesItems={filteredSeries}
              categoryTitle={currentCategoryName}
              favoritesSet={favoritesSet}
              onToggleFavorite={handleToggleFavorite}
              onSelectLive={handlePlayLive}
              onSelectVod={handlePlayVod}
              onSelectSeries={(s) => setDetailModal({ open: true, media: s, type: 'series' })}
              onOpenDetail={(media, type) => setDetailModal({ open: true, media, type })}
            />
          )}

          {currentTab === 'custom_series' && (
            <ContentGrid
              type="custom_series"
              seriesItems={filteredCustomSeries}
              categoryTitle={currentCategoryName}
              favoritesSet={favoritesSet}
              onToggleFavorite={handleToggleFavorite}
              onSelectLive={handlePlayLive}
              onSelectVod={handlePlayVod}
              onSelectSeries={(s) => setDetailModal({ open: true, media: s, type: 'series' })}
              onOpenDetail={(media, type) => setDetailModal({ open: true, media, type })}
            />
          )}

          {currentTab === 'epg' && (
            <EpgGuideView
              channels={liveStreams}
              onPlayChannel={handlePlayLive}
            />
          )}

          {currentTab === 'favorites' && (
            <ContentGrid
              type="favorites"
              liveItems={favoriteLive}
              vodItems={favoriteVod}
              seriesItems={favoriteSeries}
              categoryTitle="❤️ รายการโปรดของคุณ (Favorites)"
              favoritesSet={favoritesSet}
              onToggleFavorite={handleToggleFavorite}
              onSelectLive={handlePlayLive}
              onSelectVod={(v) => setDetailModal({ open: true, media: v, type: 'vod' })}
              onSelectSeries={(s) => setDetailModal({ open: true, media: s, type: 'series' })}
              onOpenDetail={(media, type) => setDetailModal({ open: true, media, type })}
            />
          )}

          {currentTab === 'history' && (
            <div className="flex-1 p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    🕒 ประวัติการรับชมล่าสุด (Recently Played)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    กดคลิกเพื่อเล่นต่อจากเวลาที่รับชมค้างไว้ทันที
                  </p>
                </div>
                {historyItems.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('คุณต้องการล้างประวัติการรับชมทั้งหมดใช่หรือไม่?')) {
                        setHistoryItems([]);
                        localStorage.removeItem('iptv_history');
                      }
                    }}
                    className="text-xs text-slate-400 hover:text-red-400 underline"
                  >
                    ล้างประวัติทั้งหมด
                  </button>
                )}
              </div>

              {historyItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {historyItems.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPlayerState({
                          open: true,
                          title: item.name,
                          url: item.streamUrl,
                          isLive: item.kind === 'live',
                          initialTime: item.pos || 0,
                        });
                      }}
                      className="group bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 flex gap-3.5 cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div className="w-16 aspect-[2/3] bg-slate-950 rounded-xl overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                        {item.cover ? (
                          <img src={item.cover} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Film className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5 truncate">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            {item.kind === 'live' ? 'ช่องสด' : item.kind === 'vod' ? 'หนัง VOD' : 'ซีรีส์'}
                          </span>
                          <h4 className="text-xs font-semibold text-white truncate mt-1 group-hover:text-amber-400 transition-colors">
                            {item.name}
                          </h4>
                          {item.pos && item.pos > 0 ? (
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              รับชมค้างไว้ที่ {Math.floor(item.pos / 60)} นาที
                            </p>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                          <Play className="w-3 h-3 fill-current" />
                          <span>รับชมต่อ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 text-xs">
                  ยังไม่มีประวัติการรับชม เริ่มต้นดูช่องสดหรือภาพยนตร์ได้จากเมนู
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={playerState.open}
        title={playerState.title}
        streamUrl={playerState.url}
        isLive={playerState.isLive}
        initialTime={playerState.initialTime}
        onClose={() => setPlayerState((prev) => ({ ...prev, open: false }))}
        onTimeUpdate={handlePlayerTimeUpdate}
        episodes={playerState.episodes}
        currentEpisodeIndex={playerState.currentEpisodeIndex}
        onNextChannel={handleNextLiveChannel}
        onPrevChannel={handlePrevLiveChannel}
      />

      {/* Media Detail Modal */}
      <MediaDetailModal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, media: null, type: 'vod' })}
        media={detailModal.media}
        mediaType={detailModal.type}
        client={client}
        onPlayVod={handlePlayVod}
        onPlayEpisode={handlePlayEpisode}
        isFavorite={
          detailModal.media
            ? favoritesSet.has(
                `${detailModal.type}_${
                  detailModal.type === 'vod'
                    ? (detailModal.media as VodStream).stream_id
                    : (detailModal.media as SeriesItem).series_id
                }`
              )
            : false
        }
        onToggleFavorite={() => {
          if (!detailModal.media) return;
          const id =
            detailModal.type === 'vod'
              ? (detailModal.media as VodStream).stream_id
              : (detailModal.media as SeriesItem).series_id;
          handleToggleFavorite(`${detailModal.type}_${id}`, detailModal.type);
        }}
      />

      {/* Subscription Plans Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
      />

      {/* TiviMate & Smarters Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        serverUrl={serverUrl}
      />

      {/* 18+ Parental Lock PIN Modal */}
      <ParentalLockModal
        isOpen={isAdultModalOpen}
        onClose={() => setIsAdultModalOpen(false)}
        isUnlocked={isAdultUnlocked}
        onUnlock={handleUnlockAdult}
        onLock={handleLockAdult}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLoginXtream={handleLoginXtream}
        onLoginM3u={handleLoginM3u}
        onOpenTutorial={() => {
          setIsLoginModalOpen(false);
          setIsTutorialOpen(true);
        }}
        onOpenSubscription={() => {
          setIsLoginModalOpen(false);
          setIsSubscriptionOpen(true);
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          setSelectedCategoryId(null);
        }}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
      />
    </div>
  );
}
