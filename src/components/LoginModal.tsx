import React, { useState, useEffect } from 'react';
import {
  Tv,
  KeyRound,
  FileText,
  Sparkles,
  Server,
  User,
  Lock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  CheckCircle,
  HelpCircle,
  Upload,
  CreditCard,
  Info,
} from 'lucide-react';
import { parseM3uPlaylist } from '../services/iptvApi';
import { Category, LiveStream } from '../types/iptv';

interface LoginModalProps {
  isOpen: boolean;
  onLoginXtream: (server: string, user: string, pass: string, anyname: string) => Promise<void>;
  onLoginM3u: (categories: Category[], items: LiveStream[], playlistName: string) => void;
  onOpenTutorial: () => void;
  onOpenSubscription: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginXtream,
  onLoginM3u,
  onOpenTutorial,
  onOpenSubscription,
}) => {
  const [mode, setMode] = useState<'xtream' | 'm3u'>('xtream');

  // Xtream Fields with provided server and credentials
  const [serverUrl, setServerUrl] = useState('http://103.114.203.129:8080');
  const [anyname, setAnyname] = useState('PlayID IPTV Thailand');
  const [username, setUsername] = useState('playidtv2535');
  const [password, setPassword] = useState('12345');
  const [rememberMe, setRememberMe] = useState(true);

  // M3U Fields
  const [m3uUrl, setM3uUrl] = useState('');
  const [m3uContent, setM3uContent] = useState('');
  const [m3uPlaylistName, setM3uPlaylistName] = useState('My M3U Playlist');

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load saved credentials from localStorage or use default playidtv2535
  useEffect(() => {
    try {
      const saved = localStorage.getItem('iptv_saved_login');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.serverUrl) setServerUrl(parsed.serverUrl);
        if (parsed.username) setUsername(parsed.username);
        if (parsed.password) setPassword(parsed.password);
        if (parsed.anyname) setAnyname(parsed.anyname);
      } else {
        setServerUrl('http://103.114.203.129:8080');
        setUsername('playidtv2535');
        setPassword('12345');
        setAnyname('PlayID IPTV Thailand');
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const handleXtreamSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน (หรือใช้ไอดี playidtv2535 / 12345)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('กำลังเชื่อมต่อเซิร์ฟเวอร์ และประมวลผลข้อมูลเข้าสู่ระบบของคุณ...');

    if (rememberMe) {
      localStorage.setItem(
        'iptv_saved_login',
        JSON.stringify({ serverUrl, username, password, anyname })
      );
    } else {
      localStorage.removeItem('iptv_saved_login');
    }

    try {
      await onLoginXtream(serverUrl, username, password, anyname);
      setStatusMessage('เข้าสู่ระบบสำเร็จ! กำลังโหลดช่องรายการ...');
    } catch (err: any) {
      setErrorMessage(err.message || 'เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาตรวจสอบข้อมูล');
      setIsLoading(false);
      setStatusMessage(null);
    }
  };

  const handleDefaultAccountLogin = async () => {
    const sUrl = 'http://103.114.203.129:8080';
    const uName = 'playidtv2535';
    const pWord = '12345';
    const aName = 'PlayID IPTV Thailand';

    setServerUrl(sUrl);
    setUsername(uName);
    setPassword(pWord);
    setAnyname(aName);

    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('กำลังเข้าสู่ระบบด้วยไอดี playidtv2535 (http://103.114.203.129:8080)...');

    localStorage.setItem(
      'iptv_saved_login',
      JSON.stringify({ serverUrl: sUrl, username: uName, password: pWord, anyname: aName })
    );

    try {
      await onLoginXtream(sUrl, uName, pWord, aName);
    } catch (err: any) {
      setErrorMessage(err.message || 'เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ');
      setIsLoading(false);
      setStatusMessage(null);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('กำลังเชื่อมต่อช่องทดลองรับชมฟรี (Demo Line)...');
    try {
      await onLoginXtream('http://103.114.203.129:8080', 'demo_thai', 'demo1234', 'IPTV Demo Thai');
    } catch (err: any) {
      setErrorMessage(err.message || 'เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ');
      setIsLoading(false);
      setStatusMessage(null);
    }
  };

  const handleM3uUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!m3uUrl.trim()) {
      setErrorMessage('กรุณาระบุ URL ของเพลย์ลิสต์ M3U');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('กำลังดาวน์โหลดและวิเคราะห์ไฟล์ M3U...');

    try {
      let text = '';
      try {
        const res = await fetch(m3uUrl);
        text = await res.text();
      } catch {
        const proxyRes = await fetch(`/api/proxy?url=${encodeURIComponent(m3uUrl)}`);
        text = await proxyRes.text();
      }

      if (!text || !text.includes('#EXTM3U')) {
        throw new Error('รูปแบบไฟล์ M3U ไม่ถูกต้อง (ต้องขึ้นต้นด้วย #EXTM3U)');
      }

      const { categories, items } = parseM3uPlaylist(text);
      if (items.length === 0) {
        throw new Error('ไม่พบช่องรายการในเพลย์ลิสต์นี้');
      }

      onLoginM3u(categories, items, m3uPlaylistName || 'M3U Playlist');
    } catch (err: any) {
      setErrorMessage(err.message || 'ไม่สามารถโหลดเพลย์ลิสต์ M3U ได้');
      setIsLoading(false);
      setStatusMessage(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setM3uContent(content);
        const { categories, items } = parseM3uPlaylist(content);
        if (items.length > 0) {
          onLoginM3u(categories, items, file.name.replace(/\.[^/.]+$/, ''));
        } else {
          setErrorMessage('ไม่พบช่องรายการในไฟล์นี้');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Banner */}
        <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 text-white text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-950/40 backdrop-blur flex items-center justify-center shadow-inner mb-3">
            <Tv className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">IPTV THAILAND</h2>
          <p className="text-xs text-amber-100 mt-1">
            เว็บเพลเยอร์ระดับพรีเมียม รองรับ Xtream Codes API & M3U Playlist
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 p-1.5 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('xtream');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              mode === 'xtream'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Xtream Codes API
          </button>
          <button
            onClick={() => {
              setMode('m3u');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              mode === 'm3u'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            M3U Playlist
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 bg-amber-950/50 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-center gap-2.5 animate-pulse">
              <Loader2 className="w-4 h-4 shrink-0 animate-spin text-amber-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Guide Card: เข้าสู่ระบบ ต้องสมัครสมาชิกก่อนหรือต้องมีไอดี */}
          <div className="p-3.5 bg-slate-950/80 border border-amber-500/30 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-semibold text-xs flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                เข้าสู่ระบบ: ต้องสมัครสมาชิกก่อน หรือมีไอดีเข้าได้เลย?
              </span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">✓ มีไอดีแล้ว:</span>
                <span>สามารถใส่ Username & Password หรือกดปุ่ม <strong>"⚡ ล็อกอินด้วยไอดี playidtv2535"</strong> ด้านล่างนี้เพื่อเชื่อมต่อเซิร์ฟเวอร์ได้ทันที</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">✦ ยังไม่มีไอดี:</span>
                <span>สามารถกดสมัครสมาชิกเพื่อรับ Username / Password ส่วนตัวผ่าน WhatsApp หรือ อีเมล (แพ็กเกจ 30 วัน 129.- ไปจนถึง 1 ปี VIP 799.-)</span>
              </div>
            </div>
            <div className="pt-1 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDefaultAccountLogin}
                disabled={isLoading}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>⚡ ล็อกอินด้วยไอดี playidtv2535 (1-คลิก)</span>
              </button>
              <button
                type="button"
                onClick={onOpenSubscription}
                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>สมัครสมาชิกใหม่ (ดูแพ็กเกจ)</span>
              </button>
            </div>
          </div>

          {mode === 'xtream' ? (
            <form onSubmit={handleXtreamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ชื่อเพลย์ลิสต์ (Any Name)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Tv className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={anyname}
                    onChange={(e) => setAnyname(e.target.value)}
                    placeholder="เช่น IPTV Thailand"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  URL เซิร์ฟเวอร์ (Server URL)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Server className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    placeholder="http://103.114.203.129:8080"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ชื่อผู้ใช้ (Username)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    รหัสผ่าน (Password)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs md:text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>จดจำข้อมูลการเข้าสู่ระบบ</span>
                </label>

                <button
                  type="button"
                  onClick={onOpenSubscription}
                  className="text-amber-400 hover:underline font-medium"
                >
                  ยังไม่มีบัญชี? สมัครที่นี่
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังเชื่อมต่อ...</span>
                  </>
                ) : (
                  <>
                    <span>เข้าสู่ระบบ & เริ่มรับชม</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleM3uUrlSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ชื่อเพลย์ลิสต์
                  </label>
                  <input
                    type="text"
                    value={m3uPlaylistName}
                    onChange={(e) => setM3uPlaylistName(e.target.value)}
                    placeholder="เช่น My Thailand M3U"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    วาง M3U Playlist URL
                  </label>
                  <input
                    type="url"
                    value={m3uUrl}
                    onChange={(e) => setM3uUrl(e.target.value)}
                    placeholder="http://server.com/get.php?username=...&type=m3u_plus"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  โหลดจาก URL M3U
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-slate-500 text-[10px] uppercase">หรืออัปโหลดไฟล์</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div>
                <label className="w-full border-2 border-dashed border-slate-700 hover:border-amber-500/70 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-300 font-medium">เลือกไฟล์ .m3u หรือ .m3u8</span>
                  <span className="text-[10px] text-slate-500">รองรับเพลย์ลิสต์ทุกขนาด</span>
                  <input
                    type="file"
                    accept=".m3u,.m3u8,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Quick Demo Testline Button */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              type="button"
              className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-medium rounded-xl text-xs flex items-center justify-center gap-2 border border-amber-500/20 transition-all hover:border-amber-500/50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ทดลองใช้งานทันที (Demo Test Line ฟรี)</span>
            </button>

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
              <button
                type="button"
                onClick={onOpenTutorial}
                className="hover:text-blue-400 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                วิธีดูผ่าน TiviMate / IPTV Smarters
              </button>

              <button
                type="button"
                onClick={onOpenSubscription}
                className="hover:text-amber-400 font-semibold"
              >
                ดูราคาและแพ็กเกจ (เริ่มเพียง 129.-)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
