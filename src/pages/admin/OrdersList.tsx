import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, CheckCircle, Clock, Trash2, XCircle, Loader2, RefreshCw, Eye } from 'lucide-react';

interface OrdersListProps {
  adminToken: string;
  selectedOrderId: string | null;
  onClearSelectedOrderId: () => void;
}

export default function OrdersList({ adminToken, selectedOrderId, onClearSelectedOrderId }: OrdersListProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorError, setErrorError] = useState<string | null>(null);

  // Focus order details mapping
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(selectedOrderId);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!res.ok) throw new Error("Impossible de charger le carnet de commandes.");
      const data = await res.json();
      setOrders(data);
    } catch (e: any) {
      console.error(e);
      setErrorError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [adminToken]);

  // Expand automatically on focus selection
  useEffect(() => {
    if (selectedOrderId) {
      setExpandedOrderId(selectedOrderId);
      onClearSelectedOrderId(); // Clear global selection state trigger
    }
  }, [selectedOrderId]);

  const handleUpdatePaymentStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: nextStatus } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: nextStatus, status: nextStatus } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-black italic uppercase font-display text-white tracking-tight">Liste des commandes</h1>
          <p className="text-xs text-slate-500 mt-0.5">Carnet d'expédition Miliana Service Informatique.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="p-2 border border-white/15 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Rafraîchir"
          id="btn-refresh-orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center text-[#D4AF37]"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : errorError ? (
        <div className="p-4 bg-red-950/20 border border-red-900 text-red-500 text-xs rounded-lg">{errorError}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-[#111] border border-white/10 rounded-xl text-slate-600 text-xs italic">Aucune commande reçue.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            return (
              <div 
                key={ord.id}
                className={`bg-[#111] border transition-colors rounded-xl overflow-hidden ${
                  isExpanded ? 'border-[#D4AF37]' : 'border-white/10 hover:border-white/20'
                }`}
                id={`order-entry-${ord.id}`}
              >
                {/* Header Row */}
                <div 
                  onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#161616] flex items-center justify-center text-[#D4AF37]">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#D4AF37]">{ord.order_number}</span>
                        <span className="text-[10px] text-slate-500 font-mono">| {new Date(ord.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm mt-1">{ord.customer_name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-500 font-mono">TOTAL DZD :</span>
                      <span className="font-mono font-black text-sm text-white">{ord.total_dzd?.toLocaleString()} DZD</span>
                    </div>

                    {/* Payment status badge */}
                    <div className="text-center md:min-w-[100px]">
                      {ord.payment_status === 'paid' ? (
                        <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] uppercase font-bold px-2 py-0.5 rounded font-mono">Payé</span>
                      ) : (
                        <span className="inline-block bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] uppercase font-bold px-2 py-0.5 rounded font-mono">En attente</span>
                      )}
                    </div>

                    {/* Order progress status badge */}
                    <div className="text-center md:min-w-[100px]">
                      {ord.order_status === 'completed' || ord.order_status === 'delivered' ? (
                        <span className="inline-block bg-green-500/10 text-green-400 border border-green-500/35 text-[9px] uppercase font-bold px-2 py-0.5 rounded font-mono">Livré</span>
                      ) : ord.order_status === 'cancelled' ? (
                        <span className="inline-block bg-white/5 text-slate-600 border border-white/5 text-[9px] uppercase font-bold px-2 py-0.5 rounded font-mono">Annulé</span>
                      ) : (
                        <span className="inline-block bg-[#1C1A14] text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] uppercase font-bold px-2 py-0.5 rounded font-mono">En cours</span>
                      )}
                    </div>

                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                  </div>
                </div>

                {/* EXPANDED CONTENT AREA */}
                {isExpanded && (
                  <div className="bg-[#151515] border-t border-white/5 p-5 flex flex-col gap-6 text-xs">
                    
                    {/* Customer coordinates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pb-4 border-b border-white/5">
                      <div>
                        <span className="block text-[10px] uppercase text-slate-500 font-mono tracking-wider mb-1">Coordonnées client :</span>
                        <div className="flex flex-col gap-1 text-slate-300">
                          <span>Téléphone: <strong className="font-mono text-white text-xs">{ord.customer_phone}</strong></span>
                          <span>Email: {ord.customer_email || 'Non fourni'}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-slate-500 font-mono tracking-wider mb-1">Adresse de livraison :</span>
                        <div className="text-slate-300">
                          <span className="font-bold text-white uppercase italic">{ord.wilaya}</span>
                          <p className="mt-1 leading-normal text-slate-400">{ord.shipping_address}</p>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-slate-500 font-mono tracking-wider mb-1">Instructions complémentaires :</span>
                        <p className="text-slate-400 italic">{ord.notes || 'Aucune consigne spécifiée par le client.'}</p>
                      </div>
                    </div>

                    {/* Products details */}
                    <div>
                      <span className="block text-[10px] uppercase text-slate-500 font-mono tracking-wider mb-2.5">Matériels inclus :</span>
                      <div className="bg-black/35 border border-white/5 rounded-lg divide-y divide-white/5">
                        {ord.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-3.5 flex items-center justify-between gap-4 text-xs font-mono">
                            <div className="flex-1">
                              <h4 className="font-bold text-white font-sans text-xs">{item.products?.name || "Article supprimé"}</h4>
                              <span className="text-[10px] text-slate-500">Marque: {item.products?.brand || 'MSI'}</span>
                            </div>
                            <div className="text-right flex items-center gap-8">
                              <span className="text-slate-400 font-bold">{item.quantity} &times; {item.price_dzd?.toLocaleString()} DZD</span>
                              <span className="text-white font-black min-w-[90px]">{(item.quantity * item.price_dzd)?.toLocaleString()} DZD</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive operational status triggers */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 bg-[#1A1A1A] -mx-5 -mb-5 px-5 py-4">
                      
                      {/* Payment switch option */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase text-slate-500 font-mono font-bold">Règlement :</span>
                        <button 
                          onClick={() => handleUpdatePaymentStatus(ord.id, ord.payment_status)}
                          className={`px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all border ${
                            ord.payment_status === 'paid'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-[#111] hover:text-slate-500 hover:border-white/5'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]'
                          }`}
                          id={`btn-pay-status-${ord.id}`}
                        >
                          {ord.payment_status === 'paid' ? "Marquer non-payé" : "Confirmer règlement"}
                        </button>
                      </div>

                      {/* Shipments progress choices */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase text-slate-500 font-mono font-bold">Avancement :</span>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleUpdateOrderStatus(ord.id, 'pending')}
                            className={`px-2.5 py-1.5 rounded text-[9px] uppercase font-bold border transition-colors ${
                              ord.order_status === 'pending'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                            id={`btn-ord-pending-${ord.id}`}
                          >
                            En attente
                          </button>
                          <button 
                            onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                            className={`px-2.5 py-1.5 rounded text-[9px] uppercase font-bold border transition-colors ${
                              ord.order_status === 'completed' || ord.order_status === 'delivered'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                            id={`btn-ord-completed-${ord.id}`}
                          >
                            Expédié / Livré
                          </button>
                          <button 
                            onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                            className={`px-2.5 py-1.5 rounded text-[9px] uppercase font-bold border transition-colors ${
                              ord.order_status === 'cancelled'
                                ? 'bg-red-500/10 border-red-500/30 text-red-500'
                                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                            id={`btn-ord-cancelled-${ord.id}`}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
