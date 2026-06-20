import { Product, LoyaltyWallet, AffiliateProfile, CRMNote, CRMTask, DBActivityLog, Order } from './types';

// Governorates with shipping costs in EGP
export const GOVERNORATES = [
  { key: 'cairo', ar: 'القاهرة', en: 'Cairo', cost: 45, days: 2 },
  { key: 'giza', ar: 'الجيزة', en: 'Giza', cost: 45, days: 2 },
  { key: 'alexandria', ar: 'الإسكندرية', en: 'Alexandria', cost: 55, days: 3 },
  { key: 'qalyubia', ar: 'القليوبية', en: 'Qalyubia', cost: 50, days: 3 },
  { key: 'sharqia', ar: 'الشرقية', en: 'Sharqia', cost: 55, days: 3 },
  { key: 'dakahlia', ar: 'الدقهلية', en: 'Dakahlia', cost: 55, days: 3 },
  { key: 'gharbia', ar: 'الغربية', en: 'Gharbia', cost: 55, days: 3 },
  { key: 'monufia', ar: 'المنوفية', en: 'Monufia', cost: 55, days: 3 },
  { key: 'beheira', ar: 'البحيرة', en: 'Beheira', cost: 60, days: 4 },
  { key: 'damietta', ar: 'دمياط', en: 'Damietta', cost: 60, days: 4 },
  { key: 'portsaid', ar: 'بورسعيد', en: 'Port Said', cost: 60, days: 4 },
  { key: 'ismailia', ar: 'الإسماعيلية', en: 'Ismailia', cost: 55, days: 4 },
  { key: 'suez', ar: 'السويس', en: 'Suez', cost: 55, days: 4 },
  { key: 'fayoum', ar: 'الفيوم', en: 'Fayoum', cost: 65, days: 4 },
  { key: 'benisuef', ar: 'بني سويف', en: 'Beni Suef', cost: 65, days: 4 },
  { key: 'minya', ar: 'المنيا', en: 'Minya', cost: 70, days: 5 },
  { key: 'asyut', ar: 'أسيوط', en: 'Asyut', cost: 75, days: 5 },
  { key: 'sohag', ar: 'سوهاج', en: 'Sohag', cost: 75, days: 5 },
  { key: 'qena', ar: 'قنا', en: 'Qena', cost: 80, days: 6 },
  { key: 'luxor', ar: 'الأقصر', en: 'Luxor', cost: 80, days: 6 },
  { key: 'aswan', ar: 'أسوان', en: 'Aswan', cost: 85, days: 6 },
  { key: 'redsea', ar: 'البحر الأحمر', en: 'Red Sea', cost: 90, days: 6 },
  { key: 'matrouh', ar: 'مطروح', en: 'Matrouh', cost: 95, days: 7 },
  { key: 'sinai_south', ar: 'جنوب سيناء', en: 'South Sinai', cost: 110, days: 7 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    nameAr: 'ساعة رويال هيريتدج الكلاسيكية - ستيل فضي الذهبي',
    nameEn: 'Royal Heritage Classic Watch - Gold Silver Steel',
    descriptionAr: 'ساعة يد كلاسيكية فاخرة مناسبة لكل الأوقات، مقاومة للماء مع عقارب مضيئة ستيل ممتاز ومكينة كوارتز معتمدة مصممة لأصحاب الذوق الرفيع.',
    descriptionEn: 'Luxury classic hybrid wrist watch, water-resistant with luminous hands, premium stainless steel build, and battery quartz movement suitable for high status look.',
    price: 1850,
    originalPrice: 2400,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'watches',
    rating: 4.8,
    reviewsCount: 154,
    stock: 12,
    colors: ['ذهبي / فضي', 'فضي كامل', 'أسود ملكي'],
    sizes: ['Standard'],
    variants: [
      { sku: 'TZ-WT-GOLD-STD', color: 'ذهبي / فضي', size: 'Standard', stock: 5 },
      { sku: 'TZ-WT-SILV-STD', color: 'فضي كامل', size: 'Standard', stock: 4 },
      { sku: 'TZ-WT-BLCK-STD', color: 'أسود ملكي', size: 'Standard', stock: 3 }
    ],
    sku: 'TZ-WT-GOLD',
    isFlashSale: true,
    flashSalePrice: 1699
  },
  {
    id: 'prod-2',
    nameAr: 'عطر الفخامة الشرقية - عود وورد فرنسي',
    nameEn: 'Oriental Luxury Perfume - French Oud & Rose',
    descriptionAr: 'مزيج فاخر ساحر بين دهن العود الكمبودي النادر وبتلات الورد الطائفي الفرنسي لثبات يدوم أكثر من 48 ساعة وإطلالة ملهمة تشد القلوب.',
    descriptionEn: 'A masterful luxurious blend of wild Cambodian Oud oil and delicate French organic roses, crafted for a premium 48H performance sillage and projection.',
    price: 950,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'beauty',
    rating: 4.9,
    reviewsCount: 210,
    stock: 25,
    colors: ['عبوة ذهبية 100 مل'],
    sizes: ['100ml'],
    variants: [
      { sku: 'TZ-PF-OUD-100', color: 'عبوة ذهبية 100 مل', size: '100ml', stock: 25 }
    ],
    sku: 'TZ-PF-OUD',
    isFlashSale: true,
    flashSalePrice: 850
  },
  {
    id: 'prod-3',
    nameAr: 'قفطان فاشون مغربي مطرز يدويًا بذهب مصفى',
    nameEn: 'Handmade Gold Embroidered Velvet Kaftan',
    descriptionAr: 'عباءة قفطان مغربية راقية مناسبة للأعياد والمناسبات والسهرات الفاخرة، مصنوع من قماش المخمل الناعم والتطريز الذهبي الفخم واليدوي.',
    descriptionEn: 'Stunning luxury Moroccan Caftan made from premium velvet fabric and hand-finished golden thread embroidery, designed for special occasions and gala events.',
    price: 2900,
    originalPrice: 3800,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'fashion',
    rating: 4.7,
    reviewsCount: 88,
    stock: 6,
    colors: ['أحمر خمري', 'أخضر زمردي', 'كحلي داكن'],
    sizes: ['M', 'L', 'XL'],
    variants: [
      { sku: 'TZ-KF-RED-M', color: 'أحمر خمري', size: 'M', stock: 2 },
      { sku: 'TZ-KF-RED-L', color: 'أحمر خمري', size: 'L', stock: 1 },
      { sku: 'TZ-KF-EMR-L', color: 'أخضر زمردي', size: 'L', stock: 1 },
      { sku: 'TZ-KF-EMR-XL', color: 'أخضر زمردي', size: 'XL', stock: 1 },
      { sku: 'TZ-KF-NAVY-M', color: 'كحلي داكن', size: 'M', stock: 1 }
    ],
    sku: 'TZ-KF-VLVT'
  },
  {
    id: 'prod-4',
    nameAr: 'مجموعة العناية بالبشرة ريفيتالايز الطبيعية المتكاملة',
    nameEn: 'Revitalize Facial Organic skincare Set',
    descriptionAr: 'مجموعة مكونة من 4 منتجات عضوية: غسول الوجه الهيدروليكي، سيروم من فيتامين سي، مرطب الصبار الطبيعي، وتونر نضارة الورد لحماية وبشرة كالحرير.',
    descriptionEn: 'A complete skincare therapy package featuring Hydraulic cleanser, Vitamin C glow boosting serum, organic aloe moisturizer, and rose toner water drops.',
    price: 1100,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'beauty',
    rating: 4.6,
    reviewsCount: 340,
    stock: 45,
    colors: ['مجموعة كاملة 4 في 1'],
    sizes: ['Standard Set'],
    variants: [
      { sku: 'TZ-SC-SET-STD', color: 'مجموعة كاملة 4 في 1', size: 'Standard Set', stock: 45 }
    ],
    sku: 'TZ-SC-SET'
  },
  {
    id: 'prod-5',
    nameAr: 'فازة بوهو الاسكندنافية الفاخرة - سيراميك مطفي يدوي',
    nameEn: 'Nordic Minimalist Boho Ceramic Vase - Matte Finish',
    descriptionAr: 'تحفة وديكور فني راقي من السيراميك الفاخر المحبب للمجالس وغرف المعيشة الحديثة بتصميم فني يبرز الأناقة بأسلوب بوهو الكلاسيكي المميز.',
    descriptionEn: 'Exquisite modern Nordic minimalist ceramic vase, featuring matte handcrafted textures, ideal for designer living rooms and elegant entrance setups.',
    price: 750,
    originalPrice: 1100,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=600'
    ],
    category: 'decor',
    rating: 4.8,
    reviewsCount: 95,
    stock: 3,
    colors: ['أبيض مطفي', 'بيج رملي'],
    sizes: ['Medium', 'Large'],
    variants: [
      { sku: 'TZ-VS-WHT-MD', color: 'أبيض مطفي', size: 'Medium', stock: 1 },
      { sku: 'TZ-VS-WHT-LG', color: 'أبيض مطفي', size: 'Large', stock: 1 },
      { sku: 'TZ-VS-SND-MD', color: 'بيج رملي', size: 'Medium', stock: 1 }
    ],
    sku: 'TZ-VS-DECOR',
    isFlashSale: true,
    flashSalePrice: 599
  }
];

