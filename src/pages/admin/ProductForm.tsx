import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Image, ShieldAlert } from 'lucide-react';
import { Product, Category } from '../../types/store';

interface ProductFormProps {
  adminToken: string;
  categories: Category[];
  editingProduct: Product | null;
  onGoBack: () => void;
  onSaved: () => void;
}

export default function ProductForm({ adminToken, categories, editingProduct, onGoBack, onSaved }: ProductFormProps) {
  const isEditing = Boolean(editingProduct);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [priceDzd, setPriceDzd] = useState<number>(0);
  const [compareAtPriceDzd, setCompareAtPriceDzd] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [sku, setSku] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setSlug(editingProduct.slug || '');
      setDescription(editingProduct.description || '');
      setBrand(editingProduct.brand || '');
      setPriceDzd(editingProduct.price_dzd || 0);
      setCompareAtPriceDzd(editingProduct.compare_at_price_dzd || null);
      setCategoryId(editingProduct.category_id || '');
      setStockQuantity(editingProduct.stock_quantity || 0);
      setSku(editingProduct.sku || '');
      setIsActive(editingProduct.is_active !== undefined ? editingProduct.is_active : true);
      setIsFeatured(editingProduct.is_featured || false);
      
      const primary = editingProduct.images?.find(i => i.is_primary) || editingProduct.images?.[0];
      setImageUrl(primary?.url || '');
    } else {
      // Defaults for a new item
      setName('');
      setSlug('');
      setDescription('');
      setBrand('');
      setPriceDzd(0);
      setCompareAtPriceDzd(null);
      setCategoryId(categories[0]?.id || '');
      setStockQuantity(5);
      setSku('');
      setIsActive(true);
      setIsFeatured(false);
      setImageUrl('https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80');
    }
  }, [editingProduct, categories]);

  // Sync title to slug dynamically on typing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEditing) {
      // Sluggify string
      const slugVal = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(slugVal);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    if (!name || !slug || !priceDzd) {
      setFormError("Veuillez remplir les informations obligatoires (Désignation, Slug, Prix).");
      setSaving(false);
      return;
    }

    const itemBody = {
      name,
      slug,
      description: description || null,
      brand: brand || null,
      price_dzd: Number(priceDzd),
      compare_at_price_dzd: compareAtPriceDzd ? Number(compareAtPriceDzd) : null,
      category_id: categoryId || null,
      stock_quantity: Number(stockQuantity),
      sku: sku || null,
      is_active: isActive,
      is_featured: isFeatured,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80"
    };

    try {
      const endpoint = isEditing ? `/api/admin/products/${editingProduct?.id}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(itemBody)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Une erreur s'est produite lors de l'enregistrement.");
      }

      onSaved();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Erreur de communication avec le serveur.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      
      {/* Upper header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <button 
          onClick={onGoBack}
          className="hover:text-[#D4AF37] text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1 focus:outline-none"
          id="product-form-back"
        >
          <ArrowLeft className="w-4 h-4" /> Retour de saisie
        </button>
        <span className="font-display font-black text-xs text-[#D4AF37] uppercase tracking-widest">
          {isEditing ? "ÉDITION DU MATÉRIEL" : "CRÉATION DE FICHE"}
        </span>
      </div>

      {formError && (
        <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs rounded-lg font-semibold flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* CORE FORM CONTROLS */}
      <form onSubmit={handleSubmit} className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6" id="product-crud-form">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Designation */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Désignation du produit <span className="text-[#D4AF37]">*</span></label>
            <input 
              type="text" 
              required
              placeholder="Ex: Havit KB816L RGB mécanique"
              value={name}
              onChange={handleNameChange}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          {/* URL Slug */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Slug unique URL <span className="text-[#D4AF37]">*</span></label>
            <input 
              type="text" 
              required
              placeholder="ex-slug-produit-gaming"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs font-mono text-slate-300 placeholder-slate-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Marque</label>
            <input 
              type="text" 
              placeholder="Ex: Havit, iMICE, Kalabee"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none"
            />
          </div>

          {/* SKU */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">SKU / Référence unique</label>
            <input 
              type="text" 
              placeholder="Ex: HAV-KB816L"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs w-full text-slate-200 placeholder-slate-600 focus:outline-none font-mono"
            />
          </div>

          {/* Category SELECT dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Catégorie parente</label>
            <select 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white focus:outline-none"
            >
              <option value="">-- Sélectionner --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Price DZD */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Prix de l'article (DZD) <span className="text-[#D4AF37]">*</span></label>
            <input 
              type="number" 
              required
              min="0"
              placeholder="Ex: 8500"
              value={priceDzd || ''}
              onChange={(e) => setPriceDzd(parseInt(e.target.value) || 0)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          {/* Compare at Price DZD */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Prix barré (Promotions) DZD</label>
            <input 
              type="number" 
              min="0"
              placeholder="Ex: 9900"
              value={compareAtPriceDzd || ''}
              onChange={(e) => setCompareAtPriceDzd(parseInt(e.target.value) || null)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          {/* Quantity stock */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Quantité en stock</label>
            <input 
              type="number" 
              min="0"
              placeholder="Ex: 12"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs font-mono text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Short specs descriptor */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Description de l'article</label>
          <textarea 
            rows={4}
            placeholder="Saisissez les caractéristiques détaillées du produit, commutateurs, fréquence d'alimentation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg p-4 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
          />
        </div>

        {/* IMAGE LINK RESOURCE */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">URL de l'image du produit</label>
          <div className="flex gap-4">
            <div className="flex-1">
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-700 w-full focus:outline-none"
              />
              <span className="text-[9px] text-slate-500 font-mono mt-1 block">Insérez un lien d'image direct. En mode test, utilisez de jolies photos Unsplash.</span>
            </div>
            {imageUrl && (
              <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                <img src={imageUrl} alt="" className="object-cover w-full h-full p-0.5" referrerPolicy="no-referrer" />
              </div>
            )}
          </div>
        </div>

        {/* Switches */}
        <div className="grid grid-cols-2 gap-6 bg-[#161616]/50 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="is-active-check"
              checked={isActive} 
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4.5 h-4.5 rounded text-[#D4AF37] border-white/10 bg-transparent focus:ring-[#D4AF37] accent-[#D4AF37]" 
            />
            <label htmlFor="is-active-check" className="text-xs font-bold text-white uppercase select-none cursor-pointer">Activer à la vente</label>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="is-featured-check"
              checked={isFeatured} 
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4.5 h-4.5 rounded text-[#D4AF37] border-white/10 bg-transparent focus:ring-[#D4AF37] accent-[#D4AF37]" 
            />
            <label htmlFor="is-featured-check" className="text-xs font-bold text-white uppercase select-none cursor-pointer">Produit Vedette (Featured)</label>
          </div>
        </div>

        {/* SUBMIT FORM BUTTON */}
        <button 
          type="submit" 
          disabled={saving}
          className="bg-[#D4AF37] text-black hover:bg-[#FFF3D1] disabled:bg-[#1C180E] font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] focus:outline-none flex items-center justify-center gap-1.5 mt-3"
          id="product-form-save-btn"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-4.5 h-4.5" /> Enregistrer le produit
            </>
          )}
        </button>

      </form>
    </div>
  );
}
