"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !formData.category_id) {
      return alert("Mohon lengkapi kategori dan foto produk!");
    }

    setLoading(true);
    try {
      // 1. Upload to dynamic path: bucket/category_id/filename
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${formData.category_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      // 3. Submit metadata to internal API
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image_url: publicUrl }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Gagal menyimpan ke database");

      alert("Produk berhasil ditambahkan!");
      router.refresh();
      
      // Reset Form
      setFormData({ name: "", description: "", category_id: "", is_published: true });
      setImageFile(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold">Tambah Produk Baru</h2>
      
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
        <label className="block text-sm font-medium">Deskripsi</label>
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