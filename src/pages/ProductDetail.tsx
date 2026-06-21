import React, { useState } from 'react';
import { ShoppingCart, Undo2, ArrowLeft, Smartphone, Plus, Minus, KeyRound, ShieldAlert } from 'lucide-react';
import { Product } from '../types/store';
import { useCartStore } from '../store/cart';
import MetadataHelper from '../components/MetadataHelper';

interface ProductDetailProps {
  product: Product;
  onGoBack: () => void;
}

export default function ProductDetail({ product, onGoBack }: ProductDetailProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [qtyToAdd, setQtyToAdd] = useState(1);
  
  // Gallery swapper state
  const images = product.images || [];
  const primaryImg = images.find(img => img.is_primary) || images[0];
  const [activeImage, setActiveImage] = useState(primaryImg?.url || "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80");

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 3;

  const handleIncrement = () => {
    if (qtyToAdd < product.stock_quantity) {
      setQtyToAdd(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (qtyToAdd > 1) {
      setQtyToAdd(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addItem(product, qtyToAdd);
      setQtyToAdd(1);
    }
  };

  const discount = product.compare_at_price_dzd 
    ? Math.round(((product.compare_at_price_dzd - product.price_dzd) / product.compare_at_price_dzd) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* 
        ========================================================================
        LIMITATION DU RÉFÉRENCEMENT CLIENT-SIDE (SEO MITIGATION)
        ------------------------------------------------------------------------
        Comme ce projet est un SPA React exécuté côté client sans Next.js (SSR),
        l'indexation native par de simples scrapers de réseaux ou Google Bots
        qui ne lisent pas le JS sera limitée. 
        Pour mitiger ceci de façon optimale pour ce portfolio applicatif :
        1. Nous utilisons <MetadataHelper /> (Helmet) pour injecter dynamiquement
           les balises OpenGraph et le JSON-LD Schema.org dans le header de page.
        2. Nous avons écrit un middleware de détection de bots côté Express (server.ts) 
           qui intercepte les requêtes de User-Agents comme WhatsApp, Facebook, Twitter, 
           et pré-génère un HTML d'aperçu d'image/titre autonome pour le partage.
        ========================================================================
      */}
      <MetadataHelper 
        title={product.name} 
        description={product.description || "Miliana Service Informatique - Matériels de qualité."} 
        product={product}
        urlPath={`/produits/${product.slug}`}
      />

      {/* BACK BUTTON ACTION */}
      <button 
        onClick={onGoBack} 
        className="mb-8 hover:text-[#D4AF37] flex items-center gap-2 group transition-colors text-xs font-bold uppercase tracking-wider font-display font-mono"
        id="btn-back-to-catalog"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retourner au catalogue
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10">
        
        {/* IMAGES GALLERY SECTION */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-[#161616] border border-white/5 rounded-xl overflow-hidden flex items-center justify-center relative">
            <img 
              src={activeImage} 
              alt={product.name} 
              referrerPolicy="no-referrer"
              className="object-contain max-h-[450px] w-full h-full p-4" 
            />

            {discount > 0 && !isOutOfStock && (
              <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-xs font-black px-3 py-1 uppercase tracking-wider rounded font-mono">
                Offre Limitée -{discount}%
              </span>
            )}
          </div>

          {/* Sibling Thumbnails (If multiples listed) */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-20 h-20 bg-[#161616] border rounded-lg overflow-hidden shrink-0 transition-all ${
                    activeImage === img.url ? 'border-[#D4AF37] scale-105 shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'border-white/5 hover:border-white/20'
                  }`}
                  id={`btn-thumb-${img.id}`}
                >
                  <img src={img.url} alt="Aperçu miniature" className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS SPECIFICATION PANEL */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Header / Brand details */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-white/5 pb-4">
              <div>
                <span className="bg-[#1C180E] border border-[#D4AF37]/35 text-[#D4AF37] px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest font-mono select-none">
                  Marque : {product.brand || "MSI Officiel"}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Numéro d'article (SKU) : <strong className="text-slate-300">{product.sku || "Indéfini"}</strong>
              </span>
            </div>

            <h1 className="text-3xl font-black italic tracking-tight text-white mb-4 uppercase font-display leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-black font-mono text-white tracking-tight">
                {product.price_dzd.toLocaleString()} <span className="text-lg font-bold text-[#D4AF37]">DZD</span>
              </span>
              {product.compare_at_price_dzd ? (
                <span className="text-lg text-slate-500 line-through font-mono">
                  {product.compare_at_price_dzd.toLocaleString()} DZD
                </span>
              ) : null}
            </div>

            {/* Short specs descriptor */}
            <p className="text-sm text-slate-400 leading-relaxed mb-6 whitespace-pre-wrap">
              {product.description || "Aucun descriptif pour cet article de haute technologie. Contactez l'équipe MSI pour plus d'informations."}
            </p>

            {/* Display status details */}
            <div className="grid grid-cols-2 gap-4 bg-[#161616] border border-white/5 p-4 rounded-xl mb-8">
              <div>
                <span className="block text-[10px] font-extrabold uppercase text-slate-500 font-mono tracking-wider">État :</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Sous emballage (Neuf)</span>
              </div>
              <div>
                <span className="block text-[10px] font-extrabold uppercase text-slate-500 font-mono tracking-wider">Stock disponible :</span>
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-500 uppercase">Épuisé</span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-500">Seulement {product.stock_quantity} restants !</span>
                ) : (
                  <span className="text-xs font-bold text-green-500">En Stock ({product.stock_quantity} unités)</span>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-white/5 pt-6 mt-6">
            {!isOutOfStock && (
              <div className="flex items-center bg-[#161616] border border-white/10 rounded-xl p-1">
                <button 
                  onClick={handleDecrement}
                  disabled={qtyToAdd <= 1}
                  className="p-3 hover:text-[#D4AF37] disabled:text-slate-600 disabled:cursor-not-allowed text-slate-300 transition-colors"
                  title="Diminuer la quantité"
                  id="btn-qty-minus"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-mono font-black text-sm text-white select-none w-10 text-center">
                  {qtyToAdd}
                </span>
                <button 
                  onClick={handleIncrement}
                  disabled={qtyToAdd >= product.stock_quantity}
                  className="p-3 hover:text-[#D4AF37] disabled:text-slate-600 disabled:cursor-not-allowed text-slate-300 transition-colors"
                  title="Augmenter la quantité"
                  id="btn-qty-plus"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 w-full py-4 px-6 rounded-xl font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${
                isOutOfStock 
                  ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                  : 'bg-[#D4AF37] text-black hover:bg-[#FFF3D1] hover:scale-102 hover:shadow-[0_4px_20px_rgba(212,175,55,0.25)]'
              }`}
              id="detail-add-to-cart-btn"
            >
              <ShoppingCart className="w-5 h-5 shrink-0" />
              {isOutOfStock ? "Matériel en rupture" : "Ajouter au panier de commande"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
