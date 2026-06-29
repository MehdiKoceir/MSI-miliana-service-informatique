import React from 'react';
import { Heart, ShoppingCart, Trash2, Eye, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store/wishlist';
import { useCartStore } from '../store/cart';
import { Product } from '../types/store';
import MetadataHelper from '../components/MetadataHelper';

interface WishlistProps {
  onViewProduct: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Wishlist({ onViewProduct, setCurrentTab }: WishlistProps) {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (product.stock_quantity > 0) {
      addItem(product, 1);
    }
  };

  const handleRemove = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    removeItem(productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8 min-h-[600px]">
      <MetadataHelper 
        title="Ma Liste de Souhaits" 
        description="Consultez et gérez vos articles high-tech et informatiques préférés mis de côté." 
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 px-2.5 bg-red-950/40 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded font-mono flex items-center gap-1.5">
              <Heart className="w-3 h-3 fill-current text-red-500" /> FAVORIS PERSISTANTS
            </span>
          </div>
          <h2 className="text-3xl font-black italic tracking-tight font-display text-white uppercase">
            Ma Liste d'Envies
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Retrouvez ici tous les produits que vous avez mis de côté pour vos futurs achats.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs font-mono text-red-400 hover:text-red-300 border border-red-900/40 hover:bg-red-950/20 px-4 py-2 rounded-lg transition-all cursor-pointer"
            id="btn-clear-wishlist"
          >
            Vider la liste ({items.length})
          </button>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#090909] border border-white/5 rounded-2xl p-8 max-w-lg mx-auto w-full">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-6 text-slate-500 animate-pulse">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase font-display tracking-wide mb-2">Votre liste est vide</h3>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-8">
            Parcourez notre catalogue d'ordinateurs, de téléphones et de périphériques de jeu et cliquez sur l'icône de cœur pour sauvegarder des articles ici !
          </p>
          <button
            onClick={() => setCurrentTab('boutique')}
            className="bg-[#D4AF37] text-black font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:bg-[#FFF3D1] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            id="wishlist-back-to-store"
          >
            Explorer la boutique <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => {
            const primaryImg = product.images?.find((img) => img.is_primary) || product.images?.[0];
            const imageUrl = primaryImg?.url || "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=600&q=80";
            const isOutOfStock = product.stock_quantity <= 0;

            return (
              <div
                key={product.id}
                onClick={() => onViewProduct(product)}
                className="bg-[#111] border border-white/10 rounded-xl overflow-hidden group hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-[0_0_15px_rgba(212,175,55,0.08)] relative"
                id={`wishlist-card-${product.id}`}
              >
                {/* Remove button absolute top-3 right-3 */}
                <button
                  onClick={(e) => handleRemove(e, product.id)}
                  className="absolute top-3 right-3 z-20 p-2 bg-black/70 border border-white/10 text-slate-400 hover:text-red-500 rounded-full hover:bg-black transition-all cursor-pointer"
                  title="Retirer des favoris"
                  id={`btn-remove-wishlist-${product.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="relative aspect-square w-full bg-[#161616] flex items-center justify-center overflow-hidden border-b border-white/5">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-[2px] z-10">
                      <span className="border border-red-500 text-red-500 font-extrabold text-xs uppercase px-3 py-1.5 tracking-widest font-display rounded">
                        En Rupture
                      </span>
                    </div>
                  )}

                  {/* Dark mask overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProduct(product);
                      }}
                      className="p-2.5 bg-white text-black hover:bg-[#D4AF37] hover:scale-110 transition-all rounded-full"
                      title="Consulter"
                      id={`btn-wishlist-view-${product.id}`}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest font-mono">
                      {product.brand || "MTS BRAND"}
                    </span>
                    <h4 className="font-bold text-sm text-slate-200 mt-1 group-hover:text-white transition-colors leading-tight font-display line-clamp-1">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm font-black font-mono text-white tracking-tight">
                      {product.price_dzd.toLocaleString()} <span className="text-[10px] font-semibold text-[#D4AF37]">DZD</span>
                    </span>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={isOutOfStock}
                      className={`p-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border border-white/10 ${
                        isOutOfStock
                          ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                          : 'bg-white/5 text-[#D4AF37] border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black hover:scale-105'
                      }`}
                      title={isOutOfStock ? "Indisponible" : "Ajouter au Panier"}
                      id={`btn-wishlist-cart-${product.id}`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Prendre</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
