import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Heart, 
  ShoppingCart, 
  User, 
  Shield, 
  Award, 
  Zap, 
  Globe, 
  Sparkles, 
  Bell, 
  RefreshCw, 
  HelpCircle,
  TrendingUp,
  MessageSquare,
  Facebook,
  Instagram,
  Check,
  Search,
  ArrowUpRight,
  Lock,
  Unlock,
  Home,
  Grid,
  Sliders,
  Settings
} from 'lucide-react';

import { Language, UserRole, Product, CartItem, Order, CRMNote, CRMTask, DBActivityLog, LoyaltyWallet, AffiliateProfile, PromoCode, SupportTicket } from './types';
import { MOCK_PRODUCTS, INITIAL_LOYALTY, INITIAL_AFFILIATE, INITIAL_CRM_NOTES, INITIAL_CRM_TASKS, INITIAL_ACTIVITY_LOGS, INITIAL_ORDERS, INITIAL_PROMOS, INITIAL_TICKETS } from './mockData';

// Modular children components
import StoreCatalog from './components/StoreCatalog';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import AffiliateDashboard from './components/AffiliateDashboard';
import WalletLoyalty from './components/WalletLoyalty';
import ProductCompare from './components/ProductCompare';

// Firebase lazy integration
import { isFirebaseConfigured, emailLogin, emailRegister, signOutUser, signInWithGooglePopup } from './firebase';

