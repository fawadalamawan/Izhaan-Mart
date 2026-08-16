import React, { useState } from 'react';
import {
  X,
  Database,
  Server,
  Code,
  Layers,
  Shield,
  FileText,
  Copy,
  Check,
  CheckCircle,
  Sparkles,
  GitBranch
} from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'SCHEMA' | 'API' | 'DOCKER' | 'CICD' | 'LEGAL'>('SCHEMA');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const postgresDDL = `-- DailyNest Mart: Production Hyperlocal PostgreSQL Schema
-- Optimized for ~100 sq km zone delivery, inventory locks & fast catalog lookups

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Users Table (Role-based authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    role VARCHAR(20) DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN', 'DELIVERY_PERSON')),
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Delivery Zones Table (~100 sq km perimeter)
CREATE TABLE delivery_zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pincodes TEXT[] NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 20.00,
    min_order_for_free_delivery NUMERIC(10, 2) DEFAULT 299.00,
    estimated_minutes INTEGER DEFAULT 30,
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Customer Addresses Table with Geo Coordinates
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(30) DEFAULT 'Home',
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    street_address TEXT NOT NULL,
    apartment_floor VARCHAR(100),
    landmark VARCHAR(150),
    pincode VARCHAR(10) NOT NULL,
    zone_id VARCHAR(50) REFERENCES delivery_zones(id),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_default BOOLEAN DEFAULT FALSE
);

-- 4. Categories Table
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    subcategories TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0
);

-- 5. Products & Inventory Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id VARCHAR(50) REFERENCES categories(id),
    subcategory VARCHAR(100),
    unit VARCHAR(50) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2) NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    images TEXT[] NOT NULL,
    tags TEXT[] DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Orders & Dispatch Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    address_id UUID REFERENCES addresses(id),
    zone_id VARCHAR(50) REFERENCES delivery_zones(id),
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    coupon_code VARCHAR(30),
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('UPI', 'COD', 'CARD', 'WALLET')),
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    status VARCHAR(30) DEFAULT 'PLACED' CHECK (status IN ('PLACED', 'CONFIRMED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED')),
    delivery_partner_id UUID REFERENCES users(id),
    delivery_slot VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Order Items (Snapshot table)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(200) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    image_url TEXT
);

-- Indexes for lightning fast queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_stock ON products(stock_quantity);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);`;

  const dockerComposeYaml = `version: '3.8'

services:
  # DailyNest Web PWA & Express API Backend
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: dailynest-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgres://dailynest_user:securepass123@postgres:5432/dailynest_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=production_secret_key_89234872938472938472
      - RAZORPAY_KEY_ID=\${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=\${RAZORPAY_KEY_SECRET}
      - AWS_S3_BUCKET=\${AWS_S3_BUCKET}
      - AWS_ACCESS_KEY_ID=\${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=\${AWS_SECRET_ACCESS_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  # PostgreSQL Database for ACID Transactions & Inventory
  postgres:
    image: postgres:15-alpine
    container_name: dailynest-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: dailynest_user
      POSTGRES_PASSWORD: securepass123
      POSTGRES_DB: dailynest_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dailynest_user -d dailynest_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis for Session Cache & Rate Limiting
  redis:
    image: redis:7-alpine
    container_name: dailynest-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`;

  const githubActionsYaml = `name: DailyNest CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Setup Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'

    - name: Install Dependencies
      run: npm ci

    - name: Run ESLint & Typecheck
      run: |
        npm run lint || true
        npx tsc --noEmit

    - name: Build Web Application
      run: npm run build

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Build Container Image
      run: docker build -t dailynest-mart:latest .`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display">
                Production Architecture, Schemas & Legal Policies
              </h2>
              <p className="text-xs text-slate-400">
                Turnkey Technical Specs for Single-Store Hyperlocal Operations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {[
            { id: 'SCHEMA', label: 'PostgreSQL DDL Schema', icon: <Database className="w-4 h-4" /> },
            { id: 'DOCKER', label: 'Docker Compose', icon: <Layers className="w-4 h-4" /> },
            { id: 'CICD', label: 'GitHub Actions CI/CD', icon: <GitBranch className="w-4 h-4" /> },
            { id: 'LEGAL', label: 'Legal & Store Policies', icon: <Shield className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {activeTab === 'SCHEMA' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Production SQL DDL with Foreign Keys & Indexes</span>
                <button
                  onClick={() => handleCopy('SCHEMA', postgresDDL)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"
                >
                  {copiedKey === 'SCHEMA' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'SCHEMA' ? 'Copied' : 'Copy DDL'}
                </button>
              </div>

              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                {postgresDDL}
              </pre>
            </div>
          )}

          {activeTab === 'DOCKER' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">docker-compose.yml (Web + Express + Postgres + Redis)</span>
                <button
                  onClick={() => handleCopy('DOCKER', dockerComposeYaml)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"
                >
                  {copiedKey === 'DOCKER' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'DOCKER' ? 'Copied' : 'Copy Compose YAML'}
                </button>
              </div>

              <pre className="bg-slate-950 text-blue-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                {dockerComposeYaml}
              </pre>
            </div>
          )}

          {activeTab === 'CICD' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">.github/workflows/deploy.yml</span>
                <button
                  onClick={() => handleCopy('CICD', githubActionsYaml)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"
                >
                  {copiedKey === 'CICD' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'CICD' ? 'Copied' : 'Copy Workflow'}
                </button>
              </div>

              <pre className="bg-slate-950 text-amber-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                {githubActionsYaml}
              </pre>
            </div>
          )}

          {activeTab === 'LEGAL' && (
            <div className="space-y-6 text-xs text-slate-700">
              
              {/* Privacy Policy */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">1. Customer Privacy & Neighborhood Data Policy</h4>
                <p>
                  DailyNest Mart values resident privacy. Customer mobile numbers and delivery coordinates are strictly used to fulfill neighborhood deliveries within our 100 sq km boundary. Data is encrypted in transit and at rest. We never sell customer data to third parties.
                </p>
              </div>

              {/* Terms of Service */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">2. Terms of Neighborhood Service</h4>
                <p>
                  Orders are accepted only for addresses located inside the 5 defined neighborhood zones. Deliveries are dispatched within the chosen time slot using electric cargo bikes. In case of extreme weather, residents will be notified via SMS of any schedule shifts.
                </p>
              </div>

              {/* Return & Refund Policy */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">3. No-Questions Doorstep Return & Refund Policy</h4>
                <p>
                  If any fresh item, dairy, or grocery product is unsatisfactory, damaged, or expired upon delivery, customers can submit a 1-click return request via the app or directly to the delivery rider for an immediate replacement or full refund to original payment source.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
