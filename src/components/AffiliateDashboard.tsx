import React, { useState } from 'react';
import { Sparkles, DollarSign, TrendingUp, Hand, Key, HelpCircle, Check, Copy, Flame, Clock, Award, CheckCircle } from 'lucide-react';
import { AffiliateProfile, Language } from '../types';

interface AffiliateDashboardProps {
  affiliateProfile: AffiliateProfile;
  onUpdateWithdrawal: (amount: number, method: string) => void;
  lang: Language;
}

export default function AffiliateDashboard({
  affiliateProfile,
  onUpdateWithdrawal,
  lang
}: AffiliateDashboardProps) {
  const isAr = lang === 'ar';
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('vodafone_cash');
  const [successMsg, setSuccessMsg] = useState('');
  const [simulatedClicks, setSimulatedClicks] = useState(affiliateProfile.clicks);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const translations = {
    ar: {
      affiliateTitle: 'بوابة شركاء التسويق (الآفيليت) - تريند زون',
      subtitle: 'تابع أرباحك، عدد النقرات، مبيعات الكوبونات بتاعتك، والعمولات المستحقة بالجنيه المصري أول بأول.',
      clicks: 'عدد النقرات الزائرة',
      conversions: 'المبيعات الناجحة',
      earnings: 'إجمالي العمولات المكتسبة',
      balance: 'الرصيد المتاح للسحب',
      withdrawn: 'الأرباح اللي سحبتها قبل كده',
      requestWithdraw: 'طلب سحب الأرباح',
      amount: 'المبلغ المطلوب سحبه (ج.م):',
      placeholderAmount: 'مثال: 500',
      payoutMethod: 'رقم وطريقة التحويل (فودافون كاش أو إنستاباي)',
      submitRequest: 'تأكيد طلب السحب',
      successWithdraw: 'تم تقديم طلب السحب بنجاح! وهيتم مراجعته وتحويل المبلغ خلال ٢٤ ساعة بالكتير.',
      referralsStream: 'سجل المبيعات والعمولات بتاعتك',
      orderId: 'رقم الطلب',
      com: 'العمولة',
      genLink: 'برنامج كود الخصم والعمولة',
      referralCodeLabel: 'كود الخصم وبوستات الترويج الخاص بيك (بيدي المشتري خصم 10% وبيديلك عمولة):',
      simulationBtn: 'محاكاة نقرات إحصائية (للتجربة)'
    },
    en: {
      affiliateTitle: 'Trend Zone Luxury Affiliate Console',
      subtitle: 'Monitor custom voucher performance, traffic streams, client secure sales, and net commission payout ledger.',
      clicks: 'Total Referrer Link Hits',
      conversions: 'Allocated Conversion Sales',
      earnings: 'Accumulated Gross Commissions',
      balance: 'Available balance for disbursement',
      withdrawn: 'Previously disbursed commissions',
      requestWithdraw: 'Launch custom disbursement request',
      amount: 'Requested checkout balance (EGP):',
      placeholderAmount: 'e.g. 1000 EGP',
      payoutMethod: 'Preferred payout transfer way',
      submitRequest: 'File Payout Ticket',
      successWithdraw: 'Payout request filed successfully. Management manual audit in queue. Transfer within 24 hours.',
      referralsStream: 'Real-time referral commissions trace ledger',
      orderId: 'Matched Order Token',
      com: 'Net Commission earned',
      genLink: 'Self-Service Affiliation Coupon Desk',
      referralCodeLabel: 'Your custom active reward coupon (Guarantees customers 10% off):',
      simulationBtn: 'Simulate Mock referral link click hit'
    }
  };

  const t = translations[lang];

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > affiliateProfile.balance) return;

    onUpdateWithdrawal(amt, withdrawMethod);
    setSuccessMsg(t.successWithdraw);
    setWithdrawAmount('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSimulateClick = () => {
    setSimulatedClicks(prev => prev + 1);
  };

  const copyCouponCode = () => {
    navigator.clipboard.writeText(affiliateProfile.referralCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  return (
    <div className="space-y-8" id="affiliate-system-hub">
      
      {/* Banner in dark premium tone */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#121212] via-[#0D0D0D] to-[#200E12] text-white border border-white/[0.05] shadow-[0_12px_45px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-neon/6 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-neon/10 border border-brand-neon/20 rounded-full text-[10px] font-mono text-brand-neon tracking-wider uppercase">
            <Award className="w-3.5 h-3.5" />
            PARTNER REGISTRY PROTOCOL
          </span>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-glow-red">
            {t.affiliateTitle}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Numerical statistics grid cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-[#121212] p-5 rounded-2xl border border-white/[0.04] text-center space-y-1 hover:border-brand-neon/20 transition-colors">
          <span className="text-[9px] text-slate-500 font-bold block uppercase font-mono tracking-wider">{t.clicks}</span>
          <span className="text-lg font-black text-white font-mono">{simulatedClicks}</span>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/[0.04] text-center space-y-1 hover:border-brand-neon/20 transition-colors">
          <span className="text-[9px] text-slate-500 font-bold block uppercase font-mono tracking-wider">{t.conversions}</span>
          <span className="text-lg font-black text-white font-mono">
            {affiliateProfile.conversions}
          </span>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/[0.04] text-center space-y-1 hover:border-brand-neon/20 transition-colors">
          <span className="text-[9px] text-slate-500 font-bold block uppercase font-mono tracking-wider">{t.earnings}</span>
          <span className="text-lg font-black text-brand-neon font-mono text-glow-red">
            {affiliateProfile.earnings} EGP
          </span>
        </div>

        <div className="bg-[#121212] p-5 rounded-2xl border border-white/[0.04] text-center space-y-1 hover:border-brand-neon/20 transition-colors">
          <span className="text-[9px] text-slate-500 font-bold block uppercase font-mono tracking-wider">{t.withdrawn}</span>
          <span className="text-lg font-black text-slate-450 font-mono">
            {affiliateProfile.withdrawn} EGP
          </span>
        </div>

        <div className="bg-[#181818] p-5 rounded-2xl border-2 border-brand-neon/25 text-center col-span-2 md:col-span-1 space-y-1 shadow-[0_0_15px_rgba(255,45,85,0.08)]">
          <span className="text-[9px] text-brand-neon font-bold block uppercase font-mono tracking-widest">{t.balance}</span>
          <span className="text-lg font-black text-brand-neon font-mono text-glow-red">
            {affiliateProfile.balance} EGP
          </span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: link generation, simulation click button */}
        <div className="bg-[#121212] rounded-2xl p-5 md:p-8 border border-white/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
          <h3 className="text-sm font-display font-bold text-white border-b border-white/[0.04] pb-3 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-brand-neon rounded"></span>
            {t.genLink}
          </h3>

          <div className="p-4 bg-[#161616] border border-white/[0.05] rounded-xl space-y-3.5">
            <span className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
              {t.referralCodeLabel}
            </span>
            <div className="relative">
              <span className="font-mono text-sm block font-black text-white bg-[#0A0A0A] p-4.5 rounded-xl border border-white/[0.06] text-center uppercase tracking-widest">
                {affiliateProfile.referralCode}
              </span>
              <button
                onClick={copyCouponCode}
                className="absolute right-3 top-3.5 p-1.5 bg-brand-neon hover:bg-white text-white hover:text-black rounded-lg cursor-pointer transition-colors"
                title="Copy Coupon"
              >
                {copiedCoupon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <ul className="text-[10px] text-slate-500 space-y-1.5 pt-1.5 list-disc pl-4 font-sans leading-relaxed">
              <li>كل عملية شراء مؤكدة باستخدام كودك تمنحك عمولة بنسبة 10% من قيمة السلة.</li>
              <li>التحويلات تنفذ تلقائيًا فور تأكيد الأدمن لخطوة دفع المشترين.</li>
            </ul>
          </div>

          <button
            onClick={handleSimulateClick}
            className="w-full py-3.5 bg-white hover:bg-brand-neon hover:text-white text-black font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer font-mono uppercase tracking-wider hover:shadow-[0_0_12px_rgba(255,45,85,0.3)]"
          >
            {t.simulationBtn}
          </button>
        </div>

        {/* Right Side: Withdraw requests forms */}
        <div className="bg-[#121212] rounded-2xl p-5 md:p-8 border border-white/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
          <h3 className="text-sm font-display font-bold text-white border-b border-white/[0.04] pb-3 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-brand-neon rounded"></span>
            {t.requestWithdraw}
          </h3>

          {successMsg && (
            <div className="p-3.5 bg-brand-neon/15 text-rose-250 text-xs rounded-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-neon shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.amount}</label>
              <input
                type="number"
                required
                min={50}
                max={affiliateProfile.balance}
                placeholder={t.placeholderAmount}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full text-xs text-white bg-[#161616] border border-white/[0.06] rounded-xl p-3 focus:outline-hidden focus:border-brand-neon font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500 block">
                الحد الأدنى لطلب السحب الفوري هو 50 جنيه مصري.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.payoutMethod}</label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full text-xs text-white bg-[#161616] border border-white/[0.06] rounded-xl p-3 focus:outline-hidden cursor-pointer"
              >
                <option value="vodafone_cash" className="bg-[#121212] text-white">فودافون كاش - Vodafone cash</option>
                <option value="instapay" className="bg-[#121212] text-white">إنستا باي بروتوكول - InstaPay Address</option>
                <option value="bank" className="bg-[#121212] text-white">الحسابات المصرفية المحلية بمصر - Bank transfer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#161616] hover:bg-white hover:text-black hover:border-transparent text-white border border-white/10 font-bold text-xs py-3.5 px-4 rounded-xl transition-all cursor-pointer font-mono uppercase tracking-wider"
            >
              {t.submitRequest}
            </button>
          </form>
        </div>

      </div>

      {/* Referrals commissions log stream */}
      <div className="bg-[#121212] rounded-2xl p-5 md:p-8 border border-white/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
        <h3 className="text-sm font-display font-bold text-white border-b border-white/[0.04] pb-3 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-3 bg-brand-neon rounded"></span>
          {t.referralsStream}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
            <thead>
              <tr className="border-b border-white/[0.05] text-slate-550 text-slate-400 uppercase tracking-wider text-[9px] font-mono">
                <th className="pb-3 pt-1 px-3 text-right">{t.orderId}</th>
                <th className="pb-3 pt-1 px-3 text-right">{lang === 'ar' ? 'القيمة الإجمالية للسلة' : 'Basket Size'}</th>
                <th className="pb-3 pt-1 px-3 text-right">{t.com}</th>
                <th className="pb-3 pt-1 px-3 text-right">{lang === 'ar' ? 'تاريخ المعاملة' : 'Purchase Date'}</th>
                <th className="pb-3 pt-1 px-3 text-right">{lang === 'ar' ? 'حالة مراجعة العمولة' : 'Verification Stage'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {affiliateProfile.referrals.map((ref, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 font-mono font-bold text-white">{ref.orderId}</td>
                  <td className="p-3 font-mono text-slate-400">{ref.amount} EGP</td>
                  <td className="p-3 font-mono font-bold text-brand-neon text-glow-red">{ref.commission} EGP</td>
                  <td className="p-3 text-slate-500 font-mono">{ref.date}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                      ref.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {ref.status === 'paid' ? (isAr ? 'تم سحب الكاش' : 'Disbursed') : (isAr ? 'قيد التدقيق الإداري' : 'In Verification')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
