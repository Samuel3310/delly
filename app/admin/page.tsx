"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  _id?: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  unit: string;
  hasDiscount?: boolean;
  discountPrice?: number | null | string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState<Product>({
    name: "",
    price: 0,
    image: "",
    inStock: true,
    unit: "",
    hasDiscount: false,
    discountPrice: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === "hasDiscount") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({
        ...prev,
        hasDiscount: checked,
        discountPrice: checked && prev.price > 0 ? Math.floor(prev.price * 0.9) : ""
      }));
      return;
    }

    setForm(prev => {
      const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : (type === "number" ? Number(value) : value);
      
      // Auto-update discount if price changes and discount is enabled
      let newDiscount = prev.discountPrice;
      if (name === "price" && prev.hasDiscount) {
        newDiscount = Math.floor(Number(value) * 0.9);
      }
      
      return {
        ...prev,
        [name]: newValue,
        ...(name === "price" ? { discountPrice: newDiscount } : {})
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setForm(prev => ({ ...prev, image: URL.createObjectURL(e.target.files![0]) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = form.image;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          imageUrl = uploadData.url;
        }
      }

      const productPayload = { 
        ...form, 
        image: imageUrl,
        discountPrice: form.hasDiscount ? Number(form.discountPrice) : null
      };

      if (isEditing && form._id) {
        await fetch(`/api/products/${form._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload)
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload)
        });
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: 0,
      image: "",
      inStock: true,
      unit: "",
      hasDiscount: false,
      discountPrice: ""
    });
    setImageFile(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#141520] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/10 hidden md:block">
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
            DellyAdmin
          </h1>
        </div>
        
        {/* Mobile Header */}
        <div className="p-4 border-b border-white/10 md:hidden flex justify-between items-center bg-[#141520]">
           <h1 className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
            DellyAdmin
          </h1>
          <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-bold transition-all">
            Logout
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`flex-shrink-0 w-full md:w-auto flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-left ${activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Orders
          </button>
          
          <button 
            onClick={() => setActiveTab('products')} 
            className={`flex-shrink-0 w-full md:w-auto flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-left ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Products
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 hidden md:block">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold rounded-xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0f]">
        <header className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">{activeTab === 'orders' ? 'Orders Management' : 'Products Management'}</h2>
            <p className="text-slate-400 mt-1 text-sm md:text-base">
              {activeTab === 'orders' ? 'View and process customer orders.' : 'Add, edit, or remove store products.'}
            </p>
          </div>
          <button 
            onClick={activeTab === 'orders' ? fetchOrders : fetchProducts} 
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 font-bold rounded-xl transition-all flex items-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'orders' ? (
            <div className="space-y-4 max-w-5xl">
              {ordersLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-slate-500 bg-[#141520] border border-white/5 rounded-3xl">
                  <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
                  <p>When customers place orders, they will appear here.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="bg-[#141520] border border-white/5 rounded-2xl p-6 shadow-xl shadow-indigo-900/10 flex flex-col md:flex-row gap-8 justify-between hover:border-indigo-500/20 transition-all">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h3 className="text-xl font-extrabold text-white">{order.orderNumber}</h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          order.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-slate-500 ml-auto">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Customer Details</p>
                          <p className="text-slate-300 text-sm">{order.phone}</p>
                          <p className="text-slate-300 text-sm">{order.address}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Payment Method</p>
                          <p className="text-slate-300 text-sm capitalize">{order.paymentMethod}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Order Items</p>
                        <div className="bg-[#0a0a0f] border border-white/5 rounded-xl overflow-hidden">
                          {order.items.map((item: any, i: number) => (
                            <div key={i} className={`flex justify-between items-center p-3 text-sm ${i !== order.items.length - 1 ? 'border-b border-white/5' : ''}`}>
                              <div className="flex items-center gap-3">
                                <span className="bg-white/10 text-white font-bold w-6 h-6 flex items-center justify-center rounded text-xs">{item.quantity}x</span>
                                <span className="text-slate-300 font-medium">{item.product.name}</span>
                              </div>
                              <span className="font-mono text-slate-400">₦{(item.quantity * item.product.price).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-3 min-w-[140px] md:border-l md:border-white/5 md:pl-8 justify-center">
                      <div className="mb-4 hidden md:block text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="text-2xl font-extrabold text-indigo-400">₦{order.total.toLocaleString()}</p>
                      </div>
                      
                      {order.status !== 'completed' && (
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'completed')}
                          className="flex-1 md:flex-none px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                        >
                          Complete Order
                        </button>
                      )}
                      {order.status !== 'rejected' && (
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'rejected')}
                          className="flex-1 md:flex-none px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold rounded-xl transition-all border border-red-500/20"
                        >
                          Reject
                        </button>
                      )}
                      {order.status !== 'pending' && (
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'pending')}
                          className="flex-1 md:flex-none px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold rounded-xl transition-all border border-white/10"
                        >
                          Mark Pending
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="xl:col-span-1">
                <div className="bg-[#141520] border border-white/5 p-6 rounded-3xl h-fit shadow-2xl shadow-indigo-900/10 sticky top-0">
                  <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                    {isEditing ? (
                      <><svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> Edit Product</>
                    ) : (
                      <><svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> Add New Product</>
                    )}
                  </h2>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                      <input required type="text" name="name" value={form.name} onChange={handleChange} className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Product Name" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₦)</label>
                        <input required type="number" name="price" value={form.price} onChange={handleChange} className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unit</label>
                        <input required type="text" name="unit" value={form.unit} onChange={handleChange} className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="e.g. kg, bag" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Image</label>
                      <div className="relative border-2 border-dashed border-white/10 rounded-xl p-4 hover:border-indigo-500/50 transition-colors bg-[#0a0a0f]">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="flex items-center gap-4 pointer-events-none">
                          {form.image ? (
                            <img src={form.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-white/10 bg-[#141520]" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white">Choose image file</p>
                            <p className="text-xs text-slate-500">JPG, PNG, GIF up to 5MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <label className="flex items-center gap-3 mt-2 cursor-pointer group bg-[#0a0a0f] p-4 rounded-xl border border-white/10">
                      <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} className="w-5 h-5 accent-emerald-500 rounded focus:ring-emerald-500" />
                      <span className="text-sm font-bold group-hover:text-emerald-400 transition-colors">Product is currently in stock</span>
                    </label>

                    <label className="flex items-center gap-3 mt-2 cursor-pointer group bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30">
                      <input type="checkbox" name="hasDiscount" checked={form.hasDiscount} onChange={handleChange} className="w-5 h-5 accent-indigo-500 rounded focus:ring-indigo-500" />
                      <span className="text-sm font-bold group-hover:text-indigo-400 transition-colors text-indigo-300">Enable Discount (Auto 10% off)</span>
                    </label>
                    
                    {form.hasDiscount && (
                      <div className="animate-fade-up">
                        <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Discount Price (₦)</label>
                        <input required type="number" name="discountPrice" value={form.discountPrice === null ? "" : form.discountPrice} onChange={handleChange} className="w-full bg-[#0a0a0f] border border-indigo-500/30 rounded-xl p-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Discounted price" />
                      </div>
                    )}
                    
                    <div className="flex gap-3 mt-4">
                      <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-900/30">
                        {isEditing ? "Update Product" : "Add Product"}
                      </button>
                      {isEditing && (
                        <button type="button" onClick={resetForm} className="px-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Products List Section */}
              <div className="xl:col-span-2">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.length === 0 ? (
                      <div className="col-span-full p-12 text-center text-slate-500 bg-[#141520] border border-white/5 rounded-3xl">
                         <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                        <p>Start adding products using the form to see them here.</p>
                      </div>
                    ) : (
                      products.map((product) => (
                        <div key={product._id} className="bg-[#141520] border border-white/5 rounded-2xl p-4 flex gap-5 hover:border-indigo-500/30 hover:bg-[#1a1b2a] transition-all group shadow-lg shadow-black/20">
                          <div className="w-24 h-24 rounded-xl bg-[#0a0a0f] overflow-hidden flex-shrink-0 border border-white/5">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-white truncate pr-2 text-lg">{product.name}</h3>
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${product.inStock ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`} title={product.inStock ? 'In Stock' : 'Out of Stock'}></div>
                              </div>
                              {product.hasDiscount && product.discountPrice ? (
                                <p className="text-emerald-400 font-extrabold mt-1">
                                  ₦{product.discountPrice.toLocaleString()}{" "}
                                  <span className="text-slate-500 text-xs font-normal line-through ml-1">₦{product.price.toLocaleString()}</span>
                                  <span className="text-slate-500 text-sm font-normal ml-1">/ {product.unit}</span>
                                </p>
                              ) : (
                                <p className="text-indigo-400 font-extrabold mt-1">
                                  ₦{product.price.toLocaleString()}{" "}
                                  <span className="text-slate-500 text-sm font-normal">/ {product.unit}</span>
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => handleEdit(product)} className="flex-1 text-xs font-bold px-3 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors border border-indigo-500/20">
                                Edit
                              </button>
                              <button onClick={() => product._id && handleDelete(product._id)} className="flex-1 text-xs font-bold px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20">
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
