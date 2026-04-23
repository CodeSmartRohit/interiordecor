"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { OrderType, DesignRequestType } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning border-warning/20",
  PROCESSING: "bg-info/10 text-info border-info/20",
  SHIPPED: "bg-accent/10 text-accent border-accent/20",
  DELIVERED: "bg-success/10 text-success border-success/20",
  CANCELLED: "bg-danger/10 text-danger border-danger/20",
  REVIEWED: "bg-info/10 text-info border-info/20",
  IN_PROGRESS: "bg-accent/10 text-accent border-accent/20",
  COMPLETED: "bg-success/10 text-success border-success/20",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"orders" | "designs">("orders");
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [designRequests, setDesignRequests] = useState<DesignRequestType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, designsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/design-requests"),
        ]);
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (designsRes.ok) setDesignRequests(await designsRes.json());
      } catch {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-24 bg-surface">
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-light mb-2">
              Welcome back, <span className="gold-text">{session?.user?.name || "User"}</span>
            </h1>
            <p className="text-text-light/50">{session?.user?.email}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-black/5 shadow-sm mb-8 max-w-md">
          {[
            { key: "orders" as const, label: "My Orders", count: orders.length },
            { key: "designs" as const, label: "Design Requests", count: designRequests.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? "gold-gradient text-primary shadow-md shadow-accent/20"
                  : "text-text-muted hover:text-accent"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-black/5">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "orders" ? (
          orders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">No orders yet</h3>
              <p className="text-text-muted mb-6">Start shopping to see your orders here</p>
              <Link href="/shop" className="px-6 py-3 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 transition-all">
                Browse Shop
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-accent">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-surface">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{item.product.title}</p>
                          <p className="text-xs text-text-muted">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : designRequests.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">No design requests</h3>
            <p className="text-text-muted mb-6">Request a custom room design from our experts</p>
            <Link href="/design-request" className="px-6 py-3 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 transition-all">
              Start Design Request
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {designRequests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-heading font-semibold">{req.roomType} Design</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[req.status] || ""}`}>
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm mt-1">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="text-sm text-text-muted">{req.roomDimensions}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface">
                    <span className="text-xs text-accent font-semibold tracking-wider uppercase">Address</span>
                    <p className="text-sm mt-1 line-clamp-2">{req.address}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface">
                    <span className="text-xs text-accent font-semibold tracking-wider uppercase">Description</span>
                    <p className="text-sm mt-1 line-clamp-2">{req.description}</p>
                  </div>
                </div>

                {req.adminNotes && (
                  <div className="mt-3 p-3 rounded-xl bg-accent/5 border border-accent/10">
                    <span className="text-xs text-accent font-semibold tracking-wider uppercase">Designer Notes</span>
                    <p className="text-sm mt-1">{req.adminNotes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
