import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logoSante from "../../assets/icons/Ministère_de_la_Santé_et_de_la_Prévention.png";
import { useAuth } from "../../hooks/useAuth";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="relative z-10 flex px-2 lg:px-0">
            <div className="flex shrink-0 items-center">
              <img
                className="h-10 w-auto"
                src={logoSante}
                alt="Ministère de la santé"
              />
            </div>
          </div>

          <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Recherche
              </label>

              <div className="relative flex items-stretch bg-[#EEEEEE] rounded-t-lg border-b-2 border-[#000091] overflow-hidden">
                <input
                  id="search"
                  name="search"
                  className="block w-full border-0 bg-transparent py-1.5 pl-4 pr-10 text-gray-700 placeholder:text-gray-500 focus:ring-0 sm:text-sm outline-none"
                  placeholder="Rechercher"
                  type="search"
                />

                <div className="flex items-center justify-center bg-[#000091] px-3 cursor-pointer hover:bg-blue-900 transition-colors">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
            <div className="relative ml-4 shrink-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-red-600 font-bold uppercase tracking-wider border border-red-100 hover:bg-red-50 rounded-md transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        <nav
          className="hidden lg:flex lg:space-x-8 lg:py-2"
          aria-label="Global"
        >
          <a
            href="#"
            className="bg-[#000091] text-white inline-flex items-center rounded-md py-2 px-3 text-sm font-medium"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-gray-900 hover:bg-gray-50 hover:text-[#000091] inline-flex items-center rounded-md py-2 px-3 text-sm font-medium"
          >
            Employés
          </a>
          <a
            href="#"
            className="text-gray-900 hover:bg-gray-50 hover:text-[#000091] inline-flex items-center rounded-md py-2 px-3 text-sm font-medium"
          >
            Fournisseurs
          </a>
        </nav>
      </div>

      <nav
        className="lg:hidden bg-gray-50 border-b border-gray-200"
        aria-label="Global"
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pb-3 pt-2">
          <a
            href="#"
            className="bg-[#000091] text-white block rounded-md py-2 px-3 text-base font-medium"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-gray-900 hover:bg-blue-50 block rounded-md py-2 px-3 text-base font-medium"
          >
            Employés
          </a>
        </div>
        <div className="border-t border-gray-200 pb-3 pt-4 px-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <img
                className="h-10 w-10 rounded-full border border-gray-300"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profil"
              />
            </div>
            <div className="ml-3">
              <div className="text-sm font-bold text-gray-800">Admin</div>
              <div className="text-xs text-gray-500">admin@sante.gouv.fr</div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;