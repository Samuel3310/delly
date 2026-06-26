'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const {
    cart,
    phone,
    setPhone,
    address,
    setAddress,
    details,
    setDetails,
    paymentMethod,
    setPaymentMethod,
    subtotal,
    deliveryFee,
    grandTotal,
    setPlacedOrder,
    clearCart
  } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) return;

    const orderNumber = 'DL-' + Math.floor(100000 + Math.random() * 900000);
    setPlacedOrder({
      orderNumber,
      phone,
      address,
      details,
      paymentMethod,
      items: [...cart],
      total: grandTotal
    });

    clearCart();
    router.push('/confirmation');
  };

  // Don't render anything meaningful until client has hydrated
  if (!mounted) {
    return (
      <div className="bg-[#0b0c10] min-h-screen text-white font-sans p-6 md:p-12 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#0b0c10] min-h-screen text-white font-sans p-6 md:p-12 flex items-center justify-center">
        <div className="text-center bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">Checkout Unavailable</h2>
          <p className="text-slate-400 text-sm mb-6">Your cart is currently empty. Please add items to your cart before proceeding.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all shadow-lg"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0c10] min-h-screen text-white font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-6 mb-8">
          <Link 
            href="/cart"
            className="p-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l-7-7m7 7h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleCheckoutSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-5">
              <h3 className="font-bold text-lg border-b border-white/10 pb-3">Delivery Information</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="E.g. +234 812 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Delivery Address *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter your complete street address, city, and state"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Order Details / Delivery Notes</label>
                <textarea
                  rows={2}
                  placeholder="E.g. Drop at security post, landmarks, etc."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-5">
              <h3 className="font-bold text-lg border-b border-white/10 pb-3">Choose Payment Method</h3>
              
              <div className="space-y-3">
                {/* Cash/Transfer on Delivery */}
                <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'delivery'
                    ? 'bg-indigo-500/10 border-indigo-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'delivery'}
                      onChange={() => setPaymentMethod('delivery')}
                      className="text-indigo-600 focus:ring-indigo-500" 
                    />
                    <div>
                      <span className="font-bold text-sm block">Payment on Delivery</span>
                      <span className="text-xs text-slate-400">Pay cash or transfer when your package arrives.</span>
                    </div>
                  </div>
                </label>

                {/* Direct Bank Transfer */}
                <label className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'transfer'
                    ? 'bg-indigo-500/10 border-indigo-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                      className="text-indigo-600 focus:ring-indigo-500" 
                    />
                    <div>
                      <span className="font-bold text-sm block">Direct Bank Transfer</span>
                      <span className="text-xs text-slate-400">Transfer payment directly to our corporate bank account.</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] text-sm cursor-pointer"
            >
              Place Order Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </form>

          {/* Sticky summary details */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-fit space-y-6">
            <h3 className="font-bold text-lg border-b border-white/10 pb-3">Payment Summary</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-white">
                  {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-base font-bold text-white">
                <span>Grand Total</span>
                <span className="text-indigo-300">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
