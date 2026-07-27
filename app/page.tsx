"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useCart, Product } from "./context/CartContext";

// ─── Toast System ────────────────────────────────────────────────────────────
interface Toast {
  id: number;
  product: Product;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 bg-[#141520] border border-indigo-500/30 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl rounded-2xl px-4 py-3 min-w-[280px] max-w-xs animate-toast-in"
        >
          {/* Thumbnail */}
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
            <img
              src={toast.product.image}
              alt={toast.product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex-grow min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 mb-0.5">
              Added to Cart ✓
            </p>
            <p className="text-sm font-semibold text-white truncate">
              {toast.product.name}
            </p>
            <p className="text-xs text-indigo-300 font-bold">
              ₦{toast.product.price.toLocaleString()}
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-500 hover:text-white transition-colors flex-shrink-0 p-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Typewriter Hook ──────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 45, startDelay = 200) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addToCart, addToCartWithQty, totalQuantity } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoadingProducts(false);
      });
  }, []);

  // ── Modal state ──
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalQty(1);
  };
  const closeModal = () => setSelectedProduct(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  // Typewriter for "Fresh Groceries at the"
  const line1 = useTypewriter("Fresh Groceries at the", 50, 400);
  // Coloured line starts after line 1 finishes
  const line2 = useTypewriter(line1.done ? "Speed of Now" : "", 60, 80);
  // Subtitle appears after line 2 finishes
  const [showSub, setShowSub] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (line2.done) {
      setTimeout(() => setShowSub(true), 200);
      setTimeout(() => setShowBtn(true), 550);
    }
  }, [line2.done]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product);
      const id = ++toastCounter.current;
      setToasts((prev) => [...prev, { id, product }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    [addToCart],
  );

  // Add multiple units (from modal) — single atomic state update
  const handleModalAddToCart = useCallback(
    (product: Product, qty: number) => {
      addToCartWithQty(product, qty);
      const id = ++toastCounter.current;
      setToasts((prev) => [...prev, { id, product }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
      closeModal();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addToCartWithQty],
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleScrollToProducts = () => {
    document
      .getElementById("products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Global animation styles */}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(110%) scale(0.92); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
        .animate-toast-in { animation: toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.6s ease both; }

        @keyframes slide-up-btn {
          from { opacity: 0; transform: translateY(36px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .animate-slide-up-btn { animation: slide-up-btn 0.55s cubic-bezier(0.34,1.45,0.64,1) both; }

        .typewriter-cursor::after {
          content: '|';
          animation: blink 0.7s step-end infinite;
          margin-left: 2px;
          color: #818cf8;
        }
        @keyframes blink { 50% { opacity: 0; } }

        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.94) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.34,1.3,0.64,1) both; }
      `}</style>

      <div className="bg-[#0b0c10] min-h-screen text-white font-sans scroll-smooth">
        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-8 bg-[#0b0c10]/70 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/35">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                delly
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-slate-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-rose-500 to-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-black shadow-lg shadow-red-500/40">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center p-6 md:p-8 pt-24">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="/video/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/65 z-10" />

          {/* Hero Text */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center gap-5 my-auto max-w-3xl px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight select-none min-h-[1.2em]">
              {/* Line 1 — typewriter */}
              <span
                className={`block text-white ${!line1.done ? "typewriter-cursor" : ""}`}
              >
                {line1.displayed || "\u00A0"}
              </span>
              {/* Line 2 — coloured, starts after line 1 */}
              <span
                className={`block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${line1.done && !line2.done ? "typewriter-cursor" : ""}`}
              >
                {line2.displayed || "\u00A0"}
              </span>
            </h1>

            {/* Subtitle — fades in */}
            <p
              className={`text-slate-300 text-lg md:text-xl max-w-md leading-relaxed font-medium transition-all duration-500 ${
                showSub
                  ? "animate-fade-up opacity-100"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Order fresh local produce and foodstuffs directly to your door.
            </p>

            {/* CTA Button — slides up */}
            {showBtn && (
              <button
                onClick={handleScrollToProducts}
                className="mt-2 px-10 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/40 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 text-lg select-none animate-slide-up-btn"
              >
                Order Now
              </button>
            )}
          </div>

          {/* Scroll indicator */}
          <button
            onClick={handleScrollToProducts}
            className="relative z-20 mb-2 p-2 hover:text-indigo-400 transition-colors animate-bounce cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </section>

        {/* ── PRODUCTS ──────────────────────────────────────────────────── */}
        <section
          id="products-section"
          className="relative z-20 py-24 px-6 md:px-12 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
                Store Catalog
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">
                Our Farm Fresh Products
              </h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base max-w-md">
              Order local food products sourced directly from farmers. Fresh,
              clean, and delivered in record time.
            </p>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col"
                >
                  {/* Clickable image area → opens modal */}
                  <button
                    onClick={() => openModal(product)}
                    className="relative w-full h-56 overflow-hidden bg-slate-900 text-left block cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* In Stock badge */}
                    {product.inStock ? (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          In Stock
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg backdrop-blur-md">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    
                    {/* Discount badge */}
                    {product.hasDiscount && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                          Promo
                        </span>
                      </div>
                    )}

                    {/* Price tag */}
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-xl shadow-xl">
                      {product.hasDiscount && product.discountPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-black text-emerald-400">
                            ₦{product.discountPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 line-through">
                            ₦{product.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-0.5">
                            / {product.unit}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline">
                          <span className="text-sm font-black text-indigo-300">
                            ₦{product.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">
                            / {product.unit}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Quick-view hint on hover */}
                    <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-xl">
                        View Details
                      </span>
                    </div>
                  </button>

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Clickable title → opens modal */}
                    <button
                      onClick={() => openModal(product)}
                      className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors leading-tight mb-4 flex-grow text-left cursor-pointer hover:underline decoration-indigo-400/50 w-full"
                    >
                      {product.name}
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full bg-white/5 border border-white/10 hover:bg-indigo-600 hover:border-transparent text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-indigo-600/90 active:scale-[0.98] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <footer className="border-t border-white/10 py-12 px-6 bg-black/45">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">delly</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </div>
            <p className="text-xs text-slate-400">
              © 2026 Delly Technologies Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Portal */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ── Product Detail Modal ───────────────────────────────────────── */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal panel */}
          <div
            className="relative z-10 bg-[#13141f] border border-white/10 rounded-3xl shadow-2xl shadow-black/70 w-full max-w-md animate-modal-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Product image */}
            <div className="relative w-full h-56 bg-slate-900">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-black/80 transition-all cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {/* In-stock badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  In Stock
                </span>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-white leading-tight flex items-center gap-2">
                  {selectedProduct.name}
                  {selectedProduct.hasDiscount && (
                     <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500 text-white tracking-widest shrink-0">Promo</span>
                  )}
                </h2>
                {selectedProduct.hasDiscount && selectedProduct.discountPrice ? (
                  <p className="mt-1">
                    <span className="text-emerald-400 font-extrabold text-lg">₦{selectedProduct.discountPrice.toLocaleString()}</span>
                    <span className="text-slate-500 font-bold text-xs line-through ml-2">₦{selectedProduct.price.toLocaleString()}</span>
                    <span className="text-slate-400 font-normal text-xs ml-1">
                      / {selectedProduct.unit}
                    </span>
                  </p>
                ) : (
                  <p className="text-indigo-300 font-bold mt-1">
                    ₦{selectedProduct.price.toLocaleString()}
                    <span className="text-slate-400 font-normal text-xs ml-1">
                      / {selectedProduct.unit}
                    </span>
                  </p>
                )}
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg font-black text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-pointer select-none"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-black text-white tabular-nums">
                    {modalQty}
                  </span>
                  <button
                    onClick={() => setModalQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-lg font-black text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-pointer select-none"
                  >
                    +
                  </button>
                </div>
                <span className="ml-auto text-sm font-bold text-white">
                  Total:{" "}
                  <span className="text-indigo-300">
                    ₦{((selectedProduct.hasDiscount && selectedProduct.discountPrice ? selectedProduct.discountPrice : selectedProduct.price) * modalQty).toLocaleString()}
                  </span>
                </span>
              </div>

              {/* Modal Add to Cart */}
              <button
                onClick={() => handleModalAddToCart(selectedProduct, modalQty)}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Add {modalQty > 1 ? `${modalQty} items` : "to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
