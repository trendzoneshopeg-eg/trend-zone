import React, { useState } from 'react';
import { CreditCard, Award, ArrowUpRight, ArrowDownLeft, Gift, Zap, DollarSign, Clock, RefreshCw, CheckCircle, Shield, Ticket } from 'lucide-react';
import { LoyaltyWallet, Language } from '../types';

interface WalletLoyaltyProps {
  wallet: LoyaltyWallet;
  onConvertPoints: (pointsToConvert: number) => void;
  onWalletTopup: (amount: number, method: string) => void;
  lang: Language;
}

export default function WalletLoyalty({
  wallet,
  onConvertPoints,
  onWalletTopup,
  lang
}: WalletLoyaltyProps) {
  const isAr = lang === 'ar';
  const [topupAmount, setTopupAmount] = useState('');
  const [topupMethod, setTopupMethod] = useState('vodafone_cash');
  const [exchangeMsg, setExchangeMsg] = useState('');
  const [successTopupMsg, setSuccessTopupMsg] = useState('');

  const translations = {
    ar: {
      walletTitle: 'محفظتك والنقاط ونظام الـ VIP',
      walletBalance: 'رصيدك الحالي في المحفظة',
      loyaltyLevelLabel: 'مستوى العضوية بتاعك:',
      loyaltyPointsLabel: 'نقاط التميز الحالية',
      egp: 'ج.م',
      points: 'نقطة',
      topupTitle: 'شحن رصيد المحفظة',
      depositAmt: 'المبلغ المراد شحنه (ج.م):',
      submitTopup: 'تأكيد شحن الرصيد',
      pointsShop: 'استبدال النقاط بفلوس في محفظتك',
      pointsShopDesc: 'حول كل ٢٠٠ نقطة لـ ٢٠ جنيه كاش مجاناً في محفظتك عشان تشتري بيهم أي حاجة.',
      convertBtn: 'استبدل ٢٠٠ نقطة بـ ٢٠ جنيه كاش',
      transactionsTitle: 'سجل معاملات المحفظة السابقة',
      successTopup: 'تم شحن رصيد المحفظة بنجاح وتقدر تستخدمه دلوقتي في الشراء!',
      successConvert: 'تم تحويل النقاط لرصيد في محفظتك بنجاح!'
    },
    en: {
      walletTitle: 'Bespoke Wallet & Loyalty Prestige Hub',
      walletBalance: 'Available Digital Wallet Balance',
      loyaltyLevelLabel: 'Calculated Loyalty Prestige Tier:',
      loyaltyPointsLabel: 'Total Certified Loyalty Points',
      egp: 'EGP',
      points: 'Points',
      topupTitle: 'Fund / Top up your digital wallet with high-speed gateways',
      depositAmt: 'Amount to load (EGP):',
      submitTopup: 'Submit topup request',
      pointsShop: 'Prestige Points Conversion Bazaar',
      pointsShopDesc: 'Convert 200 loyalty points into 20 EGP wallet cash for instant checkout purchases.',
      convertBtn: 'Convert 200 pts to 20 EGP',
      transactionsTitle: 'Wallet Activity Ledger & Payments history',
      successTopup: 'Wallet deposit confirmed successfully! Your digital cash is ready for checkout.',
      successConvert: 'Conversion success! Your points were redeemed to live cache instantly.'
    }
  };

  const t = translations[lang];

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt <= 0) return;

    onWalletTopup(amt, topupMethod);
    setSuccessTopupMsg(t.successTopup);
    setTopupAmount('');
    setTimeout(() => setSuccessTopupMsg(''), 4000);
  };

  const handleConvert = () => {
    if (wallet.loyaltyPoints < 200) {
      setExchangeMsg(isAr ? 'عذرًا، رصيد نقاطك الحالي غير كافٍ للاستبدال (الحد الأدنى ٢٠٠ نقطة)' : 'Insufficient points (Min 200 points required)');
      setTimeout(() => setExchangeMsg(''), 3000);
      return;
    }

    onConvertPoints(200);
    setExchangeMsg(t.successConvert);
    setTimeout(() => setExchangeMsg(''), 4000);
  };

  return (
    <div className="space-y-8" id="wallet-loyalty-panel">
      
      {/* Banner design in luxurious futuristic vibe */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#1E090C] text-white border border-white/[0.05] shadow-[0_12px_45px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-brand-neon/6 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="space-y-6 relative z-10">
          <h2 className="text-base font-display font-extrabold flex items-center gap-2 text-glow-red uppercase">
            <Shield className="w-5.5 h-5.5 text-brand-neon" />
            <span>{t.walletTitle}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Main Balance card */}
            <div className="bg-[#181818] p-5 rounded-2xl border border-white/[0.04] flex items-center justify-between hover:border-brand-neon/20 transition-all duration-300">
              <div>
                <span className="text-[9px] text-slate-450 font-bold block mb-1.5 uppercase font-mono tracking-wider">
                  {t.walletBalance}
                </span>
                <span className="text-2xl font-black text-brand-neon font-mono text-glow-red tracking-tight">
                  {wallet.walletBalance} EGP
                </span>
              </div>
              <CreditCard className="w-7 h-7 text-brand-neon shrink-0" />
            </div>

            {/* Points Balance card */}
            <div className="bg-[#181818] p-5 rounded-2xl border border-white/[0.04] flex items-center justify-between hover:border-brand-neon/20 transition-all duration-300">
              <div>
                <span className="text-[9px] text-slate-450 font-bold block mb-1.5 uppercase font-mono tracking-wider">
                  {t.loyaltyPointsLabel}
                </span>
                <span className="text-2xl font-black text-white font-mono tracking-tight">
                  {wallet.loyaltyPoints} {t.points}
                </span>
              </div>
              <Gift className="w-7 h-7 text-rose-450 shrink-0 animate-pulse" />
            </div>

            {/* Level Prestige Badge */}
            <div className="bg-brand-neon/10 p-5 rounded-2xl border-2 border-brand-neon/20 flex flex-col justify-center relative overflow-hidden">
              <span className="text-[9px] text-brand-neon font-bold block uppercase mb-1.5 font-mono tracking-wider">
                {t.loyaltyLevelLabel}
              </span>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-neon animate-bounce" />
                <span className="text-lg font-black tracking-widest text-[#FF4D75] uppercase font-mono text-glow-red">
                  {wallet.loyaltyLevel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Wallet Load section */}
        <div className="bg-[#121212] rounded-2xl p-5 md:p-8 border border-white/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
          <h3 className="text-sm font-display font-bold text-white border-b border-white/[0.04] pb-3 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-brand-neon rounded"></span>
            <span>{t.topupTitle}</span>
          </h3>

          {successTopupMsg && (
            <div className="p-3.5 bg-brand-neon/15 text-rose-250 text-xs rounded-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-neon shrink-0 animate-pulse" />
              <span>{successTopupMsg}</span>
            </div>
          )}

          <form onSubmit={handleTopupSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.depositAmt}</label>
              <input
                type="number"
                placeholder={lang === 'ar' ? 'أدخل القيمة المراد إيداعها...' : 'Enter amount'}
                required
                min={10}
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="w-full text-xs text-white bg-[#161616] border border-white/[0.06] rounded-xl p-3 focus:outline-hidden focus:border-brand-neon font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// حدد محفظة الشحن المعتمدة بمصر</label>
              <select
                value={topupMethod}
                onChange={(e) => setTopupMethod(e.target.value)}
                className="w-full text-xs text-white bg-[#161616] border border-white/[0.06] rounded-xl p-3 focus:outline-hidden cursor-pointer"
              >
                <option value="vodafone_cash" className="bg-[#121212] text-white">فودافون كاش - Vodafone Cash</option>
                <option value="instapay" className="bg-[#121212] text-white">طريق إنستا باي بروتوكول - InstaPay</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black hover:bg-brand-neon hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer font-mono uppercase tracking-wider hover:shadow-[0_0_12px_rgba(255,45,85,0.3)]"
            >
              {t.submitTopup}
            </button>
          </form>
        </div>

        {/* Redeem point system section */}
        <div className="bg-[#121212] rounded-2xl p-5 md:p-8 border border-white/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
          <h3 className="text-sm font-display font-bold text-white border-b border-white/[0.04] pb-3 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-brand-neon rounded"></span>
            <span>{t.pointsShop}</span>
          </h3>

          {exchangeMsg && (
            <div className="p-3.5 bg-[#1C1C1C] text-slate-250 border border-white/[0.06] text-xs rounded-xl font-bold flex items-center gap-2">
              <Ticket className="w-4 h-4 text-brand-neon shrink-0 animate-bounce" />
              <span>{exchangeMsg}</span>
            </div>
          )}

          <div className="p-4 bg-[#161616] border border-white/[0.04] rounded-xl text-xs text-slate-400 space-y-3.5 leading-relaxed font-sans">
            <p>{t.pointsShopDesc}</p>
            <div className="font-bold text-slate-300 font-mono border-t border-white/[0.03] pt-3 flex justify-between items-center text-[11px]">
              <span>// AVAILABLE SYSTEM BALANCE:</span>
              <span className="font-mono text-glow-red text-brand-neon font-black text-sm bg-brand-neon/10 px-3 py-1 border border-brand-neon/20 rounded-md">{wallet.loyaltyPoints} PTS</span>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={wallet.loyaltyPoints < 200}
            className="w-full py-3.5 bg-brand-neon text-white disabled:bg-white/[0.02] disabled:border-white/[0.05] disabled:text-slate-600 border border-transparent font-bold text-xs rounded-xl transition-all cursor-pointer font-mono uppercase tracking-wider"
          >
            {t.convertBtn}
          </button>
        </div>

      </div>

      {/* Transactions Table Log */}
      <div className="bg-[#121212] rounded-2xl p-5 md:p-8 border border-white/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
        <h3 className="text-sm font-display font-bold text-white border-b border-white/[0.04] pb-3 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-3 bg-brand-neon rounded"></span>
          {t.transactionsTitle}
        </h3>

        <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
          {wallet.transactions.map((tx) => (
            <div key={tx.id} className="p-4 bg-[#161616] rounded-xl border border-white/[0.04] flex items-center justify-between text-xs hover:border-brand-neon/20 transition-all" id={`tx-log-${tx.id}`}>
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl border ${
                  tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-brand-neon/10 text-brand-neon border-brand-neon/20'
                }`}>
                  {tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-white font-sans">{tx.description}</h4>
                  <span className="text-[10px] text-slate-500 font-mono block font-light">{tx.date}</span>
                </div>
              </div>

              <div className="text-right font-mono space-y-1">
                <span className={`font-black text-xs ${tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission' ? '+' : '-'}{tx.amount} EGP
                </span>
                <span className="block text-[9px] text-[#FF4D75] font-bold text-glow-red uppercase">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
