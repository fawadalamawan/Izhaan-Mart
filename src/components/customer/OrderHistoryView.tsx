import React from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  Eye,
  MapPin,
  ChevronRight,
  Package,
  Calendar
} from 'lucide-react';
import { Order } from '../../types';

interface OrderHistoryViewProps {
  orders: Order[];
  onOpenOrderTracking: (order: Order) => void;
  onReorder: (order: Order) => void;
  onBackToShopping: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  onOpenOrderTracking,
  onReorder,
  onBackToShopping
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 pt-2">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Your Orders & Deliveries
          </h1>
          <p className="text-xs text-slate-500">
            Track live delivery status or reorder your regular household staples
          </p>
        </div>
        <button
          onClick={onBackToShopping}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
        >
          Shop More Items
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Order daily groceries, dairy, and cleaning products for 30-min doorstep delivery.
          </p>
          <button
            onClick={onBackToShopping}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs"
          >
            Start Shopping Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isDelivered = order.status === 'DELIVERED';
            const isOutForDelivery = order.status === 'OUT_FOR_DELIVERY';
            const isCancelled = order.status === 'CANCELLED';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        isDelivered
                          ? 'bg-emerald-100 text-emerald-800'
                          : isOutForDelivery
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : isCancelled
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isDelivered && <CheckCircle className="w-3.5 h-3.5" />}
                      {isOutForDelivery && <Truck className="w-3.5 h-3.5" />}
                      <span>{order.status.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                </div>

                {/* Items Mini Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                        title={`${item.name} (${item.quantity}x)`}
                      />
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Total & Summary */}
                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400 block">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                    <span className="text-lg font-mono font-black text-slate-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Destination & Slot */}
                <div className="bg-slate-50 rounded-2xl p-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate max-w-sm">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{order.address.streetAddress} ({order.zone.name.split(':')[0]})</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{order.slot.timeWindow}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    onClick={() => onOpenOrderTracking(order)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Track Live Delivery</span>
                  </button>

                  <button
                    onClick={() => onReorder(order)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-1.5"
                    title="Add items to cart"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">1-Click</span> Reorder
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
