"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { ProductType } from "@/types";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => setProduct(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-3xl" />
            <div className="space-y-6 py-8">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-10 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-accent hover:text-accent-dark">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-text">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-black/5 shadow-xl">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.featured && (
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full gold-gradient text-primary text-sm font-semibold">
                ★ Featured
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="py-4"
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              {product.category}
            </span>
            <h1 className="text-4xl font-heading font-bold mt-3 mb-4">{product.title}</h1>
            <div className="text-3xl font-bold text-accent mb-6">${product.price.toFixed(2)}</div>

            <p className="text-text-muted leading-relaxed mb-8">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-success" : "bg-danger"}`} />
              <span className="text-sm font-medium">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center rounded-xl border border-black/10 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-text-muted hover:text-accent transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 font-semibold text-center min-w-[60px]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 text-text-muted hover:text-accent transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 rounded-xl gold-gradient text-primary font-semibold text-base hover:opacity-90 transition-all duration-300 shadow-lg shadow-accent/20 flex items-center justify-center gap-3"
                >
                  {added ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Features */}
            <div className="border-t border-black/5 pt-8 space-y-4">
              {[
                { icon: "🚚", text: "Free shipping on orders over $100" },
                { icon: "↩️", text: "30-day hassle-free returns" },
                { icon: "🛡️", text: "1-year quality warranty" },
              ].map((feature) => (
                <div key={feature.text} className="flex items-center gap-3 text-sm text-text-muted">
                  <span className="text-lg">{feature.icon}</span>
                  {feature.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
