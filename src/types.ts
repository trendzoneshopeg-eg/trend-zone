export type Language = 'ar' | 'en';

export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'customer_service'
  | 'affiliate_manager'
  | 'affiliate'
  | 'customer';

export interface ProductVariant {
  sku: string;
  color: string;
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  category: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  colors: string[];
  sizes: string[];
  variants: ProductVariant[];
  sku: string;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  isPublished?: boolean;
  isDropshipping?: boolean;
  supplierUrl?: string;
  supplierPrice?: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'confirmed' | 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'pending' | 'processing' | 'returning';
  paymentMethod: 'vodafone_cash' | 'instapay' | 'bank_transfer' | 'cash_on_delivery';
  paymentProof?: string;
  shippingMethod: 'egypt_post' | 'bosta' | 'aramex';
  shippingAddress: {
    fullName: string;
    phone: string;
    governorate: string;
    city: string;
     streetAddress: string;
  };
  trackingNumber?: string;
  trackingHistory?: { status: string; date: string; location: string }[];
  date: string;
}

export interface CRMNote {
  id: string;
  customerId: string;
  customerName: string;
  note: string;
  author: string;
  createdAt: string;
}

export interface CRMTask {
  id: string;
  customerId: string;
  customerName: string;
  task: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  dueDate: string;
}

export interface DBActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
}

export interface LoyaltyWallet {
  userId: string;
  walletBalance: number; // in EGP
  loyaltyPoints: number;
  loyaltyLevel: 'Bronze' | 'Silver' | 'Gold' | 'VIP';
  transactions: {
    id: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'purchase' | 'refund' | 'commission';
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    date: string;
    description: string;
  }[];
}

export interface AffiliateProfile {
  id: string;
  userId: string;
  referralCode: string;
  clicks: number;
  conversions: number;
  earnings: number;
  withdrawn: number;
  balance: number;
  referrals: {
    orderId: string;
    amount: number;
    commission: number;
    date: string;
    status: 'pending' | 'paid' | 'cancelled';
  }[];
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minAmount: number;
  active: boolean;
  expiryDate: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'resolved';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

