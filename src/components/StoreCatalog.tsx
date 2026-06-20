import React, { useState, useEffect } from 'react';
import { Search, Star, Heart, RefreshCw, ShoppingCart, HelpCircle, Flame, Clock, Sparkles, Filter, Check, ShieldCheck, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Product, Language, CartItem } from '../types';
import ReviewSection from './ReviewSection';
import { Review } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface StoreCatalogProps {
  products: Product[];
  lang: Language;
  onAddToCart: (product: Product, color: string, size: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: string[];
  onAddToCompare: (product: Product) => void;
  compareList: Product[];
  allReviews: Review[];
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export default function StoreCatalog({
  products,
  lang,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onAddToCompare,
  compareList,
  allReviews,
  selectedCategory: propCategory,
  setSelectedCategory: propSetCategory,
  searchQuery: propSearchQuery,
  setSearchQuery: propSetSearchQuery
}: StoreCatalogProps) {
  const isAr = lang === 'ar';
  
  const [localCategory, localSetCategory] = useState<string>('all');
  const [localSearchQuery, localSetSearchQuery] = useState('');

  const selectedCategory = propCategory !== undefined ? propCategory : localCategory;
  const setSelectedCategory = propSetCategory !== undefined ? propSetCategory : localSetCategory;

  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : localSearchQuery;
  const setSearchQuery = propSetSearchQuery !== undefined ? propSetSearchQuery : localSetSearchQuery;

  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [addedAlert, setAddedAlert] = useState(false);

  // Active picture in gallery preview state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Countdown for Flash Sale (Standard 2 hours loop)
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 0, seconds: 0 }; // Loop
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const translations = {
    ar: {
      heroTitle: 'كل اللي بتدور عليه وأكتر في مكان واحد',
      heroSubtitle: 'أحدث صيحات الموضة والجمال، الساعات الأنيقة، والديكور الراقي للبيت في مصر. جودة ممتازة وسعر ملوش مثيل.',
      searchPlaceholder: 'دوّر على اللي محتاجه: ساعات، عطور، لبس، ديكور...',
      all: 'كل المنتجات',
      watches: 'الساعات الأنيقة',
      beauty: 'منتجات العناية بالبشرة والجمال',
      fashion: 'أحدث خطوط الموضة والأزياء',
      decor: 'تحف وديكور بوهو للبيت',
      flashSale: 'عروض خاصة لفترة محدودة',
      endsIn: 'العرض بينتهي خلال:',
      hour: 'ساعة',
      minute: 'دقيقة',
      second: 'ثانية',
      addToCart: 'إضافة لسلة الشراء',
      ratingCount: '({count} تقييم للعملاء)',
      variantColor: 'اختار اللون المفضل',
      variantSize: 'اختار المقاس المناسب',
      viewDetails: 'عرض التفاصيل والتقييمات',
      backToShop: 'الرجوع لكتالوج المتجر',
      compareBtn: 'قارن المنتجات',
      addedToCartMsg: 'تمت الإضافة لسلة الشراء بتاعتك بنجاح!',
      skuLabel: 'كود المنتج SKU:',
      stockLeft: 'الحق العرض: باقي {count} قطع بس في المخزن!',
      checkoutTip: 'توصيل سريع لكل المحافظات خلال ٢-٥ أيام عمل مع بوسطة وأرامكس.',
      specifications: 'مواصفات وتفاصيل المنتج'
    },
    en: {
      heroTitle: 'Trend Zone — Future Luxury Collective',
      heroSubtitle: 'The ultimate sanctuary for rare watches, luxury organic fragrance, and handmade velvet kaftans in Egypt.',
      searchPlaceholder: 'Search rare perfumes, bespoke watches, organic drops...',
      all: 'All Collections',
      watches: 'Elite Horological Watches',
      beauty: 'Precision Organic Skincare',
      fashion: 'Bespoke Premium Velvet Fashion',
      decor: 'Nordic Ceramic & Minimalist Decor',
      flashSale: 'Exclusive Member Flash Allocation',
      endsIn: 'Allocation Window Closes in:',
      hour: 'Hr',
      minute: 'Min',
      second: 'Sec',
      addToCart: 'Secure Allocation',
      ratingCount: '({count} verified reviews)',
      variantColor: 'Select Colorway Spectra',
      variantSize: 'Select Technical Sizing',
      viewDetails: 'Technical details & reviews',
      backToShop: 'Return to Main Showroom',
      compareBtn: 'Compare Specs',
      addedToCartMsg: 'Successfully secure allocation in your cart!',
      skuLabel: 'SKU SYSTEM DATA CODE:',
      stockLeft: 'ALARM: Only {count} units remain in this batch!',
      checkoutTip: 'Express courier delivery in 2-5 days to any Governorate via Aramex/Bosta.',
      specifications: 'Bespoke Engineering and Authenticity Spec'
    }
  };

  const t = translations[lang];

  // Filtering products
  const filteredProducts = products.filter((prod) => {
    // Only show published products, and automatically hide products if stock is 0
    const isShown = prod.isPublished !== false && prod.stock > 0;
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const nameStr = (prod.nameAr + ' ' + prod.nameEn).toLowerCase();
    const matchesSearch = nameStr.includes(searchQuery.toLowerCase());
    return isShown && matchesCategory && matchesSearch;
  });

  const handleOpenProduct = (prod: Product) => {
    setSelectedProductDetails(prod);
    setSelectedColor(prod.colors[0] || '');
    setSelectedSize(prod.sizes[0] || '');
    setActiveImageIndex(0);
  };

  const handleQuickAdd = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(prod, prod.colors[0] || 'Standard', prod.sizes[0] || 'Standard');
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2500);
  };

  return (
    <div id="store-catalog-tab" className="space-y-8">
      {addedAlert && (
        <div className="fixed top-24 left-4 right-4 z-50 bg-[#030303] border-2 border-[#FF6B00] text-white font-bold p-4 rounded-xl text-center shadow-[0_0_30px_rgba(255,107,0,0.6)] flex items-center justify-center gap-2 max-w-md mx-auto animate-bounce">
          <Check className="w-5 h-5 text-[#FF6B00]" />
          <span className="text-xs">{t.addedToCartMsg}</span>
        </div>
      )}

      {/* Hero Banner styled like modern high-end AI startup landing */}
      {!selectedProductDetails && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#020204] via-[#030303] to-[#0f0b07] text-white p-6 sm:p-10 md:p-16 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/[0.04] hologram-shine">
          {/* Ambient colored volumetric lighting orbs inside card */}
          <div className="absolute top-[-10%] right-[10%] w-80 h-80 bg-[#FF6B00]/12 rounded-full blur-[110px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[5%] w-96 h-96 bg-[#FFD700]/8 rounded-full blur-[130px] pointer-events-none"></div>
          <div className="absolute top-[40%] left-[30%] w-60 h-60 bg-[#FF6B00]/5 rounded-full blur-[90px] pointer-events-none"></div>

          {/* Holographic matrix subtle line background inside card */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,0,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-70 pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column (Hero copy and search) */}
            <div className="lg:col-span-7 space-y-6 text-right lg:text-right">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.03] border border-white/[0.08] text-[#FF6B00] rounded-full text-[9px] font-mono tracking-wider uppercase select-none">
                <Sparkles className="w-3 h-3 text-[#FF6B00] animate-pulse" />
                {lang === 'ar' ? 'اصدار المتروبوليس الفاخر الحصري مصر ٢٠٣٥' : 'METROPOLIS LUXURY EG CONCIERGE 2035'}
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.1] bg-gradient-to-r from-[#F8F6F2] via-[#F8F6F2]/90 to-[#FF6B00] bg-clip-text text-transparent">
                {t.heroTitle}
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl font-light">
                {t.heroSubtitle}
              </p>
              
              {/* Elegant Search Input */}
              <div className="pt-2 flex max-w-md">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 text-xs bg-[#121215]/85 text-white placeholder-slate-500 rounded-2xl focus:outline-hidden border border-white/[0.08] focus:border-brand-neon focus:shadow-[0_0_20px_rgba(255,122,0,0.25)] font-light transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute top-4 left-3.5 group-focus-within:text-brand-neon transition-colors" />
                </div>
              </div>
            </div>

            {/* Right Column (Cinematic Interactive Holographic 3D Rings & Floating TZ Logo) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative select-none h-64 md:h-80 w-full overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Outermost Ring */}
                <div className="absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border border-dashed border-[#FF6B00]/25 animate-[spin_50s_infinite_linear] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B00] absolute -top-1 shadow-[0_0_12px_#FF6B00]"></div>
                </div>
 
                {/* Inner Diagonal Ring */}
                <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full border border-[#FFD700]/20 animate-[spin_35s_infinite_linear_reverse] [transform:rotateX(60deg)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] absolute -bottom-0.5 shadow-[0_0_10px_#FFD700]"></div>
                </div>
 
                {/* Third Ring (Slight skew) */}
                <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-white/[0.04] animate-[spin_20s_infinite_linear] [transform:rotateY(45deg)]"></div>
 
                {/* Core Floating TZ Brand Signet (Cinema grade glass button) */}
                <div className="absolute w-24 h-24 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08] flex flex-col items-center justify-center shadow-[0_0_35px_rgba(255,107,0,0.15)] animate-[hologram-float_6s_infinite_alternate_ease-in-out]">
                  <div className="w-11 h-11 bg-gradient-to-tr from-[#FF6B00] to-[#FFD700] text-black font-black italic tracking-widest text-base rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.3)]">
                    TZ
                  </div>
                  <span className="text-[7px] text-[#FF6B00] font-mono tracking-widest uppercase mt-2 font-bold animate-pulse">// SYSTEM SECURE</span>
                </div>
 
                {/* HUD Digital Readout labels */}
                <div className="absolute left-2 bottom-2 text-[8px] font-mono text-slate-500 space-y-0.5 select-none self-start text-left">
                  <p className="text-[#FF6B00]/80 font-bold">// BOUTIQUE PROTOCOL</p>
                  <p>SYS.MOD: ACTIVE_EG</p>
                  <p>HOLO_GRID: OPERATIONAL</p>
                </div>
 
                <div className="absolute right-2 top-2 text-[8px] font-mono text-slate-500 space-y-0.5 select-none self-end text-right">
                  <p className="text-[#FFD700]/80 font-bold">// SECURED INTEGRATIONS</p>
                  <p>LATENCY: 12ms</p>
                  <p>SECURE: AES-256</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main product catalog display */}
      {!selectedProductDetails ? (
        <div className="space-y-8">
          
          {/* Categories Tab selector - Glassmorphism Pills (Swipeable on mobile for easy one-hand usage) */}
          <div className="flex flex-row flex-nowrap gap-2 pb-3 overflow-x-auto scrollbar-none border-b border-white/[0.04] pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 select-none">
            {[
              { key: 'all', label: t.all },
              { key: 'beauty', label: t.beauty },
              { key: 'watches', label: t.watches },
              { key: 'fashion', label: t.fashion },
              { key: 'decor', label: t.decor }
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat.key
                    ? 'bg-brand-neon text-white shadow-[0_0_20px_rgba(255,122,0,0.55)] border-brand-neon'
                    : 'bg-white/[0.01] text-slate-350 border-white/[0.05] hover:bg-[#FF7A00]/5 hover:text-white hover:border-[#FF7A00]/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Flash Sale Banner widget styled like a gorgeous HUD telemetry monitor info board */}
          {products.some((p) => p.isFlashSale) && (
            <div className="glass-premium-accent rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-10 w-32 h-32 bg-brand-neon/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-brand-neon/10 border border-brand-neon/30 text-brand-neon rounded-xl shadow-[0_0_12px_rgba(255,122,0,0.2)]">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                    {t.flashSale}
                    <span className="inline-block w-2- h-2 uppercase px-1.5 py-0.5 bg-brand-neon text-white text-[8px] font-mono rounded">LIVE</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-light mt-0.5">{lang === 'ar' ? 'خصومات تصل إلى 40% لفترة محدودة على نوادر السلع' : 'Save up to 40% on rare curated selections'}</p>
                </div>
              </div>

              {/* Timer HUD Interface */}
              <div className="flex items-center gap-3 relative z-10 bg-black/40 border border-white/[0.04] px-4 py-2.5 rounded-xl">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-neon" />
                  {t.endsIn}
                </span>
                <div className="flex gap-1 text-white font-mono text-xs font-bold">
                  <span className="bg-[#111115] text-brand-neon border border-white/[0.06] px-2 py-1 rounded-md">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-brand-neon self-center animate-ping">:</span>
                  <span className="bg-[#111115] text-brand-neon border border-white/[0.06] px-2 py-1 rounded-md">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-brand-neon self-center animate-ping">:</span>
                  <span className="bg-[#111115] text-brand-neon border border-white/[0.06] px-2 py-1 rounded-md">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid UI - Aesthetic Glass Tiles (Optimized to be larger & highly readable on mobile as a dense 2-column list) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {filteredProducts.map((p) => {
              const isWish = wishlist.includes(p.id);
              const inCompare = compareList.some((c) => c.id === p.id);
              const finalPrice = p.isFlashSale && p.flashSalePrice ? p.flashSalePrice : p.price;

              return (
                <div
                  key={p.id}
                  onClick={() => handleOpenProduct(p)}
                  className="group glass-premium hologram-shine glow-gold-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transform hover:-translate-y-2.5 transition-all duration-500 relative border border-white/[0.04]"
                  id={`product-card-${p.id}`}
                >
                  <div className="relative overflow-hidden aspect-square sm:aspect-video max-h-72">
                    <img
                      src={p.image}
                      alt={isAr ? p.nameAr : p.nameEn}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Futuristic scan grid simulation on card image */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,0,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-40"></div>
                    
                    {/* Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/30 to-transparent opacity-90"></div>
                    
                    {/* Flash sale badge indicator (Gold/Neon Orange styling) */}
                    {p.isFlashSale && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-[#FF6B00] to-[#E4B53D] border border-white/20 text-black text-[9px] font-mono uppercase font-black px-2.5 py-1 rounded shadow-[0_0_15px_rgba(255,107,0,0.4)] flex items-center gap-1.5 select-none">
                        <Flame className="w-3 h-3 animate-pulse" />
                        {lang === 'ar' ? 'عرض فلاش' : 'Flash Offer'}
                      </span>
                    )}

                    {/* Quick Action Overlays (Wishlist & Compare) */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(p);
                        }}
                        className={`p-2.5 rounded-full cursor-pointer transition-all duration-300 border ${
                          isWish 
                            ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.5)]' 
                            : 'bg-[#030303]/80 text-[#F8F6F2] border-white/[0.08] hover:bg-[#FF6B00] hover:text-white'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCompare(p);
                        }}
                        className={`p-2.5 rounded-full cursor-pointer transition-all duration-300 border ${
                          inCompare 
                            ? 'bg-[#F8F6F2] text-black border-[#F8F6F2] shadow-lg' 
                            : 'bg-[#030303]/80 text-[#F8F6F2] border-white/[0.08] hover:bg-[#FF6B00] hover:text-white'
                        }`}
                        title="Compare"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 relative">
                    {/* Ambient light glow source on card content hover */}
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#FF6B00]/[0.02] to-transparent pointer-events-none rounded-b-2xl group-hover:from-[#FF6B00]/[0.06] transition-all duration-500"></div>
                    
                    <div className="space-y-2 relative z-10">
                       <span className="text-[8px] uppercase font-black text-[#FFD700] block tracking-widest font-mono">
                         // AI.CURATED: {p.category}
                       </span>
                       <h3 className="font-display font-medium text-sm sm:text-base text-[#F8F6F2] line-clamp-1 group-hover:text-[#FF6B00] transition-colors duration-350">
                         {isAr ? p.nameAr : p.nameEn}
                       </h3>
                       
                       {/* Rating summary */}
                       <div className="flex items-center gap-1.5">
                         <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700] filter drop-shadow-[0_0_6px_rgba(255,215,0,0.5)]" />
                         <span className="text-xs font-bold text-[#F8F6F2] font-mono">{p.rating}</span>
                         <span className="text-xs text-slate-400 font-sans">
                           {t.ratingCount.replace('{count}', String(p.reviewsCount))}
                         </span>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/[0.04] flex flex-row items-center justify-between gap-2 relative z-10">
                       {/* Price layout */}
                       <div>
                         {p.originalPrice && (
                           <span className="text-[10px] text-slate-500 line-through font-mono block leading-none mb-1">
                             {p.originalPrice} EGP
                           </span>
                         )}
                         <span className="font-extrabold text-[#FF6B00] text-sm sm:text-base font-mono tracking-wide block leading-none transition-transform group-hover:scale-105 duration-300">{finalPrice} EGP</span>
                       </div>

                       {/* Add to Cart Button (Highly legible with tap labels, always visible on mobile) */}
                       <button
                         onClick={(e) => handleQuickAdd(p, e)}
                         className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF6B00]/90 text-white hover:from-[#FFD700] hover:to-[#E4B53D] hover:text-black hover:shadow-[0_0_15px_rgba(255,107,0,0.45)] transition-all duration-300 cursor-pointer border border-[#FF6B00]/40 flex items-center gap-1.5 active:scale-95 font-bold h-9 select-none shrink-0"
                         title={t.addToCart}
                       >
                         <ShoppingCart className="w-3.5 h-3.5" />
                         <span className="text-[9px] font-display font-medium tracking-wider uppercase">{lang === 'ar' ? 'شراء' : 'Buy'}</span>
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-[#121212]/50 rounded-2xl text-slate-500 text-sm border border-white/[0.04]">
              <HelpCircle className="w-10 h-10 text-brand-neon/20 mx-auto mb-3" />
              {lang === 'ar' ? 'عذرًا، لم نجد منتجات تطابق بحثك حاليًا.' : 'No products match your current filters.'}
            </div>
          )}
        </div>
      ) : (
        /* Expanded Single-Product Details page in high contrast luxury format */
        <div className="glass-premium rounded-3xl p-6 md:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative overflow-hidden" id="expanded-product-view">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-neon/4 rounded-full blur-[100px] pointer-events-none"></div>

          <button
            onClick={() => setSelectedProductDetails(null)}
            className="mb-8 px-4.5 py-2.5 border border-white/[0.08] hover:border-brand-neon hover:bg-white/[0.03] rounded-xl text-xs font-bold text-slate-300 cursor-pointer flex items-center gap-2 transition-all"
          >
            <span className="text-brand-neon font-bold font-mono">←</span> {t.backToShop}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Gallery presentation with interactive preview active thumbnail and scale highlights */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.04] aspect-square">
                <img
                  src={selectedProductDetails.gallery[activeImageIndex] || selectedProductDetails.image}
                  alt={isAr ? selectedProductDetails.nameAr : selectedProductDetails.nameEn}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex gap-2.5 overflow-x-auto scrollbar-none py-1">
                {selectedProductDetails.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border cursor-pointer relative transition-all duration-300 ${
                      activeImageIndex === i ? 'border-brand-neon shadow-[0_0_8px_rgba(255,45,85,0.4)]' : 'border-white/[0.07] hover:border-white/30'
                    }`}
                  >
                    <img
                      src={img}
                      alt="gallery preview thumbnail"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Spec breakdown details & Buy selections - Minimal dark elegance */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase bg-brand-neon/15 text-brand-neon px-3 py-1.5 rounded font-mono font-bold tracking-widest border border-brand-neon/20">
                  {selectedProductDetails.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white leading-tight">
                  {isAr ? selectedProductDetails.nameAr : selectedProductDetails.nameEn}
                </h2>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-brand-neon text-brand-neon" />
                    <span className="text-sm font-bold text-slate-100 font-mono ml-1">{selectedProductDetails.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {t.ratingCount.replace('{count}', String(selectedProductDetails.reviewsCount))}
                  </span>
                </div>
              </div>

              {/* Price Tag widget */}
              <div className="bg-[#181818] border border-white/[0.04] rounded-2xl p-5 flex justify-between items-center">
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase mb-1">
                    {lang === 'ar' ? 'السعر الشامل المعتمد:' : 'Total Certified Price:'}
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-black text-brand-neon font-mono tracking-tight text-glow-red">
                      {selectedProductDetails.isFlashSale && selectedProductDetails.flashSalePrice 
                        ? selectedProductDetails.flashSalePrice 
                        : selectedProductDetails.price} EGP
                    </span>
                    {selectedProductDetails.originalPrice && (
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {selectedProductDetails.originalPrice} EGP
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] block text-slate-400 font-mono tracking-wider uppercase mb-1">
                    {t.skuLabel}
                  </span>
                  <span className="font-mono text-xs bg-[#242424] text-slate-200 border border-white/5 px-2.5 py-1.5 rounded-md font-bold">
                    {selectedProductDetails.sku}
                  </span>
                </div>
              </div>

              {/* Product description paragraph */}
              <div className="bg-white/[0.01] border-l border-brand-neon/30 p-4 rounded-r-xl">
                <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-light">
                  {isAr ? selectedProductDetails.descriptionAr : selectedProductDetails.descriptionEn}
                </p>
              </div>

              {/* Options selectors */}
              <div className="space-y-5 pt-2">
                {/* Color option selector */}
                {selectedProductDetails.colors.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                      // {t.variantColor}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProductDetails.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            selectedColor === color
                              ? 'border-brand-neon bg-brand-neon/10 text-white font-bold'
                              : 'border-white/[0.08] bg-white/[0.02] text-slate-450 hover:bg-[#1D1D1D] hover:text-white'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size option selector */}
                {selectedProductDetails.sizes.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                      // {t.variantSize}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProductDetails.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            selectedSize === size
                              ? 'border-brand-neon bg-brand-neon/10 text-white font-bold'
                              : 'border-white/[0.08] bg-white/[0.02] text-slate-450 hover:bg-[#1D1D1D] hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Warning details */}
              <div className="text-xs font-mono font-bold">
                {selectedProductDetails.stock <= 5 ? (
                  <span className="text-brand-neon flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-neon rounded-full animate-ping"></span>
                    ⚠ {t.stockLeft.replace('{count}', String(selectedProductDetails.stock))}
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    ✓ {lang === 'ar' ? 'المنتج متوفر بالتوزيع الدقيق وجاهز للشحن الفوري لمدينتك.' : 'In Batch Stock - Ready for instant courier hand-off.'}
                  </span>
                )}
              </div>

              {/* Add and checkout section */}
              <div className="pt-3 flex gap-3">
                <button
                  onClick={() => {
                    onAddToCart(
                      selectedProductDetails!,
                      selectedColor || 'Standard',
                      selectedSize || 'Standard'
                    );
                    setAddedAlert(true);
                    setTimeout(() => setAddedAlert(false), 2500);
                  }}
                  className="flex-1 py-4 bg-brand-neon hover:bg-white hover:text-[#0A0A0A] text-white hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] text-center font-bold text-xs rounded-xl transition-all cursor-pointer border border-white/5 uppercase font-mono tracking-wider block w-full"
                >
                  {t.addToCart}
                </button>
              </div>

              <div className="border border-white/[0.04] p-3.5 rounded-xl bg-white/[0.01] text-[11px] text-slate-400 font-sans flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-neon shrink-0" />
                <span>💡 {t.checkoutTip}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Reviews and Feedback list component wrapped in dark luxury surfaces */}
          <div className="mt-16 border-t border-white/[0.06] pt-10" id="product-reviews-widget">
            <ReviewSection
              productId={selectedProductDetails.id}
              initialReviews={allReviews}
              lang={lang}
            />
          </div>
        </div>
      )}
    </div>
  );
}
