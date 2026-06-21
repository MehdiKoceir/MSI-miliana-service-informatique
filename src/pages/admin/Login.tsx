import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { supabaseClient } from '../../lib/supabase';

interface LoginProps {
  onLoginSuccess: (token: string, profile: any) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Login({ onLoginSuccess, setCurrentTab }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorError, setErrorError] = useState<string | null>(null);

  const handleOfflineDemoLogin = () => {
    // Offline simulation pass
    onLoginSuccess('mock-admin-token', { full_name: 'Administrateur Démo', role: 'owner' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorError(null);

    try {
      if (email === 'admin@msi.com' && password === 'admin123') {
        handleOfflineDemoLogin();
        return;
      }

      if (supabaseClient) {
        // Real Supabase login sequence
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        if (data.session) {
          // Check role from admin_profiles table on backend, or pass token
          onLoginSuccess(data.session.access_token, data.user);
        } else {
          throw new Error("Authentification réussie mais aucune session active.");
        }
      } else {
        throw new Error("Identifiants incorrects. Pour le mode démo, utilisez : admin@msi.com / admin123");
      }
    } catch (err: any) {
      console.error(err);
      setErrorError(err.message || "Échec d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16 flex flex-col gap-8">
      <button 
        onClick={() => setCurrentTab('accueil')} 
        className="text-xs hover:text-[#D4AF37] text-slate-500 font-bold uppercase font-mono flex items-center gap-1 w-fit focus:outline-none"
        id="login-exit-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Quitter le panel
      </button>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden" id="login-panel">
        <div className="absolute top-0 inset-x-0 h-1 bg-[#D4AF37]"></div>

        <div className="text-center">
          <KeyRound className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
          <h1 className="font-display font-black text-xl text-white uppercase tracking-wider mb-1">Accès Administrateur</h1>
          <p className="text-[11px] text-slate-500">Panel réservé à la gestion des produits et commandes MSI Miliana.</p>
        </div>

        {errorError && (
          <div className="p-4 bg-red-950/20 border border-red-900 text-red-500 text-[11px] font-semibold rounded-lg flex items-start gap-2">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
            <span>{errorError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Adresse email</label>
            <input 
              type="email" 
              required
              placeholder="admin@msi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Mot de passe</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black hover:bg-[#FFF3D1] disabled:bg-[#1E1C15] font-black h-11 rounded-lg text-xs uppercase tracking-widest transition-all mt-3 flex items-center justify-center gap-2"
            id="login-signin-btn"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Se connecter par login"}
          </button>
        </form>

        <div className="border-t border-white/5 pt-4 text-center">
          <span className="text-[10px] text-slate-500 font-mono block mb-2">MODE PORTFOLIO SANS CONFIGURATION :</span>
          <button 
            onClick={handleOfflineDemoLogin}
            className="w-full bg-[#161616] border border-white/5 text-slate-300 hover:text-white hover:bg-white/5 py-2.5 rounded-lg text-xs font-bold transition-all"
            id="login-simulated-btn"
          >
            Débloquer l'accès Démo direct (Sans DB)
          </button>
        </div>
      </div>
    </div>
  );
}
