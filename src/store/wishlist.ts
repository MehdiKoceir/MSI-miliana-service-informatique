import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/store';

interface WishlistState {
  items: Product[];
  toggleItem: (product: Product) => void;
  hasItem: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item.id === product.id);
        
        if (exists) {
          set({
            items: currentItems.filter((item) => item.id !== product.id),
          });
        } else {
          set({
            items: [...currentItems, product],
          });
        }
      },
      hasItem: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'msi-wishlist-storage', // name of the item in storage (must be unique)
    }
  )
);
