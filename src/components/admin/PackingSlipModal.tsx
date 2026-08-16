import React from 'react';
import { X, Printer, Store, MapPin, Phone, Calendar, Clock, Check } from 'lucide-react';
import { Order, StoreSettings } from '../../types';

interface PackingSlipModalProps {
  order: Order | null;
  onClose: () => void;
  settings: StoreSettings;
}

export const PackingSlipModal: React.FC<PackingSlipModalProps> = ({
  order,
  onClose,
  settings
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 my-4 flex flex-col">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <span className="text-xs font-bold font-mono">Invoice / Packing Slip: {order.orderNumber}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Thermal Slip
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Section */}
        <div id="printable-slip" className="p-6 space-y-4 bg-white text-slate-900 text-xs font-sans">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-3">
            <h2 className="text-lg font-black tracking-tight uppercase">{settings.storeName}</h2>
            <p className="text-[11px] text-slate-600">{settings.tagline}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{settings.address} · Phone: {settings.phone}</p>
            <div className="mt-1 font-mono font-bold text-xs bg-slate-100 py-0.5 rounded">
              DISPATCH PACKING SLIP & RECEIPT
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 border-b border-dashed border-slate-300 pb-3">
            <div>
              <p className="font-bold text-slate-500 text-[10px]">ORDER NO:</p>
              <p className="font-mono font-black text-sm">{order.orderNumber}</p>
              <p className="text-[10px] text-slate-500 font-mono">
                {new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-500 text-[10px]">PAYMENT METHOD:</p>
              <p className="font-bold text-xs">{order.paymentMethod} ({order.paymentStatus})</p>
              <p className="text-[10px] text-slate-500">Slot: {order.slot.timeWindow}</p>
            </div>
          </div>

          {/* Customer & Delivery Address */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-800 uppercase text-[10px]">Deliver To Resident:</p>
            <p className="font-bold text-xs">{order.customerName} ({order.customerPhone})</p>
            <p className="text-[11px] text-slate-700 leading-tight mt-0.5">
              {order.address.streetAddress}, {order.address.apartmentFloor && `${order.address.apartmentFloor}, `}
              Landmark: {order.address.landmark}
            </p>
            <p className="text-[10px] font-mono font-bold text-emerald-800 mt-1">
              Zone: {order.zone.name} (PIN: {order.address.pincode})
            </p>
          </div>

          {/* Items Checklist */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-[10px] text-slate-500 uppercase">
                  <th className="py-1 w-6">✓</th>
                  <th className="py-1">Item Description</th>
                  <th className="py-1 text-center">Unit</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-1.5">
                    <td className="py-1.5">
                      <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs" />
                    </td>
                    <td className="py-1.5 font-sans font-semibold text-slate-900">{item.name}</td>
                    <td className="py-1.5 text-center text-[10px] text-slate-500">{item.unit}</td>
                    <td className="py-1.5 text-center font-bold">{item.quantity}</td>
                    <td className="py-1.5 text-right font-bold">${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="border-t-2 border-slate-800 pt-2 space-y-1 text-right font-mono text-xs">
            <div className="flex justify-between">
              <span className="font-sans text-slate-600">Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span className="font-sans">Discount ({order.couponCode || 'Promo'}):</span>
                <span>-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-sans text-slate-600">Delivery Fee:</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-800 pt-1 flex justify-between font-black text-sm">
              <span className="font-sans">TOTAL COLLECTIBLE:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Assigned Driver and Verification */}
          <div className="border-t border-dashed border-slate-300 pt-2 flex items-center justify-between text-[10px] text-slate-500">
            <div>
              <span>Packed By: Store Team</span> · <span>Rider: {order.deliveryPartnerName || 'Unassigned'}</span>
            </div>
            <span className="font-mono">Quality Checked ✓</span>
          </div>

          <div className="text-center text-[10px] text-slate-400 italic pt-1">
            Thank you for shopping local with {settings.storeName}!
          </div>

        </div>

      </div>
    </div>
  );
};
