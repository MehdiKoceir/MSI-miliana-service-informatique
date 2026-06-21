import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/store';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const exists = currentItems.find((item) => item.product.id === product.id);

        if (exists) {
          // Verify stock limit on adding
          const potentialQty = exists.quantity + quantity;
          const finalQty = Math.min(potentialQty, product.stock_quantity);
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: finalQty }
                : item
            ),
          });
        } else {
          set({
            items: [...currentItems, { product, quantity: Math.min(quantity, product.stock_quantity) }],
          });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i.product.id === productId);
        if (!item) return;

        const maxStock = item.product.stock_quantity;
        const finalQuantity = Math.max(1, Math.min(quantity, maxStock));

        set({
          items: currentItems.map((item) =>
            item.product.id === productId ? { ...item, quantity: finalQuantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price_dzd * item.quantity, 0);
      },
      getCartCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'msi-cart-storage', // name of the item in storage (must be unique)
    }
  )
);
