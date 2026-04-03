import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

const LoginView: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] text-[#333] min-h-screen font-sans leading-normal flex items-center justify-center p-4">
      <section className="bg-white w-full max-w-xl p-8 sm:p-12 shadow-xl border border-gray-100 rounded-sm">
        <div className="w-full border-b border-gray-200 mb-10 pb-6 text-center">
          <h2 className="uppercase tracking-[0.3em] text-xl sm:text-2xl font-black">
            Connexion
          </h2>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); void handleLogin(); }} className="space-y-8">
          <div className="w-full">
            <label className="block uppercase tracking-widest text-[11px] font-black mb-2 text-gray-500">
              Adresse Email
            </label>
            <input
              className="w-full shadow-inner p-4 border border-gray-200 bg-[#FAF9F6] focus:ring-1 focus:ring-black outline-none transition-all"
              type="email"
              placeholder="admin@mon-projet.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="w-full">
            <label className="block uppercase tracking-widest text-[11px] font-black mb-2 text-gray-500">
              Mot de passe
            </label>
            <input
              className="w-full shadow-inner p-4 border border-gray-200 bg-[#FAF9F6] focus:ring-1 focus:ring-black outline-none transition-all"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <div className="text-right mt-2">
              <a
                href="/forgot-password"
                className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition border-b border-transparent hover:border-black pb-1"
              >
                mot de passe oublié ?
              </a>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D3748] hover:bg-black text-white uppercase tracking-[0.3em] text-xs font-bold py-5 px-12 transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginView;