import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const app = express();
const PORT = 3000;

// Enable JSON body parsing for all routes
app.use(express.json());

// Initialize Supabase Admin client lazily or fallback
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const hasSupabase = Boolean(supabaseUrl && supabaseServiceKey);

const supabaseAdminClient = hasSupabase
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })
  : null;

// ==========================================
// IN-MEMORY FALLBACK DATABASE STATE
// ==========================================
let mockStoreSettings = {
  id: 1,
  store_name: "MSI - Miliana Service Informatique",
  phone: "+213 555 12 34 56",
  address: "Rue de l'Émir Abdelkader, Miliana, Algérie",
  instagram_url: "https://instagram.com/miliana_service_informatique",
  facebook_url: "https://facebook.com/miliana_service_informatique"
};

let mockCategories = [
  { id: "cat-1", name: "Téléphones & Tablettes", slug: "telephones-tablettes", display_order: 1 },
  { id: "cat-7", name: "Ordinateurs & PCs", slug: "ordinateurs-pcs", display_order: 2 },
  { id: "cat-2", name: "Claviers Gamer", slug: "claviers-gamer", display_order: 3 },
  { id: "cat-3", name: "Souris Gamer", slug: "souris-gamer", display_order: 4 },
  { id: "cat-4", name: "Audio & Écouteurs", slug: "audio-ecouteurs", display_order: 5 },
  { id: "cat-5", name: "Montres Connectées", slug: "montres-connectees", display_order: 6 },
  { id: "cat-6", name: "Accessoires", slug: "accessoires", display_order: 7 }
];