export const INITIAL_LOYALTY: LoyaltyWallet = {
  userId: 'user-cust-1',
  walletBalance: 350,
  loyaltyPoints: 1250,
  loyaltyLevel: 'Silver',
  transactions: [
    {
      id: 'tx-1',
      amount: 150,
      type: 'deposit',
      status: 'completed',
      date: '2026-06-15 14:30',
      description: 'شحن محفظة عبر فودافون كاش / Wallet topup via Vodafone Cash'
    },
    {
      id: 'tx-2',
      amount: 200,
      type: 'purchase',
      status: 'completed',
      date: '2026-06-17 10:15',
      description: 'شراء ساعة رويال هيريتدج / Purchase entry'
    }
  ]
};

export const INITIAL_AFFILIATE: AffiliateProfile = {
  id: 'aff-profile-1',
  userId: 'user-aff-1',
  referralCode: 'TREND77',
  clicks: 1450,
  conversions: 35,
  earnings: 2450,
  withdrawn: 1200,
  balance: 1250,
  referrals: [
    { orderId: 'ORD-9831', amount: 1850, commission: 185, date: '2026-06-18 19:30', status: 'paid' },
    { orderId: 'ORD-9122', amount: 950, commission: 95, date: '2026-06-19 11:20', status: 'pending' },
    { orderId: 'ORD-8711', amount: 2900, commission: 290, date: '2026-06-19 15:00', status: 'pending' }
  ]
};

