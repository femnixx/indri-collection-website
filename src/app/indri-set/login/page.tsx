"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabaseAuth } from "@/lib/supabaseClient"; 

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkActiveSession = async () => {
      const { data: { session } } = await supabaseAuth.auth.getSession();
      if (session) {
        router.replace("/indri-set");
      }
    };
    checkActiveSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabaseAuth.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        setError(authError.message || "Email atau password administrator salah.");
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        router.replace("/indri-set");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem saat mencoba login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <Link 
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 z-10">
        
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-md shadow-blue-500/20">
            <img src="/logo-indri.svg" alt="Logo Indri" className="h-full w-full object-contain brightness-0 invert" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Admin Panel Login
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-light">
            Sistem Manajemen Internal Indri Collection
          </p>
        </div>

        {/* Form Login */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 text-sm font-medium"
                  placeholder="admin@indricollection.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-11 text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 text-sm font-medium"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-2xl bg-blue-600 py-3.5 px-4 text-sm font-bold text-white transition-all shadow-lg shadow-blue-600/15 hover:bg-blue-500 hover:shadow-blue-500/20 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                "Masuk ke Sistem"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}