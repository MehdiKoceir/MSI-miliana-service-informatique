import React from 'react';
import { ShoppingCart, Eye, Tag } from 'lucide-react';
import { Product } from '../types/store';
import { useCartStore } from '../store/cart';

interface ProductCardProps {
  key?: React.Key | string;
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  
  const primaryImg = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const imageUrl = primaryImg?.url || "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=600&q=80";

  const discount = product.compare_at_price_dzd 
    ? Math.round(((product.compare_at_price_dzd - product.price_dzd) / product.compare_at_price_dzd) * 100)
    : 0;

  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product, 1);
    }
  };

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden group hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-[0_0_15px_rgba(212,175,55,0.08)]"
      id={`product-card-${product.id}`}
    >
      <div className="relative aspect-square w-full bg-[#161616] flex items-center justify-center overflow-hidden border-b border-white/5">
        <img 
          src={imageUrl} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out" 
        />
        
        {/* Discount tag */}
        {discount > 0 && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-wider rounded font-mono">
            -{discount}%
          </span>
        )}

        {/* Low Stock indicator */}
        {product.stock_quantity > 0 && product.stock_quantity <= 3 && (
          <span className="absolute top-3 right-3 bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[9px] font-black px-2 py-0.5 uppercase tracking-wider rounded font-mono">
            Presque épuisé
          </span>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-[2px]">
            <span className="border border-red-500 text-red-500 font-extrabold text-xs uppercase px-3 py-1.5 tracking-widest font-display rounded">
              En Rupture
            </span>
          </div>
        )}

        {/* Quick View overlay on desktop */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-2.5 bg-white text-black hover:bg-[#D4AF37] hover:scale-110 transition-all duration-200 rounded-full"
            title="Consulter la fiche"
            id={`btn-view-${product.id}`}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest font-mono">
              {product.brand || "MSI ORIGINAL"}
            </span>
            {product.sku && (
              <span className="text-[9px] font-mono text-slate-500 tracking-tighter">
                Ref: {product.sku}
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors leading-tight font-display line-clamp-1">
            {product.name}
          </h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description || "Aucune description fournie."}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            {product.compare_at_price_dzd ? (
              <span className="text-[11px] text-slate-500 line-through font-mono">
                {product.compare_at_price_dzd.toLocaleString()} DZD
              </span>
            ) : null}
            <span className="text-md font-black font-mono text-white tracking-tight">
              {product.price_dzd.toLocaleString()} <span className="text-xs font-semibold text-[#D4AF37]">DZD</span>
            </span>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${
              isOutOfStock 
                ? 'bg-white/5 text-slate-600 cursor-not-allowed' 
                : 'bg-white/5 text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black hover:scale-105 hover:shadow-[0_0_10px_rgba(212,175,55,0.2)]'
            }`}
            title={isOutOfStock ? "Indisponible" : "Ajouter au Panier"}
            id={`btn-add-cart-${product.id}`}
          >
            <ShoppingCart className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
