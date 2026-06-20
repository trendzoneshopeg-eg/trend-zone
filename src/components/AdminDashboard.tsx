import React, { useState } from 'react';
import { 
  Clipboard, 
  Shield, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  Plus, 
  CheckCircle, 
  Trash2, 
  Eye, 
  Layout, 
  Settings, 
  FileText, 
  Bell, 
  Sparkles, 
  ShieldAlert, 
  Activity, 
  Server, 
  FileCheck, 
  Check, 
  DollarSign, 
  TrendingUp, 
  Tag, 
  MessageSquare, 
  User, 
  CheckCircle2, 
  X, 
  ArrowUpRight, 
  LogOut, 
  ShoppingBag,
  Inbox,
  Download,
  Upload
} from 'lucide-react';
import { Product, Language, Order, CRMNote, CRMTask, DBActivityLog, UserRole, PromoCode, SupportTicket } from '../types';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  notes: CRMNote[];
  tasks: CRMTask[];
  activityLogs: DBActivityLog[];
  onReplenishProduct: (prodId: string) => void;
  onUpdateOrderStatus: (itemId: string, status: Order['status'], trackingText?: string) => void;
  onAddCRMNote: (note: Partial<CRMNote>) => void;
  onAddCRMTask: (task: Partial<CRMTask>) => void;
  onToggleTaskStatus: (taskId: string) => void;
  lang: Language;
  currentRole: UserRole;
  
  // Custom SaaS props
  promos: PromoCode[];
  setPromos: React.Dispatch<React.SetStateAction<PromoCode[]>>;
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  onLogoutAdmin: () => void;
  onGoToStorefront: () => void;

  // Design identity and categories CMS props
  storeDesign: any;
  setStoreDesign: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function AdminDashboard({
  products,
  setProducts,
  orders,
  setOrders,
  notes,
  tasks,
  activityLogs,
  onReplenishProduct,
  onUpdateOrderStatus,
  onAddCRMNote,
  onAddCRMTask,
  onToggleTaskStatus,
  lang,
  currentRole,
  promos,
  setPromos,
  tickets,
  setTickets,
  onLogoutAdmin,
  onGoToStorefront,
  storeDesign,
  setStoreDesign,
  categories,
  setCategories
}: AdminDashboardProps) {
  const isAr = lang === 'ar';
  
  // Tab within SaaS portal (including brand identity CMS / Custom layouts)
  const [activeTab, setActiveTab2] = useState<'analytics' | 'products' | 'pricing' | 'orders' | 'inventory' | 'dropshipping' | 'users' | 'returns' | 'promotions' | 'tickets' | 'crm' | 'security' | 'design'>('analytics');

  // Input states for CRM
  const [newNoteText, setNewNoteText] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-06-25');

  // New Promotion states
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoValue, setNewPromoValue] = useState<number>(10);
  const [newPromoMinAmount, setNewPromoMinAmount] = useState<number>(500);
  const [newPromoExpiry, setNewPromoExpiry] = useState('2026-10-31');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState(false);

  // New Ticket states
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [newTicketSuccess, setNewTicketSuccess] = useState(false);

  // Status modify states
  const [submittingOrderTracking, setSubmittingOrderTracking] = useState<string | null>(null);
  const [customTrackingText, setCustomTrackingText] = useState('');

  // CMS Category local input states
  const [newCatKey, setNewCatKey] = useState('');
  const [newCatAr, setNewCatAr] = useState('');
  const [newCatEn, setNewCatEn] = useState('');

  // Bulk Product Import state management
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');

  // Low stock calculation
  const lowStockProducts = products.filter(p => p.stock <= 5);

  // Stats variables
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const activeTicketsCount = tickets.filter(t => t.status !== 'resolved').length;

  // Modern SaaS Users and Return Requests States
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', email: 'trendzoneshopeg@gmail.com', name: 'المدير العام لشركة تريند زون', role: 'super_admin' as const, wallet: 15400, points: 5000, phone: '+201507425002' },
    { id: 'usr-2', email: 'habiba.ahmed@gmail.com', name: 'حبيبة أحمد السويدي', role: 'customer' as const, wallet: 420, points: 1850, phone: '01014398129' },
    { id: 'usr-3', email: 'sara.hossam@gmail.com', name: 'سارة حسام الدمرداش', role: 'customer' as const, wallet: 180, points: 3210, phone: '01124896522' },
    { id: 'usr-4', email: 'msalem@outlook.com', name: 'محمود سالم الخطيب', role: 'customer' as const, wallet: 0, points: 250, phone: '01289354141' },
    { id: 'usr-5', email: 'amira.f@gmail.com', name: 'أميرة فؤاد رشوان', role: 'customer' as const, wallet: 110, points: 640, phone: '01514782361' }
  ]);

  const [returnsList, setReturnsList] = useState([
    { id: 'RET-01', orderId: 'ORD-9831', customerName: 'أميرة فؤاد رشوان', email: 'amira.f@gmail.com', product: 'مجموعة العناية بالبشرة ريفيتالايز الطبيعية المتكاملة', total: 1100, reason: 'المندوب تأخر جدا والطلب لم يعد مطلوب لعيد الميلاد بقنا', date: '2026-06-19', status: 'pending' },
    { id: 'RET-02', orderId: 'ORD-7721', customerName: 'محمود سالم الخطيب', email: 'msalem@outlook.com', product: 'فازة بوهو الاسكندنافية الفاخرة', total: 750, reason: 'تغيير رأي العميل واستبدال بمنتج آخر', date: '2026-06-18', status: 'approved' }
  ]);

  // --- 1. Product Management CRUD States ---
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [prodForm, setProdForm] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    price: 350,
    originalPrice: 200,
    stock: 20,
    image: '',
    category: 'watches',
    sku: '',
    colors: 'أسود, بني',
    sizes: 'Standard'
  });

  // --- 2. Pricing Engine States ---
  const [pricingCategory, setPricingCategory] = useState('all');
  const [pricingPercent, setPricingPercent] = useState(10);
  const [pricingType, setPricingType] = useState<'discount' | 'increase'>('discount');
  const [pricingStatus, setPricingStatus] = useState('');

  // --- 3. Dropshipping States ---
  const [dropshipUrlInput, setDropshipUrlInput] = useState('');
  const [dropshipCost, setDropshipCost] = useState(15.99); // USD
  const [dropshipMarkup, setDropshipMarkup] = useState(40); // % percentage margin
  const [dropshipNameAr, setDropshipNameAr] = useState('');
  const [dropshipNameEn, setDropshipNameEn] = useState('');
  const [dropshipCategory, setDropshipCategory] = useState('skin_care');
  const [dropshipLogs, setDropshipLogs] = useState<string[]>([
    'تم تهيئة بوابة الشحن مع CJ Dropshipping بنجاح.',
    'معدل صرف الدولار الجمركي المحتسب تلقائياً: 1 USD = 48 EGP.'
  ]);
  const [isSyncingDropship, setIsSyncingDropship] = useState(false);
  
  const handleCreateCRMNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    onAddCRMNote({
      id: `note-${Date.now()}`,
      customerId: 'user-cust-1',
      customerName: 'أحمد محمود / Ahmed Mahmoud',
      note: newNoteText,
      author: isAr ? 'إدارة تريند زون' : 'Active Staff Member',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    setNewNoteText('');
  };

  const handleCreateCRMTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    onAddCRMTask({
      id: `task-${Date.now()}`,
      customerId: 'user-cust-1',
      customerName: 'أحمد محمود / Ahmed Mahmoud',
      task: newTaskText,
      priority: newTaskPriority,
      status: 'pending',
      dueDate: newTaskDueDate
    });
    setNewTaskText('');
  };

  const handleCreatePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: newPromoCode.trim().toUpperCase(),
      discountType: newPromoType,
      value: Number(newPromoValue) || 10,
      minAmount: Number(newPromoMinAmount) || 500,
      active: true,
      expiryDate: newPromoExpiry
    };

    setPromos(prev => [newPromo, ...prev]);
    setNewPromoCode('');
    setPromoSuccessMsg(true);
    setTimeout(() => setPromoSuccessMsg(false), 3000);
  };

  const handleTogglePromoActive = (id: string) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleDeletePromo = (id: string) => {
    setPromos(prev => prev.filter(p => p.id !== id));
  };

  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(103 + Math.random() * 900)}`,
      customerName: isAr ? 'عميل الطوارئ الرقمي' : 'Secured Portal User',
      customerEmail: 'support@trendzoneeg.com',
      subject: ticketSubject,
      message: ticketMsg,
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      priority: ticketPriority
    };

    setTickets(prev => [newTicket, ...prev]);
    setTicketSubject('');
    setTicketMsg('');
    setNewTicketSuccess(true);
    setTimeout(() => setNewTicketSuccess(false), 3000);
  };

  const handleUpdateTicketStatus = (id: string, nextStatus: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
  };

  const handleUpdateStatusAndTracking = (orderId: string, nextStatus: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const text = customTrackingText || (isAr ? 'تم تحديث حالة الطرد والمسارات يدوياً.' : 'Parcel routing state synchronized.');
        const historyItem = {
          status: text,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          location: isAr ? 'مركز الفرز الرئيسي (القاهرة)' : 'Main Sort Center (Cairo)'
        };
        const currentHistory = o.trackingHistory || [];
        return {
          ...o,
          status: nextStatus,
          trackingHistory: [historyItem, ...currentHistory]
        };
      }
      return o;
    }));

    onUpdateOrderStatus(orderId, nextStatus, customTrackingText || undefined);
    setCustomTrackingText('');
    setSubmittingOrderTracking(null);
  };

  const handleSelectStatusChange = (orderId: string, nextStatus: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const statusMapAr: Record<string, string> = {
          new: 'تم إنشاء الطلب وهو مسجل كطلب جديد بانتظار المراجعة والاتصال لتأكيد الشحن',
          pending: 'تم تعليق المعاملة لحين فحص ومطابقة إشعار التحويل المالي المرسل',
          confirmed: 'تم تأكيد الطلب بنجاح وبدء إدراجه خط الشحن الفوري',
          preparing: 'الطلب قيد التجهيز والتغليف الآلي والفرز التقني في مستودعنا الرئيسي',
          processing: 'جاري تغليف السلعة ومراجعة الجودة النهائية قبل تسليم المندوب',
          shipped: 'تم شحن الطرد وتسليمه لشركة الشحن ومرفق معه رقم التتبع اللوجستي',
          out_for_delivery: 'الشحنة خارج للتسليم اليوم مع مندوب التوصيل المعتمد لعنوانكم',
          delivered: 'تم تسليم السلعة للعميل بنجاح واستلام كامل المستحقات المالية وإغلاق المعاملة',
          cancelled: 'تم إلغاء طلب الشحن وحفظ السجلات كملغي بناءً على طلب العميل أو تفشيل المعاملة',
          returned: 'تم تسوية معاملة المرتجع بنجاح وإرجاع كامل القيمة لمحفظة ولاء كاش للمشتري'
        };
        const text = isAr 
          ? statusMapAr[nextStatus] || `تم تعديل حالة الطلب اللوجستي إلى [${nextStatus}]`
          : `System manual status override initiated to [${nextStatus}]`;
        const historyItem = {
          status: text,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          location: isAr ? 'مستودع العبور اللوجستي بمصر' : 'El-Obour Logistics Hub, Egypt'
        };
        const currentHistory = o.trackingHistory || [];
        return {
          ...o,
          status: nextStatus,
          trackingHistory: [historyItem, ...currentHistory]
        };
      }
      return o;
    }));
    onUpdateOrderStatus(orderId, nextStatus);
  };

  // --- 1. Product CRUD Handlers ---
  const handleStartAddProduct = () => {
    setProdForm({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      price: 450,
      originalPrice: 250,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      category: 'watches',
      sku: 'TZ-' + Math.floor(1000 + Math.random() * 9005),
      colors: 'أسود, فضي, كحلي',
      sizes: 'Standard'
    });
    setEditingProductId(null);
    setIsAddingProduct(true);
  };

  const handleStartEditProduct = (p: Product) => {
    setProdForm({
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      descriptionAr: p.descriptionAr || '',
      descriptionEn: p.descriptionEn || '',
      price: p.price,
      originalPrice: p.originalPrice || p.price - 100,
      stock: p.stock,
      image: p.image,
      category: p.category,
      sku: p.sku || 'TZ-' + Math.floor(1000 + Math.random() * 9005),
      colors: p.colors.join(', '),
      sizes: p.sizes.join(', ')
    });
    setEditingProductId(p.id);
    setIsAddingProduct(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const colorsArr = prodForm.colors.split(',').map(s => s.trim()).filter(Boolean);
    const sizesArr = prodForm.sizes.split(',').map(s => s.trim()).filter(Boolean);

    if (editingProductId) {
      // Edit mode
      setProducts(prev => prev.map(p => {
        if (p.id === editingProductId) {
          return {
            ...p,
            nameAr: prodForm.nameAr,
            nameEn: prodForm.nameEn,
            descriptionAr: prodForm.descriptionAr,
            descriptionEn: prodForm.descriptionEn,
            price: Number(prodForm.price),
            originalPrice: Number(prodForm.originalPrice),
            stock: Number(prodForm.stock),
            image: prodForm.image,
            category: prodForm.category,
            sku: prodForm.sku,
            colors: colorsArr,
            sizes: sizesArr,
            variants: colorsArr.flatMap(c => sizesArr.map(s => ({
              sku: `${prodForm.sku}-${c}-${s}`,
              color: c,
              size: s,
              stock: Math.floor(Number(prodForm.stock) / (colorsArr.length * sizesArr.length || 1))
            })))
          };
        }
        return p;
      }));
    } else {
      // Add mode
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        nameAr: prodForm.nameAr,
        nameEn: prodForm.nameEn,
        descriptionAr: prodForm.descriptionAr,
        descriptionEn: prodForm.descriptionEn,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice),
        stock: Number(prodForm.stock),
        image: prodForm.image,
        gallery: [prodForm.image],
        category: prodForm.category,
        rating: 4.8,
        reviewsCount: 3,
        colors: colorsArr,
        sizes: sizesArr,
        sku: prodForm.sku,
        isPublished: true,
        variants: colorsArr.flatMap(c => sizesArr.map(s => ({
          sku: `${prodForm.sku}-${c}-${s}`,
          color: c,
          size: s,
          stock: Math.floor(Number(prodForm.stock) / (colorsArr.length * sizesArr.length || 1))
        })))
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsAddingProduct(false);
    setEditingProductId(null);
  };

  const handleTogglePublishProduct = (pId: string) => {
    setProducts(prev => prev.map(p => p.id === pId ? { ...p, isPublished: p.isPublished === false ? true : false } : p));
  };

  const handleDeleteProduct = (pId: string) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المنتج نهائياً وتصفية مخزونه؟' : 'Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== pId));
    }
  };

  const handleDuplicateProduct = (p: Product) => {
    const duplicated: Product = {
      ...p,
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sku: `${p.sku || 'TZ'}-COPY-${Math.floor(100+Math.random()*900)}`,
      nameAr: `${p.nameAr} (نسخة مكررة)`,
      nameEn: `${p.nameEn} (Duplicated Copy)`,
      isPublished: false // start as draft
    };
    setProducts(prev => {
      const updated = [duplicated, ...prev];
      localStorage.setItem('trendzone_products', JSON.stringify(updated));
      return updated;
    });
  };

  const handleExportProductsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trendzone-products-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportProductsJSON = () => {
    try {
      const parsed = JSON.parse(bulkImportText);
      if (!Array.isArray(parsed)) {
        alert(isAr ? 'خطأ: يجب أن يحتوي النص المنسوخ على قائمة منتجات صالحة (Array).' : 'Error: Input must be a valid array of products.');
        return;
      }
      const sanitized = parsed.map((p: any) => ({
        id: p.id || `prod-${Math.floor(Math.random() * 900000)}`,
        sku: p.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
        nameAr: p.nameAr || 'منتج مستورد جديد',
        nameEn: p.nameEn || 'Imported Product Node',
        descriptionAr: p.descriptionAr || '',
        descriptionEn: p.descriptionEn || '',
        image: p.image || 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=200',
        gallery: Array.isArray(p.gallery) ? p.gallery : [],
        category: p.category || 'watches',
        price: Number(p.price) || 250,
        originalPrice: Number(p.originalPrice) || undefined,
        stock: Number(p.stock) || 100,
        rating: Number(p.rating) || 4.8,
        reviewsCount: Number(p.reviewsCount) || 5,
        colors: Array.isArray(p.colors) ? p.colors : ['Standard'],
        sizes: Array.isArray(p.sizes) ? p.sizes : ['Standard'],
        isPublished: p.isPublished !== false,
        isFlashSale: p.isFlashSale === true,
        flashSalePrice: p.flashSalePrice ? Number(p.flashSalePrice) : undefined,
        isDropshipping: p.isDropshipping === true,
        supplierName: p.supplierName || ''
      }));

      setProducts(prev => {
        const merged = [...sanitized, ...prev];
        localStorage.setItem('trendzone_products', JSON.stringify(merged));
        return merged;
      });
      setShowBulkImportModal(false);
      setBulkImportText('');
      alert(isAr ? `تم استيراد عدد (${sanitized.length}) منتج بنجاح وبثهم بالواجهة!` : `Successfully imported ${sanitized.length} products!`);
    } catch (e: any) {
      alert(isAr ? `فشل الاستيراد: صيغة غير صالحة. (${e.message})` : `Import failed: Invalid structure. (${e.message})`);
    }
  };

  // --- 2. Pricing Engine Handlers ---
  const handleApplyPricingRule = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts(prev => prev.map(p => {
      if (pricingCategory === 'all' || p.category === pricingCategory) {
        const factor = pricingPercent / 100;
        const currentPrice = p.price;
        let nextPrice = currentPrice;
        if (pricingType === 'discount') {
          nextPrice = Math.round(currentPrice * (1 - factor));
          return {
            ...p,
            originalPrice: currentPrice,
            price: nextPrice,
            isFlashSale: true
          };
        } else {
          nextPrice = Math.round(currentPrice * (1 + factor));
          return {
            ...p,
            originalPrice: currentPrice,
            price: nextPrice
          };
        }
      }
      return p;
    }));
    setPricingStatus(isAr ? `نجاح: تم تطبيق تعديل السعر بنسبة ${pricingPercent}% بنجاح!` : `Success: Price rule applied with ${pricingPercent}% modification!`);
    setTimeout(() => setPricingStatus(''), 4000);
  };

  const handleToggleProductFlashSale = (pId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === pId) {
        const wasFlash = !!p.isFlashSale;
        return {
          ...p,
          isFlashSale: !wasFlash,
          flashSalePrice: !wasFlash ? Math.round(p.price * 0.8) : undefined
        };
      }
      return p;
    }));
  };

  // --- 3. Dropshipping Hub Handlers ---
  const handleImportDropshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dropshipNameAr || !dropshipNameEn) {
      alert(isAr ? 'يرجى إدخال اسم المنتج أولاً!' : 'Please enter product name first!');
      return;
    }

    // Convert Cost USD to EGP (1 USD = 48 EGP) + markup margin %
    const costInEGP = dropshipCost * 48;
    const finalPrice = Math.round(costInEGP * (1 + (dropshipMarkup / 100)));
    const randomSku = 'DS-' + Math.floor(100000 + Math.random() * 900000);

    const importedProduct: Product = {
      id: `ds-prod-${Date.now()}`,
      nameAr: dropshipNameAr,
      nameEn: dropshipNameEn,
      descriptionAr: isAr ? 'منتج مستورد دروبشيبينغ عالي الجودة متزامن لحظياً.' : 'Premium imported dropshipping product synchronized in real-time.',
      descriptionEn: 'Premium imported dropshipping product synchronized in real-time.',
      price: finalPrice,
      originalPrice: Math.round(costInEGP),
      stock: 40, // standard dropshipper warehouse stock
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
      gallery: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'],
      category: dropshipCategory,
      rating: 4.9,
      reviewsCount: 1,
      colors: ['Standard'],
      sizes: ['S', 'M', 'L', 'XL'],
      sku: randomSku,
      variants: [],
      isPublished: true,
      isDropshipping: true,
      supplierUrl: dropshipUrlInput || 'https://cjdropshipping.com/product/mock-source',
      supplierPrice: dropshipCost
    };

    setProducts(prev => [importedProduct, ...prev]);
    setDropshipLogs(prev => [
      `تم استيراد المنتج "${dropshipNameEn}" بنجاح بالرمز الكودي ${randomSku}.`,
      `تكلفة المورد: $${dropshipCost} (${Math.round(costInEGP)} ج.م) | هامش تسعير التجزئة: ${dropshipMarkup}% | سعر البيع النهائي: ${finalPrice} ج.م`,
      ...prev
    ]);

    // Reset inputs
    setDropshipNameAr('');
    setDropshipNameEn('');
    setDropshipUrlInput('');
  };

  const handleSupplierSyncAll = () => {
    setIsSyncingDropship(true);
    setDropshipLogs(prev => [`جاري إرسال طلبات المصافحة للـ APIs ومطابقة المخزون...`, ...prev]);
    
    setTimeout(() => {
      setProducts(prev => prev.map(p => {
        if (p.isDropshipping) {
          const newRandomStock = Math.floor(15 + Math.random() * 85);
          // Auto republish if stock is restored
          return {
            ...p,
            stock: newRandomStock,
            isPublished: true
          };
        }
        return p;
      }));
      setIsSyncingDropship(false);
      setDropshipLogs(prev => [
        `نجاح: تم المزامنة الكاملة ومطالعة مستودعات بوسطة والمورد الأصلي.`,
        `تم إعادة نشر تلقائي لمنتجات دروبشيبينغ كانت معطلة لنفاد مخزونها.`,
        `تحديث المخزون لقاعدة الـ Dropshipping كلياً بنجاح!`,
        ...prev
      ]);
    }, 1500);
  };

  // Translations
  const t = {
    ar: {
      saasLogo: 'لوحة تحكم الإدارة',
      siteFront: 'عرض المتجر',
      logout: 'تسجيل الخروج',
      analytics: 'الأرباح والإحصائيات',
      orders: 'إدارة الطلبات والشحن',
      inventory: 'المنتجات والمخزن',
      promotions: 'الكوبونات والعروض',
      support: 'الدعم وتذاكر العملاء',
      crm: 'بيانات العملاء والـ CRM',
      security: 'الأمان والنسخ الاحتياطي',
      role: 'مستوى الصلاحية:',
      verified: 'الحساب موثق وآمن',
      totalSales: 'إجمالي المبيعات',
      pendingShip: 'طلبات في انتظار الشحن',
      lowStock: 'منتجات قربت تخلص',
      supportTick: 'تذاكر الدعم المفتوحة',
      egp: 'ج.م',
      items: 'منتجات',
      tickets: 'تذاكر',
      stockStatus: 'حالة مخزن المنتجات'
    },
    en: {
      saasLogo: 'TrendZone SaaS Pro',
      saasScope: 'Enterprise Cloud System',
      siteFront: 'Storefront Portal',
      logout: 'SaaS Deauthorize',
      analytics: 'SaaS Analytics',
      orders: 'Order Orchestration',
      inventory: 'Stock Inventory',
      promotions: 'Coupon Promotions',
      support: 'Helpdesk Tickets',
      crm: 'CRM Communications',
      security: 'Cybershield Audit Logs',
      role: 'System Clearance:',
      verified: 'ENCRYPTED SAAS LEDGER ONLINE',
      totalSales: 'Consolidated Revenue',
      pendingShip: 'Queued Deliveries',
      lowStock: 'Low Stock Alarms',
      supportTick: 'Active Support Tickets',
      egp: 'EGP',
      items: 'Items',
      tickets: 'Tickets',
      stockStatus: 'Quantities Status parameters'
    }
  }[lang];

  return (
    <div 
      className="min-h-screen bg-[#09090c] text-slate-100 flex flex-col md:flex-row antialiased font-sans border border-white/[0.03] rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.85)] max-w-7xl mx-auto"
      id="saas-system-frame"
    >
      
      {/* LEFT SAAS NAVIGATION SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0d0d12] border-r border-[#191924]/60 flex flex-col shrink-0">
        
        {/* Brand Scope Signet */}
        <div className="p-6 border-b border-[#191924]/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF7A00] to-[#E31C5F] text-black font-black flex items-center justify-center text-xs shadow-[0_0_15px_rgba(255,122,0,0.3)] shrink-0">
            PRO
          </div>
          <div>
            <h1 className="text-xs font-display font-extrabold text-white tracking-widest uppercase block leading-none">
              {t.saasLogo}
            </h1>
            <span className="text-[8px] text-brand-neon tracking-widest block font-mono mt-1 uppercase">
              {isAr ? 'منظومة سحابية معتمدة' : 'SECURE SAAS ENGINE'}
            </span>
          </div>
        </div>

        {/* User Identity and clearance level */}
        <div className="p-4.5 bg-[#12121b]/40 border-b border-[#191924]/40 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
            <span className="text-slate-450 text-[9px] uppercase tracking-wider">{t.role}</span>
          </div>
          <span className="text-white block font-bold uppercase tracking-wider mt-1.5 text-[10px] pl-5">
            {currentRole}
          </span>
        </div>

        {/* Dynamic Nav options */}
        <nav className="flex-1 p-4 space-y-1.5 select-none text-xs">
          {[
            { key: 'analytics', label: t.analytics, icon: TrendingUp },
            { key: 'design', label: isAr ? '🎨 تصميم الهوية والفئات (CMS)' : 'Dynamic Identity & Categories', icon: Sparkles },
            { key: 'products', label: isAr ? '📦 المنتجات (CRUD كامل)' : 'Products (Full CRUD)', icon: ShoppingBag },
            { key: 'pricing', label: isAr ? '💸 دالة التسعير والخصم' : 'Pricing & Sales Engine', icon: DollarSign },
            { key: 'inventory', label: isAr ? '🏢 مستودع المخزون الكلي' : 'Stock Warehouse System', icon: AlertTriangle },
            { key: 'dropshipping', label: isAr ? '🚀 بوابة الدروب شيبينغ' : 'Dropshipping Controls', icon: Sparkles },
            { key: 'orders', label: fWord(t.orders, 'الطلبات والشحن'), icon: FileCheck },
            { key: 'users', label: isAr ? '👥 إدارة المستخدمين' : 'Users Management Pro', icon: User },
            { key: 'returns', label: isAr ? '🔄 نظام المرتجعات الكلي' : 'Return Request CRM', icon: RefreshCw },
            { key: 'promotions', label: fWord(t.promotions, 'عروض الترويج'), icon: Tag },
            { key: 'tickets', label: fWord(t.support, 'تذاكر الدعم والحلول'), icon: MessageSquare },
            { key: 'crm', label: fWord(t.crm, 'علاقات الـ VIP'), icon: Clipboard },
            { key: 'security', label: fWord(t.security, 'الأمان والمدونات'), icon: Server }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab2(item.key as any)}
                className={`w-full text-right md:text-right px-4 py-3 rounded-xl transition-all font-bold flex items-center justify-between gap-3 cursor-pointer group ${
                  isSelected 
                    ? 'bg-neutral-800 text-white border border-white/[0.08] shadow-[0_0_12px_rgba(255,122,0,0.15)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span className="truncate">{item.label}</span>
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isSelected ? 'text-[#FF7A00]' : 'text-slate-500'
                }`} />
              </button>
            );
          })}
        </nav>

        {/* Footer shortcuts elements link */}
        <div className="p-4 border-t border-[#191924]/50 space-y-2 text-xs">
          <button
            onClick={onGoToStorefront}
            className="w-full py-2 px-3 bg-white/[0.02] border border-white/[0.06] hover:border-brand-neon/40 text-slate-300 hover:text-white rounded-lg transition-all flex items-center justify-between gap-1 font-mono text-[9px] uppercase tracking-wider cursor-pointer"
          >
            <span>{t.siteFront} 🌐</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <button
            onClick={onLogoutAdmin}
            className="w-full py-2 px-3 bg-[#E31C5F]/10 border border-[#E31C5F]/20 hover:border-[#E31C5F] text-[#E31C5F] hover:text-white rounded-lg transition-all flex items-center justify-between gap-1 font-mono text-[9px] uppercase tracking-wider cursor-pointer"
          >
            <span>{t.logout}</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </aside>

      {/* RIGHT MAIN WORKING SPACE PANEL */}
      <main className="flex-1 bg-[#0b0b0f] p-6 lg:p-8 space-y-8 overflow-y-auto max-h-[92vh] md:max-h-screen">
        
        {/* TOP SYSTEM RUNNING HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/[0.04]">
          <div>
            <h2 className="text-xl font-display font-extrabold text-white tracking-tight leading-none uppercase">
              {activeTab.toUpperCase()} PROTOCOL
            </h2>
            <p className="text-[10px] text-slate-400 font-mono mt-1.5 uppercase tracking-wider">
              {t.verified}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] bg-[#121217] border border-white/[0.04] p-2.5 rounded-xl font-mono text-slate-400 select-none shadow">
            <span>TIME CONTEXT:</span>
            <span className="text-[#FF7A00] font-bold">2026-06-20 UTC</span>
          </div>
        </div>

        {/* METRICS ROW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Revenue stats */}
          <div className="bg-[#121215] border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden group hover:border-[#FF7A00]/20 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF7A00]/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">{t.totalSales}</span>
              <DollarSign className="w-4 h-4 text-[#FF7A00]" />
            </div>
            <div className="mt-3.5 flex items-baseline gap-1.5">
              <span className="text-xl font-display font-black text-white">{totalRevenue.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 font-bold">{t.egp}</span>
            </div>
            <div className="text-[9px] text-[#FF7A00] mt-1.5 font-bold font-mono">
              ★ {isAr ? 'عقود مسواة ومحققة بالكامل' : 'LEGALLY RESOLVED SECURE SALES'}
            </div>
          </div>

          {/* Card 2: Queued Shipments */}
          <div className="bg-[#121215] border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden group hover:border-[#FF7A00]/20 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF7A00]/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">{t.pendingShip}</span>
              <FileCheck className="w-4 h-4 text-[#FF7A00]" />
            </div>
            <div className="mt-3.5 flex items-baseline gap-1.5">
              <span className="text-xl font-display font-black text-white">{pendingOrdersCount}</span>
              <span className="text-[10px] text-slate-400 font-bold">{t.items}</span>
            </div>
            <div className="text-[9px] text-amber-400 mt-1.5 font-bold font-mono">
              ⚠️ {isAr ? 'طرود معلقة بانتظار الشحن' : 'MANUAL DISPATCH QUEUES ACTIVE'}
            </div>
          </div>

          {/* Card 3: Stock alarms */}
          <div className="bg-[#121215] border border-[#FF7A00]/20 p-5 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_15px_rgba(255,122,0,0.05)] transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF7A00]/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-rose-350 font-bold uppercase tracking-wider">{t.lowStock}</span>
              <ShieldAlert className="w-4 h-4 text-brand-neon animate-pulse" />
            </div>
            <div className="mt-3.5 flex items-baseline gap-1.5">
              <span className="text-xl font-display font-black text-white">{lowStockProducts.length}</span>
              <span className="text-[10px] text-slate-400 font-bold">{t.items}</span>
            </div>
            <div className="text-[9px] text-rose-455 mt-1.5 font-bold font-mono">
              🚩 {isAr ? 'عجز تحت خط الموازنة اللوجستية' : 'WAREHOUSE FAILURE ALERT'}
            </div>
          </div>

          {/* Card 4: Helpdesk tickets */}
          <div className="bg-[#121215] border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden group hover:border-brand-neon/20 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-neon/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">{t.saasScope === 'Enterprise Cloud System' ? 'Unresolved tickets' : 'التذاكر النشطة'}</span>
              <Bell className="w-4 h-4 text-[#FF7A00]" />
            </div>
            <div className="mt-3.5 flex items-baseline gap-1.5">
              <span className="text-xl font-display font-black text-white">{activeTicketsCount}</span>
              <span className="text-[10px] text-slate-400 font-bold">{t.tickets}</span>
            </div>
            <div className="text-[9px] text-[#FF7A00] mt-1.5 font-bold font-mono">
              ● {isAr ? 'مستندات تواصل طارئة بالمنصة' : 'OPEN CUSTOMER ISSUES RESPOND'}
            </div>
          </div>

        </div>

        {/* ----------------- SECTIONS WORK AREA ----------------- */}

        {/* 1. ANALYTICS SUBTAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8" id="saas-analytics-view">
            
            {/* Visual Custom Interactive Sales Area Chart */}
            <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/[0.04] pb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#FF7A00]" />
                    <span>{isAr ? 'إحصائيات المبيعات والعمليات طوال الأسبوع المنصرم' : 'Historical Revenue Flow (Past 7 Days)'}</span>
                  </h3>
                  <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mt-1">// Interactive SVG telemetry charts visualization</p>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.05] p-1.5 rounded-lg flex items-center gap-1 text-[9px] font-mono font-bold">
                  <span className="px-2 py-0.5 bg-brand-neon/20 border border-brand-neon/30 text-[#FF7A00] rounded">EGP CURVE</span>
                </div>
              </div>

              {/* Responsive custom graphic bar display */}
              <div className="h-64 flex items-end gap-2.5 pt-8 pb-4 relative px-2">
                
                {/* SVG Backdrop Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none opacity-5 pr-10 text-[9px] font-mono">
                  <div className="border-t border-slate-300 w-full pt-1 text-left">4,000 EGP</div>
                  <div className="border-t border-slate-300 w-full pt-1 text-left">3,000 EGP</div>
                  <div className="border-t border-slate-300 w-full pt-1 text-left">2,000 EGP</div>
                  <div className="border-t border-slate-300 w-full pt-1 text-left">1,000 EGP</div>
                  <div className="w-full"></div>
                </div>

                {/* Day columns */}
                {[
                  { day: isAr ? 'الأحد' : 'Sun', value: 1850, percentage: '45%' },
                  { day: isAr ? 'الإثنين' : 'Mon', value: 2900, percentage: '72%' },
                  { day: isAr ? 'الثلاثاء' : 'Tue', value: 950, percentage: '23%' },
                  { day: isAr ? 'الأربعاء' : 'Wed', value: 3800, percentage: '90%' },
                  { day: isAr ? 'الخميس' : 'Thu', value: 1100, percentage: '28%' },
                  { day: isAr ? 'الجمعة' : 'Fri', value: 4200, percentage: '98%' },
                  { day: isAr ? 'السبت' : 'Sat', value: totalRevenue % 5000 || 2400, percentage: '58%' }
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end relative group">
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-6 bg-[#1a1a24] border border-white/[0.08] p-1.5 rounded-md text-[9px] font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow pointer-events-none whitespace-nowrap">
                      {item.value} ج.م
                    </div>

                    {/* Styled cylinder volume */}
                    <div 
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#E31C5F]/20 to-[#FF7A00] group-hover:to-[#D4AF37] transition-all min-h-[10px]"
                      style={{ height: item.percentage }}
                    ></div>

                    {/* Grid date badge */}
                    <span className="text-[9px] font-bold font-sans text-slate-400 mt-2 block tracking-tight uppercase">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick analytics info list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-350 tracking-wider font-mono flex items-center gap-1.5">// {isAr ? 'تصنيف السلع الأكثر مبيعاً بالتجارة' : 'SKU Category Distribution Summary'}</h4>
                <div className="space-y-3.5 text-xs">
                  {[
                    { cat: isAr ? '🕒 الساعات الفاخرة' : 'Watches Luxury', amount: 4, pct: '50%' },
                    { cat: isAr ? '👗 الأزياء والقفطانات' : 'Apparel Caftans', amount: 2, pct: '25%' },
                    { cat: isAr ? '💄 مستحضرات الجمال' : 'Boutique Cosmetics', amount: 1, pct: '15%' },
                    { cat: isAr ? '🏺 تحف الديكور' : 'Premium Decor', amount: 1, pct: '10%' }
                  ].map((catItem, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-300">{catItem.cat}</span>
                        <span className="text-white font-mono">{catItem.pct}</span>
                      </div>
                      <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                        <div className="bg-[#FF7A00] h-full" style={{ width: catItem.pct }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#121215] border border-[#FF7A00]/25 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-1/3 w-32 h-32 bg-[#FF7A00]/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="space-y-3 relative z-10 text-right md:text-right">
                  <h4 className="text-xs font-mono font-black text-[#FF7A00] uppercase tracking-wider">★ STATUS UPDATE ADVISORY</h4>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans">
                    {isAr 
                      ? 'تم تحسين وتدشين منظومة إدارة المنصة كقنوات سحابة Pro مستقلة تماماً. يرجى توخي الأمان وعدم مشاركة أكواد التسوية الخاصة بفودافون كاش مع أي موظف أو مركب شحن خارجي.'
                      : 'Platform monitoring metrics are secured. Do not share raw transaction codes with third-party logistics agents under any circumstances.'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 1.2 BRAND IDENTITY & DYNAMIC CMS SUBTAB */}
        {activeTab === 'design' && (
          <div className="space-y-8 animate-fadeIn text-right" id="saas-cms-panel">
            
            {/* Header */}
            <div className="text-right">
              <h3 className="text-base font-display font-extrabold text-white flex items-center justify-start gap-2.5">
                <Sparkles className="w-5 h-5 text-[#FF7A00]" />
                <span>{isAr ? 'لوحة تصميم العلامة وترخيص الهوية (CMS)' : 'Authorized SaaS Branding & CMS Identity Grid'}</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-wider">
                // INSTANTLY CONFIGURE VISUALS, BG ASSETS, FAVICONS AND DYNAMIC STORE CATEGORIES
              </p>
            </div>

            {/* DYNAMIC LOGO MANAGEMENT */}
            <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-6 space-y-6 text-right">
              <div className="border-b border-white/[0.04] pb-4 flex justify-between items-center flex-wrap gap-2">
                <div className="text-right">
                  <h4 className="text-xs font-bold font-mono text-[#FF7A00] uppercase tracking-wider">// 01. Dynamic Logo & Favicon Customization</h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">{isAr ? 'تحكم في المظهر الشكلي للشعارات وأيقونة التبويب دون تعديل الكود' : 'Configure typographic text, custom logos, favicons and brand dimensions.'}</p>
                </div>
                <div className="text-[9px] px-2 py-0.5 bg-neutral-900 border border-white/5 rounded font-mono text-slate-400">INSTANT</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form fields */}
                <div className="space-y-4 text-right">
                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] text-slate-400 font-mono uppercase block">{isAr ? 'عنوان الشعار النصي' : 'LOGO TYPOGRAPHIC TEXT'}</label>
                    <input 
                      type="text" 
                      placeholder="Trend Zone"
                      value={storeDesign.logoText || ''} 
                      onChange={(e) => setStoreDesign(prev => ({ ...prev, logoText: e.target.value }))}
                      className="w-full text-xs px-4 py-3 bg-neutral-950 border border-white/[0.06] rounded-xl text-white focus:border-[#FF7A00] focus:outline-hidden text-right"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] text-slate-400 font-mono uppercase block">{isAr ? 'رابط ملف الـ SVG أو الشعار' : 'CUSTOM LOGO IMAGE URL'}</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/logo.png"
                      value={storeDesign.logoUrl || ''} 
                      onChange={(e) => setStoreDesign(prev => ({ ...prev, logoUrl: e.target.value }))}
                      className="w-full text-xs px-4 py-3 bg-neutral-950 border border-white/[0.06] rounded-xl text-white focus:border-[#FF7A00] focus:outline-hidden font-mono text-right"
                    />
                    <p className="text-[9px] text-slate-500 font-sans">{isAr ? '* اترك الحقل فارغاً لتفعيل الشعار النصي الفاخر تلقائياً' : '* Clear to fallback to typographic stylish text.'}</p>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-mono">HEIGHT: {storeDesign.logoSize || 40}px</span>
                      <label className="text-slate-400 font-mono uppercase block">{isAr ? 'حجم الشعار الفعلي' : 'LOGO HEIGHT SIZE (PX)'}</label>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="100"
                      value={storeDesign.logoSize || 40} 
                      onChange={(e) => setStoreDesign(prev => ({ ...prev, logoSize: parseInt(e.target.value) }))}
                      className="w-full accent-[#FF7A00] bg-neutral-950 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-right">
                     <div className="space-y-1.5 text-right">
                       <label className="text-[10px] text-slate-400 font-mono uppercase block">{isAr ? 'شعار الثيم الفاتح' : 'LIGHT LOGO BACKUP'}</label>
                       <input 
                         type="text" 
                         placeholder="https://..."
                         value={storeDesign.lightLogoUrl || ''} 
                         onChange={(e) => setStoreDesign(prev => ({ ...prev, lightLogoUrl: e.target.value }))}
                         className="w-full text-xs px-3 py-2 bg-neutral-950 border border-white/[0.06] rounded-lg text-white font-mono text-right"
                       />
                     </div>
                     <div className="space-y-1.5 text-right">
                       <label className="text-[10px] text-slate-400 font-mono uppercase block">{isAr ? 'شعار الثيم الغامق' : 'DARK LOGO BACKUP'}</label>
                       <input 
                         type="text" 
                         placeholder="https://..."
                         value={storeDesign.darkLogoUrl || ''} 
                         onChange={(e) => setStoreDesign(prev => ({ ...prev, darkLogoUrl: e.target.value }))}
                         className="w-full text-xs px-3 py-2 bg-neutral-950 border border-white/[0.06] rounded-lg text-white font-mono text-right"
                       />
                     </div>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] text-slate-400 font-mono uppercase block">{isAr ? 'عنوان تبويب المتجر وأيقونة التبويب (Favicon)' : 'TAB WINDOW FAVICON ICON URL'}</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/favicon.ico"
                      value={storeDesign.favicon || ''} 
                      onChange={(e) => {
                        setStoreDesign(prev => ({ ...prev, favicon: e.target.value }));
                        const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
                        if (link) {
                          link.href = e.target.value;
                        }
                      }}
                      className="w-full text-xs px-4 py-3 bg-neutral-950 border border-white/[0.06] rounded-xl text-white focus:border-[#FF7A00] focus:outline-hidden font-mono text-right"
                    />
                  </div>
                </div>

                {/* Simulated preview screen */}
                <div className="bg-neutral-950/40 border border-white/[0.03] rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden text-right">
                  <span className="text-[8px] font-mono text-slate-500 absolute top-3 left-3 uppercase">// BRAND LIVE PREVIEW</span>
                  
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-[10px] text-slate-500 font-mono mb-4 uppercase tracking-widest">// ACTIVE LOGO CONTAINER PREVIEW</p>
                    <div className="p-4 bg-[#0A0A0F] border border-white/[0.05] rounded-2xl flex items-center justify-center min-h-[85px] max-w-xs w-full shadow-inner">
                      {storeDesign.logoUrl ? (
                        <img 
                          src={storeDesign.logoUrl} 
                          alt="Live Preview Logo" 
                          style={{ height: `${storeDesign.logoSize || 40}px` }}
                          className="object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF7A00] to-[#E31C5F] text-black font-black italic flex items-center justify-center text-xs">
                            {storeDesign.logoText ? storeDesign.logoText.slice(0, 2).toUpperCase() : 'TZ'}
                          </div>
                          <span className="text-white font-display font-bold uppercase text-sm">
                            {storeDesign.logoText || (isAr ? 'تريند زون' : 'Trend Zone')}
                           </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.03] space-y-1.5 text-[10px] text-slate-400">
                    <div className="flex justify-between font-mono">
                      <span className="text-[9px] text-[#FF7A00] font-bold">{storeDesign.favicon ? 'CUSTOM VALUE ACTIVE' : 'SYSTEM DIRECT DEFAULT'}</span>
                      <span>{isAr ? 'حالة الأيقونة (Favicon):' : 'Favicon state:'}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500 truncate max-w-[150px]">{storeDesign.logoUrl || 'NONE'}</span>
                      <span>{isAr ? 'رابط ملف الصورة الشكلي:' : 'Logo resource URL:'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC BACKGROUND MANAGEMENT */}
            <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-6 space-y-6 text-right">
              <div className="border-b border-white/[0.04] pb-4 flex justify-between items-center gap-2">
                <div className="text-right">
                  <h4 className="text-xs font-bold font-mono text-[#FF7A00] uppercase tracking-wider">// 02. Cinematic Backgrounds & Particle Engines</h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">{isAr ? 'تخصيص خلفيات الفيديو وسلوك حركة الجزيئات العائمة' : 'Change live video atmosphere loops, hologram properties and dark overlay tints.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 text-right">
                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] text-slate-400 font-mono uppercase block">{isAr ? 'رابط خلفية فيديو الغلاف الجوي المتكرر' : 'BACKGROUND VIDEO ATMOSPHERE URL (.MP4)'}</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/my-stream-backdrop.mp4"
                      value={storeDesign.backgroundVideoUrl || ''} 
                      onChange={(e) => setStoreDesign(prev => ({ ...prev, backgroundVideoUrl: e.target.value }))}
                      className="w-full text-xs px-4 py-3 bg-neutral-950 border border-white/[0.06] rounded-xl text-white focus:border-[#FF7A00] focus:outline-hidden font-mono text-right"
                    />
                    <p className="text-[9px] text-[#FF7A00] mt-0.5 leading-normal">{isAr ? 'نوصي برابط مباشر سريع لملف mp4 بحدود 5-10 ميجا لتفادي البطء' : 'Recommend a lightweight 5-10MB mp4 video clip loop.'}</p>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] text-slate-400 font-mono uppercase block">{isAr ? 'رابط صورة خلفية قسم الترحيب البارز' : 'HERO WELCOME HEADER BACKGROUND IMAGE URL'}</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/banner-hero.jpg"
                      value={storeDesign.heroBackgroundUrl || ''} 
                      onChange={(e) => setStoreDesign(prev => ({ ...prev, heroBackgroundUrl: e.target.value }))}
                      className="w-full text-xs px-4 py-3 bg-neutral-950 border border-white/[0.06] rounded-xl text-white focus:border-[#FF7A00] focus:outline-hidden font-mono text-right"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1.5 text-right">
                    <div className="p-3.5 bg-neutral-950/50 rounded-xl border border-white/[0.03] flex items-center justify-between text-xs">
                      <input 
                        type="checkbox" 
                        checked={storeDesign.holograms !== false}
                        onChange={(e) => setStoreDesign(prev => ({ ...prev, holograms: e.target.checked }))}
                        className="w-4 h-4 accent-[#FF7A00] cursor-pointer"
                        id="holograms-checkbox"
                      />
                      <label htmlFor="holograms-checkbox" className="font-bold text-slate-300 font-sans cursor-pointer select-none pr-2">{isAr ? 'الهولوجرام العائم' : 'Floating Holograms'}</label>
                    </div>

                    <div className="p-3.5 bg-neutral-950/50 rounded-xl border border-white/[0.03] flex items-center justify-between text-xs">
                      <input 
                        type="checkbox" 
                        checked={storeDesign.particles !== false}
                        onChange={(e) => setStoreDesign(prev => ({ ...prev, particles: e.target.checked }))}
                        className="w-4 h-4 accent-[#FF7A00] cursor-pointer"
                        id="particles-checkbox"
                      />
                      <label htmlFor="particles-checkbox" className="font-bold text-slate-300 font-sans cursor-pointer select-none pr-2">{isAr ? 'جزيئات الغبار' : 'HUD Dust Particles'}</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 text-right">
                  <div className="space-y-1.5 text-right">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-mono">{Math.round((storeDesign.overlayTransparency ?? 0.82) * 100)}%</span>
                      <label className="text-slate-400 font-mono uppercase block">{isAr ? 'درجة شفافية التعتيم فوق الفيديو' : 'ATMOSPHERE BACKGROUND OVERLAY TRANSPARENCY'}</label>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="95"
                      value={Math.round((storeDesign.overlayTransparency ?? 0.82) * 100)} 
                      onChange={(e) => setStoreDesign(prev => ({ ...prev, overlayTransparency: parseInt(e.target.value) / 100 }))}
                      className="w-full accent-[#FF7A00] bg-neutral-950 mt-1"
                    />
                    <span className="text-[9px] text-slate-500 block">{isAr ? '* زيادة القيمة تؤدي لجعل تصفح النصوص والقراءة أكثر سهولة للعين' : '* Higher value makes product titles and prices stand out.'}</span>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-mono">{Math.round((storeDesign.overlayDarkTint ?? 0.9) * 100)}%</span>
                      <label className="text-slate-400 font-mono uppercase block">{isAr ? 'درجة التظليل الداكن المطلق (Black Slate)' : 'STOREFRONT DARK SCREEN TINT OPACITY'}</label>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="100"
                      value={Math.round((storeDesign.overlayDarkTint ?? 0.9) * 100)} 
                      onChange={(e) => setStoreDesign(prev => ({ ...prev, overlayDarkTint: parseInt(e.target.value) / 100 }))}
                      className="w-full accent-red-650 bg-neutral-950 mt-1"
                    />
                  </div>

                  <div className="p-4 bg-[#FF7A00]/5 border border-[#FF7A00]/20 rounded-xl space-y-1 text-[10px] text-slate-300 font-sans leading-normal text-right">
                    <p className="font-bold text-[#FF7A00]">⚡ {isAr ? 'تلميحات التهيئة المتقدمة:' : 'SYSTEM AMBIANCE ADVISORY:'}</p>
                    <p>{isAr ? 'تأثيرات الهولوجرام العائم والجزيئات تستغل مسرع الهاردوير للمتصفح لإعطاء طابع سايبر-بنك متقدم وفخم يجذب المتسوقين المميزين في مصر.' : 'Real-time CSS shaders are optimized for ultra high contrast mobile displays.'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORY MANAGEMENT SYSTEM */}
            <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-6 space-y-6 text-right">
              <div className="border-b border-white/[0.04] pb-4 flex justify-between items-center flex-wrap gap-2 text-right">
                <div className="text-right">
                  <h4 className="text-xs font-bold font-mono text-[#FF7A00] uppercase tracking-wider">// 03. Active Store Categories CMS (Dynamic Navigation)</h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">{isAr ? 'تحكم في أقسام المتجر، ترتيبها، أو إيقاف نشر تصنيف مؤقتاً لسهولة التنقل' : 'Instantly create, hide, reorder and delete product navigation catalog tiers.'}</p>
                </div>
                <div className="text-[9px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">FLEXIBLE</div>
              </div>

              {/* Add category form */}
              <div className="p-4 bg-neutral-950/40 border border-white/[0.04] rounded-2xl space-y-4 text-right">
                <h5 className="text-[11px] font-mono text-white font-bold">// {isAr ? 'إدخال قسم جديد في شجرة الفئات' : 'Deploy new Catalog Category Node'}</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-right">
                  <div className="space-y-1 text-right">
                    <label className="text-[9px] text-slate-450 font-mono block">CATEGORY ID KEY (ENGLISH ONLY)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. skin_care"
                      value={newCatKey}
                      onChange={(e) => setNewCatKey(e.target.value.toLowerCase().trim().replace(/\s+/g, '_'))}
                      className="w-full text-xs px-3 py-2 bg-neutral-950 border border-white/[0.06] rounded-lg text-white font-mono text-left"
                    />
                  </div>
                  <div className="space-y-1 text-right">
                    <label className="text-[9px] text-slate-450 block">اسم القسم باللغة العربية للعملاء</label>
                    <input 
                      type="text" 
                      placeholder="مثال: مستحضرات الجمال الطبيعي"
                      value={newCatAr}
                      onChange={(e) => setNewCatAr(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-neutral-950 border border-white/[0.06] rounded-lg text-white text-right"
                    />
                  </div>
                  <div className="space-y-1 text-right">
                    <label className="text-[9px] text-slate-450 block">CATEGORY DISPLAY LABEL (ENGLISH)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Skin Elixirs"
                      value={newCatEn}
                      onChange={(e) => setNewCatEn(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-neutral-950 border border-white/[0.06] rounded-lg text-white text-right"
                    />
                  </div>

                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newCatKey || !newCatAr || !newCatEn) {
                          alert(isAr ? 'برجاء ملء الشروط الثلاثة بالكامل!' : 'Please populate category values first.');
                          return;
                        }
                        const exists = (categories || []).some(c => c.key === newCatKey);
                        if (exists) {
                          alert(isAr ? 'هذا الرمز مسجل لقسم آخر بالفعل!' : 'Key already registered!');
                          return;
                        }
                        const newCatObj = {
                          key: newCatKey,
                          labelAr: newCatAr,
                          labelEn: newCatEn,
                          active: true,
                          order: (categories || []).length + 1
                        };
                        setCategories(prev => [...(prev || []), newCatObj]);
                        setNewCatKey('');
                        setNewCatAr('');
                        setNewCatEn('');
                      }}
                      className="w-full py-2 bg-gradient-to-r from-[#FF7A00] to-[#E31C5F] text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all h-9"
                    >
                      <Plus className="w-4 h-4 text-black stroke-[3px]" />
                      <span>{isAr ? 'تثبيت القسم فورا' : 'Inject Category'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Categories list table */}
              <div className="overflow-x-auto border border-white/[0.04] rounded-2xl bg-neutral-950/20 text-right">
                <table className="w-full border-collapse text-xs text-right" dir="rtl">
                  <thead>
                    <tr className="bg-neutral-950/60 font-mono text-[10px] text-slate-450 border-b border-white/[0.04]">
                      <th className="p-3 text-right">{isAr ? 'الترتيب' : 'ORDER'}</th>
                      <th className="p-3 text-right">{isAr ? 'مفتاح التعريف' : 'KEY'}</th>
                      <th className="p-3 text-right">{isAr ? 'العنوان العربي والإنكليزي' : 'DISPLAY LABELS'}</th>
                      <th className="p-3 text-center">{isAr ? 'الرؤية بالإنترنت' : 'STATUS'}</th>
                      <th className="p-3 text-center">{isAr ? 'إجراءات تفصيلية' : 'OPERATIONS'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {(categories || []).map((cat, index) => (
                      <tr key={cat.key} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-3 font-mono text-[#FF7A00] font-bold">
                          {cat.order || (index + 1)}
                        </td>
                        <td className="p-3 font-mono text-slate-300">
                          {cat.key}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-white">{cat.labelAr}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{cat.labelEn}</div>
                        </td>
                        <td className="p-3 text-center">
                          {cat.active !== false ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 inline-block">
                              {isAr ? 'مرئي ونشط' : 'VISIBLE'}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-neutral-900 text-slate-500 font-bold border border-white/5 inline-block">
                              {isAr ? 'مخفي بالمخزن' : 'HIDDEN'}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            
                            {/* Toggle visibility */}
                            <button
                              type="button"
                              onClick={() => {
                                setCategories(prev => prev.map(c => 
                                  c.key === cat.key ? { ...c, active: c.active === false ? true : false } : c
                                ));
                              }}
                              className="px-2 py-1 bg-white/[0.02] border border-white/10 text-slate-300 hover:text-white rounded-lg hover:border-[#FF7A00]/40 text-[9px] cursor-pointer"
                            >
                              {cat.active !== false ? (isAr ? 'إخفاء القسم' : 'Hide') : (isAr ? 'إظهار القسم' : 'Show')}
                            </button>

                            {/* Reorder Buttons */}
                            <button
                              type="button"
                              onClick={() => {
                                if (index === 0) return;
                                setCategories(prev => {
                                  const copy = [...prev];
                                  const temp = copy[index - 1];
                                  copy[index - 1] = copy[index];
                                  copy[index] = temp;
                                  return copy;
                                });
                              }}
                              className="p-1 px-1.5 bg-neutral-900 text-slate-400 hover:text-white border border-white/5 rounded cursor-pointer text-[10px]"
                              title="Move Up"
                              disabled={index === 0}
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (index === (categories || []).length - 1) return;
                                setCategories(prev => {
                                  const copy = [...prev];
                                  const temp = copy[index + 1];
                                  copy[index + 1] = copy[index];
                                  copy[index] = temp;
                                  return copy;
                                });
                              }}
                              className="p-1 px-1.5 bg-neutral-900 text-slate-400 hover:text-white border border-white/5 rounded cursor-pointer text-[10px]"
                              title="Move Down"
                              disabled={index === (categories || []).length - 1}
                            >
                              ▼
                            </button>

                            {/* Delete button (Avoid deleting 'all' category for system safety!) */}
                            {cat.key !== 'all' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(isAr ? `هل تبغى بالتأكيد حذف فئة "${cat.labelAr}"؟ سيؤدي ذلك لإدراج سلعها تحت القسم العام.` : `Confirm deletion of category ${cat.key}?`)) {
                                    setCategories(prev => prev.filter(c => c.key !== cat.key));
                                  }
                                }}
                                className="p-1.5 bg-red-600/10 border border-red-500/20 hover:border-red-500 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Delete Node"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-[8px] text-slate-600 font-mono font-bold px-1.5">// ROOT</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Reset to standard template defaults */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(isAr ? 'هل تود استعادة كافة الإعدادات الافتراضية للعلامة والفئات والتصاميم المرفقة بالبرنامج الأصلي؟' : 'Revert entire UI storeDesign presets to factory settings?')) {
                      setCategories([
                        { key: 'all', labelAr: '✨ رواق المتجر الكلي', labelEn: 'All Masterpieces', active: true, order: 1 },
                        { key: 'watches', labelAr: '🕒 الساعات الفاخرة', labelEn: 'Luxury Watches', active: true, order: 2 },
                        { key: 'beauty', labelAr: '💄 مستحضرات الجمال الطبيعي', labelEn: 'Boutique Cosmetics', active: true, order: 3 },
                        { key: 'fashion', labelAr: '👗 أحدث صيحات قفطانات النخبة', labelEn: 'Apparel & Kaftans', active: true, order: 4 },
                        { key: 'decor', labelAr: '🏺 تحف الديكور والسيراميك الدافئ', labelEn: 'Curated Interior Decor', active: true, order: 5 }
                      ]);
                      setStoreDesign({
                        logoText: 'Trend Zone',
                        logoSize: 40,
                        logoUrl: '',
                        favicon: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=120&auto=format&fit=crop',
                        darkLogoUrl: '',
                        lightLogoUrl: '',
                        backgroundVideoUrl: '',
                        heroBackgroundUrl: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=1600&auto=format&fit=crop',
                        holograms: true,
                        particles: true,
                        overlayTransparency: 0.82,
                        overlayDarkTint: 0.9
                      });
                      document.title = "تريند زون | أحدث صيحات الموضة والجمال والديكور في مكان واحد";
                    }
                  }}
                  className="px-4 py-2 bg-neutral-900 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  ↩ FACTORY RESET DESIGN PRESETS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1.1 PRODUCTS CRUD SUBTAB */}
        {activeTab === 'products' && (
          <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-5 md:p-8 space-y-6 animate-fadeIn" id="saas-products-crud">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2.5">
                  <ShoppingBag className="w-4.5 h-4.5 text-[#FF7A00]" />
                  <span>{isAr ? 'إدارة المنتجات والمجموعات (كامل CRUD)' : 'Consolidated Product Catalog CRUD Controller'}</span>
                </h3>
                <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">// ADD, UPDATE, ARCHIVE, OR CHANGE DIRECT PUBLISH MANIFESTS</p>
              </div>
              
              {!isAddingProduct && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleStartAddProduct}
                    className="px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-[#E31C5F] text-black font-black hover:scale-103 active:scale-97 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(255,122,0,0.15)] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-black stroke-[3px]" />
                    <span>{isAr ? 'إضافة منتج جديد' : 'Deploy New SKU'}</span>
                  </button>

                  <button
                    onClick={handleExportProductsJSON}
                    className="px-3.5 py-2 bg-[#161616] border border-white/[0.08] text-white hover:bg-neutral-800 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                    title={isAr ? 'تنزيل لستة المنتجات كملف JSON' : 'Export current catalog to JSON'}
                  >
                    <Download className="w-3.5 h-3.5 text-brand-neon" />
                    <span>{isAr ? 'تصدير المخزون' : 'Export JSON'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBulkImportModal(true)}
                    className="px-3.5 py-2 bg-[#161616] border border-white/[0.08] text-white hover:bg-neutral-800 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                    title={isAr ? 'استيراد قائمة منتجات من كود JSON' : 'Paste & parse product array from JSON'}
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FF7A00]" />
                    <span>{isAr ? 'استيراد سلع' : 'Import JSON'}</span>
                  </button>
                </div>
              )}
            </div>

            {isAddingProduct ? (
              <form onSubmit={handleSaveProductSubmit} className="space-y-6 bg-black/40 border border-white/[0.04] p-6 rounded-2xl max-w-3xl">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-200">
                    {editingProductId ? (isAr ? `تحديث المنتج: ${prodForm.sku}` : `Edit SKU ${prodForm.sku}`) : (isAr ? 'إدخال منتج جديد بالنظام المعياري' : 'Deploy New Inventory Node')}
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => { setIsAddingProduct(false); setEditingProductId(null); }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'الاسم (بالعربية)' : 'Name (Arabic)'}</label>
                    <input
                      type="text"
                      required
                      value={prodForm.nameAr}
                      onChange={(e) => setProdForm({ ...prodForm, nameAr: e.target.value })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'الاسم (بالإنجليزية)' : 'Name (English)'}</label>
                    <input
                      type="text"
                      required
                      value={prodForm.nameEn}
                      onChange={(e) => setProdForm({ ...prodForm, nameEn: e.target.value })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'الوصف (بالعربية)' : 'Description (Arabic)'}</label>
                    <textarea
                      value={prodForm.descriptionAr}
                      onChange={(e) => setProdForm({ ...prodForm, descriptionAr: e.target.value })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 h-20 focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'الوصف (بالإنجليزية)' : 'Description (English)'}</label>
                    <textarea
                      value={prodForm.descriptionEn}
                      onChange={(e) => setProdForm({ ...prodForm, descriptionEn: e.target.value })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 h-20 focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'السعر النهائي للبيع (EGP)' : 'Retail Sale Price (EGP)'}</label>
                    <input
                      type="number"
                      required
                      value={prodForm.price}
                      onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'سعر التكلفة الأصلي (EGP)' : 'Supplier Cost Price (EGP)'}</label>
                    <input
                      type="number"
                      required
                      value={prodForm.originalPrice}
                      onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'رقم الباركود / الرمز الكودي' : 'Stock SKU Identifier'}</label>
                    <input
                      type="text"
                      required
                      value={prodForm.sku}
                      onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'الكمية الإجمالية للمخزون' : 'Total Stock On shelves'}</label>
                    <input
                      type="number"
                      required
                      value={prodForm.stock}
                      onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'رابط الصورة القائدة' : 'Prime Thumbnail URL'}</label>
                    <input
                      type="text"
                      required
                      value={prodForm.image}
                      onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'الفئة / القسم' : 'Product Category Section'}</label>
                    <select
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden cursor-pointer"
                    >
                      <option value="watches">🕒watches / الساعات الفاخرة</option>
                      <option value="apparel">👗apparel / قفاطين وملابس مصر</option>
                      <option value="skin_care">💄skin_care / العناية والجمال</option>
                      <option value="decor">🏺decor / ديكور وبوهو منزلي</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#FF7A00] uppercase tracking-wider">{isAr ? 'الألوان المتاحة (افصل بفاصلة)' : 'Available Colors (split with comma)'}</label>
                    <input
                      type="text"
                      placeholder="أسود, فضي, كحلي"
                      value={prodForm.colors}
                      onChange={(e) => setProdForm({ ...prodForm, colors: e.target.value })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#FF7A00] uppercase tracking-wider">{isAr ? 'المقاسات المتاحة (افصل بفاصلة)' : 'Available Sizes (split with comma)'}</label>
                    <input
                      type="text"
                      placeholder="Standard, M, L"
                      value={prodForm.sizes}
                      onChange={(e) => setProdForm({ ...prodForm, sizes: e.target.value })}
                      className="w-full text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-3 focus:outline-hidden font-sans"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => { setIsAddingProduct(false); setEditingProductId(null); }}
                    className="px-5 py-3 bg-neutral-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {isAr ? 'إلغاء التعديل' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#FF7A00] hover:bg-white hover:text-black text-white font-black rounded-xl text-xs transition-all cursor-pointer"
                  >
                    {isAr ? 'حفظ الألواح والبث' : 'Broadcast & Save'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-white/[0.03]">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                        <th className="p-4">{isAr ? 'الصورة' : 'Visual'}</th>
                        <th className="p-4">{isAr ? 'المنتج بالعربي / الإنجليزي' : 'Product Descriptor'}</th>
                        <th className="p-4">{isAr ? 'الفئة' : 'Category'}</th>
                        <th className="p-4">{isAr ? 'سعر التجزئة / التكلفة' : 'Retail / Cost'}</th>
                        <th className="p-4">{isAr ? 'المخزون الكلي' : 'Total On Shelf'}</th>
                        <th className="p-4">{isAr ? 'الترخيص والنشر' : 'Public Status'}</th>
                        <th className="p-4 text-center">{isAr ? 'العمليات اللوجستية' : 'Warehouse Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.01] transition-all">
                          <td className="p-4">
                            <img src={p.image} className="w-10 h-10 object-cover rounded-md border border-white/[0.04]" alt="crud thumbnail" referrerPolicy="no-referrer" />
                          </td>
                          <td className="p-4 space-y-1">
                            <p className="font-bold text-white text-[11px] leading-tight">{isAr ? p.nameAr : p.nameEn}</p>
                            <span className="text-[9px] font-mono text-slate-500 block uppercase">SKU: {p.sku || 'TZ-LEGACY'}</span>
                            {p.isDropshipping && (
                              <span className="text-[8px] font-mono bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30 px-1.5 py-0.5 rounded">
                                {isAr ? 'دروبشيبينغ مستورد' : 'DROPSHIPPED SOURCE'}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] bg-neutral-900 px-2 py-0.5 rounded font-mono uppercase text-[#D4AF37]">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4 space-y-0.5">
                            <p className="text-[#FF7A00] font-bold font-mono">{p.price} ج.م</p>
                            <span className="text-[9px] text-slate-500 font-mono block strike">{isAr ? 'تكلفة: ' : 'Cost: '}{p.originalPrice || p.price - 100} ج.م</span>
                          </td>
                          <td className="p-4 font-mono">
                            <span className={`font-bold px-2 py-0.5 rounded font-mono ${p.stock <= 5 ? 'bg-red-950/20 text-red-400 border border-red-900/40' : 'text-slate-200'}`}>
                              {p.stock} {isAr ? 'قطع' : 'pcs'}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleTogglePublishProduct(p.id)}
                              className={`text-[9px] px-2 py-1 rounded-lg font-mono font-black uppercase transition-all tracking-wider cursor-pointer border ${
                                p.isPublished !== false 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                                  : 'bg-slate-800/20 text-slate-400 border-slate-700/30 hover:bg-slate-800/40'
                              }`}
                            >
                              {p.isPublished !== false ? (isAr ? '● نشط بالواجهة' : 'ACTIVE') : (isAr ? '● مسودة مخفية' : 'DRAFTED')}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center items-center gap-1">
                              <button
                                onClick={() => handleStartEditProduct(p)}
                                className="p-2 hover:bg-neutral-800 rounded-lg text-slate-300 hover:text-[#FF7A00] transition-colors cursor-pointer"
                                title={isAr ? 'تعديل' : 'Edit'}
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                className="p-2 hover:bg-neutral-800 rounded-lg text-slate-350 hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-center"
                                title={isAr ? 'تكرار المنتج' : 'Duplicate'}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 hover:bg-rose-950/20 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                title={isAr ? 'حذف المنتج' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bulk Product Import Modal Overlay */}
        {showBulkImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-[#121215] border border-white/[0.08] max-w-2xl w-full rounded-2xl p-6 space-y-4 shadow-[0_0_50px_rgba(255,122,0,0.2)]">
              <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-neon" />
                  <span>{isAr ? 'استيراد المنتجات دفعة واحدة (JSON Array)' : 'Bulk Product Inventory JSON Importer'}</span>
                </h3>
                <button
                  onClick={() => { setShowBulkImportModal(false); setBulkImportText(''); }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  {isAr 
                    ? 'الصق كود الـ JSON لعام في المتجر. يجب أن تكون الصيغة عبارة عن Array تحتوي على تفاصيل المنتجات بالهيكل المعتمد.' 
                    : 'Paste your custom JSON array of product objects here. Ensure the formatting aligns with the standard platform model schema.'}
                </p>
                
                <textarea
                  placeholder='[
  {
    "sku": "REG-CLK-26",
    "nameAr": "ساعة كلاسيكية",
    "nameEn": "Luxury Classic Watch",
    "price": 2400,
    "stock": 45,
    "image": "https://images.unsplash.com/...jpg",
    "category": "watches"
  }
]'
                  value={bulkImportText}
                  onChange={(e) => setBulkImportText(e.target.value)}
                  className="w-full h-64 bg-black/60 text-white border border-white/[0.08] rounded-xl p-3 text-xs font-mono focus:outline-hidden focus:border-brand-neon focus:shadow-[0_0_15px_rgba(255,122,0,0.1)]"
                />
              </div>

              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowBulkImportModal(false); setBulkImportText(''); }}
                  className="px-4 py-2 text-xs font-bold bg-neutral-900 border border-white/[0.04] text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Close'}
                </button>
                <button
                  type="button"
                  disabled={!bulkImportText.trim()}
                  onClick={handleImportProductsJSON}
                  className="px-5 py-2 text-xs font-black bg-[#FF7A00] text-white disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all cursor-pointer"
                >
                  {isAr ? 'تأكيد الاستيراد المدمج' : 'Parse & Save Products'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1.2 PRICING ENGINE SUBTAB */}
        {activeTab === 'pricing' && (
          <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-5 md:p-8 space-y-6 animate-fadeIn" id="saas-pricing-engine">
            <div>
              <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2.5">
                <DollarSign className="w-4.5 h-4.5 text-[#FF7A00]" />
                <span>{isAr ? 'هندسة ودالة تسعير السلع والخصومات التفاعلية' : 'Saas Decimator Pricing & Automated Sales Engine'}</span>
              </h3>
              <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">// BATCH CATEGORY MULTIPLIERS, FLASH SALES SCHEDULING</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Batch Category Modifier Card */}
              <div className="bg-[#16161c] border border-white/[0.04] p-5 rounded-2xl md:col-span-1 space-y-4">
                <h4 className="text-xs font-mono font-extrabold text-[#FF7A00] uppercase tracking-wider">// {isAr ? 'معدل الفئات الدفعي' : 'BATH CATEGORY OVERLAY'}</h4>
                <form onSubmit={handleApplyPricingRule} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'تحديد فئة المنتجات المطبق عليها' : 'Target Category'}</label>
                    <select
                      value={pricingCategory}
                      onChange={(e) => setPricingCategory(e.target.value)}
                      className="w-full bg-[#121212] text-white border border-white/[0.06] rounded-xl p-2.5 cursor-pointer focus:outline-hidden"
                    >
                      <option value="all">{isAr ? 'جميع المعروضات بالمتجر' : 'all / Everything'}</option>
                      <option value="watches">watches / الساعات الفاخرة</option>
                      <option value="apparel">apparel / الملابس والقفاطين</option>
                      <option value="skin_care">skin_care / العناية بالبشرة والجمال</option>
                      <option value="decor">decor / تحف ديكور بوهو</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'عقيدة وهندسة التسعير' : 'Pricing Operation'}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPricingType('discount')}
                        className={`p-2.5 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all ${
                          pricingType === 'discount' 
                            ? 'bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40 font-black' 
                            : 'bg-[#121212] border border-white/[0.04] text-slate-400'
                        }`}
                      >
                        {isAr ? 'تنزيل/تخفيض %' : 'Discount (-%)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricingType('increase')}
                        className={`p-2.5 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all ${
                          pricingType === 'increase' 
                            ? 'bg-[#E31C5F]/20 text-[#E31C5F] border border-[#E31C5F]/40 font-black' 
                            : 'bg-[#121212] border border-white/[0.04] text-slate-400'
                        }`}
                      >
                        {isAr ? 'زيادة هامش %' : 'Increase (+%)'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'المحيط المئوي (%)' : 'Percentage Modifier (%)'}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="90"
                      value={pricingPercent}
                      onChange={(e) => setPricingPercent(Number(e.target.value))}
                      className="w-full bg-[#121212] text-white border border-white/[0.06] focus:border-[#FF7A00] rounded-xl p-2.5 focus:outline-hidden font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#FF7A00] to-[#E31C5F] text-black font-black uppercase text-[10px] rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all text-center tracking-wider"
                  >
                    {isAr ? 'بث وتعميم القاعدة' : 'APPLY BATCH MODIFIER'}
                  </button>

                  {pricingStatus && (
                    <div className="p-3 bg-emerald-950/20 text-emerald-400 border border-emerald-990/30 text-[10px] rounded-xl text-center font-bold">
                      {pricingStatus}
                    </div>
                  )}
                </form>
              </div>

              {/* Flash Sales list toggler */}
              <div className="bg-[#16161c] border border-white/[0.04] p-5 rounded-2xl md:col-span-2 space-y-4">
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <h4 className="text-xs font-mono font-extrabold text-[#FF7A00] uppercase tracking-wider">// {isAr ? 'بوابة بيع فلاش التنافسي للسلع' : 'FLASH SALES CONTROLLER'}</h4>
                  <span className="text-[8px] uppercase font-mono px-2 py-0.5 bg-red-950/20 text-[#E31C5F] border border-red-900/30 rounded">LIVE Countdown active</span>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {products.map((p) => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-black/40 border border-white/[0.03] hover:border-white/[0.06] rounded-xl text-xs gap-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} className="w-10 h-10 object-cover rounded-md border border-white/[0.04] shrink-0" alt="price modifier thumb" referrerPolicy="no-referrer" />
                        <div className="text-right">
                          <p className="font-bold text-white line-clamp-1">{isAr ? p.nameAr : p.nameEn}</p>
                          <span className="text-[10px] text-slate-500 font-mono">Original: {p.price} EGP | SKU: {p.sku || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {p.isFlashSale && (
                          <div className="text-left font-mono">
                            <span className="text-[9px] text-[#E31C5F] font-bold block">✨ FLASH SALE ON</span>
                            <span className="text-[11px] text-[#D4AF37] font-bold font-mono">{p.flashSalePrice || Math.round(p.price * 0.8)} EGP</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleToggleProductFlashSale(p.id)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest font-black uppercase border cursor-pointer transition-all ${
                            p.isFlashSale 
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                              : 'bg-neutral-800 text-slate-400 border-white/[0.04] hover:text-white'
                          }`}
                        >
                          {p.isFlashSale ? (isAr ? 'تعطيل الفلاش' : 'DISABLE') : (isAr ? 'تمكين وفلاش' : 'ENABLE FLASH')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1.3 DROPSHIPPING SYSTEM HUB SUBTAB */}
        {activeTab === 'dropshipping' && (
          <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-5 md:p-8 space-y-6 animate-fadeIn" id="saas-dropship-center">
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/[0.04] pb-4">
              <div>
                <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2.5">
                  <Sparkles className="w-4.5 h-4.5 text-[#FF7A00]" />
                  <span>{isAr ? 'بوابة المزامنة واستيراد سلع الدروب شيبينغ (CJ / AliExpress)' : 'Real-time CJ & AliExpress Dropship Sync Gateway'}</span>
                </h3>
                <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">// AUTO-REPUBLISH STOCKS, PRICE MARKUPS, PROFIT PROTECTORS</p>
              </div>

              <button
                onClick={handleSupplierSyncAll}
                disabled={isSyncingDropship}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-white hover:text-black text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-white/[0.08] active:scale-95 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#FF7A00] ${isSyncingDropship ? 'animate-spin' : ''}`} />
                <span>{isSyncingDropship ? (isAr ? 'جاري الفحص المالي والمخزني...' : 'Syncing...') : (isAr ? 'مزامنة المورد وتحديث المخازن' : 'Sync Suppler Stocks')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Product Import form card */}
              <div className="bg-[#16161c] border border-white/[0.04] p-5 rounded-2xl md:col-span-1 space-y-4">
                <div className="pb-2 border-b border-white/[0.04]">
                  <h4 className="text-xs font-mono font-extrabold text-[#FF7A00] uppercase tracking-wider">// {isAr ? 'استيراد فوري للسلع بالرابط' : 'IMPORT DIRECT VIA CJ'}</h4>
                  <span className="text-[8px] text-slate-500 font-mono block uppercase">Auto parsing title, prices & visual images</span>
                </div>

                <form onSubmit={handleImportDropshipSubmit} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'رابط المورد أو صفحة المنتج' : 'Supplier Product URL'}</label>
                    <input
                      type="text"
                      placeholder="https://cjdropshipping.com/product/..."
                      value={dropshipUrlInput}
                      onChange={(e) => setDropshipUrlInput(e.target.value)}
                      className="w-full bg-[#121212] text-white border border-white/[0.06] rounded-xl p-2.5 focus:border-[#FF7A00] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'اسم المنتج بالعربية' : 'Name (Arabic)'}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. حذاء رياضي مستورد التميز"
                      value={dropshipNameAr}
                      onChange={(e) => setDropshipNameAr(e.target.value)}
                      className="w-full bg-[#121212] text-white border border-white/[0.06] rounded-xl p-2.5 focus:border-[#FF7A00] focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'اسم المنتج بالإنجليزية' : 'Name (English)'}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CJ Imported Sporty V3"
                      value={dropshipNameEn}
                      onChange={(e) => setDropshipNameEn(e.target.value)}
                      className="w-full bg-[#121212] text-white border border-white/[0.06] rounded-xl p-2.5 focus:border-[#FF7A00] focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'تكلفة المورّد ($)' : 'Cost USD ($)'}</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={dropshipCost}
                        onChange={(e) => setDropshipCost(Number(e.target.value))}
                        className="w-full bg-[#121212] text-white border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden font-mono"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'هامش الربح / الزيادة %' : 'Profit Markup %'}</label>
                      <input
                        type="number"
                        required
                        value={dropshipMarkup}
                        onChange={(e) => setDropshipMarkup(Number(e.target.value))}
                        className="w-full bg-[#121212] text-white border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'الفئة المستهدفة' : 'Choose Category'}</label>
                    <select
                      value={dropshipCategory}
                      onChange={(e) => setDropshipCategory(e.target.value)}
                      className="w-full bg-[#121212] text-white border border-white/[0.06] rounded-xl p-2.5 cursor-pointer focus:outline-hidden"
                    >
                      <option value="skin_care">💄skin_care / الجمال والعناية</option>
                      <option value="watches">🕒watches / الساعات الفاخرة</option>
                      <option value="apparel">👗apparel / قفاطين وملابس</option>
                      <option value="decor">🏺decor / ديكور وبوهو</option>
                    </select>
                  </div>

                  <div className="p-3 bg-neutral-900 border border-white/[0.03] rounded-xl">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-widest font-mono">// EXPECTED METRICS</span>
                    <p className="text-white font-mono font-extrabold text-xs mt-1">
                      {isAr ? 'سعر البيع المقدر بالتجزئة: ' : 'Final Retail Price: '}
                      <span className="text-[#FF7A00]">{Math.round((dropshipCost * 48) * (1 + (dropshipMarkup / 100)))} ج.م</span>
                    </p>
                    <span className="text-[8px] text-emerald-450 font-mono block mt-1">● {isAr ? 'صافي هامش الربح المحتمل: ' : 'Est. Net Markup Profit: '}+{dropshipMarkup}%</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FF7A00] text-white font-black uppercase text-[10px] tracking-wider rounded-xl cursor-pointer hover:bg-white hover:text-black transition-all"
                  >
                    {isAr ? 'سحب واستيراد الفوري للمخازن' : 'DEPARS CJ SKU & DIRECT IMPORT'}
                  </button>
                </form>
              </div>

              {/* Console logs + Imported table */}
              <div className="bg-[#16161c] border border-white/[0.04] p-5 rounded-2xl md:col-span-2 space-y-4">
                
                {/* Monospace API Console log */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-[#FF7A00] font-bold font-mono uppercase tracking-widest">⚡ CJ SYNCHRONIZATION CONSOLE LOGS</span>
                  <div className="h-32 bg-[#08080c] border border-white/[0.04] rounded-xl p-3 select-all overflow-y-auto font-mono text-[9px] text-emerald-400 space-y-1.5">
                    {dropshipLogs.map((log, lIdx) => (
                      <div key={lIdx} className="leading-relaxed">
                        <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table list of dropshipped products */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-355 font-bold font-mono block uppercase tracking-widest">// IMPORTED SOURCE REGISTRY</span>
                  
                  <div className="overflow-x-auto rounded-xl border border-white/[0.03]">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/[0.04] text-[9px] text-slate-400 font-mono uppercase">
                          <th className="p-3">{isAr ? 'المنتج' : 'SKU Product'}</th>
                          <th className="p-3">{isAr ? 'رابط المصدر' : 'Source'}</th>
                          <th className="p-3">{isAr ? 'تكلفة المورّد' : 'Usd Cost'}</th>
                          <th className="p-3">{isAr ? 'سعر الواجهة' : 'Retail Price'}</th>
                          <th className="p-3">{isAr ? 'مستودع المورد' : 'Supplier Stock'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.filter(p => p.isDropshipping).map((p) => (
                          <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                            <td className="p-3 font-mono font-bold text-white text-[10px]">{isAr ? p.nameAr : p.nameEn}</td>
                            <td className="p-3">
                              <a 
                                href={p.supplierUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[9px] text-sky-400 hover:underline inline-flex items-center gap-1 font-mono"
                              >
                                {isAr ? 'صفحة المورد ↗' : 'View Source ↗'}
                              </a>
                            </td>
                            <td className="p-3 text-[10px] font-mono text-slate-350">${p.supplierPrice || 12.99}</td>
                            <td className="p-3 text-[10px] font-mono font-bold text-[#FF7A00]">{p.price} ج.م</td>
                            <td className="p-3 text-[10px]">
                              <span className="font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                                {p.stock} psc (Synced)
                              </span>
                            </td>
                          </tr>
                        ))}

                        {products.filter(p => p.isDropshipping).length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-[10px]">
                              NO IMPORTED DROPSHIPPING PRODUCTS REGISTERED IN CORE STATE yet. Use form on the left!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT SUBTAB */}
        {activeTab === 'orders' && (
          <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-5 md:p-8 space-y-6 animate-fadeIn" id="orders-saas-control">
            <div>
              <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2.5">
                <FileCheck className="w-4.5 h-4.5 text-[#FF7A00]" />
                <span>{isAr ? 'إدارة الطلبات، المدفوعات، والشحن اللوجستي بمصر' : ' Egyptian Dispatch Orders & Verified Payments Proof Desk'}</span>
              </h3>
              <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">// REVIEW PROOFS, PROCESS CARRIES, RECONCILE STAGES</p>
            </div>

            <div className="space-y-6 divide-y divide-white/[0.04]">
              {orders.map((ord) => (
                <div key={ord.id} className="pt-6 first:pt-0 pb-2 space-y-4" id={`saas-order-row-${ord.id}`}>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 text-right md:text-right">
                      <div className="flex flex-wrap items-center gap-2 justify-start">
                        <span className="font-mono text-xs font-bold text-slate-200 bg-neutral-800 border border-white/[0.08] px-2.5 py-1 rounded">
                          {ord.id}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase border ${
                          ord.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {ord.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] bg-sky-950/20 text-sky-400 border border-sky-900/30 font-mono px-2 py-0.5 rounded">
                          {ord.shippingMethod.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        تاريخ: {ord.date} | العميل الموقر: <span className="text-white font-bold">{ord.userName}</span> | هاتف التنسيق: <span className="text-white font-mono">{ord.shippingAddress.phone}</span>
                      </p>
                    </div>

                    {/* Actions dropdown controller */}
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) => handleSelectStatusChange(ord.id, e.target.value as any)}
                        className="text-xs bg-[#161616] text-white border border-white/[0.08] focus:border-brand-neon rounded-xl p-2.5 cursor-pointer focus:outline-hidden font-sans"
                      >
                        <option value="new" className="bg-[#121212] text-white">طلب جديد (New)</option>
                        <option value="pending" className="bg-[#121212] text-white">معلق للتدقيق المالي (Pending)</option>
                        <option value="confirmed" className="bg-[#121212] text-white">تم تأكيد الطلب من المبيعات (Confirmed)</option>
                        <option value="preparing" className="bg-[#121212] text-white">قيد التجهيز بالمستودع (Preparing)</option>
                        <option value="processing" className="bg-[#121212] text-white">جاري التعبئة والتغليف (Processing)</option>
                        <option value="shipped" className="bg-[#121212] text-white">تم تسليمه لشركة الشحن (Shipped)</option>
                        <option value="out_for_delivery" className="bg-[#121212] text-white">خرج مع مندوب التوصيل (Out For Delivery)</option>
                        <option value="delivered" className="bg-[#121212] text-white">تم التوصيل بنجاح واستلام المحصل (Delivered)</option>
                        <option value="cancelled" className="bg-[#121212] text-white">تم إلغاء الطلب (Cancelled)</option>
                        <option value="returned" className="bg-[#121212] text-white">مرتجع مدفوع بالكامل (Returned)</option>
                      </select>

                      <button
                        onClick={() => setSubmittingOrderTracking(submittingOrderTracking === ord.id ? null : ord.id)}
                        className="px-4 py-2.5 bg-brand-neon text-white hover:bg-white hover:text-black rounded-xl text-xs font-bold cursor-pointer font-mono uppercase tracking-wider transition-colors"
                      >
                        {isAr ? 'تحديث التتبع' : 'Add Tracking Status'}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Interactive Milestone Timeline tracking list */}
                  <div className="bg-black/20 p-4 border border-white/[0.03] hover:border-white/[0.05] rounded-2xl w-full max-w-xl space-y-3">
                    <span className="text-[9px] text-[#FF7A00] font-mono block uppercase tracking-wide">// Live Order Event Sequence Milestones (Customer View)</span>
                    <div className="relative border-r border-white/[0.08] pr-4 space-y-4 mr-1">
                      {(ord.trackingHistory || []).map((step, sIdx) => (
                        <div key={sIdx} className="relative text-xs">
                          {/* absolute signet dot indicator */}
                          <div className="absolute -right-[21px] top-1 w-2.0 h-2.0 rounded-full bg-[#FF7A00] shadow-[0_0_8px_rgba(255,122,0,0.6)]"></div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 font-mono block">{step.date} | {step.location}</span>
                            <p className="text-slate-200 mt-0.5 font-bold font-sans">{step.status}</p>
                          </div>
                        </div>
                      ))}

                      {(!ord.trackingHistory || ord.trackingHistory.length === 0) && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          No timeline entries registered yet. Use "Add Tracking Status" or update the dropdown to generate milestones dynamically.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attachment panel screenshot */}
                  {ord.paymentProof && (
                    <div className="flex flex-col sm:flex-row items-start gap-5 p-4 bg-black/40 border border-white/[0.04] rounded-2xl w-full max-w-xl">
                      <div className="text-center shrink-0">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono tracking-widest mb-1.5">// RECEIPT PREVIEW</span>
                        <img 
                          src={ord.paymentProof} 
                          className="w-24 h-24 object-cover border border-white/[0.08] rounded-xl hover:scale-105 transition-all cursor-zoom-in shadow"
                          alt="payment proof mockup screen" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-xs space-y-1.5 font-sans leading-relaxed">
                        <p className="font-bold text-white">طريقة التحويل والمقاصة: <span className="text-brand-neon uppercase font-bold font-mono bg-brand-neon/10 px-2 py-0.5 rounded">{ord.paymentMethod}</span></p>
                        <p className="text-slate-400">العنوان اللوجستي للتوصيل: {ord.shippingAddress.city}، {ord.shippingAddress.streetAddress}</p>
                        <p className="text-brand-neon font-mono font-bold text-sm">المطالبة الإجمالية للتسوية: {ord.total} ج.م</p>
                      </div>
                    </div>
                  )}

                  {/* Customized tracking form dropdown active */}
                  {submittingOrderTracking === ord.id && (
                    <div className="p-4 bg-[#16161c] rounded-xl space-y-3 border border-brand-neon/30 max-w-xl mt-2 font-sans shadow-lg">
                      <label className="block text-[10px] font-bold text-slate-350 font-mono uppercase tracking-wider">// اكتب تحديث الحالة اللوجستية الفوري لمندوب مصر</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customTrackingText}
                          onChange={(e) => setCustomTrackingText(e.target.value)}
                          placeholder="e.g. الطرد تحت حوزة بوسطة، مندوب القاهرة بالدرب الأحمر حالياً"
                          className="flex-1 text-xs bg-[#121212] text-white border border-white/[0.06] focus:border-brand-neon rounded-xl p-2.5 focus:outline-hidden"
                        />
                        <button
                          onClick={() => handleUpdateStatusAndTracking(ord.id, ord.status)}
                          className="px-4 py-2.5 bg-[#FF7A00] hover:bg-white hover:text-black transition-all text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                          تأكيد وبث فوري
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. INVENTORY SYSTEM SUBTAB */}
        {activeTab === 'inventory' && (
          <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-5 md:p-8 space-y-6" id="saas-inventory-subspace">
            <div>
              <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-brand-neon animate-pulse" />
                <span>{isAr ? 'عجز المخزون وحالات الإنذار الحرجة لجميع مستودعات مصر' : 'Real-time Stock Capacity & Replenish Alarms'}</span>
              </h3>
              <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">// INVENTORY COMPLIANCE PARAMETERS & LIVE REPLENISHMENTS</p>
            </div>

            {/* Low Stocks warn cylinders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 border border-rose-500/20 bg-rose-550/5 rounded-xl relative" id={`inventory-item-${p.id}`}>
                  <div className="flex items-center gap-3">
                    <img src={p.image} className="w-12 h-12 object-cover rounded-lg border border-white/[0.04] shrink-0" alt="low stock variant preview" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{isAr ? p.nameAr : p.nameEn}</h4>
                      <span className="text-[10px] font-mono text-brand-neon font-bold block mt-0.5">
                        ⚠️ الكمية المتبقية: {p.stock} قطع فقط!
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onReplenishProduct(p.id)}
                    className="px-3.5 py-2.5 bg-white text-black hover:bg-brand-neon hover:text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer font-mono uppercase"
                  >
                    {isAr ? 'شحن فوري +10' : 'RESTOCK +10'}
                  </button>
                </div>
              ))}
            </div>

            {lowStockProducts.length === 0 && (
              <div className="p-12 text-center text-slate-500 text-xs font-light bg-black/20 rounded-xl border border-white/[0.04]">
                💚 جميع مستودعات القاهرة الكبرى والوجه البحري في الحدود الآمنة للمخزون الفاخر.
              </div>
            )}

            {/* Safe Stock Full Grid table */}
            <div className="pt-6 border-t border-white/[0.04]">
              <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400 mb-4">// {isAr ? 'تفاصيل المخازن وإدارة كميات المنتجات الكلية بالمتجر:' : 'ALL RECORDED SKU STOCKS OVERVIEW & RESTOCK PANEL:'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="p-4 border border-white/[0.04] hover:border-white/[0.08] bg-[#0d0d12] rounded-xl flex flex-col justify-between text-xs gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="text-right">
                        <span className="font-bold text-white block truncate max-w-[150px]">{isAr ? p.nameAr : p.nameEn}</span>
                        <span className="text-[9px] text-slate-500 font-mono tracking-wider select-all">SKU: {p.sku || 'LEGACY'}</span>
                      </div>
                      <span className={`font-mono border text-[10px] px-2.5 py-1 rounded-lg font-bold ${
                        p.stock === 0 
                          ? 'bg-red-500/15 text-red-400 border-red-500/30' 
                          : p.stock <= 5 
                            ? 'bg-rose-500/10 text-rose-455 border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {p.stock === 0 ? (isAr ? 'نفد (معطل بالمتجر 🔴)' : 'STOCK: 0 (HIDDEN)') : `QTY: ${p.stock}`}
                      </span>
                    </div>

                    {p.stock === 0 && (
                      <p className="text-[9px] text-red-400 font-bold bg-red-950/10 p-1.5 border border-red-900/20 rounded">
                        ⚠️ {isAr ? 'تم إخفاء هذا المنتج تلقائياً من كتالوج الشراء حتى تجديد المخزون.' : 'Auto-hidden from storefront buy catalog until replenished.'}
                      </p>
                    )}

                    <div className="flex justify-end items-center gap-1.5 border-t border-white/[0.03] pt-2.5">
                      <span className="text-[9px] text-slate-500 font-mono font-bold mr-auto uppercase">{isAr ? 'تحديث السريع:' : 'Quick adds:'}</span>
                      <button
                        onClick={() => {
                          setProducts(prev => prev.map(item => item.id === p.id ? { ...item, stock: item.stock + 5 } : item));
                        }}
                        className="px-2 py-1 bg-neutral-800 hover:bg-[#FF7A00] hover:text-white rounded text-[10px] font-mono font-bold text-slate-300 transition-all cursor-pointer"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => {
                          setProducts(prev => prev.map(item => item.id === p.id ? { ...item, stock: item.stock + 25 } : item));
                        }}
                        className="px-2 py-1 bg-neutral-800 hover:bg-[#FF7A00] hover:text-white rounded text-[10px] font-mono font-bold text-slate-300 transition-all cursor-pointer"
                      >
                        +25
                      </button>
                      <button
                        onClick={() => {
                          const newAmt = prompt(isAr ? 'أدخل الكمية المستهدفة للمخزون الضوئي:' : 'Set exact stock quantity:', String(p.stock));
                          if (newAmt !== null && !isNaN(Number(newAmt))) {
                            setProducts(prev => prev.map(item => item.id === p.id ? { ...item, stock: Math.max(0, Number(newAmt)) } : item));
                          }
                        }}
                        className="px-2 py-1 bg-neutral-850 hover:bg-neutral-700 rounded text-[9px] font-sans font-bold text-slate-400 transition-all cursor-pointer"
                      >
                        {isAr ? 'تعيين' : 'Set'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 4. PROMOTIONS & VOUCHERS CONTROL */}
        {activeTab === 'promotions' && (
          <div className="space-y-8 animate-fadeIn" id="saas-promotions-desk">
            
            <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2">
                  <Tag className="w-4.5 h-4.5 text-[#FF7A00]" />
                  <span>{isAr ? 'منظومة إدارة الكوبونات وتوليد عروض الخصم الحصرية للعملاء' : 'Enterprise Promotions Planning & Coupon Vouchers Generator'}</span>
                </h3>
                <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">// DEFINE MULTIPLE PERCENT/FIXED COUPONS & MIN SPEND CONSTRAINTS</p>
              </div>

              {promoSuccessMsg && (
                <div className="p-3 bg-brand-neon/15 text-rose-250 text-xs rounded-xl font-bold border border-brand-neon/30 flex items-center gap-2 animate-bounce">
                  <Check className="w-4 h-4 text-brand-neon" />
                  <span>{isAr ? 'تم حفظ وبث الكود الترويجي الجديد بنجاح في أنظمة الشراء بالمتجر!' : 'Promotion code has been generated and broadcasted!'}</span>
                </div>
              )}

              {/* Promo Generator Form */}
              <form onSubmit={handleCreatePromotion} className="bg-black/20 p-5 rounded-2xl border border-white/[0.03] space-y-4">
                <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">// {isAr ? 'إنشاء كود خصم جديد معتمد' : 'BUILD BESPOKE PROMOTION VOUCHER'}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-450 uppercase font-mono">{isAr ? 'رمز الكود الترويجي' : 'PROMO CODE KEY'}</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. DISCOUNT30"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden focus:border-brand-neon font-mono text-center"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-450 uppercase font-mono">{isAr ? 'نوع معيار الخصم' : 'DISCOUNT TYPE'}</label>
                    <select
                      value={newPromoType}
                      onChange={(e) => setNewPromoType(e.target.value as any)}
                      className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden cursor-pointer"
                    >
                      <option value="percentage">نسبة مئوية (%) : Percentage</option>
                      <option value="fixed">مبلغ مالي ثابت (ج.م) : Fixed EGP</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-450 uppercase font-mono">{isAr ? 'قيمة الخصم بالكامل' : 'DISCOUNT VALUE'}</label>
                    <input 
                      type="number" 
                      required 
                      min="1"
                      value={newPromoValue}
                      onChange={(e) => setNewPromoValue(Number(e.target.value))}
                      className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden focus:border-brand-neon font-mono text-center"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-450 uppercase font-mono">{isAr ? 'الحد الأدنى للمشتريات' : 'MIN ORDER SPEND'}</label>
                    <input 
                      type="number" 
                      required 
                      min="100"
                      value={newPromoMinAmount}
                      onChange={(e) => setNewPromoMinAmount(Number(e.target.value))}
                      className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden focus:border-brand-neon font-mono text-center"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-end pt-2 justify-between">
                  <div className="space-y-1.5 w-full sm:w-1/3">
                    <label className="block text-[10px] text-slate-450 uppercase font-mono">{isAr ? 'تاريخ انتهاء الكابون' : 'EXPIRY DATE'}</label>
                    <input 
                      type="date" 
                      required 
                      value={newPromoExpiry}
                      onChange={(e) => setNewPromoExpiry(e.target.value)}
                      className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-2 px-2.5 focus:outline-hidden focus:border-brand-neon font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3 px-8 bg-[#FF7A00] hover:bg-white text-black hover:text-black font-extrabold text-[10px] rounded-xl transition-all cursor-pointer font-mono uppercase tracking-wider shadow"
                  >
                    + {isAr ? 'بث وتفعيل كود الخصم بالمتجر' : 'BROADCAST ACTIVE COUPON'}
                  </button>
                </div>
              </form>

              {/* Active Coupons List Grid Table */}
              <div className="space-y-3 pt-4">
                <h4 className="text-xs font-bold uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1.5">// {isAr ? 'قائمة كابونات الخصم الحالية بالسيستم والموقع المباشر' : 'ACTIVE COUPONS AND VOUCHERS LEDGER'}</h4>
                
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-right text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.04] text-[9px] text-slate-500 font-mono uppercase">
                        <th className="pb-2.5">{isAr ? 'الرمز الكودي للكوبون' : 'COUPON CODE'}</th>
                        <th className="pb-2.5">{isAr ? 'نوع وبنية قيمة الخصم' : 'DISCOUNT'}</th>
                        <th className="pb-2.5">{isAr ? 'الحد الأدنى للشراء' : 'MIN SPEND'}</th>
                        <th className="pb-2.5">{isAr ? 'حالة التفعيل والنشاط' : 'STATUS'}</th>
                        <th className="pb-2.5">{isAr ? 'العمر الزمني والصلاحية' : 'EXPIRY'}</th>
                        <th className="pb-2.5 text-center">{isAr ? 'خيارات التدبير' : 'ACTIONS'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {promos.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-3 font-mono font-bold text-white tracking-wide">{p.code}</td>
                          <td className="py-3">
                            <span className="font-mono font-bold text-brand-neon">
                              {p.discountType === 'percentage' ? `${p.value}%` : `${p.value} ج.م`}
                            </span>
                          </td>
                          <td className="py-3 font-mono">{p.minAmount} EGP</td>
                          <td className="py-3">
                            <button
                              onClick={() => handleTogglePromoActive(p.id)}
                              className={`px-2.5 py-1 text-[9px] font-bold rounded cursor-pointer ${
                                p.active 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse' 
                                  : 'bg-slate-500/10 text-slate-400 border border-white/[0.05]'
                              }`}
                            >
                              {p.active ? (isAr ? 'نشط بالمعمل' : 'ACTIVE') : (isAr ? 'معطل ومغلق' : 'MUTED')}
                            </button>
                          </td>
                          <td className="py-3 font-mono text-slate-450 text-[10px]">{p.expiryDate}</td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => handleDeletePromo(p.id)}
                              className="p-1.5 hover:bg-rose-500/10 text-rose-440 hover:text-white rounded transition-colors cursor-pointer"
                              title="Delete coupon"
                            >
                              <Trash2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 5. LIVE CRM SUPPORT TICKETS SUBTAB */}
        {activeTab === 'tickets' && (
          <div className="space-y-8 animate-fadeIn" id="saas-tickets-space">
            
            <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-6 space-y-6">
              
              <div className="border-b border-white/[0.04] pb-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2">
                    <MessageSquare className="w-4.5 h-4.5 text-[#FF7A00]" />
                    <span>{isAr ? 'مركز تدبير وحلول تذاكر دعم خدمات العملاء والوجه البحري' : 'Helpdesk CRM Support Tickets Orchestration Desk'}</span>
                  </h3>
                  <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">// REALTIME TICKET PIPELINE MONITOR & AGENT RESPOND TOOLS</p>
                </div>
                
                {/* Visual metrics count indicator badge */}
                <div className="px-3.5 py-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/20 rounded-xl text-xs text-[#FF7A00] font-mono font-bold animate-pulse">
                  QUEUE LIMIT: {tickets.length} ACTIVE
                </div>
              </div>

              {newTicketSuccess && (
                <div className="p-3 bg-brand-neon/15 text-rose-250 text-xs rounded-xl font-bold border border-brand-neon/30 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-neon" />
                  <span>{isAr ? 'تم فتح وتوثيق تذكرة طوارئ دعم فني جديدة بمركز الخدمات اللوجستية!' : 'Emergency ticket successfully queued at desk!'}</span>
                </div>
              )}

              {/* Emergent Ticket creator block */}
              <form onSubmit={handleCreateSupportTicket} className="bg-black/20 p-5 rounded-2xl border border-white/[0.03] space-y-4">
                <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">// {isAr ? 'فتح تذكرة دعم فني أو حالة طارئة جديدة يدوياً' : 'GENERATE NEW CUSTOMER SUPPORT RESOLUTION TICKET'}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-[10px] text-slate-450 uppercase font-mono">{isAr ? 'موضوع المشكلة / عنوان التذكرة الكودي' : 'TICKET COMPLIANCE SUBJECT'}</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. مشكلة في إيداع رصيد فودافون كاش - ORD-4431"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden focus:border-brand-neon"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-450 uppercase font-mono">{isAr ? 'درجة الخطورة والأولوية' : 'TICKET PRIORITY'}</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden cursor-pointer"
                    >
                      <option value="high">حرجة جداً وعاجلة (High)</option>
                      <option value="medium">طبيعية ومتوسطة (Medium)</option>
                      <option value="low">منخفضة وبسيطة (Low)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-450 uppercase font-mono">{isAr ? 'تفاصيل الاتصال ووصف الإجراء المطلوب' : 'TICKET DETAILED MESSAGE'}</label>
                  <textarea 
                    required 
                    rows={2}
                    placeholder="املاء تفاصيل المشكلة الرقمية، رقم حساب العميل، والواتس المنسق..."
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-3 focus:outline-hidden focus:border-brand-neon"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-neon text-white font-bold text-[10px] font-mono tracking-widest uppercase rounded-xl hover:bg-white hover:text-black cursor-pointer transition-all"
                  >
                    + {isAr ? 'فتح وتدوين تذكرة دعم بالسيستم' : 'QUEUE TICKET INSTANTLY'}
                  </button>
                </div>
              </form>

              {/* Tickets Render list */}
              <div className="space-y-4 pt-3">
                <h4 className="text-xs font-bold uppercase text-slate-450 font-mono tracking-wider flex items-center gap-1.5">// {isAr ? 'التذاكر المعلقة والنشطة وقيد المتابعة حاليا' : 'LIVE HELPDESK CRM PIPELINE TICKETS'}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {tickets.map((tck) => (
                    <div 
                      key={tck.id} 
                      className={`p-5 rounded-2xl border transition-all relative space-y-3.5 bg-[#0e0e13] ${
                        tck.status === 'resolved' 
                          ? 'border-white/[0.03] opacity-60' 
                          : tck.priority === 'high' 
                            ? 'border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.02)]' 
                            : 'border-[#FF7A00]/20'
                      }`}
                    >
                      {/* Ticket Header values */}
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="font-mono text-[10px] font-black text-slate-200 bg-neutral-800 border border-white/[0.05] px-2 py-0.5 rounded">
                          {tck.id}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] px-2 py-0.5 font-bold uppercase font-mono rounded ${
                            tck.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {tck.priority}
                          </span>
                          <span className={`text-[8px] px-2 py-0.5 font-bold uppercase font-mono rounded ${
                            tck.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : tck.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {tck.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white leading-snug">{tck.subject}</h4>
                        <p className="text-[10px] text-slate-450 font-mono">طالب الخدمة: {tck.customerName} • {tck.createdAt}</p>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{tck.message}</p>

                      {/* Urgent Actions buttons */}
                      {tck.status !== 'resolved' && (
                        <div className="flex justify-end gap-2 pt-2.5 border-t border-white/[0.03] text-[9px] font-mono">
                          <button
                            onClick={() => handleUpdateTicketStatus(tck.id, 'pending')}
                            className="px-2.5 py-1 text-amber-400 bg-amber-500/5 hover:bg-amber-500/15 rounded border border-amber-500/20 cursor-pointer"
                          >
                            {isAr ? 'وضع قيد المراجعة' : 'Set Pending'}
                          </button>
                          
                          <button
                            onClick={() => handleUpdateTicketStatus(tck.id, 'resolved')}
                            className="px-2.5 py-1 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15 rounded border border-emerald-500/20 cursor-pointer"
                          >
                            {isAr ? 'تم الحل فورا' : 'Mark Resolved'}
                          </button>
                        </div>
                      )}

                      {tck.status === 'resolved' && (
                        <div className="text-[9px] font-bold font-mono text-emerald-400 flex items-center gap-1">
                          ✓ {isAr ? 'تم إغلاق تذكرة الدعم بنجاح بالمنظومة' : 'TICKET RESOLVED AND RETIRED'}
                        </div>
                      )}

                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 6. CRM SUBTAB COMMS */}
        {activeTab === 'crm' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="saas-crm-desk">
            
            {/* Note creator */}
            <div className="bg-[#121215] rounded-2xl p-5 md:p-8 border border-white/[0.04] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
              <h3 className="text-sm font-display font-extrabold text-[#FF7A00] border-b border-white/[0.04] pb-3 flex items-center gap-2.5">
                <Clipboard className="w-5 h-5 text-[#FF7A00]" />
                <span>{isAr ? 'لوحة تدوين الملحوظات وتتبع اتصالات عملاء الـ VIP بمصر' : ' Bespoke VIP Clients CRM Notes Log Desk'}</span>
              </h3>

              <form onSubmit={handleCreateCRMNote} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">// {isAr ? 'إدخال إجراء أو تعديل بملف العميل المختار' : 'Add communications trace logger'}</label>
                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder={isAr ? 'سجل تفاصيل رغبات الألوان للعميل، تعديل المقاسات، تنسيق وتغيير الشحنة بمكالمة هاتفية معتمدة...' : 'Enter client coordinates or delivery adjustments...'}
                    className="w-full text-xs text-white bg-[#1a1a20] border border-white/[0.06] rounded-xl p-3 focus:outline-hidden focus:border-brand-neon transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF7A00] text-black hover:bg-white hover:text-black text-xs font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'حفظ وتدوين ملاحظة العميل فورا' : 'SUBMIT DIRECT NOTE'}</span>
                </button>
              </form>

              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand-neon" />
                  {isAr ? 'المفكرة التاريخية لاتصالات الموظفين بمصر' : 'Historical Communication Logs timeline:'}
                </h4>
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {notes.map((n) => (
                    <div key={n.id} className="p-4 bg-[#0d0d12] rounded-xl border border-white/[0.04] relative space-y-2">
                      <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono font-bold">
                        <span className="text-brand-neon">📍 {n.author}</span>
                        <span>{n.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{n.note}</p>
                      <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/[0.03] flex items-center gap-1">
                        <span>👤</span>
                        <span className="text-white font-bold">{n.customerName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CRM Tasks checklist */}
            <div className="bg-[#121215] rounded-2xl p-5 md:p-8 border border-white/[0.04] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6">
              <h3 className="text-sm font-display font-extrabold text-white border-b border-white/[0.04] pb-3 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#FF7A00] rounded"></span>
                {isAr ? 'قائمة مهام وواجبات فريق العمل الموكلة' : 'Scheduled staff assignments & daily logistics duties'}
              </h3>

              <form onSubmit={handleCreateCRMTask} className="space-y-4 p-4 bg-[#0d0d12] border border-white/[0.04] rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 font-mono uppercase tracking-wider">// الإجراء المطلوب للفريق</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Call aramex supervisor"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden focus:border-brand-neon"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 font-mono uppercase tracking-wider">// درجة خطورة الإجراء</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className="w-full text-xs text-white bg-[#16161c] border border-white/[0.06] rounded-xl p-2.5 focus:outline-hidden focus:border-brand-neon cursor-pointer"
                    >
                      <option value="low">بسيطة / Low</option>
                      <option value="medium">متوسطة / Medium</option>
                      <option value="high">طارئة وحرجة جداً / High</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF7A00] hover:bg-white text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer font-mono uppercase tracking-wider"
                >
                  + {isAr ? 'إسناد المهمة بالكامل لخلية الدعم' : 'SUBMIT WORK ORDER'}
                </button>
              </form>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {tasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  return (
                    <div key={task.id} className="flex items-start justify-between p-4 bg-[#0d0d12] border border-white/[0.04] hover:border-brand-neon/30 rounded-xl transition-all">
                      <div className="flex items-start gap-3 text-right">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => onToggleTaskStatus(task.id)}
                          className="mt-0.5 w-4 h-4 rounded-md accent-brand-neon border-white/[0.1] bg-[#121212] cursor-pointer"
                        />
                        <div>
                          <h4 className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                            {task.task}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            تاريخ الإنجاز المطلوب: {task.dueDate} • للعميل: {task.customerName}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[8px] px-2.5 py-1 rounded font-bold uppercase font-mono ${
                        task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-500/10 text-slate-400 border border-white/[0.04]'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* 11. USERS MANAGEMENT PRO PANEL */}
        {activeTab === 'users' && (
          <div className="space-y-6" id="saas-users-crm">
            <div className="flex justify-between items-center bg-[#121215] border border-white/[0.04] p-5 rounded-2xl flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]"></span>
                  <span>{isAr ? 'منظومة إدارة حسابات متسوقي ومسؤولي تريند زون' : 'Trend Zone Account and User Directory Pro'}</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">// REAL-TIME INTERACTIVE ROLE ASSIGNMENT & SAAS BALANCE CONTROL</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-neutral-800 border border-white/[0.05] rounded-xl text-[10px] font-mono font-bold text-[#FF7A00]">
                  ACTIVE CHANNELS: {usersList.length}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#121215] border border-white/[0.04] p-4 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">{isAr ? 'إجمالي الأرصدة بالمحفظة' : 'Consolidated Customer Wallets'}</span>
                <span className="text-lg font-display font-black text-white block mt-1">
                  {usersList.reduce((sum, u) => sum + u.wallet, 0).toLocaleString()} <span className="text-[10px] text-slate-500 font-bold">ج.م</span>
                </span>
              </div>
              <div className="bg-[#121215] border border-white/[0.04] p-4 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">{isAr ? 'إجمالي نقاط الولاء الممنوحة' : 'Total Distributed Loyalty Points'}</span>
                <span className="text-lg font-display font-black text-white block mt-1">
                  {usersList.reduce((sum, u) => sum + u.points, 0).toLocaleString()} <span className="text-[10px] text-slate-500 font-bold">نقطة</span>
                </span>
              </div>
              <div className="bg-[#121215] border border-white/[0.04] p-4 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">{isAr ? 'نسبة حماية RBAC للهويات' : 'Active Security Token Audits'}</span>
                <span className="text-lg font-display font-black text-emerald-400 block mt-1">100% SECURE</span>
              </div>
            </div>

            <div className="bg-[#121215] border border-white/[0.04] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                  <thead>
                    <tr className="border-b border-white/[0.05] bg-[#0d0d12] text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                      <th className="p-4">{isAr ? 'الاسم والبريد' : 'User profile & Email'}</th>
                      <th className="p-4">{isAr ? 'الهاتف' : 'Contact Phone'}</th>
                      <th className="p-4">{isAr ? 'المستوى والصلاحيات' : 'Clearance Role'}</th>
                      <th className="p-4">{isAr ? 'رصيد المحفظة والولاء' : 'Wallet / Loyalty'}</th>
                      <th className="p-4 text-center">{isAr ? 'التحكم السحابي في الإعدادات' : 'System Override Control'}</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-white/[0.03]">
                    {usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1e1e24] text-[#FF7A00] font-black text-xs flex items-center justify-center select-none shadow w-8 h-8 shrink-0">
                              {user.name[0]}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{user.name}</span>
                              <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-350">{user.phone}</td>
                        <td className="p-4">
                          <span className={`text-[9px] px-2.5 py-1 rounded font-bold uppercase font-mono border ${
                            user.role === 'super_admin' 
                              ? 'bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/20' 
                              : user.role === 'customer_service'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-400 font-mono block">{user.wallet} ج.م</span>
                            <span className="text-[9px] text-slate-500 font-mono block">{user.points} {isAr ? 'نقطة ولاء' : 'Pts'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            {/* Option 1: Gift Credit */}
                            <button
                              onClick={() => {
                                setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, wallet: u.wallet + 500 } : u));
                                alert(isAr ? `تمت هدية العميل بقيمة +500 ج.م رصيد فوري لمحفظة ${user.name}` : `Dispatched $+500 EGP complementary wallet deposit successfully to ${user.name}`);
                              }}
                              className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/25 rounded-md transition-all text-[9px] font-bold cursor-pointer"
                            >
                              🎁 +500 ج.م
                            </button>

                            {/* Option 2: Team Role Selector */}
                            <div className="flex items-center gap-1.5" dir="ltr">
                              <span className="text-[8px] text-slate-500 font-bold uppercase font-mono">{isAr ? 'الصلاحيات:' : 'Role:'}</span>
                              <select
                                value={user.role}
                                disabled={user.role === 'super_admin'}
                                onChange={(e) => {
                                  const nextRole = e.target.value;
                                  setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, role: nextRole as any } : u));
                                }}
                                className="text-[10px] bg-neutral-900 text-white border border-white/[0.08] focus:border-[#FF6B00] rounded px-1.5 py-0.5 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="super_admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="marketing">Marketing</option>
                                <option value="customer_service">Customer Service</option>
                                <option value="warehouse">Warehouse</option>
                                <option value="affiliate">Affiliate</option>
                                <option value="customer">Customer</option>
                              </select>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 12. RETURN REQUESTS SYSTEM PANEL */}
        {activeTab === 'returns' && (
          <div className="space-y-6" id="saas-returns-system">
            <div className="bg-[#121215] border border-white/[0.04] p-5 rounded-2xl flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-display font-extrabold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgb(239,68,68)]"></span>
                  <span>{isAr ? 'نظام تتبع ومعالجة طلبات المرتجعات واسترداد الأموال' : 'Dynamic Returns Orchestration & Liquidity Refund Desk'}</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">// AUTOMATIC INVENTORY RE-ALIGNMENT & WALLET CREDITING</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/25 rounded-xl text-[10px] font-mono font-bold text-[#FF7A00]">
                  PENDING INVENTORIES: {returnsList.filter(r => r.status === 'pending').length}
                </span>
              </div>
            </div>

            {/* Simulated Requests Logs */}
            <div className="space-y-4">
              {returnsList.map((ret) => (
                <div key={ret.id} className="bg-[#121215] border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-rose-500/20 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/[0.02] rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] tracking-wide font-mono bg-neutral-800 text-slate-400 p-1 rounded font-bold uppercase shrink-0">
                        {ret.orderId}
                      </span>
                      <h4 className="text-xs font-bold text-white font-sans">{ret.customerName}</h4>
                      <span className="text-[9px] text-slate-500 font-mono hidden sm:inline">({ret.email})</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-bold leading-normal font-sans">
                      📦 {isAr ? 'السلعة المستلمة لإرجاعها' : 'Product'}: <span className="text-[#FF7A00]">{ret.product}</span>
                    </p>
                    <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                      <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                        💬 <span className="text-slate-500 font-bold">{isAr ? 'سبب طلب المرتجع' : 'Reason'}:</span> {ret.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-[9px] text-slate-500 font-mono pt-1">
                      <span>📆 {isAr ? 'تاريخ المعاملة' : 'Filed'}: {ret.date}</span>
                      <span>💰 {isAr ? 'إجمالي السعر المسترد' : 'Liquid Total'}: <span className="font-bold text-rose-500 font-mono">{ret.total} ج.م</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch sm:items-end justify-between gap-3 shrink-0 w-full md:w-auto">
                    <div>
                      <span className={`text-[9px] px-3 py-1 rounded-full font-bold uppercase font-mono ${
                        ret.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {ret.status === 'approved' ? (isAr ? 'تم إعادة المبلغ وارجاع السلعة' : 'Refund Succeeded & Returned') : (isAr ? 'قيد مراجعة الجودة واللوجستيات' : 'Pending Verification')}
                      </span>
                    </div>

                    {ret.status === 'pending' && (
                      <div className="flex gap-2 w-full md:w-auto font-sans">
                        <button
                          onClick={() => {
                            // Update simulated return status in states
                            setReturnsList(prev => prev.map(r => r.id === ret.id ? { ...r, status: 'approved' } : r));
                            
                            // Try to credit simulated balance in user simulation
                            setUsersList(prev => prev.map(u => {
                              if (u.email === ret.email) {
                                return { ...u, wallet: u.wallet + ret.total };
                              }
                              return u;
                            }));

                            // Perform genuine state changes if found
                            onUpdateOrderStatus(ret.orderId, 'returned', `تم قبول المرتجع وإعادة المبلغ المقدر بـ ${ret.total} ج.م للمحفظة`);

                            alert(isAr 
                              ? `تمت الموافقة الفورية على طلب المرتجعات ${ret.id}. تم بنجاح ايداع ${ret.total} ج.م رصيد فوري لمحفظة العميل.` 
                              : `Return authorized for ${ret.orderId}. Credited $${ret.total} EGP back into client account balance.`
                            );
                          }}
                          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-green-500 hover:to-emerald-600 text-white font-extrabold text-[10px] rounded-xl transition-all shadow-md cursor-pointer uppercase font-mono tracking-wider"
                        >
                          ✓ {isAr ? 'موافقة وقبول المرتجع ومصالحة العميل نقداً' : 'Approve & Credit Wallet'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. IMMUTABLE SECURITY LEDGER SUBTAB */}
        {activeTab === 'security' && (
          <div className="bg-[#121215] border border-white/[0.04] rounded-2xl p-5 md:p-8 space-y-6" id="saas-security-log">
            <div>
              <h3 className="text-sm font-display font-extrabold text-white border-b border-white/[0.04] pb-4 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-brand-neon rounded"></span>
                {isAr ? 'سجل مدقق الأمان المشفر والحركات Immutable Cyber audit Ledger' : 'Cybershield Identity Audit Logs & Transactions Signatures'}
              </h3>
              <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">// AUDITED EVENT TELEMETRY DIRECT FROM EG SERVERS</p>
            </div>

            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-4 bg-[#0d0d12] rounded-xl border border-white/[0.04] text-xs space-y-2 hover:border-[#FF7A00]/30 transition-all">
                  <div className="flex justify-between items-center flex-wrap gap-2 text-[9px] text-slate-500 font-mono font-bold mb-1">
                    <span className="bg-brand-neon/10 text-brand-neon border border-brand-neon/20 px-2.5 py-0.5 rounded font-mono">
                      SECURED SAAS CORE PROTOCOL: {log.userRole.toUpperCase()}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>

                  <p className="font-bold text-white font-sans text-right md:text-right">{log.action}</p>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/[0.03] text-[10px] text-slate-400 font-mono">
                    <span>👤 USERNAME: <span className="text-white font-bold">{log.userName}</span></span>
                    <span>IP CORE ROUTING: {log.ipAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}

// Simple helper function for custom default fallback word
function fWord(pWord: string, fallback: string) {
  return pWord || fallback;
}
