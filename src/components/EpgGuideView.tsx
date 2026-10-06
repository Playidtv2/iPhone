import React, { useState } from 'react';
import { Calendar, Clock, Tv, Play, ChevronRight, Info } from 'lucide-react';
import { LiveStream, EpgProgram } from '../types/iptv';

interface EpgGuideViewProps {
  channels: LiveStream[];
  onPlayChannel: (channel: LiveStream) => void;
}

export const EpgGuideView: React.FC<EpgGuideViewProps> = ({
  channels,
  onPlayChannel,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<LiveStream>(channels[0] || null);

  // Generate mock realistic EPG schedule for Thai TV
  const now = new Date();
  const currentHour = now.getHours();

  const generateProgramsForChannel = (chName: string) => {
    return [
      {
        id: '1',
        title: `ข่าวเช้า & เกาะติดสถานการณ์ (${chName})`,
        time: '06:00 - 08:30',
        desc: 'รายงานข่าวสารรอบวัน เศรษฐกิจ การเมือง และสภาพภูมิอากาศทั่วประเทศ',
        isCurrent: currentHour >= 6 && currentHour < 9,
        progress: currentHour === 7 ? 60 : 100,
      },
      {
        id: '2',
        title: 'รายการวาไรตี้บันเทิงยามสาย',
        time: '08:30 - 11:00',
        desc: 'สาระความรู้ สุขภาพ อาหารอร่อย และแขกรับเชิญพิเศษ',
        isCurrent: currentHour >= 9 && currentHour < 11,
        progress: currentHour === 10 ? 45 : 0,
      },
      {
        id: '3',
        title: 'ข่าวเที่ยงทันเหตุการณ์ & เจาะลึกประเด็นร้อน',
        time: '11:00 - 13:00',
        desc: 'อัปเดตข่าวใหญ่ประจำวัน สดตรงจากพื้นที่',
        isCurrent: currentHour >= 11 && currentHour < 13,
        progress: currentHour === 12 ? 50 : 0,
      },
      {
        id: '4',
        title: 'ซีรีส์ / ภาพยนตร์บ่ายยอดนิยม',
        time: '13:00 - 16:00',
        desc: 'ความบันเทิงเต็มรูปแบบ พากย์ไทยคมชัด Full HD',
        isCurrent: currentHour >= 13 && currentHour < 16,
        progress: currentHour === 14 ? 35 : 0,
      },
      {
        id: '5',
        title: 'คุยข่าวเด่น & รายการวิเคราะห์ข่าวยามเย็น',
        time: '16:00 - 18:00',
        desc: 'เกาะติดประเด็นดังในสังคม สัมภาษณ์สดบุคคลในกระแส',
        isCurrent: currentHour >= 16 && currentHour < 18,
        progress: currentHour === 17 ? 70 : 0,
      },
      {
        id: '6',
        title: 'ข่าวภาคค่ำ & พระราชสำนัก',
        time: '18:00 - 20:30',
        desc: 'สรุปข่าวใหญ่รอบวันทั้งในและต่างประเทศ',
        isCurrent: currentHour >= 18 && currentHour < 21,
        progress: currentHour === 19 ? 40 : 0,
      },
      {
        id: '7',
        title: 'ถ่ายทอดสดฟุตบอล / ละครไพรม์ไทม์แห่งปี',
        time: '20:30 - 22:45',
        desc: 'รายการยอดนิยมอันดับ 1 ถ่ายทอดสดระดับ 4K / Full HD เสียงพากย์สด',
        isCurrent: currentHour >= 21 && currentHour < 23,
        progress: currentHour === 21 ? 25 : 0,
      },
      {
        id: '8',
        title: 'มิดไนท์ มูฟวี่ / ข่าวดึก',
        time: '22:45 - 01:00',
        desc: 'ภาพยนตร์รอบดึก และสรุปข่าวรอบโลก',
        isCurrent: currentHour >= 23 || currentHour < 2,
        progress: currentHour === 23 ? 15 : 0,
      },
    ];
  };

  const programs = selectedChannel ? generateProgramsForChannel(selectedChannel.name) : [];

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>ผังรายการทีวีล่วงหน้า (EPG Guide)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ตรวจดูตารางการออกอากาศวันนี้ และกดรับชมสดได้ทันที
          </p>
        </div>

        {selectedChannel && (
          <button
            onClick={() => onPlayChannel(selectedChannel)}
            className="self-start sm:self-auto py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>รับชมช่องนี้สดทันที ({selectedChannel.name})</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 h-[65vh] overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            เลือกช่องรายการ ({channels.length} ช่อง)
          </h3>
          {channels.map((ch) => {
            const isSelected = selectedChannel?.stream_id === ch.stream_id;
            return (
              <button
                key={ch.stream_id}
                onClick={() => setSelectedChannel(ch)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden">
                    {ch.stream_icon ? (
                      <img src={ch.stream_icon} alt="" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Tv className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                  <span className="text-xs truncate">{ch.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Schedule timeline */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 h-[65vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs text-amber-400 font-semibold uppercase">ตารางออกอากาศ</span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {selectedChannel ? selectedChannel.name : 'กรุณาเลือกช่อง'}
              </h3>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>วันนี้ ({now.toLocaleDateString('th-TH')})</span>
            </div>
          </div>

          <div className="space-y-3">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className={`p-4 rounded-xl border transition-all ${
                  prog.isCurrent
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/40 border-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          prog.isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {prog.time}
                      </span>
                      {prog.isCurrent && (
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          กำลังออกอากาศ
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-1">{prog.title}</h4>
                    <p className="text-xs text-slate-400">{prog.desc}</p>
                  </div>

                  {prog.isCurrent && selectedChannel && (
                    <button
                      onClick={() => onPlayChannel(selectedChannel)}
                      className="p-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow"
                      title="กดรับชมสด"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  )}
                </div>

                {prog.isCurrent && (
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${prog.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
