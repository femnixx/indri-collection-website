"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseData as supabase } from "@/lib/supabaseClient";
import { processAndCompressImage } from "@/lib/imageUtils";
import { Category, Product } from "../lib/types";

export type { Category, Product };

export function useProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/indri-set/products", { cache: "no-store" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat data");

      const groups: Category[] = json.data || [];
      setCategories(groups);
      setActiveCategory((prev) => {
        if (!prev) return groups[0] ?? null;
        return groups.find((c) => c.id === prev.id) ?? groups[0] ?? null;
      });
    } catch (err: any) {
      setError(err.message);
      console.error("[useProducts] loadData error:", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("products-admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () => loadData(false))
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => loadData(false))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadData]);

  // --- Category CRUD ---
  const addCategory = async (name: string) => {
    const trimmed = name.trim();
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error("Kategori sudah ada");
    }
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: trimmed }),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Gagal membuat kategori");
    await loadData(false);
  };

  const renameCategory = async (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase() && c.name !== oldName)) {
      throw new Error("Nama kategori sudah ada");
    }
    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ oldName, newName: trimmed }),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Gagal mengubah kategori");
    await loadData(false);
  };

  const deleteCategory = async (cat: Category) => {
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: cat.id, name: cat.name }),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Gagal menghapus kategori");
    await loadData(false);
  };

  // --- Product CRUD ---
  const uploadProduct = async (file: File, fileName: string, categoryId?: string) => {
    setIsUploading(true);
    try {
      const processedFile = await processAndCompressImage(file);
      const folder = categoryId
        ? (categories.find((c) => c.id === categoryId)?.name ?? "uncategorized")
            .replace(/\s+/g, "_").toLowerCase()
        : "uncategorized";

      const storagePath = `${folder}/${Date.now()}_${fileName.trim() || processedFile.name}`.replace(/[^a-z0-9_/.]/gi, "_");

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(storagePath, processedFile, { contentType: "image/webp", upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(storagePath);

      const res = await fetch("/api/indri-set/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fileName.trim() || processedFile.name, categoryId: categoryId || null, image_url: publicUrl }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Gagal menyimpan produk");
      await loadData(false);
    } catch (err: any) {
      console.error("[useProducts] uploadProduct error:", err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const updateProductName = async (id: string, name: string) => {
    const res = await fetch("/api/indri-set/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name }),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Gagal mengubah nama");
    await loadData(false);
  };

  const updateProductCategory = async (id: string, categoryId: string | null) => {
    const res = await fetch("/api/indri-set/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, category_id: categoryId }),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Gagal mengubah kategori produk");
    await loadData(false);
  };

  const deleteProduct = async (product: Product) => {
    // Try to remove from storage (best-effort, don't throw if path not found)
    try {
      const urlObj = new URL(product.image_url);
      const pathParts = urlObj.pathname.split("/products/");
      if (pathParts[1]) {
        await supabase.storage.from("products").remove([pathParts[1]]);
      }
    } catch { /* ignore storage errors — DB delete is the source of truth */ }

    const res = await fetch("/api/indri-set/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id }),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Gagal menghapus produk");
    await loadData(false);
  };

  const currentProducts: Product[] = activeCategory
    ? activeCategory.products ?? []
    : categories.flatMap((c) => c.products ?? []);

  return {
    categories,
    activeCategory,
    setActiveCategory,
    isUploading,
    isLoading,
    error,
    addCategory,
    renameCategory,
    deleteCategory,
    uploadProduct,
    updateProductName,
    updateProductCategory,
    deleteProduct,
    currentProducts,
  };
}
