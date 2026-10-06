import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  SkipForward,
  SkipBack,
  Settings,
  ExternalLink,
  Tv,
  Film,
  Download,
  Check,
  AlertCircle,
  Ratio,
} from 'lucide-react';
import { Episode } from '../types/iptv';

interface VideoPlayerProps {
  title: string;
  streamUrl: string;
  isOpen: boolean;
  onClose: () => void;
  isLive?: boolean;
  initialTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  // Series extras
  episodes?: Episode[];
  currentEpisodeIndex?: number;
  onSelectEpisode?: (index: number) => void;
  // Live channel nav extras
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  streamUrl,
  isOpen,
  onClose,
  isLive = false,
  initialTime = 0,
  onTimeUpdate,
  episodes = [],
  currentEpisodeIndex = -1,
  onSelectEpisode,
  onNextChannel,
  onPrevChannel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [vlcNotification, setVlcNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [qualityLevels, setQualityLevels] = useState<string[]>([]);
  const [autoNext, setAutoNext] = useState(true);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const safePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const promise = video.play();
      if (promise !== undefined && typeof promise.then === 'function') {
        playPromiseRef.current = promise;
        promise
          .then(() => {
            playPromiseRef.current = null;
            setIsPlaying(true);
          })
          .catch((err: any) => {
            playPromiseRef.current = null;
            // Silently handle AbortError when play is interrupted by pause or unmount
            if (err && err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
              console.warn('Playback error:', err);
            }
          });
      } else {
        setIsPlaying(true);
      }
    } catch (err: any) {
      if (err && err.name !== 'AbortError') {
        console.warn('Play call error:', err);
      }
    }
  }, []);

  const safePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playPromiseRef.current) {
      // If play() is in flight, wait for resolution before calling pause() to avoid interruption error
      playPromiseRef.current
        .then(() => {
          if (videoRef.current && !videoRef.current.paused) {
            try {
              videoRef.current.pause();
            } catch {}
          }
          setIsPlaying(false);
        })
        .catch(() => {
          if (videoRef.current && !videoRef.current.paused) {
            try {
              videoRef.current.pause();
            } catch {}
          }
          setIsPlaying(false);
        });
    } else {
      try {
        if (!video.paused) {
          video.pause();
        }
      } catch {}
      setIsPlaying(false);
    }
  }, []);

  // Hide controls on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  // Setup HLS / Video playback
  useEffect(() => {
    if (!isOpen || !streamUrl) return;

    const video = videoRef.current;
    if (!video) return;

    setErrorMsg(null);

    // Destroy existing Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls = /\.m3u8($|\?)/i.test(streamUrl) || isLive;
    let onLoadedMetadata: (() => void) | null = null;

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const levels = data.levels.map((lvl) => `${lvl.height}p`);
        setQualityLevels(levels);
        if (initialTime > 0) {
          video.currentTime = initialTime;
        }
        safePlay();
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setErrorMsg('ไม่สามารถเล่นสตรีมผ่านเบราว์เซอร์ได้ (โปรดใช้ปุ่ม "เปิดใน VLC" ด้านล่าง)');
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = streamUrl;
      onLoadedMetadata = () => {
        if (initialTime > 0) video.currentTime = initialTime;
        safePlay();
      };
      video.addEventListener('loadedmetadata', onLoadedMetadata);
    } else {
      // Regular MP4 / WebM
      video.src = streamUrl;
      if (initialTime > 0) video.currentTime = initialTime;
      safePlay();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (onLoadedMetadata && video) {
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
      }
      safePause();
    };
  }, [isOpen, streamUrl, isLive, initialTime, safePlay, safePause]);

  // Video event handlers
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setDuration(video.duration || 0);
    onTimeUpdate?.(video.currentTime, video.duration || 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (!isLive && autoNext && episodes.length > 0 && currentEpisodeIndex >= 0 && currentEpisodeIndex < episodes.length - 1) {
      onSelectEpisode?.(currentEpisodeIndex + 1);
    }
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      safePlay();
    } else {
      safePause();
    }
  }, [safePlay, safePause]);

  const handleClosePlayer = () => {
    safePause();
    onClose();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const seekRelative = (sec: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + sec));
  };

  const toggleFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  // Keyboard navigation & shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((prev) => {
            const v = Math.min(1, prev + 0.1);
            if (videoRef.current) videoRef.current.volume = v;
            return v;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((prev) => {
            const v = Math.max(0, prev - 0.1);
            if (videoRef.current) videoRef.current.volume = v;
            return v;
          });
          break;
        case 'Escape':
          if (!document.fullscreenElement) {
            handleClosePlayer();
          }
          break;
      }
    },
    [isOpen, duration, handleClosePlayer]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Open in VLC / Download Playlist
  const handleOpenVLC = () => {
    safePause();
    const url = streamUrl;
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      const clean = url.replace(/^https?:\/\//i, '');
      window.location.href = `intent://${clean}#Intent;package=org.videolan.vlc;type=video/*;end`;
      setVlcNotification('กำลังส่งข้อมูลเปิด VLC บน Android...');
      return;
    }

    if (isIOS) {
      window.location.href = `vlc://${url}`;
      setVlcNotification('กำลังเปิด VLC บน iOS...');
      return;
    }

    // Windows / Mac / Desktop: download an instant .m3u launcher
    const m3uContent = `#EXTM3U\n#EXTINF:-1,${title}\n${url}\n`;
    const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${title.replace(/[/\\?%*:|"<>]/g, '_')}.m3u`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);

    setVlcNotification('ดาวน์โหลดไฟล์ .m3u แล้ว! กรุณาคลิกเพื่อเปิดใน VLC หรือ PotPlayer');
    setTimeout(() => setVlcNotification(null), 5000);
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onClick={togglePlay}
        className={`w-full h-full transition-all duration-300 ${
          aspectRatio === 'cover'
            ? 'object-cover'
            : aspectRatio === 'fill'
            ? 'object-fill'
            : 'object-contain'
        }`}
      />

      {/* Top Header Bar */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-10 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 max-w-[70%]">
          {isLive ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30">
              <Film className="w-3.5 h-3.5" />
              VOD
            </span>
          )}
          <h1 className="text-white font-semibold text-sm md:text-lg truncate drop-shadow">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* External VLC player launcher button */}
          <button
            onClick={handleOpenVLC}
            title="เปิดในแอป VLC หรือ ดาวน์โหลด M3U"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600/80 hover:bg-orange-500 text-white text-xs font-semibold shadow-lg shadow-orange-900/30 backdrop-blur transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">เปิดใน VLC</span>
          </button>

          <button
            onClick={handleClosePlayer}
            className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* VLC Notification Toast */}
      {vlcNotification && (
        <div className="absolute top-20 bg-slate-900/95 border border-amber-500/60 text-amber-200 text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur z-20 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{vlcNotification}</span>
        </div>
      )}

      {/* Error Notice */}
      {errorMsg && (
        <div className="absolute inset-x-4 max-w-lg mx-auto bg-red-950/90 border border-red-500/80 text-white p-5 rounded-2xl shadow-2xl text-center space-y-3 backdrop-blur z-20">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="font-semibold text-base">ไม่สามารถเล่นไฟล์นี้ผ่านเบราว์เซอร์ได้</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{errorMsg}</p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleOpenVLC}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              เปิดใน VLC ทันที (รองรับทุกระบบ)
            </button>
            <button
              onClick={handleClosePlayer}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-10 space-y-3 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Timeline (for VOD/Series) */}
        {!isLive && duration > 0 && (
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2 transition-all"
            />
            <span className="font-mono">{formatTime(duration)}</span>
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Prev Channel / Prev Episode */}
            {isLive && onPrevChannel && (
              <button
                onClick={onPrevChannel}
                title="ช่องก่อนหน้า"
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
            )}

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full transition-all shadow-lg shadow-amber-500/20"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Next Channel / Next Episode */}
            {isLive && onNextChannel && (
              <button
                onClick={onNextChannel}
                title="ช่องถัดไป"
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            )}

            {!isLive && (
              <>
                <button
                  onClick={() => seekRelative(-10)}
                  title="ย้อนหลัง 10 วินาที"
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => seekRelative(10)}
                  title="ไปข้างหน้า 10 วินาที"
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Volume */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Series next episode button */}
            {!isLive && episodes.length > 0 && currentEpisodeIndex >= 0 && currentEpisodeIndex < episodes.length - 1 && (
              <button
                onClick={() => onSelectEpisode?.(currentEpisodeIndex + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>ตอนถัดไป</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Aspect Ratio Toggle */}
            <button
              onClick={() => {
                const next = aspectRatio === 'contain' ? 'cover' : aspectRatio === 'cover' ? 'fill' : 'contain';
                setAspectRatio(next);
              }}
              title={`ปรับสัดส่วนภาพ: ${aspectRatio}`}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center gap-1 text-xs"
            >
              <Ratio className="w-4 h-4" />
              <span className="text-[10px] uppercase font-mono hidden md:inline">{aspectRatio}</span>
            </button>

            {/* Settings Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettings && (
                <div className="absolute bottom-12 right-0 w-48 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-3 z-30">
                  <div>
                    <div className="text-slate-400 font-semibold mb-1">ความเร็ว (Speed)</div>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.75, 1, 1.25, 1.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`py-1 rounded text-center font-mono ${
                            playbackRate === rate ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-white'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {!isLive && (
                    <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-slate-800 text-slate-300">
                      <span>เล่นตอนถัดไปอัตโนมัติ</span>
                      <input
                        type="checkbox"
                        checked={autoNext}
                        onChange={(e) => setAutoNext(e.target.checked)}
                        className="rounded accent-amber-500"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
