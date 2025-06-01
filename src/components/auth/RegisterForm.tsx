
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Conta criada com sucesso! Verifique seu e-mail para confirmar.');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
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
        <div>
          <Label htmlFor="confirmPassword" className="text-white font-medium">
            Confirmar Senha
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-300 text-sm text-center">{error}</p>
      )}

      {success && (
        <p className="text-green-300 text-sm text-center">{success}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold"
      >
        {loading ? 'Criando conta...' : 'Criar conta'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-white/80 hover:text-white text-sm underline"
        >
          Já tem conta? Faça login
        </button>
      </div>
    </form>
  );
};
