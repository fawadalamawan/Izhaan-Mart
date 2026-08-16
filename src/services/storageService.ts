import {
  Product,
  Category,
  DeliveryZone,
  Coupon,
  DeliverySlot,
  StoreSettings,
  DeliveryPerson,
  User,
  Order,
  Review,
  NotificationLog,
  AdminAnalyticsKPIs,
  UserRole,
  OrderStatus
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ZONES,
  INITIAL_COUPONS,
  INITIAL_SLOTS,
  INITIAL_STORE_SETTINGS,
  INITIAL_DELIVERY_PERSONNEL,
  INITIAL_SAMPLE_USER,
  INITIAL_SAMPLE_ORDERS
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'Izhaan_products_v1',
  CATEGORIES: 'Izhaan_categories_v1',
  ZONES: 'Izhaan_zones_v1',
  COUPONS: 'Izhaan_coupons_v1',
  SLOTS: 'Izhaan_slots_v1',
  SETTINGS: 'Izhaan_settings_v1',
  DRIVERS: 'Izhaan_drivers_v1',
  USER: 'Izhaan_current_user_v1',
  ORDERS: 'Izhaan_orders_v1',
  REVIEWS: 'Izhaan_reviews_v1',
  NOTIFICATIONS: 'Izhaan_notifications_v1',
  ROLE: 'Izhaan_active_role_v1',
  CART: 'Izhaan_cart_items_v1',
  WISHLIST: 'Izhaan_wishlist_ids_v1'
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('Izhaan_storage_update', { detail: { key } }));
  } catch (err) {
    console.error('Storage write error', err);
  }
}

export class StorageService {
  // PRODUCTS
  static getProducts(): Product[] {
    return safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  static getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  static saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    safeSet(STORAGE_KEYS.PRODUCTS, products);
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    safeSet(STORAGE_KEYS.PRODUCTS, products);
  }

  static batchImportProducts(newProducts: Product[]): { count: number } {
    const existing = this.getProducts();
    const map = new Map(existing.map(p => [p.id, p]));
    newProducts.forEach(p => map.set(p.id, p));
    const merged = Array.from(map.values());
    safeSet(STORAGE_KEYS.PRODUCTS, merged);
    return { count: newProducts.length };
  }

  // CATEGORIES
  static getCategories(): Category[] {
    return safeGet<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  static saveCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    safeSet(STORAGE_KEYS.CATEGORIES, categories);
  }

  static deleteCategory(id: string): void {
    const categories = this.getCategories().filter(c => c.id !== id);
    safeSet(STORAGE_KEYS.CATEGORIES, categories);
  }

  // ZONES
  static getZones(): DeliveryZone[] {
    return safeGet<DeliveryZone[]>(STORAGE_KEYS.ZONES, INITIAL_ZONES);
  }

  static findZoneByPincode(pincode: string): DeliveryZone | null {
    const cleanPin = pincode.trim();
    const zones = this.getZones().filter(z => z.isActive);
    return zones.find(z => z.pincodes.includes(cleanPin)) || null;
  }

  static saveZone(zone: DeliveryZone): void {
    const zones = this.getZones();
    const index = zones.findIndex(z => z.id === zone.id);
    if (index >= 0) {
      zones[index] = zone;
    } else {
      zones.push(zone);
    }
    safeSet(STORAGE_KEYS.ZONES, zones);
  }

  // COUPONS
  static getCoupons(): Coupon[] {
    return safeGet<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }

