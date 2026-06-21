export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  display_order: number;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  brand?: string | null;
  price_dzd: number;
  compare_at_price_dzd?: number | null;
  category_id?: string | null;
  stock_quantity: number;
  sku?: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  // Joined or virtual attributes
  category_name?: string;
  images?: ProductImage[];
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  wilaya: string;
  shipping_address: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  stripe_payment_intent_id?: string | null;
  subtotal_dzd: number;
  shipping_cost_dzd: number;
  total_dzd: number;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  unit_price_dzd_snapshot: number;
  quantity: number;
  subtotal_dzd: number;
}

export interface StoreSettings {
  id: number;
  store_name: string;
  phone?: string | null;
  address?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
}

export interface AdminProfile {
  id: string;
  full_name?: string | null;
  role: 'owner' | 'admin';
  created_at?: string;
}
