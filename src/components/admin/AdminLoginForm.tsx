'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/components/forms/FormInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Credenciais inválidas');
        return;
      }

      router.push('/administradores/pontos');
      router.refresh();
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <Alert variant="error">{error}</Alert>}

      <FormInput
        label="Usuário"
        type="text"
        autoComplete="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />

      <FormInput
        label="Senha"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Entrar
      </Button>
    </form>
  );
}
