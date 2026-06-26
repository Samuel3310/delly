'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    totalQuantity, 
    subtotal, 
    deliveryFee, 
    grandTotal 
  } = useCart();

  return (
    <div className="bg-[#0b0c10] min-h-screen text-white font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l-7-7m7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Cart</h1>
          </div>
          <span className="text-slate-400 text-sm font-semibold">{totalQuantity} items</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Your basket is empty</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">Looks like you haven't added any fresh goods to your cart yet.</p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/30"
            >
              Return to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl"
                >
                  {/* Item Thumbnail */}
                  <div className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-base text-white truncate leading-tight mb-1">{item.product.name}</h3>
                    <p className="text-xs text-indigo-300 font-semibold mb-2">₦{item.product.price.toLocaleString()} / {item.product.unit}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg flex items-center justify-center font-bold text-sm transition-all cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg flex items-center justify-center font-bold text-sm transition-all cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions / Total */}
                  <div className="flex flex-col items-end gap-3 justify-between self-stretch">
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <span className="font-bold text-white">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Panel */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-fit space-y-6">
              <h3 className="font-bold text-lg border-b border-white/10 pb-3">Summary</h3>
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
                {deliveryFee > 0 && (
                  <p className="text-[10px] text-slate-400">Add ₦{(50000 - subtotal).toLocaleString()} more for free delivery.</p>
                )}
                <div className="border-t border-white/10 pt-4 flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-indigo-300">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] text-sm text-center"
              >
                Proceed to Checkout
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
