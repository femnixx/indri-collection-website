"use client";

import React from "react";
import { useLogin } from "./hooks/useLogin";
import LoginForm from "./components/LoginForm";

export default function AdminLoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    error,
    isLoading,
    handleLogin,
  } = useLogin();

  return (
    <LoginForm
      email={email}
      password={password}
      showPassword={showPassword}
      error={error}
      isLoading={isLoading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onTogglePassword={() => setShowPassword((v) => !v)}
      onSubmit={handleLogin}
    />
  );
}