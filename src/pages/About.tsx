import React from 'react';
import { MapPin, Phone, Instagram, Facebook, Award, ShieldAlert, BadgeCheck, Compass } from 'lucide-react';
import MetadataHelper from '../components/MetadataHelper';

interface AboutProps {
  storeSettings?: {
    store_name: string;
    phone?: string | null;
    address?: string | null;
    instagram_url?: string | null;
    facebook_url?: string | null;
  };
}

export default function About({ storeSettings }: AboutProps) {
  const storeName = storeSettings?.store_name || "MSI - Miliana Service Informatique";
  const storePhone = storeSettings?.phone || "+213 555 12 34 56";
  const storeAddress = storeSettings?.address || "Rue de l'Émir Abdelkader, Miliana, Algérie";
  const instaUrl = storeSettings?.instagram_url || "https://instagram.com/miliana_service_informatique";
  const fbUrl = storeSettings?.facebook_url || "https://facebook.com/miliana_service_informatique";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      <MetadataHelper 
        title="À Propos & Contact" 
        description="Faites connaissance avec l'histoire, la localisation et les valeurs de Miliana Service Informatique." 
      />

      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[#D4AF37] font-mono text-[10px] uppercase font-black tracking-[0.3em] block mb-2">NOTRE HISTOIRE & VALEURS</span>
        <h1 className="text-4xl font-black italic uppercase text-white tracking-tight font-display mb-4">À propos de MSI</h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Fondé à Miliana, MSI (Miliana Service Informatique) est devenu la référence locale incontournable pour les passionnés de technologie, de gaming et de smartphones hauts de gamme en Algérie.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        
        {/* LEAF CORNER ABOUT CONTENT */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-display font-black text-xs uppercase tracking-widest text-[#D4AF37]">Notre Mission</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nous sélectionnons minutieusement chaque produit (téléphones, claviers mécaniques haut de gamme Havit, souris performantes iMICE, audio Kalabee, smartwatches) pour offrir aux consommateurs algériens les normes de qualité mondiales les plus strictes au juste prix.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Notre équipe d'ingénieurs passionnés teste chaque arrivage individuellement sous emballage scellé à l'atelier de Miliana avant sa mise en rayon ou son expédition.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6 text-center font-display">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-white font-mono">100%</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">Authentique</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/5">
              <span className="text-lg font-black text-white font-mono">58</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">Wilayas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-white font-mono">24/7</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">SAV Réactif</span>
            </div>
          </div>
        </div>

        {/* BENTO LOCATION & CONTACT PANEL */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-10 flex flex-col justify-between gap-8 h-full">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-display font-black text-xs uppercase tracking-widest text-[#D4AF37]">Coordonnées & Accès</h2>
            </div>

            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#D4AF37] shrink-0">📍</span>
                <div>
                  <strong className="text-white block uppercase tracking-wider mb-0.5">Adresse Officielle :</strong>
                  <span className="text-slate-400 font-mono">{storeAddress}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#D4AF37] shrink-0">📞</span>
                <div>
                  <strong className="text-white block uppercase tracking-wider mb-0.5">Ligne d'assistance :</strong>
                  <span className="text-[#D4AF37] font-mono font-bold text-sm">{storePhone}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#D4AF37] shrink-0">📱</span>
                <div>
                  <strong className="text-white block uppercase tracking-wider mb-0.5">Réseaux Sociaux :</strong>
                  <div className="flex gap-4 mt-1">
                    <a href={fbUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1 font-semibold text-[11px]">
                      <Facebook className="w-3.5 h-3.5" /> Facebook
                    </a>
                    <span className="text-slate-600">|</span>
                    <a href={instaUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1 font-semibold text-[11px]">
                      <Instagram className="w-3.5 h-3.5" /> Instagram
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Interactive Google Map Mock Placement */}
          <div className="h-44 bg-[#161616] border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-radial from-[#D4AF37]/30 via-slate-900 to-black"></div>
            <div className="text-center z-10 px-4">
              <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 animate-bounce" />
              <span className="font-display font-bold text-xs text-white block uppercase tracking-widest mb-1">Localisation de Miliana</span>
              <span className="text-[10px] text-slate-500 leading-normal block">Coordonnées exactes : 36.3117° N, 2.2274° E (Aïn Defla, Algérie)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
