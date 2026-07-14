"use client";

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
    } finally {
      setIsUploading(false);
    }
  };

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
    </div>
  );
}