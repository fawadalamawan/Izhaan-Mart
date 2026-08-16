import React from 'react';
import { X, MessageSquare, Smartphone, Bell, Clock, CheckCheck, Send } from 'lucide-react';
import { NotificationLog } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationLog[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Automated Alerts Feed</h3>
              <p className="text-[10px] text-slate-300">Live SMS & WhatsApp dispatch logs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2 opacity-50" />
              <p className="text-sm font-semibold">No notification logs yet</p>
              <p className="text-xs">Place an order or update status to trigger automated SMS/WhatsApp alerts.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isWhatsApp = notif.channel === 'WHATSAPP';
              const formattedTime = new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition ${
                    isWhatsApp
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-blue-50/70 border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {isWhatsApp ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                          <MessageSquare className="w-3 h-3" /> WhatsApp Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md">
                          <Smartphone className="w-3 h-3" /> SMS Gateway
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-500">{notif.recipientPhone}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formattedTime}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-1">{notif.title}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                    {notif.body}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Carrier: Twilio / Gupshup Simulated</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                      <CheckCheck className="w-3.5 h-3.5" /> Delivered
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Integrated with automated webhooks on every status change.
        </div>
      </div>
    </div>
  );
};
