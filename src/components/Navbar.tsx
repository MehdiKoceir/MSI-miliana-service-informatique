import React, { useState } from 'react';
import { ShoppingCart, LayoutDashboard, Search, Smartphone, Award, Settings, PhoneCall, HelpCircle, ArrowRight, Heart, Sun, Moon } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useWishlistStore } from '../store/wishlist';
import { useThemeStore } from '../store/theme';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSearch: (term: string) => void;
  onCategorySelect?: (catId: string | null) => void;
}

export default function Navbar({ currentTab, setCurrentTab, onSearch, onCategorySelect }: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const cartCount = useCartStore((state) => state.getCartCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { theme, toggleTheme } = useThemeStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    if (currentTab !== 'boutique') {
      setCurrentTab('boutique');
    }
  };

  const isTabActive = (tab: string) => {
    if (tab === 'boutique' && ['boutique', 'produit-detail', 'categorie-detail'].includes(currentTab)) {
      return 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-extrabold';
    }
    return currentTab.startsWith(tab) 
      ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-extrabold'
      : 'text-slate-300 hover:text-[#E1D29C] hover:border-b-2 hover:border-[#D4AF37]/40 transition-colors font-semibold';
  };

  return (
    <header className="border-b border-white/10 bg-[#0A0A0A]/95 z-50 sticky top-0 backdrop-blur-md">
      {/* Promo banner / Contact Banner */}
      <div className="bg-gradient-to-r from-[#1E1C12] via-[#0A0A0A] to-[#1E1C12] border-b border-[#D4AF37]/10 py-1.5 px-6 flex justify-between items-center text-[11px] font-mono tracking-wider font-semibold text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" /> Livraison 58 Wilayas (Paiement à la livraison possible)</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline flex items-center gap-1 text-[#D4AF37]"><Award className="w-3.5 h-3.5" /> Matériel Garanti 100% Authentique</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 max-sm:hidden"><PhoneCall className="w-3 h-3 text-[#D4AF37]" /> Support direct : <strong className="text-white">+213 555 12 34 56</strong></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4">
        {/* BRAND IDENTITY LOGO */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <button 
            onClick={() => {
              onSearch('');
              setSearchTerm('');
              if (onCategorySelect) onCategorySelect(null);
              setCurrentTab('accueil');
            }} 
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            id="btn-logo-home"
          >
            <div className="bg-[#161616] border-2 border-[#D4AF37] text-white font-black px-3.5 py-1 text-2xl tracking-tighter italic select-none group-hover:bg-[#D4AF37] group-hover:text-black transition-all rounded shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              MTS
            </div>
            <div>
              <div className="text-md font-extrabold tracking-wider leading-none text-white font-display group-hover:text-[#D4AF37] transition-colors">
                MILIANA TECH
              </div>
              <div className="text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase leading-none font-mono mt-0.5">
                SPACE
              </div>
            </div>
          </button>

          {/* Mobile Cart / Menu triggers */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer"
              id="btn-mobile-theme-toggle"
              title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-[#D4AF37]" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-500 fill-indigo-500" />
              )}
            </button>

            <button 
              onClick={() => setCurrentTab('wishlist')} 
              className="relative p-2 text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10"
              id="btn-mobile-wishlist"
              title="Ma Liste d'Envies"
            >
              <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'text-red-500 fill-current' : 'text-slate-300'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentTab('panier')} 
              className="relative p-2 text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10"
              id="btn-mobile-cart"
            >
              <ShoppingCart className="h-5 w-5 text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentTab('admin')} 
              className="p-2 text-white bg-[#1A1813] border border-[#D4AF37]/30 rounded-full hover:bg-[#D4AF37]/10"
              title="Panel d'administration"
              id="btn-mobile-admin"
            >
              <LayoutDashboard className="h-5 w-5 text-[#D4AF37]" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Rechercher un clavier, souris, phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-full pl-4 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-[#D4AF37] transition-colors" id="btn-search-nav">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* NAVIGATION LINKS */}
        <nav className="flex gap-6 sm:gap-8 text-xs font-bold tracking-widest uppercase font-display items-center">
          <button onClick={() => setCurrentTab('accueil')} className={`py-1.5 px-1 focus:outline-none ${isTabActive('accueil')}`} id="nav-btn-home">Accueil</button>
          <button onClick={() => { 
            onSearch(''); 
            setSearchTerm(''); 
            if (onCategorySelect) onCategorySelect(null);
            setCurrentTab('boutique'); 
          }} className={`py-1.5 px-1 focus:outline-none ${isTabActive('boutique')}`} id="nav-btn-store">Boutique</button>
          <button onClick={() => setCurrentTab('wishlist')} className={`py-1.5 px-1 focus:outline-none ${isTabActive('wishlist')}`} id="nav-btn-wishlist">Favoris</button>
          <button onClick={() => setCurrentTab('a-propos')} className={`py-1.5 px-1 focus:outline-none ${isTabActive('a-propos')}`} id="nav-btn-about">À Propos</button>
        </nav>

        {/* UTILITY ACTIONS CONTAINER */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={toggleTheme}
            className="p-2.5 text-slate-300 hover:text-[#D4AF37] bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center cursor-pointer"
            id="btn-desktop-theme-toggle"
            title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-[#D4AF37]" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500 fill-indigo-500" />
            )}
          </button>

          <button 
            onClick={() => setCurrentTab('wishlist')} 
            className="relative p-2.5 text-slate-300 hover:text-red-500 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300"
            id="btn-desktop-wishlist"
            title="Ma Liste d'Envies"
          >
            <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'text-red-500 fill-current' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setCurrentTab('panier')} 
            className="relative p-2.5 text-slate-300 hover:text-[#D4AF37] bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300"
            id="btn-desktop-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setCurrentTab('admin')} 
            className="bg-[#12110D] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] border border-[#D4AF37]/40 px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
            id="btn-desktop-admin"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
