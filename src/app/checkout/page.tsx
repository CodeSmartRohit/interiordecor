"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [form, setForm] = useState({
    fullName: "",
    email: session?.user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    notes: ""
  });

  const tax = totalPrice * 0.08;
  const shipping = totalPrice > 100 ? 0 : 12.99;
  const grandTotal = totalPrice + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    setLoading(true);

    const fullAddress = `${form.street}, ${form.city}, ${form.state} ${form.zip}`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: fullAddress,
          notes: form.notes
        }),
      });

      if (res.ok) {
        clearCart();
        setOrderPlaced(true);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to place order");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 bg-surface flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-4"
        >
          <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-text-muted mb-8">
            Thank you for your purchase. We have received your order details and will begin processing it shortly. You can track your order in your dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 transition-all"
            >
              View Orders
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-xl border border-accent/30 text-accent font-semibold hover:bg-accent/5 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-surface flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-heading font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-text-muted mb-8">Please add items to your cart before proceeding to checkout.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
          >
            Browse Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-surface pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-heading font-bold mb-10"
        >
          Secure <span className="gold-text">Checkout</span>
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm"
            >
              <h2 className="text-2xl font-heading font-bold mb-8 border-b border-black/5 pb-4">Delivery Details</h2>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-muted">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-muted">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-text-muted">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="pt-4 border-t border-black/5">
                  <h3 className="text-lg font-heading font-semibold mb-4">Shipping Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-text-muted">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={form.street}
                        onChange={(e) => setForm({ ...form, street: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm"
                        placeholder="123 Main St, Apt 4B"
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-text-muted">City *</label>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm"
                          placeholder="City"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-text-muted">State/Province *</label>
                        <input
                          type="text"
                          required
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm"
                          placeholder="State"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium mb-2 text-text-muted">ZIP/Postal Code *</label>
                        <input
                          type="text"
                          required
                          value={form.zip}
                          onChange={(e) => setForm({ ...form, zip: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm"
                          placeholder="ZIP Code"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5">
                  <label className="block text-sm font-medium mb-2 text-text-muted">Order Notes / Delivery Instructions (Optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all resize-none text-sm"
                    placeholder="E.g., Leave package at the back door..."
                  />
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm sticky top-28"
            >
              <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm items-center">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-text-muted truncate">{item.quantity}x {item.title}</span>
                    </div>
                    <span className="font-medium shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <hr className="border-black/5 mb-6" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <hr className="border-black/5" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-accent">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full py-4 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
              >
                {loading ? "Processing..." : `Place Order — $${grandTotal.toFixed(2)}`}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
