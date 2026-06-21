import React, { useEffect, useState } from 'react';
import { BadgeCheck, Phone, CheckCircle2, ChevronRight, Bookmark, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useCartStore } from '../store/cart';
import MetadataHelper from '../components/MetadataHelper';

interface ConfirmationProps {
  confirmedOrderId: string | null;
  setCurrentTab: (tab: string) => void;
}

export default function Confirmation({ confirmedOrderId, setCurrentTab }: ConfirmationProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    if (!confirmedOrderId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/confirmation/${confirmedOrderId}`);
      if (!res.ok) throw new Error("Impossible de charger le récapitulatif.");
      const data = await res.json();
      setOrder(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [confirmedOrderId]);

  if (!confirmedOrderId) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <span className="text-5xl block mb-6">🤷</span>
        <h1 className="text-2xl font-black italic uppercase text-white tracking-widest font-display mb-4">Aucune commande en cours</h1>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Aucun identifiant de commande n'a été mémorisé pour cette session de navigation.
        </p>
        <button 
          onClick={() => setCurrentTab('boutique')}
          className="bg-[#D4AF37] text-black font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-white transition-colors"
          id="err-back-to-catalog"
        >
          Retourner vers la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <MetadataHelper title="Confirmation de Commande" description="Votre commande a été enregistrée avec succès chez Miliana Service Informatique." />

      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 flex flex-col items-center text-center gap-6 relative overflow-hidden" id="confirmation-panel">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#D4AF37]"></div>

        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[#D4AF37] font-mono text-[10px] uppercase font-black tracking-[0.3em] block mb-2">MERCI POUR VOTRE MANDAT</span>
          <h1 className="text-3xl font-black italic uppercase text-white tracking-tight font-display mb-2">Commande enregistrée !</h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Votre commande a été reçue et validée par notre serveur. Notre équipe commerciale à Miliana prendra contact avec vous par téléphone sous 24h pour finaliser l'expédition.
          </p>
        </div>

        {loading ? (
          <div className="py-8"><Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" /></div>
        ) : error ? (
          <div className="p-4 bg-red-950/10 border border-red-950 text-red-400 text-xs rounded-lg">{error}</div>
        ) : order ? (
          <div className="w-full bg-[#161616] border border-white/5 rounded-xl p-6 text-left flex flex-col gap-4 text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="font-mono text-slate-500 font-bold">Référence client :</span>
              <span className="font-mono text-white font-extrabold text-sm text-[#D4AF37]">{order.order_number}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block">Destinataire :</span>
                <span className="text-slate-300 font-bold">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Numéro Mobile :</span>
                <span className="text-slate-300 font-mono font-bold">{order.customer_phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block">Lieu de livraison :</span>
                <span className="text-slate-300 font-semibold">{order.wilaya}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tarif global TTC :</span>
                <strong className="text-white text-md font-mono">{order.total_dzd?.toLocaleString()} DZD</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 border-t border-white/5 pt-3">
              <div>
                <span className="text-slate-500 block">Mode de règlement :</span>
                <span className="inline-block bg-[#1C1A14] text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] uppercase font-bold px-2.5 py-1 mt-1 rounded font-mono">
                  💵 Paiement à la livraison (En espèces)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 border-t border-white/5 pt-3">
              <div>
                <span className="text-slate-500 block">Statut de la transaction :</span>
                {order.payment_status === 'paid' ? (
                  <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-1 mt-1 rounded font-mono">
                    ✅ Payé (Règlement reçu)
                  </span>
                ) : (
                  <span className="inline-block bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] uppercase font-bold px-2 py-1 mt-1 rounded font-mono">
                    🔴 En attente de livraison & règlement
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="border-t border-white/5 pt-6 w-full flex flex-col sm:flex-row items-center gap-4 justify-center">
          <button 
            onClick={() => setCurrentTab('boutique')}
            className="w-full sm:w-auto bg-[#D4AF37] text-black hover:bg-[#FFF3D1] font-black h-12 px-8 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:scale-102"
            id="confirm-shop-btn"
          >
            Retourner au catalogue <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
