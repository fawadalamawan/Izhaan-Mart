/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ZonePickerModal } from './components/common/ZonePickerModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ArchitectureDocsModal } from './components/common/ArchitectureDocsModal';

import { StorefrontView } from './components/customer/StorefrontView';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutView } from './components/customer/CheckoutView';
import { OrderHistoryView } from './components/customer/OrderHistoryView';
import { OrderTrackingModal } from './components/customer/OrderTrackingModal';
import { AuthModal } from './components/customer/AuthModal';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { DeliveryRiderView } from './components/delivery/DeliveryRiderView';

import { StorageService } from './services/storageService';
import {
  Product,
  Category,
  Order,
  DeliveryZone,
  StoreSettings,
  CartItem,
  User,
  Coupon,
  NotificationLog,
  DeliveryPerson,
  UserRole
} from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(StorageService.getSettings());
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(StorageService.getUser());
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [drivers, setDrivers] = useState<DeliveryPerson[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [currentTab, setCurrentTab] = useState<'home' | 'orders' | 'categories' | 'wishlist'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isZonePickerOpen, setIsZonePickerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isCheckoutActive, setIsCheckoutActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const reloadData = () => {
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setOrders(StorageService.getOrders());
    setZones(StorageService.getZones());
    setSettings(StorageService.getSettings());
    setCartItems(StorageService.getCart());
    setCurrentUser(StorageService.getUser());
    setSelectedZone(StorageService.getSelectedZone());
    setNotifications(StorageService.getNotifications());
    setDrivers(StorageService.getDrivers());
  };

  useEffect(() => {
    reloadData();
    const unsubscribe = StorageService.subscribe(() => reloadData());
    return () => unsubscribe();
  }, []);

  const cartItemsMap = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((i) => { map[i.productId] = i.quantity; });
    return map;
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.product.salePrice * i.quantity, 0);

  const handleAddToCart = (product: Product) => {
    StorageService.addToCart(product, 1);
    reloadData();
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    StorageService.updateCartQuantity(productId, quantity);
    reloadData();
  };

  const handleClearCart = () => {
    StorageService.clearCart();
    setAppliedCoupon(null);
    setCouponDiscount(0);
    reloadData();
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handleApplyCoupon = (code: string): { success: boolean; message: string } => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
    const result = StorageService.validateCoupon(code, subtotal);
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponDiscount(result.discount);
      return { success: true, message: `Coupon "${code}" applied! You saved $${result.discount.toFixed(2)}.` };
    }
    return { success: false, message: result.message };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const handleReorder = (pastOrder: Order) => {
    pastOrder.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && prod.stock > 0) StorageService.addToCart(prod, item.quantity);
    });
    reloadData();
    setIsCartOpen(true);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    handleClearCart();
    setTrackingOrder(newOrder);
    setCurrentTab('orders');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'CUSTOMER') setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header
        activeRole={currentRole}
        onRoleChange={handleRoleChange}
        selectedZone={selectedZone}
        onOpenZonePicker={() => setIsZonePickerOpen(true)}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setCurrentTab('wishlist')}
        onOpenOrders={() => setCurrentTab('orders')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        settings={settings}
        unreadNotifsCount={notifications.filter((n) => !n.read).length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {currentRole === 'CUSTOMER' && (
          <>
            {isCheckoutActive ? (
              <CheckoutView
                items={cartItems}
                user={currentUser}
                selectedZone={selectedZone}
                onOpenZonePicker={() => setIsZonePickerOpen(true)}
                appliedCoupon={appliedCoupon}
                couponDiscount={couponDiscount}
                onBackToShopping={() => setIsCheckoutActive(false)}
                onOrderPlaced={(order) => {
                  setIsCheckoutActive(false);
                  handleOrderPlaced(order);
                }}
              />
            ) : (
              <>
                {(currentTab === 'home' || currentTab === 'categories') && (
                  <StorefrontView
                    products={products}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    selectedZone={selectedZone}
                    onOpenZonePicker={() => setIsZonePickerOpen(true)}
                    cartItemsMap={cartItemsMap}
                    onAddToCart={handleAddToCart}
                    onUpdateCartQuantity={handleUpdateCartQuantity}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenProductDetail={(prod) => setSelectedProduct(prod)}
                    onOpenCheckout={() => {
                      setIsCartOpen(false);
                      setIsCheckoutActive(true);
                    }}
                    searchQuery={searchQuery}
                  />
                )}

                {currentTab === 'orders' && (
                  <OrderHistoryView
                    orders={orders}
                    onOpenOrderTracking={(ord) => setTrackingOrder(ord)}
                    onReorder={handleReorder}
                    onBackToShopping={() => setCurrentTab('home')}
                  />
                )}

                {currentTab === 'wishlist' && (
                  <div className="py-8 text-center text-slate-500 text-sm">
                    {wishlistIds.size === 0 ? (
                      <p>No saved items yet. Tap the heart on products to save them.</p>
                    ) : (
                      <StorefrontView
                        products={products.filter((p) => wishlistIds.has(p.id))}
                        categories={categories}
                        selectedCategory={null}
                        onSelectCategory={() => {}}
                        selectedZone={selectedZone}
                        onOpenZonePicker={() => setIsZonePickerOpen(true)}
                        cartItemsMap={cartItemsMap}
                        onAddToCart={handleAddToCart}
                        onUpdateCartQuantity={handleUpdateCartQuantity}
                        wishlistIds={wishlistIds}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenProductDetail={(prod) => setSelectedProduct(prod)}
                        onOpenCheckout={() => setIsCheckoutActive(true)}
                        searchQuery=""
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {currentRole === 'ADMIN' && (
          <AdminDashboard
            products={products}
            categories={categories}
            orders={orders}
            zones={zones}
            settings={settings}
            drivers={drivers}
            onRefreshData={reloadData}
            onOpenDocs={() => setIsDocsOpen(true)}
          />
        )}

        {currentRole === 'DELIVERY' && (
          <DeliveryRiderView orders={orders} onRefreshData={reloadData} />
        )}
      </main>

      <BottomNav
        activeTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'orders') setCurrentTab('orders');
          else if (tab === 'wishlist') setCurrentTab('wishlist');
          else setCurrentTab('home');
        }}
        cartCount={cartCount}
        wishlistCount={wishlistIds.size}
        activeRole={currentRole}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        selectedZone={selectedZone}
        onOpenZonePicker={() => setIsZonePickerOpen(true)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentRole('CUSTOMER');
          setCurrentTab('home');
          setIsCheckoutActive(true);
        }}
        appliedCoupon={appliedCoupon}
        couponDiscount={couponDiscount}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        cartQty={selectedProduct ? cartItemsMap[selectedProduct.id] || 0 : 0}
        onAddToCart={handleAddToCart}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onSelectRelatedProduct={(p) => setSelectedProduct(p)}
      />

      <OrderTrackingModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
        onReorder={handleReorder}
      />

      <ZonePickerModal
        isOpen={isZonePickerOpen}
        onClose={() => setIsZonePickerOpen(false)}
        zones={zones}
        selectedZone={selectedZone}
        onSelectZone={(zone) => {
          StorageService.saveSelectedZone(zone);
          setSelectedZone(zone);
          setIsZonePickerOpen(false);
        }}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          reloadData();
        }}
      />

      <ArchitectureDocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}