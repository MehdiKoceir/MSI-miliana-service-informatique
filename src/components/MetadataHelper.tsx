import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../types/store';

interface MetadataHelperProps {
  title: string;
  description: string;
  product?: Product;
  categoryName?: string;
  urlPath?: string;
}

export default function MetadataHelper({
  title,
  description,
  product,
  categoryName,
  urlPath = ""
}: MetadataHelperProps) {
  const finalTitle = `${title} | MTS Miliana`;
  const appUrl = (import.meta as any).env?.VITE_APP_URL || window.location.origin;
  const currentUrl = `${appUrl}${urlPath}`;

  // Schema.org structured data JSON-LD dynamic injection
  let jsonLd: any = null;
  if (product) {
    const imageUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=600&q=80";
    jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": [imageUrl],
      "description": product.description || "Achetez au meilleur prix chez Miliana Tech Space.",
      "sku": product.sku || `MTS-PROD-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "MTS"
      },
      "offers": {
        "@type": "Offer",
        "url": currentUrl,
        "priceCurrency": "DZD",
        "price": product.price_dzd,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "priceValidUntil": "2027-12-31"
      }
    };
  } else if (categoryName) {
    jsonLd = {
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      "name": `${categoryName} à Miliana - MTS`,
      "description": description,
      "url": currentUrl
    };
  }

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph for social networks */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={product ? "product" : "website"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Miliana Tech Space" />
      {product && (
        <>
          <meta property="og:image" content={product.images?.[0]?.url || "placeholder"} />
          <meta property="product:price:amount" content={String(product.price_dzd)} />
          <meta property="product:price:currency" content="DZD" />
        </>
      )}

      {/* JSON-LD Structured Schema Injection */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
