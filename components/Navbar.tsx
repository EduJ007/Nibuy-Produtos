import React from 'react';
import { Search } from 'lucide-react';

interface NavbarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, searchTerm }) => {
  return (
    // Fundo Laranja Nibuy (#ff5722)
    <nav className="bg-[#ff5722] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center gap-6">
        
        {/* LOGO - Branca para destacar no fundo laranja */}
        <a href="https://nibuy-home-page.vercel.app/" className="flex items-center gap-2 shrink-0 group">
          <img 
            src="/logo-nibuy.png" 
            alt="Nibuy" 
            className="h-12 w-auto object-contain" // Deixa a logo branca
          />
          <span className="text-2xl font-black text-white">𝙉𝙞𝙗𝙪𝙮</span>
        </a>

        {/* BUSCA - Ajustada para o fundo laranja */}
        <div className="flex-grow max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-white/70" />
          </div>
          <input
            type="text"
            placeholder="O que você está procurando?"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-white/20 border border-white/30 rounded-full py-2.5 pl-12 pr-4 text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900 focus:outline-none transition-all duration-200 font-medium"
          />
        </div>

        {/* MENU DIREITO - Espaçamento corrigido */}
        <div className="hidden lg:flex items-center gap-10">
          
          {/* Links agrupados com um espaço moderado entre eles */}
          <div className="flex items-center gap-12"> 
            <a 
              href="https://nibuy-about-us.vercel.app/" 
              target="_blank" 
              className="text-[11px] font-black uppercase tracking-widest text-white hover:text-orange-100 transition-colors whitespace-nowrap"
            >
              Sobre Nós
            </a>

            <a 
              href="https://nibuy-help-center.vercel.app/" 
              target="_blank" 
              className="text-[11px] font-black uppercase tracking-widest text-white hover:text-orange-100 transition-colors whitespace-nowrap"
            >
              Central de ajuda
            </a>
          </div>

          {/* Botão com contraste no fundo laranja */}
          <a 
            href="https://nibuy-produtos.vercel.app/" 
            className="bg-white text-[#ff5722] px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-orange-50 transition-all shadow-lg active:scale-95"
          >
            Ver Ofertas
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;