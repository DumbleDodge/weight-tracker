import React, { useState } from 'react';
import { supabase } from '../supabase'; // Ajusta la ruta según donde tengas supabase.js
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Cuenta creada! Ya puedes iniciar sesión.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Bienvenido</h1>
          <p className="text-slate-500 dark:text-slate-400">Tu centro de rendimiento</p>
        </div>

        <Card>
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-left font-normal text-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contraseña</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-left font-normal text-lg" />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Entrar'}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-sm text-slate-500 hover:text-primary transition-colors"
            >
              {isSignUp ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "} 
              <span className="font-bold text-primary">{isSignUp ? 'Inicia Sesión' : 'Regístrate'}</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;