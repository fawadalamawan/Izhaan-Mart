import { Product, Category, DeliveryZone, Coupon, DeliverySlot, StoreSettings, DeliveryPerson, User, Order } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-groceries',
    name: 'Daily Groceries & Staples',
    slug: 'groceries-staples',
    icon: 'Wheat',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
    subcategories: ['Atta & Flours', 'Rice & Grains', 'Pulses & Dal', 'Oils & Ghee', 'Spices & Masalas'],
    itemCount: 18,
  },
  {
    id: 'cat-dairy',
    name: 'Dairy, Bread & Eggs',
    slug: 'dairy-bread-eggs',
    icon: 'Milk',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60',
    subcategories: ['Fresh Milk', 'Paneer & Curd', 'Butter & Cheese', 'Bread & Bakery', 'Farm Eggs'],
    itemCount: 14,
  },
  {
    id: 'cat-cleaning',
    name: 'Home Cleaning & Laundry',
    slug: 'cleaning-home-care',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=60',
    subcategories: ['Detergent Liquids & Bars', 'Floor & Surface Cleaners', 'Dishwashers', 'Toilet Cleaners', 'Mops & Wipes'],
    itemCount: 16,
  },
  {
    id: 'cat-personal',
    name: 'Personal Care & Hygiene',
    slug: 'personal-care-hygiene',
    icon: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
    subcategories: ['Soaps & Body Wash', 'Shampoos & Hair Care', 'Oral Care', 'Hand Sanitizers & Wash', 'Skin Creams'],
    itemCount: 12,
  },
  {
    id: 'cat-snacks',
    name: 'Snacks, Tea & Beverages',
    slug: 'snacks-beverages',
    icon: 'Coffee',
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&auto=format&fit=crop&q=60',
    subcategories: ['Tea & Coffee Powders', 'Biscuits & Cookies', 'Chips & Namkeen', 'Instant Noodles', 'Health Drinks'],
    itemCount: 15,
  },
  {
    id: 'cat-kitchen',
    name: 'Kitchenware & Disposables',
    slug: 'kitchen-disposables',
    icon: 'UtensilsCrossed',
    image: 'https://images.unsplash.com/photo-1584990347449-34b8c9d46f5b?w=500&auto=format&fit=crop&q=60',
    subcategories: ['Foil & Food Wraps', 'Garbage Bags', 'Storage Containers', 'Paper Towels', 'Kitchen Sponges'],
    itemCount: 10,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Premium Sharbati Whole Wheat Atta',
    description: '100% pure stone-ground chakki fresh Sharbati whole wheat flour. Makes ultra-soft rotis that stay fresh for 12+ hours. No added maida or preservatives.',
    categoryId: 'cat-groceries',
    categoryName: 'Daily Groceries & Staples',
    subcategory: 'Atta & Flours',
    unit: '5 kg',
    mrp: 320,
    salePrice: 265,
    discountPercent: 17,
    stock: 45,
    lowStockThreshold: 10,
    isActive: true,
    isBestseller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 42,
    sku: 'FLR-WHT-005',
    tags: ['staples', 'chakki-fresh', 'fiber-rich', 'bestseller']
  },
  {
    id: 'prod-2',
    name: 'Farm Fresh Full Cream A2 Milk',
    description: 'Pasteurized homogenised fresh farm milk rich in calcium and natural fats. Sourced daily from local pasture-raised cows within 15 km of our store.',
    categoryId: 'cat-dairy',
    categoryName: 'Dairy, Bread & Eggs',
    subcategory: 'Fresh Milk',
    unit: '1 L',
    mrp: 75,
    salePrice: 66,
    discountPercent: 12,
    stock: 28,
    lowStockThreshold: 8,
    isActive: true,
    isBestseller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 89,
    sku: 'DRY-MLK-001',
    tags: ['fresh', 'daily-essential', 'dairy']
  },
  {
    id: 'prod-3',
    name: 'Advanced Lemon Gel Dishwash Concentrate',
    description: 'Tough on burnt grease, gentle on hands. Leaves stainless steel and glassware sparkling clean with zero residue and fresh citrus fragrance.',
    categoryId: 'cat-cleaning',
    categoryName: 'Home Cleaning & Laundry',
    subcategory: 'Dishwashers',
    unit: '750 ml Bottle',
    mrp: 185,
    salePrice: 145,
    discountPercent: 22,
    stock: 35,
    lowStockThreshold: 10,
    isActive: true,
    isBestseller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 31,
    sku: 'CLN-DSH-750',
    tags: ['cleaning', 'dishwash', 'lemon-power']
  },
  {
    id: 'prod-4',
    name: 'Golden Basmati Long Grain Royal Rice',
    description: 'Aged for 2 years. Extra-long pearl grains that fluff up twice their length upon cooking. Ideal for biryanis, pulavs, and daily royal meals.',
    categoryId: 'cat-groceries',
    categoryName: 'Daily Groceries & Staples',
    subcategory: 'Rice & Grains',
    unit: '5 kg Bag',
    mrp: 580,
    salePrice: 475,
    discountPercent: 18,
    stock: 22,
    lowStockThreshold: 5,
    isActive: true,
    isBestseller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 56,
    sku: 'RCE-BSM-005',
    tags: ['rice', 'aged-grain', 'staples']
  },
  {
    id: 'prod-5',
    name: 'Ultra Mat Matic Front & Top Load Detergent Liquid',
    description: 'Formulated with enzyme stain-busters for swift stain removal in 1 wash. Protects fabric color, leaves pleasant floral aroma.',
    categoryId: 'cat-cleaning',
    categoryName: 'Home Cleaning & Laundry',
    subcategory: 'Detergent Liquids & Bars',
    unit: '2 Litre',
    mrp: 440,
    salePrice: 349,
    discountPercent: 21,
    stock: 19,
    lowStockThreshold: 6,
    isActive: true,
    isBestseller: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.6,
    reviewCount: 18,
    sku: 'CLN-LQD-002',
    tags: ['laundry', 'detergent', 'machine-wash']
  },
  {
    id: 'prod-6',
    name: 'Unpolished Toor Dal (Pigeon Pea Pulses)',
    description: 'High in natural dietary fiber and plant protein. No artificial polishing or chemical treatments for maximum wholesome nutrition.',
    categoryId: 'cat-groceries',
    categoryName: 'Daily Groceries & Staples',
    subcategory: 'Pulses & Dal',
    unit: '1 kg Pack',
    mrp: 190,
    salePrice: 158,
    discountPercent: 17,
    stock: 40,
    lowStockThreshold: 8,
    isActive: true,
    isBestseller: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 29,
    sku: 'PLS-TOR-001',
    tags: ['dal', 'organic', 'protein']
  },
  {
    id: 'prod-7',
    name: 'Fresh Farm Brown Eggs (High Protein)',
    description: 'Pack of 12 antibiotic-free, hormone-free brown eggs from free-roaming hens. Rich in Omega-3 and Vitamin D3.',
    categoryId: 'cat-dairy',
    categoryName: 'Dairy, Bread & Eggs',
    subcategory: 'Farm Eggs',
    unit: 'Pack of 12',
    mrp: 130,
    salePrice: 105,
    discountPercent: 19,
    stock: 14,
    lowStockThreshold: 5,
    isActive: true,
    isBestseller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 77,
    sku: 'EGG-BRN-012',
    tags: ['eggs', 'fresh', 'breakfast', 'protein']
  },
  {
    id: 'prod-8',
    name: 'Organic Virgin Cold-Pressed Coconut Oil',
    description: '100% pure cold-pressed coconut oil. Multi-purpose for healthy cooking, hair care, skin hydration, and oil pulling.',
    categoryId: 'cat-groceries',
    categoryName: 'Daily Groceries & Staples',
    subcategory: 'Oils & Ghee',
    unit: '500 ml Glass Jar',
    mrp: 275,
    salePrice: 219,
    discountPercent: 20,
    stock: 25,
    lowStockThreshold: 6,
    isActive: true,
    isBestseller: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 38,
    sku: 'OIL-CCN-500',
    tags: ['cold-pressed', 'organic', 'healthy-oil']
  },
  {
    id: 'prod-9',
    name: 'Disinfectant Surface & Floor Cleaner (Pine & Floral)',
    description: 'Kills 99.9% germs and viruses. Removes hard water stains, leaves shiny streak-free tiles, and keeps mosquitoes & bugs at bay.',
    categoryId: 'cat-cleaning',
    categoryName: 'Home Cleaning & Laundry',
    subcategory: 'Floor & Surface Cleaners',
    unit: '1 Litre Bottle',
    mrp: 170,
    salePrice: 135,
    discountPercent: 21,
    stock: 5, // low stock test
    lowStockThreshold: 8,
    isActive: true,
    isBestseller: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.5,
    reviewCount: 19,
    sku: 'CLN-FLR-001',
    tags: ['cleaning', 'germ-killer', 'fresh-pine']
  },
  {
    id: 'prod-10',
    name: 'Artisan Sourdough Whole Grain Loaf',
    description: 'Naturally fermented over 36 hours with zero artificial yeast or preservatives. Rich crust and soft, chewy crumb. Baked fresh every sunrise.',
    categoryId: 'cat-dairy',
    categoryName: 'Dairy, Bread & Eggs',
    subcategory: 'Bread & Bakery',
    unit: '400 g Loaf',
    mrp: 95,
    salePrice: 80,
    discountPercent: 16,
    stock: 12,
    lowStockThreshold: 4,
    isActive: true,
    isBestseller: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 46,
    sku: 'BRD-SRD-400',
    tags: ['fresh-baked', 'artisanal', 'gut-friendly']
  },
  {
    id: 'prod-11',
    name: 'Biodegradable Heavy Duty Garbage Bags (Medium)',
    description: 'Tear-resistant oxo-biodegradable waste bin liner bags with convenient tie strings. Fits 30L standard household kitchen bins.',
    categoryId: 'cat-kitchen',
    categoryName: 'Kitchenware & Disposables',
    subcategory: 'Garbage Bags',
    unit: 'Pack of 30 Bags',
    mrp: 140,
    salePrice: 110,
    discountPercent: 21,
    stock: 50,
    lowStockThreshold: 10,
    isActive: true,
    isBestseller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 25,
    sku: 'KTC-BAG-030',
    tags: ['eco-friendly', 'kitchen-essential', 'trash-bags']
  },
  {
    id: 'prod-12',
    name: 'Assam CTC Strong Kadak Gold Tea',
    description: 'Handpicked orthodox blend from select upper Assam tea estates. Rich amber color, brisk aroma, and bold flavor to kickstart your morning.',
    categoryId: 'cat-snacks',
    categoryName: 'Snacks, Tea & Beverages',
    subcategory: 'Tea & Coffee Powders',
    unit: '500 g Pack',
    mrp: 290,
    salePrice: 235,
    discountPercent: 19,
    stock: 32,
    lowStockThreshold: 7,
    isActive: true,
    isBestseller: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 52,
    sku: 'SNK-TEA-500',
    tags: ['chai', 'kadak-tea', 'beverage']
  }
];

