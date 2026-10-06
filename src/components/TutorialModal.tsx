import React, { useState } from 'react';
import {
  X,
  Tv,
  Smartphone,
  Layers,
  HelpCircle,
  Copy,
  Check,
  PlayCircle,
  ListVideo,
  Bookmark,
  Calendar,
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverUrl?: string;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  serverUrl = 'http://103.114.203.129:8080',
}) => {
  const [tab, setTab] = useState<'tivimate' | 'smarters' | 'smarttv' | 'epg'>('tivimate');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const copyServer = () => {
    navigator.clipboard.writeText(serverUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 px-6 py-5 text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              คู่มือการตั้งค่าและการรับชม
            </div>
            <h2 className="text-xl md:text-2xl font-bold mt-0.5">
              การติดตั้งบน TiviMate, IPTV Smarters และ Smart TV
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 text-xs md:text-sm font-medium overflow-x-auto">
          <button
            onClick={() => setTab('tivimate')}
            className={`py-3 px-5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              tab === 'tivimate'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-4 h-4" />
            TiviMate (แนะนำสำหรับ TV)
          </button>
          <button
            onClick={() => setTab('smarters')}
            className={`py-3 px-5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              tab === 'smarters'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            IPTV Smarters Pro (มือถือ/TV)
          </button>
          <button
            onClick={() => setTab('smarttv')}
            className={`py-3 px-5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              tab === 'smarttv'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Smart TV (Samsung/LG)
          </button>
          <button
            onClick={() => setTab('epg')}
            className={`py-3 px-5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              tab === 'epg'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            การตั้งค่า EPG & การบันทึก
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 max-h-[68vh] overflow-y-auto space-y-5 text-sm text-slate-300">
          {tab === 'tivimate' && (
            <div className="space-y-4">
              <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-4 flex items-start gap-3">
                <PlayCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <strong className="text-white">TiviMate IPTV Player</strong> คือแอปพลิเคชันเครื่องเล่น IPTV
                  ที่ดีที่สุดสำหรับ Android TV, Chromecast with Google TV, และ FireStick รองรับอินเทอร์เฟซแบบกล่องเคเบิลทีวีระดับพรีเมียม
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white text-base">ขั้นตอนการเพิ่มเพลย์ลิสต์ใน TiviMate:</h4>
                <ol className="list-decimal list-inside space-y-2.5 text-xs md:text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <li className="leading-relaxed">
                    เปิดแอป <span className="text-blue-400 font-semibold">TiviMate</span> บนกล่องหรือทีวีของคุณ
                  </li>
                  <li className="leading-relaxed">
                    แตะที่เมนู <span className="text-amber-400 font-semibold">Add Playlist</span> (เพิ่มเพลย์ลิสต์)
                  </li>
                  <li className="leading-relaxed">
                    เลือกรูปแบบ <span className="text-emerald-400 font-semibold">Xtream Codes API</span> (แนะนำที่สุด) หรือ M3U Playlist
                  </li>
                  <li className="leading-relaxed">
                    ป้อนข้อมูลประจำตัว IPTV ประเทศไทยของคุณ:
                    <div className="my-2 p-3 bg-slate-900 border border-slate-700/80 rounded-lg font-mono text-xs space-y-1.5 text-slate-200">
                      <div className="flex items-center justify-between">
                        <span>Server URL: <strong>{serverUrl}</strong></span>
                        <button
                          onClick={copyServer}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded flex items-center gap-1 text-[11px]"
                        >
                          {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedUrl ? 'คัดลอกแล้ว' : 'คัดลอก'}
                        </button>
                      </div>
                      <div>Username: <strong>[ชื่อผู้ใช้ของคุณจาก WhatsApp/อีเมล]</strong></div>
                      <div>Password: <strong>[รหัสผ่านของคุณ]</strong></div>
                    </div>
                  </li>
                  <li className="leading-relaxed">
                    แตะ <strong>Next</strong> แล้วเลือกชื่อเพลย์ลิสต์ (เช่น "IPTV Thailand")
                  </li>
                  <li className="leading-relaxed">
                    ระบบจะเริ่มดาวน์โหลดช่องรายการและผังรายการ EPG โดยใช้เวลา 1-3 นาทีขึ้นอยู่กับความเร็วเน็ต
                  </li>
                  <li className="leading-relaxed">
                    ช่องรายการของคุณจะถูกจัดเรียงตามหมวดหมู่อย่างเป็นระเบียบ เริ่มรับชมได้เลยครับ! 🎉
                  </li>
                </ol>
              </div>
            </div>
          )}

          {tab === 'smarters' && (
            <div className="space-y-4">
              <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-4 flex items-start gap-3">
                <ListVideo className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <strong className="text-white">IPTV Smarters Pro</strong> รองรับทุกแพลตฟอร์ม ทั้งสมาร์ตโฟน Android, iPhone/iPad, PC Windows, Mac และ Smart TV ใช้งานสะดวกมาก
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white text-base">ขั้นตอนเข้าสู่ระบบใน IPTV Smarters:</h4>
                <ol className="list-decimal list-inside space-y-2.5 text-xs md:text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <li>ดาวน์โหลดแอป <strong>IPTV Smarters Pro</strong> จาก App Store หรือ Google Play</li>
                  <li>เปิดแอปแล้วเลือกตัวเลือก <strong>"Login with Xtream Codes API"</strong></li>
                  <li>
                    กรอกข้อมูลล็อกอิน 4 ช่อง:
                    <div className="my-2 p-3 bg-slate-900 border border-slate-700/80 rounded-lg text-xs space-y-1 font-mono">
                      <div>Any Name: <strong>IPTV Thailand</strong></div>
                      <div>Username: <strong>[ชื่อผู้ใช้ของคุณ]</strong></div>
                      <div>Password: <strong>[รหัสผ่านของคุณ]</strong></div>
                      <div>Server URL: <strong>{serverUrl}</strong></div>
                    </div>
                  </li>
                  <li>แตะปุ่ม <strong>ADD USER</strong></li>
                  <li>ระบบจะดาวน์โหลด Live TV, Movies และ Series เข้าสู่หน้าแดชบอร์ด พร้อมดูได้ทันที</li>
                </ol>
              </div>
            </div>
          )}

          {tab === 'smarttv' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-base">สำหรับ Smart TV (Samsung Tizen / LG webOS):</h4>
              <p className="text-xs md:text-sm text-slate-300">
                หากทีวีของคุณไม่มี TiviMate ในสโตร์ คุณสามารถติดตั้งแอปยอดนิยมต่อไปนี้ได้จาก App Store ของทีวี:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-amber-400 font-bold text-sm">แอป IBO Player / Nanomid</div>
                  <p className="text-slate-400">
                    ค้นหาใน App Store ของทีวี เปิดแอปแล้วนำ Device ID / Key ไปผูกเพลย์ลิสต์ผ่านเว็บ หรือเลือก Xtream Codes
                  </p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-amber-400 font-bold text-sm">Web Browser บนทีวี</div>
                  <p className="text-slate-400">
                    เปิดเว็บเบราว์เซอร์ของทีวีแล้วเปิดเว็บนี้ได้โดยตรง! เว็บเพลเยอร์นี้รองรับการควบคุมผ่านรีโมตทีวีและปุ่มลัด
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === 'epg' && (
            <div className="space-y-4">
              <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-4 flex items-start gap-3">
                <Bookmark className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <strong className="text-white">EPG (Electronic Program Guide) & Catch-up</strong>
                  ช่วยให้คุณดูตารางเวลาถ่ายทอดสด รายการถัดไป และย้อนดูรายการย้อนหลังได้ไม่พลาด
                </div>
              </div>

              <div className="space-y-2 text-xs md:text-sm bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed">
                <p>
                  • <strong>การตั้งค่า EPG:</strong> ในแอป TiviMate ไปที่ Settings → EPG → ป้อน EPG URL (จะมาพร้อมกับ Xtream Codes อัตโนมัติ)
                </p>
                <p>
                  • <strong>การบันทึกรายการ (Recording):</strong> ใน TiviMate คุณสามารถกดปุ่มสีแดงหรือกดปุ่มเมนูบนรีโมตเพื่อสั่งบันทึกลง USB หรือฮาร์ดดิสก์ของทีวีได้ทันที
                </p>
                <p>
                  • <strong>การจัดกลุ่มรายการโปรด (Favorites):</strong> กดปุ่มดาว หรือกดค้างที่ช่องเพื่อเพิ่มลงในรายการโปรด ทำให้เปิดดูช่องหลักได้สะดวกรวดเร็ว
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500">ยินดีต้อนรับสู่ IPTV ประเทศไทย! 🎉</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
