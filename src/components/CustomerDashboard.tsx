import React, { useState } from 'react';
import { ShoppingCart, Trash2, Heart, Plus, Minus, Truck, Send, CreditCard, CheckCircle, Clock, Copy, AlertCircle, Sparkles, FileImage, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import { Product, Language, CartItem, Order, UserRole, PromoCode } from '../types';
import { GOVERNORATES } from '../mockData';

interface CustomerDashboardProps {
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  onUpdateCartQty: (idx: number, delta: number) => void;
  onRemoveFromCart: (idx: number) => void;
  onClearCart: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCartFromWishlist: (product: Product) => void;
  onPlaceOrder: (orderData: Partial<Order>) => void;
  lang: Language;
  promos?: PromoCode[];
}


export default function CustomerDashboard({
  cart,
  wishlist,
  orders,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onToggleWishlist,
  onAddToCartFromWishlist,
  onPlaceOrder,
  lang,
  promos = []
}: CustomerDashboardProps) {
  const isAr = lang === 'ar';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorateKey, setGovernorateKey] = useState('cairo');
  const [city, setCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'vodafone_cash' | 'instapay' | 'bank_transfer' | 'cash_on_delivery'>('vodafone_cash');
  const [shippingMethod, setShippingMethod] = useState<'egypt_post' | 'bosta' | 'aramex'>('bosta');
  
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(orders[0] || null);
  const [copystate, setCopystate] = useState<'vCash' | 'instaPay' | null>(null);

  // Coupon promo state variables
  const [couponInput, setCouponInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedGov = GOVERNORATES.find(g => g.key === governorateKey) || GOVERNORATES[0];
  const shippingCost = selectedGov.cost;

  // Calculators
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  // Discount validation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discountAmount = Math.floor(cartSubtotal * (appliedPromo.value / 100));
    } else {
      discountAmount = appliedPromo.value;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - discountAmount) + shippingCost;

  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    const found = promos.find(p => p.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (!found) {
      setCouponMsg({
        type: 'error',
        text: isAr ? 'عذراً، هذا الكوبون غير فَعّال أو خاطئ.' : 'Sorry, this coupon code is invalid.'
      });
      setAppliedPromo(null);
      return;
    }
    if (!found.active) {
      setCouponMsg({
        type: 'error',
        text: isAr ? 'هذا الكوبون معطل حالياً من قبل الإدارة.' : 'This coupon is currently inactive.'
      });
      setAppliedPromo(null);
      return;
    }
    if (cartSubtotal < found.minAmount) {
      setCouponMsg({
        type: 'error',
        text: isAr 
          ? `الحد الأدنى لتفعيل هذا الكوبون هو ${found.minAmount} ج.م (سلتك حالياً: ${cartSubtotal} ج.م)`
          : `Minimum spend for this coupon is ${found.minAmount} EGP (your current cart: ${cartSubtotal} EGP)`
      });
      setAppliedPromo(null);
      return;
    }
    
    setAppliedPromo(found);
    setCouponMsg({
      type: 'success',
      text: isAr ? 'تم تطبيق خصم الكابون بنجاح!' : 'Coupon applied successfully!'
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedPromo(null);
    setCouponInput('');
    setCouponMsg(null);
  };


  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      userId: 'user-cust-1',
      userName: fullName || (lang === 'ar' ? 'مستخدم برستيج' : 'Premium Client'),
      items: cart.map(c => ({
        productId: c.product.id,
        productName: isAr ? c.product.nameAr : c.product.nameEn,
        color: c.selectedColor,
        size: c.selectedSize,
        price: c.product.isFlashSale && c.product.flashSalePrice ? c.product.flashSalePrice : c.product.price,
        quantity: c.quantity
      })),
      total: cartTotal,
      status: 'pending',
      paymentMethod,
      paymentProof: paymentScreenshot || undefined,
      shippingMethod,
      shippingAddress: {
        fullName,
        phone,
        governorate: governorateKey,
        city,
        streetAddress
      },
      trackingNumber: `${shippingMethod.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}-EGY`,
      trackingHistory: [
        { status: lang === 'ar' ? 'تم استلام طلبك وجارٍ مراجعة تفاصيل التحويل وتأكيد الشحن' : 'Order received & receipt verification initiated', date: new Date().toISOString().replace('T', ' ').substring(0, 16), location: 'مقر مصر الرئيسي بالمعادي' }
      ],
      date: new Date().toISOString().split('T')[0]
    };

    onPlaceOrder(newOrder);
    setSuccessOrderId(orderId);
    setActiveTrackingOrder(newOrder);
    onClearCart();
    setAppliedPromo(null);
    setCouponInput('');
    setCouponMsg(null);
    
    // Clear form
    setFullName('');
    setPhone('');
    setCity('');
    setStreetAddress('');
    setPaymentScreenshot(null);
  };

  const triggerCopy = (text: string, type: 'vCash' | 'instaPay') => {
    navigator.clipboard.writeText(text);
    setCopystate(type);
    setTimeout(() => setCopystate(null), 2500);
  };

  const translations = {
    ar: {
      myCart: 'سلة الشراء بتاعتك',
      myWishlist: 'المنتجات اللي عجبتك والمحفوظة',
      orderTracking: 'تتبع الشحنة وتحديثات التوصيل',
      emptyCart: 'السلة بتاعتك فاضية دلوقتي.. اكتشف كوليكشن الموضة والساعات والجمال واشتري دلوقتي!',
      subtotal: 'مجموع المنتجات',
      shipping: 'الشحن للمحافظة:',
      total: 'الإجمالي الكلي:',
      egp: 'ج.م',
      shippingCostTip: 'التوصيل لحد باب البيت في {gov} خلال {days} أيام عمل.',
      addressDetails: 'عنوان وبيانات التوصيل',
      fullName: 'الاسم بالكامل',
      phone: 'رقم الموبايل والواتساب للتنسيق',
      govSelect: 'اختار المحافظة',
      city: 'المدينة / المنطقة',
      street: 'العنوان بالتفصيل (الشارع، العمارة، الدور، الشقة)',
      paymentMethod: 'طريقة الدفع',
      shippingAgent: 'شركة الشحن',
      screenshotLabel: 'اكتب رقم المحمول المحول منه أو ارفق صورة من إيصال التحويل (فودافون كاش أو إنستاباي)',
      uploadBtn: 'ارفق صورة الإيصال من هنا...',
      placeOrder: 'تأكيد الطلب وشحن المنتجات',
      paymentGuide: 'طرق تحويل الأموال المتاحة (فودافون كاش أو إنستاباي):',
      vCashPhone: 'رقم فودافون كاش لتحويل الأموال: 01014398129',
      instaId: 'عنوان تحويل إنستاباي (InstaPay IPN): trendzone@instapay',
      copyNotice: 'تم النسخ بنجاح!',
      orderSuccess: 'طلبك وصل تمام! رقم الطلب بتاعك هو: {id}',
      orderTrackingNo: 'كود تتبع الشحن الخاص بك:',
      noOrders: 'مفيش أي طلبات نشطة في حسابك دلوقتي.',
      trackingStatus: 'حالة التوصيل وتحديثات الشحن الحالية:'
    },
    en: {
      myCart: 'Your Premium Curated Basket',
      myWishlist: 'Your Wishlist & Reserved Vault',
      orderTracking: 'Live Logistics & Package Stream Trace',
      emptyCart: 'Your digital box is currently vacant. Discover products to allocate.',
      subtotal: 'Items Consolidated Subtotal',
      shipping: 'Governorate Logistics Delivery Cost:',
      total: 'Grand Total Certified Settlement:',
      egp: 'EGP',
      shippingCostTip: 'Consolidated rates include secure shipping, packing and coverage to {gov} within {days} days.',
      addressDetails: 'Bespoke Shipping Receiver Profile',
      fullName: 'Receiver Full Identity Name',
      phone: 'Active Mobile / Coordinator WhatsApp',
      govSelect: 'Select Egyptian Governorate Logistics Area',
      city: 'City / District Zone',
      street: 'Detailed Address specs (Street, Block / Building, Floor, Appartment)',
      paymentMethod: 'Secure Settlement & Payment Channel',
      shippingAgent: 'Assigned Cargo / Shipping Courier Egyptian desk',
      screenshotLabel: 'Attach payment screenshot verification proof (Vodafone / InstaPay)',
      uploadBtn: 'Pick transaction screenshot file...',
      placeOrder: 'Confirm Certified Allocation & Secure Package',
      paymentGuide: 'Egyptian Mobile payment routing instructions:',
      vCashPhone: 'Official Vodafone Cash Wallet: 01014398129',
      instaId: 'InstaPay Secure Settlement ID: trendzone@instapay',
      copyNotice: 'Copied to clipboard!',
      orderSuccess: 'Done! Your certified allotment order is verified under ticket: {id}',
      orderTrackingNo: 'Assigned logistics tracking code:',
      noOrders: 'No active orders registered in your secure zone.',
      trackingStatus: 'Logistics real-time trace ledger stream:'
    }
  };

  const t = translations[lang];

  return (
    <div id="customer-dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT AREA: Cart & Shipping Form */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Shopping Cart Block */}
        <div className="glass-premium rounded-3xl p-5 md:p-8" id="shopping-cart">
          <h2 className="text-base font-display font-extrabold text-white border-b border-white/[0.04] pb-4 flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5 text-brand-neon" />
              <span>{t.myCart}</span>
            </span>
            <span className="text-[11px] font-mono bg-white/[0.05] border border-white/[0.06] text-slate-300 px-3 py-1 rounded-full">{cart.length} ITEMS</span>
          </h2>

          {successOrderId && (
            <div className="my-5 p-4 bg-brand-neon/10 text-rose-250 rounded-xl border border-brand-neon/20 font-bold text-xs flex items-center gap-2.5 shadow-[0_0_15px_rgba(255,45,85,0.1)]">
              <CheckCircle className="w-5 h-5 text-brand-neon shrink-0 animate-pulse" />
              <span>{t.orderSuccess.replace('{id}', successOrderId)}</span>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs font-light">
              {t.emptyCart}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {cart.map((item, idx) => {
                const finalPrice = item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price;
                return (
                  <div key={idx} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id={`cart-row-${idx}`}>
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.product.image} 
                        alt={isAr ? item.product.nameAr : item.product.nameEn} 
                        className="w-16 h-16 object-cover rounded-xl border border-white/[0.04]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {isAr ? item.product.nameAr : item.product.nameEn}
                        </h4>
                        <div className="flex gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                          <span className="bg-[#1C1C1C] px-2 py-0.5 rounded-md border border-white/[0.04] text-slate-350">{item.selectedColor}</span>
                          <span className="bg-[#1C1C1C] px-2 py-0.5 rounded-md border border-white/[0.04] text-brand-neon">{item.selectedSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      {/* Quantity Controller styled like futuristic toggle keys */}
                      <div className="flex items-center border border-white/[0.06] bg-[#0E0E0E] rounded-xl overflow-hidden h-9">
                        <button 
                          onClick={() => onUpdateCartQty(idx, -1)}
                          className="px-3 hover:bg-white/[0.03] text-slate-400 h-full cursor-pointer transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-xs font-bold text-white font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateCartQty(idx, 1)}
                          className="px-3 hover:bg-white/[0.03] text-slate-400 h-full cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right flex items-center gap-4">
                        <span className="font-extrabold text-white text-xs font-mono">
                          {finalPrice * item.quantity} {t.egp}
                        </span>
                        <button 
                          onClick={() => onRemoveFromCart(idx)}
                          className="p-2 rounded-lg text-slate-400 hover:text-brand-neon hover:bg-brand-neon/10 border border-transparent hover:border-brand-neon/20 transition-all cursor-pointer"
                          title="delete row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Subtotals detail */}
              <div className="pt-6 space-y-3.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span className="font-light">{t.subtotal}</span>
                  <span className="font-mono text-white font-bold">{cartSubtotal} EGP</span>
                </div>
                <div className="flex justify-between text-slate-400" id="cart-govern-shipping">
                  <span className="font-light">{t.shipping} ({isAr ? selectedGov.ar : selectedGov.en})</span>
                  <span className="font-mono text-white font-bold">{shippingCost} EGP</span>
                </div>

                {/* Coupon Code Applied Box */}
                <div className="py-2.5 px-3.5 border border-white/[0.04] bg-white/[0.01] rounded-2xl space-y-2 my-2" id="coupon-field-input-box">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono tracking-wider">
                    <span>{isAr ? 'مستند العروض والترويج:' : 'COUPON / PROMOTIONS:'}</span>
                    {appliedPromo && (
                      <span className="text-brand-neon font-bold bg-[#FF7A00]/10 px-1.5 py-0.5 rounded">
                        {appliedPromo.code} -{appliedPromo.discountType === 'percentage' ? `${appliedPromo.value}%` : `${appliedPromo.value} EGP`}
                      </span>
                    )}
                  </div>

                  {!appliedPromo ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={isAr ? 'كود الخصم (مثل: TREND20)' : 'Promo Code (e.g. TREND20)'}
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-black/40 text-xs border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden focus:border-brand-neon font-mono uppercase text-center"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-neutral-800 hover:bg-[#FF7A00] text-white hover:text-black font-bold text-xs rounded-xl transition-all cursor-pointer font-sans"
                      >
                        {isAr ? 'تطبيق' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-2 bg-[#FF7A00]/10 border border-[#FF7A00]/20 rounded-xl text-rose-250 text-xs font-medium">
                      <span>✓ {isAr ? `تم خصم ${discountAmount} ج.م` : `Saved ${discountAmount} EGP`}</span>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[10px] font-bold text-slate-400 hover:text-white px-1.5 underline cursor-pointer"
                      >
                        {isAr ? 'إزالة الكود' : 'Remove Code'}
                      </button>
                    </div>
                  )}

                  {couponMsg && (
                    <p className={`text-[10px] font-bold ${couponMsg.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-[#FF7A00] font-bold">
                    <span>{isAr ? 'قيمة الخصم المعتمد:' : 'Voucher Deduction Value:'}</span>
                    <span className="font-mono">-{discountAmount} EGP</span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/[0.04] flex justify-between font-extrabold text-sm text-brand-neon text-glow-red">
                  <span>{t.total}</span>
                  <span className="font-mono text-base">{cartTotal} EGP</span>
                </div>
                
                <p className="text-[10px] text-rose-200 bg-brand-neon/5 p-3 rounded-xl border border-brand-neon/10 leading-relaxed font-sans">
                  💡 {t.shippingCostTip.replace('{gov}', isAr ? selectedGov.ar : selectedGov.en).replace('{days}', String(selectedGov.days))}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Address Form */}
        {cart.length > 0 && (
          <form onSubmit={handlePlaceOrderSubmit} className="glass-premium rounded-3xl p-5 md:p-8 space-y-6" id="checkout-form">
            <h3 className="text-sm font-display font-extrabold text-white border-b border-white/[0.04] pb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-3 bg-brand-neon rounded"></span>
              {t.addressDetails}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.fullName}</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#161616] border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 text-xs text-white focus:outline-hidden transition-all duration-300"
                  placeholder={lang === 'ar' ? 'أدخل اسمك الكريم' : 'Enter recipient name'}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.phone}</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#161616] border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 text-xs text-white focus:outline-hidden transition-all duration-300 font-mono"
                  placeholder="e.g. 01012345678"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.govSelect}</label>
                <select 
                  value={governorateKey}
                  onChange={(e) => setGovernorateKey(e.target.value)}
                  className="w-full bg-[#161616] border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 text-xs text-white focus:outline-hidden cursor-pointer"
                >
                  {GOVERNORATES.map((gov) => (
                    <option key={gov.key} value={gov.key} className="bg-[#121212] text-white">
                      {isAr ? gov.ar : gov.en} (+{gov.cost} EGP)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.city}</label>
                <input 
                  type="text" 
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#161616] border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 text-xs text-white focus:outline-hidden transition-all duration-300"
                  placeholder="e.g. Tanta, Heliopolis"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.street}</label>
                <input 
                  type="text" 
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-[#161616] border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 text-xs text-white focus:outline-hidden transition-all duration-300"
                  placeholder="..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.paymentMethod}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'vodafone_cash', val: isAr ? 'فودافون كاش' : 'Vodafone Cash' },
                    { key: 'instapay', val: isAr ? 'إنستا باي' : 'InstaPay Secure' },
                    { key: 'bank_transfer', val: isAr ? 'تحويل بنكي' : 'Bank Direct' },
                    { key: 'cash_on_delivery', val: isAr ? 'دفع عند الاستلام' : 'Cash on delivery' }
                  ].map((pay) => (
                    <button
                      key={pay.key}
                      type="button"
                      onClick={() => setPaymentMethod(pay.key as any)}
                      className={`p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                        paymentMethod === pay.key
                          ? 'border-brand-neon bg-brand-neon/10 text-white shadow-[0_0_10px_rgba(255,45,85,0.2)]'
                          : 'border-white/[0.06] bg-[#161616] text-slate-450 hover:bg-[#1C1C1C]'
                      }`}
                    >
                      {pay.val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// {t.shippingAgent}</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { key: 'bosta', val: 'Bosta' },
                    { key: 'egypt_post', val: isAr ? 'البريد المصري' : 'Egypt Post' },
                    { key: 'aramex', val: 'Aramex' }
                  ].map((ship) => (
                    <button
                      key={ship.key}
                      type="button"
                      onClick={() => setShippingMethod(ship.key as any)}
                      className={`p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                        shippingMethod === ship.key
                          ? 'border-brand-neon bg-brand-neon/10 text-white shadow-[0_0_10px_rgba(255,45,85,0.2)]'
                          : 'border-white/[0.06] bg-[#161616] text-slate-450 hover:bg-[#1C1C1C]'
                      }`}
                    >
                      {ship.val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Manual Payment Verification - Egypt Cash Systems */}
            {(paymentMethod === 'vodafone_cash' || paymentMethod === 'instapay') && (
              <div className="p-5 bg-black/40 border border-brand-neon/25 rounded-2xl space-y-4 shadow-[inset_0_0_12px_rgba(255,45,85,0.05)]">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-brand-neon" />
                  {t.paymentGuide}
                </h4>

                <div className="text-xs space-y-2.5 font-sans leading-relaxed text-slate-350">
                  {paymentMethod === 'vodafone_cash' && (
                    <div className="flex items-center justify-between bg-[#161616] border border-white/[0.05] p-3 rounded-xl">
                      <span className="font-mono text-glow-red text-white font-bold">{t.vCashPhone}</span>
                      <button
                        type="button"
                        onClick={() => triggerCopy('01014398129', 'vCash')}
                        className="px-3 py-1.5 bg-brand-neon text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-white hover:text-black transition-colors"
                      >
                        {copystate === 'vCash' ? t.copyNotice : (lang === 'ar' ? 'نسخ الرقم' : 'Copy Number')}
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'instapay' && (
                    <div className="flex items-center justify-between bg-[#161616] border border-white/[0.05] p-3 rounded-xl">
                      <span className="font-mono text-glow-red text-white font-bold">{t.instaId}</span>
                      <button
                        type="button"
                        onClick={() => triggerCopy('trendzone@instapay', 'instaPay')}
                        className="px-3 py-1.5 bg-brand-neon text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-white hover:text-black transition-colors"
                      >
                        {copystate === 'instaPay' ? t.copyNotice : (lang === 'ar' ? 'نسخ معرف الدفع' : 'Copy ID')}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">{t.screenshotLabel}</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/[0.08] hover:border-brand-neon border-dashed rounded-2xl cursor-pointer bg-[#141414] hover:bg-[#181814]/40 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileImage className="w-8 h-8 text-slate-500 mb-2 group-hover:text-brand-neon" />
                        <p className="text-xs text-slate-400 font-light text-center px-4">{t.uploadBtn}</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
                    </label>
                  </div>

                  {paymentScreenshot && (
                    <div className="mt-3 p-2.5 bg-[#1C1C1C] rounded-xl border border-white/[0.05] flex items-center justify-between gap-3">
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-mono">
                        <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                        {lang === 'ar' ? 'تم تجهيز صورة الإيصال للتدقيق الإداري بنجاح.' : 'Receipt image attached securely.'}
                      </span>
                      <img src={paymentScreenshot} alt="uploaded proof preview" className="w-12 h-12 object-cover rounded-lg border border-white/[0.1]" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-white text-black hover:bg-brand-neon hover:text-white hover:shadow-[0_0_18px_rgba(255,45,85,0.4)] text-center font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer uppercase font-mono tracking-wider flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{t.placeOrder}</span>
            </button>
          </form>
        )}
      </div>

      {/* RIGHT AREA: Shipments Tracking Console */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Active Shipment Tracker block */}
        <div className="glass-premium rounded-3xl p-5 md:p-6" id="active-shipment-tracker-panel">
          <h2 className="text-xs font-display font-extrabold text-white border-b border-white/[0.04] pb-3.5 flex items-center gap-2 uppercase tracking-widest font-mono">
            <Truck className="w-4 h-4 text-brand-neon" />
            <span>{t.orderTracking}</span>
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-light">
              <Clock className="w-8 h-8 text-white/[0.05] mx-auto mb-2" />
              {t.noOrders}
            </div>
          ) : (
            <div className="space-y-6 pt-3">
              {/* Order toggler / selection list */}
              <div className="space-y-2">
                {orders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => setActiveTrackingOrder(ord)}
                    className={`w-full text-right p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      activeTrackingOrder?.id === ord.id
                        ? 'border-brand-neon bg-brand-neon/10 text-white shadow-[0_0_10px_rgba(255,45,85,0.15)]'
                        : 'border-white/[0.04] bg-[#161616] text-slate-400 hover:bg-[#1E1E1E]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono block font-bold text-white">{ord.id}</span>
                      <span className="text-[10px] text-slate-400 font-sans">{ord.date} • {ord.total} EGP</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                      ord.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      ord.status === 'new' || ord.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      ord.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {lang === 'ar' ? (
                        ord.status === 'new' || ord.status === 'pending' ? 'جديد (قيد التأكيد)' :
                        ord.status === 'confirmed' ? 'تم تأكيد الطلب' :
                        ord.status === 'preparing' || ord.status === 'processing' ? 'قيد التجهيز والتحضير' :
                        ord.status === 'shipped' ? 'تم الشحن مع شركة الشحن' :
                        ord.status === 'out_for_delivery' ? 'خارج للتسليم مع المندوب' :
                        ord.status === 'delivered' ? 'تم التسليم بنجاح' :
                        ord.status === 'returning' ? 'جاري الإرجاع' :
                        ord.status === 'returned' ? 'مرتجع بالكامل' :
                        ord.status === 'cancelled' ? 'ملغي ومحذوف' : ord.status
                      ) : ord.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Order Detailed Tracking Timeline - Telemetry Board */}
              {activeTrackingOrder && (
                <div className="border border-white/[0.05] bg-[#0E0E0E] rounded-xl p-4.5 space-y-4 font-mono text-[11px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-neon/4 rounded-full blur-xl pointer-events-none"></div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block font-light uppercase tracking-wider">{t.orderTrackingNo}</span>
                    <span className="text-xs text-white font-bold block bg-[#161616] px-2.5 py-1.5 rounded-lg border border-white/[0.04]">{activeTrackingOrder.trackingNumber || 'UNASSIGNED'}</span>
                  </div>

                  <div className="border-t border-white/[0.04] pt-4.5">
                    <span className="text-[10px] text-slate-500 block font-light font-sans mb-3">{t.trackingStatus}</span>
                    <div className="relative border-l border-white/[0.08] lg:-mr-1 pl-4.5 space-y-5">
                      {(activeTrackingOrder.trackingHistory || []).map((hist, hIdx) => (
                        <div key={hIdx} className="relative">
                          {/* Dot */}
                          <span className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full border ${
                            hIdx === 0 
                              ? 'bg-brand-neon border-brand-neon shadow-[0_0_8px_#FF2D55] animate-pulse' 
                              : 'bg-[#242424] border-white/[0.1]'
                          }`}></span>

                          <div className="space-y-0.5 font-sans leading-relaxed">
                            <h4 className={`text-xs font-bold leading-snug ${hIdx === 0 ? 'text-white' : 'text-slate-400'}`}>
                              {hist.status}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                              <span>📅 {hist.date}</span>
                              <span>•</span>
                              <span>📍 {hist.location}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved Favorites Small Shelf preview */}
        <div className="glass-premium rounded-3xl p-5 md:p-6" id="wishlist-section">
          <h2 className="text-xs font-display font-extrabold text-white border-b border-white/[0.04] pb-3 flex items-center gap-2 uppercase tracking-widest font-mono">
            <Heart className="w-4 h-4 text-brand-neon" />
            <span>{t.myWishlist}</span>
          </h2>

          {wishlist.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-light">
              {lang === 'ar' ? 'رواق الأمنيات الخاص بك خالي حالياً.' : 'Your reserved favorites is currently blank.'}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04] pt-2">
              {wishlist.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img src={p.image} alt={isAr ? p.nameAr : p.nameEn} className="w-10 h-10 object-cover rounded-lg border border-white/5" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-[11px] font-bold text-white line-clamp-1">{isAr ? p.nameAr : p.nameEn}</h4>
                      <span className="text-[10px] text-brand-neon font-mono font-bold">{p.price} EGP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCartFromWishlist(p)}
                    className="p-2 rounded-lg bg-white text-[#0A0A0A] hover:bg-brand-neon hover:text-white transition-all cursor-pointer border border-white/5"
                    title="Add to cart"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
