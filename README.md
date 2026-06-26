# 🛒 Delly — Convenient Shopping, Delivered Fast

> **Delly** is a hyperlocal grocery and food delivery platform built for Nigerian markets. Order farm-fresh produce, staples, and foodstuffs from your browser and get them delivered to your door at the speed of now.

---

## 🌐 Live Platform

Visit **[delly.com.ng](https://delly.com.ng)** to start shopping.

---

## ✨ Platform Features

### 🏪 Product Catalog
- Browse a curated selection of **farm-fresh groceries** and Nigerian food staples
- Products include: Rice, Eggs, Yam, Sweet Potatoes, Beans, Garri, Groundnuts, and more
- Every product shows a clear **price tag in Naira (₦)** and an **In Stock** badge
- Responsive grid layout — works beautifully on mobile, tablet, and desktop

### 🔍 Product Detail Modal
- Click on any product image or name to open a **quick-view modal**
- Set your desired **quantity** directly in the modal before adding to cart
- Live **total price preview** updates as you change quantity
- Clicking "Add to Cart" directly on the product card adds **1 item instantly** (no modal needed)

### 🛒 Smart Shopping Cart
- **Floating cart icon** in the top-right corner shows a live item count badge
- **Inline quantity stepper** on each product card — adjust without visiting the cart page
- Dedicated full-page **/cart** route for a detailed breakdown of all items
- Remove individual items or adjust quantities directly from the cart
- **Free delivery** on orders above ₦50,000; otherwise a flat ₦2,500 delivery fee applies
- Live subtotal, delivery fee, and grand total calculations

### ✅ Toast Notifications
- Instant **"Added to Cart ✓"** toast notification appears every time an item is added
- Shows product thumbnail, name, and price
- Auto-dismisses after 3.5 seconds or can be manually closed

### 💳 Checkout & Payment
- Guided **multi-step checkout** form on a dedicated **/checkout** page
- Required fields: **Phone Number**, **Delivery Address**, and optional delivery notes
- Choose between two payment options:
  - **Payment on Delivery** — pay cash or transfer when your package arrives
  - **Direct Bank Transfer** — pay upfront to our corporate bank account before dispatch

### 📦 Order Confirmation
- Dedicated **/confirmation** page with your unique **order reference number**
- Full summary of your address, phone, and total amount
- Bank transfer customers receive our **official account details** (bank name, account name, account number)
- Pay-on-delivery customers receive delivery instructions

### 🎬 Hero Landing Experience
- Full-screen **video background** (`hero.mp4`) on the landing page
- **Typewriter animation** on the headline — characters appear one by one
- Smooth **fade-in** on the subtitle paragraph
- Spring **slide-up animation** on the "Order Now" CTA button

### 🔒 Persistent Cart
- Cart state is saved to **localStorage** — survives page refreshes and navigation
- Cart syncs automatically across all pages via a shared React Context (`CartProvider`)

---

## 🗂️ Project Structure

```
delly/
├── app/
│   ├── layout.tsx              # Root layout, CartProvider wrapper, SEO metadata
│   ├── page.tsx                # Home/Shop page (hero video + product grid)
│   ├── globals.css             # Global Tailwind CSS styles
│   ├── cart/
│   │   └── page.tsx            # Full-page cart view
│   ├── checkout/
│   │   └── page.tsx            # Checkout form with payment options
│   ├── confirmation/
│   │   └── page.tsx            # Order confirmation page
│   └── context/
│       └── CartContext.tsx     # Global cart state + product definitions
├── public/
│   ├── images/                 # Product images (jpg, png, webp)
│   │   ├── rice.png
│   │   ├── egg.png
│   │   ├── yam.png
│   │   ├── sweet-potato.png
│   │   ├── beans.jpg
│   │   ├── garri.jpg
│   │   └── groundnut.webp
│   └── video/
│       └── hero.mp4            # Landing page background video
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State Management | React Context API + localStorage |
| Fonts | Geist Sans / Geist Mono (via `next/font`) |
| Animations | Pure CSS keyframe animations |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/delly.git
cd delly

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 🏦 Payment Details (for Bank Transfer)

| Field | Value |
|---|---|
| Bank Name | Delly Microfinance Bank |
| Account Name | Delly Technologies Inc. |
| Account Number | `0123456789` |

> ⚠️ Always quote your **Order Reference Number** when making a transfer.

---

## 🔑 SEO Keywords

Delly, convenient shopping Nigeria, online grocery delivery, buy food online Nigeria, farm fresh delivery, Nigerian foodstuff store, order groceries online, hyperlocal delivery Nigeria, buy rice online, buy yam online, buy eggs online, fast food delivery, Lagos grocery delivery, Naira grocery shopping, convenient food shopping, delly.com.ng

---

## 📄 License

© 2026 Delly Technologies Inc. All rights reserved.
