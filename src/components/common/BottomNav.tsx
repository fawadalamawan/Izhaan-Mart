import React from 'react';
import { Home, Grid, Heart, ShoppingBag, User, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  activeRole: UserRole;
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  wishlistCount,
  activeRole,
  onOpenAuth
}) => {
  if (activeRole === 'ADMIN') return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#F8F7F2]/95 backdrop-blur-md border-t border-[#E9EDC9] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            activeTab === 'home' ? 'text-[#283618] font-bold' : 'text-[#7D8471] font-medium'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => onTabChange('categories')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            activeTab === 'categories' ? 'text-[#283618] font-bold' : 'text-[#7D8471] font-medium'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Categories</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => onTabChange('wishlist')}
          className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition ${
            activeTab === 'wishlist' ? 'text-[#283618] font-bold' : 'text-[#7D8471] font-medium'
          }`}
        >
          <Heart className="w-5 h-5 mb-0.5" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-2 bg-[#BC6C25] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px]">Saved</span>
        </button>

        {/* Orders */}
        <button
          onClick={() => onTabChange('orders')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
            activeTab === 'orders' ? 'text-[#283618] font-bold' : 'text-[#7D8471] font-medium'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Orders</span>
        </button>

        {/* Account / Profile */}
        <button
          onClick={onOpenAuth}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-[#7D8471] hover:text-[#283618] transition font-medium"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Account</span>
        </button>

      </div>
    </nav>
  );
};
