import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, AlertTriangle, ArrowRight, Loader2, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  adminToken: string;
  setCurrentAdminSubtab: (subtab: string) => void;
  onSelectOrderDetails: (orderId: string) => void;
}

export default function Dashboard({ adminToken, setCurrentAdminSubtab, onSelectOrderDetails }: DashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        if (!res.ok) throw new Error("Échec du chargement des statistiques.");
        const data = await res.json();
        setStats(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [adminToken]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-[#D4AF37]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-900 text-red-400 text-xs rounded-lg font-semibold">
        Une erreur s'est produite : {error}
      </div>
    );
  }

  const salesData = stats?.salesOverTime || [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-black italic uppercase text-white font-display tracking-tight flex items-center gap-2">
          Vue d'ensemble du magasin
        </h1>
        <p className="text-xs text-slate-500 mt-1">Données et statistiques d'activité de Miliana Service Informatique.</p>
      </div>

      {/* METRIC CARD CELLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-display">
        {/* Total revenue cell */}
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-500 font-mono tracking-wider">Chiffre d'affaires</span>
            <span className="block text-2xl font-black font-mono text-white mt-1">
              {stats?.totalRevenue?.toLocaleString()} <span className="text-xs font-semibold text-[#D4AF37]">DZD</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total orders count */}
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-500 font-mono tracking-wider">Total Commandes</span>
            <span className="block text-2xl font-black font-mono text-white mt-1">
              {stats?.ordersCount} <span className="text-xs font-semibold text-[#D4AF37]">reçues</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Out of stock alert count */}
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 flex items-center justify-between group hover:border-red-950 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-500 font-mono tracking-wider">Articles Épuisés</span>
            <span className={`block text-2xl font-black font-mono mt-1 ${stats?.outOfStockCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
              {stats?.outOfStockCount} <span className="text-xs font-semibold">ruptures</span>
            </span>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats?.outOfStockCount > 0 ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-slate-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* RECHARTS PLOT & RECENT TRANSACTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales charts over time */}
        <div className="lg:col-span-2 bg-[#111] border border-white/10 p-6 rounded-xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-white">Graphique des ventes de la semaine</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Suivi de l'évolution du chiffre d'affaires quotidien estimé.</p>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#555" fontSize={10} fontFamily='var(--font-mono)' />
                <YAxis stroke="#555" fontSize={10} fontFamily='var(--font-mono)' />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161616', borderColor: '#333', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', color: '#D4AF37' }}
                />
                <Area type="monotone" dataKey="total" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Order rows */}
        <div className="bg-[#111] border border-white/10 p-6 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-baseline mb-4">
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-white">Dernières Commandes</h3>
              <button 
                onClick={() => setCurrentAdminSubtab('commandes')}
                className="text-[10px] text-slate-400 hover:text-[#D4AF37] font-mono uppercase"
              >
                Toutes
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {stats?.recentOrders?.length === 0 ? (
                <div className="text-center py-10 text-slate-600 text-xs italic">Aucune commande reçue</div>
              ) : (
                stats?.recentOrders?.map((ord: any) => (
                  <div 
                    key={ord.id}
                    onClick={() => onSelectOrderDetails(ord.id)}
                    className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between hover:border-[#D4AF37]/35 transition-colors cursor-pointer"
                    id={`stat-row-${ord.id}`}
                  >
                    <div>
                      <span className="font-mono text-[10px] font-black text-[#D4AF37]">{ord.order_number}</span>
                      <span className="block text-[11px] font-semibold text-white mt-0.5 leading-none">{ord.customer_name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[11px] text-white block">{ord.total_dzd?.toLocaleString()} DZD</span>
                      {ord.payment_status === 'paid' ? (
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-mono text-emerald-400 font-bold uppercase"><CheckCircle className="w-2.5 h-2.5" /> Payé</span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-mono text-amber-500 font-bold uppercase"><Clock className="w-2.5 h-2.5" /> En attente</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
