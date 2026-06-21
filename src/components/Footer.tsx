import React from 'react';
import { Instagram, Facebook, MapPin, Phone, ShieldCheck, Truck, RefreshCw, Mail } from 'lucide-react';
import { useCartStore } from '../store/cart';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  storeSettings?: {
    store_name: string;
    phone?: string | null;
    address?: string | null;
    instagram_url?: string | null;
    facebook_url?: string | null;
  };
}

export default function Footer({ setCurrentTab, storeSettings }: FooterProps) {
  const storeName = storeSettings?.store_name || "MSI - Miliana Service Informatique";
  const storePhone = storeSettings?.phone || "+213 555 12 34 56";
  const storeAddress = storeSettings?.address || "Rue de l'Émir Abdelkader, Miliana, Algérie";
  const instaUrl = storeSettings?.instagram_url || "https://instagram.com/miliana_service_informatique";
  const fbUrl = storeSettings?.facebook_url || "https://facebook.com/miliana_service_informatique";

  return (
    <footer className="bg-[#050505] border-t border-white/10 text-slate-400 font-sans mt-auto">
      {/* 3 COLUMN INFRASTRUCTURE BENEFITS */}
      <div className="border-b border-white/5 bg-[#090909]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center font-display">
          <div className="p-8 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#12110D] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-1">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">EXPÉDITION 58 WILAYAS</h4>
            <p className="text-xs text-slate-500 max-w-xs">Livraison rapide sécurisée à votre porte ou point de retrait. Payez à la réception !</p>
          </div>
          <div className="p-8 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#12110D] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">MARQUES AUTHENTIQUES</h4>
            <p className="text-xs text-slate-500 max-w-xs">Partenaire officiel de Havit, iMICE, et Kalabee. Produits neufs certifiés sous emballage.</p>
          </div>
          <div className="p-8 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#12110D] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-1">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">GARANTIE & SAV</h4>
            <p className="text-xs text-slate-500 max-w-xs">Service après-vente ultra réactif et retours simplifiés sous 48 heures en cas de souci.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* BOUTIQUE SUMMARY */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#12110D] border border-[#D4AF37] text-[#D4AF37] font-black px-2 pb-0.5 text-xl tracking-tighter italic rounded">
              MSI
            </div>
            <span className="font-display font-black text-sm uppercase tracking-widest text-white leading-none">
              Miliana Service Informatique
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 max-w-sm mb-6">
            Spécialiste de la vente en ligne de smartphones haut de gamme, claviers mécaniques haut de gamme, souris gaming d'élite, accessoires et montres connectées en Algérie. Performance et authenticité assurées.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href={fbUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all text-slate-300"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href={instaUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all text-slate-300"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-xs font-black uppercase text-white tracking-[0.2em] mb-4 font-display text-[#D4AF37]">
            Explorer
          </h3>
          <ul className="space-y-2 text-xs text-slate-500">
            <li>
              <button onClick={() => setCurrentTab('accueil')} className="hover:text-[#D4AF37] transition-colors">Accueil Store</button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('boutique')} className="hover:text-[#D4AF37] transition-colors">Catalogue Produits</button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('a-propos')} className="hover:text-[#D4AF37] transition-colors">Découvrir l'Atelier</button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('panier')} className="hover:text-[#D4AF37] transition-colors font-semibold text-slate-400">Panier d'Achat ({useCartStore((s) => s.getCartCount())})</button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('admin')} className="hover:text-[#D4AF37] transition-colors text-slate-600">Tableau de Bord Admin</button>
            </li>
          </ul>
        </div>

        {/* CONTTACT INFORMATION */}
        <div>
          <h3 className="text-xs font-black uppercase text-white tracking-[0.2em] mb-4 font-display text-[#D4AF37]">
            Boutique Physique
          </h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span className="text-slate-500 leading-normal">{storeAddress}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-mono text-slate-300 font-bold">{storePhone}</span>
            </li>
            <li className="flex items-center gap-2.5 text-slate-500">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span>contact@msi-miliana.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 bg-[#030303] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-600 font-mono tracking-wider gap-3">
          <span>&copy; {new Date().getFullYear()} MILIANA SERVICE INFORMATIQUE (MSI). TOUS DROITS RÉSERVÉS.</span>
          <span>Coded in high-contrast Black & Gold Theme. Miliana, Algérie.</span>
        </div>
      </div>
    </footer>
  );
}
