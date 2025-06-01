
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7A3E69] via-[#303E74] via-[#72CE9F] via-[#EAA124] to-[#907EEF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestão Fiscal
          </h1>
          <p className="text-white/80">
            {isLogin ? 'Entre em sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-[24px] p-8 border border-white/20">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
