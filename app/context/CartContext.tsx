'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  addToCartWithQty: (product: Product, qty: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalQuantity: number;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;

  // Checkout States
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  details: string;
  setDetails: (val: string) => void;
  paymentMethod: 'delivery' | 'transfer';
  setPaymentMethod: (val: 'delivery' | 'transfer') => void;
  placedOrder: any;
  setPlacedOrder: (val: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const PRODUCTS: Product[] = [
  {
    id: 'rice',
    name: 'Long Grain Parboiled Rice',
    price: 35000,
    image: '/images/rice.png',
    inStock: true,
    unit: 'bag (50kg)'
  },
  {
    id: 'egg',
    name: 'Farm Fresh Eggs',
    price: 4500,
    image: '/images/egg.png',
    inStock: true,
    unit: 'crate (30 eggs)'
  },
  {
    id: 'yam',
    name: 'New Season Yam',
    price: 3500,
    image: '/images/yam.png',
    inStock: true,
    unit: 'tuber'
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potatoes',
    price: 2000,
    image: '/images/sweet-potato.png',
    inStock: true,
    unit: 'kg'
  },
  {
    id: 'beans',
    name: 'Premium Brown Beans',
    price: 2500,
    image: '/images/beans.jpg',
    inStock: true,
    unit: 'kg'
  },
  {
    id: 'garri',
    name: 'White Ijebu Garri',
    price: 1800,
    image: '/images/garri.jpg',
    inStock: true,
    unit: 'kg'
  },
  {
    id: 'groundnut',
    name: 'Roasted Groundnuts',
    price: 1500,
    image: '/images/groundnut.webp',
    inStock: true,
    unit: 'jar'
  }
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'delivery' | 'transfer'>('delivery');
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('delly_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('delly_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    let newCart: CartItem[];
    if (existing) {
      newCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }
    saveCart(newCart);
  };

  // Single atomic update for adding multiple units (avoids stale-closure loop bug)
  const addToCartWithQty = (product: Product, qty: number) => {
    const existing = cart.find(item => item.product.id === product.id);
    let newCart: CartItem[];
    if (existing) {
      newCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity: qty }];
    }
    saveCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    let newCart: CartItem[];
    if (quantity <= 0) {
      newCart = cart.filter(item => item.product.id !== productId);
    } else {
      newCart = cart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      );
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Free delivery for orders above ₦50,000, otherwise ₦2,500 delivery fee
  const deliveryFee = subtotal > 50000 || subtotal === 0 ? 0 : 2500;
  const grandTotal = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      addToCartWithQty,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalQuantity,
      subtotal,
      deliveryFee,
      grandTotal,
      phone,
      setPhone,
      address,
      setAddress,
      details,
      setDetails,
      paymentMethod,
      setPaymentMethod,
      placedOrder,
      setPlacedOrder
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
