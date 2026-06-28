import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { 
  BarChart3, 
  ShoppingBag, 
  Tag, 
  ClipboardList, 
  Settings as SettingsIcon, 
  LogOut, 
  User, 
  ShieldAlert,
  Loader2,
  RefreshCw
} from 'lucide-react';

// STORES
import { useCartStore } from './store/cart';
import { useThemeStore } from './store/theme';
import { isSupabaseConfigured } from './lib/supabase';

// COMPONENTS
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';

// PUBLIC PAGES
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import About from './pages/About';
import Wishlist from './pages/Wishlist';

// ADMIN PAGES
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductsList from './pages/admin/ProductsList';
import ProductForm from './pages/admin/ProductForm';
import CategoriesCrud from './pages/admin/CategoriesCrud';
import OrdersList from './pages/admin/OrdersList';
import SettingsPage from './pages/admin/Settings';

// TYPES
import { Product, Category, StoreSettings } from './types/store';

export default function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
  }, [theme]);

  // NAVIGATION TABS
  const [currentTab, setCurrentTab] = useState<string>('accueil');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // ADMIN PANEL NAVIGATION TABS
  const [currentAdminSubtab, setCurrentAdminSubtab] = useState<string>('stats');
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('msi_admin_token'));
  const [adminProfile, setAdminProfile] = useState<any>(() => {
    const saved = localStorage.getItem('msi_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [focusedStatOrderId, setFocusedStatOrderId] = useState<string | null>(null);

  // DATA STATES
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(() => localStorage.getItem('msi_last_order'));

  // LOADING STATES
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);

  // Core Data loading
  const loadEssentialData = async () => {
    try {
      setLoadingData(true);
      setErrorFetching(null);

      const [pRes, cRes, sRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/settings')
      ]);

      if (!pRes.ok || !cRes.ok || !sRes.ok) {
        throw new Error("Impossible d'établir une liaison de données complète avec les serveurs.");
      }

      const [pData, cData, sData] = await Promise.all([
        pRes.json(),
        cRes.json(),
        sRes.json()
      ]);

      setProducts(pData);
      setCategories(cData);
      setStoreSettings(sData);
    } catch (e: any) {
      console.error(e);
      setErrorFetching(e.message || "Erreur de connexion serveur.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadEssentialData();
  }, []);

  // Guard: if Supabase is configured and the user has a mock-admin-token, log them out immediately
  useEffect(() => {
    if (isSupabaseConfigured && adminToken === 'mock-admin-token') {
      handleLogout();
    }
  }, [adminToken]);

  // Handle successful login checks
  const handleLoginSuccess = (token: string, profile: any) => {
    setAdminToken(token);
    setAdminProfile(profile);
    localStorage.setItem('msi_admin_token', token);
    localStorage.setItem('msi_admin_user', JSON.stringify(profile));
    setCurrentAdminSubtab('stats');
  };

  const handleLogout = () => {
    setAdminToken(null);
    setAdminProfile(null);
    localStorage.removeItem('msi_admin_token');
    localStorage.removeItem('msi_admin_user');
  };

  // Helper selectors redirection
  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('fiche-produit');
  };

  const handleExploreCategory = (categorySlug: string) => {
    const cat = categories.find(c => c.slug === categorySlug);
    if (cat) {
      setSelectedCategoryId(cat.id);
      setCurrentTab('boutique');
    }
  };

  const handleSetConfirmedOrderId = (id: string) => {
    setConfirmedOrderId(id);
    localStorage.setItem('msi_last_order', id);
    setCurrentTab('confirmation');
  };

  // Trigger from Dashboard to detail viewing in Orders tab
  const handleSelectOrderDetails = (orderId: string) => {
    setFocusedStatOrderId(orderId);
    setCurrentAdminSubtab('commandes');
  };

  // Primary Renderer
  const renderTabContent = () => {
    if (loadingData) {
      return (
        <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest">Initialisation de l'infrastructure MSI...</p>
        </div>
      );
    }

    if (errorFetching) {
      return (
        <div className="max-w-md mx-auto py-20 px-6 text-center text-slate-400 flex flex-col items-center gap-4">
          <ShieldAlert className="w-12 h-12 text-red-500" />
          <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">Erreur de connexion</h2>
          <p className="text-xs leading-relaxed">
            Le serveur Express n'est pas joignable ou rencontre une indisponibilité temporaire. {errorFetching}
          </p>
          <button 
            onClick={loadEssentialData}
            className="mt-2 bg-[#D4AF37] text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Réessayer
          </button>
        </div>
      );
    }

    switch (currentTab) {
      case 'accueil':
        return (
          <Home 
            products={products} 
            categories={categories} 
            onViewProduct={handleViewProductDetails} 
            onExploreCategory={handleExploreCategory}
            setCurrentTab={setCurrentTab}
          />
        );
      
      case 'boutique':
        return (
          <Catalog 
            products={products} 
            categories={categories}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            onViewProduct={handleViewProductDetails}
          />
        );

      case 'fiche-produit':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onGoBack={() => {
              setSelectedProduct(null);
              setCurrentTab('boutique');
            }} 
          />
        ) : (
          <div className="text-center py-20 text-slate-500">Aucun produit sélectionné.</div>
        );

      case 'panier':
        return <CartPage setCurrentTab={setCurrentTab} />;

      case 'wishlist':
        return (
          <Wishlist 
            onViewProduct={handleViewProductDetails} 
            setCurrentTab={setCurrentTab} 
          />
        );

      case 'checkout':
        return (
          <Checkout 
            setCurrentTab={setCurrentTab} 
            onSetConfirmedOrderId={handleSetConfirmedOrderId} 
          />
        );

      case 'confirmation':
        return (
          <Confirmation 
            confirmedOrderId={confirmedOrderId} 
            setCurrentTab={setCurrentTab} 
          />
        );

      case 'a-propos':
        return <About storeSettings={storeSettings} />;

      case 'admin':
        // Protected Login view if unauthenticated
        if (!adminToken) {
          return (
            <Login 
              onLoginSuccess={handleLoginSuccess} 
              setCurrentTab={setCurrentTab} 
            />
          );
        }

        // Real Admin panel layouts
        return (
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
            {/* Admin navigation sidebar */}
            <aside className="w-full md:w-60 shrink-0 flex flex-col gap-4">
              <div className="bg-[#111] border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1C180E] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <User className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[9px] text-slate-500 font-mono block uppercase">SESSION OWNER :</span>
                  <span className="font-bold text-xs text-white truncate block">{adminProfile?.full_name || 'Admin'}</span>
                </div>
              </div>

              {/* Subtab Buttons */}
              <div className="bg-[#111] border border-white/10 p-3 rounded-xl flex flex-col gap-1 text-xs">
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setCurrentAdminSubtab('stats');
                  }}
                  className={`w-full py-2.5 px-3 rounded-lg text-left font-bold flex items-center gap-2.5 transition-colors ${
                    currentAdminSubtab === 'stats' ? 'bg-[#D4AF37] text-black font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  id="admin-tab-stats"
                >
                  <BarChart3 className="w-4 h-4 shrink-0" /> Synthèse générale
                </button>
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setCurrentAdminSubtab('produits');
                  }}
                  className={`w-full py-2.5 px-3 rounded-lg text-left font-bold flex items-center gap-2.5 transition-colors ${
                    currentAdminSubtab === 'produits' || currentAdminSubtab === 'editer-produit' ? 'bg-[#D4AF37] text-black font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  id="admin-tab-products"
                >
                  <Tag className="w-4 h-4 shrink-0" /> Produits du magasin
                </button>
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setCurrentAdminSubtab('categories');
                  }}
                  className={`w-full py-2.5 px-3 rounded-lg text-left font-bold flex items-center gap-2.5 transition-colors ${
                    currentAdminSubtab === 'categories' ? 'bg-[#D4AF37] text-black font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  id="admin-tab-categories"
                >
                  <ClipboardList className="w-4 h-4 shrink-0" /> Catégories
                </button>
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setCurrentAdminSubtab('commandes');
                  }}
                  className={`w-full py-2.5 px-3 rounded-lg text-left font-bold flex items-center gap-2.5 transition-colors ${
                    currentAdminSubtab === 'commandes' ? 'bg-[#D4AF37] text-black font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  id="admin-tab-orders"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" /> Commandes reçues
                </button>
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setCurrentAdminSubtab('parametres');
                  }}
                  className={`w-full py-2.5 px-3 rounded-lg text-left font-bold flex items-center gap-2.5 transition-colors ${
                    currentAdminSubtab === 'parametres' ? 'bg-[#D4AF37] text-black font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  id="admin-tab-settings"
                >
                  <SettingsIcon className="w-4 h-4 shrink-0" /> Coordonnées boutique
                </button>
                
                <hr className="border-white/5 my-2" />

                <button 
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 rounded-lg text-left text-red-400 hover:bg-red-500/10 font-bold flex items-center gap-2.5 transition-colors"
                  id="admin-logout-btn"
                >
                  <LogOut className="w-4 h-4 shrink-0" /> Se déconnecter
                </button>
              </div>
            </aside>

            {/* Admin Right Operations Grid Pane */}
            <main className="flex-1 min-w-0">
              {currentAdminSubtab === 'stats' && (
                <Dashboard 
                  adminToken={adminToken} 
                  setCurrentAdminSubtab={setCurrentAdminSubtab}
                  onSelectOrderDetails={handleSelectOrderDetails}
                />
              )}
              {currentAdminSubtab === 'produits' && (
                <ProductsList 
                  adminToken={adminToken} 
                  onEditProduct={(p) => {
                    setEditingProduct(p);
                    setCurrentAdminSubtab('editer-produit');
                  }}
                  onCreateNew={() => {
                    setEditingProduct(null);
                    setCurrentAdminSubtab('editer-produit');
                  }}
                />
              )}
              {currentAdminSubtab === 'editer-produit' && (
                <ProductForm 
                  adminToken={adminToken}
                  categories={categories}
                  editingProduct={editingProduct}
                  onGoBack={() => setCurrentAdminSubtab('produits')}
                  onSaved={() => {
                    loadEssentialData(); // Reconnect and pull updated state
                    setCurrentAdminSubtab('produits');
                  }}
                />
              )}
              {currentAdminSubtab === 'categories' && (
                <CategoriesCrud 
                  adminToken={adminToken}
                  onRefreshCategories={loadEssentialData}
                />
              )}
              {currentAdminSubtab === 'commandes' && (
                <OrdersList 
                  adminToken={adminToken}
                  selectedOrderId={focusedStatOrderId}
                  onClearSelectedOrderId={() => setFocusedStatOrderId(null)}
                />
              )}
              {currentAdminSubtab === 'parametres' && (
                <SettingsPage 
                  adminToken={adminToken}
                  onRefreshSettings={loadEssentialData}
                />
              )}
            </main>
          </div>
        );

      default:
        return <div className="text-center py-20 text-slate-500">Page introuvable.</div>;
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-black text-slate-300 font-sans flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
        
        {/* GLOBAL HEADER HEADER */}
        <Navbar 
          currentTab={currentTab} 
          setCurrentTab={(tab) => {
            // Nullify subfilters on direct clicks
            if (tab === 'boutique') setSelectedCategoryId(null);
            setCurrentTab(tab);
          }} 
          onSearch={(q) => {
            setSearchQuery(q);
            setCurrentTab('boutique');
          }}
        />

        {/* CORE INTERACTIVE STAGE */}
        <div className="flex-1 w-full relative">
          {renderTabContent()}
        </div>

        {/* COMPREHENSIVE FOOTER */}
        <Footer setCurrentTab={setCurrentTab} storeSettings={storeSettings} />

        {/* FLOATING WHATSAPP CHAT INTEGRATION */}
        <WhatsAppWidget />

      </div>
    </HelmetProvider>
  );
}
