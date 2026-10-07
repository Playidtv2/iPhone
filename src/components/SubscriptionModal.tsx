import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Send,
  Zap,
  ShieldCheck,
  Clock,
  Tv,
  MessageCircle,
  ExternalLink,
  Smartphone,
  Flame,
  Award,
} from 'lucide-react';
import { DEMO_PLANS } from '../services/mockData';
import { SubscriptionPlan } from '../types/iptv';
import confetti from 'canvas-confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanLogin?: (plan: SubscriptionPlan) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(DEMO_PLANS[3]); // Default to 1 Year (699.-)
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedLine, setCopiedLine] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setActiveStep(2);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const lineId = 'mGZ04jWToY';
  const lineUrl = `https://line.me/ti/p/~${lineId}`;

  const copyBankInfo = () => {
    navigator.clipboard.writeText('258-0927818');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const copyLineId = () => {
    navigator.clipboard.writeText(lineId);
    setCopiedLine(true);
    setTimeout(() => setCopiedLine(false), 2000);
  };

  const handleLineClick = () => {
    window.open(lineUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Header gradient banner */}
        <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-6 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            IPTV Thailand Official Subscription
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            สมัครสมาชิก IPTV & เลือกแผนที่คุณต้องการ
          </h2>
          <p className="text-amber-100 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
            โอนชำระเงินแล้วแนบสลิปส่งทาง <strong>LINE (Line ID: {lineId})</strong> เพื่อขอรับ Username/Password
            ข้อมูลเซิร์ฟเวอร์ Xtream Codes (http://103.114.203.129:8080) ได้ทันทีภายในไม่กี่นาที
          </p>
        </div>

        {/* Step indicator */}
        <div className="grid grid-cols-3 bg-slate-950/80 border-b border-slate-800 text-xs md:text-sm font-medium">
          <button
            onClick={() => setActiveStep(1)}
            className={`py-3 px-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeStep === 1
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>เลือกราคาแพ็กเกจ</span>
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`py-3 px-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeStep === 2
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>โอนเงิน & ส่งสลิป LINE</span>
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`py-3 px-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeStep === 3
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>เปิดรับชมทันที</span>
          </button>
        </div>

        <div className="p-5 md:p-8 max-h-[75vh] overflow-y-auto">
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  เลือกแพ็กเกจที่ต้องการใช้งาน
                </h3>
                <p className="text-slate-400 text-xs md:text-sm mt-1">
                  ทุกแพ็กเกจรองรับ TV / มือถือ / คอมพิวเตอร์ สัญญาณสตรีมมิ่งความเร็วสูง ดูได้ลื่นไหล ไม่สะดุด
                </p>
              </div>

              {/* Plans 6-Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_PLANS.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/40 scale-[1.02]'
                          : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Badge / Tag */}
                      {plan.tag && (
                        <div
                          className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-black px-3 py-0.5 rounded-full shadow-md ${
                            plan.bestValue
                              ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 text-slate-950'
                              : plan.popular
                              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                              : 'bg-slate-800 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {plan.tag}
                        </div>
                      )}

                      <div>
                        {/* Header icon and title */}
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{plan.icon}</span>
                          <div>
                            <h4 className="text-base font-bold text-white">{plan.name}</h4>
                            <span className="text-[11px] font-semibold text-emerald-400 block">
                              {plan.devices}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-4 pt-3 border-t border-slate-800/80">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-black text-amber-400">
                              {plan.price}.-
                            </span>
                            <span className="text-xs text-slate-400">/ {plan.period}</span>
                          </div>
                          {plan.subRate && (
                            <div className="text-xs text-amber-200/90 font-medium mt-1">
                              {plan.subRate}
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <ul className="mt-4 space-y-2 text-xs text-slate-300">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Select Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(plan);
                        }}
                        className={`mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        <span>{plan.buttonText || 'สมัครแพ็กเกจ'}</span>
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Next Button */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400">
                  แพ็กเกจที่เลือก: <strong className="text-white font-bold">{selectedPlan.name} ({selectedPlan.price}.-)</strong>
                </div>
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <span>ไปที่ขั้นตอนโอนเงิน & ส่งสลิป LINE</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              {/* Summary box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedPlan.icon}</span>
                  <div>
                    <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                      แพ็กเกจที่คุณเลือก:
                    </span>
                    <h4 className="text-xl font-bold text-white">{selectedPlan.name}</h4>
                    <p className="text-xs text-slate-400">
                      {selectedPlan.devices} • {selectedPlan.subRate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">ยอดที่ต้องชำระ:</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-amber-400">
                      {selectedPlan.price}.- บาท
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs text-slate-400 hover:text-amber-400 underline ml-2"
                  >
                    เปลี่ยน
                  </button>
                </div>
              </div>

              {/* Bank & Line Details Box */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bank Transfer & PromptPay QR info */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <span>ช่องทางชำระเงิน (ธนาคาร & QR พร้อมเพย์)</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      ยอดชำระ {selectedPlan.price}.-
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-3.5">
                    {/* PromptPay QR Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="bg-white p-2 rounded-xl shrink-0 shadow-md flex flex-col items-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=00020101021129370016A000000677010111011300668900000005802TH5303764540${selectedPlan.price.toFixed(2).length < 10 ? '0' + selectedPlan.price.toFixed(2).length : selectedPlan.price.toFixed(2).length}${selectedPlan.price.toFixed(2)}6304`}
                          alt="PromptPay QR Code"
                          className="w-28 h-28 object-contain"
                          onError={(e) => {
                            // Fallback clean QR graphic if offline
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="text-[10px] font-bold text-slate-800 mt-1">PromptPay QR</span>
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="text-xs font-bold text-amber-400">สแกนจ่ายผ่านแอปธนาคารได้ทุกธนาคาร</div>
                        <div className="text-sm font-extrabold text-white">ยอดเงิน: {selectedPlan.price} บาท</div>
                        <p className="text-[11px] text-slate-400">
                          เปิดแอปธนาคารของคุณ สแกน QR Code นี้เพื่อชำระเงินได้ทันทีโดยไม่ต้องพิมพ์ยอดเงิน
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">หรือโอนผ่านธนาคาร:</span>
                      <strong className="text-sm text-white font-semibold flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                        ธนาคารกรุงเทพ (Bangkok Bank)
                      </strong>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-xs text-slate-400">เลขที่บัญชี:</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-lg md:text-xl font-mono text-amber-400 tracking-wider">
                          258-0927818
                        </strong>
                        <button
                          onClick={copyBankInfo}
                          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg flex items-center gap-1 text-xs font-semibold transition-colors"
                        >
                          {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedBank ? 'คัดลอกแล้ว' : 'คัดลอก'}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-xs text-slate-400">ชื่อบัญชี:</span>
                      <strong className="text-sm text-white font-semibold">
                        มุสลิม ยาการียา
                      </strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    * เมื่อโอนเงินเรียบร้อยแล้ว กรุณาแคปรูปสลิปแล้วกดส่งทาง LINE เพื่อรับ Username/Password ทันที
                  </p>
                </div>

                {/* LINE Contact and Slip Submission */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                      <MessageCircle className="w-5 h-5" />
                      <span>แจ้งโอนเงิน & รับบัญชีใช้งานผ่าน LINE</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      โอนชำระเงินแล้วแนบสลิปส่งทาง LINE เพื่อขอรับ Username/Password ได้ทันที
                      ทีมงานพร้อมส่งข้อมูลเซิร์ฟเวอร์ Xtream Codes ให้ภายใน 1-3 นาที
                    </p>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Line ID:</span>
                        <strong className="font-mono text-sm text-emerald-400">{lineId}</strong>
                      </div>
                      <button
                        onClick={copyLineId}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1 transition-colors"
                      >
                        {copiedLine ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedLine ? 'คัดลอกแล้ว' : 'คัดลอก ID'}
                      </button>
                    </div>

                    {/* Upload Slip Box */}
                    <div className="p-3 bg-slate-900/60 border border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl transition-colors">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 truncate">
                          <div className="text-xs font-semibold text-white">เตรียมสลิปเพื่อส่งให้แอดมิน</div>
                          <div className="text-[11px] text-slate-400">แตะปุ่มด้านล่างเพื่อเปิด LINE และส่งรูปสลิป</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Big Green Line CTA button */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleLineClick}
                      className="w-full py-3.5 px-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all hover:scale-[1.01]"
                    >
                      <MessageCircle className="w-5 h-5 fill-current" />
                      <span>แอดไลน์ส่งสลิป / แจ้งสมัครใช้งานคลิกที่นี่</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <div className="text-center text-[11px] text-slate-500">
                      Line ID: <strong className="text-emerald-400">{lineId}</strong> (แอดเพื่อนแล้วส่งสลิปได้เลย)
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps Guide 4 points from user prompt */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <span>📌 ขั้นตอนการสมัครและแจ้งโอน</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                      1
                    </span>
                    <strong className="text-white block pt-1">เลือกราคาแพ็กเกจ</strong>
                    <p className="text-slate-400 text-[11px]">
                      เลือกแพ็กเกจที่ต้องการ (เช่น 129.-, 699.- หรือ ตลอดชีพ VIP 1200.-)
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                      2
                    </span>
                    <strong className="text-white block pt-1">โอนเงินเข้าบัญชี</strong>
                    <p className="text-slate-400 text-[11px]">
                      โอนผ่านแอปธนาคารเข้า ธ.กรุงเทพ 258-0927818 (มุสลิม ยาการียา)
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                      3
                    </span>
                    <strong className="text-white block pt-1">ส่งสลิปทาง LINE</strong>
                    <p className="text-slate-400 text-[11px]">
                      กดปุ่มไลน์ด้านบน ส่งรูปสลิปการโอนเงินให้แอดมิน (Line ID: {lineId})
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                      4
                    </span>
                    <strong className="text-white block pt-1">รับรหัส & ดูได้ทันที!</strong>
                    <p className="text-slate-400 text-[11px]">
                      รับข้อมูลบัญชีเข้าใช้งาน และเปิดรับชมความบันเทิงได้ทันที!
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer navigation buttons */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ย้อนกลับไปเลือกแพ็กเกจ
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  ดูรูปแบบข้อมูลบัญชีที่คุณจะได้รับ
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                  <Tv className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">
                  ข้อมูลบัญชี Xtream Codes ที่คุณจะได้รับทาง LINE
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                  เมื่อแอดมินตรวจสอบสลิปแล้ว จะส่งข้อมูลล็อกอินเข้าใช้งาน 3 ช่องทางหลักนี้ให้คุณทันที:
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto text-left font-mono text-xs space-y-2.5 mt-4 text-slate-300 shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Server URL:</span>
                    <span className="text-amber-400 font-bold">http://103.114.203.129:8080</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Username:</span>
                    <span className="text-emerald-400 font-bold">[ชื่อผู้ใช้ของคุณ]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Password:</span>
                    <span className="text-emerald-400 font-bold">[รหัสผ่านของคุณ]</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-slate-500">M3U Playlist:</span>
                    <span className="text-cyan-400 truncate max-w-[200px]">
                      http://103.114.203.129:8080/get.php?...
                    </span>
                  </div>
                </div>
              </div>

              {/* LINE CTA again */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#06C755] flex items-center justify-center text-white shrink-0">
                    <MessageCircle className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">แอดไลน์ส่งสลิปเพื่อรับสิทธิ์ใช้งาน</h5>
                    <p className="text-xs text-emerald-300">Line ID: {lineId}</p>
                  </div>
                </div>
                <button
                  onClick={handleLineClick}
                  className="px-5 py-2.5 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shrink-0"
                >
                  <span>เปิด LINE ตอนนี้</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ย้อนกลับไปหน้าเลขที่บัญชี
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  ปิดหน้าต่าง & เริ่มใช้งาน
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
