"use client";

import React from 'react';

/**
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs them to the console, and displays a fallback UI instead of crashing.
 */
export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to the console for debugging
    console.log("============================================");
    console.log("🔴 ERROR BOUNDARY CAUGHT AN ERROR:");
    console.log("🔴 Error:", error.message);
    console.log("🔴 Stack:", error.stack);
    console.log("🔴 Component Stack:", errorInfo.componentStack);
    console.log("============================================");
  }

  render() {
    if (this.state.hasError) {
      console.log("🟡 ErrorBoundary: Rendering fallback UI");
      return this.props.fallback || (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          color: '#10324A',
          background: '#F5FCFF',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>Terjadi Kesalahan</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', maxWidth: '400px' }}>
            Maaf, terjadi kesalahan saat memuat halaman. Silakan refresh browser Anda.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 32px',
              background: '#11B5F5',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Refresh Halaman
          </button>
          <details style={{ marginTop: '40px', textAlign: 'left', opacity: 0.5, fontSize: '12px' }}>
            <summary>Detail Error (untuk debugging)</summary>
            <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}