"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, FolderPlus, Loader2, Trash2, Edit2, X } from "lucide-react";
import { supabaseAuth, supabaseData } from "@/lib/supabaseClient";
import { processAndCompressImage } from "@/lib/imageUtils";

export default function ManageCollectionPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<Record<string, any[]>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Helper untuk mendapatkan token
  const getAuthHeader = async () => {
    const { data: { session } } = await supabaseAuth.auth.getSession();
    return {
      "Authorization": `Bearer ${session?.access_token}`,
      "Content-Type": "application/json"
    };
  };

  const fetchInitialData = async () => {
    try {
      const { data: dbCategories, error: catError } = await supabaseData
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (catError) throw catError;

      if (dbCategories?.length > 0) {
        setCategories(dbCategories);
        const currentActive = activeCategory 
          ? dbCategories.find(c => c.id === activeCategory.id) || dbCategories[0]
          : dbCategories[0];
        setActiveCategory(currentActive);
        
        const productsMap: Record<string, any[]> = {};
        for (const cat of dbCategories) {
          productsMap[cat.name] = await fetchProductsForCategory(cat.id, cat.name);
        }
        setAllProducts(productsMap);
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  };

  const fetchProductsForCategory = async (categoryId: string, categoryName: string) => {
    try {
      const response = await fetch(`/api/admin/products?category_id=${categoryId}`);
      const result = await response.json();
      return result.success ? result.data : [];
    } catch { return []; }
  };

  const addCategory = async () => {
    const name = prompt("Nama Folder Baru:");
    if (!name) return;
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: await getAuthHeader(),
      body: JSON.stringify({ name }),
    });
    if ((await response.json()).success) await fetchInitialData();
    else alert("Gagal membuat folder.");
  };

  const renameCategory = async (oldName: string) => {
    const newName = prompt("Edit Nama Folder:", oldName);
    if (!newName || newName === oldName) return;
    const response = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: await getAuthHeader(),
      body: JSON.stringify({ oldName, newName }),
    });
    if ((await response.json()).success) await fetchInitialData();
  };

  const deleteCategory = async (cat: any) => {
    if (!confirm(`Hapus folder "${cat.name}"?`)) return;
    const response = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: await getAuthHeader(),
      body: JSON.stringify({ id: cat.id, name: cat.name }),
    });
    if ((await response.json()).success) await fetchInitialData();
  };

  const handleAction = async (file: File) => {
    if (!activeCategory) return alert("Pilih kategori!");
    setIsUploading(true);
    try {
      const { data: { session } } = await supabaseAuth.auth.getSession();
      const processedFile = await processAndCompressImage(file);
      const formData = new FormData();
      formData.append("file", processedFile);
      formData.append("category_id", activeCategory.id.toString());
      formData.append("name", processedFile.name.split(".")[0]);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Authorization": `Bearer ${session?.access_token}` },
        body: formData,
      });

      if ((await response.json()).success) {
        const products = await fetchProductsForCategory(activeCategory.id, activeCategory.name);
        setAllProducts((prev) => ({ ...prev, [activeCategory.name]: products }));
      }
    } catch (e) { alert("Gagal upload"); }
    finally { setIsUploading(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Hapus foto ini?")) return;
    const response = await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
      headers: await getAuthHeader(),
    });
    if ((await response.json()).success) {
        const products = await fetchProductsForCategory(activeCategory.id, activeCategory.name);
        setAllProducts((prev) => ({ ...prev, [activeCategory.name]: products }));
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
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
            <button onClick={() => renameCategory(cat.name)} className="absolute top-0 right-6 bg-yellow-500 text-white rounded-full p-0.5"><Edit2 size={10}/></button>
            <button onClick={() => deleteCategory(cat)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {activeCategory && (allProducts[activeCategory.name] || []).map((item: any) => (
          <div key={item.id} className="group relative border-2 rounded-2xl p-3 bg-white shadow-sm">
            <img src={item.image_url} className="w-full aspect-square object-cover rounded-xl" />
            <button onClick={() => handleDeleteProduct(item.id)} className="absolute top-6 right-6 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"><Trash2 size={18} /></button>
          </div>
        ))}
        
        {categories.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col gap-2 items-center justify-center aspect-square bg-gray-50 cursor-not-allowed opacity-50">
            <Plus size={40} className="text-gray-300" />
            <p className="text-xs text-gray-400 text-center px-2">Buat folder dulu</p>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col gap-2 items-center justify-center aspect-square bg-gray-50 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
            {isUploading ? <Loader2 className="animate-spin text-blue-600 h-10 w-10" /> : <Plus size={40} className="text-gray-400" />}
          </button>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleAction(e.target.files[0])} className="hidden" />
    </div>
  );
}