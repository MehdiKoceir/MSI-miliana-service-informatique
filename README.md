MSI — Miliana Service Informatique 🛒

E-commerce platform for a computer, phone & gaming accessories store based in Algeria. Built as a full-stack portfolio project demonstrating production-grade architecture patterns: secure payment flow, role-based admin access, and database integrity under concurrent load.


⚠️ Portfolio / demo project. Payments run on Stripe test mode. A real Algerian deployment would integrate the SATIM (CIB/Edahabia) payment gateway instead, which requires a registered merchant account.




✨ Features

Storefront


Product catalog with category/brand/price filtering and search
Product detail pages with image gallery and live stock status
Persistent cart (Zustand)
Checkout with delivery info (Wilaya-based) and Stripe payment
Order confirmation with order number


Admin Dashboard


Secure login (Supabase Auth)
Product & category CRUD with image upload
Order management with status tracking
Sales dashboard with charts (Recharts)
Store settings (contact info, social links)



🧱 Tech Stack

LayerTechnologyFrontendReact 19, TypeScript, Vite, Tailwind CSSBackendNode.js, ExpressDatabaseSupabase (PostgreSQL)AuthSupabase AuthStorageSupabase StoragePaymentsStripe (Checkout + Webhooks)StateZustandForms & ValidationReact Hook Form + ZodChartsRecharts


🏗️ Architecture Highlights

This project intentionally implements patterns that matter in real production e-commerce systems, not just a CRUD demo:


Server-side price authority — cart totals are never trusted from the client. Every checkout recalculates prices and validates stock directly against the database before creating an order.
Row Level Security (RLS) — every table enforces access control at the database level, not just in application code. Public reads are open; all writes require a verified admin session.
Service-role isolation — admin write operations go through a dedicated Express layer using the Supabase service role key, which never touches the client.
Idempotent payment webhook — Stripe webhook handler checks order payment status before processing, preventing duplicate stock decrements on retried webhook deliveries.
Atomic stock decrement — UPDATE ... WHERE stock_quantity >= $1 guards against overselling under concurrent checkouts.
SEO mitigation for SPA — since this build runs as a client-rendered SPA (sandbox constraint), product pages use react-helmet-async for dynamic meta tags plus JSON-LD structured data, with server-side bot detection to serve pre-rendered OG tags to social crawlers (WhatsApp, Facebook, Twitter).



📂 Project Structure

├── server.ts                  # Express API (checkout, Stripe webhook, admin auth middleware)
├── src/
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   └── store.ts           # Cart state (Zustand)
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── ui/                # ProductCard, ImageGallery, StatCard
│   │   └── admin/             # AdminLayout
│   └── pages/
│       ├── public/            # Home, Catalog, ProductDetails, Cart, Checkout...
│       └── admin/             # Dashboard, ProductsList, OrdersList...


🚀 Getting Started

Prerequisites


Node.js 18+
A free Supabase project
A Stripe account (test mode keys)


Run the SQL schema (in /supabase/schema.sql) in your Supabase SQL Editor, then:

bashnpm run dev
