"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, FolderPlus, Loader2, Trash2, Edit2, X } from "lucide-react";
import { supabaseData as supabase } from "@/lib/supabaseClient";
import { processAndCompressImage } from "@/lib/imageUtils";

export default function ManageCollectionPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<Record<string, any[]>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dupNotification, setDupNotification] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  // Realtime listeners for instant updates
  useEffect(() => {
    const channel = supabase
      .channel("products-admin-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          loadCategories(false);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          loadCategories(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCategories = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await fetch("/api/indri-set/products", { 
        cache: "no-store",
        next: { revalidate: 0 }
      });
      const json = await res.json();
      if (!json.success) {
        console.error("Failed to load categories:", json.error);
        return;
      }

      const groups = json.data || [];
      console.log("Loaded categories:", groups.map((g: any) => ({ id: g.id, name: g.name, productCount: g.products?.length })));
      setCategories(groups);
      
      // Only set activeCategory if none selected or if it no longer exists
      setActiveCategory((prev: any) => {
        if (!prev) return groups.length > 0 ? groups[0] : null;
        const exists = groups.find((c: any) => c.id === prev.id);
        // If current active still exists, keep it. Otherwise use first.
        return exists ? prev : (groups.length > 0 ? groups[0] : null);
      });

      // Build products map from DB only - database is the single source of truth
      const productsMap: Record<string, any[]> = {};
      for (const cat of groups) {
        productsMap[cat.name] = cat.products || [];
      }
      setAllProducts(productsMap);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const addCategory = async () => {
    const name = prompt("Nama Folder Baru:");
    if (!name) return;

    const trimmed = name.trim();
    if (categories.some((cat) => cat.name.toLowerCase() === trimmed.toLowerCase())) {
      setDupNotification("Kategori / jenis sudah ada");
      setTimeout(() => setDupNotification(null), 3000);
      return;
    }

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: trimmed }),
    });
    const result = await response.json();
    if (!result.success) {
      alert(result.error || "Gagal menambahkan kategori");
      return;
    }
    await loadCategories();
  };

  const renameCategory = async (oldName: string) => {
    const newName = prompt("Edit Nama Folder:", oldName);
    if (!newName || newName === oldName) return;
    const trimmed = newName.trim();
    if (categories.some((cat) => cat.name.toLowerCase() === trimmed.toLowerCase() && cat.name !== oldName)) {
      setDupNotification("Kategori / jenis sudah ada");
      setTimeout(() => setDupNotification(null), 3000);
      return;
    }
    
    try {
      await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const response = await fetch("/api/admin/categories", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ oldName, newName: trimmed }),
            });
            const result = await response.json();
            if (!result.success) {
              reject(new Error(result.error || "Gagal mengedit kategori"));
            } else {
              resolve(result);
            }
          } catch (e) {
            reject(e);
          }
        }, 300);
      });
      await loadCategories();
    } catch (error: any) {
      alert(error.message || "Gagal mengedit kategori");
    }
  };

  const deleteCategory = async (cat: any) => {
    if (!confirm(`Hapus folder "${cat.name}" dan semua isinya?`)) return;
    
    try {
      await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const response = await fetch("/api/admin/categories", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ id: cat.id, name: cat.name }),
            });
            const result = await response.json();
            if (!result.success) {
              reject(new Error(result.error || "Gagal menghapus kategori"));
            } else {
              resolve(result);
            }
          } catch (e) {
            reject(e);
          }
        }, 300);
      });
      await loadCategories();
    } catch (error: any) {
      alert(error.message || "Gagal menghapus kategori");
    }
  };

  const handleUpload = async (file: File) => {
    if (!activeCategory) return;
    
    setIsUploading(true);
    try {
      const processedFile = await processAndCompressImage(file);
      const folder = activeCategory.name.replace(/\s+/g, "_").toLowerCase();
      const newFileName = processedFile.name;

      // Upload new image to storage
      const uploadResult = await supabase.storage.from("products").upload(`${folder}/${newFileName}`, processedFile, {
        contentType: 'image/webp',
        upsert: true
      });

      if (uploadResult.error) throw uploadResult.error;

      const publicUrl = supabase.storage.from("products").getPublicUrl(`${folder}/${newFileName}`).data.publicUrl;

      // Create product record in database
      const createRes = await fetch("/api/indri-set/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFileName,
          categoryId: activeCategory.id,
          image_url: publicUrl
        })
      });
      
      if (!createRes.ok) {
        throw new Error("Failed to create product in database");
      }
      
      // Refresh products list but keep current category selected
      await loadCategories(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal memproses gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (item: any) => {
    if (!confirm("Hapus gambar ini?")) return;
    if (!activeCategory) return;
    
    const folder = activeCategory.name.replace(/\s+/g, "_").toLowerCase();
    
    try {
      // Remove from storage
      await supabase.storage.from("products").remove([`${folder}/${item.name}`]);
      
      // Delete from database - this is the source of truth
      if (item.id) {
        await fetch("/api/indri-set/products", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id })
        });
      }
      
      // Refresh products list but keep current category selected
      await loadCategories(false);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Gagal menghapus gambar.");
    }
  };

  const isEmpty = categories.length === 0;
  const currentProducts = activeCategory ? (allProducts[activeCategory.name] || []) : [];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          {activeCategory?.name || "Pilih Kategori"}
        </h1>
        <button 
          onClick={addCategory} 
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          <FolderPlus size={16} /> Buat Folder
        </button>
      </div>

      {dupNotification && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-medium shadow-sm">
          {dupNotification}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pb-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative inline-flex items-center rounded-2xl pl-5 pr-2 py-2 shadow-sm border border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-0.5"
          >
            <button
              onClick={() => setActiveCategory(cat)}
              className={`text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                activeCategory?.id === cat.id
                  ? "text-blue-700"
                  : "text-slate-700 hover:text-slate-900"
              }`}
              title={cat.name}
            >
              {cat.name}
            </button>
            <div className="hidden group-hover:inline-flex items-center gap-1.5 ml-3 transition-all duration-300">
              <button
                onClick={() => renameCategory(cat.name)}
                className="p-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-white shadow-lg shadow-amber-200 transition-all duration-300 hover:scale-110 hover:rotate-12"
                title="Edit"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => deleteCategory(cat)}
                className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 transition-all duration-300 hover:scale-110 hover:rotate-12"
                title="Hapus"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-5">
            <FolderPlus className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Belum ada kategori</h2>
          <p className="text-slate-500 max-w-md">
            Buat folder kategori terlebih dahulu untuk mulai mengelola koleksi produk.
          </p>
        </div>
      ) : !activeCategory ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <FolderPlus className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Pilih kategori untuk melihat dan mengelola produk.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {currentProducts.map((item) => (
            <div key={item.id || item.name} className="group relative rounded-2xl p-2 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-50">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  onClick={() => handleDeleteImage(item)} 
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-2 px-1">
                <p className="text-xs font-medium text-slate-600 truncate">{item.name}</p>
              </div>
            </div>
          ))}
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="rounded-2xl flex flex-col items-center justify-center aspect-square transition-colors border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50"
          >
            {isUploading ? <Loader2 className="animate-spin text-blue-600" /> : <Plus size={32} className="text-slate-400" />}
          </button>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])} 
        className="hidden" 
      />
    </div>
  );
}