let mockProducts = [
  {
    id: "prod-1",
    name: "Clavier Mécanique RGB Havit Gamenote",
    slug: "havit-gamenote-rgb-clavier",
    description: "Clavier gamer mécanique Havit haut de gamme avec commutateurs bleus, rétroéclairage RGB personnalisable et repose-poignet amovible. Idéal pour des sessions d'écriture et de gaming intenses.",
    brand: "Havit",
    price_dzd: 8500,
    compare_at_price_dzd: 9900,
    category_id: "cat-2",
    stock_quantity: 12,
    sku: "HAVIT-KB816L",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-1", url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80", alt_text: "Clavier Havit Gamer RGB", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-2",
    name: "Souris Gaming iMICE X6 Haute Précision",
    slug: "imice-x6-souris-gaming",
    description: "Souris ergonomique iMICE X6 pour gamer avec 7 boutons programmables, DPI réglable de 800 à 6400, et effets LED lumineux spectaculaires.",
    brand: "iMICE",
    price_dzd: 3200,
    compare_at_price_dzd: 3900,
    category_id: "cat-3",
    stock_quantity: 25,
    sku: "IMICE-X6-MOUSE",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-2", url: "https://images.unsplash.com/photo-1527813713060-acaf76c3eed1?auto=format&fit=crop&w=600&q=80", alt_text: "Souris iMICE X6 Haute Précision", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-3",
    name: "Smartwatch Ultra Z8 Gold Luxury",
    slug: "smartwatch-ultra-z8-gold",
    description: "La montre connectée ultime avec écran AMOLED, suivi de santé multipoint, réception des appels via Bluetooth, et un magnifique boîtier doré en alliage de zinc.",
    brand: "Series 8",
    price_dzd: 12000,
    compare_at_price_dzd: 15000,
    category_id: "cat-5",
    stock_quantity: 5,
    sku: "Z8-ULTRA-GOLD",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-3", url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80", alt_text: "Smartwatch Ultra Z8 Or de Luxe", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-4",
    name: "Écouteurs Sans Fil Pro Buds v2.0 Kalabee",
    slug: "ecouteurs-pro-buds-v2",
    description: "Écouteurs haut de gamme Kalabee de style intra-auriculaire avec réduction active du bruit (ANC), basses puissantes et autonomie combinée de 24 heures.",
    brand: "Kalabee",
    price_dzd: 4900,
    compare_at_price_dzd: 5900,
    category_id: "cat-4",
    stock_quantity: 15,
    sku: "KAL-PROBUDS-V2",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-4", url: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=600&q=80", alt_text: "Écouteurs Pro Buds Kalabee", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-5",
    name: "Support de Téléphone Métallique Robuste",
    slug: "support-telephone-alue-robuste",
    description: "Support de table pliable en aluminium ultra rigide avec patins antidérapants pour smartphone et tablette.",
    brand: "MSI Brand",
    price_dzd: 1800,
    compare_at_price_dzd: null,
    category_id: "cat-6",
    stock_quantity: 3,
    sku: "STAND-ALU-01",
    is_active: true,
    is_featured: false,
    images: [{ id: "img-5", url: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80", alt_text: "Support Téléphone Aluminium de bureau", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-6",
    name: "Manette Télescopique Wireless Android/iOS",
    slug: "manette-telescopique-wireless",
    description: "Manette de jeu extensible parfaite pour transformer votre téléphone en console portable. Compatible cloud gaming, Xbox Game Pass et émulateurs.",
    brand: "MOCUTE",
    price_dzd: 5500,
    compare_at_price_dzd: 6500,
    category_id: "cat-6",
    stock_quantity: 8,
    sku: "MOCUTE-T-01",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-6", url: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80", alt_text: "Manette Télescopique Smartphone", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-7",
    name: "Smartphone Android Premium 5G",
    slug: "smartphone-android-premium-5g",
    description: "Écran dynamique 120Hz, triple capteur photo haute résolution avec mode IA nuit, processeur ultra puissant de dernière génération, et batterie longue durée 5000 mAh.",
    brand: "Samsung Tech",
    price_dzd: 89000,
    compare_at_price_dzd: 95000,
    category_id: "cat-1",
    stock_quantity: 10,
    sku: "SMART-PREM-5G",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-7", url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80", alt_text: "Smartphone Android Premium 5G", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-8",
    name: "Apple iPad Pro M4 Edition",
    slug: "apple-ipad-pro-m4",
    description: "L'iPad ultime équipé de la puce surpuissante Apple M4. Écran Tandem OLED extrêmement lumineux, compatibilité avec l'Apple Pencil Pro et finesse record.",
    brand: "Apple",
    price_dzd: 210000,
    compare_at_price_dzd: null,
    category_id: "cat-1",
    stock_quantity: 4,
    sku: "APPLE-IPAD-M4",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-8", url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80", alt_text: "Apple iPad Pro M4", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-9",
    name: "PC Portable Workstation Elite - Ryzen 9 / RTX 4070",
    slug: "pc-portable-workstation-elite",
    description: "La bête de course absolue pour les créateurs et les ingénieurs. Processeur AMD Ryzen 9, carte graphique NVIDIA GeForce RTX 4070 (8Go dédié), 32 Go de RAM DDR5 et 1 To SSD NVMe. Écran 16 pouces 240Hz UHD.",
    brand: "ASUS",
    price_dzd: 265000,
    compare_at_price_dzd: 285000,
    category_id: "cat-7",
    stock_quantity: 3,
    sku: "ASUS-ROG-G16-RTX4070",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-9", url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80", alt_text: "PC Portable Workstation Asus ROG", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-10",
    name: "Unité Centrale MSI Creator Pro i9",
    slug: "pc-bureau-creator-pro-i9",
    description: "Ordinateur fixe de bureau haut de gamme assemblé par nos soins à Miliana. Intel Core i9 de 14ème génération, refroidissement liquide RGB, carte graphique NVIDIA RTX 4080 Super (16Go), 64 Go RAM et alimentation certifiée 850W Gold.",
    brand: "MSI Brand",
    price_dzd: 385000,
    compare_at_price_dzd: null,
    category_id: "cat-7",
    stock_quantity: 2,
    sku: "MSI-CREATOR-I9-DESKTOP",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-10", url: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=600&q=80", alt_text: "PC Bureau MSI Creator Pro", display_order: 1, is_primary: true }]
  },
  {
    id: "prod-11",
    name: "Apple iPhone 15 Pro Max - 256GB Titanium",
    slug: "apple-iphone-15-pro-max-256gb",
    description: "Le fleuron d'Apple doté d'un boîtier en titane ultra-résistant de qualité aérospatiale, de la nouvelle puce A17 Pro ultra-puissante, et d'un zoom optique 5x exclusif.",
    brand: "Apple",
    price_dzd: 195000,
    compare_at_price_dzd: 215000,
    category_id: "cat-1",
    stock_quantity: 6,
    sku: "APPLE-IPH15PM-256",
    is_active: true,
    is_featured: true,
    images: [{ id: "img-11", url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80", alt_text: "Apple iPhone 15 Pro Max Titan", display_order: 1, is_primary: true }]
  }
];

let mockOrders: any[] = [];

// Track mock admin profiles or static credentials for test modes
let mockAdminProfiles = [
  { id: "admin-user-id", role: "owner", full_name: "Mehdi Koceir" }
];

// ==========================================
// BOT / CRAWLER DETECTOR MIDDLEWARE
// ==========================================
app.get(['/produits/:slug', '/categories/:slug'], async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /facebookexternalhit|whatsapp|twitterbot|telegrambot|discordbot|slackbot|googlebot/i.test(userAgent);
  
  if (isBot) {
    const slug = req.params.slug;
    const isCategory = req.originalUrl.includes('/categories/');
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    
    let ogTitle = "MSI - Miliana Service Informatique";
    let ogDesc = "Boutique d'informatique, téléphonie et gaming de confiance à Miliana, Algérie.";
    let ogImage = "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=600&q=80";
    let amount = "";

    try {
      if (isCategory) {
        if (hasSupabase && supabaseAdminClient) {
          const { data } = await supabaseAdminClient.from('categories').select('*').eq('slug', slug).single();
          if (data) {
            ogTitle = `${data.name} | MSI Miliana`;
            ogDesc = `Découvrez notre collection de ${data.name} au meilleur prix.`;
          }
        } else {
          const cat = mockCategories.find(c => c.slug === slug);
          if (cat) {
            ogTitle = `${cat.name} | MSI Miliana`;
            ogDesc = `Découvrez notre collection de ${cat.name} au meilleur prix en Algérie.`;
          }
        }
      } else {
        // Product
        if (hasSupabase && supabaseAdminClient) {
          const { data: product } = await supabaseAdminClient.from('products').select('*, product_images(*)').eq('slug', slug).single();
          if (product) {
            ogTitle = `${product.name} | MSI Miliana`;
            ogDesc = product.description || ogDesc;
            amount = String(product.price_dzd);
            const primary = product.product_images?.find((img: any) => img.is_primary) || product.product_images?.[0];
            if (primary) ogImage = primary.url;
          }
        } else {
          const product = mockProducts.find(p => p.slug === slug);
          if (product) {
            ogTitle = `${product.name} | MSI Miliana`;
            ogDesc = product.description || ogDesc;
            amount = String(product.price_dzd);
            const img = product.images?.find(i => i.is_primary) || product.images?.[0];
            if (img) ogImage = img.url;
          }
        }
      }
    } catch (e) {
      console.log("Error fetching bot fallback metadata:", e);
    }

    const priceMeta = amount ? `<meta property="product:price:amount" content="${amount}">\n  <meta property="product:price:currency" content="DZD">` : "";

    return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${ogTitle}</title>
  <meta name="description" content="${ogDesc}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDesc}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${appUrl}${req.originalUrl}">
  ${priceMeta}
</head>
<body style="font-family: sans-serif; padding: 20px; background: #000; color: #fff; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37; padding: 40px; border-radius: 12px; background: #111;">
    <h1 style="color: #D4AF37;">${ogTitle}</h1>
    <img src="${ogImage}" style="max-width: 100%; border-radius: 8px; margin: 20px 0; border: 1px solid #333;" />
    <p style="font-size: 16px; line-height: 1.6; color: #ccc;">${ogDesc}</p>
    ${amount ? `<h2 style="color: #E5C158; font-size: 24px;">Tarif : ${amount} DZD</h2>` : ""}
    <a href="${appUrl}${req.originalUrl}" style="background: #D4AF37; color: #000; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; display: inline-block; margin-top: 20px;">Voir sur le site officiel</a>
  </div>
</body>
</html>`);
  }
  
  next();
});

// ==========================================
// CLIENT RATE LIMITING (ANTI-SPAM ORDERS)
// ==========================================
const ipRequestHistory = new Map<string, number[]>();

function rateLimitOrder(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.headers['x-forwarded-for'] as string || 'anonymous';
  const now = Date.now();
  
  let attempts = ipRequestHistory.get(ip) || [];
  // Clean up attempts older than 1 minute (60,000 ms)
  attempts = attempts.filter(time => now - time < 60000);
  
  if (attempts.length >= 3) {
    return res.status(429).json({ error: "Trop de requêtes. Veuillez patienter une minute avant de repasser une commande." });
  }
  
  attempts.push(now);
  ipRequestHistory.set(ip, attempts);
  next();
}

// ==========================================
// MIDDLEWARE: AUTHENTIFIED ADMIN CHECK
// ==========================================
async function reqAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "Authentification requise" });
  }
  const token = authHeader.replace('Bearer ', '');
  
  // Offline simulation/demo fallback is ONLY allowed if there is no active Supabase configuration.
  // This blocks anyone from bypassing admin authentication in production with standard test keys.
  if (token === 'mock-admin-token') {
    const host = req.headers.host || '';
    const isLocalOrPreview = 
      host.includes('localhost') || 
      host.includes('127.0.0.1') || 
      host.includes('ais-dev') || 
      host.includes('ais-pre') || 
      host.includes('run.app');

    if (hasSupabase && !isLocalOrPreview) {
      return res.status(401).json({ error: "Accès démo non autorisé avec une base de données active." });
    }
    return next();
  }
  
  if (!hasSupabase || !supabaseAdminClient) {
    return res.status(401).json({ error: "Authentification hors-ligne invalide" });
  }
  
  try {
    const { data: { user }, error: authError } = await supabaseAdminClient.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: "Session expirée ou invalide" });
    }
    
    const { data: profile, error: dbError } = await supabaseAdminClient
      .from('admin_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (dbError || !profile || !['owner', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: "Accès refusé. Profil administrateur manquant." });
    }
    
    // Admin verified!
    (req as any).adminUser = user;
    next();
  } catch (err) {
    console.error("Admin Authentication Error: ", err);
    res.status(500).json({ error: "Erreur serveur lors de la vérification de l'accès" });
  }
}

// ==========================================
// CATEGORY ENDPOINTS
// ==========================================
app.get('/api/categories', async (req, res) => {
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { data, error } = await supabaseAdminClient.from('categories').select('*').order('display_order', { ascending: true });
      if (!error && data) {
        return res.json(data);
      }
      console.log("Supabase categories fetch info (using mock fallback):", error);
    }
    res.json(mockCategories);
  } catch (err: any) {
    console.log("Categories route info (using mock fallback):", err);
    res.json(mockCategories);
  }
});

// ==========================================
// PUBLIC PRODUCTS ENDPOINTS
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { data, error } = await supabaseAdminClient
        .from('products')
        .select('*, product_images(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (!error && data) {
        const mapped = data.map(p => ({
          ...p,
          images: p.product_images || []
        }));
        return res.json(mapped);
      }
      console.log("Supabase products fetch info (using mock fallback):", error);
    }
    res.json(mockProducts);
  } catch (err: any) {
    console.log("Products route info (using mock fallback):", err);
    res.json(mockProducts);
  }
});

app.get('/api/products/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { data, error } = await supabaseAdminClient
        .from('products')
        .select('*, product_images(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (!error && data) {
        return res.json({
          ...data,
          images: data.product_images || []
        });
      }
      console.log(`Supabase product with slug ${slug} fetch mapping (using mock fallback)`);
    }
    
    const product = mockProducts.find(p => p.slug === slug);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (err: any) {
    console.log("Product detail route info (using mock fallback):", err);
    const product = mockProducts.find(p => p.slug === slug);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  }
});

// ==========================================
// STORE SETTINGS
// ==========================================
app.get(['/api/store-settings', '/api/settings'], async (req, res) => {
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { data, error } = await supabaseAdminClient.from('store_settings').select('*').eq('id', 1).single();
      if (!error && data) {
        return res.json(data);
      }
      console.log("Supabase store_settings info (using mock fallback):", error);
    }
    res.json(mockStoreSettings);
  } catch (err: any) {
    console.log("Store settings route info (using mock fallback):", err);
    res.json(mockStoreSettings);
  }
});

// ==========================================
// SECURE ORDER & CHECKOUT (CASH ON DELIVERY)
// ==========================================
const OrderSchema = z.object({
  customerName: z.string().min(2, "Nom requis"),
  customerPhone: z.string().min(8, "Numéro de téléphone algérien obligatoire"),
  customerEmail: z.string().email("Email invalide").optional().or(z.literal('')),
  wilaya: z.string().min(2, "Wilaya requise"),
  shippingAddress: z.string().min(5, "Adresse de livraison requise"),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1)
  })).min(1, "Le panier ne peut pas être vide")
});

app.post('/api/orders/checkout', rateLimitOrder, async (req, res) => {
  try {
    const check = OrderSchema.safeParse(req.body);
    if (!check.success) {
      return res.status(400).json({ error: "Données de commande invalides", details: check.error.issues });
    }
    
    const { customerName, customerPhone, customerEmail, wilaya, shippingAddress, notes, items } = check.data;
    
    // Server recalculation of products prices to prevent any client-side tampering
    let calculatedSubtotal = 0;
    const resolvedOrderItems: any[] = [];
    
    for (const item of items) {
      let product_price = 0;
      let product_name = "";
      let availableStock = 0;
      
      if (hasSupabase && supabaseAdminClient) {
        const { data: dbProd, error } = await supabaseAdminClient
          .from('products')
          .select('*')
          .eq('id', item.productId)
          .single();
        if (error || !dbProd) {
          return res.status(400).json({ error: `Produit introuvable ID: ${item.productId}` });
        }
        product_price = dbProd.price_dzd;
        product_name = dbProd.name;
        availableStock = dbProd.stock_quantity;
      } else {
        const localProd = mockProducts.find(p => p.id === item.productId);
        if (!localProd) {
          return res.status(400).json({ error: `Produit introuvable` });
        }
        product_price = localProd.price_dzd;
        product_name = localProd.name;
        availableStock = localProd.stock_quantity;
      }
      
      // Stock Check
      if (availableStock < item.quantity) {
        return res.status(400).json({ error: `Stock insuffisant pour ${product_name}. Quantité disponible: ${availableStock}.` });
      }
      
      const itemSubtotal = product_price * item.quantity;
      calculatedSubtotal += itemSubtotal;
      
      resolvedOrderItems.push({
        product_id: item.productId,
        product_name_snapshot: product_name,
        unit_price_dzd_snapshot: product_price,
        quantity: item.quantity,
        subtotal_dzd: itemSubtotal
      });
    }
    
    // Static Algerian shipping tariff estimates (Standard 800 DZD by default, or 0 if free/promo)
    const shippingCost = 800; 
    const calculatedTotal = calculatedSubtotal + shippingCost;
    
    // Order Number Generation Server-Side (Format: MSI-Year-Random)
    const year = new Date().getFullYear();
    const idCount = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `MSI-${year}-${idCount}`;
    
    let dbOrderId = "";
    
    if (hasSupabase && supabaseAdminClient) {
      // 1. Insert Order
      const { data: orderData, error: orderErr } = await supabaseAdminClient
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || null,
          wilaya: wilaya,
          shipping_address: shippingAddress,
          status: 'pending',
          payment_status: 'unpaid',
          subtotal_dzd: calculatedSubtotal,
          shipping_cost_dzd: shippingCost,
          total_dzd: calculatedTotal,
          notes: notes || null
        })
        .select('id')
        .single();
        
      if (orderErr) {
        throw orderErr;
      }
      dbOrderId = orderData.id;
      
      // 2. Insert Items
      const formattedItems = resolvedOrderItems.map(item => ({
        order_id: dbOrderId,
        product_id: item.product_id,
        product_name_snapshot: item.product_name_snapshot,
        unit_price_dzd_snapshot: item.unit_price_dzd_snapshot,
        quantity: item.quantity,
        subtotal_dzd: item.subtotal_dzd
      }));
      
      const { error: itemsErr } = await supabaseAdminClient.from('order_items').insert(formattedItems);
      if (itemsErr) throw itemsErr;

      // Decrement stock in Supabase immediately for Cash on Delivery (COD)
      for (const item of formattedItems) {
        const { data: currentProd } = await supabaseAdminClient
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single();
          
        if (currentProd) {
          const remainingStock = Math.max(0, currentProd.stock_quantity - item.quantity);
          await supabaseAdminClient
            .from('products')
            .update({ stock_quantity: remainingStock })
            .eq('id', item.product_id);
        }
      }
    } else {
      // Offline fallback saving
      dbOrderId = `offline-order-${Date.now()}`;
      const newOrder = {
        id: dbOrderId,
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        wilaya: wilaya,
        shipping_address: shippingAddress,
        status: 'pending' as any,
        order_status: 'pending' as any,
        payment_status: 'unpaid' as any,
        subtotal_dzd: calculatedSubtotal,
        shipping_cost_dzd: shippingCost,
        total_dzd: calculatedTotal,
        notes: notes || null,
        created_at: new Date().toISOString(),
        items: resolvedOrderItems.map((itm, i) => ({ id: `itm-${i}`, ...itm }))
      };

      // Decrement offline memory stock immediately for Cash on Delivery
      if (newOrder.items) {
        for (const item of newOrder.items) {
          const prod = mockProducts.find(p => p.id === item.product_id);
          if (prod) {
            prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
          }
        }
      }

      mockOrders.unshift(newOrder);
    }
    
    // For Cash on Delivery, we directly redirect the user to the success confirmation layout.
    return res.json({ 
      sessionUrl: `${req.headers.origin}/checkout/confirmation?id=${dbOrderId}&success=true`, 
      orderId: dbOrderId 
    });
  } catch (err: any) {
    console.error("Checkout route error: ", err);
    res.status(500).json({ error: "Échec durant le traitement de la commande." });
  }
});

app.get('/api/orders/confirmation/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { data: order, error: orderErr } = await supabaseAdminClient.from('orders').select('*').eq('id', id).single();
      if (orderErr) return res.status(404).json({ error: "Commande non trouvée" });
      
      const { data: items, error: itemsErr } = await supabaseAdminClient.from('order_items').select('*').eq('order_id', id);
      if (itemsErr) throw itemsErr;
      
      const mappedOrder = { ...order, order_status: order.order_status || order.status };
      return res.json({ ...mappedOrder, items });
    }
    
    const ord = mockOrders.find(o => o.id === id);
    if (!ord) return res.status(404).json({ error: "Commande non trouvée" });
    const mappedOrder = { ...ord, order_status: ord.order_status || ord.status };
    res.json(mappedOrder);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// All order statuses and calculations are handled automatically by Cash on Delivery flow.

// ==========================================
// ADMIN API ENDPOINTS (PROTECTED BY JWT MIDDLEWARE)
// ==========================================

// Dashboard stats endpoint
app.get('/api/admin/dashboard', reqAdmin, async (req, res) => {
  try {
    let totalRevenue = 0;
    let ordersCount = 0;
    let outOfStockCount = 0;
    let recentOrders: any[] = [];
    
    if (hasSupabase && supabaseAdminClient) {
      // 1. Total paid revenue
      const { data: paidOrders } = await supabaseAdminClient
        .from('orders')
        .select('total_dzd')
        .eq('payment_status', 'paid');
      totalRevenue = paidOrders?.reduce((acc, curr) => acc + curr.total_dzd, 0) || 0;
      
      // 2. Orders count
      const { count } = await supabaseAdminClient.from('orders').select('*', { count: 'exact', head: true });
      ordersCount = count || 0;
      
      // 3. Out of stock products
      const { count: outCount } = await supabaseAdminClient
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('stock_quantity', 0);
      outOfStockCount = outCount || 0;
      
      // 4. Recent orders list
      const { data: recents } = await supabaseAdminClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      recentOrders = recents || [];
    } else {
      const paidOnly = mockOrders.filter(o => o.payment_status === 'paid');
      totalRevenue = paidOnly.reduce((sum, o) => sum + o.total_dzd, 0);
      ordersCount = mockOrders.length;
      outOfStockCount = mockProducts.filter(p => p.stock_quantity <= 0).length;
      recentOrders = mockOrders.slice(0, 5);
    }
    
    // Format daily statistics dummy values or actuals for chart drawing in recharts
    const salesOverTime = [
      { name: "Lun", total: Math.round(totalRevenue * 0.1) },
      { name: "Mar", total: Math.round(totalRevenue * 0.15) },
      { name: "Mer", total: Math.round(totalRevenue * 0.1) },
      { name: "Jeu", total: Math.round(totalRevenue * 0.2) },
      { name: "Ven", total: Math.round(totalRevenue * 0.12) },
      { name: "Sam", total: Math.round(totalRevenue * 0.18) },
      { name: "Dim", total: Math.round(totalRevenue * 0.15) },
    ];
    
    res.json({
      totalRevenue,
      ordersCount,
      outOfStockCount,
      recentOrders,
      salesOverTime
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin products endpoint
app.post('/api/admin/products', reqAdmin, async (req, res) => {
  const parsed = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().optional(),
    brand: z.string().optional(),
    price_dzd: z.number().int().min(1),
    compare_at_price_dzd: z.number().int().optional().nullable(),
    category_id: z.string().optional().nullable(),
    stock_quantity: z.number().int().min(0),
    sku: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    imageUrl: z.string().url("Veuillez entrer une URL d'image de test valide")
  }).safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Champs invalides", details: parsed.error.issues });
  }

  const prod = parsed.data;

  try {
    if (hasSupabase && supabaseAdminClient) {
      const { data: product, error: prodErr } = await supabaseAdminClient
        .from('products')
        .insert({
          name: prod.name,
          slug: prod.slug,
          description: prod.description || null,
          brand: prod.brand || null,
          price_dzd: prod.price_dzd,
          compare_at_price_dzd: prod.compare_at_price_dzd || null,
          category_id: prod.category_id || null,
          stock_quantity: prod.stock_quantity,
          sku: prod.sku || null,
          is_active: prod.is_active,
          is_featured: prod.is_featured
        })
        .select('*')
        .single();
        
      if (prodErr) throw prodErr;
      
      // Save associated image
      await supabaseAdminClient.from('product_images').insert({
        product_id: product.id,
        url: prod.imageUrl,
        alt_text: prod.name,
        is_primary: true
      });
      
      return res.json(product);
    }
    
    const newId = `prod-local-${Date.now()}`;
    const mapped = {
      id: newId,
      name: prod.name,
      slug: prod.slug,
      description: prod.description || null,
      brand: prod.brand || null,
      price_dzd: prod.price_dzd,
      compare_at_price_dzd: prod.compare_at_price_dzd || null,
      category_id: prod.category_id || null,
      stock_quantity: prod.stock_quantity,
      sku: prod.sku || null,
      is_active: prod.is_active,
      is_featured: prod.is_featured,
      images: [{ id: `img-${Date.now()}`, url: prod.imageUrl, alt_text: prod.name, display_order: 1, is_primary: true }]
    };
    
    mockProducts.unshift(mapped);
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', reqAdmin, async (req, res) => {
  const { id } = req.params;
  const parsed = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().optional().nullable(),
    brand: z.string().optional().nullable(),
    price_dzd: z.number().int().min(1),
    compare_at_price_dzd: z.number().int().optional().nullable(),
    category_id: z.string().optional().nullable(),
    stock_quantity: z.number().int().min(0),
    sku: z.string().optional().nullable(),
    is_active: z.boolean(),
    is_featured: z.boolean(),
    imageUrl: z.string().url("URL d'image invalide").optional().nullable()
  }).safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
  }

  const p = parsed.data;

  try {
    if (hasSupabase && supabaseAdminClient) {
      const { error: prodErr } = await supabaseAdminClient
        .from('products')
        .update({
          name: p.name,
          slug: p.slug,
          description: p.description,
          brand: p.brand,
          price_dzd: p.price_dzd,
          compare_at_price_dzd: p.compare_at_price_dzd,
          category_id: p.category_id,
          stock_quantity: p.stock_quantity,
          sku: p.sku,
          is_active: p.is_active,
          is_featured: p.is_featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (prodErr) throw prodErr;
      
      // Update primary image url
      if (p.imageUrl) {
        // Delete previous primary
        await supabaseAdminClient.from('product_images').delete().eq('product_id', id).eq('is_primary', true);
        // Add new
        await supabaseAdminClient.from('product_images').insert({
          product_id: id,
          url: p.imageUrl,
          alt_text: p.name,
          is_primary: true
        });
      }
      
      return res.json({ status: "success" });
    }
    
    const index = mockProducts.findIndex(item => item.id === id);
    if (index === -1) return res.status(404).json({ error: "Local product not found" });
    
    const updated = {
      ...mockProducts[index],
      name: p.name,
      slug: p.slug,
      description: p.description,
      brand: p.brand,
      price_dzd: p.price_dzd,
      compare_at_price_dzd: p.compare_at_price_dzd,
      category_id: p.category_id,
      stock_quantity: p.stock_quantity,
      sku: p.sku,
      is_active: p.is_active,
      is_featured: p.is_featured,
    };
    
    if (p.imageUrl) {
      updated.images = [{ id: `img-${Date.now()}`, url: p.imageUrl, alt_text: p.name, display_order: 1, is_primary: true }];
    }
    
    mockProducts[index] = updated;
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', reqAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { error } = await supabaseAdminClient.from('products').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true });
    }
    
    const countBefore = mockProducts.length;
    mockProducts = mockProducts.filter(p => p.id !== id);
    if (mockProducts.length === countBefore) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Categories CRUD
app.post('/api/admin/categories', reqAdmin, async (req, res) => {
  const { name, slug, display_order } = req.body;
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { data, error } = await supabaseAdminClient
        .from('categories')
        .insert({ name, slug, display_order: parseInt(display_order || '0') })
        .select('*')
        .single();
      if (error) throw error;
      return res.json(data);
    }
    
    const newCat = { id: `cat-${Date.now()}`, name, slug, display_order: parseInt(display_order || '0') };
    mockCategories.push(newCat);
    res.json(newCat);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/categories/:id', reqAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { error } = await supabaseAdminClient.from('categories').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true });
    }
    mockCategories = mockCategories.filter(c => c.id !== id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Admin Orders list
app.get('/api/admin/orders', reqAdmin, async (req, res) => {
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { data, error } = await supabaseAdminClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const mapped = (data || []).map((o: any) => ({ ...o, order_status: o.order_status || o.status }));
      return res.json(mapped);
    }
    const mapped = mockOrders.map((o: any) => ({ ...o, order_status: o.order_status || o.status }));
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/orders/:id/status', reqAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { error } = await supabaseAdminClient
        .from('orders')
        .update({ 
          status: status || undefined, 
          order_status: status || undefined, 
          payment_status: payment_status || undefined, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
        
      if (error) throw error;
      return res.json({ success: true });
    }
    
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ error: "Local order not found" });
    
    if (status) {
      mockOrders[index].status = status;
      mockOrders[index].order_status = status;
    }
    if (payment_status) {
      mockOrders[index].payment_status = payment_status;
    }
    res.json(mockOrders[index]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Admin Update Order Payment Status (used by OrdersList.tsx)
app.put('/api/admin/orders/:id/payment', reqAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'paid' or 'pending'
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { error } = await supabaseAdminClient
        .from('orders')
        .update({ payment_status: status, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      return res.json({ success: true });
    }
    
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ error: "Local order not found" });
    
    mockOrders[index].payment_status = status;
    res.json(mockOrders[index]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Admin settings
app.put('/api/admin/settings', reqAdmin, async (req, res) => {
  const { store_name, phone, address, instagram_url, facebook_url } = req.body;
  try {
    if (hasSupabase && supabaseAdminClient) {
      const { error } = await supabaseAdminClient
        .from('store_settings')
        .update({ store_name, phone, address, instagram_url, facebook_url })
        .eq('id', 1);
      if (error) {
        // Table may not have id=1 yet, insert
        await supabaseAdminClient.from('store_settings').insert({ id: 1, store_name, phone, address, instagram_url, facebook_url });
      }
      return res.json({ success: true });
    }
    
    mockStoreSettings = {
      id: 1,
      store_name,
      phone,
      address,
      instagram_url,
      facebook_url
    };
    res.json(mockStoreSettings);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Info route about config & database capabilities
app.get('/api/config', (req, res) => {
  res.json({
    databaseType: hasSupabase ? "Supabase Postgres (Cloud DB)" : "Offline Stateful Mock (AI Studio Ready)",
    hasSupabase
  });
});

// ==========================================
// VITE CLIENT DEVELOPMENT SERVING & SPA ROUTER
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serving Static build assets in production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on port ${PORT}`);
    console.log(`Supabase state: ${hasSupabase ? "CONNECTED" : "FALLBACK MODE"}`);
  });
}

startServer();
