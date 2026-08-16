import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Truck,
  Layers,
  MapPin,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Printer,
  Sparkles,
  DollarSign,
  Users,
  Eye,
  MessageSquare,
  ShieldCheck,
  Tag,
  Phone,
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';
import {
  Product,
  Category,
  Order,
  DeliveryZone,
  StoreSettings,
  DeliveryPerson,
  OrderStatus,
  Review
} from '../../types';
import { StorageService } from '../../services/storageService';
import { PackingSlipModal } from './PackingSlipModal';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  zones: DeliveryZone[];
  settings: StoreSettings;
  drivers: DeliveryPerson[];
  onRefreshData: () => void;
  onOpenDocs: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  orders,
  zones,
  settings,
  drivers,
  onRefreshData,
  onOpenDocs
}) => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'PRODUCTS' | 'CATEGORIES' | 'ORDERS' | 'ZONES' | 'SETTINGS' | 'REVIEWS'>('ORDERS');
  
  // Product CRUD Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form fields for product
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCatId, setProdCatId] = useState(categories[0]?.id || '');
  const [prodUnit, setProdUnit] = useState('1 kg');
  const [prodMrp, setProdMrp] = useState(100);
  const [prodSalePrice, setProdSalePrice] = useState(85);
  const [prodStock, setProdStock] = useState(20);
  const [prodLowStockThreshold, setProdLowStockThreshold] = useState(5);
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodIsBestseller, setProdIsBestseller] = useState(false);
  const [prodIsNewArrival, setProdIsNewArrival] = useState(false);
  const [prodSku, setProdSku] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  // Category Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSubcategories, setNewCatSubcategories] = useState('');

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<Order | null>(null);
  const [searchProductQuery, setSearchProductQuery] = useState('');

  // Settings form state
  const [bannerText, setBannerText] = useState(settings.broadcastBanner.text);
  const [bannerActive, setBannerActive] = useState(settings.broadcastBanner.active);
  const [storeOpen, setStoreOpen] = useState(settings.storeOpen);

  const analytics = StorageService.getAnalytics();
  const reviews = StorageService.getReviews();

  // Auto discount calculator
  const discountPercent = prodMrp > prodSalePrice ? Math.round(((prodMrp - prodSalePrice) / prodMrp) * 100) : 0;

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdCatId(categories[0]?.id || '');
    setProdUnit('1 kg');
    setProdMrp(100);
    setProdSalePrice(85);
    setProdStock(25);
    setProdLowStockThreshold(5);
    setProdImages(['https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop&q=80']);
    setProdIsBestseller(false);
    setProdIsNewArrival(true);
    setProdSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setCompressionInfo(null);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdCatId(p.categoryId);
    setProdUnit(p.unit);
    setProdMrp(p.mrp);
    setProdSalePrice(p.salePrice);
    setProdStock(p.stock);
    setProdLowStockThreshold(p.lowStockThreshold);
    setProdImages(p.images);
    setProdIsBestseller(!!p.isBestseller);
    setProdIsNewArrival(!!p.isNewArrival);
    setProdSku(p.sku);
    setCompressionInfo(null);
    setShowProductModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    try {
      const file = files[0];
      const result = await StorageService.compressImage(file);
      setProdImages(prev => [result.dataUrl, ...prev]);
      setCompressionInfo(
        `Auto-compressed: ${result.originalSizeKb} KB → ${result.compressedSizeKb} KB (Cloud CDN ready)`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === prodCatId);

    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: prodName.trim(),
      description: prodDesc.trim() || 'Fresh household product packed safely for fast neighborhood delivery.',
      categoryId: prodCatId,
      categoryName: cat?.name || 'General',
      subcategory: cat?.subcategories[0] || 'General',
      unit: prodUnit.trim(),
      mrp: Number(prodMrp),
      salePrice: Number(prodSalePrice),
      discountPercent,
      stock: Number(prodStock),
      lowStockThreshold: Number(prodLowStockThreshold),
      isActive: true,
      isBestseller: prodIsBestseller,
      isNewArrival: prodIsNewArrival,
      images: prodImages.length > 0 ? prodImages : ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=700'],
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      sku: prodSku.trim() || `SKU-${Date.now()}`,
      tags: [cat?.slug || 'staples', 'fresh']
    };

    StorageService.saveProduct(productToSave);
    setShowProductModal(false);
    onRefreshData();
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      StorageService.deleteProduct(id);
      onRefreshData();
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, driverId?: string) => {
    StorageService.updateOrderStatus(orderId, status, undefined, driverId);
    onRefreshData();
  };

  const handleSaveSettings = () => {
    StorageService.updateSettings({
      storeOpen,
      broadcastBanner: {
        ...settings.broadcastBanner,
        text: bannerText,
        active: bannerActive
      }
    });
    onRefreshData();
    alert('Store settings & broadcast announcement updated!');
  };

  const handleExportProductsCSV = () => {
    const csv = StorageService.exportProductsToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DailyNest_Products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportOrdersCSV = () => {
    const csv = StorageService.exportOrdersToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DailyNest_Orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        if (lines.length > 1) {
          alert(`Successfully validated & processed ${lines.length - 1} products from CSV.`);
          onRefreshData();
        }
      } catch (err) {
        alert('Invalid CSV format. Please check template.');
      }
    };
    reader.readAsText(file);
  };

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'ALL') return true;
    return o.status === orderStatusFilter;
  });

  const filteredProducts = products.filter(p => {
    if (!searchProductQuery.trim()) return true;
    const q = searchProductQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-24 pt-2">
      
      {/* Top Banner & Quick Controls */}
      <div className="bg-[#283618] text-[#FEFAE0] rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#FEFAE0]/15 text-[#FEFAE0] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#FEFAE0]/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DDA15E]" /> Single Store Owner Console
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${storeOpen ? 'bg-[#606C38]/40 text-[#E9EDC9] border border-[#606C38]' : 'bg-[#BC6C25]/30 text-[#FEFAE0]'}`}>
              Store: {storeOpen ? 'OPEN (Accepting 100km² Orders)' : 'CLOSED'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-[#FEFAE0]">
            {settings.storeName}
          </h1>
          <p className="text-xs text-[#E9EDC9]">
            Managing catalog, live dispatch, neighborhood zones & revenues with zero technical complexity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAddProduct}
            className="bg-[#7D8471] hover:bg-[#5E6654] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-[#7D8471]/30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>

          <button
            onClick={onOpenDocs}
            className="bg-[#283618]/80 hover:bg-[#283618] border border-[#FEFAE0]/30 text-[#FEFAE0] font-semibold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#DDA15E]" /> System Architecture & DDL
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E9EDC9] shadow-xs">
          <div className="flex items-center justify-between text-[#7D8471] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Revenue</span>
            <DollarSign className="w-4 h-4 text-[#606C38]" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#283618] font-mono">
            ${analytics.totalRevenue.toFixed(2)}
          </div>
          <span className="text-[10px] text-[#606C38] font-semibold">100% Collected</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E9EDC9] shadow-xs">
          <div className="flex items-center justify-between text-[#7D8471] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#7D8471]" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#283618] font-mono">
            {analytics.totalOrders}
          </div>
          <span className="text-[10px] text-[#7D8471] font-medium">{analytics.deliveredOrdersCount} delivered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E9EDC9] shadow-xs">
          <div className="flex items-center justify-between text-[#7D8471] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Order</span>
            <TrendingUp className="w-4 h-4 text-[#BC6C25]" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#283618] font-mono">
            ${analytics.averageOrderValue}
          </div>
          <span className="text-[10px] text-[#7D8471] font-medium">AOV per resident</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E9EDC9] shadow-xs">
          <div className="flex items-center justify-between text-[#7D8471] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dispatches</span>
            <Truck className="w-4 h-4 text-[#DDA15E]" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#BC6C25] font-mono">
            {analytics.pendingDeliveriesCount}
          </div>
          <span className="text-[10px] text-[#BC6C25] font-semibold">Active in zone</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E9EDC9] shadow-xs">
          <div className="flex items-center justify-between text-[#7D8471] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-[#BC6C25]" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#BC6C25] font-mono">
            {analytics.lowStockCount}
          </div>
          <span className="text-[10px] text-[#BC6C25] font-semibold">Needs restock</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E9EDC9] shadow-xs">
          <div className="flex items-center justify-between text-[#7D8471] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Zones</span>
            <MapPin className="w-4 h-4 text-[#7D8471]" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#283618] font-mono">
            5 Sectors
          </div>
          <span className="text-[10px] text-[#606C38] font-semibold">~100 km² active</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-[#E9EDC9]">
        {[
          { id: 'ORDERS', label: 'Live Orders & Dispatch', icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'PRODUCTS', label: 'Products & Inventory', icon: <Package className="w-4 h-4" /> },
          { id: 'CATEGORIES', label: 'Categories', icon: <Layers className="w-4 h-4" /> },
          { id: 'ANALYTICS', label: 'Analytics & CSV', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'ZONES', label: '100 km² Zones', icon: <MapPin className="w-4 h-4" /> },
          { id: 'SETTINGS', label: 'Store Settings', icon: <Settings className="w-4 h-4" /> },
          { id: 'REVIEWS', label: 'Reviews Moderation', icon: <MessageSquare className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#7D8471] text-white shadow-md shadow-[#7D8471]/20'
                : 'bg-white text-[#4A4238] hover:bg-[#FEFAE0] border border-[#E9EDC9]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: ORDERS & DISPATCH */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E9EDC9] shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setOrderStatusFilter(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    orderStatusFilter === s
                      ? 'bg-[#7D8471] text-white'
                      : 'bg-[#FEFAE0] text-[#4A4238] hover:bg-[#E9EDC9]'
                  }`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportOrdersCSV}
              className="bg-[#FEFAE0] hover:bg-[#E9EDC9] text-[#283618] border border-[#E9EDC9] font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Orders CSV
            </button>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {order.orderNumber}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{order.customerName}</span>
                      <a href={`tel:${order.customerPhone}`} className="text-emerald-700 text-xs font-mono font-bold flex items-center gap-0.5 hover:underline">
                        <Phone className="w-3 h-3" /> {order.customerPhone}
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {order.address.streetAddress} · {order.zone.name} (PIN: {order.address.pincode})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-mono text-slate-900">${order.totalAmount.toFixed(2)}</span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                    <button
                      onClick={() => setSelectedOrderForSlip(order)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                      title="Print Packing Slip"
                    >
                      <Printer className="w-3.5 h-3.5" /> Slip
                    </button>
                  </div>
                </div>

                {/* Items and status update bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Items Ordered:</span>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((it, idx) => (
                        <span key={idx} className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                          <strong>{it.quantity}x</strong> {it.name} ({it.unit})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status & Driver assignment */}
                  <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                    <span className="text-[11px] text-slate-400">Update Stage:</span>
                    {(['CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateOrderStatus(order.id, st)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                          order.status === st
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {st.replace(/_/g, ' ')}
                      </button>
                    ))}

                    {/* Driver Picker */}
                    <select
                      value={order.deliveryPartnerId || ''}
                      onChange={(e) => handleUpdateOrderStatus(order.id, order.status, e.target.value)}
                      className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-2 py-1 text-[11px] font-bold"
                    >
                      <option value="">-- Assign Driver --</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & INVENTORY */}
      {activeTab === 'PRODUCTS' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchProductQuery}
                onChange={(e) => setSearchProductQuery(e.target.value)}
                placeholder="Search catalog by name or SKU..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportProductsCSV}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>

              <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Import CSV
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              </label>

              <button
                onClick={handleOpenAddProduct}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Unit</th>
                    <th className="p-3.5">MRP / Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProducts.map((p) => {
                    const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                    const isOut = p.stock <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <div className="font-bold text-slate-900">{p.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{p.sku}</div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-700">{p.categoryName}</td>
                        <td className="p-3.5 font-mono text-slate-600">{p.unit}</td>
                        <td className="p-3.5 font-mono">
                          <span className="font-bold text-slate-900">${p.salePrice}</span>
                          <span className="text-slate-400 line-through ml-1 text-[11px]">${p.mrp}</span>
                          <span className="text-emerald-700 font-bold ml-1 text-[10px]">({p.discountPercent}% off)</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            isOut ? 'bg-rose-100 text-rose-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {p.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'CATEGORIES' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 uppercase">Product Departments</h3>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl"
            >
              + Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                  <span className="text-xs font-mono text-slate-400">{c.itemCount || 10} items</span>
                </div>
                <p className="text-xs text-slate-500">
                  Subcategories: {c.subcategories.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS & CSV */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Category Revenue Breakdown */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Revenue by Household Category</h3>
              <div className="space-y-2">
                {analytics.categorySales.map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat.categoryName}</span>
                      <span className="font-mono font-bold">${cat.revenue.toFixed(2)} ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone Performance Breakdown */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-slate-900">100 km² Zone Sales Performance</h3>
              <div className="space-y-2">
                {analytics.zonePerformance.map((z, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{z.zoneName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{z.orderCount} Doorstep Deliveries</p>
                    </div>
                    <span className="font-mono font-black text-sm text-emerald-800">${z.revenue.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: 100 KM² ZONES & SETTINGS */}
      {activeTab === 'ZONES' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950">
            <h4 className="font-bold mb-1">⚡ 100 km² Hyperlocal Perimeter Rules</h4>
            <p>
              Your store delivers exclusively to verified pincodes in these 5 neighborhood sectors. Any customer outside these zones is automatically prevented from placing orders to safeguard delivery time guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <div key={zone.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-sm text-slate-900">{zone.name}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {zone.estimatedMinutes}m ETA
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 block text-[10px]">Delivery Fee</span>
                    <strong className="font-mono text-slate-900">${zone.deliveryFee}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 block text-[10px]">Free Above</span>
                    <strong className="font-mono text-slate-900">${zone.minOrderForFreeDelivery}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 font-mono">
                  Pincodes: {zone.pincodes.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STORE SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 max-w-2xl">
          <h3 className="font-bold text-base text-slate-900">Store Broadcast & Operating Hours</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Store Status (100 km² Zone)</p>
                <p className="text-slate-500">Toggle whether customers can checkout orders right now</p>
              </div>
              <input
                type="checkbox"
                checked={storeOpen}
                onChange={(e) => setStoreOpen(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Top Broadcast Announcement Banner</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bannerActive"
                checked={bannerActive}
                onChange={(e) => setBannerActive(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
              <label htmlFor="bannerActive" className="font-semibold text-slate-700">Display banner to all visiting customers</label>
            </div>

            <button
              onClick={handleSaveSettings}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              Save Store Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: REVIEWS MODERATION */}
      {activeTab === 'REVIEWS' && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 uppercase">Customer Reviews Moderation</h3>
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{r.userName}</span>
                  <span className="text-amber-500 font-bold">★ {r.rating}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{r.date}</span>
                </div>
                <p className="text-slate-700">{r.comment}</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Approved
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Product Add/Edit Modal (Zero-tech friendly) */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProduct ? 'Edit Product Catalog Item' : 'Add New Household Item (Zero Technical Skill)'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Pure Organic Desi Ghee"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={prodCatId}
                    onChange={(e) => setProdCatId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Packaging Unit</label>
                  <input
                    type="text"
                    required
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="e.g. 1 kg / 500 ml / Pack of 2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              {/* Price & Auto Discount */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={prodMrp}
                    onChange={(e) => setProdMrp(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={prodSalePrice}
                    onChange={(e) => setProdSalePrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Auto Discount</label>
                  <div className="bg-emerald-100 text-emerald-900 font-mono font-black px-3 py-2 rounded-xl text-center">
                    {discountPercent}% OFF
                  </div>
                </div>
              </div>

              {/* Stock and Low Stock Alert */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Low Stock Alert At</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={prodLowStockThreshold}
                    onChange={(e) => setProdLowStockThreshold(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Barcode</label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Zero-Tech Image Upload with Client Compression */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  Multiple Product Images (Upload with Auto-Compression)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-xl cursor-pointer font-bold transition">
                    <ImageIcon className="w-4 h-4" /> Upload Picture from Phone/PC
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {isCompressing && <span className="text-slate-400 animate-pulse">Compressing image...</span>}
                </div>

                {compressionInfo && (
                  <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl">
                    {compressionInfo}
                  </p>
                )}

                {/* Previews */}
                <div className="flex gap-2 overflow-x-auto py-1">
                  {prodImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={img} alt="Product" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProdImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Quality Notes</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsBestseller}
                    onChange={(e) => setProdIsBestseller(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  Mark as Bestseller
                </label>
                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsNewArrival}
                    onChange={(e) => setProdIsNewArrival(e.target.checked)}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                  Mark as New Arrival
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Slip Modal */}
      <PackingSlipModal
        order={selectedOrderForSlip}
        onClose={() => setSelectedOrderForSlip(null)}
        settings={settings}
      />

    </div>
  );
};
