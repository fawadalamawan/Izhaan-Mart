import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Truck,
  Sparkles,
  ShoppingBag,
  QrCode,
  Tag,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, DeliveryZone, DeliverySlot, Address, PaymentMethod, Order, Coupon, User } from '../../types';
import { StorageService } from '../../services/storageService';

interface CheckoutViewProps {
  items: CartItem[];
  user: User;
  selectedZone: DeliveryZone | null;
  onOpenZonePicker: () => void;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  onBackToShopping: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  user,
  selectedZone,
  onOpenZonePicker,
  appliedCoupon,
  couponDiscount,
  onBackToShopping,
  onOrderPlaced
}) => {
  const slots = StorageService.getSlots();
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.addresses.length > 0 ? user.addresses[0].id : ''
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string>(slots[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(user.addresses.length === 0);

  // New address form state
  const [newRecipientName, setNewRecipientName] = useState(user.name);
  const [newRecipientPhone, setNewRecipientPhone] = useState(user.phone);
  const [newStreetAddress, setNewStreetAddress] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState(selectedZone ? selectedZone.pincodes[0] : '10001');
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const totalMrp = items.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const catalogSavings = Math.max(0, totalMrp - subtotal);
  
  const isFreeDelivery = selectedZone ? subtotal >= selectedZone.minOrderForFreeDelivery : false;
  const deliveryFee = selectedZone ? (isFreeDelivery ? 0 : selectedZone.deliveryFee) : 20;
  const grandTotal = Math.max(0, subtotal + (isFreeDelivery ? 0 : deliveryFee) - couponDiscount);
  const totalSavings = catalogSavings + couponDiscount + (isFreeDelivery ? (selectedZone?.deliveryFee || 20) : 0);

  const activeAddress = user.addresses.find(a => a.id === selectedAddressId) || user.addresses[0];
  const activeSlot = slots.find(s => s.id === selectedSlotId) || slots[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreetAddress.trim() || !newPincode.trim()) return;

    // Check pincode against zone
    const matchedZone = StorageService.findZoneByPincode(newPincode);
    const zoneId = matchedZone ? matchedZone.id : (selectedZone?.id || 'zone-north');
    const zoneName = matchedZone ? matchedZone.name : (selectedZone?.name || 'Zone A');

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      userId: user.id,
      label: newLabel,
      streetAddress: newStreetAddress.trim(),
      apartmentFloor: newApartment.trim(),
      landmark: newLandmark.trim(),
      pincode: newPincode.trim(),
      zoneId,
      zoneName,
      isDefault: user.addresses.length === 0,
      recipientName: newRecipientName.trim() || user.name,
      recipientPhone: newRecipientPhone.trim() || user.phone,
      coordinates: {
        lat: matchedZone ? matchedZone.centerCoordinates.lat : 12.98,
        lng: matchedZone ? matchedZone.centerCoordinates.lng : 77.59
      }
    };

    const updatedUser = { ...user, addresses: [newAddr, ...user.addresses] };
    StorageService.saveUser(updatedUser);
    setSelectedAddressId(newAddr.id);
    setShowNewAddressForm(false);
  };

  const handlePlaceOrder = () => {
    if (!activeAddress) {
      alert('Please select or add a delivery address.');
      return;
    }

    if (!selectedZone) {
      alert('Please select a verified delivery zone.');
      return;
    }

    // Verify address pincode belongs to our service zones
    const zoneForPin = StorageService.findZoneByPincode(activeAddress.pincode);
    if (!zoneForPin) {
      alert(`The pincode ${activeAddress.pincode} is outside our ~100 km² service boundary. Please select a valid service zone address.`);
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway validation
    setTimeout(() => {
      setIsProcessing(false);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }

      // Construct Order
      const newOrder = StorageService.createOrder({
        userId: user.id,
        customerName: activeAddress.recipientName,
        customerPhone: activeAddress.recipientPhone,
        items: items.map(i => ({
          productId: i.productId,
          name: i.product.name,
          unit: i.product.unit,
          price: i.product.salePrice,
          mrp: i.product.mrp,
          quantity: i.quantity,
          image: i.product.images[0]
        })),
        subtotal,
        deliveryFee: isFreeDelivery ? 0 : deliveryFee,
        discountAmount: couponDiscount,
        couponCode: appliedCoupon?.code,
        totalAmount: grandTotal,
        savedAmount: totalSavings,
        address: activeAddress,
        zone: zoneForPin || selectedZone,
        slot: activeSlot,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        status: 'CONFIRMED'
      });

      onOrderPlaced(newOrder);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 pt-2">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToShopping}
          className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Checkout & Neighborhood Delivery
          </h1>
          <p className="text-xs text-slate-500">
            Guaranteed doorstep delivery within our 100 sq km perimeter
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* STEP 1: Delivery Address with Zone Validation */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Select Delivery Address
                </h3>
              </div>

              {!showNewAddressForm && (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              )}
            </div>

            {/* Saved Addresses Radio List */}
            {!showNewAddressForm && user.addresses.length > 0 && (
              <div className="space-y-2.5">
                {user.addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  const isServiceable = StorageService.findZoneByPincode(addr.pincode) !== null;

                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                              {addr.label}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{addr.recipientName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">({addr.recipientPhone})</span>
                          </div>
                          
                          <p className="text-xs text-slate-700 leading-snug">
                            {addr.streetAddress}, {addr.apartmentFloor && `${addr.apartmentFloor}, `}Landmark: {addr.landmark}
                          </p>

                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="font-mono font-bold text-slate-800">PIN: {addr.pincode}</span>
                            <span>·</span>
                            <span className="text-emerald-700 font-medium">{addr.zoneName}</span>
                          </div>

                          {!isServiceable && (
                            <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3 h-3" /> Pincode outside active 100 km² service zone
                            </span>
                          )}
                        </div>

                        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 border-emerald-600">
                          {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
              <form onSubmit={handleAddNewAddress} className="space-y-3 pt-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Add New Neighborhood Address</span>
                  {user.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newRecipientName}
                    onChange={(e) => setNewRecipientName(e.target.value)}
                    placeholder="Recipient Full Name"
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                  <input
                    type="tel"
                    required
                    value={newRecipientPhone}
                    onChange={(e) => setNewRecipientPhone(e.target.value)}
                    placeholder="Mobile Number (for delivery SMS)"
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium font-mono"
                  />
                </div>

                <input
                  type="text"
                  required
                  value={newStreetAddress}
                  onChange={(e) => setNewStreetAddress(e.target.value)}
                  placeholder="House/Flat No., Building/Society Name, Street"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newApartment}
                    onChange={(e) => setNewApartment(e.target.value)}
                    placeholder="Floor / Wing (Optional)"
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                  <input
                    type="text"
                    required
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    placeholder="Nearby Landmark"
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    placeholder="Pincode (e.g. 10001)"
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2">
                    {(['Home', 'Work', 'Other'] as const).map(l => (
                      <button
                        type="button"
                        key={l}
                        onClick={() => setNewLabel(l)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          newLabel === l ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* STEP 2: Delivery Slot Picker */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Select Delivery Slot
                </h3>
                <p className="text-[11px] text-slate-500">Pick your preferred arrival window</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-900">{slot.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">{slot.dateLabel} · {slot.timeWindow}</div>
                    </div>

                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 border-emerald-600">
                      {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Payment Method
                </h3>
                <p className="text-[11px] text-slate-500">100% secure encrypted payment</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* Instant UPI */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Instant UPI / QR / Google Pay</span>
                      <span className="bg-purple-100 text-purple-800 text-[9px] font-black px-1.5 py-0.2 rounded">Fastest</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Zero transaction fees · Instant receipt</p>
                  </div>
                </div>

                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 border-emerald-600">
                  {paymentMethod === 'UPI' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                </div>
              </div>

              {/* Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Cash on Doorstep Delivery (COD)</span>
                    <p className="text-[11px] text-slate-500">Pay cash or scan rider QR upon delivery</p>
                  </div>
                </div>

                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 border-emerald-600">
                  {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                </div>
              </div>

              {/* Cards / Netbanking */}
              <div
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  paymentMethod === 'CARD'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Credit / Debit Card (Stripe Gateway)</span>
                    <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay & Amex supported</p>
                  </div>
                </div>

                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 border-emerald-600">
                  {paymentMethod === 'CARD' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Order Summary & Place CTA */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 sticky top-20">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            {/* Mini Items Scroll */}
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
              {items.map((item) => (
                <div key={item.productId} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.quantity} × ${item.product.salePrice}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    ${(item.quantity * item.product.salePrice).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {catalogSavings > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Store Discount</span>
                  <span className="font-mono">-${catalogSavings.toFixed(2)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span className="font-mono">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Neighborhood Delivery</span>
                <span className="font-mono font-bold">
                  {isFreeDelivery ? (
                    <span className="text-emerald-600 uppercase font-black text-[11px]">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-2.5 flex justify-between items-baseline text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl font-mono text-emerald-700">${grandTotal.toFixed(2)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-2 rounded-xl text-center border border-emerald-200">
                  🎉 Total Savings on this order: <span className="font-mono">${totalSavings.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 px-4 rounded-2xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Securing Order & Reserving Stock...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Order · ${grandTotal.toFixed(2)}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant SMS + WhatsApp dispatch alert</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
