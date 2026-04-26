"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductType } from "@/types";

type CategoryType = { id: string; name: string };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "Decor",
    stock: "0",
    featured: false,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data || []);
      if (data && data.length > 0 && !form.category) {
        setForm((prev) => ({ ...prev, category: data[0].name }));
      }
    } catch {
      console.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", price: "", imageUrl: "", category: "Decor", stock: "0", featured: false });
    setEditingProduct(null);
    setShowForm(false);
  };

  const openEdit = (product: ProductType) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        resetForm();
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save product");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSavingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        setNewCategoryName("");
        fetchCategories();
        alert("Category added successfully!");
      } else {
        alert("Failed to add category");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
        alert("Category deleted successfully!");
      } else {
        alert("Failed to delete category");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-heading font-bold text-text-light"
        >
          Product <span className="gold-text">Management</span>
        </motion.h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-6 py-3 rounded-xl border border-accent/30 text-accent font-semibold hover:bg-accent/10 transition-all shadow-lg shadow-accent/5 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Manage Categories
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-6 py-3 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-light placeholder-text-light/30 focus:outline-none focus:border-accent/50 transition-all"
        />
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-primary rounded-3xl border border-white/10 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-heading font-bold text-text-light mb-6">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-light/70 text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-light placeholder-text-light/30 focus:outline-none focus:border-accent/50 transition-all"
                      placeholder="Product title"
                    />
                  </div>
                  <div>
                    <label className="block text-text-light/70 text-sm font-medium mb-2">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-light focus:outline-none focus:border-accent/50 transition-all"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name} className="bg-primary">{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-text-light/70 text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-light placeholder-text-light/30 focus:outline-none focus:border-accent/50 transition-all resize-none"
                    placeholder="Product description"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-text-light/70 text-sm font-medium mb-2">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-light placeholder-text-light/30 focus:outline-none focus:border-accent/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-text-light/70 text-sm font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-light placeholder-text-light/30 focus:outline-none focus:border-accent/50 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="w-5 h-5 rounded accent-accent"
                      />
                      <span className="text-text-light/70 text-sm font-medium">Featured</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-text-light/70 text-sm font-medium mb-2">Image URL *</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-light placeholder-text-light/30 focus:outline-none focus:border-accent/50 transition-all"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {form.imageUrl && (
                    <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {saving ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl border border-white/10 text-text-light/50 hover:text-text-light transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowCategoryModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-primary rounded-3xl border border-white/10 p-8 w-full max-w-md max-h-[90vh] flex flex-col"
            >
              <h2 className="text-xl font-heading font-bold text-text-light mb-6">Manage Categories</h2>

              <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New Category Name"
                  required
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-light placeholder-text-light/30 focus:outline-none focus:border-accent/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-4 py-2 rounded-xl gold-gradient text-primary font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  Add
                </button>
              </form>

              <div className="flex-1 overflow-y-auto space-y-2">
                {categories.length === 0 ? (
                  <p className="text-text-light/30 text-center py-4">No categories added yet.</p>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-text-light font-medium">{category.name}</span>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 rounded-lg text-text-light/40 hover:text-danger hover:bg-danger/10 transition-all"
                        title="Delete Category"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-white/10">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="w-full py-3 rounded-xl border border-white/10 text-text-light hover:bg-white/5 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-light/30">No products found</p>
        </div>
      ) : (
        <div className="bg-secondary/50 rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-4 px-5 text-xs font-semibold text-text-light/40 uppercase tracking-wider">Product</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-text-light/40 uppercase tracking-wider">Category</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-text-light/40 uppercase tracking-wider">Price</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-text-light/40 uppercase tracking-wider">Stock</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-text-light/40 uppercase tracking-wider">Featured</th>
                  <th className="text-right py-4 px-5 text-xs font-semibold text-text-light/40 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-light line-clamp-1">{product.title}</p>
                          <p className="text-xs text-text-light/30 line-clamp-1">{product.description.slice(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-text-light/60">{product.category}</span>
                    </td>
                    <td className="py-3 px-5 text-sm text-accent font-semibold">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-5">
                      <span className={`text-sm font-medium ${product.stock > 10 ? "text-success" : product.stock > 0 ? "text-warning" : "text-danger"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      {product.featured && (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">★ Yes</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg text-text-light/40 hover:text-accent hover:bg-accent/10 transition-all"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg text-text-light/40 hover:text-danger hover:bg-danger/10 transition-all"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
