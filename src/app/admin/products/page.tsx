"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, FolderPlus, Loader2, Trash2, Edit2, X } from "lucide-react";

export default function ManageCollectionPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<Record<string, any[]>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/indri-set/products", { cache: "no-store" });
      const json = await res.json();
      if (!json.success) {
        console.error("Failed to load categories:", json.error);
        return;
      }

      const groups = json.data || [];
      setCategories(groups);
      if (groups.length > 0) {
        setActiveCategory(groups[0]);
        const productsMap: Record<string, any[]> = {};
        for (const cat of groups) {
          productsMap[cat.name] = cat.products || [];
        }
        setAllProducts(productsMap);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCategory = async (catName: string) => {
    const res = await fetch("/api/indri-set/products", { cache: "no-store" });
    const json = await res.json();
    if (json.success) {
      const groups = json.data || [];
      setCategories(groups);
      const productsMap: Record<string, any[]> = {};
      for (const g of groups) {
        productsMap[g.name] = g.products || [];
      }
      setAllProducts(productsMap);
    }
  };

  const addCategory = async () => {
    const name = prompt("Nama Folder Baru:");
    if (!name) return;
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if ((await response.json()).success) fetchInitialData();
  };

  const renameCategory = async (oldName: string) => {
    const newName = prompt("Edit Nama Folder:", oldName);
    if (!newName || newName === oldName) return;
    const response = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldName, newName }),
    });
    if (response.ok) fetchInitialData();
  };

  const deleteCategory = async (cat: any) => {
    if (!confirm(`Hapus folder "${cat.name}" dan semua isinya?`)) return;
    const response = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat.id, name: cat.name }),
    });
    if (response.ok) fetchInitialData();
  };

  const handleAction = async (file: File) => {
    if (!activeCategory) return;
    const productName = prompt("Nama Produk:", "");
    if (!productName || !productName.trim()) return;
    setIsUploading(true);
    try {
      // Upload file to the storage bucket "products" AND save product to the database
      // in a single request — the file is saved to public/images/products/{categoryName}/{productName}.{ext}
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", productName.trim());
      formData.append("categoryId", activeCategory.id);
      formData.append("description", "");

      const createRes = await fetch("/api/indri-set/products", {
        method: "POST",
        body: formData,
      });

      const result = await createRes.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to create product");
      }

      refreshCategory(activeCategory.name);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal memproses gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (item: any) => {
    if (!confirm("Hapus gambar ini?")) return;
    try {
      await fetch("/api/indri-set/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id })
      });
      refreshCategory(activeCategory.name);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Gagal menghapus gambar.");
    }
  };

  const handleSaveProductName = async (item: any) => {
    if (!editingName.trim()) return;
    try {
      const res = await fetch("/api/indri-set/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, name: editingName }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal mengubah nama");
      refreshCategory(activeCategory.name);
    } catch (error: any) {
      alert(error.message || "Gagal mengubah nama");
    } finally {
      setEditingProductId(null);
      setEditingName("");
    }
  };

  const currentProducts = activeCategory ? allProducts[activeCategory.name] || [] : [];

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">{activeCategory?.name || "Koleksi"}</h1>
        <button onClick={addCategory} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700">
          <FolderPlus size={16} /> Buat Folder
        </button>
      </div>

      <div className="flex flex-wrap gap-3 pb-4">
        {categories.map((cat) => (
          <div key={cat.id} className="relative pt-2 pr-2">
            <button onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeCategory?.id === cat.id ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
              {cat.name}
            </button>
            <button onClick={() => renameCategory(cat.name)} className="absolute top-0 right-6 bg-yellow-500 text-white rounded-full p-0.5"><Edit2 size={10} /></button>
            <button onClick={() => deleteCategory(cat)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {currentProducts.map((item) => (
          <div key={item.id || item.name} className="group relative border rounded-2xl p-2 bg-white shadow-sm">
            <img src={item.image_url} className="w-full aspect-square object-cover rounded-xl" />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => { setEditingProductId(item.id); setEditingName(item.name); }}
                className="p-2 bg-amber-400 hover:bg-amber-500 text-white rounded-full shadow"
                title="Edit Nama"
              >
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDeleteImage(item)}
                className="p-2 bg-red-500 text-white rounded-full shadow"><Trash2 size={16} /></button>
            </div>
            <div className="mt-2 px-1">
              {editingProductId === item.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveProductName(item);
                    if (e.key === "Escape") { setEditingProductId(null); setEditingName(""); }
                  }}
                  onBlur={() => { setEditingProductId(null); setEditingName(""); }}
                  className="text-xs w-full px-1 py-0.5 border border-blue-400 rounded focus:outline-none"
                  autoFocus
                />
              ) : (
                <p className="text-xs font-medium text-slate-600 truncate">{item.name}</p>
              )}
            </div>
          </div>
        ))}
        <button onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-2xl flex items-center justify-center aspect-square">
          {isUploading ? <Loader2 className="animate-spin" /> : <Plus size={32} className="text-gray-400" />}
        </button>
      </div>

      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleAction(e.target.files[0])} className="hidden" />
    </div>
  );
}
