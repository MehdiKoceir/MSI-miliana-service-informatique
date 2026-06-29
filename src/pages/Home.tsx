import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  Zap, 
  Award, 
  Star, 
  Milestone, 
  ShieldAlert, 
  Cpu, 
  Check, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  Activity, 
  Users, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  PhoneCall,
  Clock
} from 'lucide-react';
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
  const [selectedConfig, setSelectedConfig] = useState('gaming');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const heroSlides = [
    {
      badge: "🔥 PERFORMANCE GAMING ULTIME",
      title: "MSI Creator Pro Intel i9",
      subtitle: "Unité Centrale Assemblée sur-mesure",
      desc: "Équipé d'un Core i9 de 14ème génération et d'une NVIDIA RTX 4080 Super pour une puissance de calcul et de rendu phénoménale.",
      price: "385 000 DZD",
      img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
      productSlug: "pc-bureau-creator-pro-i9"
    },
    {
      badge: "📱 LE FLAGSHIP SANS CONCESSION",
      title: "iPhone 15 Pro Max Titanium",
      subtitle: "Fleuron Apple en Titane de Luxe",
      desc: "Boîtier d'alliage titane ultra-résistant de qualité aérospatiale, puce A17 Pro et zoom optique 5x exclusif.",
      price: "195 000 DZD",
      img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      productSlug: "apple-iphone-15-pro-max-256gb"
    },
    {
      badge: "⌨️ ACCESSOIRES ET PÉRIPHÉRIQUES ÉLITE",
      title: "Havit Gamenote RGB",
      subtitle: "Clavier Mécanique Haute Performance",
      desc: "Commutateurs mécaniques ultra-réactifs et rétroéclairage RGB personnalisable pour sublimer vos sessions gaming.",
      price: "8 500 DZD",
      img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
      productSlug: "havit-gamenote-rgb-clavier"
    }
  ];

  const handleViewSlideProduct = (slug: string) => {
    const p = products.find(prod => prod.slug === slug);
    if (p) {
      onViewProduct(p);
    } else {
      setCurrentTab('boutique');
    }
  };

  const configs = [
    {
      id: 'gaming',
      title: '🎮 Configuration Alpha Gaming',
      usage: 'Jeux 1440p / 4K, Cyberpunk 2077, streaming ultra fluide, haut FPS.',
      specs: [
        'Intel Core i5-14600K / Ryzen 5 7600X',
        'Nvidia GeForce RTX 4070 12Go Super',
        '32 Go DDR5 6000MHz Dual Channel Corsair',
        '1 To SSD NVMe Samsung Gen4 High-Speed 7000Mb/s'
      ],
      approxPrice: '210 000 DZD',
      message: 'Bonjour MTS ! Je souhaite un devis complet pour le pack "Alpha Gaming" à environ 210,000 DZD. Pouvez-vous me proposer les pièces actuelles en stock ?'
    },
    {
      id: 'workstation',
      title: '🎬 Configuration Workstation Creative & Pro',
      usage: 'Montage vidéo 4K/8K, modélisation 3D (Blender), ingénierie et virtualisation.',
      specs: [
        'Intel Core i9-14900K / Ryzen 9 7900X',
        'Nvidia GeForce RTX 4080 Super 16Go GDDR6X',
        '64 Go DDR5 5600MHz Kingston Fury Dual Channel',
        '2 To SSD NVMe WD Black Gen4 premium + Heatsink'
      ],
      approxPrice: '380 000 DZD',
      message: 'Bonjour MTS ! Je suis créateur de contenu / professionnel et je souhaite configurer une machine de travail de type "Workstation Pro" (~380,000 DZD). Quels composants suggérez-vous ?'
    },
    {
      id: 'essential',
      title: '💻 Configuration Office & Dev',
      usage: 'Développement logiciel, bureautique multitâche intense, études supérieures.',
      specs: [
        'Intel Core i5-12400 / Ryzen 5 5600',
        'AMD Radeon RX 6605 8Go / Intel Graphics intégrée',
        '16 Go DDR4 3200MHz Corsair Vengeance',
        '512 Go SSD NVMe Kingston NV2 Fast Boot'
      ],
      approxPrice: '95 000 DZD',
      message: 'Bonjour MTS ! Je cherche un PC fixe polyvalent "Office & Dev" réactif et sécurisé pour un budget d`environ 95,000 DZD. Proposez-vous un montage correspondant ?'
    }
  ];

  const faqs = [
    {
      q: "Quels sont vos délais de livraison en Algérie ?",
      a: "Nous assurons une livraison hautement sécurisée et assurée dans les 58 Wilayas via notre partenaire de messagerie rapide (Yalidine). Les délais de transport sont généralement de 24h à 48h pour les communes du centre du pays, et de 48h à 72h pour les autres wilayas."
    },
    {
      q: "Quelles garanties offrez-vous sur vos smartphones et ordinateurs ?",
      a: "Chaque produit High-tech acheté chez Miliana Tech Space bénéficie d'une garantie matérielle pièces et main d'œuvre de 12 à 36 mois. Notre service après-vente (SAV) est opéré directement par nos techniciens qualifiés au sein de notre atelier de Miliana."
    },
    {
      q: "Est-il possible de personnaliser intégralement un PC fixe ?",
      a: "Absolument ! Nos suggestions de configuration servent de référence de rapport qualité-prix. Notre équipe peut échanger individuellement avec vous pour s'adapter à votre budget ou vos préférences de marques (Intel, AMD, Nvidia, ASUS, MSI, Corsair, etc.)."
    },
    {
      q: "Puis-je tester mon matériel en boutique avant d'acheter ?",
      a: "C'est l'un de nos atouts majeurs. Nous vous accueillons au niveau de notre boutique à Miliana pour installer, démarrer et tester ou installer des outils de benchmarks sur votre machine pour valider les performances à vos côtés."
    }
  ];

  const testimonials = [
    {
      name: "Riad B.",
      location: "Alger",
      text: "J'ai commandé un PC de montage pro haut de gamme pour l'architecture 3D. Assemblage parfait, câble management impeccable et carte graphique testée sous stress pendant 4 heures. Service d'une honnêteté rare en Algérie !",
      rating: 5,
      date: "Juin 2026",
      tag: "Architecte"
    },
    {
      name: "Kamel M.",
      location: "Miliana",
      text: "Superbe boutique ! J'ai acheté mon nouveau téléphone premium avec garantie officielle. L'équipe a pris le temps de transférer gratuitement mes données et m'a offert un film protecteur. Je recommande à 100%.",
      rating: 5,
      date: "Mai 2026",
      tag: "Achat Smartphone"
    },
    {
      name: "Sonia G.",
      location: "Oran",
      text: "Livraison sécurisée reçue en 48h à Oran. Le colis du PC gamer était extrêmement bien protégé avec plusieurs couches de mousse de protection. Tout fonctionne à merveille, SAV hyper réactif sur WhatsApp.",
      rating: 5,
      date: "Avril 2026",
      tag: "Client Distant"
    }
  ];

  const activeConfig = configs.find(c => c.id === selectedConfig) || configs[0];

  const handleSendCustomPCMsg = () => {
    const encoded = encodeURIComponent(activeConfig.message);
    window.open(`https://wa.me/213555123456?text=${encoded}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-16 pb-16">
      <MetadataHelper 
        title="Boutique Informatique & High-Tech" 
        description="Bienvenue chez Miliana Tech Space (MTS). Votre espace de confiance pour smartphones, ordinateurs sur-mesure, portables et matériel gaming en Algérie." 
      />

      {/* AUTO-CYCLING EFFECT FOR HERO SLIDES */}
      {(() => {
        React.useEffect(() => {
          const timer = setInterval(() => {
            setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
          }, 8000);
          return () => clearInterval(timer);
        }, []);
        return null;
      })()}

      {/* LUXURY HERO BANNER WITH INTEGRATED LIVE DASHBOARD */}
      <section className="relative w-full py-16 sm:py-20 px-6 sm:px-12 bg-linear-to-b from-[#0F0F0B] via-[#16140D] to-[#0A0A0A] border-b border-[#D4AF37]/15 overflow-hidden flex items-center min-h-[620px]">
        {/* Decorative background visual elements */}
        <div className="absolute right-[-10%] top-[-10%] w-[600px] h-[600px] border-[1px] border-[#D4AF37]/5 rounded-full select-none pointer-events-none animate-spin" style={{ animationDuration: '80s' }}></div>
        <div className="absolute right-[15%] bottom-[-10%] w-[350px] h-[350px] border-[1px] border-[#D4AF37]/10 rounded-full select-none pointer-events-none"></div>
        <div className="absolute left-[5%] bottom-[5%] w-[300px] h-[300px] bg-[#D4AF37]/5 blur-[120px] rounded-full select-none pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO TYPOGRAPHY COL WITH DYNAMIC INTERACTIVE SLIDER */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="flex items-center gap-2 mb-5">
                <span className="bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FFF3D1] px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.25em] inline-flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                  Boutique officielle • Miliana 2026
                </span>
              </div>

              {/* Dynamic Slide Container with beautiful entry animations */}
              <div className="min-h-[320px] sm:min-h-[290px] w-full flex flex-col justify-between group/slide">
                <div>
                  <span className="text-xs font-bold text-[#D4AF37] tracking-[0.2em] block uppercase mb-2 font-mono">
                    {heroSlides[activeHeroSlide].badge}
                  </span>
                  
                  <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter leading-[0.95] text-white font-display uppercase mb-2">
                    {heroSlides[activeHeroSlide].title} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3D1] to-[#D4AF37] drop-shadow-[0_2px_10px_rgba(212,175,55,0.15)]">
                      {heroSlides[activeHeroSlide].subtitle}
                    </span>
                  </h1>

                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed mb-6 font-light">
                    {heroSlides[activeHeroSlide].desc}
                  </p>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none mb-1">Tarif Spécial</span>
                      <span className="text-xl sm:text-2xl font-black font-mono text-white">
                        {heroSlides[activeHeroSlide].price}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <span className="text-[11px] font-mono text-green-400 bg-green-950/20 border border-green-500/20 px-2.5 py-1 rounded">
                      Disponible en Boutique & Livraison
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => handleViewSlideProduct(heroSlides[activeHeroSlide].productSlug)}
                    className="bg-[#D4AF37] text-black font-extrabold px-8 py-4 text-xs uppercase tracking-widest hover:bg-[#FFF3D1] hover:scale-102 active:scale-98 transition-all rounded-lg shadow-[0_4px_25px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2.5 cursor-pointer"
                    id="hero-btn-catalog"
                  >
                    <ShoppingBag className="w-4 h-4 text-black" />
                    <span>Commander cet article</span> 
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                  <button 
                    onClick={() => setCurrentTab('boutique')}
                    className="bg-white/5 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/10 font-bold px-7 py-4 text-xs uppercase tracking-widest transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2"
                    id="hero-btn-about"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Parcourir le catalogue</span>
                  </button>
                </div>
              </div>

              {/* Slider Dots indicators */}
              <div className="flex items-center gap-2 mt-8">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHeroSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                      activeHeroSlide === idx ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    title={`Aller à la diapositive ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* TRUST CRITICALS & LIVE QUEUE DASHBOARD COL */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-[#11110F] border border-white/10 hover:border-[#D4AF37]/30 transition-all rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 blur-xl"></div>
                
                {/* Metric list header style */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                  <div>
                    <h3 className="font-extrabold text-xs text-white uppercase font-display tracking-widest">
                      ÉTAT DE L'ATELIER MTS
                    </h3>
                    <p className="text-[10px] font-mono text-slate-500">Mis à jour en temps réel</p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-950/40 border border-green-500/30 text-green-400 text-[10px] font-mono rounded-full font-black animate-pulse flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> ACTIF
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Stat Card Item 1 */}
                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#D4AF37]/10 p-2.5 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37]">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-300">File d'Attente de Montage</h4>
                        <p className="text-[10px] text-slate-500 font-light">Commandé aujourd'hui, monté en 48h</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono text-white bg-white/5 px-2 py-1 rounded">24-48h</span>
                  </div>

                  {/* Stat Card Item 2 */}
                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#D4AF37]/10 p-2.5 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-300">Contrôle de Stabilité</h4>
                        <p className="text-[10px] text-slate-500 font-light">Stress tests processeur & graphique</p>
                      </div>
                    </div>
                    <span className="text-xs font-black font-mono text-green-400 uppercase tracking-widest text-[9px] bg-green-950/20 px-2 py-1 rounded border border-green-500/20">100% Validé</span>
                  </div>

                  {/* Stat Card Item 3 */}
                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#D4AF37]/10 p-2.5 rounded-lg border border-[#D4AF37]/20 text-[#D4AF37]">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-300">Avis Général Algérie</h4>
                        <p className="text-[10px] text-slate-500 font-light">Calculé sur +1 800 clients MTS</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                      <span className="text-xs font-extrabold font-mono text-white">4.9/5</span>
                    </div>
                  </div>
                </div>

                {/* Additional bottom highlights */}
                <div className="mt-5 pt-4 border-t border-white/5 text-center flex items-center justify-center gap-6">
                  <div className="text-center">
                    <span className="block text-[15px] font-mono font-black text-white leading-none">100%</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mt-1">Officiel & Neuf</span>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <div className="text-center">
                    <span className="block text-[15px] font-mono font-black text-[#D4AF37] leading-none">58</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mt-1">Wilayas Livrées</span>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <div className="text-center">
                    <span className="block text-[15px] font-mono font-black text-white leading-none">7J/7</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mt-1">Soutien Client</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMMITMENTS STATS ROADMAP GRID */}
      <section className="max-w-7xl mx-auto px-6 w-full -mt-20">
        <div className="bg-gradient-to-r from-[#111] via-[#161511] to-[#111] border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative shadow-lg">
          
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-xl relative shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase font-display tracking-tight">Montage Expert</h4>
              <p className="text-[11.5px] text-slate-400 font-light mt-1 leading-normal">
                Composants rigoureusement agencés avec un guidage de câble optimal en boutique.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 max-md:border-t max-md:pt-4 max-md:border-white/5 border-l border-white/5 lg:pl-6">
            <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-xl relative shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase font-display tracking-tight">58 Wilayas</h4>
              <p className="text-[11.5px] text-slate-400 font-light mt-1 leading-normal">
                Envoi sécurisé à domicile ou stop-point avec emballage pro double carton.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 max-lg:border-t max-lg:pt-4 max-lg:border-white/5 border-l border-white/5 lg:pl-6">
            <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-xl relative shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase font-display tracking-tight">Garantie 1-3 Ans</h4>
              <p className="text-[11.5px] text-slate-400 font-light mt-1 leading-normal">
                Toutes nos pièces sont neuves, certifiées d'origine avec service SAV local garanti.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 max-lg:border-t max-lg:pt-4 max-lg:border-white/5 border-l border-white/5 lg:pl-6">
            <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-xl relative shrink-0">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase font-display tracking-tight">Support Direct</h4>
              <p className="text-[11.5px] text-slate-400 font-light mt-1 leading-normal">
                Discussion directe sur WhatsApp pour devis, conseils et questions techniques en temps réel.
              </p>
            </div>
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
              SÉLECTION PAR CATEGORIES
            </h2>
          </div>
          <button 
            onClick={() => setCurrentTab('boutique')} 
            className="text-xs font-bold text-slate-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
            id="cat-view-all"
          >
            Tout explorer <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => {
            let iconText = "🎮";
            if (category.slug.includes("telephones") || category.slug.includes("mobile") || category.slug.includes("tablette")) iconText = "📱";
            else if (category.slug.includes("ordinateurs") || category.slug.includes("pc")) iconText = "💻";
            else if (category.slug.includes("souris")) iconText = "🖱️";
            else if (category.slug.includes("clavier")) iconText = "⌨️";
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
                <h3 className="font-bold text-xs text-slate-300 group-hover:text-white font-display uppercase tracking-wider leading-tight">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE PC CONFIGURATOR & TECHNICAL ASSURANCE */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* CONFIGURATOR SIMULATOR - 7 COLS */}
          <div className="lg:col-span-7 bg-[#0E0E0C] border border-white/5 hover:border-[#D4AF37]/35 transition-all p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/5 blur-2xl rounded-full"></div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1 px-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-black uppercase tracking-widest rounded font-mono flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" /> CONFIGUREZ VOTRE PC RÉEL
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black italic text-white tracking-tight font-display uppercase leading-none mb-3">
                Atelier de Montage Sur-Mesure
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
                Sélectionnez l'une de nos configurations de référence optimisées par nos techniciens à Miliana, ou servez-vous de base pour concevoir la machine de vos rêves avec notre conseiller WhatsApp.
              </p>

              {/* TABS SWITCHER */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-black/60 rounded-xl border border-white/5 mb-6">
                {configs.map((cfg) => (
                  <button
                    key={cfg.id}
                    onClick={() => setSelectedConfig(cfg.id)}
                    className={`py-2 px-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedConfig === cfg.id
                        ? 'bg-[#D4AF37] text-black font-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cfg.id === 'gaming' ? '🎮 Gaming' : cfg.id === 'workstation' ? '🎬 Pro/3D' : '💻 Dev & Office'}
                  </button>
                ))}
              </div>

              {/* ACTIVE PRESET OVERVIEW */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-extrabold text-sm text-white font-display">
                    {activeConfig.title}
                  </h4>
                  <span className="text-xs font-mono font-black text-[#D4AF37] tracking-tight bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded-md inline-block max-sm:w-max">
                    ~ {activeConfig.approxPrice}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4 italic font-light">
                  Usage cible : {activeConfig.usage}
                </p>

                {/* Specs check bulletpoints */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-white/5">
                  {activeConfig.specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="bg-[#D4AF37]/10 p-0.5 rounded text-[#D4AF37] mt-0.5 shrink-0">
                        <Check className="w-3 h-3 font-bold" />
                      </div>
                      <span className="text-[11px] text-slate-300 font-mono leading-tight">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Whatsapp Send CTA */}
            <button
              onClick={handleSendCustomPCMsg}
              className="w-full bg-[#25D366] text-white p-4 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-[#20ba56] hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_15px_rgba(37,211,102,0.2)] cursor-pointer font-mono"
              id="btn-active-config-wa"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Devis Direct sur WhatsApp</span>
            </button>
          </div>

          {/* MILIANA TRUST COMMITMENTS - 5 COLS */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Guarantee / Assembly checklist */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  NOTRE CHARTE QUALITÉ LOCALE
                </span>
                <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight mb-4 border-b border-white/5 pb-3">
                  Pourquoi monter chez MTS ?
                </h3>

                <div className="flex flex-col gap-5">
                  <div className="flex gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-xs shrink-0 font-mono font-black">01</span>
                    <div>
                      <h5 className="text-xs font-black uppercase text-white tracking-wider leading-tight">Montage & Cable Management</h5>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                        Circulation d'air maximale et alignement impeccable de vos câbles pour un design d'exception.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-xs shrink-0 font-mono font-black">02</span>
                    <div>
                      <h5 className="text-xs font-black uppercase text-white tracking-wider leading-tight">Tests Thermiques Rigoureux</h5>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                        Chaque machine subit des tests de charge intensifs CPU/GPU pour garantir une stabilité totale.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-xs shrink-0 font-mono font-black">03</span>
                    <div>
                      <h5 className="text-xs font-black uppercase text-white tracking-wider leading-tight">Composants Officiels Garantis</h5>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                        Toutes nos pièces proviennent de circuits officiels avec garantie de 12 à 36 mois.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Badge info */}
              <div className="mt-6 pt-4 border-t border-white/5 bg-black/40 p-4 rounded-xl flex items-center gap-3">
                <div className="bg-[#D4AF37]/10 p-2 border border-[#D4AF37]/35 text-[#D4AF37] rounded-lg">
                  <Award className="w-5 h-5 shrink-0" />
                </div>
                <div className="text-[10px] leading-relaxed text-slate-400 font-light">
                  <strong className="text-white font-bold">MTS Miliana Tech Space</strong> est votre assembleur expert de référence en Algérie.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROMOTION / HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="bg-gradient-to-r from-[#111] via-[#1A1811] to-[#111] border border-[#D4AF37]/20 rounded-2xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/5 blur-2xl rounded-full"></div>
          
          <div className="max-w-xl">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-[9px] uppercase tracking-[0.25em] font-black px-2 py-0.5 rounded border border-[#D4AF37]/20">
                PROMOTION CONNECTÉE & PC
              </span>
              <span className="bg-white/5 text-slate-300 font-mono text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded border border-white/10">
                MONTAGE & MATÉRIEL SÉCURISÉ
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black italic text-white tracking-tight uppercase font-display leading-none mb-3">
              VOTRE HIGH-TECH AVEC ENGAGEMENT SÉCURISÉ
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pour chaque achat de PC complet ou de smartphone premium, profitez d'une configuration gratuite du système, de tests rigoureux en atelier, et d'un service après-vente dédié directement en boutique à Miliana. Nous offrons également une réduction exceptionnelle sur les enceintes de salon et accessoires.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-black/40 border border-white/5 p-6 rounded-xl w-full lg:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right pr-4 border-r border-[#D4AF37]/20">
              <span className="block text-[8px] text-slate-500 font-mono tracking-widest uppercase">DESKTOP / MOBILE</span>
              <span className="font-mono text-sm text-[#D4AF37] font-black block sm:inline">Montage Offert</span>
            </div>
            <button 
              onClick={() => setCurrentTab('boutique')}
              className="bg-[#D4AF37] text-black font-black px-5 py-3 rounded text-[10px] uppercase tracking-wider hover:bg-[#FFF3D1] transition-all cursor-pointer font-mono shadow-[0_2px_10px_rgba(212,175,55,0.2)]"
              id="promo-pack-btn"
            >
              Voir la Sélection
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

      {/* NEW SECTION: BEAUTIFUL REVIEWS BENTO GRID */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.3em] uppercase block mb-2 font-mono">
            VRAIS RETOURS DE NOTRE BOUTIQUE
          </span>
          <h2 className="text-3xl font-black italic tracking-tight uppercase font-display text-white mb-3">
            TÉMOIGNAGES DE NOS CLIENTS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Découvrez pourquoi les passionnés d'informatique et les acheteurs de smartphones font confiance à Miliana Tech Space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testi, idx) => (
            <div 
              key={idx}
              className="bg-[#0E0E0C] border border-white/5 hover:border-[#D4AF37]/20 p-6 sm:p-7 rounded-2xl flex flex-col justify-between transition-all duration-300 relative group"
            >
              {/* Gold Quote Decoration */}
              <div className="absolute right-6 top-6 text-2xl font-serif text-[#D4AF37]/5 group-hover:text-[#D4AF37]/15 transition-colors select-none">
                “
              </div>

              <div>
                {/* Stars Indicator */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light italic">
                  "{testi.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">{testi.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">{testi.location} • {testi.date}</p>
                </div>
                <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold">
                  {testi.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW SECTION: INTERACTIVE ACCORDION FAQ */}
      <section className="max-w-4xl mx-auto px-6 w-full pb-8">
        <div className="text-center mb-10">
          <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.3em] uppercase block mb-2 font-mono">
            QUESTIONS FRÉQUENTES • FAQ
          </span>
          <h2 className="text-3xl font-black italic tracking-tight uppercase font-display text-white leading-none">
            Besoin d'éclaircissements ?
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isCurrent = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-[#0E0E0C] border border-white/5 hover:border-white/10 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isCurrent ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                  id={`faq-btn-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`w-4 h-4 shrink-0 transition-colors ${isCurrent ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
                    <span className="text-xs sm:text-sm font-bold text-white transition-colors leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isCurrent ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                </button>
                
                {isCurrent && (
                  <div className="p-4 sm:p-5 pt-0 bg-black/20 border-t border-white/5">
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support call action box */}
        <div className="mt-8 bg-gradient-to-r from-emerald-950/20 via-[#0B0B09] to-emerald-950/20 border border-[#25D366]/20 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 flex-col sm:flex-row text-center sm:text-left">
            <div className="bg-[#25D366]/10 p-2.5 border border-[#25D366]/40 text-[#25D366] rounded-xl shrink-0">
              <PhoneCall className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Vous avez une autre question spécifique ou un projet ?</h4>
              <p className="text-[11px] text-slate-400 font-light mt-0.5">Parlez instantanément à un conseiller technique de chez MTS.</p>
            </div>
          </div>
          <button
            onClick={() => {
              const text = encodeURIComponent("Bonjour MTS ! J'ai une question spécifique à propos de vos services informatiques/pièces ou livraisons.");
              window.open(`https://wa.me/213555123456?text=${text}`, '_blank');
            }}
            className="bg-[#25D366] hover:bg-[#20ba56] text-white px-5 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer font-mono shadow-[0_2px_10px_rgba(37,211,102,0.2)]"
            id="faq-whatsapp-cta"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chatter sur WhatsApp</span>
          </button>
        </div>
      </section>

    </div>
  );
}
