"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseAuth } from "@/lib/supabaseClient";

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabaseAuth.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/indri-set");
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabaseAuth.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message || "Email atau password administrator salah.");
        return;
      }

      if (data?.session) {
        router.replace("/indri-set");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan sistem saat mencoba login.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    error,
    isLoading,
    handleLogin,
  };
}