export const INITIAL_ZONES: DeliveryZone[] = [
  {
    id: 'zone-north',
    name: 'Zone A: Green Valley & Northgate',
    code: 'ZN-NORTH',
    pincodes: ['10001', '10002', '10011'],
    areaCoverageKm2: 22,
    deliveryFee: 20,
    minOrderForFreeDelivery: 299,
    estimatedMinutes: 30,
    isActive: true,
    centerCoordinates: { lat: 12.985, lng: 77.595 },
    neighborhoodHighlights: ['Rosewood Enclave', 'North Central Park', 'Green Meadows', 'Valley View Apts']
  },
  {
    id: 'zone-central',
    name: 'Zone B: Downtown Core & Heritage Square',
    code: 'ZN-CENTRAL',
    pincodes: ['10003', '10004', '10012'],
    areaCoverageKm2: 18,
    deliveryFee: 15,
    minOrderForFreeDelivery: 249,
    estimatedMinutes: 25,
    isActive: true,
    centerCoordinates: { lat: 12.971, lng: 77.594 },
    neighborhoodHighlights: ['Main Bazaar Road', 'Heritage Towers', 'Civic Center', 'Clocktower Avenue']
  },
  {
    id: 'zone-east',
    name: 'Zone C: East Ridge & Riverwalk Colony',
    code: 'ZN-EAST',
    pincodes: ['10005', '10006', '10013'],
    areaCoverageKm2: 24,
    deliveryFee: 25,
    minOrderForFreeDelivery: 349,
    estimatedMinutes: 40,
    isActive: true,
    centerCoordinates: { lat: 12.975, lng: 77.625 },
    neighborhoodHighlights: ['Riverside Promenade', 'East Ridge Heights', 'Sunnyvale Park', 'Lakeview Villas']
  },
  {
    id: 'zone-tech',
    name: 'Zone D: Tech City & Silicon Heights',
    code: 'ZN-TECH',
    pincodes: ['10007', '10008', '10014'],
    areaCoverageKm2: 20,
    deliveryFee: 20,
    minOrderForFreeDelivery: 299,
    estimatedMinutes: 35,
    isActive: true,
    centerCoordinates: { lat: 12.935, lng: 77.615 },
    neighborhoodHighlights: ['Silicon Boulevard', 'Cyber Residency', 'Metro Square', 'Orchid Towers']
  },
  {
    id: 'zone-west',
    name: 'Zone E: West End & University Quarter',
    code: 'ZN-WEST',
    pincodes: ['10009', '10010', '10015'],
    areaCoverageKm2: 16,
    deliveryFee: 30,
    minOrderForFreeDelivery: 399,
    estimatedMinutes: 45,
    isActive: true,
    centerCoordinates: { lat: 12.960, lng: 77.550 },
    neighborhoodHighlights: ['Campus Town', 'West Horizon Layout', 'Oakwood Colony', 'Professor Row']
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME50',
    discountType: 'FLAT',
    discountValue: 50,
    minOrderValue: 250,
    description: 'Flat $50 OFF on your first grocery delivery order',
    validUntil: '2026-12-31',
    isActive: true
  },
  {
    code: 'HOUSEHOLD15',
    discountType: 'PERCENT',
    discountValue: 15,
    minOrderValue: 400,
    maxDiscount: 100,
    description: '15% instant discount on orders above $400 (Max $100)',
    validUntil: '2026-12-31',
    isActive: true
  },
  {
    code: 'FREESHIP',
    discountType: 'FLAT',
    discountValue: 30,
    minOrderValue: 199,
    description: 'Free Zero-Fee Neighborhood Delivery',
    validUntil: '2026-12-31',
    isActive: true
  }
];

