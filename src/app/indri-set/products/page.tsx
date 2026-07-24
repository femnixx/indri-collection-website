"use client";

import React from "react";
import { FolderPlus, Settings2, Loader2, AlertCircle, Tag } from "lucide-react";
import { useProducts } from "./hooks/useProducts";
import { useCategoryModals } from "./hooks/useCategoryModals";
import ProductCard from "./components/ProductCard";
import UploadDropzone from "./components/UploadCard";
import CategoryFormModal from "./components/CategoryFormModal";
import DeleteCategoryModal from "./components/DeleteCategoryModal";
import ManageCategoriesModal from "./components/ManageCategoriesModal";

export default function ManageProductsPage() {
  const {
    categories, activeCategory, setActiveCategory,
    isUploading, isLoading, error,
    addCategory, renameCategory, deleteCategory,
    uploadProduct, updateProductName, updateProductCategory, deleteProduct,
    currentProducts,
  } = useProducts();

  const {
    showAddCat, showManageCat, renamingCat, deletingCat,
    openAdd, closeAdd, openManage, closeManage,
    openRename, closeRename, openDelete, closeDelete,
  } = useCategoryModals();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-accent animate-spin" />
          <p className="text-sm text-slate-muted">Memuat koleksi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-10 w-10 text-danger" />
          <p className="text-sm text-danger font-semibold">Gagal memuat data</p>
          <p className="text-xs text-slate-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-primary">Kelola Produk</h1>
          <p className="text-sm text-slate-muted mt-0.5">
            {currentProducts.length} foto
            {activeCategory ? ` di "${activeCategory.name}"` : " total"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {categories.length > 0 && (
            <button
              onClick={openManage}
              className="flex items-center gap-1.5 bg-card border border-card-border text-primary px-3 py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-secondary transition-colors cursor-pointer"
            >
              <Settings2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Edit Kategori</span>
            </button>
          )}
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-primary/80 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20"
          >
            <FolderPlus className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Tambah Kategori</span>
          </button>
        </div>
      </div>

      {/* Category filter tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={[
              "px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
              activeCategory === null
                ? "bg-accent text-white shadow-md shadow-accent/20"
                : "bg-slate-light text-slate-dark hover:bg-slate-light border border-slate-dark/30",
            ].join(" ")}
          >
            Semua ({categories.flatMap((c) => c.products ?? []).length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              className={[
                "px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
                activeCategory?.id === cat.id
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "bg-slate-light text-slate-dark hover:bg-slate-light border border-slate-dark/30",
              ].join(" ")}
            >
              {cat.name} ({cat.products?.length ?? 0})
            </button>
          ))}
        </div>
      )}

      {/* Upload dropzone */}
      <UploadDropzone
        isUploading={isUploading}
        categories={categories}
        onUpload={uploadProduct}
      />

      {/* Product grid */}
      {currentProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border-2 border-dashed border-slate-light">
          <div className="p-4 bg-secondary rounded-full">
            <Tag className="h-8 w-8 text-slate-muted" />
          </div>
          <p className="text-sm font-semibold text-slate-dark">Belum ada foto</p>
          <p className="text-xs text-slate-muted">Upload foto pertama menggunakan area di atas</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentProducts.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              categories={categories}
              onDelete={deleteProduct}
              onUpdateName={updateProductName}
              onUpdateCategory={updateProductCategory}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ManageCategoriesModal
        open={showManageCat}
        categories={categories}
        onRename={openRename}
        onDelete={openDelete}
        onClose={closeManage}
      />

      <CategoryFormModal
        open={showAddCat}
        mode="add"
        onSubmit={addCategory}
        onClose={closeAdd}
      />

      <CategoryFormModal
        open={!!renamingCat}
        mode="rename"
        initialValue={renamingCat?.name}
        onSubmit={(newName) => renameCategory(renamingCat!.name, newName)}
        onClose={closeRename}
      />

      <DeleteCategoryModal
        category={deletingCat}
        onConfirm={deleteCategory}
        onClose={closeDelete}
      />
    </div>
  );
}
