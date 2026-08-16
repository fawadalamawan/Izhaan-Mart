import React, { useState } from 'react';
import { MapPin, CheckCircle, Navigation, AlertCircle, Clock, DollarSign, Search, X, ShieldAlert, Sparkles } from 'lucide-react';
import { DeliveryZone } from '../../types';
import { StorageService } from '../../services/storageService';

interface ZonePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: DeliveryZone | null;
  onSelectZone: (zone: DeliveryZone) => void;
}

export const ZonePickerModal: React.FC<ZonePickerModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  onSelectZone
}) => {
  const zones = StorageService.getZones().filter(z => z.isActive);
  const [pincodeInput, setPincodeInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    status: 'IDLE' | 'SERVICEABLE' | 'UNSERVICEABLE';
    zone?: DeliveryZone;
    message?: string;
  }>({ status: 'IDLE' });
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;

    const matchedZone = StorageService.findZoneByPincode(pincodeInput.trim());
    if (matchedZone) {
      setValidationResult({
        status: 'SERVICEABLE',
        zone: matchedZone,
        message: `Great news! Pincode ${pincodeInput} is covered under ${matchedZone.name}.`
      });
    } else {
      setValidationResult({
        status: 'UNSERVICEABLE',
        message: `Sorry! Pincode ${pincodeInput} is outside our ~100 km² hyperlocal delivery boundary. We are expanding soon!`
      });
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setValidationResult({ status: 'IDLE' });

    // Realistic GPS check simulation within 1.5 seconds
    setTimeout(() => {
      setIsLocating(false);
      // Pick Zone A / North by default for demo
      const autoZone = zones[0];
      setValidationResult({
        status: 'SERVICEABLE',
        zone: autoZone,
        message: `GPS detected inside ${autoZone.name} (Est. ${autoZone.estimatedMinutes} min delivery).`
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/30 text-emerald-100 text-xs px-2.5 py-1 rounded-full font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 100 km² HyperLocal Service Boundary
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">Select Your Delivery Zone</h2>
          <p className="text-emerald-100 text-xs mt-1">
            We deliver exclusively within our verified neighborhood sectors to guarantee 30-45 min fresh delivery.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Pincode Input Form */}
          <form onSubmit={handleCheckPincode} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Enter Delivery Pincode / Area Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => {
                    setPincodeInput(e.target.value);
                    if (validationResult.status !== 'IDLE') {
                      setValidationResult({ status: 'IDLE' });
                    }
                  }}
                  placeholder="e.g. 10001, 10003, 10007..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs"
              >
                Check
              </button>
            </div>

            {/* GPS Locator Button */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full flex items-center justify-center gap-2 border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs py-2 rounded-xl transition"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Detecting your GPS coordinates...' : 'Use Current Device Location'}
            </button>
          </form>

          {/* Validation Result Banner */}
          {validationResult.status === 'SERVICEABLE' && validationResult.zone && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <p className="font-bold text-emerald-900">{validationResult.message}</p>
                <p className="text-emerald-700 mt-0.5">
                  Fee: <span className="font-bold">${validationResult.zone.deliveryFee}</span> · Free delivery above <span className="font-bold">${validationResult.zone.minOrderForFreeDelivery}</span> · ETA: <span className="font-bold">{validationResult.zone.estimatedMinutes} mins</span>
                </p>
                <button
                  onClick={() => {
                    onSelectZone(validationResult.zone!);
                    onClose();
                  }}
                  className="mt-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                >
                  Confirm & Deliver Here
                </button>
              </div>
            </div>
          )}

          {validationResult.status === 'UNSERVICEABLE' && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900">
                <p className="font-bold">{validationResult.message}</p>
                <p className="text-rose-700 mt-1">
                  Please pick one of our active serviceable zones below or enter an address within our ~100 km² boundary.
                </p>
              </div>
            </div>
          )}

          {/* List of Active Zones */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Active Service Zones (5 Sectors)
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">100 km² Total Coverage</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {zones.map((zone) => {
                const isSelected = selectedZone?.id === zone.id;
                return (
                  <div
                    key={zone.id}
                    onClick={() => {
                      onSelectZone(zone);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-900">{zone.name}</span>
                        {isSelected && (
                          <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Active</span>
                        )}
                      </div>
                      
                      <div className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" /> {zone.estimatedMinutes}m ETA
                        </span>
                        <span>·</span>
                        <span>Fee: <strong className="text-slate-800">${zone.deliveryFee}</strong> (Free &gt; ${zone.minOrderForFreeDelivery})</span>
                      </div>

                      <div className="text-[10px] text-slate-400 truncate max-w-[280px]">
                        Pincodes: {zone.pincodes.join(', ')} · {zone.neighborhoodHighlights.slice(0, 2).join(', ')}
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>⚡ Direct delivery from Downtown Central Mart</span>
          <button onClick={onClose} className="font-semibold text-slate-700 hover:text-slate-900">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
