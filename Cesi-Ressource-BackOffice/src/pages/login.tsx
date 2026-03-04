import React from 'react';

const LoginView: React.FC = () => {
  return (
   
    <div className="bg-[#FAF9F6] text-[#333] min-h-screen font-sans leading-normal flex items-center justify-center p-4">
      
      <section className="bg-white w-full max-w-xl p-8 sm:p-12 shadow-xl border border-gray-100 rounded-sm">
        
        <div className="w-full border-b border-gray-200 mb-10 pb-6 text-center">
          <h2 className="uppercase tracking-[0.3em] text-xl sm:text-2xl font-black ">
            Connexion
          </h2>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          
          <div className="w-full">
            <label className="block uppercase tracking-widest text-[11px] font-black mb-2 text-gray-500">
              Adresse Email
            </label>
            <input 
              className="w-full shadow-inner p-4 border border-gray-200 bg-[#FAF9F6] focus:ring-1 focus:ring-black outline-none transition-all" 
              type="email" 
              placeholder="admin@mon-projet.com"
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
            />
            <div className="mt-3 text-right">
              <a href="#" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-[#2D3748] hover:bg-black text-white uppercase tracking-[0.3em] text-xs font-bold py-5 px-12 transition-all shadow-lg active:scale-[0.98]"
            >
              Se Connecter
            </button>
          </div>
          
        </form>
      </section>
      
    </div>
  );
};

export default LoginView;