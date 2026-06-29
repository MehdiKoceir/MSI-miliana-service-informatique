import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, CircleAlert, ToggleLeft, ToggleRight, Loader2, Star } from 'lucide-react';
import { Product } from '../../types/store';

interface ProductsListProps {
  adminToken: string;
  onEditProduct: (product: Product) => void;
  onCreateNew: () => void;
}

export default function ProductsList({ adminToken, onEditProduct, onCreateNew }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorError, setErrorError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error("Échec du chargement des produits.");
      const data = await res.json();
      setProducts(data);
    } catch (e: any) {
      console.error(e);
      setErrorError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleActive = async (product: Product) => {
    const updatedStatus = !product.is_active;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...product,
          is_active: updatedStatus,
          imageUrl: product.images?.[0]?.url
        })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: updatedStatus } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const updatedStatus = !product.is_featured;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...product,
          is_featured: updatedStatus,
          imageUrl: product.images?.[0]?.url
        })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_featured: updatedStatus } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Voulez-vous vraiment désactiver ou supprimer définitivement ce produit de la boutique ?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Une erreur est survenue");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* Upper bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-black italic uppercase font-display text-white tracking-tight">Gestion des articles</h1>
          <p className="text-xs text-slate-500 mt-0.5">Ajoutez, modifiez ou configurer les fiches produits.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-[#D4AF37] text-black font-black px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#FFF3D1] transition-transform shadow-[0_4px_15px_rgba(212,175,55,0.15)] focus:outline-none"
          id="admin-new-product-btn"
        >
          <Plus className="w-4.5 h-4.5" /> Nouveau produit
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="relative w-full max-w-sm">
        <input 
          type="text" 
          placeholder="Rechercher par désignation, marque, SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
        />
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
      </div>

      {/* CORE PRODUCTS TABLE */}
      {loading ? (
        <div className="py-20 flex justify-center text-[#D4AF37]"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : errorError ? (
        <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs rounded-lg">{errorError}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#111] border border-white/10 rounded-xl text-slate-600 text-xs italic">Aucun article enregistré.</div>
      ) : (
        <div className="overflow-x-auto border border-white/10 rounded-xl bg-[#111]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                <th className="p-4">Produit</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Tarif</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-center">En avant</th>
                <th className="p-4 text-center">Actif</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((product) => {
                const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=100&q=80";
                return (
                  <tr key={product.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#161616] border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={primaryImage} alt="" className="object-cover w-full h-full p-0.5" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest font-black inline-block">{product.brand || "MTS"}</span>
                        <h4 className="font-bold text-white text-xs leading-none mt-0.5">{product.name}</h4>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-500">{product.sku || "N/A"}</td>
                    <td className="p-4 font-mono font-bold text-white">{product.price_dzd?.toLocaleString()} DZD</td>
                    <td className="p-4">
                      {product.stock_quantity <= 0 ? (
                        <span className="text-red-500 font-bold uppercase tracking-wide text-[9px] border border-red-500/35 bg-red-500/10 px-1.5 py-0.5 rounded">Rupture</span>
                      ) : (
                        <span className="font-mono">{product.stock_quantity} unités</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleToggleFeatured(product)}
                        className={`p-1.5 rounded-full transition-colors ${
                          product.is_featured ? 'text-[#D4AF37]' : 'text-slate-600 hover:text-white'
                        }`}
                        title="Mettre en vedette"
                        id={`btn-feature-p-${product.id}`}
                      >
                        <Star className={`w-4 h-4 ${product.is_featured ? 'fill-[#D4AF37]' : ''}`} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleToggleActive(product)}
                        className="focus:outline-none"
                        title={product.is_active ? "Cliquez pour désactiver" : "Cliquez pour activer"}
                        id={`btn-active-p-${product.id}`}
                      >
                        {product.is_active ? (
                          <ToggleRight className="w-7 h-7 text-green-500 cursor-pointer" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-slate-600 cursor-pointer" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => onEditProduct(product)}
                          className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          title="Modifier"
                          id={`btn-edit-p-${product.id}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-slate-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Supprimer"
                          id={`btn-delete-p-${product.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
