"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { supabaseAuth, supabaseData } from "@/lib/supabaseClient";

export default function ManageCollectionPage() {
  const [collection, setCollection] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
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

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm("Hapus foto ini?")) return;

    const { data: { session } } = await supabaseAuth.auth.getSession();
    if (session) await supabaseData.auth.setSession(session.access_token);

    await supabaseData.storage.from("product-images").remove([imageUrl]);
    await supabaseData.from("products").delete().eq("id", id);
    
    fetchCollections();
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
          <div key={item.id} className="group relative bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="aspect-square bg-gray-100">
              <img 
                src={supabaseData.storage.from("product-images").getPublicUrl(item.image_url).data.publicUrl} 
                className="w-full h-full object-cover"
                alt={item.name}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(item.id, item.image_url)} 
                  className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold truncate">{item.name}</h4>
            </div>
          </div>
        ))}

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-all min-h-[200px]"
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <p className="text-sm font-bold">Tambah Foto</p>
            </>
          )}
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
    </div>
  );
}