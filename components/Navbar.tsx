import React from 'react';
import { Search } from 'lucide-react';

interface NavbarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, searchTerm }) => {
  return (
    <nav className="bg-[#ff5722] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center gap-6">
        
        {/* LOGO */}
        <a
          href="https://nibuy-home-page.vercel.app/"
          className="flex items-center gap-2 shrink-0 group hover:scale-[1.02]"
        >
          <img
            src="/logo-nibuy.png"
            alt="Nibuy"
            className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-3xl font-black text-white">𝙉𝙞𝙗𝙪𝙮</span>
        </a>

        {/* BUSCA */}
        <div className="flex-grow max-w-md relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              size={20}
              className="text-gray-400 group-focus-within:text-[#ff5722] transition-colors duration-300"
            />
          </div>

          <input
            type="text"
            placeholder="O que você está procurando?"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="
              w-full
              bg-white
              border border-gray-300
              rounded-full
              py-3
              pl-12
              pr-6
              text-gray-900
              text-sm
              font-semibold
              placeholder:text-gray-400
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-white/70
              focus:border-white
              transition
            "
          />
        </div>

        {/* MENU DIREITO */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-8">
            
            <a
              href="https://nibuy-about-us.vercel.app/"
              target="_blank"
              className="text-[11px] text-white font-black uppercase tracking-widest opacity-90 hover:opacity-100 hover:underline transition"
            >
              Sobre Nós
            </a>

            <a
              href="https://nibuy-help-center.vercel.app/"
              target="_blank"
              className="text-[11px] text-white font-black uppercase tracking-widest opacity-90 hover:opacity-100 hover:underline transition"
            >
              Central de ajuda
            </a>
          </div>

          {/* BOTÃO */}
          <a
            href="https://nibuy-produtos.vercel.app/"
            className="
              bg-white
              text-[#ff5722]
              px-6
              py-2.5
              rounded-full
              text-xs
              font-black
              uppercase
              tracking-widest
              hover:bg-gray-100
              transition-all
              duration-300
              hover:scale-105
              shadow-md
              active:scale-95
            "
          >
            Ver Ofertas
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
