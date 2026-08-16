import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  Clock,
  Heart,
  Plus,
  Minus,
  Check,
  Star,
  Share2,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Info,
  CheckCircle2,
  Tag,
  Percent,
  Wheat,
  Milk,
  Sparkles as SparklesIcon,
  HeartHandshake,
  Coffee,
  UtensilsCrossed,
  Layers
} from 'lucide-react';
import { Product, Category, DeliveryZone } from '../../types';

interface StorefrontViewProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  selectedZone: DeliveryZone | null;
  onOpenZonePicker: () => void;
  cartItemsMap: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, qty: number) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (productId: string) => void;
  onOpenProductDetail: (product: Product) => void;
  onOpenCheckout: () => void;
  searchQuery: string;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Wheat: <Wheat className="w-5 h-5" />,
  Milk: <Milk className="w-5 h-5" />,
  Sparkles: <SparklesIcon className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />
};

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedZone,
  onOpenZonePicker,
  cartItemsMap,
  onAddToCart,
  onUpdateCartQuantity,
  wishlistIds,
  onToggleWishlist,
  onOpenProductDetail,
  onOpenCheckout,
  searchQuery
}) => {
  const [filterTag, setFilterTag] = useState<'ALL' | 'BESTSELLER' | 'NEW' | 'UNDER_100' | 'IN_STOCK'>('ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC' | 'DISCOUNT'>('POPULAR');
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  const banners = [
    {
      id: 1,
      title: '⚡ Neighborhood Express Delivery',
      subtitle: '30-45 min doorstep delivery across your zone',
      code: 'FREESHIP',
      bgGradient: 'from-[#606C38] via-[#7D8471] to-[#283618]',
      badge: 'Zero Delivery Fee Above $299'
    },
    {
      id: 2,
      title: 'Fresh Farm Produce & Pure Staples',
      subtitle: 'Pure whole wheat flour, fresh dairy & daily essentials',
      code: 'WELCOME50',
      bgGradient: 'from-[#BC6C25] via-[#DDA15E] to-[#4A4238]',
      badge: 'Up to 25% OFF Everyday Staples'
    }
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;

      // Category filter
      if (selectedCategory && p.categoryId !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.categoryName.toLowerCase().includes(q);
        const matchesTag = p.tags.some(t => t.toLowerCase().includes(q));
        const matchesSku = p.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesTag && !matchesSku) {
          return false;
        }
      }

      // Quick filter chips
      if (filterTag === 'BESTSELLER' && !p.isBestseller) return false;
      if (filterTag === 'NEW' && !p.isNewArrival) return false;
      if (filterTag === 'UNDER_100' && p.salePrice > 100) return false;
      if (filterTag === 'IN_STOCK' && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.salePrice - b.salePrice;
      if (sortBy === 'PRICE_DESC') return b.salePrice - a.salePrice;
      if (sortBy === 'DISCOUNT') return b.discountPercent - a.discountPercent;
      // Default: popularity / rating
      return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
    });
  }, [products, selectedCategory, searchQuery, filterTag, sortBy]);

  const bestsellers = useMemo(() => {
    return products.filter(p => p.isActive && p.isBestseller).slice(0, 4);
  }, [products]);

  const handleShareWhatsApp = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Hey! Look at this product on DailyNest Mart: ${product.name} (${product.unit}) for only $${product.salePrice}! Delivered in 30 mins to our neighborhood.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12">
      
      {/* Hero Offer Banner Carousel */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg bg-slate-900">
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${banners[activeBannerIdx].bgGradient} text-white transition-all duration-500`}>
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              {banners[activeBannerIdx].badge}
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display leading-tight">
              {banners[activeBannerIdx].title}
            </h1>
            
            <p className="text-white/90 text-sm sm:text-base max-w-lg">
              {banners[activeBannerIdx].subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="bg-black/30 border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
                <Tag className="w-3.5 h-3.5 text-[#FEFAE0]" />
                <span>Use Code:</span>
                <span className="font-mono font-bold text-[#FEFAE0] tracking-wider">
                  {banners[activeBannerIdx].code}
                </span>
              </div>

              {selectedZone ? (
                <div className="text-xs text-white/90 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#E9EDC9]" />
                  <span>Serving {selectedZone.name.split(':')[0]} in ~{selectedZone.estimatedMinutes} mins</span>
                </div>
              ) : (
                <button
                  onClick={onOpenZonePicker}
                  className="bg-[#FEFAE0] text-[#283618] hover:bg-[#E9EDC9] px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Set Delivery Pincode
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveBannerIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                activeBannerIdx === i ? 'w-6 bg-[#FEFAE0]' : 'w-2 bg-white/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Category Pills Bar (Horizontal Scroll on Mobile) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base sm:text-lg font-bold text-[#283618] font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#7D8471]" /> Browse by Department
          </h2>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs text-[#BC6C25] hover:text-[#7D8471] font-bold"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
          {/* All Categories Pill */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
              selectedCategory === null
                ? 'bg-[#7D8471] text-white border-[#7D8471] shadow-md shadow-[#7D8471]/20'
                : 'bg-white text-[#4A4238] border-[#E9EDC9] hover:border-[#7D8471] hover:bg-[#FEFAE0]/50'
            }`}
          >
            <span>All Items</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              selectedCategory === null ? 'bg-[#283618] text-[#E9EDC9]' : 'bg-[#FEFAE0] text-[#7D8471]'
            }`}>
              {products.filter(p => p.isActive).length}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition border ${
                  isSelected
                    ? 'bg-[#7D8471] text-white border-[#7D8471] shadow-md shadow-[#7D8471]/20'
                    : 'bg-white text-[#4A4238] border-[#E9EDC9] hover:border-[#7D8471] hover:bg-[#FEFAE0]/50'
                }`}
              >
                <div className={`p-1 rounded-lg ${isSelected ? 'bg-[#5E6654] text-white' : 'bg-[#FEFAE0] text-[#7D8471]'}`}>
                  {CATEGORY_ICON_MAP[cat.icon] || <Tag className="w-4 h-4" />}
                </div>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="bg-white p-3 rounded-2xl border border-[#E9EDC9] shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setFilterTag('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
              filterTag === 'ALL' ? 'bg-[#283618] text-white' : 'bg-[#FEFAE0] text-[#4A4238] hover:bg-[#E9EDC9]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterTag('BESTSELLER')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
              filterTag === 'BESTSELLER' ? 'bg-[#BC6C25] text-white' : 'bg-[#FEFAE0] text-[#BC6C25] hover:bg-[#E9EDC9]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Bestsellers
          </button>
          <button
            onClick={() => setFilterTag('NEW')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
              filterTag === 'NEW' ? 'bg-[#7D8471] text-white' : 'bg-[#FEFAE0] text-[#7D8471] hover:bg-[#E9EDC9]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> New
          </button>
          <button
            onClick={() => setFilterTag('UNDER_100')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
              filterTag === 'UNDER_100' ? 'bg-[#DDA15E] text-[#283618]' : 'bg-[#FEFAE0] text-[#BC6C25] hover:bg-[#E9EDC9]'
            }`}
          >
            Under $100
          </button>
          <button
            onClick={() => setFilterTag('IN_STOCK')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
              filterTag === 'IN_STOCK' ? 'bg-[#606C38] text-white' : 'bg-[#FEFAE0] text-[#606C38] hover:bg-[#E9EDC9]'
            }`}
          >
            In Stock Only
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs text-[#7D8471] ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#7D8471]" />
          <span className="hidden sm:inline font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FEFAE0]/70 border border-[#E9EDC9] rounded-xl px-2.5 py-1 text-xs font-semibold text-[#4A4238] focus:ring-1 focus:ring-[#7D8471]"
          >
            <option value="POPULAR">Popularity</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
            <option value="DISCOUNT">Biggest Discount %</option>
          </select>
        </div>
      </div>

      {/* Main Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-sm font-bold text-[#4A4238]">
            Showing <span className="text-[#BC6C25] font-mono font-black">{filteredProducts.length}</span> household essentials
          </div>
          {searchQuery && (
            <div className="text-xs text-[#7D8471]">
              Results for "<strong className="text-[#283618]">{searchQuery}</strong>"
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E9EDC9] p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#D9D0C1] mx-auto" />
            <h3 className="text-base font-bold text-[#283618]">No items match your filter</h3>
            <p className="text-xs text-[#7D8471] max-w-sm mx-auto">
              Try searching for something else or reset your category and tag filters.
            </p>
            <button
              onClick={() => {
                onSelectCategory(null);
                setFilterTag('ALL');
              }}
              className="bg-[#7D8471] text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const qtyInCart = cartItemsMap[product.id] || 0;
              const isWishlisted = wishlistIds.has(product.id);
              const isOutOfStock = product.stock <= 0;
              const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

              return (
                <div
                  key={product.id}
                  onClick={() => onOpenProductDetail(product)}
                  className="group bg-white rounded-2xl sm:rounded-3xl border border-[#E9EDC9] p-3 sm:p-4 hover:border-[#7D8471] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer relative"
                >
                  {/* Top Badges & Wishlist */}
                  <div className="relative">
                    <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8F7F2] mb-3 relative">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Discount Tag */}
                      {product.discountPercent > 0 && (
                        <div className="absolute top-2 left-2 bg-[#BC6C25] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                          <Percent className="w-2.5 h-2.5" />
                          {product.discountPercent}% OFF
                        </div>
                      )}

                      {/* Bestseller Tag */}
                      {product.isBestseller && (
                        <div className="absolute bottom-2 left-2 bg-[#DDA15E] text-[#283618] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> Bestseller
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition shadow-xs ${
                          isWishlisted
                            ? 'bg-[#FEFAE0] text-[#BC6C25]'
                            : 'bg-white/80 text-[#7D8471] hover:text-[#BC6C25] hover:bg-white'
                        }`}
                        title="Save to wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#BC6C25] text-[#BC6C25]' : ''}`} />
                      </button>
                    </div>

                    {/* Unit & Category */}
                    <div className="flex items-center justify-between text-[11px] text-[#7D8471] mb-1">
                      <span className="bg-[#FEFAE0] text-[#4A4238] border border-[#E9EDC9]/60 font-semibold px-2 py-0.5 rounded-md font-mono text-[10px]">
                        {product.unit}
                      </span>
                      <div className="flex items-center gap-1 text-[#BC6C25] font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-[#DDA15E] text-[#BC6C25]" />
                        <span>{product.rating}</span>
                        <span className="text-[#7D8471] font-normal">({product.reviewCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xs sm:text-sm text-[#4A4238] line-clamp-2 leading-snug group-hover:text-[#283618] transition mb-1">
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing and Stock Status */}
                  <div className="mt-3 pt-2 border-t border-[#E9EDC9]/60">
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-base sm:text-lg font-black text-[#283618] font-mono">
                        ${product.salePrice}
                      </span>
                      {product.mrp > product.salePrice && (
                        <span className="text-xs text-[#7D8471] line-through font-mono">
                          ${product.mrp}
                        </span>
                      )}
                    </div>

                    {/* Stock Alert Badge */}
                    {isOutOfStock ? (
                      <div className="text-[11px] font-bold text-[#BC6C25] bg-[#FEFAE0] border border-[#E9EDC9] py-1 px-2 rounded-lg text-center mb-2">
                        Out of Stock
                      </div>
                    ) : isLowStock ? (
                      <div className="text-[10px] font-semibold text-[#BC6C25] bg-[#FEFAE0] border border-[#E9EDC9]/60 py-0.5 px-2 rounded-md mb-2 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" /> Only {product.stock} units left!
                      </div>
                    ) : null}

                    {/* Actions: Add to Cart & Share */}
                    <div className="flex items-center gap-1.5">
                      {isOutOfStock ? (
                        <button
                          disabled
                          className="flex-1 bg-[#F8F7F2] text-[#7D8471] font-bold text-xs py-2 rounded-xl cursor-not-allowed text-center border border-[#E9EDC9]"
                        >
                          Sold Out
                        </button>
                      ) : qtyInCart > 0 ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 bg-[#829173] text-white rounded-xl flex items-center justify-between px-2 py-1.5 shadow-md shadow-[#7D8471]/20"
                        >
                          <button
                            onClick={() => onUpdateCartQuantity(product.id, qtyInCart - 1)}
                            className="p-1 hover:bg-[#5E6654] rounded-lg transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black font-mono px-2">{qtyInCart}</span>
                          <button
                            disabled={qtyInCart >= product.stock}
                            onClick={() => onUpdateCartQuantity(product.id, qtyInCart + 1)}
                            className="p-1 hover:bg-[#5E6654] rounded-lg transition disabled:opacity-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                          className="flex-1 bg-[#FEFAE0] hover:bg-[#829173] hover:text-white text-[#283618] font-bold text-xs py-2 px-3 rounded-xl border border-[#E9EDC9] hover:border-[#7D8471] transition flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      )}

                      {/* WhatsApp Share Button */}
                      <button
                        type="button"
                        onClick={(e) => handleShareWhatsApp(e, product)}
                        className="p-2 text-[#7D8471] hover:text-[#283618] hover:bg-[#FEFAE0] rounded-xl transition border border-[#E9EDC9]"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
