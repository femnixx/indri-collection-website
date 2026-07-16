"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, FolderPlus, Loader2, Trash2, Edit2, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ManageCollectionPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [productToReplace, setProductToReplace] = useState<any>(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
    if (data && data.length > 0) setActiveCategory(data[0]);
  };

  const addCategory = async () => {
    const name = prompt("Nama Folder Baru:");
    if (!name) return;
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const result = await response.json();
    if (result.success) {
      setCategories([...categories, result.data]);
      setActiveCategory(result.data);
    }
  };

  const deleteCategory = async (cat: any) => {
    if (!confirm(`Hapus folder "${cat.name}" dan semua isinya?`)) return;
    const folderName = cat.name.replace(/\s+/g, '_').toLowerCase();
    
    const { data: files } = await supabase.storage.from('products').list(folderName);
    if (files && files.length > 0) {
      await supabase.storage.from('products').remove(files.map(f => `${folderName}/${f.name}`));
    }

    await supabase.from("categories").delete().eq("id", cat.id);
    fetchCategories();
  };

  useEffect(() => {
    if (activeCategory) fetchProducts(activeCategory.name);
  }, [activeCategory]);

  const fetchProducts = async (categoryName: string) => {
    const folderName = categoryName.replace(/\s+/g, '_').toLowerCase();
    const { data: files } = await supabase.storage.from('products').list(folderName);
    
    const filteredFiles = (files || []).filter(f => f.name !== '.keep');
    const mappedFiles = filteredFiles.map((file) => ({
      ...file,
      image_url: supabase.storage.from('products').getPublicUrl(`${folderName}/${file.name}`).data.publicUrl,
      folder: folderName
    }));
    setProducts(mappedFiles);
  };

  const handleAction = async (file: File, isReplace = false) => {
    setIsUploading(true);
    const folder = activeCategory.name.replace(/\s+/g, '_').toLowerCase();
    if (isReplace && productToReplace) {
      await supabase.storage.from('products').remove([`${folder}/${productToReplace.name}`]);
    }
    await supabase.storage.from('products').upload(`${folder}/${file.name}`, file);
    setIsUploading(false);
    setProductToReplace(null);
    fetchProducts(activeCategory.name);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">{activeCategory?.name || "Koleksi"}</h1>
        <button onClick={addCategory} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition">
          <FolderPlus size={16} /> Buat Folder
        </button>
      </div>
      
      {/* Container for categories list - Now using flex-wrap and responsive padding */}
      <div className="flex flex-wrap gap-3 pb-4">
        {categories.map((cat) => (
          <div key={cat.id} className="relative pt-2 pr-2">
            <button 
              onClick={() => setActiveCategory(cat)} 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                activeCategory?.id === cat.id ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
            <button 
              onClick={() => deleteCategory(cat)} 
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((item) => (
          <div key={item.name} className="group relative border rounded-2xl p-2 bg-white shadow-sm hover:shadow-lg transition">
            <img src={item.image_url} className="w-full aspect-square object-cover rounded-xl" />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => { setProductToReplace(item); replaceInputRef.current?.click(); }} 
                className="p-2 bg-white rounded-full shadow hover:bg-gray-50"><Edit2 size={16} /></button>
              <button onClick={async () => { await supabase.storage.from('products').remove([`${item.folder}/${item.name}`]); fetchProducts(activeCategory.name); }} 
                className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        
        <button onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer aspect-square hover:border-blue-400 transition">
          {isUploading ? <Loader2 className="animate-spin" /> : <Plus size={32} className="text-gray-400" />}
        </button>
      </div>

      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleAction(e.target.files[0])} className="hidden" />
      <input type="file" ref={replaceInputRef} onChange={(e) => e.target.files && handleAction(e.target.files[0], true)} className="hidden" />
    </div>
  );
}