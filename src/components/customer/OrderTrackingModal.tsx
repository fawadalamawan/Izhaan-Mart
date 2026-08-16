import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle,
  Truck,
  Package,
  AlertTriangle,
  RotateCcw,
  Navigation,
  FileText,
  ShieldCheck,
  Store
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { StorageService } from '../../services/storageService';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onReorder: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onReorder
}) => {
  const [returnReason, setReturnReason] = useState('');
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [simulatedEtaMinutes, setSimulatedEtaMinutes] = useState(18);

  useEffect(() => {
    if (order?.status === 'OUT_FOR_DELIVERY') {
      const interval = setInterval(() => {
        setSimulatedEtaMinutes(prev => Math.max(2, prev - 1));
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [order?.status]);

  if (!order) return null;

  const handleRequestReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason.trim()) return;

    StorageService.updateOrderStatus(
      order.id,
      'RETURN_REQUESTED',
      `Return requested by customer: "${returnReason.trim()}". Pickup will be scheduled.`
    );
    setReturnSuccess(true);
    setTimeout(() => {
      setShowReturnDialog(false);
      setReturnSuccess(false);
    }, 2500);
  };

  const isDelivered = order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';
  const isOutForDelivery = order.status === 'OUT_FOR_DELIVERY';

  const orderStages: { status: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    { status: 'PLACED', label: 'Order Placed', icon: <FileText className="w-4 h-4" />, desc: 'Order received & logged' },
    { status: 'CONFIRMED', label: 'Confirmed', icon: <Store className="w-4 h-4" />, desc: 'Inventory reserved at store' },
    { status: 'PACKED', label: 'Packed & Sealed', icon: <Package className="w-4 h-4" />, desc: 'Packed in insulated bag' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <Truck className="w-4 h-4" />, desc: 'Rider en route to your doorstep' },
    { status: 'DELIVERED', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" />, desc: 'Handed over at doorstep' }
  ];

  const currentStatusIdx = orderStages.findIndex(s => s.status === order.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-white/20 px-2 py-0.5 rounded-md">
                {order.orderNumber}
              </span>
              <span className="text-xs font-semibold text-emerald-200">
                {order.zone.name.split(':')[0]}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display mt-0.5">
              Live Order & Delivery Status
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Status & ETA Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Current Delivery Stage
              </span>
              <h3 className="text-base font-extrabold text-emerald-950 font-display flex items-center gap-2">
                {isDelivered && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                {isOutForDelivery && <Truck className="w-5 h-5 text-emerald-600 animate-bounce" />}
                <span>{order.status.replace(/_/g, ' ')}</span>
              </h3>
              <p className="text-xs text-emerald-700">
                {order.slot.timeWindow} · {order.zone.name}
              </p>
            </div>

            {isOutForDelivery && (
              <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-300 text-center shadow-xs">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Live ETA</span>
                <span className="text-lg font-black text-emerald-700 font-mono">
                  ~{simulatedEtaMinutes} mins
                </span>
              </div>
            )}
          </div>

          {/* Interactive Simulated GPS Neighborhood Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                Live 100 sq km Service Zone Radar
              </span>
              <span className="text-emerald-700 font-mono text-[11px]">GPS Active</span>
            </div>

            <div className="h-44 sm:h-52 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
              {/* Map grid simulation */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Central Store Hub Marker */}
              <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center text-center z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded-full mt-1 border border-slate-700">
                  DailyNest Hub
                </span>
              </div>

              {/* Connecting dashed route */}
              <div className="w-1/2 h-0.5 border-t-2 border-dashed border-emerald-400 absolute left-1/4 top-1/2 -translate-y-1/2" />

              {/* Moving Delivery Rider Marker */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 flex flex-col items-center text-center z-20 transition-all duration-1000 ${
                  isDelivered ? 'left-3/4 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-white animate-pulse">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-amber-200 bg-slate-900/90 px-2 py-0.5 rounded-full mt-1 border border-amber-500/40">
                  {order.deliveryPartnerName ? `${order.deliveryPartnerName} (Rider)` : 'Assigned Rider'}
                </span>
              </div>

              {/* Customer Home Marker */}
              <div className="absolute left-3/4 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center text-center z-10">
                <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-white bg-slate-800/90 px-2 py-0.5 rounded-full mt-1 border border-slate-700">
                  Your Doorstep
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Rider Contact Card (if assigned) */}
          {order.deliveryPartnerName && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{order.deliveryPartnerName}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      ★ 4.9 Verified Rider
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">Electric Cargo Bike · Speeding Safe</p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${order.deliveryPartnerPhone || '5551234567'}`}
                  className="p-2 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl text-slate-700 transition"
                  title="Call Rider"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Step Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Order Timeline
            </h4>
            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {orderStages.map((stage, idx) => {
                const isCompleted = idx <= (currentStatusIdx >= 0 ? currentStatusIdx : 0);
                const isCurrent = idx === currentStatusIdx;

                return (
                  <div key={stage.status} className="flex items-start gap-3 relative">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 z-10 transition ${
                        isCompleted
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {stage.icon}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {stage.label}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] text-emerald-600 font-bold">Done</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Package Contents ({order.items.length} items)
            </h4>
            <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-3 border border-slate-200">
              {order.items.map((item, i) => (
                <div key={i} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-md object-cover" />
                    <span className="font-medium text-slate-800 truncate">{item.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({item.unit})</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    {item.quantity} × ${item.price}
                  </span>
                </div>
              ))}

              <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-xs text-slate-900">
                <span>Total Paid ({order.paymentMethod})</span>
                <span className="font-mono text-emerald-700">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions: Reorder & Return */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                onReorder(order);
                onClose();
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              1-Click Reorder Items
            </button>

            {isDelivered && (
              <button
                onClick={() => setShowReturnDialog(true)}
                className="bg-white border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl transition"
              >
                Request Return / Refund
              </button>
            )}
          </div>

          {/* Return Dialog */}
          {showReturnDialog && (
            <form onSubmit={handleRequestReturn} className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Select Return Reason for Doorstep Pickup
              </h4>

              <select
                required
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="">-- Choose reason --</option>
                <option value="Damaged or broken seal">Damaged or broken packaging seal</option>
                <option value="Quality issue / Not fresh">Quality issue / Freshness not satisfied</option>
                <option value="Wrong item delivered">Wrong item received</option>
                <option value="Near expiry date">Product near expiry date</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReturnDialog(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
                >
                  Submit Return Request
                </button>
              </div>

              {returnSuccess && (
                <p className="text-xs text-emerald-800 font-bold">
                  Return request registered. Our delivery agent will pickup during next trip!
                </p>
              )}
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
