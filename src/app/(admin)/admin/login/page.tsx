'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/events';

  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!adminKey.trim()) {
      setError('Admin key is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Login failed');
      }

      router.replace(redirectPath);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-events-page">
      <div className="admin-events-wrap admin-auth-card">
        <h1>Admin Login</h1>
        <p>Enter your admin key to continue.</p>
        <form className="admin-events-form" onSubmit={onSubmit}>
          <label>
            Admin Key
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key"
              autoComplete="off"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {error && <p className="admin-state admin-error">{error}</p>}
      </div>
    </main>
  );
}
