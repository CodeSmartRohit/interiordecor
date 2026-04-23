"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { ProductType } from "@/types";

const categories = ["All", "Furniture", "Lighting", "Decor", "Wall Art", "Textiles"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

import { Suspense } from "react";

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [category, sort, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen pt-24 bg-surface">
      {/* Header */}
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">Our Collection</span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-light mt-3 mb-4">
              Shop <span className="gold-text">Home Decor</span>
            </h1>
            <p className="text-text-light/50 max-w-xl">
              Discover handpicked pieces that transform your space into something extraordinary.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-black/5 shadow-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  category === cat
                    ? "gold-gradient text-primary shadow-lg shadow-accent/20"
                    : "bg-white text-text-muted hover:text-accent border border-black/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white border border-black/5 text-sm text-text focus:outline-none focus:border-accent/50 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">No products found</h3>
            <p className="text-text-muted">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={category + sort + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group rounded-2xl bg-white overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:shadow-accent/10 transition-all duration-500"
                >
                  <Link href={`/shop/${product.id}`}>
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.stock <= 5 && product.stock > 0 && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-warning/90 text-white text-xs font-semibold">
                          Only {product.stock} left
                        </span>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="px-4 py-2 rounded-full bg-white/90 text-text font-semibold text-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <span className="text-xs text-accent font-medium tracking-wider uppercase">
                      {product.category}
                    </span>
                    <Link href={`/shop/${product.id}`}>
                      <h3 className="font-heading font-semibold mt-1 mb-2 group-hover:text-accent transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-text-muted text-sm line-clamp-2 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                      <button
                        onClick={() =>
                          product.stock > 0 &&
                          addItem({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            imageUrl: product.imageUrl,
                            quantity: 1,
                            stock: product.stock,
                          })
                        }
                        disabled={product.stock === 0}
                        className="p-2.5 rounded-xl gold-gradient text-primary hover:opacity-90 disabled:opacity-30 transition-all duration-300 shadow-md shadow-accent/20"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
