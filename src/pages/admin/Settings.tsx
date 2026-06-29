import React, { useState, useEffect } from 'react';
import { Save, Loader2, ShieldCheck, Mail, Store, AlertTriangle } from 'lucide-react';

interface SettingsProps {
  adminToken: string;
  onRefreshSettings: () => void;
}

export default function Settings({ adminToken, onRefreshSettings }: SettingsProps) {
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorError, setErrorError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/settings');
        if (!res.ok) throw new Error("Impossible de charger les paramètres boutique.");
        const data = await res.json();
        
        setStoreName(data.store_name || "MTS - Miliana Tech Space");
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setInstagramUrl(data.instagram_url || '');
        setFacebookUrl(data.facebook_url || '');
      } catch (err: any) {
        console.error(err);
        setErrorError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorError(null);
    setSuccess(false);

    const dataBody = {
      store_name: storeName,
      phone: phone || null,
      address: address || null,
      instagram_url: instagramUrl || null,
      facebook_url: facebookUrl || null
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(dataBody)
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Une erreur s'est produite.");

      setSuccess(true);
      onRefreshSettings();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-[#D4AF37]"><Loader2 className="w-8 h-8 animate-spin" /></div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      
      <div>
        <h1 className="text-xl font-black italic uppercase font-display text-white tracking-tight">Coordonnées du point de vente</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configurez l'adresse physique du magasin et les liens de réseaux sociaux pour les visiteurs.</p>
      </div>

      {errorError && (
        <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs rounded-lg font-semibold">
          {errorError}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-900 text-emerald-400 text-xs rounded-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5" /> Modifications enregistrées et appliquées sur toute la boutique !
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-left" id="settings-form">
        <h2 className="font-display font-black text-xs uppercase tracking-widest text-[#D4AF37] border-b border-white/5 pb-3">
          Informations du magasin physique
        </h2>

        {/* Store Brand Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Nom commercial de l'enseigne</label>
          <input 
            type="text" 
            required
            placeholder="MTS - Miliana Tech Space"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Ligne direct */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Téléphone de contact boutique</label>
            <input 
              type="text" 
              placeholder="Ex: +213 555 12 34 56"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none"
            />
          </div>

          {/* Social connections Facebook */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Lien Facebook</label>
            <input 
              type="url" 
              placeholder="https://facebook.com/miliana_service_informatique"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Instagram Link */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Lien Instagram</label>
            <input 
              type="url" 
              placeholder="https://instagram.com/miliana_service_informatique"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none"
            />
          </div>

          {/* Map point label info (address) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Adresse complète physique</label>
            <input 
              type="text" 
              placeholder="Rue de l'Émir Abdelkader, Miliana, Algérie"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions save submit */}
        <button 
          type="submit" 
          disabled={saving}
          className="bg-[#D4AF37] text-black hover:bg-[#FFF3D1] disabled:bg-[#1E1C15] font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(212,175,55,0.25)] focus:outline-none flex items-center justify-center gap-1.5 mt-3"
          id="btn-save-settings"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4.5 h-4.5" /> Appliquer la configuration</>}
        </button>

      </form>
    </div>
  );
}
