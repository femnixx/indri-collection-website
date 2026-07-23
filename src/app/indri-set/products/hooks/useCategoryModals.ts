"use client";

import { useState } from "react";
import { Category } from "../lib/types";

interface UseCategoryModalsReturn {
  showAddCat: boolean;
  showManageCat: boolean;
  renamingCat: Category | null;
  deletingCat: Category | null;
  openAdd: () => void;
  closeAdd: () => void;
  openManage: () => void;
  closeManage: () => void;
  /** Called from ManageCategoriesModal — closes manage, opens rename */
  openRename: (cat: Category) => void;
  closeRename: () => void;
  /** Called from ManageCategoriesModal — closes manage, opens delete confirm */
  openDelete: (cat: Category) => void;
  closeDelete: () => void;
}

export function useCategoryModals(): UseCategoryModalsReturn {
  const [showAddCat, setShowAddCat] = useState(false);
  const [showManageCat, setShowManageCat] = useState(false);
  const [renamingCat, setRenamingCat] = useState<Category | null>(null);
  const [deletingCat, setDeletingCat] = useState<Category | null>(null);

  const openRename = (cat: Category) => {
    setShowManageCat(false);
    setRenamingCat(cat);
  };

  const openDelete = (cat: Category) => {
    setShowManageCat(false);
    setDeletingCat(cat);
  };

  return {
    showAddCat,
    showManageCat,
    renamingCat,
    deletingCat,
    openAdd: () => setShowAddCat(true),
    closeAdd: () => setShowAddCat(false),
    openManage: () => setShowManageCat(true),
    closeManage: () => setShowManageCat(false),
    openRename,
    closeRename: () => setRenamingCat(null),
    openDelete,
    closeDelete: () => setDeletingCat(null),
  };
}
