"use client";

import React from "react";
import { usePathname } from "next/navigation";
import MobileMenu from "./header.jsx"; // Pastikan path ke header.jsx sudah benar
import Footer from "./footer.jsx";     // Pastikan path ke footer.jsx sudah benar

export default function LayoutContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Memeriksa apakah rute saat ini diawali dengan "/admin"
  const isAdminRoute = pathname?.startsWith("/admin");

  // Jika berada di rute /admin, render children langsung TANPA Header & Footer
  if (isAdminRoute) {
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