import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  AlertCircle,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { CartItem, DeliveryZone, Coupon } from '../../types';
import { StorageService } from '../../services/storageService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onClearCart: () => void;
  selectedZone: DeliveryZone | null;
  onOpenZonePicker: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  selectedZone,
  onOpenZonePicker,
  onProceedToCheckout,
  appliedCoupon,
  couponDiscount,
  onApplyCoupon,
  onRemoveCoupon
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const totalMrp = items.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const itemSavings = Math.max(0, totalMrp - subtotal);

  // Delivery fee logic based on selected zone & free delivery threshold
  const isFreeDelivery = selectedZone ? subtotal >= selectedZone.minOrderForFreeDelivery : false;
  const deliveryFee = selectedZone ? (isFreeDelivery ? 0 : selectedZone.deliveryFee) : 20;
  
  // Progress towards free delivery
  const freeDeliveryThreshold = selectedZone ? selectedZone.minOrderForFreeDelivery : 299;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const totalPayable = Math.max(0, subtotal + (isFreeDelivery ? 0 : deliveryFee) - couponDiscount);

  const handleApplyCoupon = (codeToApply: string) => {
    const res = onApplyCoupon(codeToApply);
    setCouponMessage({
      text: res.message,
      isError: !res.success
    });
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-display">Your Basket</h3>
              <p className="text-xs text-slate-500">{items.reduce((s, i) => s + i.quantity, 0)} household items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Goal Bar */}
        {selectedZone && (
          <div className="bg-emerald-50/90 border-b border-emerald-100 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                {amountNeededForFree > 0 ? (
                  <span>Add <span className="font-mono">${amountNeededForFree.toFixed(2)}</span> more for FREE Delivery</span>
                ) : (
                  <span className="text-emerald-700 font-extrabold">🎉 You unlocked FREE Neighborhood Delivery!</span>
                )}
              </div>
              <span className="font-mono text-[11px] text-emerald-700">{freeDeliveryProgress}%</span>
            </div>
            
            <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-800">Your basket is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore daily staples, fresh dairy, and home cleaners for 30-min delivery.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                  <div className="text-[11px] text-slate-500 font-mono">{item.product.unit}</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xs font-black text-slate-900 font-mono">${item.product.salePrice}</span>
                    {item.product.mrp > item.product.salePrice && (
                      <span className="text-[10px] text-slate-400 line-through font-mono">${item.product.mrp}</span>
                    )}
                  </div>
                </div>

                {/* Qty Stepper */}
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 hover:bg-white rounded-lg text-slate-600 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                  <button
                    disabled={item.quantity >= item.product.stock}
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 hover:bg-white rounded-lg text-slate-600 transition disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onUpdateQuantity(item.productId, 0)}
                  className="p-1.5 text-slate-300 hover:text-rose-600 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Price Breakdown */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3.5">
            
            {/* Coupon Code Section */}
            <div className="space-y-1.5">
              {appliedCoupon ? (
                <div className="bg-emerald-100/70 border border-emerald-300 text-emerald-900 px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-${couponDiscount.toFixed(2)})</span>
                  </div>
                  <button onClick={onRemoveCoupon} className="text-rose-600 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="Enter promo code (e.g. WELCOME50)"
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold uppercase focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleApplyCoupon(couponCodeInput)}
                      className="bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-slate-800 transition"
                    >
                      Apply
                    </button>
                  </div>
                  
                  {/* Quick coupon pill shortcuts */}
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    {['WELCOME50', 'FREESHIP', 'HOUSEHOLD15'].map(c => (
                      <button
                        key={c}
                        onClick={() => handleApplyCoupon(c)}
                        className="text-[10px] font-mono font-bold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-lg shrink-0 transition"
                      >
                        +{c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {couponMessage && (
                <p className={`text-[11px] font-semibold ${couponMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {itemSavings > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Product Catalog Discount</span>
                  <span className="font-mono">-${itemSavings.toFixed(2)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Promo Discount</span>
                  <span className="font-mono">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Delivery Fee
                  {selectedZone ? (
                    <span className="text-[10px] text-slate-400">({selectedZone.name.split(':')[0]})</span>
                  ) : null}
                </span>
                <span className="font-mono font-bold">
                  {isFreeDelivery ? (
                    <span className="text-emerald-600 uppercase font-black text-[11px]">Free</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline text-sm font-black text-slate-900">
                <span>To Pay</span>
                <span className="text-lg font-mono text-emerald-700">${totalPayable.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-between group active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1 font-mono">
                <span>${totalPayable.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