  static validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount: number; message: string } {
    const cleanCode = code.trim().toUpperCase();
    const coupons = this.getCoupons().filter(c => c.isActive);
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { valid: false, discount: 0, message: 'Invalid promo code. Please check and retry.' };
    }

    if (subtotal < found.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Min order value for ${found.code} is $${found.minOrderValue}. Add $${(found.minOrderValue - subtotal).toFixed(2)} more!`
      };
    }

    let discount = 0;
    if (found.discountType === 'FLAT') {
      discount = Math.min(found.discountValue, subtotal);
    } else {
      discount = (subtotal * found.discountValue) / 100;
      if (found.maxDiscount && discount > found.maxDiscount) {
        discount = found.maxDiscount;
      }
    }

    return {
      valid: true,
      coupon: found,
      discount: Math.round(discount * 100) / 100,
      message: `Coupon ${found.code} applied! Saved $${discount.toFixed(2)}`
    };
  }

  // SLOTS
  static getSlots(): DeliverySlot[] {
    return safeGet<DeliverySlot[]>(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
  }

  // SETTINGS
  static getSettings(): StoreSettings {
    return safeGet<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS);
  }

  static updateSettings(settings: Partial<StoreSettings>): StoreSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    safeSet(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // DRIVERS
  static getDrivers(): DeliveryPerson[] {
    return safeGet<DeliveryPerson[]>(STORAGE_KEYS.DRIVERS, INITIAL_DELIVERY_PERSONNEL);
  }

  static updateDriverStatus(id: string, status: DeliveryPerson['status']): void {
    const drivers = this.getDrivers();
    const d = drivers.find(drv => drv.id === id);
    if (d) {
      d.status = status;
      safeSet(STORAGE_KEYS.DRIVERS, drivers);
    }
  }

  // USER & AUTH
  static getCurrentUser(): User {
    return safeGet<User>(STORAGE_KEYS.USER, INITIAL_SAMPLE_USER);
  }

  static getUser(): User {
    return this.getCurrentUser();
  }

  static saveUser(user: User): void {
    safeSet(STORAGE_KEYS.USER, user);
  }

  static getActiveRole(): UserRole {
    return safeGet<UserRole>(STORAGE_KEYS.ROLE, 'CUSTOMER');
  }

  static setActiveRole(role: UserRole): void {
    safeSet(STORAGE_KEYS.ROLE, role);
  }

  // CART
  static getCart(): import('../types').CartItem[] {
    return safeGet<import('../types').CartItem[]>(STORAGE_KEYS.CART, []);
  }

  static saveCart(cart: import('../types').CartItem[]): void {
    safeSet(STORAGE_KEYS.CART, cart);
  }

  static addToCart(product: Product, quantity = 1): import('../types').CartItem[] {
    const cart = this.getCart();
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      existing.quantity = Math.min(product.stock, existing.quantity + quantity);
    } else {
      cart.push({
        productId: product.id,
        product,
        quantity: Math.min(product.stock, quantity)
      });
    }
    this.saveCart(cart);
    return cart;
  }

  static updateCartQuantity(productId: string, quantity: number): import('../types').CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(i => i.productId !== productId);
    } else {
      const item = cart.find(i => i.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    this.saveCart(cart);
    return cart;
  }

  static clearCart(): void {
    this.saveCart([]);
  }

  // SELECTED ZONE
  static getSelectedZone(): DeliveryZone | null {
    const zones = this.getZones();
    const saved = safeGet<DeliveryZone | null>('Izhaan_selected_zone_v1', null);
    if (saved) return saved;
    return zones[0] || null;
  }

  static saveSelectedZone(zone: DeliveryZone | null): void {
    safeSet('Izhaan_selected_zone_v1', zone);
  }

  // REACTIVE LISTENER
  static subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener('Izhaan_storage_update', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('Izhaan_storage_update', handler);
      window.removeEventListener('storage', handler);
    };
  }

  // ORDERS
  static getOrders(): Order[] {
    return safeGet<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_SAMPLE_ORDERS);
  }

  static getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id || o.orderNumber === id);
  }

  static createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>): Order {
    const orders = this.getOrders();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `DN-${randomNum}`;
    const id = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const timeline: Order['timeline'] = [
      {
        status: 'PLACED',
        timestamp: now,
        title: 'Order Placed',
        note: `Order received. Payment: ${orderData.paymentMethod} ($${orderData.totalAmount})`,
        completed: true
      },
      {
        status: 'CONFIRMED',
        timestamp: new Date(Date.now() + 60000).toISOString(),
        title: 'Confirmed by Store',
        note: 'Order confirmed and inventory booked.',
        completed: true
      },
      {
        status: 'PACKED',
        timestamp: '',
        title: 'Packed & Sealed',
        note: 'Fresh packing in eco-carry bag.',
        completed: false
      },
      {
        status: 'OUT_FOR_DELIVERY',
        timestamp: '',
        title: 'Out for Delivery',
        note: 'Rider dispatched to doorstep.',
        completed: false
      },
      {
        status: 'DELIVERED',
        timestamp: '',
        title: 'Delivered',
        note: 'Handed over to customer.',
        completed: false
      }
    ];

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      timeline,
      status: 'CONFIRMED'
    };

    // Deduct stock
    const products = this.getProducts();
    newOrder.items.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });
    safeSet(STORAGE_KEYS.PRODUCTS, products);

    // Save order
    orders.unshift(newOrder);
    safeSet(STORAGE_KEYS.ORDERS, orders);

    // Award loyalty points (1 pt per $10)
    const user = this.getCurrentUser();
    const earnedPoints = Math.floor(newOrder.totalAmount / 10);
    user.loyaltyPoints += earnedPoints;
    this.saveUser(user);

    // Log simulated notification
    this.logNotification({
      recipientPhone: newOrder.customerPhone,
      channel: 'WHATSAPP',
      title: `Order Placed: ${newOrder.orderNumber}`,
      body: `Hi ${newOrder.customerName}, your DailyNest order ${newOrder.orderNumber} for $${newOrder.totalAmount} is confirmed! Estimated delivery: ${newOrder.slot.timeWindow}. Track live in app.`,
      orderId: newOrder.id
    });

    return newOrder;
  }

  static updateOrderStatus(orderId: string, status: OrderStatus, note?: string, driverId?: string): Order | undefined {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return undefined;

    const now = new Date().toISOString();
    order.status = status;
    order.updatedAt = now;

    if (driverId) {
      const driver = this.getDrivers().find(d => d.id === driverId);
      if (driver) {
        order.deliveryPartnerId = driver.id;
        order.deliveryPartnerName = driver.name;
        order.deliveryPartnerPhone = driver.phone;
      }
    }

    if (status === 'OUT_FOR_DELIVERY') {
      order.deliveryEta = '15-25 mins away';
      order.liveLocation = {
        lat: order.zone.centerCoordinates.lat + (Math.random() - 0.5) * 0.01,
        lng: order.zone.centerCoordinates.lng + (Math.random() - 0.5) * 0.01
      };
    }

    if (status === 'DELIVERED') {
      order.paymentStatus = 'PAID';
      order.deliveryEta = 'Delivered';
    }

    // Update timeline step
    const stepIdx = order.timeline.findIndex(t => t.status === status);
    if (stepIdx >= 0) {
      order.timeline[stepIdx].completed = true;
      order.timeline[stepIdx].timestamp = now;
      if (note) order.timeline[stepIdx].note = note;
    } else {
      order.timeline.push({
        status,
        timestamp: now,
        title: status.replace(/_/g, ' '),
        note: note || `Status updated to ${status}`,
        completed: true
      });
    }

    // Mark previous steps as completed
    const orderFlow: OrderStatus[] = ['PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentStatusIdx = orderFlow.indexOf(status);
    if (currentStatusIdx > 0) {
      for (let i = 0; i <= currentStatusIdx; i++) {
        const s = orderFlow[i];
        const step = order.timeline.find(t => t.status === s);
        if (step) {
          step.completed = true;
          if (!step.timestamp) step.timestamp = now;
        }
      }
    }

    safeSet(STORAGE_KEYS.ORDERS, orders);

    // Send Simulated notification
    this.logNotification({
      recipientPhone: order.customerPhone,
      channel: 'SMS',
      title: `Order ${order.orderNumber} ${status.replace(/_/g, ' ')}`,
      body: `Your DailyNest order ${order.orderNumber} is now ${status.replace(/_/g, ' ')}. ${note || ''}`,
      orderId: order.id
    });

    return order;
  }

  // NOTIFICATIONS
  static getNotifications(): NotificationLog[] {
    return safeGet<NotificationLog[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        recipientPhone: '+1 (555) 678-9900',
        channel: 'WHATSAPP',
        title: 'Order Confirmed',
        body: 'Your order DN-8924 for $452 has been confirmed by Izhaan Mart!',
        timestamp: '2026-08-16T05:22:00.000Z',
        orderId: 'ord-10024'
      }
    ]);
  }

  static logNotification(notif: Omit<NotificationLog, 'id' | 'timestamp'>): void {
    const list = this.getNotifications();
    const item: NotificationLog = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    list.unshift(item);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, list.slice(0, 50));
  }

  static markAllNotificationsRead(): void {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    safeSet(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // REVIEWS
  static getReviews(): Review[] {
    return safeGet<Review[]>(STORAGE_KEYS.REVIEWS, [
      {
        id: 'rev-1',
        productId: 'prod-1',
        userId: 'usr-customer-1',
        userName: 'Alex M.',
        rating: 5,
        comment: 'The Sharbati Atta is super soft! Rotis stayed fresh till dinner. Delivered in 25 mins.',
        date: '2026-08-10',
        isApproved: true,
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        productId: 'prod-2',
        userId: 'usr-customer-2',
        userName: 'Elena Rostova',
        rating: 5,
        comment: 'Best fresh milk in our neighborhood! Thick cream layer on boiling. Always arrives cold.',
        date: '2026-08-12',
        isApproved: true,
        verifiedPurchase: true
      }
    ]);
  }

  static addReview(review: Omit<Review, 'id' | 'date' | 'isApproved'>): void {
    const reviews = this.getReviews();
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isApproved: true
    };
    reviews.unshift(newRev);
    safeSet(STORAGE_KEYS.REVIEWS, reviews);

    // Update product rating
    const prodReviews = reviews.filter(r => r.productId === review.productId && r.isApproved);
    const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const products = this.getProducts();
    const prod = products.find(p => p.id === review.productId);
    if (prod) {
      prod.rating = Math.round(avgRating * 10) / 10;
      prod.reviewCount = prodReviews.length;
      safeSet(STORAGE_KEYS.PRODUCTS, products);
    }
  }

  // ANALYTICS KPIS
  static getAnalytics(): AdminAnalyticsKPIs {
    const orders = this.getOrders();
    const products = this.getProducts();
    const zones = this.getZones();

    const validOrders = orders.filter(o => o.status !== 'CANCELLED');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
    const outOfStockCount = products.filter(p => p.stock <= 0).length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
    const pendingDeliveriesCount = orders.filter(o => ['PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY'].includes(o.status)).length;
    const deliveredOrdersCount = orders.filter(o => o.status === 'DELIVERED').length;

    // Category breakdown
    const catMap: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const catName = prod?.categoryName || 'General';
        catMap[catName] = (catMap[catName] || 0) + item.price * item.quantity;
      });
    });

    const categorySales = Object.entries(catMap).map(([categoryName, revenue]) => ({
      categoryName,
      revenue,
      percentage: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0
    }));

    // Zone breakdown
    const zoneMap: Record<string, { count: number; revenue: number }> = {};
    zones.forEach(z => {
      zoneMap[z.name] = { count: 0, revenue: 0 };
    });
    orders.forEach(o => {
      const zName = o.zone?.name || 'General';
      if (!zoneMap[zName]) zoneMap[zName] = { count: 0, revenue: 0 };
      zoneMap[zName].count += 1;
      zoneMap[zName].revenue += o.totalAmount;
    });

    const zonePerformance = Object.entries(zoneMap).map(([zoneName, data]) => ({
      zoneName,
      orderCount: data.count,
      revenue: data.revenue
    }));

    // Recent daily sales (mocked last 7 days + actuals)
    const recentDailySales = [
      { date: 'Aug 10', revenue: 1420, orders: 8 },
      { date: 'Aug 11', revenue: 1890, orders: 11 },
      { date: 'Aug 12', revenue: 2150, orders: 13 },
      { date: 'Aug 13', revenue: 1650, orders: 9 },
      { date: 'Aug 14', revenue: 2490, orders: 15 },
      { date: 'Aug 15', revenue: 3100, orders: 18 },
      { date: 'Today', revenue: totalRevenue, orders: totalOrders }
    ];

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      activeCustomers: 84,
      outOfStockCount,
      lowStockCount,
      pendingDeliveriesCount,
      deliveredOrdersCount,
      categorySales,
      zonePerformance,
      recentDailySales
    };
  }

  // UTILITY: Client-Side Image Compression Simulation
  static compressImage(file: File): Promise<{ dataUrl: string; originalSizeKb: number; compressedSizeKb: number }> {
    return new Promise((resolve, reject) => {
      const originalSizeKb = Math.round(file.size / 1024);
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ dataUrl: e.target?.result as string, originalSizeKb, compressedSizeKb: originalSizeKb });
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          const compressedSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
          resolve({ dataUrl, originalSizeKb, compressedSizeKb });
        };
        img.onerror = () => reject(new Error('Failed to load image for compression'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // Export CSV
  static exportProductsToCSV(): string {
    const products = this.getProducts();
    const headers = ['id', 'sku', 'name', 'category', 'unit', 'mrp', 'salePrice', 'discountPercent', 'stock', 'isActive', 'tags'];
    const rows = products.map(p => [
      p.id,
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.categoryName}"`,
      `"${p.unit}"`,
      p.mrp,
      p.salePrice,
      p.discountPercent,
      p.stock,
      p.isActive ? 'true' : 'false',
      `"${p.tags.join(',')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  static exportOrdersToCSV(): string {
    const orders = this.getOrders();
    const headers = ['orderNumber', 'date', 'customerName', 'customerPhone', 'zone', 'pincode', 'status', 'paymentMethod', 'paymentStatus', 'itemCount', 'totalAmount'];
    const rows = orders.map(o => [
      o.orderNumber,
      o.createdAt.split('T')[0],
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.zone?.name || ''}"`,
      `"${o.address?.pincode || ''}"`,
      o.status,
      o.paymentMethod,
      o.paymentStatus,
      o.items.reduce((s, i) => s + i.quantity, 0),
      o.totalAmount
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
