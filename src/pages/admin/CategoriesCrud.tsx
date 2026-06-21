import React, { useState, useEffect } from 'react';
import { Save, Loader2, Trash2, Edit2, ShieldAlert, Plus } from 'lucide-react';
import { Category } from '../../types/store';

interface CategoriesCrudProps {
  adminToken: string;
  onRefreshCategories: () => void;
}

export default function CategoriesCrud({ adminToken, onRefreshCategories }: CategoriesCrudProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorError, setErrorError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error("Impossible de charger les catégories.");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      console.error(err);
      setErrorError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingCatId) {
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

  const resetForm = () => {
    setName('');
    setSlug('');
    setEditingCatId(null);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorError(null);

    const checkBody = { name, slug };

    try {
      const endpoint = editingCatId ? `/api/admin/categories/${editingCatId}` : '/api/admin/categories';
      const method = editingCatId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(checkBody)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur s'est produite.");

      resetForm();
      fetchCategories();
      onRefreshCategories();
    } catch (e: any) {
      console.error(e);
      setErrorError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment désactiver ou retirer cette catégorie de la boutique ?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible de supprimer.");
      
      fetchCategories();
      onRefreshCategories();
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* FORM LEFT BLOCK */}
      <div className="lg:col-span-1 bg-[#111] border border-white/10 rounded-2xl p-6 h-fit text-left">
        <h2 className="font-display font-black text-xs uppercase tracking-widest text-[#D4AF37] border-b border-white/5 pb-3 mb-6">
          {editingCatId ? "Modifier la catégorie" : "Ajouter une catégorie"}
        </h2>

        {errorError && (
          <div className="p-3 bg-red-950/20 border border-red-900 text-red-400 text-[11px] font-semibold rounded-lg mb-4 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Nom de catégorie</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Claviers Gaming"
              value={name}
              onChange={handleNameChange}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">URL Slug unique</label>
            <input 
              type="text" 
              required
              placeholder="claviers-gaming"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-[#161616] border border-white/10 focus:border-[#D4AF37] rounded-lg px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none font-mono text-slate-300"
            />
          </div>

          <div className="flex gap-2.5 mt-2">
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 bg-[#D4AF37] text-black hover:bg-[#FFF3D1] font-black h-10 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              id="cat-save-btn"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Enregistrer</>}
            </button>
            {editingCatId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="bg-white/5 border border-white/10 text-slate-400 hover:text-white px-3 rounded-lg text-xs font-bold transition-all"
                id="cat-cancel-btn"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST RIGHT CELL */}
      <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="font-display font-black text-xs uppercase tracking-widest text-[#D4AF37] border-b border-white/5 pb-3 mb-6">
          Toutes les catégories enregistrées {loading ? '(Chargement...)' : ''}
        </h2>

        {categories.length === 0 && !loading ? (
          <p className="text-xs text-slate-500 italic">Aucune catégorie existante.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 uppercase font-mono text-[9px] font-extrabold tracking-wider">
                  <th className="pb-3">Nom</th>
                  <th className="pb-3 text-left">Slug unique</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 font-bold text-white uppercase text-xs tracking-wide">{cat.name}</td>
                    <td className="py-3.5 font-mono text-slate-400">{cat.slug}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleStartEdit(cat)}
                          className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                          title="Modifier"
                          id={`btn-edit-c-${cat.id}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-slate-500 hover:text-red-400 bg-white/5 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Supprimer"
                          id={`btn-delete-c-${cat.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
