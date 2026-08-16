export type UserRole = 'CUSTOMER' | 'ADMIN' | 'DELIVERY';

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  subcategory?: string;
  unit: string; // e.g., '1 kg', '500 g', '1 L', '1 pc', 'Pack of 3'
  mrp: number;
  salePrice: number;
  discountPercent: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  sku: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  subcategories: string[];
  itemCount?: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  code: string;
  pincodes: string[];
  areaCoverageKm2: number;
  deliveryFee: number;
  minOrderForFreeDelivery: number;
  estimatedMinutes: number;
  isActive: boolean;
  centerCoordinates: { lat: number; lng: number };
  neighborhoodHighlights: string[];
}

export interface Address {
  id: string;
  userId: string;
  label: 'Home' | 'Work' | 'Other';
  streetAddress: string;
  apartmentFloor?: string;
  landmark: string;
  pincode: string;
  zoneId: string;
  zoneName: string;
  isDefault: boolean;
  recipientName: string;
  recipientPhone: string;
  coordinates?: { lat: number; lng: number };
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface DeliverySlot {
  id: string;
  label: string;
  dateLabel: string;
  timeWindow: string;
  isAvailable: boolean;
}

export type PaymentMethod = 'COD' | 'UPI' | 'CARD' | 'WALLET';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export interface OrderTimelineStep {
  status: OrderStatus;
  timestamp: string;
  title: string;
  note: string;
  completed: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  savedAmount: number;
  address: Address;
  zone: DeliveryZone;
  slot: DeliverySlot;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  timeline: OrderTimelineStep[];
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  deliveryEta?: string;
  liveLocation?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
  cancelReason?: string;
  returnReason?: string;
  driverNotes?: string;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENT' | 'FLAT';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  validUntil: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
  verifiedPurchase: boolean;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFFLINE';
  activeOrdersCount: number;
  rating: number;
  completedDeliveries: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  serviceRadiusKm: number;
  storeOpen: boolean;
  operatingHours: string;
  currencySymbol: string;
  currencyCode: string;
  taxIncludedInPrice: boolean;
  loyaltyPointsEarnRate: number; // 1 point per $10 spent
  broadcastBanner: {
    text: string;
    linkTag?: string;
    active: boolean;
    type: 'info' | 'deal' | 'warning';
  };
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  loyaltyPoints: number;
  addresses: Address[];
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  recipientPhone: string;
  channel: 'SMS' | 'WHATSAPP' | 'APP_PUSH';
  title: string;
  body: string;
  timestamp: string;
  orderId?: string;
}

export interface AdminAnalyticsKPIs {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeCustomers: number;
  outOfStockCount: number;
  lowStockCount: number;
  pendingDeliveriesCount: number;
  deliveredOrdersCount: number;
  categorySales: { categoryName: string; revenue: number; percentage: number }[];
  zonePerformance: { zoneName: string; orderCount: number; revenue: number }[];
  recentDailySales: { date: string; revenue: number; orders: number }[];
}
