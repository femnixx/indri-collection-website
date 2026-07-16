"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, FolderPlus, Loader2, Trash2, Edit2, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { processAndCompressImage } from "@/lib/imageUtils";

export default function ManageCollectionPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<Record<string, any[]>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productToReplace, setProductToReplace] = useState<any>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const { data: folderData } = await supabase.storage.from("products").list();
    if (folderData) {
      const cats = folderData
        .filter((f) => f.id === null)
        .map((f, index) => ({ id: index, name: f.name }));

      setCategories(cats);
      if (cats.length > 0) {
        setActiveCategory(cats[0]);
        const productsMap: Record<string, any[]> = {};
        for (const cat of cats) {
          productsMap[cat.name] = await fetchProductsForCategory(cat.name);
        }
        setAllProducts(productsMap);
      }
    }
  };

  const fetchProductsForCategory = async (categoryName: string) => {
    const folderName = categoryName.replace(/\s+/g, "_").toLowerCase();
    const { data: files } = await supabase.storage.from("products").list(folderName);
    if (!files) return [];

    return files
      .filter((f) => f.name !== ".keep")
      .map((file) => ({
        ...file,
        image_url: supabase.storage.from("products").getPublicUrl(`${folderName}/${file.name}`).data.publicUrl,
        folder: folderName,
      }));
  };

  const refreshCategory = async (catName: string) => {
    const products = await fetchProductsForCategory(catName);
    setAllProducts((prev) => ({ ...prev, [catName]: products }));
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

  const handleAction = async (file: File, isReplace = false) => {
    setIsUploading(true);
    try {
      const processedFile = await processAndCompressImage(file);
      const folder = activeCategory.name.replace(/\s+/g, "_").toLowerCase();

      if (isReplace && productToReplace) {
        await supabase.storage.from("products").remove([`${folder}/${productToReplace.name}`]);
      }

      await supabase.storage.from("products").upload(`${folder}/${processedFile.name}`, processedFile, {
        contentType: 'image/webp'
      });
      
      setProductToReplace(null);
      refreshCategory(activeCategory.name);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal memproses gambar.");
    } finally {
      setIsUploading(false);
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
          <div key={item.name} className="group relative border rounded-2xl p-2 bg-white shadow-sm">
            <img src={item.image_url} className="w-full aspect-square object-cover rounded-xl" />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={async () => { await supabase.storage.from("products").remove([`${item.folder}/${item.name}`]); refreshCategory(activeCategory.name); }} 
                className="p-2 bg-red-500 text-white rounded-full shadow"><Trash2 size={16} /></button>
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