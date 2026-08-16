/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  DeliveryPerson
} from './types';

export default function App() {
  // Global domain state initialized from StorageService
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

  // Navigation & Role states
  const [currentRole, setCurrentRole] = useState<'CUSTOMER' | 'ADMIN' | 'DELIVERY_PERSON'>('CUSTOMER');
  const [currentTab, setCurrentTab] = useState<'SHOP' | 'ORDERS' | 'PROFILE' | 'ADMIN' | 'DRIVER'>('SHOP');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Modals & Drawers state
  const [isZonePickerOpen, setIsZonePickerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isCheckoutActive, setIsCheckoutActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Coupons & Pricing
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Load all initial state & subscribe to changes
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
    const unsubscribe = StorageService.subscribe(() => {
      reloadData();
    });
    return () => unsubscribe();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    StorageService.addToCart(product, quantity);
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

  // Coupon Engine
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

  // Reorder flow
  const handleReorder = (pastOrder: Order) => {
    pastOrder.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod && prod.stock > 0) {
        StorageService.addToCart(prod, item.quantity);
      }
    });
    reloadData();
    setIsCartOpen(true);
  };

  // Checkout complete
  const handleOrderPlaced = (newOrder: Order) => {
    handleClearCart();
    setTrackingOrder(newOrder);
    setCurrentTab('ORDERS');
  };

  // Role switch handler
  const handleRoleChange = (role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_PERSON') => {
    setCurrentRole(role);
    if (role === 'ADMIN') {
      setCurrentTab('ADMIN');
    } else if (role === 'DELIVERY_PERSON') {
      setCurrentTab('DRIVER');
    } else {
      setCurrentTab('SHOP');
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Header */}
      <Header
        storeName={settings.storeName}
        tagline={settings.tagline}
        selectedZone={selectedZone}
        onOpenZonePicker={() => setIsZonePickerOpen(true)}
        cartItemCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        unreadNotificationCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        broadcastBanner={settings.broadcastBanner}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4">
        
        {/* CUSTOMER VIEWS */}
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
                {currentTab === 'SHOP' && (
                  <StorefrontView
                    products={products}
                    categories={categories}
                    searchQuery={searchQuery}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                    cartItems={cartItems}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateCartQuantity}
                    onProductClick={(prod) => setSelectedProduct(prod)}
                    onOpenCart={() => setIsCartOpen(true)}
                    selectedZone={selectedZone}
                    onOpenZonePicker={() => setIsZonePickerOpen(true)}
                  />
                )}

                {currentTab === 'ORDERS' && (
                  <OrderHistoryView
                    orders={orders}
                    onOpenOrderTracking={(ord) => setTrackingOrder(ord)}
                    onReorder={handleReorder}
                    onBackToShopping={() => setCurrentTab('SHOP')}
                  />
                )}

                {currentTab === 'PROFILE' && (
                  <div className="py-4">
                    <AuthModal
                      isOpen={true}
                      onClose={() => setCurrentTab('SHOP')}
                      currentUser={currentUser}
                      onUpdateUser={(updated) => {
                        setCurrentUser(updated);
                        reloadData();
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* STORE OWNER ADMIN DASHBOARD */}
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

        {/* DELIVERY RIDER VIEW */}
        {currentRole === 'DELIVERY_PERSON' && (
          <DeliveryRiderView
            orders={orders}
            onRefreshData={reloadData}
          />
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'PROFILE') {
            setIsAuthOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        cartItemCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentRole={currentRole}
      />

      {/* Cart Drawer */}
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
          setCurrentTab('SHOP');
          setIsCheckoutActive(true);
        }}
        appliedCoupon={appliedCoupon}
        couponDiscount={couponDiscount}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        cartQuantity={
          selectedProduct
            ? cartItems.find(i => i.productId === selectedProduct.id)?.quantity || 0
            : 0
        }
        onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onOpenCart={() => setIsCartOpen(true)}
        selectedZone={selectedZone}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
        onReorder={handleReorder}
      />

      {/* Neighborhood Zone Picker Modal */}
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

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          StorageService.markAllNotificationsRead();
          reloadData();
        }}
      />

      {/* Customer Auth & Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          reloadData();
        }}
      />

      {/* System Architecture, PostgreSQL DDL & Docker Docs */}
      <ArchitectureDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

    </div>
  );
}
