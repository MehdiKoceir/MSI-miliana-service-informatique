import React, { useState, useMemo } from 'react';
import { Smartphone, Laptop, Filter, RefreshCcw, ChevronsUpDown, Check, Award, Search, X } from 'lucide-react';
import { Product, Category } from '../types/store';
import ProductCard from '../components/ProductCard';
import MetadataHelper from '../components/MetadataHelper';

interface CatalogProps {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedCategoryId: string | null;
  onCategorySelect: (catId: string | null) => void;
  onViewProduct: (product: Product) => void;
}

export default function Catalog({
  products,
  categories,
  searchQuery,
  onSearchQueryChange,
  selectedCategoryId,
  onCategorySelect,
  onViewProduct
}: CatalogProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number>(30000); // Max slide 30,000 DZD
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Dynamically group brands from active products
  const uniqueBrands = useMemo(() => {
    const brands = products.map((p) => p.brand).filter((b): b is string => Boolean(b));
    return Array.from(new Set(brands));
  }, [products]);

  // Clean filters reset
  const handleResetFilters = () => {
    onCategorySelect(null);
    setSelectedBrand(null);
    setPriceRange(30000);
    setSortOrder('default');
    onSearchQueryChange('');
  };

  // Filter products by search term, category, brand, and max pricing DZD
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => 
          p.name.toLowerCase().includes(q) || 
          p.brand?.toLowerCase().includes(q) || 
          p.description?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    // Category matching
    if (selectedCategoryId) {
      result = result.filter((p) => p.category_id === selectedCategoryId);
    }

    // Brand matching
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Max Price slider
    result = result.filter((p) => p.price_dzd <= priceRange);

    // Sorting Order
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price_dzd - b.price_dzd);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price_dzd - a.price_dzd);
    }

    return result;
  }, [products, searchQuery, selectedCategoryId, selectedBrand, priceRange, sortOrder]);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 relative">
      <MetadataHelper 
        title={activeCategory ? activeCategory.name : "Catalogue complet"} 
        description={`Parcourez notre collection d'équipements informatiques, téléphones et gaming d'élite à Miliana.`} 
        categoryName={activeCategory?.name}
      />

      {/* FILTER PANEL - LEFT SIDEBAR */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6" id="catalog-sidebar">
        {/* Title Header */}
        <div className="flex justify-between items-center bg-[#111] p-4 rounded-xl border border-white/10">
          <span className="font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 text-white">
            <Filter className="w-4 h-4 text-[#D4AF37]" /> OPTIONS DE FILTRE
          </span>
          <button 
            onClick={handleResetFilters}
            className="text-[10px] text-slate-500 hover:text-[#D4AF37] transition-colors font-mono uppercase"
            id="reset-filters-btn"
          >
            Réinitialiser
          </button>
        </div>

        {/* Categories checklist */}
        <div className="bg-[#111] border border-white/10 p-5 rounded-xl flex flex-col gap-3">
          <h3 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em] font-mono border-b border-white/5 pb-2">
            Catégories
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li className="flex items-center">
              <button 
                onClick={() => onCategorySelect(null)}
                className={`w-full text-left py-1 flex items-center gap-2 ${
                  selectedCategoryId === null ? 'text-[#D4AF37] font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
                id="cat-select-all"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${selectedCategoryId === null ? 'bg-[#D4AF37]' : 'bg-transparent'}`}></span>
                Tous nos produits
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center">
                <button 
                  onClick={() => onCategorySelect(cat.id)}
                  className={`w-full text-left py-1 flex items-center gap-2 ${
                    selectedCategoryId === cat.id ? 'text-[#D4AF37] font-extrabold' : 'text-slate-400 hover:text-white'
                  }`}
                  id={`cat-select-${cat.slug}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCategoryId === cat.id ? 'bg-[#D4AF37]' : 'bg-transparent'}`}></span>
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand selection filter */}
        <div className="bg-[#111] border border-white/10 p-5 rounded-xl flex flex-col gap-3">
          <h3 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em] font-mono border-b border-white/5 pb-2">
            Marques
          </h3>
          {uniqueBrands.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Aucune marque trouvée</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {uniqueBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                  className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded tracking-wider border transition-all ${
                    selectedBrand === brand 
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-black' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                  id={`brand-select-${brand.toLowerCase()}`}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Maximum pricing filter */}
        <div className="bg-[#111] border border-white/10 p-5 rounded-xl flex flex-col gap-3">
          <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
            <h3 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em] font-mono">
              Budget Max
            </h3>
            <span className="font-mono text-xs font-bold text-white">
              {priceRange.toLocaleString()} DZD
            </span>
          </div>
          <div className="pt-2">
            <input 
              type="range" 
              min="1000" 
              max="30000" 
              step="500"
              value={priceRange} 
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]" 
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-2">
              <span>1,000 DZD</span>
              <span>30,000 DZD</span>
            </div>
          </div>
        </div>

        {/* Display badge if filters are active */}
        {(selectedCategoryId || selectedBrand || searchQuery || priceRange !== 30000) && (
          <button 
            onClick={handleResetFilters}
            className="w-full bg-[#1A1112] border border-red-950 text-red-400 text-xs py-3 rounded-xl font-bold hover:bg-red-950 hover:text-red-300 transition-colors flex items-center justify-center gap-1.5"
            id="clear-all-filters-aside"
          >
            <X className="w-4 h-4" /> Effacer et réinitialiser
          </button>
        )}
      </aside>

      {/* CORE STORE GRID PANEL */}
      <main className="flex-1 flex flex-col gap-8">
        {/* Sort header and catalog details */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111] p-4 rounded-xl border border-white/10 gap-3">
          <div className="text-xs text-slate-400">
            {searchQuery ? (
              <span>Résultats de recherche pour "<strong className="text-white">{searchQuery}</strong>" : </span>
            ) : null}
            <span className="font-bold text-white">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 font-mono tracking-wider">
              Trier par :
            </span>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-[#161616] border border-white/10 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#D4AF37] text-slate-300"
            >
              <option value="default">Récent / Par défaut</option>
              <option value="price-asc">Prix de l'article croissant</option>
              <option value="price-desc">Prix de l'article décroissant</option>
            </select>
          </div>
        </div>

        {/* Product results list */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4">
            <span className="text-5xl">📦</span>
            <h3 className="font-bold text-md text-white font-display uppercase tracking-wider">Aucun produit trouvé</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Aucun matériel ne correspond à vos filtres actuels. Réduisez les filtres ou réinitialisez le catalogue pour recommencer.
            </p>
            <button 
              onClick={handleResetFilters}
              className="bg-[#12110D] border border-[#D4AF37]/30 text-[#D4AF37] px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors mt-2"
              id="no-products-reset-btn"
            >
              Tout afficher
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={onViewProduct} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
