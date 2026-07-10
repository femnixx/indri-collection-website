"use client";

import React, { useState, useRef } from "react";
import { Upload, Trash2, RefreshCw, Plus } from "lucide-react";

interface CollectionItem {
  id: number;
  title: string;
  imageUrl: string;
}

export default function ManageCollectionPage() {
  // Mock entries mirroring the "Koleksi Kami" section
  const [collection, setCollection] = useState<CollectionItem[]>([
    { id: 1, title: "Tas Rajut Biru Cerah", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600" },
    { id: 2, title: "Sling Bag Rajut Khaki", imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600" },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [activeReplaceId, setActiveReplaceId] = useState<number | null>(null);

  const handleUploadNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      
      const newItem: CollectionItem = {
        id: Date.now(),
        title: `Koleksi Baru #${collection.length + 1}`,
        imageUrl: fakeUrl
      };

      setCollection([...collection, newItem]);
    }
  };

  const handleReplaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && activeReplaceId !== null) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);

      setCollection(collection.map(item => 
        item.id === activeReplaceId ? { ...item, imageUrl: fakeUrl } : item
      ));
      setActiveReplaceId(null);
    }
  };

  const handleRemoveItem = (id: number) => {
    if(confirm("Apakah Anda yakin ingin menghapus foto ini dari galeri depan?")) {
      setCollection(collection.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* 🌟 Header Container without redundant top actions */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          Kelola Koleksi Foto
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 font-light">
          Perbarui, ganti, atau hapus gambar item yang tampil di section <span className="font-semibold text-blue-600">"Koleksi Kami"</span> di landing page.
        </p>
      </div>

      {/* Hidden Native Device Inputs */}
      <input type="file" ref={fileInputRef} onChange={handleUploadNewImage} accept="image/*" className="hidden" />
      <input type="file" ref={replaceInputRef} onChange={handleReplaceImage} accept="image/*" className="hidden" />

      {/* 🖼️ Main Management Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collection.map((item) => (
          <div 
            key={item.id}
            className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
          >
            {/* Image Box */}
            <div className="relative aspect-square w-full bg-gray-50 overflow-hidden border-b border-gray-50">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              {/* Overlay Trigger Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                <button 
                  onClick={() => {
                    setActiveReplaceId(item.id);
                    replaceInputRef.current?.click();
                  }}
                  className="p-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-100 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                  Ganti Gbr
                </button>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Label and Info Card */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Live on Landing Page
                </span>
                <h4 className="text-sm font-bold text-gray-800 mt-1.5 line-clamp-2">
                  {item.title}
                </h4>
              </div>
            </div>
          </div>
        ))}

        {/* ➕ The Dedicated and Unified Upload Anchor Slot */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:bg-gray-50/50 hover:border-blue-300 transition-all cursor-pointer group min-h-[280px]"
        >
          <div className="h-12 w-12 rounded-xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center mb-3 transition-colors">
            <Upload className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
          </div>
          <p className="text-sm font-bold text-gray-700">Tambah Foto Koleksi</p>
          <p className="text-xs text-gray-400 max-w-[160px] mx-auto mt-1 font-light">Klik untuk memilih berkas dari perangkat Anda</p>
        </div>
      </div>
    </div>
  );
}