export const INITIAL_SLOTS: DeliverySlot[] = [
  {
    id: 'slot-today-express',
    label: 'Express 45-Min Delivery',
    dateLabel: 'Today (Immediate)',
    timeWindow: 'Within 30-45 minutes',
    isAvailable: true
  },
  {
    id: 'slot-today-evening',
    label: 'Evening Slot',
    dateLabel: 'Today',
    timeWindow: '5:00 PM – 7:30 PM',
    isAvailable: true
  },
  {
    id: 'slot-today-night',
    label: 'Late Evening Slot',
    dateLabel: 'Today',
    timeWindow: '8:00 PM – 10:00 PM',
    isAvailable: true
  },
  {
    id: 'slot-tmrw-morning',
    label: 'Early Morning Fresh',
    dateLabel: 'Tomorrow',
    timeWindow: '7:00 AM – 9:30 AM',
    isAvailable: true
  },
  {
    id: 'slot-tmrw-afternoon',
    label: 'Afternoon Slot',
    dateLabel: 'Tomorrow',
    timeWindow: '1:00 PM – 3:30 PM',
    isAvailable: true
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'Izhaan Mart',
  tagline: 'Fresh Groceries & Household Essentials within 100 sq km',
  phone: '+1 (555) 324-5968',
  whatsappNumber: '+15553245968',
  email: 'support@Izhaanmart.local',
  address: 'Shop #4-B, Central Market Complex, Downtown Avenue',
  serviceRadiusKm: 12,
  storeOpen: true,
  operatingHours: '6:30 AM – 10:30 PM (All 7 Days)',
  currencySymbol: '$',
  currencyCode: 'USD',
  taxIncludedInPrice: true,
  loyaltyPointsEarnRate: 1,
  broadcastBanner: {
    text: '⚡ Free 45-Minute Delivery across all 5 zones on orders above $299! Use code FREESHIP at checkout.',
    active: true,
    type: 'deal'
  }
};

export const INITIAL_DELIVERY_PERSONNEL: DeliveryPerson[] = [
  {
    id: 'dr-1',
    name: 'Michael Chen',
    phone: '+1 (555) 789-0123',
    vehicleNumber: 'EB-784-NY',
    status: 'AVAILABLE',
    activeOrdersCount: 1,
    rating: 4.9,
    completedDeliveries: 420
  },
  {
    id: 'dr-2',
    name: 'Sarah Rodriguez',
    phone: '+1 (555) 901-2345',
    vehicleNumber: 'EB-912-NY',
    status: 'AVAILABLE',
    activeOrdersCount: 0,
    rating: 4.8,
    completedDeliveries: 310
  },
  {
    id: 'dr-3',
    name: 'David Patel',
    phone: '+1 (555) 456-7890',
    vehicleNumber: 'EB-303-NY',
    status: 'ON_TRIP',
    activeOrdersCount: 2,
    rating: 4.9,
    completedDeliveries: 560
  }
];

export const INITIAL_SAMPLE_USER: User = {
  id: 'usr-customer-1',
  phone: '+1 (555) 678-9900',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  role: 'CUSTOMER',
  loyaltyPoints: 120,
  addresses: [
    {
      id: 'addr-1',
      userId: 'usr-customer-1',
      label: 'Home',
      streetAddress: 'Apartment 402, Pinecrest Residency, 14th Main Road',
      apartmentFloor: '4th Floor, Tower B',
      landmark: 'Opposite Green Valley Central Park',
      pincode: '10001',
      zoneId: 'zone-north',
      zoneName: 'Zone A: Green Valley & Northgate',
      isDefault: true,
      recipientName: 'Alex Morgan',
      recipientPhone: '+1 (555) 678-9900',
      coordinates: { lat: 12.986, lng: 77.596 }
    },
    {
      id: 'addr-2',
      userId: 'usr-customer-1',
      label: 'Work',
      streetAddress: 'Floor 3, Tech Hub Plaza, Silicon Boulevard',
      apartmentFloor: 'Suite 310',
      landmark: 'Near Metro Gate 2',
      pincode: '10007',
      zoneId: 'zone-tech',
      zoneName: 'Zone D: Tech City & Silicon Heights',
      isDefault: false,
      recipientName: 'Alex Morgan (Office)',
      recipientPhone: '+1 (555) 678-9900',
      coordinates: { lat: 12.936, lng: 77.616 }
    }
  ],
  createdAt: '2026-06-10T10:00:00.000Z'
};

export const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-10024',
    orderNumber: 'DN-8924',
    userId: 'usr-customer-1',
    customerName: 'Alex Morgan',
    customerPhone: '+1 (555) 678-9900',
    items: [
      {
        productId: 'prod-1',
        name: 'Premium Sharbati Whole Wheat Atta',
        unit: '5 kg',
        price: 265,
        mrp: 320,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=700&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-2',
        name: 'Farm Fresh Full Cream A2 Milk',
        unit: '1 L',
        price: 66,
        mrp: 75,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-7',
        name: 'Fresh Farm Brown Eggs (High Protein)',
        unit: 'Pack of 12',
        price: 105,
        mrp: 130,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=700&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 502,
    deliveryFee: 0,
    discountAmount: 50,
    couponCode: 'WELCOME50',
    totalAmount: 452,
    savedAmount: 128,
    address: INITIAL_SAMPLE_USER.addresses[0],
    zone: INITIAL_ZONES[0],
    slot: INITIAL_SLOTS[0],
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    status: 'OUT_FOR_DELIVERY',
    deliveryPartnerId: 'dr-1',
    deliveryPartnerName: 'Michael Chen',
    deliveryPartnerPhone: '+1 (555) 789-0123',
    deliveryEta: '18 mins away (Speeding on electric cargo bike)',
    liveLocation: { lat: 12.982, lng: 77.593 },
    timeline: [
      { status: 'PLACED', timestamp: '2026-08-16T05:20:00.000Z', title: 'Order Placed', note: 'Paid $452 via Instant UPI', completed: true },
      { status: 'CONFIRMED', timestamp: '2026-08-16T05:22:00.000Z', title: 'Confirmed by Store', note: 'Inventory reserved at Downtown Hub', completed: true },
      { status: 'PACKED', timestamp: '2026-08-16T05:32:00.000Z', title: 'Packed & Quality Checked', note: 'Sealed in insulated eco-carry bag', completed: true },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-08-16T05:40:00.000Z', title: 'Out for Doorstep Delivery', note: 'Assigned to Michael Chen', completed: true },
      { status: 'DELIVERED', timestamp: '', title: 'Delivered', note: 'Handed over at doorstep', completed: false }
    ],
    createdAt: '2026-08-16T05:20:00.000Z',
    updatedAt: '2026-08-16T05:40:00.000Z'
  },
  {
    id: 'ord-10020',
    orderNumber: 'DN-8710',
    userId: 'usr-customer-1',
    customerName: 'Alex Morgan',
    customerPhone: '+1 (555) 678-9900',
    items: [
      {
        productId: 'prod-3',
        name: 'Advanced Lemon Gel Dishwash Concentrate',
        unit: '750 ml Bottle',
        price: 145,
        mrp: 185,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=700&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-5',
        name: 'Ultra Mat Matic Front & Top Load Detergent Liquid',
        unit: '2 Litre',
        price: 349,
        mrp: 440,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=700&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 494,
    deliveryFee: 0,
    discountAmount: 0,
    totalAmount: 494,
    savedAmount: 131,
    address: INITIAL_SAMPLE_USER.addresses[0],
    zone: INITIAL_ZONES[0],
    slot: INITIAL_SLOTS[1],
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    deliveryPartnerId: 'dr-2',
    deliveryPartnerName: 'Sarah Rodriguez',
    deliveryPartnerPhone: '+1 (555) 901-2345',
    timeline: [
      { status: 'PLACED', timestamp: '2026-08-14T08:00:00.000Z', title: 'Order Placed', note: 'Cash on Delivery chosen', completed: true },
      { status: 'CONFIRMED', timestamp: '2026-08-14T08:05:00.000Z', title: 'Confirmed by Store', note: 'Items allocated', completed: true },
      { status: 'PACKED', timestamp: '2026-08-14T08:20:00.000Z', title: 'Packed', note: 'Boxed safely', completed: true },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-08-14T08:45:00.000Z', title: 'Out for Delivery', note: 'Rider on route', completed: true },
      { status: 'DELIVERED', timestamp: '2026-08-14T09:12:00.000Z', title: 'Delivered', note: 'Cash collected $494. Received by customer.', completed: true }
    ],
    createdAt: '2026-08-14T08:00:00.000Z',
    updatedAt: '2026-08-14T09:12:00.000Z'
  }
];
