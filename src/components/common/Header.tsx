import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  MapPin,
  Search,
  Store,
  Truck,
  ShieldCheck,
  Bell,
  Menu,
  X,
  FileText,
  Clock,
  Sparkles,
  PhoneCall,
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { UserRole, DeliveryZone, StoreSettings } from '../../types';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedZone: DeliveryZone | null;
  onOpenZonePicker: () => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenAuth: () => void;
  onOpenDocs: () => void;
  onOpenNotifications: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  settings: StoreSettings;
  unreadNotifsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  selectedZone,
  onOpenZonePicker,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenAuth,
  onOpenDocs,
  onOpenNotifications,
  searchQuery,
  onSearchChange,
  settings,
  unreadNotifsCount
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F2]/95 backdrop-blur-md border-b border-[#E9EDC9] shadow-xs">
      {/* Top announcement bar */}
      {settings.broadcastBanner.active && (
        <div className="bg-[#7D8471] text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto truncate">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#E9EDC9] animate-pulse" />
            <span className="truncate">{settings.broadcastBanner.text}</span>
          </div>
          <button
            onClick={onOpenDocs}
            className="hidden md:flex items-center gap-1 bg-white/20 hover:bg-white/30 text-[#FEFAE0] px-2 py-0.5 rounded text-[11px] font-semibold transition"
          >
            <FileText className="w-3 h-3" /> Tech Specs & Schema
          </button>
        </div>
      )}

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo & Zone Selector */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => onRoleChange('CUSTOMER')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-[#7D8471] flex items-center justify-center text-white shadow-md shadow-[#7D8471]/20 group-hover:scale-105 transition font-bold text-lg">
                <Store className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-[#283618] tracking-tight font-display">DailyNest</span>
                  <span className="bg-[#E9EDC9] text-[#283618] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Mart</span>
                </div>
                <p className="text-[11px] text-[#7D8471] font-medium">Hyperlocal 100 km² Delivery</p>
              </div>
            </button>

            {/* Service Area / Zone Pill */}
            <button
              onClick={onOpenZonePicker}
              className="flex items-center gap-1.5 bg-[#FEFAE0] hover:bg-[#E9EDC9]/60 border border-[#E9EDC9] px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#4A4238] transition"
              title="Click to change delivery pincode / zone"
            >
              <MapPin className="w-3.5 h-3.5 text-[#BC6C25] shrink-0" />
              <div className="text-left max-w-[130px] sm:max-w-[180px] truncate">
                {selectedZone ? (
                  <span>{selectedZone.name.split(':')[0]} <span className="text-[#283618] font-bold font-mono">({selectedZone.pincodes[0]})</span></span>
                ) : (
                  <span className="text-[#BC6C25]">Select Zone / Pincode</span>
                )}
              </div>
              <ChevronDown className="w-3 h-3 text-[#7D8471]" />
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search atta, milk, dishwash, oil, tea..."
                className="w-full bg-white border border-[#E9EDC9] focus:border-[#7D8471] focus:bg-white focus:ring-2 focus:ring-[#7D8471]/20 text-[#4A4238] placeholder-[#4A4238]/50 text-sm rounded-xl pl-10 pr-9 py-2 transition"
              />
              <Search className="w-4 h-4 text-[#7D8471] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D8471] hover:text-[#4A4238]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-[#4A4238] hover:bg-[#FEFAE0] rounded-lg"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#7D8471]" />
            </button>

            {/* Live Notification Simulation Feed */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-[#4A4238] hover:bg-[#FEFAE0] rounded-xl transition border border-[#E9EDC9]/60"
              title="View simulated SMS & WhatsApp dispatch alerts"
            >
              <Bell className="w-5 h-5 text-[#7D8471]" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#BC6C25] rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-[#4A4238] hover:bg-[#FEFAE0] rounded-xl transition hidden sm:flex items-center border border-[#E9EDC9]/60"
              title="Saved items"
            >
              <Heart className="w-5 h-5 text-[#7D8471]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#BC6C25] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-[#829173] hover:bg-[#7D8471] text-white px-3 sm:px-4 py-2 rounded-xl font-semibold text-sm shadow-md shadow-[#7D8471]/20 transition active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#DDA15E] text-[#283618] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono font-bold">${cartTotal.toFixed(2)}</span>
            </button>

            {/* Role Switcher Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${
                  activeRole === 'ADMIN'
                    ? 'bg-[#FEFAE0] text-[#BC6C25] border-[#E9EDC9]'
                    : activeRole === 'DELIVERY'
                    ? 'bg-[#E9EDC9] text-[#283618] border-[#D9D0C1]'
                    : 'bg-white text-[#4A4238] border-[#E9EDC9]'
                }`}
              >
                {activeRole === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-[#BC6C25]" />}
                {activeRole === 'DELIVERY' && <Truck className="w-3.5 h-3.5 text-[#606C38]" />}
                {activeRole === 'CUSTOMER' && <UserIcon className="w-3.5 h-3.5 text-[#7D8471]" />}
                <span className="hidden sm:inline">
                  {activeRole === 'ADMIN' ? 'Owner Admin' : activeRole === 'DELIVERY' ? 'Driver View' : 'Customer'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#7D8471]" />
              </button>

              {showRoleMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E9EDC9] rounded-2xl shadow-xl z-50 py-2 divide-y divide-[#E9EDC9]/60 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2">
                      <p className="text-[11px] font-semibold text-[#7D8471] uppercase tracking-wider">Switch Portal Role</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          onRoleChange('CUSTOMER');
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition ${
                          activeRole === 'CUSTOMER' ? 'bg-[#FEFAE0] text-[#283618]' : 'text-[#4A4238] hover:bg-[#F8F7F2]'
                        }`}
                      >
                        <Store className="w-4 h-4 text-[#7D8471]" />
                        <div>
                          <div>Customer Storefront</div>
                          <div className="text-[10px] text-[#7D8471] font-normal">Browse, cart & track delivery</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onRoleChange('ADMIN');
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition ${
                          activeRole === 'ADMIN' ? 'bg-[#FEFAE0] text-[#BC6C25]' : 'text-[#4A4238] hover:bg-[#F8F7F2]'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-[#BC6C25]" />
                        <div>
                          <div>Store Owner Admin</div>
                          <div className="text-[10px] text-[#7D8471] font-normal">Products, orders, zones & KPIs</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onRoleChange('DELIVERY');
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition ${
                          activeRole === 'DELIVERY' ? 'bg-[#E9EDC9] text-[#283618]' : 'text-[#4A4238] hover:bg-[#F8F7F2]'
                        }`}
                      >
                        <Truck className="w-4 h-4 text-[#606C38]" />
                        <div>
                          <div>Delivery Partner App</div>
                          <div className="text-[10px] text-[#7D8471] font-normal">Live trips & mark delivered</div>
                        </div>
                      </button>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => {
                          onOpenDocs();
                          setShowRoleMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left text-[#4A4238] hover:bg-[#F8F7F2] transition"
                      >
                        <FileText className="w-4 h-4 text-[#BC6C25]" />
                        <div>
                          <div>System Docs & Schema</div>
                          <div className="text-[10px] text-[#7D8471] font-normal">PostgreSQL DDL, APIs & Specs</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search daily essentials, groceries..."
                className="w-full bg-white border border-[#E9EDC9] focus:border-[#7D8471] text-[#4A4238] text-sm rounded-xl pl-10 pr-9 py-2.5 transition placeholder-[#4A4238]/50"
              />
              <Search className="w-4 h-4 text-[#7D8471] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D8471] hover:text-[#4A4238]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