export const INITIAL_CRM_NOTES: CRMNote[] = [
  {
    id: 'note-1',
    customerId: 'user-cust-1',
    customerName: 'أحمد محمود / Ahmed Mahmoud',
    note: 'الزبون مهتم جداً بمنتجات الساعات والعود. أكد أنه يود إرسال كوبونات الخصم عبر الواتساب مباشرة.',
    author: 'هبة - خدمة العملاء',
    createdAt: '2026-06-18 16:30'
  },
  {
    id: 'note-2',
    customerId: 'user-cust-1',
    customerName: 'أحمد محمود / Ahmed Mahmoud',
    note: 'تأكيد صحة العنوان ومواصفات التوصيل لمدينة طنطا.',
    author: 'علي - مدير الشحن',
    createdAt: '2026-06-19 09:12'
  }
];

export const INITIAL_CRM_TASKS: CRMTask[] = [
  {
    id: 'task-1',
    customerId: 'user-cust-1',
    customerName: 'أحمد محمود / Ahmed Mahmoud',
    task: 'الاتصال بالعميل لتأكيد تفاصيل قفطان العيد ومقاس الميديوم',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-06-21'
  },
  {
    id: 'task-2',
    customerId: 'user-cust-1',
    customerName: 'أحمد محمود / Ahmed Mahmoud',
    task: 'متابعة شحنة بوستا للمشغولات اليدوية لضمان تسليمها السريع',
    priority: 'medium',
    status: 'completed',
    dueDate: '2026-06-19'
  }
];

