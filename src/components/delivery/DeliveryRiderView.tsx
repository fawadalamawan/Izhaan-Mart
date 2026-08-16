import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle,
  Navigation,
  Clock,
  Package,
  AlertCircle,
  ShieldCheck,
  Check,
  ChevronRight
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { StorageService } from '../../services/storageService';

interface DeliveryRiderViewProps {
  orders: Order[];
  onRefreshData: () => void;
}

export const DeliveryRiderView: React.FC<DeliveryRiderViewProps> = ({
  orders,
  onRefreshData
}) => {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter orders that are ready or assigned to rider
  const activeDispatches = orders.filter(
    o => o.status === 'PACKED' || o.status === 'OUT_FOR_DELIVERY' || o.status === 'CONFIRMED'
  );
  const completedToday = orders.filter(o => o.status === 'DELIVERED');

  const handleUpdateStage = (orderId: string, newStatus: OrderStatus) => {
    StorageService.updateOrderStatus(
      orderId,
      newStatus,
      newStatus === 'DELIVERED' ? (deliveryNote || 'Delivered safely at doorstep.') : undefined,
      'driver-1'
    );
    setSuccessMsg(`Order marked as ${newStatus.replace(/_/g, ' ')}!`);
    setDeliveryNote('');
    setActiveOrderId(null);
    onRefreshData();
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24 pt-2">
      
      {/* Rider Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-100 uppercase tracking-wider mb-0.5">
            <Truck className="w-4 h-4" /> Delivery Rider Portal
          </div>
          <h2 className="text-xl font-bold font-display">Rahul V. (Electric Bike #04)</h2>
          <p className="text-xs text-amber-100">100 sq km Neighborhood Service Fleet</p>
        </div>
        <div className="bg-white/20 px-3.5 py-2 rounded-2xl text-center backdrop-blur-xs">
          <span className="text-[10px] block font-semibold text-amber-100">Done Today</span>
          <span className="font-mono font-black text-lg">{completedToday.length}</span>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold p-3 rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
          Active Trip Manifest ({activeDispatches.length})
        </h3>
        <span className="text-xs text-slate-500 font-mono">Optimized Multi-Stop Route</span>
      </div>

      {activeDispatches.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
          <h4 className="font-bold text-base text-slate-800">All trips completed for this slot!</h4>
          <p className="text-xs text-slate-500">Wait at the DailyNest Hub for next packing batch.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeDispatches.map((order, idx) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4"
            >
              {/* Trip header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{order.customerName}</span>
                </div>

                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                  order.status === 'OUT_FOR_DELIVERY' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Destination & Contact */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{order.address.streetAddress}</p>
                    <p className="text-slate-600">{order.address.apartmentFloor} · Landmark: {order.address.landmark}</p>
                    <p className="text-emerald-800 font-bold font-mono text-[11px]">Zone: {order.zone.name} (PIN: {order.address.pincode})</p>
                  </div>
                </div>

                {/* Amount to collect */}
                <div className="flex items-center justify-between px-2 text-xs">
                  <span className="text-slate-500">Amount to collect:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${order.totalAmount.toFixed(2)} ({order.paymentMethod === 'COD' ? '💵 Cash / QR on Delivery' : '✓ Prepaid Online'})
                  </span>
                </div>
              </div>

              {/* Actions: Call, Navigate, Deliver */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  Call Customer
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${order.address.streetAddress} ${order.address.pincode}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  GPS Navigation
                </a>
              </div>

              {/* Step updates */}
              <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2">
                {order.status === 'PACKED' && (
                  <button
                    onClick={() => handleUpdateStage(order.id, 'OUT_FOR_DELIVERY')}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" /> Picked Up & Start Delivery
                  </button>
                )}

                {order.status === 'OUT_FOR_DELIVERY' && (
                  <div className="w-full space-y-2">
                    <input
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="Optional handover note (e.g. Left with guard / handed to resident)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium"
                    />
                    <button
                      onClick={() => handleUpdateStage(order.id, 'DELIVERED')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirm Successful Doorstep Handover
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
