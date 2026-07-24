"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  error: string;
  isLoading: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  email, password, showPassword, error, isLoading,
  onEmailChange, onPasswordChange, onTogglePassword, onSubmit,
}: LoginFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-highlight/10 blur-3xl" />

      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-medium text-slate-muted hover:text-accent transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-light bg-white p-8 shadow-xl shadow-slate-light/50 z-10">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-highlight p-2.5 shadow-md shadow-accent/20">
            <img src="/logo-indri.svg" alt="Logo Indri" className="h-full w-full object-contain brightness-0 invert" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
            Admin Panel Login
          </h2>
          <p className="mt-2 text-sm text-slate-muted font-light">
            Sistem Manajemen Internal Indri Collection
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-xl bg-danger/10 p-4 border border-danger/25 text-danger text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-slate-muted" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-light bg-secondary/50 py-3.5 pl-11 pr-4 text-primary placeholder-slate-muted outline-none transition-all focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15 text-sm font-medium"
                  placeholder="admin@indricollection.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-dark mb-2">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-muted" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-light bg-secondary/50 py-3.5 pl-11 pr-11 text-primary placeholder-slate-muted outline-none transition-all focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15 text-sm font-medium"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-muted hover:text-slate-dark transition-colors cursor-pointer"
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
              className="group relative flex w-full justify-center rounded-2xl bg-accent py-3.5 px-4 text-sm font-bold text-white transition-all shadow-lg shadow-accent/15 hover:bg-highlight hover:shadow-highlight/20 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
