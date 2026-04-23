"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          address,
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
          <h1 className="text-3xl font-heading font-bold mb-4">Order Placed!</h1>
          <p className="text-text-muted mb-8">
            Thank you for your purchase. You can track your order in your dashboard.
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
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-text-muted mb-8">Discover beautiful pieces for your home</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
          >
            Browse Shop
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  const tax = totalPrice * 0.08;
  const shipping = totalPrice > 100 ? 0 : 12.99;
  const grandTotal = totalPrice + tax + shipping;

  return (
    <div className="min-h-screen pt-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-heading font-bold mb-10"
        >
          Shopping <span className="gold-text">Cart</span>
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm flex gap-5"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold truncate">{item.title}</h3>
                    <p className="text-accent font-bold mt-1">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center rounded-lg border border-black/10 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-text-muted hover:text-accent text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 py-1.5 text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-text-muted hover:text-accent text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-danger/60 hover:text-danger text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
                {shipping > 0 && (
                  <p className="text-xs text-text-muted">Free shipping on orders over $100</p>
                )}
                <hr className="border-black/5" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-accent">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => {
                    if (!session) {
                      router.push("/login");
                      return;
                    }
                    setShowCheckout(true);
                  }}
                  className="w-full py-4 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  onSubmit={handleCheckout}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">Shipping Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all resize-none text-sm"
                      placeholder="Enter your full shipping address..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
                  >
                    {loading ? "Placing Order..." : `Place Order — $${grandTotal.toFixed(2)}`}
                  </button>
                </motion.form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
