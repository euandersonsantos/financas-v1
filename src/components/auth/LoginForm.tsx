
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-white font-medium">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-white font-medium">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-300 text-sm text-center">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-white/80 hover:text-white text-sm underline"
        >
          Não tem conta? Cadastre-se
        </button>
      </div>
    </form>
  );
};
