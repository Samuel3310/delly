'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function ConfirmationPage() {
  const { placedOrder } = useCart();

  // Handle reload/fallback cases
  if (!placedOrder) {
    return (
      <div className="bg-[#0b0c10] min-h-screen text-white font-sans p-6 md:p-12 flex items-center justify-center">
        <div className="text-center bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">No Active Order</h2>
          <p className="text-slate-400 text-sm mb-6">We couldn't find any recent order details. You can start shopping to place an order.</p>
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
    <div className="bg-[#0b0c10] min-h-screen text-white font-sans p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in-up">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Success</span>
            <h1 className="text-3xl font-extrabold mt-1">Order Placed!</h1>
            <p className="text-slate-400 text-sm mt-1">Thank you for your order. We are preparing it now.</p>
          </div>
        </div>

        {/* Details Summary */}
        <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Order Reference:</span>
            <span className="font-bold text-white tracking-wider">{placedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Address:</span>
            <span className="font-bold text-white text-right max-w-[200px] truncate" title={placedOrder.address}>
              {placedOrder.address}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Phone Number:</span>
            <span className="font-bold text-white">{placedOrder.phone}</span>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-3 text-base font-bold text-white">
            <span>Amount Paid/Due:</span>
            <span className="text-indigo-300">₦{placedOrder.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Instructions if Direct Transfer */}
        {placedOrder.paymentMethod === 'transfer' ? (
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm text-indigo-300 uppercase tracking-wider">Direct Bank Transfer details</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Please transfer the exact total amount to the bank account below. Your order will be shipped as soon as payment is confirmed.
            </p>
            <div className="space-y-2 border-t border-indigo-500/10 pt-3 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>Bank Name:</span>
                <span className="font-bold text-white">Delly Microfinance Bank</span>
              </div>
              <div className="flex justify-between">
                <span>Account Name:</span>
                <span className="font-bold text-white">Delly Technologies Inc.</span>
              </div>
              <div className="flex justify-between">
                <span>Account Number:</span>
                <span className="font-bold text-white select-all text-base tracking-wider font-mono">0123456789</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
            <h4 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">Payment on Delivery</h4>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              You selected payment on delivery. Please make sure you have cash or are ready to make a card transfer when our courier partner arrives at your address.
            </p>
          </div>
        )}

        <Link 
          href="/"
          className="block w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl transition-all text-sm text-center cursor-pointer"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
