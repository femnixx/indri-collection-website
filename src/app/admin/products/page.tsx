"use client";

import React, { useState, useEffect, useRef } from "react";
import { Folder, Plus, FolderPlus, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ManageCollectionPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
    if (data && data.length > 0) setActiveCategory(data[0]);
  };

  useEffect(() => {
    if (activeCategory) fetchProducts(activeCategory.id);
  }, [activeCategory]);

  const fetchProducts = async (catId: string) => {
    const { data } = await supabase.from("products").select("*").eq("category_id", catId);
    setProducts(data || []);
  };

  // --- REWRITTEN addCategory FUNCTION ---
  const addCategory = async () => {
    const name = prompt("Nama Folder Baru:");
    if (!name || name.trim().length < 3) {
      alert("Nama folder minimal 3 karakter.");
      return;
    }

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (result.success) {
        const newCategory = result.data;
        setCategories([...categories, newCategory]);
        if (!activeCategory) setActiveCategory(newCategory);
      } else {
        alert("Gagal membuat folder: " + (result.error || "Terjadi kesalahan."));
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Terjadi kesalahan sistem.");
    }
  };
  // ---------------------------------------

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !activeCategory) return;
    setIsUploading(true);
    const file = e.target.files[0];
    const { data: storageData } = await supabase.storage.from("products").upload(`${Date.now()}_${file.name}`, file);
    const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(storageData!.path);
    await supabase.from("products").insert({ title: file.name, image_url: publicUrl, category_id: activeCategory.id });
    fetchProducts(activeCategory.id);
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 h-full">
      <div className="w-full space-y-4">
        <button onClick={addCategory} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 font-bold text-sm">
          <FolderPlus size={18} /> Buat Folder
        </button>
        
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat)} 
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap ${activeCategory?.id === cat.id ? "bg-blue-50 text-blue-700" : "text-gray-500 bg-gray-50 hover:bg-gray-100"}`}
            >
              <Folder size={18} /> {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {categories.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl text-gray-400 p-6">
            <AlertCircle size={48} className="mb-4" />
            <p className="font-bold text-center">Belum ada folder koleksi.</p>
            <p className="text-sm text-center">Silakan buat folder di atas untuk memulai.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-xl font-extrabold">{activeCategory?.name}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((item) => (
                <div key={item.id} className="bg-white border rounded-2xl p-2 shadow-sm">
                  <img src={item.image_url} className="w-full aspect-square object-cover rounded-xl" />
                  <p className="text-xs font-bold p-2 truncate">{item.title}</p>
                </div>
              ))}
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-blue-400 text-gray-500 min-h-[150px]">
                {isUploading ? <Loader2 className="animate-spin" /> : <Plus size={32} />}
                <p className="text-xs font-bold mt-2">Tambah Foto</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
    </div>
  );
}