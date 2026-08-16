import React, { useState } from 'react';
import {
  X,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Share2,
  CheckCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Send,
  Clock,
  Flame,
  Tag
} from 'lucide-react';
import { Product, Review } from '../../types';
import { StorageService } from '../../services/storageService';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  cartQty: number;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectRelatedProduct: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  cartQty,
  onAddToCart,
  onUpdateCartQuantity,
  isWishlisted,
  onToggleWishlist,
  onSelectRelatedProduct
}) => {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) return null;

  const allReviews = StorageService.getReviews().filter(
    r => r.productId === product.id && r.isApproved
  );

  const relatedProducts = StorageService.getProducts()
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id && p.isActive)
    .slice(0, 4);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Order "${product.name}" (${product.unit}) for $${product.salePrice} from DailyNest Mart. 30-min neighborhood delivery: ${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    StorageService.addReview({
      productId: product.id,
      userId: 'usr-guest-' + Date.now(),
      userName: reviewName.trim() || 'Neighborhood Resident',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true
    });

    setReviewSubmitted(true);
    setReviewComment('');
    setReviewName('');
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 flex flex-col max-h-[90vh]">
        
        {/* Sticky Header */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            {product.categoryName}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-2 rounded-xl border transition ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-500 border-rose-200'
                  : 'text-slate-400 border-slate-200 hover:text-rose-500 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
              title="Share via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Main Gallery + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Gallery */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={product.images[selectedImgIdx] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        selectedImgIdx === idx ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info and Purchase */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded font-mono">
                    SKU: {product.sku}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-emerald-800">{product.unit}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    ({product.reviewCount} customer reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                      ${product.salePrice}
                    </span>
                    {product.mrp > product.salePrice && (
                      <>
                        <span className="text-sm text-slate-400 line-through font-mono">
                          ${product.mrp}
                        </span>
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                          Save ${(product.mrp - product.salePrice).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Inclusive of all local taxes</p>
                </div>

                {/* Stock Warning */}
                <div className="mt-3">
                  {isOutOfStock ? (
                    <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
                      Currently Out of Stock. Fresh inventory arrives tomorrow!
                    </div>
                  ) : isLowStock ? (
                    <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-xl flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Hurry! Only <strong>{product.stock} units</strong> remaining in our store.</span>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>In Stock & Ready for 30-min Neighborhood Delivery</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="pt-3">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full bg-slate-200 text-slate-500 font-bold py-3 rounded-2xl cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                ) : cartQty > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-emerald-600 text-white rounded-2xl flex items-center justify-between p-2 shadow-md">
                      <button
                        onClick={() => onUpdateCartQuantity(product.id, cartQty - 1)}
                        className="p-2 hover:bg-emerald-700 rounded-xl transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="text-center font-mono">
                        <span className="text-sm font-black">{cartQty} in Cart</span>
                        <div className="text-[10px] text-emerald-100">Subtotal: ${(cartQty * product.salePrice).toFixed(2)}</div>
                      </div>
                      <button
                        disabled={cartQty >= product.stock}
                        onClick={() => onUpdateCartQuantity(product.id, cartQty + 1)}
                        className="p-2 hover:bg-emerald-700 rounded-xl transition disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add {product.unit} to Cart · ${product.salePrice}
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Description & Store Promises */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Product Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {product.description}
            </p>

            {/* Store Guarantees */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-800 block">30m Delivery</span>
                <span className="text-[9px] text-slate-500">In 100 km² Zone</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-800 block">Quality Assured</span>
                <span className="text-[9px] text-slate-500">Chakki & Farm Fresh</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-800 block">Easy Returns</span>
                <span className="text-[9px] text-slate-500">Doorstep Refund</span>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Verified Resident Reviews ({allReviews.length})
              </h3>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-2.5">
              {allReviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Write Review Form */}
            <form onSubmit={handleSubmitReview} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <h4 className="text-xs font-bold text-emerald-900">Write a Review for your Neighbors</h4>
              
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">Rating:</span>
                <div className="flex gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Your Name (e.g. Alex, Apartment 402)"
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium"
                />
                <input
                  type="text"
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the product freshness / quality?"
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" /> Submit Review
              </button>

              {reviewSubmitted && (
                <p className="text-xs text-emerald-700 font-bold animate-in fade-in">
                  Thank you! Your verified review has been published.
                </p>
              )}
            </form>
          </div>

          {/* Related Items Shelf */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-slate-200 pt-5 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Frequently Bought Together in {product.categoryName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedProduct(rel)}
                    className="bg-white border border-slate-200 p-2.5 rounded-2xl hover:border-emerald-500 cursor-pointer transition text-left"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-20 object-cover rounded-xl mb-1.5"
                    />
                    <h5 className="font-bold text-xs text-slate-900 truncate">{rel.name}</h5>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="font-bold text-slate-900 font-mono">${rel.salePrice}</span>
                      <span className="text-[10px] text-slate-400">{rel.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
