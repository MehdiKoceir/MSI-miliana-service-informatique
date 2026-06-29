import React, { useState } from 'react';
import { MessageSquare, Send, X, ShieldAlert, CheckCircle, Flame } from 'lucide-react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const mtsPhoneNumber = '213555123456'; // Official simulated Algerian number

  const contactOptions = [
    {
      title: '🖥️ Configuration PC Sur-Mesure',
      desc: 'Obtenir un devis personnalisé de montage PC.',
      template: 'Bonjour MTS ! Je souhaite obtenir un devis personnalisé pour un PC sur-mesure assemblé par vos soins. Voici mes besoins :'
    },
    {
      title: '📱 Smartphones & Tablettes',
      desc: 'Disponibilité, prix et coloris en stock.',
      template: 'Bonjour MTS ! Quels sont les derniers smartphones disponibles en boutique à Miliana avec garantie ?'
    },
    {
      title: '🔌 Périphériques & Accessoires',
      desc: 'Informations claviers, souris, montres.',
      template: 'Bonjour ! Je suis intéressé(e) par vos accessoires connectés et périphériques gamer en arrivage.'
    }
  ];

  const handleSendMessage = (text: string) => {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${mtsPhoneNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none font-sans">
      {/* Mini trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-[#25D366] text-white p-4 rounded-full shadow-[0_5px_25px_rgba(37,211,102,0.4)] hover:bg-[#20ba56] hover:scale-110 transition-all cursor-pointer flex items-center justify-center group animate-bounce"
          style={{ animationDuration: '3s' }}
          id="wa-trigger-btn"
          title="Contacter sur WhatsApp"
        >
          {/* Glowing pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-75"></span>
          
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.945 11.472.945 6.037.945 1.61 5.313 1.606 10.74c-.001 1.625.421 3.21 1.22 4.627L1.811 20.9l5.516-1.446c1.3.714 2.651 1.09 4.02 1.09zM17.472 14.4c-.32-.16-1.89-.933-2.185-1.043-.294-.11-.508-.16-.723.16-.214.32-.832 1.043-1.019 1.261-.188.218-.375.244-.695.083-.32-.16-1.353-.5-2.578-1.599-.953-.85-1.596-1.9-1.783-2.218-.188-.317-.02-.49.14-.648.144-.143.32-.373.48-.56.16-.188.214-.317.32-.53.11-.214.053-.4-.027-.56-.08-.16-.723-1.742-.99-2.388-.262-.636-.53-.547-.723-.557-.188-.01-.4-.01-.614-.01-.215 0-.56.08-.853.4-.294.32-1.123 1.1-1.123 2.682 0 1.583 1.15 3.11 1.31 3.328.16.218 2.261 3.453 5.478 4.844.765.332 1.362.53 1.828.679.77.244 1.47.21 2.02.128.614-.09 1.89-.773 2.158-1.48.267-.707.267-1.311.188-1.439-.08-.128-.295-.208-.614-.368z" />
          </svg>
        </button>
      )}

      {/* Chat popup window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] bg-[#0E0E0E] border border-white/10 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#174D2B] to-[#121212] p-4 flex items-center justify-between border-b border-[#25D366]/20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center border border-[#25D366]/40">
                <span className="w-2.5 h-2.5 bg-[#25D366] rounded-full absolute bottom-0 right-0 animate-pulse border-2 border-[#0E0E0E]"></span>
                <span className="text-xl">🟢</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white font-display">MTS Miliana Support</h4>
                <p className="text-[10px] font-mono text-slate-400">Réponse rapide via WhatsApp</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 px-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              id="wa-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#0A0A0A] flex flex-col gap-3">
            <div className="text-xs text-slate-400 leading-relaxed mb-1 bg-[#121212] p-3 rounded-xl border border-white/5">
              💡 Sélectionnez une demande ci-dessous pour ouvrir une discussion directe sur WhatsApp avec notre conseiller à Miliana :
            </div>

            {contactOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(opt.template)}
                className="w-full text-left bg-[#121212] hover:bg-[#1C1C16] border border-white/5 hover:border-[#25D366]/40 p-3.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 group"
                id={`wa-opt-${i}`}
              >
                <div className="flex-1">
                  <div className="font-bold text-xs text-white group-hover:text-[#25D366] transition-colors">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-light">
                    {opt.desc}
                  </div>
                </div>
                <Send className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#0B0B0B] text-center border-t border-white/5 text-[9px] text-slate-500 font-mono tracking-wider">
            ⚡ MILIANA TECH SPACE • DISPONIBLE 7J/7
          </div>
        </div>
      )}
    </div>
  );
}
