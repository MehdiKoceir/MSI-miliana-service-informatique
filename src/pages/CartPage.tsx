import React from 'react';
import { ShoppingBag, ArrowLeft, Trash2, ShieldCheck, HelpCircle, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/cart';
import MetadataHelper from '../components/MetadataHelper';

interface CartPageProps {
  setCurrentTab: (tab: string) => void;
}

export default function CartPage({ setCurrentTab }: CartPageProps) {
  const { items, updateQuantity, removeItem, getCartTotal, getCartCount, clearCart } = useCartStore();

  const total = getCartTotal();
  const count = getCartCount();
  const shippingCostEstimate = 800; // Algerian Standard DZD delivery rate

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <MetadataHelper 
        title="Mon Panier d'Achat" 
        description="Consultez et ajustez vos articles sélectionnés chez Miliana Tech Space." 
      />

      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight font-display flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-[#D4AF37]" /> Mon panier d'achat
        </h1>
        <button 
          onClick={() => setCurrentTab('boutique')} 
          className="text-xs hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 focus:outline-none"
          id="cart-back-btn"
        >
          <ArrowLeft className="w-4 h-4" /> Continuer mes achats
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-[#111] border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-5">
          <div className="text-6xl">🛒</div>
          <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">Votre panier est vide</h2>
          <p className="text-xs text-slate-500 max-w-sm">
            Vous n'avez pas encore configuré de produit dans votre panier. Parcourez notre catalogue d'ordinateurs et smartphones pour commencer.
          </p>
          <button 
            onClick={() => setCurrentTab('boutique')}
            className="mt-2 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-[#FFF3D1] transition-colors shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
            id="empty-cart-shop-btn"
          >
            Explorer le Catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BASKET ITEMS LIST */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => {
              const product = item.product;
              const primaryImg = product.images?.[0];
              const imageUrl = primaryImg?.url || "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80";

              return (
                <div 
                  key={product.id} 
                  className="bg-[#111] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#D4AF37]/35 transition-colors"
                  id={`cart-item-${product.id}`}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-[#161616] border border-white/5 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={imageUrl} alt={product.name} className="object-cover w-full h-full p-1" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] font-extrabold">{product.brand || "MTS Original"}</span>
                      <h3 className="font-bold text-sm text-white font-display line-clamp-1">{product.name}</h3>
                      <p className="font-mono text-xs text-[#D4AF37] font-semibold mt-0.5">{product.price_dzd.toLocaleString()} DZD <span className="text-[10px] text-slate-500 font-normal">/ unité</span></p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#161616] border border-white/10 rounded-lg p-0.5">
                      <button 
                        onClick={() => updateQuantity(product.id, item.quantity - 1)}
                        className="p-2 hover:text-white text-slate-400 transition-colors"
                        title="Diminuer la quantité"
                        id={`btn-cart-minus-${product.id}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono font-bold text-xs text-white select-none w-8 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(product.id, item.quantity + 1)}
                        className="p-2 hover:text-white text-slate-400 transition-colors"
                        disabled={item.quantity >= product.stock_quantity}
                        title="Augmenter la quantité"
                        id={`btn-cart-plus-${product.id}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Item Sum */}
                    <div className="text-right min-w-[100px] max-sm:hidden">
                      <span className="text-xs text-slate-500 block">Sous-total :</span>
                      <span className="font-mono text-sm font-black text-white">{(product.price_dzd * item.quantity).toLocaleString()} DZD</span>
                    </div>

                    {/* Delete item button */}
                    <button 
                      onClick={() => removeItem(product.id)}
                      className="p-2.5 bg-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Retirer l'article"
                      id={`btn-cart-delete-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Empty cart button */}
            <div className="flex justify-between items-center text-xs pt-2">
              <button 
                onClick={() => {
                  if (confirm("Voulez-vous vraiment vider votre panier d'achat ?")) {
                    clearCart();
                  }
                }}
                className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider font-mono flex items-center gap-1 focus:outline-none"
                id="cart-clear-all-btn"
              >
                <Trash2 className="w-3.5 h-3.5" /> Recommencer à zéro
              </button>
              <span className="text-slate-500 font-mono">Nombre d'articles : <strong className="text-white">{count}</strong></span>
            </div>
          </div>

          {/* CHECKOUT SUMMARY PANEL - RIGHT SIDEBAR */}
          <aside className="bg-[#111] border border-white/10 rounded-xl p-6 flex flex-col justify-between h-fit gap-6" id="cart-summary-sidebar">
            <div>
              <h2 className="text-xs font-black uppercase text-white tracking-[0.25em] font-display text-[#D4AF37] border-b border-white/5 pb-3">
                Récapitulatif de la commande
              </h2>

              <div className="flex flex-col gap-4 py-4 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Panier :</span>
                  <span className="font-mono font-bold text-white">{total.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Frais de livraison (Est.) :</span>
                  <span className="font-mono text-white text-[#D4AF37] font-semibold">+{shippingCostEstimate.toLocaleString()} DZD</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between items-baseline mt-2">
                  <span className="text-sm font-bold text-white">Tarif Global (Est.) :</span>
                  <span className="font-mono text-xl font-black text-white">{(total + shippingCostEstimate).toLocaleString()} <span className="text-xs font-bold text-[#D4AF37]">DZD</span></span>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg text-[11px] text-slate-500 flex flex-col gap-2 border border-white/5">
                <span className="text-[#D4AF37] font-bold uppercase tracking-wider block">Garantie de service :</span>
                <p className="leading-relaxed">
                  Pas de frais cachés. Le coût exact sera calculé et re-vérifié par notre équipe lors du passage de commande. Service après-vente basé à Miliana.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setCurrentTab('checkout')}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#FFF3D1] font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:scale-102"
              id="goto-checkout-btn"
            >
              Étape suivante : Passer la commande <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </aside>

        </div>
      )}
    </div>
  );
}
