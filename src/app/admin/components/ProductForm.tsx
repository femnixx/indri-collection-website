"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js"; // Gunakan client instance untuk upload direct dari browser

export default function ProductForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    is_published: true,
  });

  const handleUploadImage = async (file: File): Promise<string | null> => {
    // Inisialisasi Supabase client publik di sisi browser
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}_${Date.now()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    // Pastikan Anda sudah membuat public bucket bernama 'products' di Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Gagal unggah gambar:", uploadError.message);
      return null;
    }

    // Dapatkan Public URL gambar yang diunggah
    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Silakan pilih gambar produk terlebih dahulu!");

    setLoading(true);
    try {
      // 1. Unggah gambar ke Supabase Storage terlebih dahulu
      const imageUrl = await handleUploadImage(imageFile);
      if (!imageUrl) throw new Error("Gagal mengunggah gambar");

      // 2. Kirim seluruh metadata produk ke API internal Next.js
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image_url: imageUrl }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      alert("Produk berhasil ditambahkan!");
      router.refresh();
      // Reset form di sini jika diperlukan
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4 p-4 bg-white rounded shadow">
      <div>
        <label className="block text-sm font-medium">Nama Produk</label>
        <input 
          type="text" required value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full border p-2 rounded" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Kategori</label>
        <select 
          required value={formData.category_id}
          onChange={(e) => setFormData({...formData, category_id: e.target.value})}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Foto Produk</label>
        <input 
          type="file" accept="image/*" required
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Deskripsi (Opsional)</label>
        <textarea 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full border p-2 rounded" 
        />
      </div>

      <button 
        type="submit" disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Menyimpan..." : "Tambah Produk"}
      </button>
    </form>
  );
}