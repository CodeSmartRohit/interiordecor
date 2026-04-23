"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { OrderType } from "@/types";

const statuses = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning border-warning/20",
  PROCESSING: "bg-info/10 text-info border-info/20",
  SHIPPED: "bg-accent/10 text-accent border-accent/20",
  DELIVERED: "bg-success/10 text-success border-success/20",
  CANCELLED: "bg-danger/10 text-danger border-danger/20",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-heading font-bold text-text-light mb-8"
      >
        Order <span className="gold-text">Management</span>
      </motion.h1>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === status
                ? "gold-gradient text-primary shadow-md shadow-accent/20"
                : "bg-white/5 text-text-light/50 hover:text-text-light border border-white/5"
            }`}
          >
            {status}
            {status !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-60">
                ({orders.filter((o) => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-light/30">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-secondary/50 rounded-2xl border border-white/5 overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/3 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-light/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-light">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-text-light/30">
                      {order.user?.name} • {order.user?.email} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-accent">${order.totalAmount.toFixed(2)}</span>
                  <select
                    value={order.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateStatus(order.id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none ${statusColors[order.status] || "bg-white/5 text-text-light/50 border-white/10"}`}
                  >
                    {statuses.filter((s) => s !== "ALL").map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <svg
                    className={`w-5 h-5 text-text-light/30 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Order Details */}
              {expandedOrder === order.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-5 pb-5 border-t border-white/5"
                >
                  <div className="pt-4">
                    {order.address && (
                      <div className="mb-4 p-3 rounded-xl bg-white/3">
                        <span className="text-xs text-accent font-semibold tracking-wider uppercase">Shipping Address</span>
                        <p className="text-sm text-text-light/70 mt-1">{order.address}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                            <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-text-light">{item.product.title}</p>
                            <p className="text-xs text-text-light/30">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm text-accent font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