export const INITIAL_ACTIVITY_LOGS: DBActivityLog[] = [
  {
    id: 'log-1',
    userId: 'user-admin-1',
    userName: 'الأدمن الرئيسي - تامر صقر',
    userRole: 'super_admin',
    action: 'تحديث سعر ساعة رويال هيريتدج الكلاسيكية',
    module: 'المخزون والمنتجات',
    timestamp: '2026-06-19 14:15:33',
    ipAddress: '197.34.120.44'
  },
  {
    id: 'log-2',
    userId: 'user-aff-1',
    userName: 'كريم شاهين',
    userRole: 'affiliate',
    action: 'طلب سحب عمولة بقيمة 600 جنيه',
    module: 'لوحة التسويق بالعمولة',
    timestamp: '2026-06-19 16:45:01',
    ipAddress: '197.35.41.98'
  },
  {
    id: 'log-3',
    userId: 'user-cust-1',
    userName: 'أحمد محمود',
    userRole: 'customer',
    action: 'تأكيد طلب الشراء ORD-9831 بمبلغ 1850 جنيه',
    module: 'الطلبات والمدفوعات',
    timestamp: '2026-06-19 17:01:21',
    ipAddress: '102.43.12.5'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9831',
    userId: 'user-cust-1',
    userName: 'أحمد محمود',
    items: [
      {
        productId: 'prod-1',
        productName: 'ساعة رويال هيريتدج الكلاسيكية',
        color: 'ذهبي / فضي',
        size: 'Standard',
        price: 1850,
        quantity: 1
      }
    ],
    total: 1895, // 1850 + 45 shipping Giza
    status: 'processing',
    paymentMethod: 'vodafone_cash',
    paymentProof: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600', // Mock screenshot of txn
    shippingMethod: 'bosta',
    shippingAddress: {
      fullName: 'أحمد محمود سليمان',
      phone: '01012345678',
      governorate: 'giza',
      city: '6 أكتوبر',
      streetAddress: 'الحي المتميز، عمارة 140'
    },
    trackingNumber: 'BST-88319-EGY',
    trackingHistory: [
      { status: 'تم استلام الطلب', date: '2026-06-18 19:30', location: 'مستودع القاهرة الرئيسي' },
      { status: 'تحت التجهيز والتغليف', date: '2026-06-19 10:00', location: 'مستودع القاهرة الرئيسي' },
      { status: 'بانتظار تسليمها لمندوب بوسطة وشحنها بالكامل', date: '2026-06-19 17:00', location: 'مستودع القاهرة الرئيسي' }
    ],
    date: '2026-06-18'
  }
];

export const INITIAL_PROMOS: any[] = [
  {
    id: 'promo-1',
    code: 'TREND20',
    discountType: 'percentage',
    value: 20,
    minAmount: 500,
    active: true,
    expiryDate: '2026-10-01'
  },
  {
    id: 'promo-2',
    code: 'WELCOME100',
    discountType: 'fixed',
    value: 100,
    minAmount: 1000,
    active: true,
    expiryDate: '2026-12-31'
  },
  {
    id: 'promo-3',
    code: 'VIP3D',
    discountType: 'percentage',
    value: 15,
    minAmount: 1500,
    active: false,
    expiryDate: '2026-07-15'
  }
];

export const INITIAL_TICKETS: any[] = [
  {
    id: 'TCK-102',
    customerName: 'أميرة فؤاد / Qena',
    customerEmail: 'amira.f@gmail.com',
    subject: 'تأخر مندوب الشحن بمحافظة قنا لطرود العيد',
    message: 'أرجو التنسيق العاجل مع مندوب أرامكس لتسليم طلبي المعلق كود ORD-9831 نظراً لضرورة السفر قبل العيد.',
    status: 'open',
    createdAt: '2026-06-19 11:30',
    priority: 'high'
  },
  {
    id: 'TCK-101',
    customerName: 'محمود سالم / Giza',
    customerEmail: 'msalem@outlook.com',
    subject: 'استفسار بخصوص كاش باك محفظة كاش الولاء',
    message: 'هل يمكن تحويل الكاش في محفظتي الرقمية مباشرة على فودافون كاش الخاص بي؟ الشكر الجزيل لخدمة العملاء الرائعة.',
    status: 'resolved',
    createdAt: '2026-06-18 14:02',
    priority: 'medium'
  }
];