export default function App() {
  // Global App States
  const [lang, setLang] = useState<Language>('ar');
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeTab2, setActiveTab2] = useState<'shop' | 'dashboard' | 'wallet' | 'affiliate' | 'admin'>('shop');
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  // Lightweight native SPA routing logic
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigateTo = (pathName: string) => {
    window.history.pushState({}, '', pathName);
    setCurrentPath(pathName);
  };

  const setActiveTab = (tab: 'shop' | 'dashboard' | 'wallet' | 'affiliate' | 'admin') => {
    if (tab === 'admin') {
      navigateTo('/admin');
    } else {
      if (window.location.pathname === '/admin') {
        navigateTo('/');
      }
      setActiveTab2(tab);
    }
  };

  const activeTabValue = currentPath === '/admin' ? 'admin' : (activeTab2 === 'admin' ? 'shop' : activeTab2);
  const activeTab = activeTabValue;

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    
    // Auto-detect admin path on cold-starts
    if (window.location.pathname === '/admin') {
      setActiveTab2('admin');
    }
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Custom states for category, search and login flows
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Dynamic Multi-Mode Theme Switcher: supports light, dark, and futuristic neon modes
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'neon'>(() => {
    const saved = localStorage.getItem('trendzone_theme_mode');
    return (saved === 'light' || saved === 'dark' || saved === 'neon') ? saved : 'neon'; 
  });

  const toggleThemeMode = (mode: 'light' | 'dark' | 'neon') => {
    setThemeMode(mode);
    localStorage.setItem('trendzone_theme_mode', mode);
  };

  // Dynamic customization states with localStorage persistence for Trend Zone Platform
  const [storeDesign, setStoreDesign] = useState(() => {
    const saved = localStorage.getItem('trendzone_design');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {}
    }
    return {
      logoText: 'TREND ZONE',
      logoUrl: '',
      logoSize: 45,
      favicon: '💎',
      darkLogoUrl: '',
      lightLogoUrl: '',
      bgVideoUrl: '',
      heroBgUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1200',
      hologramEnabled: true,
      particlesEnabled: true,
      bgTransparency: 15, // opacity %
      overlayOpacity: 70, // opacity %
      themeColor: '#FF7A00',
      glowColor: '#E31C5F',
      homeLayout: ['hero', 'timer', 'categories', 'products', 'specials', 'footer'],
      bannerTextAr: '🌟 خصم ٢٠٪ مع كود TREND20 لفترة محدودة جداً مع شحن مجاني لكل مصر',
      bannerTextEn: '🌟 Get 20% discount with code TREND20 for a limited time plus free shipping in Egypt',
      footerTextAr: 'منصة تريند زون مصـر — كل اللي بتحبه في مكان واحد مع أحدث منتجات الموضة والديكور والجمال.',
      footerTextEn: 'Trend Zone Collective — Your one-stop destination for curated watches, skincare and velvet fashion.'
    };
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('trendzone_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      { key: 'all', labelAr: '✨ كل المنتجات', labelEn: 'All Products', icon: 'Grid', banner: '', active: true, order: 1, subcategories: ['ساعات هجينة', 'عطور عود', 'قفاطين بوهو'] },
      { key: 'watches', labelAr: '🕒 الساعات الفاخرة', labelEn: 'Luxury Watches', icon: 'Clock', banner: '', active: true, order: 2, subcategories: ['ستيل فضي', 'ساعات يد جولد', 'كوارتز كلاسيك'] },
      { key: 'beauty', labelAr: '💄 مستحضرات الجمال', labelEn: 'Boutique Beauty', icon: 'Heart', banner: '', active: true, order: 3, subcategories: ['العناية بالبشرة', 'دهن عود نادر', 'سيروم نضارة'] },
      { key: 'fashion', labelAr: '👗 أحدث الأزياء', labelEn: 'Apparel & Kaftans', icon: 'ShoppingBag', banner: '', active: true, order: 4, subcategories: ['عباءة مخمل', 'قفاطين مطرزة', 'تطريز ذهبي يدوي'] },
      { key: 'decor', labelAr: '🏺 تحف الديكور', labelEn: 'Premium Decor', icon: 'Home', banner: '', active: true, order: 5, subcategories: ['سيراميك بوهو', 'فازة بوهيمية', 'ديكورات مجالس'] }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('trendzone_design', JSON.stringify(storeDesign));
    if (storeDesign.favicon) {
      document.title = (lang === 'ar' ? 'رواق تريند زون الفاخر | مصر' : 'Trend Zone Egypt | Curated') + ' ' + storeDesign.favicon;
    }
  }, [storeDesign, lang]);

  React.useEffect(() => {
    localStorage.setItem('trendzone_categories', JSON.stringify(categories));
  }, [categories]);

  // Floating Action Input & Alerts Controllers
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isSlideDrawerOpen, setIsSlideDrawerOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Refined auth UI states
  const [showMoreAuthOptions, setShowMoreAuthOptions] = useState<boolean>(false);
  const [isGooglePopupActive, setIsGooglePopupActive] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isAdminGateOpen, setIsAdminGateOpen] = useState<boolean>(false);
  const [adminEmailInput, setAdminEmailInput] = useState<string>('');
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminLoginError, setAdminLoginError] = useState<string>('');
  
  // Input fields for auth form
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  
  // Data States
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [loyaltyWallet, setLoyaltyWallet] = useState<LoyaltyWallet>(INITIAL_LOYALTY);
  const [affiliateProfile, setAffiliateProfile] = useState<AffiliateProfile>(INITIAL_AFFILIATE);
  
  const [crmNotes, setCrmNotes] = useState<CRMNote[]>(INITIAL_CRM_NOTES);
  const [crmTasks, setCrmTasks] = useState<CRMTask[]>(INITIAL_CRM_TASKS);
  const [activityLogs, setActivityLogs] = useState<DBActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [promos, setPromos] = useState<PromoCode[]>(INITIAL_PROMOS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  // System status notification list
  const [systemAlerts, setSystemAlerts] = useState<string[]>([
    'عاجل: يرجى التحقق من تحويلات فودافون كاش الأخيرة وتأكيد تسليم شركة بوسطة للأوردرات المعلقة.',
    'تنبيه: انخفض مخزون ساعة رويال هيريتدج الكلاسيكية إلى أقل من 5 قطع!'
  ]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Helper selectors
  const isAr = lang === 'ar';
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Multi-language translation dictionaries
  const t = {
    ar: {
      siteName: 'تريند زون مصر / Trend Zone EG',
      tagline: 'الوجهة الأولى المعتمدة للموضة والجمال والساعات بدولة مصر',
      langToggle: 'English / لتغير اللغة',
      roleSimulator: 'محاكي صلاحيات النظام (صلاحيات الاختبار)',
      roleCustomer: 'زبون / متسوق (Customer)',
      roleAdmin: 'الأدمن الرئيسي (Super Admin)',
      roleCS: 'خدمة العملاء (CS Officer)',
      roleAff: 'مسوق بالعمولة (Affiliate)',
      notificationCenter: 'مركز التنبيهات الإدارية السريع',
      cartLabel: 'السلة',
      wishlistLabel: 'المفضلة',
      compareLabel: 'المقارنة',
      storeTab: 'تصفح المتجر الرائد واكتشاف السلع',
      dashboardTab: 'سلة المشتريات وتتبع شحنتي',
      walletTab: 'نقاط الولاء ومحفظة الكاش',
      affiliateTab: 'صندوق التسويق والعمولات',
      adminTab: 'منصة الإدارة والتابعون والـ CRM',
      footerQuote: 'منصة تريند زون — للتجارة الحديثة فخامة، أداء، والتزام.',
      whatsappSupport: 'تواصل فوري لمساعدة الشراء على واتساب الدعم:',
      rights: 'جميع الحقوق محفوظة في مصر ٢٠٢٦ © تريند زون المحدودة.',
      noCompare: 'قارن بين السلع',
      roleNotice: 'نظام حماية RBAC نشط. لا يمكن فتح لوحة الإدارة إلا برتبة Super Admin أو Admin أو CS!'
    },
    en: {
      siteName: 'Trend Zone Egypt',
      tagline: 'Leading Egyptian curators for Luxury Watches, Skincare & Designer Velvet Caftans',
      langToggle: 'العربية / LTR Switch',
      roleSimulator: 'RBAC Authority Role Simulator (Test modes)',
      roleCustomer: 'Shopper / Customer',
      roleAdmin: 'Owner / Super Admin',
      roleCS: 'Customer Support Desk',
      roleAff: 'Affiliate Associate',
      notificationCenter: 'Corporate Alert Centre',
      cartLabel: 'Cart',
      wishlistLabel: 'Wishlist',
      compareLabel: 'Compare list',
      storeTab: 'Curated Boutique Store',
      dashboardTab: 'Checkout & Trackers',
      walletTab: 'Loyalty Center',
      affiliateTab: 'Affiliate Hub',
      adminTab: 'Management & CRM Area',
      footerQuote: 'Trend Zone — Premier commerce platform built with extreme dedication.',
      whatsappSupport: 'WhatsApp Live concierge:',
      rights: 'All rights reserved 2026 © Trend Zone Ltd Egypt.',
      noCompare: 'Product Comparison',
      roleNotice: 'RBAC Policy active. Access denied. Switch your simulator role to Admin, Super Admin or Customer Service to view.'
    }
  }[lang];

  // Logic Handlers
  const handleAddToCart = (product: Product, color: string, size: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedColor === color && 
        item.selectedSize === size
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      } else {
        return [...prev, { product, selectedColor: color, selectedSize: size, quantity: 1 }];
      }
    });

    // Add activity log
    logAction(`إضافة المنتج ${product.nameAr} إلى سلة المشتريات`, 'سلة المشتريات');
  };

  const handleUpdateCartQty = (idx: number, delta: number) => {
    setCart(prev => {
      const next = [...prev];
      const nextQty = next[idx].quantity + delta;
      if (nextQty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx].quantity = nextQty;
      }
      return next;
    });
  };

  const handleRemoveFromCart = (idx: number) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.includes(product.id)) {
        logAction(`إزالة المنتج ${product.nameAr} من المفضلة`, 'المفضلة');
        return prev.filter(id => id !== product.id);
      } else {
        logAction(`إضافة المنتج ${product.nameAr} إلى المفضلة والمعروضات المحفوظة`, 'المفضلة');
        return [...prev, product.id];
      }
    });
  };

  const handleAddToCartFromWishlist = (product: Product) => {
    handleAddToCart(product, product.colors[0] || 'Standard', product.sizes[0] || 'Standard');
    setWishlist(prev => prev.filter(id => id !== product.id));
  };

  const handleAddToCompare = (product: Product) => {
    setCompareList(prev => {
      const alreadyIn = prev.some(item => item.id === product.id);
      if (alreadyIn) {
        return prev.filter(item => item.id !== product.id);
      } else {
        if (prev.length >= 3) {
          // Keep max 3
          return [...prev.slice(1), product];
        }
        return [...prev, product];
      }
    });
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    // Update loyalty points logic (10 points awarded per 100 EGP spent)
    const pointsAwarded = Math.floor(newOrder.total / 10);
    setLoyaltyWallet(prev => {
      const nextPoints = prev.loyaltyPoints + pointsAwarded;
      let nextLevel = prev.loyaltyLevel;
      if (nextPoints >= 3000) nextLevel = 'VIP';
      else if (nextPoints >= 2000) nextLevel = 'Gold';
      else if (nextPoints >= 1000) nextLevel = 'Silver';

      const nextTxList = [
        {
          id: `tx-${Date.now()}`,
          amount: newOrder.total,
          type: 'purchase' as const,
          status: 'completed' as const,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          description: `شراء منتجات أوردر رقم ${newOrder.id} - نقاط مكتسبة: +${pointsAwarded}`
        },
        ...prev.transactions
      ];

      return {
        ...prev,
        loyaltyPoints: nextPoints,
        loyaltyLevel: nextLevel,
        transactions: nextTxList
      };
    });

    logAction(`تسجيل طلب جديد بقيمة ${newOrder.total} ج.م بالرمز الكودي ${newOrder.id}`, 'الطلبات والمدفوعات');
    setActiveTab('dashboard');
  };

  const handleConvertPoints = (pointsToConvert: number) => {
    setLoyaltyWallet(prev => {
      const nextPoints = prev.loyaltyPoints - pointsToConvert;
      const walletEarnedCash = 20; // 200 points to 20 EGP cash conversion rate
      const nextWalletBalance = prev.walletBalance + walletEarnedCash;

      const nextTxList = [
        {
          id: `tx-${Date.now()}`,
          amount: walletEarnedCash,
          type: 'deposit' as const,
          status: 'completed' as const,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          description: `استبدال ${pointsToConvert} نقطة ولاء بـ 20 جنيه كاش فوري بمحفظتك`
        },
        ...prev.transactions
      ];

      return {
        ...prev,
        loyaltyPoints: nextPoints,
        walletBalance: nextWalletBalance,
        transactions: nextTxList
      };
    });

    logAction(`استبدال نقاط ولاء برصيد محفظة نقدي بقيمة 20 جنيه مصري`, 'نقاط الولاء والمحفظة');
  };

  const handleWalletTopup = (amount: number, method: string) => {
    setLoyaltyWallet(prev => {
      const nextWalletBalance = prev.walletBalance + amount;
      const nextTxList = [
        {
          id: `tx-${Date.now()}`,
          amount,
          type: 'deposit' as const,
          status: 'completed' as const,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          description: `شحن وإيداع فوري للمحفظة الإلكترونية بقيمة ${amount} ج.م عبر ${method === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي'}`
        },
        ...prev.transactions
      ];

      return {
        ...prev,
        walletBalance: nextWalletBalance,
        transactions: nextTxList
      };
    });

    logAction(`طلب شحن محفظة بقيمة ${amount} ج.م معتمد للخدمة`, 'المدفوعات والمحفظة');
  };

  const handleWithdrawalRequest = (amount: number, method: string) => {
    setAffiliateProfile(prev => {
      const nextBalance = prev.balance - amount;
      const nextWithdrawn = prev.withdrawn + amount;
      const nextReferrals = [
        {
          orderId: `WIT-${Math.floor(100 + Math.random() * 900)}`,
          amount: amount,
          commission: amount,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'pending' as const
        },
        ...prev.referrals
      ];

      return {
        ...prev,
        balance: nextBalance,
        withdrawn: nextWithdrawn,
        referrals: nextReferrals
      };
    });
  };

  const logAction = (action: string, category: string) => {
    console.log(`[Interaction Log] ${category}: ${action}`);
    const newLog: DBActivityLog = {
      id: `LOG-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: userEmail || 'guest',
      userName: userName || 'زائر مجهول الهوية',
      userRole: currentRole,
      action,
      module: category,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ipAddress: '197.34.120.45'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleAddCRMNote = (noteData: Partial<CRMNote>) => {
    const newNote: CRMNote = {
      id: `NOTE-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: noteData.customerId || 'CUST-100',
      customerName: noteData.customerName || 'مستخدم غير معروف',
      note: noteData.note || '',
      author: userName || 'مدير النظام',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setCrmNotes(prev => [newNote, ...prev]);
    logAction(`إضافة ملاحظة جديدة للعميل: ${newNote.customerName}`, 'خدمة العملاء و CRM');
  };

  const handleAddCRMTask = (taskData: Partial<CRMTask>) => {
    const newTask: CRMTask = {
      id: `TASK-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: taskData.customerId || 'CUST-100',
      customerName: taskData.customerName || 'مستخدم غير معروف',
      task: taskData.task || '',
      priority: taskData.priority || 'medium',
      status: 'pending',
      dueDate: taskData.dueDate || new Date().toISOString().replace('T', ' ').substring(0, 10)
    };
    setCrmTasks(prev => [newTask, ...prev]);
    logAction(`إضافة مهمة CRM جديدة: ${newTask.task}`, 'خدمة العملاء و CRM');
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setCrmTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'pending' ? 'completed' : 'pending';
        console.log(`[Interaction Log] Toggled CRM Task ${taskId} status to ${nextStatus}`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleReplenishProduct = (prodId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        return { ...p, stock: p.stock + 10 };
      }
      return p;
    }));

    logAction(`تزويد كمية المخزون لمنتج ${prodId} لمقدار +10 قطع`, 'المستودع والمخزون');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], trackingText?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const nextHist = [...(ord.trackingHistory || [])];
        if (trackingText) {
          nextHist.push({
            status: trackingText,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            location: 'مندوب الشحن والتجمع بمحافظتك'
          });
        } else {
          nextHist.push({
            status: `تعديل الحالة الإدارية المباشرة للأوردر إلى: ${status}`,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            location: 'المقر للتجمع والتغليف الرئيسي بقناة السويس'
          });
        }
        return { ...ord, status, trackingHistory: nextHist };
      }
      return ord;
    }));

    logAction(`تحديث حالة الطلب ${orderId} إلى الحالة ${status}`, 'إدارة المبيعات والطلبات');
  };

  const handleGoogleLogin = () => {
    console.log("[Interaction Log] Google Sign-In button clicked. Executing unified popup sequence.");
    logAction('بدء مصادقة Google الموحدة', 'الحسابات والتراخيص');
    signInWithGooglePopup(lang === 'ar', (payload) => {
      window.postMessage(payload, window.location.origin);
    }).catch(err => {
      console.error("[Interaction Log] Google popup authentication issue:", err);
    });
  };

  React.useEffect(() => {
    const handleGoogleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
        const { name, email, phone } = event.data;
        console.log(`[Interaction Log] Hook captured GOOGLE_LOGIN_SUCCESS event for email: ${email}`);
        
        setIsLoggedIn(true);
        if (email === 'trendzoneshopeg@gmail.com') {
          setCurrentRole('super_admin');
          setUserName(isAr ? 'المدير العام لشركة تريند زون' : 'Trend Zone Managing Director');
          setUserEmail(email);
          setUserPhone('+201507425002');
          navigateTo('/admin');
          setActiveTab2('admin');
          logAction('جلسة إدارية معتمدة عبر بوابة Google الآمنة للمسؤول', 'الحسابات والتراخيص');
          
          setSystemAlerts(prev => [
            isAr 
              ? 'تم التحقق من هوية Google: لوحة المدير العام جاهزة.' 
              : 'Google identity verified: Managing Director console initialized.',
            ...prev
          ]);
        } else {
          setCurrentRole('customer');
          setUserName(name);
          setUserEmail(email);
          setUserPhone(phone || '010XXXXXXXX');
          setActiveTab2('dashboard'); // Auto redirect shopper to Customer dashboard
          logAction(`تسجيل الدخول السريع بجوجل للمستخدم: ${email}`, 'الحسابات والتراخيص');
          
          setSystemAlerts(prev => [
            isAr 
              ? `مرحباً بكِ ${name}! تم تسجيل الدخول الآمن بنجاح عبر حساب Google.` 
              : `Welcome ${name}! Authenticated with Google successfully.`,
            ...prev
          ]);
        }
        setIsAuthModalOpen(false);
        setIsGooglePopupActive(false);
      }
    };
    
    window.addEventListener('message', handleGoogleMessage);
    return () => window.removeEventListener('message', handleGoogleMessage);
  }, [isAr]);

  const handleAdminGateToggle = () => {
    if (currentRole === 'super_admin') {
      setActiveTab('admin');
      logAction('الولوج المباشر للوحة الأمان للإدارة', 'النظام الإداري');
      setTimeout(() => {
        document.getElementById('admin-dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      setAdminEmailInput('');
      setAdminPasswordInput('');
      setAdminLoginError('');
      setIsAdminGateOpen(true);
    }
  };

  const handleGoogleLoginSelect = (email: string, name: string) => {
    setIsGooglePopupActive(true);
    setIsGoogleLoading(true);
    
    setTimeout(() => {
      setIsGoogleLoading(false);
      if (email === 'trendzoneshopeg@gmail.com') {
        setCurrentRole('super_admin');
        setIsLoggedIn(true);
        setUserName(isAr ? 'المدير العام لشركة تريند زون' : 'Trend Zone Managing Director');
        setUserEmail(email);
        setUserPhone('+201507425002');
        navigateTo('/admin');
        setActiveTab2('admin');
        logAction('تسجيل دخول معتمد عبر بوابة Google للمسؤول', 'الحسابات والتراخيص');
        setSystemAlerts(prev => [
          isAr ? 'تم التحقق من هوية Google: لوحة المدير العام جاهزة.' : 'Google identity verified: Managing Director console initialized.',
          ...prev
        ]);
      } else {
        setCurrentRole('customer');
        setIsLoggedIn(true);
        setUserName(name);
        setUserEmail(email);
        setUserPhone('01015074250');
        setActiveTab2('dashboard'); // Redirect auto after login to Customer Dashboard
        logAction(`تسجيل الدخول معتمد للمستخدم ${email} عبر Google`, 'الحسابات والتراخيص');
      }
      setIsAuthModalOpen(false);
      setIsGooglePopupActive(false);
    }, 1200);
  };

  const handleAdminGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`[Interaction Log] Super Admin Bypass Gate credentials submitted: email=${adminEmailInput}`);
    try {
      const user = await emailLogin(adminEmailInput, adminPasswordInput);
      if (adminEmailInput === 'trendzoneshopeg@gmail.com') {
        setCurrentRole('super_admin');
        setIsLoggedIn(true);
        setUserName(isAr ? 'المدير العام لشركة تريند زون' : 'Trend Zone Managing Director');
        setUserEmail(adminEmailInput);
        setUserPhone('+201507425002');
        setIsAdminGateOpen(false);
        navigateTo('/admin');
        setActiveTab2('admin');
        setAdminEmailInput('');
        setAdminPasswordInput('');
        setAdminLoginError('');
        
        logAction('تسجيل دخول ناجح عبر بوابة الإدارة الآمنة', 'الحسابات والتراخيص');
        
        setSystemAlerts(prev => [
          isAr ? 'بروتوكول وصول معتمد: تم تأسيس الهوية المشفرة لمسؤول المنصة.' : 'Security Handshake Verified: Admin channel operational.',
          ...prev
        ]);
      } else {
        setAdminLoginError(isAr ? 'الهوية المدخلة ليست للمسؤول! محظور الدخول.' : 'Invalid system signature! Handshake failed.');
        logAction(`محاولة دخول غير مصرحة كمسؤول من: ${adminEmailInput}`, 'أنظمة الأمان والتحكم');
      }
    } catch (err: any) {
      setAdminLoginError(isAr ? 'البريد أو الرمز السري خاطئ! تم رصد وتجميد المعاملة.' : 'Invalid system signature! Handshake failed.');
      logAction(`محاولة دخول فاشلة من بوابة الإدارة الآمنة: ${adminEmailInput}`, 'أنظمة الأمان والتحكم');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail) return;

f (authMode === 'login') {

        const user = await emailLogin(inputEmail, inputPassword);

        

        if (inputEmail === 'trendzoneshopeg@gmail.com') {

          setCurrentRole('super_admin');

          setIsLoggedIn(true);

          setUserName(isAr ? 'المدير العام لشركة تريند زون' : 'Trend Zone Managing Director');

          setUserEmail(inputEmail);

          setUserPhone('+201507425002');

          setIsAuthModalOpen(false);

          setActiveTab2('admin');

          navigateTo('/admin');

          logAction('تسجيل الدخول كأدمن رئيسي للنظام', 'الحسابات والتراخيص');

          

          setSystemAlerts(prev => [

            isAr ? 'تم بدء جلسة تواصل إدارية مشفرة لمدير النظام' : 'Encrypted admin session started.',

            ...prev

          ]);    console.log(`[Interaction Log] User initiated ${authMode} submission. Email: ${inputEmail}`);

    try {
      if (authMode === 'login') {
        const user = await emailLogin(inputEmail, inputPassword);
        
        if (inputEmail === 'trendzoneshopeg@gmail.com') {
          setCurrentRole('super_admin');
          setIsLoggedIn(true);
          setUserName(isAr ? 'المدير العام لشركة تريند زون' : 'Trend Zone Managing Director');
          setUserEmail(inputEmail);
          setUserPhone('+201507425002');
          setIsAuthModalOpen(false);
          setActiveTab2('admin');
          navigateTo('/admin');
          logAction('تسجيل الدخول كأدمن رئيسي للنظام', 'الحسابات والتراخيص');
          
          setSystemAlerts(prev => [
            isAr ? 'تم بدء جلسة تواصل إدارية مشفرة لمدير النظام' : 'Encrypted admin session started.',
            ...prev
          ]);
        } else {
          setCurrentRole('customer');
          setIsLoggedIn(true);
          setUserName(user.displayName || inputEmail.split('@')[0]);
          setUserEmail(inputEmail);
          setUserPhone(inputPassword || '010XXXXXXXX');
          setIsAuthModalOpen(false);
          setActiveTab2('dashboard'); // Redirect auto after login to Customer Dashboard
          logAction(`تسجيل الدخول للمستخدم ${inputEmail}`, 'الحسابات والتراخيص');
          
          setSystemAlerts(prev => [
            isAr ? `مرحباً بكِ مجدداً! تم التحقق من العضوية للبريد ${inputEmail}` : `Welcome back! Identity authorized for ${inputEmail}`,
            ...prev
          ]);
        }
      } else {
        // Register mode
        const user = await emailRegister(inputEmail, inputPassword, inputName || inputEmail.split('@')[0]);
        setCurrentRole('customer');
        setIsLoggedIn(true);
        setUserName(inputName || inputEmail.split('@')[0]);
        setUserEmail(inputEmail);
        setUserPhone('010XXXXXXXX');
        setIsAuthModalOpen(false);
        setActiveTab2('dashboard'); // Redirect auto after register to Customer Dashboard
        logAction(`إنشاء حساب جديد وتفعيل المحفظة لـ ${inputEmail}`, 'الحسابات والتراخيص');
        
        setSystemAlerts(prev => [
          isAr ? `تهانينا! تم إنشاء المحفظة وتفعيل العضوية لجولى` : `Congratulations! Premium wallet created successfully.`,
          ...prev
        ]);
      }
    } catch (err: any) {
      console.error("[Interaction Log] Authentication error: ", err);
      alert(isAr ? `فشل المصادقة: ${err.message || err}` : `Authentication failed: ${err.message || err}`);
    }

    setInputEmail('');
    setInputPassword('');
    setInputName('');
    setInputPhone('');
  };

  const handleLogout = async () => {
    console.log("[Interaction Log] Logging out current user session");
    await signOutUser();
    setIsLoggedIn(false);
    setCurrentRole('customer');
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setActiveTab('shop');
    logAction('تسجيل الخروج من المنصة', 'الحسابات والتراخيص');
  };

  // RBAC Access validation controller
  const canAccessAdmin = currentRole === 'super_admin' || currentRole === 'admin' || currentRole === 'customer_service' || currentRole === 'affiliate_manager';

  if (currentPath === '/admin') {
    return (
      <div 
        className="min-h-screen bg-matte-black text-white selection:bg-[#FF7A00]/30 selection:text-white font-sans overflow-x-hidden" 
        dir={isAr ? 'rtl' : 'ltr'}
        id="app-admin-root"
      >
        {/* If authorized, show Admin Dashboard in its pure isolated form */}
        {canAccessAdmin ? (
          <div className="min-h-screen flex flex-col bg-matte-black">
            {/* Top Back-office Header */}
            <header className="bg-neutral-900 border-b border-white/[0.08] px-6 py-4 flex justify-between items-center z-45 flex-wrap gap-4 select-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF7A00] to-[#D4AF37] text-black font-extrabold flex items-center justify-center text-xs shadow-[0_0_15px_rgba(255,122,0,0.3)] shrink-0">
                  TZ
                </div>
                <div>
                  <h1 className="text-xs sm:text-sm font-display font-black tracking-widest text-[#FF7A00] flex items-center gap-1.5 uppercase">
                    🛡️ {isAr ? 'منظومة إدارة وإدارة علاقات تريند زون' : 'TREND ZONE SYSTEM ADMIN CONSOLE'}
                  </h1>
                  <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider">// SECURE CLOUD GATEWAY • BACK-OFFICE OPERATIONS</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')}
                  className="px-2.5 py-1 bg-neutral-850 hover:bg-neutral-800 border border-white/[0.05] rounded-lg text-[9px] font-mono tracking-wider text-slate-400 cursor-pointer"
                >
                  {isAr ? 'English' : 'العربية'}
                </button>

                <button
                  onClick={() => {
                    navigateTo('/');
                    setActiveTab2('shop');
                  }}
                  className="px-3 py-1.5 bg-[#FF7A00]/10 hover:bg-[#FF7A00] hover:text-black hover:shadow-[0_0_12px_rgba(255,122,0,0.3)] border border-[#FF7A00]/30 rounded-xl text-[10px] font-bold text-[#FF7A00] transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>{isAr ? '👉 الانتقال للواجهة العامة' : '👉 Storefront Portal'}</span>
                </button>

                <div className="h-4 w-px bg-white/[0.1] hidden sm:block"></div>
                <div className="items-center gap-2 hidden sm:flex">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-[#FF7A05] flex items-center justify-center text-[10px] font-black">{userName[0] || 'A'}</div>
                  <span className="text-[10px] font-bold text-slate-400">{userName}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 bg-rose-950/20 text-rose-455 hover:bg-rose-500 hover:text-black border border-rose-500/10 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                >
                  {isAr ? 'خروج' : 'Exit'}
                </button>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key="admin-isolated-body"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="flex-1"
              >
                <AdminDashboard
                  products={products}
                  setProducts={setProducts}
                  orders={orders}
                  setOrders={setOrders}
                  notes={crmNotes}
                  tasks={crmTasks}
                  activityLogs={activityLogs}
                  onReplenishProduct={handleReplenishProduct}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onAddCRMNote={handleAddCRMNote}
                  onAddCRMTask={handleAddCRMTask}
                  onToggleTaskStatus={handleToggleTaskStatus}
                  lang={lang}
                  currentRole={currentRole}
                  promos={promos}
                  setPromos={setPromos}
                  tickets={tickets}
                  setTickets={setTickets}
                  onLogoutAdmin={handleLogout}
                  onGoToStorefront={() => {
                    navigateTo('/');
                    setActiveTab2('shop');
                  }}
                  storeDesign={storeDesign}
                  setStoreDesign={setStoreDesign}
                  categories={categories}
                  setCategories={setCategories}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Secure Restrictive Login Page for Admin */
          <div className="min-h-screen flex items-center justify-center p-4 bg-[#08080b] relative font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,122,0,0.06)_0,transparent_100%)] pointer-events-none"></div>

            <div className="bg-[#121215] border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-w-sm w-full rounded-2xl p-6 relative z-10 overflow-hidden space-y-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="text-center space-y-2">
                <div 
                  onClick={() => navigateTo('/')}
                  className="w-10 h-10 bg-gradient-to-tr from-[#FF7A00] to-[#D4AF37] text-black font-black italic tracking-widest text-base rounded-xl shadow-[0_0_20px_rgba(255,122,0,0.4)] flex items-center justify-center mx-auto border border-white/10 hover:scale-105 transition-transform cursor-pointer"
                >
                  TZ
                </div>
                <h2 className="text-[10px] font-display font-black text-rose-500 uppercase tracking-widest pt-2 flex items-center justify-center gap-1">
                  <span>🔐 SYSTEM CONTROL GATE-LOCK</span>
                </h2>
                <h3 className="text-base font-sans font-black text-white">
                  {isAr ? 'التحقق الأمني من هوية موظف تريند زون' : 'Trend Zone System Access Validation'}
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  {isAr 
                    ? 'هذا النظام مخصص للمسؤولين المعتمدين والمشرفين بمركز مصر الموحد لحماية وتعديل كشوف الطلبات والمخازن.' 
                    : 'Authorized operational nodes only. Device ID tracking and SSL authorization logs active.'
                  }
                </p>
              </div>

              {adminLoginError && (
                <div className="bg-red-950/20 text-rose-400 p-3 rounded-xl border border-red-500/20 text-[10.5px] font-semibold text-center font-sans leading-relaxed">
                  ⚠️ {adminLoginError}
                </div>
              )}

              {/* Secure Google Entrance */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setIsGooglePopupActive(true)}
                  className="w-full py-3.5 px-4 bg-white hover:bg-neutral-100 text-black font-extrabold text-[10.5px] rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 uppercase font-mono tracking-wider border border-white/25"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.56h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.49C21.68,11.75 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                    <path d="M12,20.9c2.4,0 4.4,-0.8 5.87,-2.16l-3.3,-2.56c-0.9,0.6 -2.07,0.98 -3.12,0.98 -2.4,0 -4.43,-1.62 -5.16,-3.8H2.88v2.64C4.35,18.88 7.91,20.9 12,20.9z" fill="#34A853" />
                    <path d="M6.84,13.36c-0.18,-0.54 -0.29,-1.11 -0.29,-1.7 0,-0.59 0.11,-1.16 0.29,-1.7V7.32H2.88C2.26,8.56 1.91,10.01 1.91,11.66c0,1.65 0.35,3.1 0.97,4.34l3.96,-2.64z" fill="#FBBC05" />
                    <path d="M12,6.72c1.3,0 2.48,0.45 3.4,1.32l2.55,-2.55C16.39,4.09 14.39,3.1 12,3.1 7.91,3.1 4.35,5.12 2.88,8.02l3.96,2.64c0.73,-2.18 2.76,-3.83 5.16,-3.83z" fill="#EA4335" />
                  </svg>
                  <span>{isAr ? 'ولوج المسؤول والمشرف بحساب Google' : 'Log in as verified Google Admin'}</span>
                </button>

                <div className="flex items-center">
                  <div className="flex-1 border-b border-white/[0.06]"></div>
                  <span className="px-3 text-[9px] text-slate-500 font-mono tracking-widest uppercase">{isAr ? 'أو بالرمز الأمني الاحتياطي' : 'OR SECURE KEY BACKUP'}</span>
                  <div className="flex-1 border-b border-white/[0.06]"></div>
                </div>

                <form onSubmit={handleAdminGateSubmit} className="space-y-4 font-sans">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] text-slate-400 font-mono tracking-wider uppercase block">{isAr ? 'البريد الإلكتروني التجاري المعتمد' : 'Corporate Email Address'}</label>
                    <input 
                      type="email"
                      required
                      placeholder="trendzoneshopeg@gmail.com"
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/[0.07] focus:border-[#FF7A00] focus:outline-hidden text-xs rounded-xl text-white transition-all duration-350 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9.5px] text-slate-400 font-mono tracking-wider uppercase block">{isAr ? 'رمز فك التشفير والأمان المالي' : 'Branch Decryption Key'}</label>
                    <input 
                      type="password"
                      required
                      placeholder={isAr ? 'أقفل بالرقم السري المعتمد' : 'Authorized OTP override password'}
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/[0.07] focus:border-[#FF7A00] focus:outline-hidden text-xs rounded-xl text-white transition-all duration-355 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#FF7A00] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FF7A00] text-black font-extrabold text-xs rounded-xl transition-all duration-500 shadow-[0_0_15px_rgba(255,122,0,0.3)] hover:shadow-[0_0_25px_rgba(255,122,0,0.55)] cursor-pointer tracking-wider uppercase font-mono mt-2"
                  >
                    🔐 {isAr ? 'التحقق السحابي الفوري' : 'Authorize Restrictive Terminal'}
                  </button>
                </form>
              </div>

              {/* Developer Assist Tip Box */}
              <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl text-[9px] text-slate-400 leading-normal font-mono space-y-1">
                <span className="text-[#FF7A00] font-bold uppercase tracking-wider block">// SYSTEM TESTING BACKOFFICE OVERRIDES:</span>
                <div className="flex justify-between"><span>Email:</span> <span className="text-white font-bold">trendzoneshopeg@gmail.com</span></div>
                <div className="flex justify-between"><span>Security code:</span> <span className="text-white font-bold">+201507425002</span></div>
              </div>

              <div className="flex justify-between items-center text-[9px] text-slate-500 border-t border-white/[0.05] pt-3.5 font-mono">
                <button 
                  onClick={() => navigateTo('/')}
                  className="text-[#FF7A00] hover:underline cursor-pointer"
                >
                  ← {isAr ? 'الرجوع ومتابعة المتجر' : 'Go back to Shopper Store'}
                </button>
                <span>SSL V1.2 PRIVACYSEC</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const getThemeClasses = () => {
    if (themeMode === 'light') {
      return "min-h-screen bg-[#F8F6F2] text-[#0A0A0F] selection:bg-[#FF6B00]/20 selection:text-[#0A0A0F] font-sans overflow-x-hidden relative transition-colors duration-500 light-theme";
    } else if (themeMode === 'dark') {
      return "min-h-screen bg-[#0C0C10] text-[#F8F6F2] selection:bg-[#FF6B00]/30 selection:text-white font-sans overflow-x-hidden relative transition-colors duration-500 dark-theme";
    } else {
      return "min-h-screen bg-[#030303] text-white selection:bg-brand-neon/30 selection:text-white font-sans overflow-x-hidden relative transition-colors duration-500 neon-theme";
    }
  };

  return (
    <div 
      className={getThemeClasses()} 
      dir={isAr ? 'rtl' : 'ltr'}
      id="app-theme-host"
    >
      {/* Cinematic Sci-Fi Backdrop Layer with Dynamic Background Control */}
      {storeDesign.backgroundVideoUrl && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ opacity: 1 - (storeDesign.overlayTransparency ?? 0.82) }}
            key={storeDesign.backgroundVideoUrl}
          >
            <source src={storeDesign.backgroundVideoUrl} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Dark overlay screen tint */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-black" 
        style={{ opacity: storeDesign.overlayDarkTint ?? 0.0 }}
      ></div>

      <div className="holo-grid-mask"></div>

      {storeDesign.particles !== false && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Animated dust dots */}
          <div className="absolute w-2 h-2 rounded-full bg-[#FF7A00]/20 top-[10%] left-[20%] animate-pulse"></div>
          <div className="absolute w-1.5 h-1.5 rounded-full bg-[#E31C5F]/20 top-[40%] left-[80%] animate-pulse"></div>
          <div className="absolute w-2.5 h-2.5 rounded-full bg-[#D4AF37]/15 top-[70%] left-[45%] animate-pulse"></div>
          <div className="absolute w-1 h-1 rounded-full bg-white/25 top-[30%] left-[15%] animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute w-2 h-2 rounded-full bg-[#FF7A00]/20 top-[85%] left-[88%] animate-ping" style={{ animationDuration: '5s' }}></div>
        </div>
      )}

      <div className="digital-fog-layered">
        <div className="digital-fog-orb-primary"></div>
        <div className="digital-fog-orb-secondary"></div>
        <div className="digital-fog-orb-gold"></div>
      </div>
      {themeMode === 'neon' && (
        <>
          <div className="laser-trail-line laser-trail-1"></div>
          <div className="laser-trail-line laser-trail-2"></div>
          <div className="scanline-overlay"></div>
          <div className="scanline-sweeper"></div>
        </>
      )}

      {/* Floating Hologram Products in Background (Subtle & Non-Distracting) */}
      {storeDesign.holograms !== false && (
        <div className="hologram-viewport">
          {/* Floating Rotating Watch */}
          <div className="holo-element holo-element-gold holo-animated-1 top-[15%] left-[4%] text-center opacity-40 hidden lg:block">
            <div className="holo-rotating shrink-0">
              <svg className="w-14 h-14 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="6" />
                <path d="M12 2v4M12 18v4M9 3h6M9 21h6" />
                <path d="M12 9v3l2 1" />
              </svg>
            </div>
            <span className="text-[6px] text-[#D4AF37] font-mono tracking-widest block uppercase mt-1">// HOLO-WATCH CL-9</span>
          </div>

          {/* Floating Rotating Perfume Bottle */}
          <div className="holo-element holo-element-rose holo-animated-2 top-[55%] right-[2%] text-center opacity-30 hidden lg:block">
            <div className="holo-rotating-reverse shrink-0">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="6" y="9" width="12" height="11" rx="2" />
                <path d="M9 5h6v4H9z" />
                <path d="M12 2v3M12 12v3" />
              </svg>
            </div>
            <span className="text-[6px] text-pink-400 font-mono tracking-widest block uppercase mt-1">// FRA-BOT EXP-02</span>
          </div>

          {/* Floating Fashion Accessory hanger / crown */}
          <div className="holo-element holo-animated-3 top-[75%] left-[6%] text-center opacity-30 hidden lg:block">
            <div className="holo-rotating shrink-0">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 3h12l3 6-9 12-9-12z" />
                <path d="M11 3v6M13 3v6" />
              </svg>
            </div>
            <span className="text-[6px] text-[#FF7A00] font-mono tracking-widest block uppercase mt-1">// LUXURY VELVET</span>
          </div>

          {/* Floating Deluxe Vase/Decor element */}
          <div className="holo-element holo-element-gold holo-animated-4 top-[25%] right-[6%] text-center opacity-35 hidden lg:block">
            <div className="holo-rotating-reverse shrink-0">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M8 2h8v2c0 2-3 4-3 6s3 2 3 6v4a2 2 0 01-2 2H10a2 2 0 01-2-2v-4c0-4 3-4 3-6s-3-4-3-6V2z" />
              </svg>
            </div>
            <span className="text-[6px] text-amber-500 font-mono tracking-widest block uppercase mt-1">// CERAMIC BOHO</span>
          </div>
        </div>
      )}

      {/* Top Universal Ticker Banner - Minimal and Exquisite */}
      <div className="bg-[#08080c] border-b border-white/[0.04] text-[10px] text-slate-400 py-2 px-4 font-mono tracking-wider relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#FF7A00] font-bold">
              <span className="w-1.5 h-1.5 bg-[#FF7A00] rounded-full animate-pulse"></span>
              {lang === 'ar' ? 'شحن فوري مؤمن وموثق لكافة محافظات مصر' : 'VERIFIED INSTANT PREMIUM SHIPPING IN EGYPT'}
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline text-[10px] text-slate-500">
              {lang === 'ar' ? 'بوابات فودافون كاش، إنستاباي، والدفع الفوري عند الاستلام' : 'Vodafone Cash, InstaPay & Cash on Delivery'}
            </span>
          </div>
          
          <div className="flex items-center flex-wrap gap-4 shrink-0">
            {/* Elegant Theme Switcher Controls */}
            <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-2 py-1 select-none">
              <span className="text-[8px] text-slate-500 font-bold font-mono tracking-wider ml-1 uppercase">{isAr ? 'الثيم:' : 'Theme:'}</span>
              <button
                onClick={() => toggleThemeMode('light')}
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase transition-all cursor-pointer ${
                  themeMode === 'light' 
                    ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {isAr ? 'مضيء' : 'Light'}
              </button>
              <button
                onClick={() => toggleThemeMode('dark')}
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase transition-all cursor-pointer ${
                  themeMode === 'dark' 
                    ? 'bg-neutral-800 text-slate-200 border border-white/[0.05]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {isAr ? 'داكن' : 'Dark'}
              </button>
              <button
                onClick={() => toggleThemeMode('neon')}
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase transition-all cursor-pointer ${
                  themeMode === 'neon' 
                    ? 'bg-gradient-to-r from-[#FF6B00] to-[#E31C5F] text-white shadow-[0_0_10px_rgba(255,107,0,0.5)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {isAr ? 'نيون' : 'Neon'}
              </button>
            </div>

            <span className="text-slate-700 hidden sm:inline">|</span>

            <button
              onClick={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')}
              className="hover:text-[#FF6B00] cursor-pointer transition-colors flex items-center gap-1 text-[10px] font-bold"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'ar' ? 'Change to English' : 'تغيير إلى العربية'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Luxury Header Navbar - Glassmorphism Floor */}
      <header className="sticky top-0 z-40 bg-[#030303]/90 backdrop-blur-md border-b border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.8)]" id="main-corporate-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left Brand block with fully dynamic Logo Management */}
          <div 
            onClick={() => { setActiveTab('shop'); setSelectedCategory('all'); setSearchQuery(''); setShowMobileCategories(false); }}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            {storeDesign.logoUrl ? (
              <img 
                src={storeDesign.logoUrl} 
                alt="Store Logo" 
                style={{ height: `${storeDesign.logoSize || 40}px` }} 
                className="object-contain hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-tr from-[#FF6B00] to-[#FFD700] text-black font-black italic tracking-wider text-sm rounded-xl shadow-[0_0_15px_rgba(255,107,0,0.4)] flex items-center justify-center shrink-0 border border-white/10 hover:scale-105 transition-transform">
                  {storeDesign.logoText ? storeDesign.logoText.slice(0, 2).toUpperCase() : 'TZ'}
                </div>
                <div>
                  <h1 className="font-display font-extrabold text-sm md:text-base text-[#F8F6F2] tracking-tight leading-none flex items-center gap-1 uppercase">
                    {storeDesign.logoText || (lang === 'ar' ? 'تريند زون' : 'Trend Zone')}
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 animate-pulse" />
                  </h1>
                  <span className="text-[8px] text-[#FF6B00] tracking-widest block font-mono mt-0.5 uppercase">
                    {lang === 'ar' ? 'رواق الجودة والفخامة بمصر // 2035' : 'luxury beauty • fashion • timepieces'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Header Navigation Panel */}
          <div className="flex items-center gap-2 md:gap-3" id="header-right-actions">
            
            {/* 1. Search icon button (Active for all views to instantly query products) */}
            <button
              onClick={() => setIsSearchOverlayOpen(true)}
              className="p-2 md:p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.01] text-slate-350 hover:text-[#FF7A00] hover:border-[#FF7A00]/50 transition-all cursor-pointer relative"
              title={lang === 'ar' ? 'بحث' : 'Search'}
              id="header-action-search"
            >
              <Search className="w-4 h-4 text-slate-300" />
            </button>

            {/* Live alerts notifications dropdown (Visible only on desktop to avoid clutter) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowNotificationPopup(prev => !prev)}
                className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.01] text-slate-350 hover:text-[#FF7A00] hover:border-[#FF7A00]/50 transition-all cursor-pointer relative"
                title={t.notificationCenter}
              >
                <Bell className="w-4 h-4 text-slate-300" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF7A00] rounded-full animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF7A00] rounded-full"></span>
              </button>

              {showNotificationPopup && (
                <div className="absolute top-12 right-0 w-80 bg-[#121215] border border-white/[0.08] shadow-[0_15px_50px_rgba(0,0,0,0.85)] rounded-2xl p-4 z-50 text-xs text-slate-300 space-y-3 neon-glow-red">
                  <h4 className="font-bold text-white border-b border-white/[0.05] pb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-[#FF7A00]">
                      <Bell className="w-3.5 h-3.5 text-[#FF7A00]" />
                      {lang === 'ar' ? 'تحديثات النظام الفورية' : 'Live Status Updates'}
                    </span>
                    <button onClick={() => setShowNotificationPopup(false)} className="text-[10px] text-slate-500 font-bold hover:text-white cursor-pointer transition-colors">{lang === 'ar' ? 'إغلاق' : 'Close'}</button>
                  </h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none">
                    {systemAlerts.map((alert, index) => (
                      <p key={index} className="bg-[#FF7A00]/5 p-2 rounded-lg text-rose-100 border border-[#FF7A00]/10 font-sans leading-relaxed text-[10px]">
                        • {alert}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Visual Cart Icon (Visible only on desktop header to prevent mobile duplications) */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setTimeout(() => {
                  document.getElementById('shopping-cart')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hidden md:flex p-2.5 bg-white text-black rounded-xl hover:bg-[#FF7A00] hover:text-white hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all cursor-pointer font-bold text-xs items-center gap-1.5"
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span className="font-mono">{cart.length}</span>
            </button>

            {/* Official Brand Contacts - WhatsApp + Mail (Hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-2 select-none">
              <a
                href="https://wa.me/201507425002"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black border border-emerald-500/15 rounded-full text-[9px] font-bold text-emerald-400 font-mono flex items-center gap-1 cursor-pointer transition-all duration-300 shrink-0"
                title="الدعم الفوري لمصر عبر واتساب"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>WA: +201507425002</span>
              </a>

              <a
                href="mailto:trendzoneshopeg@gmail.com"
                className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-slate-350 border border-white/5 rounded-full text-[9px] font-bold font-mono tracking-normal flex items-center gap-1 cursor-pointer transition-all duration-300 shrink-0"
              >
                <span>trendzoneshopeg@gmail.com</span>
              </a>
            </div>

            {/* Control Panel: Lock Icon + Profile Sign-in */}
            <div className="flex items-center gap-2 shrink-0 select-none">
              
              {/* Premium Lock Icon - Visible only for authorized admins */}
              {canAccessAdmin && (
                <button
                  onClick={() => navigateTo('/admin')}
                  className={`p-2 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0 ${
                    currentRole === 'super_admin'
                      ? 'bg-[#FF7A00]/10 border-[#FF7A00]/40 text-[#FF7A00] hover:bg-[#FF7A00]/20 shadow-[0_0_12px_rgba(255,122,0,0.25)]'
                      : 'bg-white/[0.01] border-white/[0.06] text-slate-400 hover:text-[#FF7A00] hover:border-[#FF7A00]/40 hover:bg-white/[0.04]'
                  }`}
                  title={lang === 'ar' ? 'البوابة السرية للإدارة' : 'Secure Admin Gate'}
                  id="header-action-admin-lock"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Profile Block or Compact Curated Entry button */}
              <div className="relative group">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2 border border-white/[0.06] bg-white/[0.01] rounded-full pl-2.5 pr-1.5 py-1 hover:border-[#FF7A00]/50 cursor-pointer transition-all">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#D4AF37] text-black font-extrabold flex items-center justify-center text-[9px] select-none shadow">
                      {userName[0] || 'U'}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-300 hidden sm:inline max-w-[80px] truncate">{userName}</span>
                    
                    {/* Dropdown popup */}
                    <div className="absolute top-full right-0 mt-2.5 w-48 bg-[#121215] border border-white/[0.08] rounded-xl p-2 shadow-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                      <div className="p-2 border-b border-white/[0.05] text-[9px] text-slate-500 font-mono truncate">
                        {userEmail}
                      </div>
                      {canAccessAdmin && (
                        <button
                          onClick={() => {
                            navigateTo('/admin');
                            setActiveTab2('admin');
                          }}
                          className="w-full text-right px-3 py-2 text-xs text-[#FF7A00] font-bold hover:bg-white/[0.03] rounded-lg transition-colors flex items-center justify-between"
                        >
                          <span>{lang === 'ar' ? 'لوحة المسؤولين' : 'Admin Console'}</span>
                          <Shield className="w-3.5 h-3.5 text-[#FF7A00]" />
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-right px-3 py-2 text-xs text-rose-400 hover:bg-white/[0.03] rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAuthMode('login'); setShowMoreAuthOptions(false); setIsAuthModalOpen(true); }}
                    className="px-3 py-1.5 bg-white/[0.02] text-slate-300 text-[10px] font-bold border border-white/[0.06] hover:border-[#FF7A00]/50 rounded-full hover:bg-white/[0.06] hover:text-white transition-all duration-300 shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === 'ar' ? 'الدخول' : 'Sign In'}</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Secondary categories / sections navigation slider line */}
        <div className="border-t border-white/[0.04] bg-[#0A0A0E]/80 backdrop-blur-lg py-2.5 px-4 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center justify-start gap-1 sm:gap-2 shrink-0 select-none">
            {[
              { key: 'all', type: 'category', label: lang === 'ar' ? '✨ كافة المعروضات' : 'All Masterpieces' },
              { key: 'watches', type: 'category', label: lang === 'ar' ? '🕒 الساعات الفاخرة' : 'Luxury Watches' },
              { key: 'beauty', type: 'category', label: lang === 'ar' ? '💄 مستحضرات الجمال' : 'Boutique Beauty' },
              { key: 'fashion', type: 'category', label: lang === 'ar' ? '👗 الأزياء والقفطانات' : 'Designer Apparel' },
              { key: 'decor', type: 'category', label: lang === 'ar' ? '🏺 تحف الديكور الفاخر' : 'Premium Decor' },
              { key: 'dashboard', type: 'tab', label: lang === 'ar' ? '💼 السلة ومتابعة الشحنة' : 'Basket & Track' },
              { key: 'wallet', type: 'tab', label: lang === 'ar' ? '💳 محفظة ولاء كاش' : 'Wallet' },
              { key: 'affiliate', type: 'tab', label: lang === 'ar' ? '🤝 منصة العمولات' : 'Affiliate Hub' }
            ].map((btn) => {
              const isSelectedCategory = activeTab === 'shop' && selectedCategory === btn.key;
              const isSelectedTab = activeTab === btn.key;
              const isActive = btn.type === 'category' ? isSelectedCategory : isSelectedTab;

              return (
                <button
                  key={btn.key}
                  onClick={() => {
                    if (btn.type === 'category') {
                      setActiveTab('shop');
                      setSelectedCategory(btn.key);
                    } else {
                      setActiveTab(btn.key as any);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-neutral-800 text-white shadow-[0_0_12px_rgba(255,122,0,0.15)] border border-white/[0.08]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Primary body element content with Cinematic Transitions (Optimized spacing for mobile-first sticky bottom nav) */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 min-h-[60vh] pb-24 md:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Render respective tab based on state */}
            
            {/* 1. Store catalog */}
            {activeTab === 'shop' && (
              <div className="space-y-12">
                <StoreCatalog
                  products={products}
                  lang={lang}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                  onAddToCompare={handleAddToCompare}
                  compareList={compareList}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  allReviews={[
                    { id: 'rev-pre-1', productId: 'prod-1', userName: 'ملك الشريف / Cairo', rating: 5, comment: 'الساعة خرافية وجاءت مغلفة بعناية تليق بالذهب ومكينة كوارتز صامتة بنصح فيها.', date: '2026-06-15' },
                    { id: 'rev-pre-2', productId: 'prod-2', userName: 'سارة حسام / Giza', rating: 5, comment: 'ريحة العود ممتازة وبتثبت في الهدوم ليومين كاملين! العبوة أنيقة وتوصيل مندوب بوسطة سريع جدا وبأرخص تكلفة.', date: '2026-06-16' },
                    { id: 'rev-pre-3', productId: 'prod-3', userName: 'سهام عادل / Alexandria', rating: 4, comment: 'القفطان خامته تحفة ومطرز بذهبي لمعته ممتازة بس لو في منه مقاس لارج كامل متوفر بالوزن.', date: '2026-06-17' },
                    { id: 'rev-pre-4', productId: 'prod-5', userName: 'سامي منصور / Qalyubia', rating: 5, comment: 'الفازة خامة سيراميك ممتازة تليق بالبوهو والديكورات الحديثة للمجالس.', date: '2026-06-16' }
                  ]}
                />

                {/* Side-by-side products comparison widget block at the bottom of the showroom tab */}
                <div id="product-compilation-bracket" className="pt-10 border-t border-white/[0.06]">
                  <ProductCompare
                    compareList={compareList}
                    onRemove={(id) => setCompareList(prev => prev.filter(c => c.id !== id))}
                    onAddToCart={(p) => handleAddToCart(p, p.colors[0] || 'Standard', p.sizes[0] || 'Standard')}
                    lang={lang}
                  />
                </div>
              </div>
            )}

            {/* 2. Customer Dashboard & checkout desk */}
            {activeTab === 'dashboard' && (
              <CustomerDashboard
                cart={cart}
                wishlist={wishlistProducts}
                orders={orders}
                onUpdateCartQty={handleUpdateCartQty}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onToggleWishlist={handleToggleWishlist}
                onAddToCartFromWishlist={handleAddToCartFromWishlist}
                onPlaceOrder={handlePlaceOrder}
                lang={lang}
                promos={promos}
              />
            )}

            {/* 3. Loyalty & digital wallet points redemption */}
            {activeTab === 'wallet' && (
              <WalletLoyalty
                wallet={loyaltyWallet}
                onConvertPoints={handleConvertPoints}
                onWalletTopup={handleWalletTopup}
                lang={lang}
              />
            )}

            {/* 4. Affiliate partner zone */}
            {activeTab === 'affiliate' && (
              <AffiliateDashboard
                affiliateProfile={affiliateProfile}
                onUpdateWithdrawal={handleWithdrawalRequest}
                lang={lang}
              />
            )}

            {/* 5. Back-Office Admin CRM Center */}
            {activeTab === 'admin' && (
              <div id="saas-dashboard-wrapper">
                {canAccessAdmin ? (
                  <AdminDashboard
                    products={products}
                    setProducts={setProducts}
                    orders={orders}
                    setOrders={setOrders}
                    notes={crmNotes}
                    tasks={crmTasks}
                    activityLogs={activityLogs}
                    onReplenishProduct={handleReplenishProduct}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onAddCRMNote={handleAddCRMNote}
                    onAddCRMTask={handleAddCRMTask}
                    onToggleTaskStatus={handleToggleTaskStatus}
                    lang={lang}
                    currentRole={currentRole}
                    promos={promos}
                    setPromos={setPromos}
                    tickets={tickets}
                    setTickets={setTickets}
                    onLogoutAdmin={handleLogout}
                    onGoToStorefront={() => setActiveTab('shop')}
                    storeDesign={storeDesign}
                    setStoreDesign={setStoreDesign}
                    categories={categories}
                    setCategories={setCategories}
                  />
                ) : (
                  <div className="bg-red-950/20 text-rose-300 p-8 rounded-2xl border border-red-900/40 text-center text-xs font-bold font-sans">
                    ⚠ {t.roleNotice}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Institutional Enterprise Footer */}
      <footer className="bg-[#0e0e0e] text-slate-350 pt-16 pb-12 mt-16 border-t border-white/[0.06]" id="site-footer">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-neon rounded-full shadow-[0_0_8px_#FF7A00]"></span>
              <span className="font-display font-extrabold uppercase">تـريند زون مصـر</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              {t.footerQuote}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">فئات وخطوط الموضة والجمال</h4>
            <ul className="text-[11px] text-slate-400 space-y-2 font-sans">
              <li className="hover:text-brand-neon transition-colors">سحر وساعات يد رويال هيريتدج</li>
              <li className="hover:text-brand-neon transition-colors">عطور العود الشرقي والمخمل</li>
              <li className="hover:text-brand-neon transition-colors">المرطبات والمجموعات العضوية ريفيتالايز</li>
              <li className="hover:text-brand-neon transition-colors">ديكورات السيراميك والتحف البوهيمية</li>
            </ul>
          </div>

          <div className="space-y-4 col-span-1 md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">{t.whatsappSupport}</h4>
            <div className="bg-[#141414] p-4 rounded-xl space-y-2 border border-white/[0.04]">
              <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>+20 1507425002 (دعم الإدارة والمبيعات الفورية)</span>
              </span>
              <p className="text-[10px] text-slate-400 leading-normal font-sans">
                راسلنا مباشرة على واتساب للتحقق الفوري من تحويلات مبالغ فودافون كاش وإنستاباي والدعم الفني للمسوقين عبر المحفظة.
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 mt-12 border-t border-white/[0.04] text-center text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>{t.rights}</span>
          <div className="flex gap-2 text-slate-500" id="pwa-badge">
            <span className="px-2.5 py-1 border border-white/[0.06] rounded text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400">
               PWA Ready
            </span>
            <span className="px-2.5 py-1 border border-white/[0.06] rounded text-[9px] uppercase font-mono font-bold tracking-wider text-brand-neon">
               SECURE SSL 256
            </span>
          </div>
        </div>
      </footer>

      {/* Modern High-End Auth Modal Overlay */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Glass Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-[#121215] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-2xl max-w-sm w-full p-6 md:p-8 relative z-10 overflow-hidden"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00]/5 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-display font-extrabold text-white">
                  {authMode === 'login' 
                    ? (isAr ? 'بوابة العضوية الفاخرة' : 'Luxury Entrance Portal') 
                    : (isAr ? 'إنشاء حساب جديد' : 'Establish Premium Account')
                  }
                </h3>
                <button 
                  onClick={() => setIsAuthModalOpen(false)}
                  className="text-slate-500 hover:text-white font-bold cursor-pointer text-xs"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>

              {/* Primary Google Entrance Method */}
              {authMode === 'login' && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setIsGooglePopupActive(true)}
                    className="w-full py-3 px-4 bg-white text-black hover:bg-neutral-100 font-extrabold text-xs rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 border border-white/20 uppercase font-mono tracking-wider"
                  >
                    {/* Google Icon */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.56h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.49C21.68,11.75 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                      <path d="M12,20.9c2.4,0 4.4,-0.8 5.87,-2.16l-3.3,-2.56c-0.9,0.6 -2.07,0.98 -3.12,0.98 -2.4,0 -4.43,-1.62 -5.16,-3.8H2.88v2.64C4.35,18.88 7.91,20.9 12,20.9z" fill="#34A853" />
                      <path d="M6.84,13.36c-0.18,-0.54 -0.29,-1.11 -0.29,-1.7 0,-0.59 0.11,-1.16 0.29,-1.7V7.32H2.88C2.26,8.56 1.91,10.01 1.91,11.66c0,1.65 0.35,3.1 0.97,4.34l3.96,-2.64z" fill="#FBBC05" />
                      <path d="M12,6.72c1.3,0 2.48,0.45 3.4,1.32l2.55,-2.55C16.39,4.09 14.39,3.1 12,3.1 7.91,3.1 4.35,5.12 2.88,8.02l3.96,2.64c0.73,-2.18 2.76,-3.83 5.16,-3.83z" fill="#EA4335" />
                    </svg>
                    <span>{isAr ? 'المتابعة بدخول Google السريع' : 'Continue with Google'}</span>
                  </button>

                  <div className="flex items-center my-4">
                    <div className="flex-1 border-b border-white/[0.06]"></div>
                    <span className="px-3 text-[9px] text-slate-500 font-mono tracking-widest uppercase">
                      {isAr ? 'أو بالطريقة اليدوية' : 'Or via manual keys'}
                    </span>
                    <div className="flex-1 border-b border-white/[0.06]"></div>
                  </div>

                  {!showMoreAuthOptions && (
                    <button
                      type="button"
                      onClick={() => setShowMoreAuthOptions(true)}
                      className="w-full py-2 bg-transparent text-[9px] font-mono tracking-widest text-[#FF7A00] uppercase hover:text-[#D4AF37] text-center font-bold"
                    >
                      {isAr ? '👉 تسجيل الدخول بالبريد والرمز السري الكلاسيكي' : '👉 Legacy Email & Password Credentials'}
                    </button>
                  )}
                </div>
              )}

              {/* Form entries for custom credentials */}
              {(authMode === 'register' || (authMode === 'login' && showMoreAuthOptions)) && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {authMode === 'register' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                        {isAr ? 'الاسم بالكامل' : 'Full Name'}
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder={isAr ? 'حبيبة أحمد' : 'Habiba Ahmed'}
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/[0.07] focus:border-[#FF7A00] focus:outline-hidden text-xs rounded-xl text-white transition-all duration-300 font-light"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                      {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/[0.07] focus:border-[#FF7A00] focus:outline-hidden text-xs rounded-xl text-white transition-all duration-300 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                      {isAr ? 'الرمز السري / الهاتف' : 'Password / Mobile Number'}
                    </label>
                    <input 
                      type="password"
                      required
                      placeholder={isAr ? 'الرقم المعتمد للتحويل الفوري' : 'Active billing number'}
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#1A1A1F] border border-white/[0.07] focus:border-[#FF7A00] focus:outline-hidden text-xs rounded-xl text-white transition-all duration-300 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF7A00] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FF7A00] text-black font-extrabold text-xs rounded-xl transition-all duration-500 shadow-[0_0_15px_rgba(255,122,0,0.3)] hover:shadow-[0_0_25px_rgba(255,122,0,0.55)] cursor-pointer tracking-wider uppercase font-mono mt-2"
                  >
                    {authMode === 'login' ? (isAr ? 'تسجيل الدخول الآمن' : 'Authorize Entrance') : (isAr ? 'إنشاء وتأصيل العضوية' : 'Establish Premium Wallet')}
                  </button>
                </form>
              )}

              <div className="mt-5 text-center text-xs text-slate-400">
                {authMode === 'login' ? (
                  <>
                    <span>{isAr ? 'ليس لديكِ عضوية حتى الآن؟' : 'New client terminal?'} </span>
                    <button 
                      onClick={() => setAuthMode('register')}
                      className="text-[#FF7A00] font-bold hover:underline cursor-pointer"
                    >
                      {isAr ? 'أنشئي حساب جديد الآن' : 'Open Premium Account'}
                    </button>
                  </>
                ) : (
                  <>
                    <span>{isAr ? 'تمتلكين حساب بالفعل؟' : 'Registered customer?'} </span>
                    <button 
                      onClick={() => { setAuthMode('login'); setShowMoreAuthOptions(false); }}
                      className="text-[#FF7A00] font-bold hover:underline cursor-pointer"
                    >
                      {isAr ? 'شغّلي نظام الدخول المباشر' : 'Log In Here'}
                    </button>
                  </>
                )}
              </div>

              {/* Official Contact Display in Login Modal */}
              <div className="mt-5 p-3.5 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-2 text-right md:text-right text-[10px] font-sans" dir="ltr">
                <p className="text-[9px] text-[#FF7A00] uppercase font-mono font-bold tracking-widest text-center">
                  {isAr ? 'القنوات والاتصالات الرسمية لمصر' : 'OFFICIAL SYSTEM CONTACTS'}
                </p>
                <div className="flex justify-between items-center text-slate-350">
                  <span className="font-mono">trendzoneshopeg@gmail.com</span>
                  <span className="text-slate-500 font-bold uppercase text-[8px] tracking-wider font-mono">Email:</span>
                </div>
                <div className="flex justify-between items-center text-slate-350">
                  <span className="font-mono font-bold text-emerald-400">+201507425002</span>
                  <span className="text-slate-500 font-bold uppercase text-[8px] tracking-wider font-mono">WhatsApp:</span>
                </div>
              </div>

              {/* Secure lock footer */}
              <div className="mt-6 pt-4 border-t border-white/[0.05] text-center text-[9px] text-slate-500 font-mono uppercase tracking-widest">
                🔒 trend zone egypt safe cloud encryption
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Google Sign-up / Sign-in Popup Simulation */}
      <AnimatePresence>
        {isGooglePopupActive && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGooglePopupActive(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white text-[#202124] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] max-w-[360px] w-full p-6 relative z-10 text-right overflow-hidden font-sans border border-slate-200"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              {isGoogleLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-9 h-9 border-4 border-slate-200 border-t-[#FF7A00] rounded-full animate-spin"></div>
                  <h4 className="text-xs font-bold text-slate-705 font-mono">
                    {isAr ? 'جاري الاتصال بقنوات التحقق المعتمد لجوجل مِصر...' : 'Synchronizing secure handshake credentials...'}
                  </h4>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
                    {/* Google G logo */}
                    <svg className="w-7 h-7 mb-2 shrink-0" viewBox="0 0 24 24">
                      <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.56h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.49C21.68,11.75 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                      <path d="M12,20.9c2.4,0 4.4,-0.8 5.87,-2.16l-3.3,-2.56c-0.9,0.6 -2.07,0.98 -3.12,0.98 -2.4,0 -4.43,-1.62 -5.16,-3.8H2.88v2.64C4.35,18.88 7.91,20.9 12,20.9z" fill="#34A853" />
                      <path d="M6.84,13.36c-0.18,-0.54 -0.29,-1.11 -0.29,-1.7 0,-0.59 0.11,-1.16 0.29,-1.7V7.32H2.88C2.26,8.56 1.91,10.01 1.91,11.66c0,1.65 0.35,3.1 0.97,4.34l3.96,-2.64z" fill="#FBBC05" />
                      <path d="M12,6.72c1.3,0 2.48,0.45 3.4,1.32l2.55,-2.55C16.39,4.09 14.39,3.1 12,3.1 7.91,3.1 4.35,5.12 2.88,8.02l3.96,2.64c0.73,-2.18 2.76,-3.83 5.16,-3.83z" fill="#EA4335" />
                    </svg>
                    <h3 className="font-extrabold text-sm text-slate-900">{isAr ? 'تسجيل الدخول عبر Google' : 'Sign in with Google'}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">{isAr ? 'المتابعة الفورية إلى تريند زون مصر' : 'to continue with Google Single Sign-On'}</p>
                  </div>

                  <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {[
                      { email: 'trendzoneshopeg@gmail.com', name: isAr ? 'المدير العام لشركة تريند زون' : 'Trend Zone Egypt Support (Director)', isDirector: true },
                      { email: 'habiba.ahmed@gmail.com', name: isAr ? 'حبيبة أحمد السويدي' : 'Habiba Ahmed El-Seweidy' },
                      { email: 'luxury.shopper@gmail.com', name: isAr ? 'المتسوق المتميز' : 'VVIP Guest Member' }
                    ].map((account) => (
                      <button
                        key={account.email}
                        onClick={() => handleGoogleLoginSelect(account.email, account.name)}
                        className="w-full text-right flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 cursor-pointer"
                        dir={isAr ? 'rtl' : 'ltr'}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-[#FF7A00] flex items-center justify-center font-black text-xs select-none shrink-0">
                            {account.name[0]}
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              {account.name}
                              {account.isDirector && (
                                <span className="text-[8px] tracking-wide font-mono bg-red-105 text-[#FF7A00] border border-[#FF7A00]/20 px-1 py-0.5 rounded font-bold uppercase shrink-0">
                                  {isAr ? 'المدير' : 'Director'}
                                </span>
                              )}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono mt-0.5">{account.email}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => setIsGooglePopupActive(false)}
                      className="text-xs font-sans text-slate-400 hover:text-slate-800 font-bold"
                    >
                      {isAr ? 'إلغاء المعاملة' : 'Cancel SSO'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern Encrypted Admin Gate Modal */}
      <AnimatePresence>
        {isAdminGateOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Dark glass cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminGateOpen(false)}
              className="absolute inset-0 bg-[#020205]/95 backdrop-blur-md"
            ></motion.div>

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0b0b0f] border border-[#FF7A00]/20 shadow-[0_24px_80px_rgba(255,122,0,0.15)] rounded-2xl max-w-sm w-full p-6 md:p-8 relative z-10 text-right overflow-hidden font-sans border-t-[#FF7A00]/70"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex justify-between items-center mb-6 border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FF7A00] text-black font-black flex items-center justify-center text-[10px] rounded">
                    S
                  </div>
                  <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
                    {isAr ? 'بوابة الولوج المشفرة للمشرفين' : 'SaaS Encrypted Identity Gate'}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsAdminGateOpen(false)}
                  className="text-slate-500 hover:text-white font-mono text-[10px] uppercase font-bold"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>

              {adminLoginError && (
                <div className="p-3 bg-rose-500/10 text-rose-350 border border-rose-500/20 text-[10px] rounded-xl font-bold font-sans text-center mb-4 leading-normal">
                  ⚠️ {adminLoginError}
                </div>
              )}

              <form onSubmit={handleAdminGateSubmit} className="space-y-4 text-right">
                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                    {isAr ? 'البريد الإلكتروني المعتمد للمشرف' : 'AUTHORIZED ADMIN EMAIL ADDRESS'}
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="trendzoneshopeg@gmail.com"
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111116] border border-white/[0.06] focus:border-[#FF7A00] focus:outline-hidden text-xs rounded-xl text-white transition-all font-mono text-center"
                  />
                  <span className="text-[9px] text-slate-500 block font-mono">
                    {isAr ? '* البريد المسموح به: trendzoneshopeg@gmail.com' : '* Direct entry email: trendzoneshopeg@gmail.com'}
                  </span>
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                    {isAr ? 'مفتاح المرور السري اللوجستي' : 'SECURE DECRYPTION SECRET KEY'}
                  </label>
                  <input 
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111116] border border-white/[0.06] focus:border-[#FF7A00] focus:outline-hidden text-xs rounded-xl text-white transition-all font-mono text-center"
                  />
                  <span className="text-[9px] text-slate-500 block font-sans">
                    {isAr ? '* هاتف واتساب الدعم الخاص بك هو مفتاح المرور' : '* Authorized telephone is secure key'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#FF7A00] to-[#E31C5F] hover:from-[#E31C5F] hover:to-[#FF7A00] text-white font-extrabold text-[10px] rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(255,122,0,0.2)] hover:shadow-[0_0_25px_rgba(255,122,0,0.4)] cursor-pointer tracking-widest uppercase font-mono mt-3"
                >
                  ⚡ {isAr ? 'التحليق بالصلاحيات السحابية' : 'INITIATE SAAS HANDSHAKE'}
                </button>
              </form>

              <div className="mt-5 pt-3.5 border-t border-white/[0.04] text-[9px] text-slate-500 font-mono text-center uppercase tracking-widest">
                🔒 trend zone military grade isolation
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Navigation Bar for Mobile with Premium Glassmorphism */}
      <div className="fixed bottom-0 left-0 right-0 z-45 md:hidden bg-[#0A0A0F]/95 backdrop-blur-2xl border-t border-white/[0.08] px-1 py-2.5 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.95)] select-none">
        
        {/* الرئيسية / Home */}
        <button
          onClick={() => {
            setActiveTab2('shop');
            setSelectedCategory('all');
            setShowMobileCategories(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1.5 transition-colors group cursor-pointer ${
            activeTab === 'shop' && selectedCategory === 'all' && !showMobileCategories
              ? 'text-[#FF7A00]'
              : 'text-slate-400 hover:text-white'
          }`}
          id="mobile-nav-home"
        >
          <Home className="w-5 h-5 transition-transform group-active:scale-95" />
          <span className="text-[10px] font-sans font-extrabold">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* البحث / Search */}
        <button
          onClick={() => {
            setIsSearchOverlayOpen(true);
            setShowMobileCategories(false);
          }}
          className={`flex flex-col items-center gap-1.5 transition-colors group cursor-pointer ${
            isSearchOverlayOpen
              ? 'text-[#FF6B00]'
              : 'text-slate-400 hover:text-white'
          }`}
          id="mobile-nav-search"
        >
          <Search className="w-5 h-5 transition-transform group-active:scale-95" />
          <span className="text-[10px] font-sans font-extrabold">{lang === 'ar' ? 'البحث' : 'Search'}</span>
        </button>

        {/* الأقسام / Categories */}
        <button
          onClick={() => {
            setShowMobileCategories(true);
          }}
          className={`flex flex-col items-center gap-1.5 transition-colors group cursor-pointer ${
            showMobileCategories
              ? 'text-[#FF6B00]'
              : 'text-slate-400 hover:text-white'
          }`}
          id="mobile-nav-categories"
        >
          <Grid className="w-5 h-5 transition-transform group-active:scale-95" />
          <span className="text-[10px] font-sans font-extrabold">{lang === 'ar' ? 'الأقسام' : 'Categories'}</span>
        </button>

        {/* السلة / Cart (with count badge) */}
        <button
          onClick={() => {
            setActiveTab2('dashboard');
            setShowMobileCategories(false);
            setTimeout(() => {
              const el = document.getElementById('shopping-cart');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }}
          className={`flex flex-col items-center gap-1.5 transition-colors relative group cursor-pointer ${
            activeTab === 'dashboard' && !showMobileCategories
              ? 'text-[#FF6B00]'
              : 'text-slate-400 hover:text-white'
          }`}
          id="mobile-nav-cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 transition-transform group-active:scale-95" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#FF6B00] text-white text-[8px] font-mono font-bold px-1.5 rounded-full border border-[#0A0A0F] leading-none py-0.5 min-w-[14px] flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-sans font-extrabold">{lang === 'ar' ? 'السلة' : 'Basket'}</span>
        </button>

        {/* حسابي / Account */}
        <button
          onClick={() => {
            setShowMobileCategories(false);
            if (isLoggedIn) {
              setActiveTab2('wallet');
            } else {
              setAuthMode('login');
              setShowMoreAuthOptions(false);
              setIsAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center gap-1.5 transition-colors group cursor-pointer ${
            (activeTab === 'wallet' || activeTab === 'admin') && !showMobileCategories
              ? 'text-[#FF6B00]'
              : 'text-slate-400 hover:text-white'
          }`}
          id="mobile-nav-account"
        >
          <User className="w-5 h-5 transition-transform group-active:scale-95" />
          <span className="text-[10px] font-sans font-extrabold">{lang === 'ar' ? 'حسابي' : 'Account'}</span>
        </button>

      </div>

      {/* One-hand responsive Mobile Categories Bottom Sheet Modal */}
      <AnimatePresence>
        {showMobileCategories && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden" id="mobile-categories-backdrop-root">
            {/* Dark glass cover backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileCategories(false)}
              className="absolute inset-0 bg-[#020205]/95 backdrop-blur-xs"
            />

            {/* Interactive Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full bg-[#0E0E12] border-t border-white/[0.08] shadow-[0_-15px_40px_rgba(0,0,0,0.85)] rounded-t-3xl p-6 relative z-10 text-right pb-10"
              dir={isAr ? 'rtl' : 'ltr'}
              id="mobile-categories-drawer"
            >
              {/* Swipe handler notch mock decoration */}
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-5 cursor-pointer" onClick={() => setShowMobileCategories(false)} />

              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-display font-extrabold text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <Grid className="w-4 h-4 text-[#FF6B00]" />
                  {lang === 'ar' ? 'رواق تصنيفات تريند زون' : 'TREND ZONE CATEGORIES'}
                </span>
                <button
                  onClick={() => setShowMobileCategories(false)}
                  className="text-xs font-mono font-bold text-slate-500 hover:text-white cursor-pointer px-2 py-1 bg-white/[0.02] border border-white/[0.05] rounded-xl"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-8">
                {(categories || []).filter(c => c.active !== false).map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab2('shop');
                      setSelectedCategory(item.key);
                      setShowMobileCategories(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-4 rounded-xl text-right border transition-all flex flex-col justify-between h-24 cursor-pointer outline-hidden ${
                      selectedCategory === item.key && activeTab === 'shop'
                        ? 'bg-[#FF6B00]/10 border-[#FF6B00] text-white shadow-[0_0_12px_rgba(255,107,0,0.2)] font-bold'
                        : 'bg-white/[0.01] border-white/[0.05] text-slate-300 hover:border-[#FF6B00]/40'
                    }`}
                  >
                    <span className="text-xs font-bold leading-none">{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                    <span className="text-[9px] text-[#FF6B00] font-mono block mt-1 leading-normal">
                      {isAr ? 'عرض القسم الرائد' : 'Enter curated catalog'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Support Button - The ONLY floating item permitted as per clean mobile UX standard */}
      <a
        href="https://wa.me/201507425002"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-4 bottom-22 md:bottom-8 z-40 w-11 h-11 rounded-full bg-[#25D366] hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
        title={lang === 'ar' ? 'الدعم الفني عبر واتساب' : 'WhatsApp Support'}
        id="global-sticky-whatsapp-fab"
      >
        <svg className="w-5.5 h-5.5 text-white fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.449 5.4 0 9.786-4.391 9.79-9.785.002-2.614-1.011-5.074-2.853-6.918C16.318 2.056 13.86 1.045 11.231 1.045c-5.4 0-9.786 4.39-9.79 9.783-.002 1.814.48 3.526 1.396 5.105l-1.006 3.67 3.768-.989zM15.83 12.903c-.229-.115-1.353-.667-1.562-.743-.21-.076-.361-.115-.514.115-.152.23-.591.743-.724.897-.133.153-.266.172-.495.057-.229-.115-.967-.357-1.844-1.14-.682-.609-1.143-1.36-1.277-1.59-.133-.23-.014-.354.1-.468.103-.103.229-.268.343-.403.114-.134.152-.23.229-.383.076-.153.038-.287-.019-.402-.057-.115-.514-1.24-.704-1.697-.186-.447-.372-.387-.514-.394-.133-.005-.285-.006-.438-.006-.152 0-.401.057-.61.287-.21.23-.8.782-.8 1.908 0 1.127.818 2.212.932 2.366.114.153 1.611 2.46 3.902 3.447.545.234.97.374 1.302.479.547.174 1.044.15 1.437.091.439-.067 1.353-.553 1.543-1.087.19-.533.19-.99.133-1.087-.057-.097-.209-.153-.438-.268z"/>
        </svg>
      </a>

      {/* Slide Drawer Menu (For Secondary Actions & Settings Switchers) */}
      <AnimatePresence>
        {isSlideDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end" id="slide-drawer-root">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSlideDrawerOpen(false)}
              className="absolute inset-0 bg-[#020205]/95 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="w-80 h-full bg-[#0D0D12] border-l border-white/[0.08] p-6 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col justify-between"
              dir={isAr ? 'rtl' : 'ltr'}
              id="slide-drawer-container"
            >
              <div className="space-y-6 overflow-y-auto pr-1 scrollbar-none">
                <div className="flex justify-between items-center border-b border-white/[0.05] pb-4">
                  <span className="text-xs font-display font-extrabold text-white tracking-widest uppercase flex items-center gap-2 font-mono">
                    <Sliders className="w-4.5 h-4.5 text-[#FF7A00]" />
                    {lang === 'ar' ? 'لوحة الملحقات الجانبية' : 'HUD UTILITY DRAWER'}
                  </span>
                  <button
                    onClick={() => setIsSlideDrawerOpen(false)}
                    className="text-[10px] font-mono font-bold text-slate-500 hover:text-white cursor-pointer px-2.5 py-1 bg-white/[0.02] border border-white/[0.05] rounded-xl"
                  >
                    {lang === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>

                {/* 1. Language Option Switch */}
                <div className="space-y-2 text-right">
                  <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">// {lang === 'ar' ? 'ترجمة الواجهة' : 'GLOBAL LOCALIZATION'}</h4>
                  <button
                    onClick={() => {
                      setLang(lang === 'ar' ? 'en' : 'ar');
                      setIsSlideDrawerOpen(false);
                    }}
                    className="w-full p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#FF7A00]/50 hover:bg-white/[0.04] transition-all text-right flex items-center justify-between text-xs cursor-pointer"
                  >
                    <span className="font-bold text-white font-sans">{lang === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
                    <span className="text-[10px] text-[#FF7A00] font-mono font-bold">CODE: {lang.toUpperCase()}</span>
                  </button>
                </div>

                {/* 2. Authority level selector (RBAC) */}
                <div className="space-y-2.5 text-right">
                  <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">// {lang === 'ar' ? 'محاكي الصلاحيات في المعاينة' : 'TESTING ROLE SIMULATION'}</h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {[
                      { role: 'customer' as UserRole, label: lang === 'ar' ? '👤 متسوق' : 'Shopper' },
                      { role: 'super_admin' as UserRole, label: lang === 'ar' ? '👑 أدمن' : 'Super Admin' },
                      { role: 'customer_service' as UserRole, label: lang === 'ar' ? '📞 دعم' : 'Support' },
                      { role: 'affiliate' as UserRole, label: lang === 'ar' ? '🤝 مسوق' : 'Affiliate' }
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => {
                          setCurrentRole(item.role);
                          if (item.role === 'customer') {
                            setIsLoggedIn(false);
                          } else {
                            setIsLoggedIn(true);
                            setUserEmail('trendzoneshopeg@gmail.com');
                            setUserName(item.role === 'super_admin' ? 'تامر صقر (أدمن)' : 'مساعد كورتيكس');
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                          currentRole === item.role
                            ? 'bg-[#FF7A00]/10 border-[#FF7A00] text-white shadow-[0_0_10px_rgba(255,122,0,0.15)]'
                            : 'bg-[#18181F]/40 border-white/[0.04] text-slate-400 hover:border-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Product Comparison Shortcut */}
                <div className="space-y-2 text-right">
                  <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">// {lang === 'ar' ? 'منصة مقارنة السلع' : 'PRODUCT COMPARATOR'}</h4>
                  <button
                    onClick={() => {
                      setIsSlideDrawerOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('product-compilation-bracket');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 200);
                    }}
                    className="w-full p-3 bg-[#18181F]/60 border border-white/[0.04] rounded-xl hover:border-[#FF7A00]/40 text-xs text-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>{lang === 'ar' ? 'مقارنة المنتجات النشطة' : 'Compare active selections'}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-neutral-900 rounded font-black text-[#FF7A00]">{compareList.length}</span>
                  </button>
                </div>

                {/* 4. Support contacts */}
                <div className="space-y-2 text-right">
                  <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">// {lang === 'ar' ? 'الدعم والمراسلات الرسمية' : 'OFFICIAL HOTLINE'}</h4>
                  <a
                    href="https://wa.me/201507425002"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-xl text-center flex items-center justify-center gap-2 text-emerald-450 font-bold text-xs cursor-pointer transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{lang === 'ar' ? 'واتساب المساعدة للشراء لدولة مصر' : 'WhatsApp Client Concierge'}</span>
                  </a>
                </div>
              </div>

              {/* Secure control panel launch indicator */}
              <div className="pt-6 border-t border-white/[0.05]">
                {canAccessAdmin ? (
                  <button
                    onClick={() => {
                      setIsSlideDrawerOpen(false);
                      navigateTo('/admin');
                      setActiveTab2('admin');
                    }}
                    className="w-full py-3 bg-[#FF7A00] text-black font-extrabold text-xs rounded-xl hover:bg-white transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(255,122,0,0.25)]"
                  >
                    <Settings className="w-4 h-4 text-black" />
                    <span>{lang === 'ar' ? 'فتح لوحة الإداريين الكاملة' : 'Launch SaaS Controls'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsSlideDrawerOpen(false);
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-3 bg-neutral-800 text-slate-300 font-bold text-xs rounded-xl hover:text-white transition-all text-center cursor-pointer"
                  >
                    {lang === 'ar' ? 'تسجيل دخول المشرفين' : 'Staff Secure Gate'}
                  </button>
                )}
                <span className="text-[8px] font-mono text-center text-slate-600 block mt-3 uppercase tracking-widest leading-none">
                  // trend zone high status isolation
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Glowing Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOverlayOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12" id="search-modal-backdrop-wrapper">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.92 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOverlayOpen(false)}
              className="absolute inset-0 bg-[#020205]/98 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -20, opacity: 0 }}
              className="w-full max-w-xl bg-[#0E0E12] border border-white/[0.08] rounded-3xl p-6 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[80vh] flex flex-col"
              dir={isAr ? 'rtl' : 'ltr'}
              id="search-floating-dialog"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#FF7A00]" />
                  <span className="text-xs font-mono font-bold text-slate-300 tracking-wider uppercase">
                    {isAr ? 'ابحث عن السلع النادرة والفاخرة' : 'SEARCH LUXURY REGISTRY'}
                  </span>
                </div>
                <button 
                  onClick={() => setIsSearchOverlayOpen(false)}
                  className="text-slate-400 hover:text-white font-bold text-xs px-2.5 py-1 bg-white/[0.03] border border-white/[0.05] rounded-xl cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>

              {/* Input field */}
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder={isAr ? 'اكتب اسم الساعة، العبوة، أو المقاس...' : 'Type watch title, caftan shade, skincare keyword...'}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveTab2('shop'); // ensure user is on active shop tab to see results!
                  }}
                  className="w-full text-xs bg-[#121215] text-white border border-[#FF7A00]/40 rounded-2xl p-4 focus:outline-hidden text-right font-sans focus:border-[#FF7A00] focus:shadow-[0_0_15px_rgba(255,122,0,0.25)]"
                />
              </div>

              {/* Quick Results preview right in search overlay! */}
              <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 scrollbar-none text-right">
                <p className="text-[9px] text-[#FF7A00] font-mono uppercase tracking-widest">// Quick insights ({products.filter(p => (isAr ? p.nameAr : p.nameEn).toLowerCase().includes(searchQuery.toLowerCase())).length} found)</p>
                {searchQuery.trim().length > 0 ? (
                  products
                    .filter(p => (isAr ? p.nameAr + p.category : p.nameEn + p.category).toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 5)
                    .map((p) => (
                      <div 
                        key={p.id}
                        onClick={() => {
                          setActiveTab2('shop');
                          setIsSearchOverlayOpen(false);
                          setTimeout(() => {
                            const el = document.getElementById(`product-card-${p.id}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 300);
                        }}
                        className="p-2.5 bg-white/[0.01] border border-white/[0.03] rounded-xl hover:bg-[#FF7A00]/10 hover:border-[#FF7A00]/30 transition-all flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={p.image} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <div className="text-right">
                            <h5 className="text-[11px] font-bold text-white line-clamp-1">{isAr ? p.nameAr : p.nameEn}</h5>
                            <span className="text-[9px] text-slate-500 font-mono uppercase">{p.category}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-[#FF7A00] font-black">{p.price} EGP</span>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-[10px]">
                    {isAr ? 'اكتب كلمة مفتاحية للعثور على تفاصيل السلعة بسرعة' : 'Enter product tags or names above...'}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
