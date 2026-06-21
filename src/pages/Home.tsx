import React from 'react';
import { ShoppingBag, ArrowRight, Zap, Award, Star, Milestone, ShieldAlert } from 'lucide-react';
import { Product, Category } from '../types/store';
import ProductCard from '../components/ProductCard';
import MetadataHelper from '../components/MetadataHelper';

interface HomeProps {
  products: Product[];
  categories: Category[];
  onViewProduct: (product: Product) => void;
  onExploreCategory: (categorySlug: string) => void;
  setCurrentTab: (tab: string) => void;
}

export default function Home({ products, categories, onViewProduct, onExploreCategory, setCurrentTab }: HomeProps) {
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 6);

  return (
    <div className="flex flex-col gap-16 pb-16">
      <MetadataHelper 
        title="Boutique Informatique & Gaming" 
        description="Bienvenue chez Miliana Service Informatique (MSI). Votre destination gaming, téléphonie et accessoires de confiance en Algérie." 
      />

      {/* LUXURY HERO BANNER */}
      <section className="relative w-full py-20 px-6 sm:px-12 bg-linear-to-r from-[#0F0F0B] via-[#16140D] to-[#0A0A0A] border-b border-[#D4AF37]/15 overflow-hidden flex items-center min-h-[500px]">
        {/* Abstract Gold Circles */}
        <div className="absolute right-[-10%] top-[-25%] w-[500px] h-[500px] border-[50px] border-[#D4AF37]/5 rounded-full select-none pointer-events-none"></div>
        <div className="absolute right-[5%] bottom-[-20%] w-80 h-80 border-[20px] border-[#D4AF37]/10 rounded-full select-none pointer-events-none"></div>
        <div className="absolute left-[-5%] bottom-[10%] w-48 h-48 bg-[#D4AF37]/5 blur-3xl rounded-full select-none pointer-events-none"></div>

        <div className="max-w-3xl z-10 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] inline-block font-mono">
              ⚡ ARRIVAGE EXCLUSIF GAMING 2026
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter leading-none text-white font-display mb-6">
            DOMINEZ LE JEU. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3D1] to-[#D4AF37]">ÉQUIPEZ-VOUS.</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed mb-8">
            Nouveaux claviers mécaniques ultra-réactifs HAVIT, souris gamer haute fréquence iMICE, et smartwatches de luxe à des tarifs exceptionnels. Obtenez une réactivité maximale.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setCurrentTab('boutique')}
              className="bg-[#D4AF37] text-black font-black px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-[#FFF3D1] hover:scale-105 transition-all rounded shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
              id="hero-btn-catalog"
            >
              Découvrir la collection <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentTab('a-propos')}
              className="bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/10 font-bold px-6 py-3.5 text-xs uppercase tracking-widest transition-all rounded"
              id="hero-btn-about"
            >
              Notre Atelier local
            </button>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.3em] uppercase block mb-1 font-mono">
              QUEL EST VOTRE PROCHAIN OBJECTIF ?
            </span>
            <h2 className="text-3xl font-black italic tracking-tight uppercase font-display text-white">
              SÉLECTION PAR CATÉGORIES
            </h2>
          </div>
          <button 
            onClick={() => setCurrentTab('boutique')} 
            className="text-xs font-bold text-slate-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 focus:outline-none"
            id="cat-view-all"
          >
            Tout explorer <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            let iconText = "🎮";
            if (category.slug.includes("telephones")) iconText = "📱";
            else if (category.slug.includes("souris")) iconText = "🖱️";
            else if (category.slug.includes("audio")) iconText = "🎧";
            else if (category.slug.includes("montres")) iconText = "⌚";
            else if (category.slug.includes("accessoires")) iconText = "🔌";

            return (
              <div 
                key={category.id}
                onClick={() => onExploreCategory(category.slug)}
                className="bg-[#111] hover:bg-[#161616] border border-white/10 hover:border-[#D4AF37]/40 p-5 rounded-xl text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
                id={`cat-card-${category.id}`}
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D4AF37]/0 group-hover:bg-[#D4AF37] transition-colors"></div>
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{iconText}</div>
                <h3 className="font-bold text-xs text-slate-300 group-hover:text-white font-display uppercase tracking-wider leading-none">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROMOTION / HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="bg-gradient-to-r from-[#111] via-[#1A1811] to-[#111] border border-[#D4AF37]/20 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/5 blur-2xl rounded-full"></div>
          
          <div className="max-w-lg">
            <span className="text-[#D4AF37] font-mono text-[10px] uppercase tracking-[0.3em] font-black block mb-2">OFFRE SPÉCIALE EN COURS</span>
            <h3 className="text-2xl sm:text-3xl font-black italic text-white tracking-tight uppercase font-display leading-tight mb-3">
              VOTRE PACK GAMER CLAVIER + SOURIS À PRIX BARRÉ !
            </h3>
            <p className="text-xs text-slate-400 mb-0 leading-relaxed">
              Associez le clavier mécanique Havit RGB et la souris iMICE X6 pour débloquer une remise automatique immédiate. Offre valable dans la limite des stocks disponibles à Miliana.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-black/40 border border-white/5 p-6 rounded-xl">
            <div className="text-center pr-4 border-r border-[#D4AF37]/20">
              <span className="block text-[10px] text-slate-500 font-mono tracking-widest uppercase">PRIX PROMO</span>
              <span className="font-mono text-xl text-white font-black">11,700 <span className="text-[10px] font-bold text-[#D4AF37]">DZD</span></span>
            </div>
            <button 
              onClick={() => setCurrentTab('boutique')}
              className="bg-[#D4AF37] text-black font-black px-4 py-3 rounded text-[10px] uppercase tracking-wider hover:bg-white transition-colors"
              id="promo-pack-btn"
            >
              Commander le lot
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.3em] uppercase block mb-1 font-mono">
              LES ACCENTS CLÉS DE LA BOUTIQUE
            </span>
            <h2 className="text-3xl font-black italic tracking-tight uppercase font-display text-white">
              PRODUITS VEDETTES
            </h2>
          </div>
          <button 
            onClick={() => setCurrentTab('boutique')}
            className="text-xs font-bold text-slate-500 hover:text-[#D4AF37] transition-colors border-b border-slate-700 hover:border-[#D4AF37] pb-1"
            id="featured-view-all"
          >
            Voir tout le catalogue
          </button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-slate-500 text-sm">
            Aucun produit vedette actuellement.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={onViewProduct} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
