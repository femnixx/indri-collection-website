"use client";

<<<<<<< HEAD
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
=======
import React, { useState, useRef, useEffect } from "react";
import { Upload, Trash2, Loader2, Pencil, Check, X } from "lucide-react";
import { supabaseAuth, supabaseData } from "@/lib/supabaseClient";

export default function ManageCollectionPage() {
  const [collection, setCollection] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false); 
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const { data, error } = await supabaseData
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setCollection(data);
    if (error) console.error("Error fetching database:", error.message);
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;

    try {
      const { data: { session } } = await supabaseAuth.auth.getSession();
      if (session) {
        await supabaseData.auth.setSession(session.access_token);
      }

      const { error: uploadError } = await supabaseData.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabaseData
        .from("products")
        .insert([{ 
          name: file.name.split('.')[0],
          image_url: fileName, 
          is_published: true 
        }]);

      if (dbError) throw dbError;

      fetchCollections();
    } catch (err: any) {
      console.error("Upload error details:", err);
      alert("Gagal mengunggah foto: " + (err.message || "Periksa policy storage"));
>>>>>>> origin/dev-v2
    } finally {
      setIsUploading(false);
    }
  };

<<<<<<< HEAD
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
=======
  const handleUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm("Hapus foto ini?")) return;

    const { data: { session } } = await supabaseAuth.auth.getSession();
    if (session) await supabaseData.auth.setSession(session.access_token);

    await supabaseData.storage.from("product-images").remove([imageUrl]);
    await supabaseData.from("products").delete().eq("id", id);
    
    fetchCollections();
  };

  const startEditing = (id: number, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveEditedName = async (id: number) => {
    if (!editName.trim()) return;

    try {
      const { data: { session } } = await supabaseAuth.auth.getSession();
      if (session) await supabaseData.auth.setSession(session.access_token);

      const { error } = await supabaseData
        .from("products")
        .update({ name: editName })
        .eq("id", id);

      if (error) throw error;

      setCollection(collection.map(item => 
        item.id === id ? { ...item, name: editName } : item
      ));
      setEditingId(null);
    } catch (err: any) {
      console.error("Gagal update nama:", err);
      alert("Gagal menyimpan nama baru.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Kelola Koleksi Foto</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Update foto untuk section "Koleksi Kami".
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {collection.map((item) => (
          <div key={item.id} className="group relative bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="aspect-square bg-gray-100 relative">
              <img 
                src={supabaseData.storage.from("product-images").getPublicUrl(item.image_url).data.publicUrl} 
                className="w-full h-full object-cover"
                alt={item.name}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(item.id, item.image_url)} 
                  className="p-2 cursor-pointer bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg"
                  title="Hapus Foto"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between gap-2 border-t bg-gray-50 flex-grow">
              {editingId === item.id ? (
                <div className="flex w-full items-center gap-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditedName(item.id)} // Bisa tekan Enter buat simpan
                    autoFocus
                    className="w-full text-sm font-bold border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={() => saveEditedName(item.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1 text-red-500 hover:bg-red-100 rounded">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h4 className="text-sm font-bold truncate" title={item.name}>{item.name}</h4>
                  <button 
                    onClick={() => startEditing(item.id, item.name)}
                    className="p-1.5 cursor-pointer text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Nama"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all min-h-[200px] 
            ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
              <p className="text-sm text-gray-500">Mengunggah...</p>
            </div>
          ) : (
            <>
              <div className={`p-3 rounded-full mb-3 ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`h-6 w-6 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-sm font-bold text-gray-700">
                {isDragging ? 'Lepaskan Foto Di Sini' : 'Klik atau Drag Foto'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUploadClick} 
        className="hidden" 
        accept="image/*" 
      />
>>>>>>> origin/dev-v2
    </div>
  );
}