import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // We'll write standard validation or handle it simply to avoid complex loader failures
import { z } from 'zod';
import { CreditCard, ShoppingBag, Landmark, ArrowLeft, ShieldAlert, BadgeCheck, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cart';
import MetadataHelper from '../components/MetadataHelper';

interface CheckoutProps {
  setCurrentTab: (tab: string) => void;
  onSetConfirmedOrderId: (id: string) => void;
}

// Zod schema for client details validation
const checkoutSchema = z.object({
  customerName: z.string().min(2, "Nom et prénom obligatoires (min. 2 caractères)"),
  customerPhone: z.string().regex(/^(05|06|07|02|\+213)[0-9]{8,11}$/, "Numéro de téléphone algérien invalide (ex: 0555123456)"),
  customerEmail: z.string().email("Veuillez entrer une adresse email valide").optional().or(z.literal('')),
  wilaya: z.string().min(1, "Veuillez sélectionner votre wilaya de livraison"),
  shippingAddress: z.string().min(5, "L'adresse de livraison doit faire au moins 5 caractères"),
  notes: z.string().optional()
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// Primary 58 Algerian Wilayas definition (subset for demo, but displaying popular matching entries)
const ALGERIAN_WILAYAS = [
  { code: '44', name: '44 - Aïn Defla (Miliana)' },
  { code: '16', name: '16 - Alger' },
  { code: '09', name: '09 - Blida' },
  { code: '31', name: '31 - Oran' },
  { code: '25', name: '25 - Constantine' },
  { code: '15', name: '15 - Tizi Ouzou' },
  { code: '19', name: '19 - Sétif' },
  { code: '06', name: '06 - Béjaïa' },
  { code: '13', name: '13 - Tlemcen' },
  { code: '35', name: '35 - Boumerdès' },
  { code: '38', name: '38 - Tissemsilt' },
  { code: '26', name: '26 - Médéa' },
  { code: '42', name: '42 - Tipaza' }
];

export default function Checkout({ setCurrentTab, onSetConfirmedOrderId }: CheckoutProps) {
  const { items, getCartTotal, getCartCount, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: async (data) => {
      try {
        const validated = checkoutSchema.parse(data);
        return { values: validated, errors: {} };
      } catch (err: any) {
        if (err instanceof z.ZodError) {
          const formattedErrors: any = {};
          err.issues.forEach((e) => {
            if (e.path[0]) {
              formattedErrors[e.path[0]] = { message: e.message };
            }
          });
          return { values: {}, errors: formattedErrors };
        }
        return { values: {}, errors: { global: { message: "Erreur de validation" } } };
      }
    },
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      wilaya: '44', // Default to Ain Defla / Miliana
      shippingAddress: '',
      notes: ''
    }
  });

  const cartTotal = getCartTotal();
  const shippingCost = 800; // Algerian Standard DZD delivery rate (800 DZD)
  const orderTotal = cartTotal + shippingCost;

  const onSubmitCheckout = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    const orderedItems = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          items: orderedItems
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Une erreur s'est produite lors de la validation.");
      }

      // Successful receipt saving
      onSetConfirmedOrderId(result.orderId);
      
      // Clear local shopping basket state after placing order request successfully
      clearCart();

      // Redirect client browser window to Strip Checkouts or Simulated link
      if (result.sessionUrl) {
        window.location.href = result.sessionUrl;
      } else {
        // Fallback in case of server redirect issues
        setCurrentTab('confirmation');
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Impossible d'initier le paiement de la commande. Veuillez vérifier la disponibilité.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <MetadataHelper 
        title="Passer la commande" 
        description="Remplissez vos coordonnées pour valider votre commande et procéder au règlement avec MTS." 
      />

      <div className="mb-8 border-b border-white/5 pb-4">
        <button 
          onClick={() => setCurrentTab('panier')} 
          className="text-xs hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 focus:outline-none mb-4"
          id="checkout-back-btn"
        >
          <ArrowLeft className="w-4 h-4" /> Modifier le panier
        </button>
        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight font-display">
          Saisie des coordonnées de livraison
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUT FORM CLIENT DATA */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmitCheckout)} className="bg-[#111] border border-white/10 rounded-xl p-6 sm:p-8 flex flex-col gap-6" id="checkout-form">
            <h2 className="font-display font-black text-xs uppercase tracking-widest text-[#D4AF37] border-b border-white/5 pb-3">
              Informations du destinataire
            </h2>

            {formError && (
              <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs rounded-lg font-semibold flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nom Prénom */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider">
                  Nom & Prénom <span className="text-[#D4AF37]">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Mohamed Benali"
                  {...register('customerName')}
                  className="bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-xs w-full text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                {errors.customerName && (
                  <span className="text-[10px] text-red-500 font-mono font-bold">{errors.customerName.message}</span>
                )}
              </div>

              {/* Téléphone Algérie */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider">
                  Numéro de Mobile <span className="text-[#D4AF37]">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: 0555123456"
                  {...register('customerPhone')}
                  className="bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-xs w-full text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <span className="text-[9px] text-slate-500 font-mono">Requis pour confirmer le colis avant expédition.</span>
                {errors.customerPhone && (
                  <span className="text-[10px] text-red-500 font-mono font-bold">{errors.customerPhone.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider">
                  Email (Optionnel)
                </label>
                <input 
                  type="email" 
                  placeholder="votre-adresse@email.com"
                  {...register('customerEmail')}
                  className="bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-xs w-full text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                {errors.customerEmail && (
                  <span className="text-[10px] text-red-500 font-mono font-bold">{errors.customerEmail.message}</span>
                )}
              </div>

              {/* Wilaya d'Algérie */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider">
                  Wilaya <span className="text-[#D4AF37]">*</span>
                </label>
                <select 
                  {...register('wilaya')}
                  className="bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-xs w-full text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                >
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w.code} value={w.name}>{w.name}</option>
                  ))}
                </select>
                {errors.wilaya && (
                  <span className="text-[10px] text-red-500 font-mono font-bold">{errors.wilaya.message}</span>
                )}
              </div>
            </div>

            {/* Adresse complète */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider">
                Adresse précise de livraison <span className="text-[#D4AF37]">*</span>
              </label>
              <textarea 
                rows={3}
                placeholder="Indiquez la rue, résidence, bâtiment, numéro d'appartement ou point de repère..."
                {...register('shippingAddress')}
                className="bg-[#161616] border border-white/10 rounded-lg p-4 text-xs w-full text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
              {errors.shippingAddress && (
                <span className="text-[10px] text-red-500 font-mono font-bold">{errors.shippingAddress.message}</span>
              )}
            </div>

            {/* Notes complémentaires */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider">
                Consignes / Notes (Optionnel)
              </label>
              <input 
                type="text" 
                placeholder="Ex: Appeler avant de passer, ou laisser chez le concierge..."
                {...register('notes')}
                className="bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-xs w-full text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* CASH ON DELIVERY EXPLANATION */}
            <div className="border-t border-white/5 pt-6 mt-2">
              <div className="p-5 bg-[#12110D] border border-[#D4AF37]/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#D4AF37] text-lg">🚚</span>
                  <span className="font-display font-black text-xs uppercase tracking-wider text-white">Mode de règlement : Paiement à la livraison (COD)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Chez <strong>Miliana Tech Space (MTS)</strong>, vous payez directement en espèces (Cash on Delivery) au moment de la livraison de votre matériel. Vous disposez de la possibilité de vérifier et inspecter l'état de votre colis avant de régler le livreur.
                </p>
                <div className="border-t border-white/5 pt-3 mt-3 text-[10px] italic text-[#D4AF37]/80 leading-normal">
                  * Procédure : Une fois la commande validée, notre service client vous contactera par téléphone sur votre numéro mobile pour confirmer votre adresse et planifier le passage du livreur.
                </div>
              </div>
            </div>

            {/* ACTION SUBMIT BUTTON */}
            <button 
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#FFF3D1] disabled:bg-white/5 disabled:text-slate-600 font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:cursor-not-allowed hover:scale-[1.01]"
              id="confirm-payment-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Enregistrement de votre commande...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4.5 h-4.5" /> Valider ma commande ({orderTotal.toLocaleString()} DZD)
                </>
              )}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY BANNER - RIGHT SIDEBAR */}
        <aside className="bg-[#111] border border-white/10 rounded-xl p-6 flex flex-col gap-5 h-fit" id="checkout-summary-aside">
          <h3 className="text-xs font-black uppercase text-white tracking-[0.25em] font-display text-[#D4AF37] border-b border-white/5 pb-3">
            Articles commandés ({getCartCount()})
          </h3>

          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between gap-3 text-xs">
                <div className="flex-1">
                  <h4 className="font-bold text-white line-clamp-1">{item.product.name}</h4>
                  <span className="text-slate-500 font-mono text-[10px]">Qté: {item.quantity} &times; {item.product.price_dzd.toLocaleString()} DZD</span>
                </div>
                <span className="font-mono text-white font-bold text-right shrink-0">
                  {(item.product.price_dzd * item.quantity).toLocaleString()} DZD
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4 flex flex-col gap-3 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Sous-total panier :</span>
              <span className="font-mono text-slate-300">{cartTotal.toLocaleString()} DZD</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Livraison 58 Wilayas :</span>
              <span className="font-mono text-slate-300">+{shippingCost.toLocaleString()} DZD</span>
            </div>
            
            <div className="border-t border-white/5 pt-3 flex justify-between items-baseline mt-1">
              <span className="text-sm font-bold text-white uppercase tracking-wider font-display">Total global :</span>
              <span className="font-mono text-lg font-black text-[#D4AF37]">{orderTotal.toLocaleString()} DZD</span>
            </div>
          </div>

          <div className="bg-[#1C1A14] border border-[#D4AF37]/15 p-4 rounded-lg flex items-start gap-2.5 text-[10px] text-slate-400">
            <BadgeCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block uppercase tracking-wider mb-0.5">SÉCURITÉ MAXIMUM</strong>
              Vos données sont cryptées en transit. Expédition avec possibilité d'inspection du colis au retrait.
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
