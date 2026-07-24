"use client";

import React from "react";
import { usePathname } from "next/navigation";
import MobileMenu from "./header"; // Pastikan path ke header sudah benar
import Footer from "./footer";     // Pastikan path ke footer sudah benar

export default function LayoutContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Memeriksa apakah rute saat ini diawali dengan "/admin" atau /indri-set
  const isAdminOrAdminPanel = pathname?.startsWith("/admin") || pathname?.startsWith("/indri-set");

  // Jika berada di rute /admin atau panel, render children langsung TANPA Header & Footer
  if (isAdminOrAdminPanel) {
    return <main>{children}</main>;
  }

  // Jika berada di landing page biasa, tetap munculkan Header & Footer
  return (
    <>
      <MobileMenu />
      <main>{children}</main>
      <Footer />
    </>
  );
}