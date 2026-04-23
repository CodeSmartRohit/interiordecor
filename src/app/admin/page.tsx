"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingDesigns: number;
  recentOrders: {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
  }[];
  recentDesigns: {
    id: string;
    roomType: string;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
  }[];
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, designsRes] = await Promise.all([
          fetch("/api/products?limit=100"),
          fetch("/api/orders"),
          fetch("/api/design-requests"),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const designsData = await designsRes.json();

        const orders = Array.isArray(ordersData) ? ordersData : [];
        const designs = Array.isArray(designsData) ? designsData : [];

        setStats({
          totalProducts: productsData.total || 0,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum: number, o: { totalAmount: number }) => sum + o.totalAmount, 0),
          pendingDesigns: designs.filter((d: { status: string }) => d.status === "PENDING").length,
          recentOrders: orders.slice(0, 5),
          recentDesigns: designs.slice(0, 5),
        });
      } catch {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "from-emerald-500 to-emerald-600",
      href: "/admin/orders",
    },
    {
      label: "Revenue",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-amber-500 to-amber-600",
      href: "/admin/orders",
    },
    {
      label: "Pending Designs",
      value: stats?.pendingDesigns || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      href: "/admin/design-requests",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-warning/10 text-warning",
    PROCESSING: "bg-info/10 text-info",
    SHIPPED: "bg-accent/10 text-accent",
    DELIVERED: "bg-success/10 text-success",
    CANCELLED: "bg-danger/10 text-danger",
    REVIEWED: "bg-info/10 text-info",
    IN_PROGRESS: "bg-accent/10 text-accent",
    COMPLETED: "bg-success/10 text-success",
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-48" />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white/5 rounded-2xl" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-heading font-bold text-text-light mb-8"
      >
        Dashboard <span className="gold-text">Overview</span>
      </motion.h1>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={card.href} className="block group">
              <div className="bg-secondary/80 rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}>
                    {card.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-text-light mb-1">
                  {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                </div>
                <div className="text-sm text-text-light/40">{card.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary/80 rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold text-text-light">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-accent hover:text-accent-light transition-colors">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentOrders?.length === 0 ? (
              <p className="text-text-light/30 text-sm text-center py-4">No orders yet</p>
            ) : (
              stats?.recentOrders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-text-light">{order.user?.name}</p>
                    <p className="text-xs text-text-light/30">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent">${order.totalAmount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Design Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-secondary/80 rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold text-text-light">Recent Design Requests</h2>
            <Link href="/admin/design-requests" className="text-sm text-accent hover:text-accent-light transition-colors">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentDesigns?.length === 0 ? (
              <p className="text-text-light/30 text-sm text-center py-4">No requests yet</p>
            ) : (
              stats?.recentDesigns?.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-text-light">{req.user?.name}</p>
                    <p className="text-xs text-text-light/30">{req.roomType} • {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[req.status] || ""}`}>
                    {req.status.replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
