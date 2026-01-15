import React from 'react';
import { Search, Tag, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, searchTerm }) => {
  
  const handleGoToOffers = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-[#ff5722] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* LOGO NIBUY */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <img 
              src="/logo-nibuy.png" 
              alt="Nibuy Logo" 
              className="h-12 w-12 object-contain bg-white  p-1" 
            />
            <span className="text-3xl font-black italic uppercase tracking-tighter">𝙉𝙞𝙗𝙪𝙮</span>
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="flex-grow max-w-2xl relative group">
            <input
              type="text"
              placeholder="Pesquisar nos achados do Nibuy..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-2.5 pl-12 pr-4 text-white placeholder:text-white/70 focus:bg-white focus:text-gray-900 focus:outline-none transition-all duration-300 font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-[#ff5722]" size={20} />
          </div>

          {/* LINKS DE NAVEGAÇÃO */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* BOTÃO OFERTAS (ESTADO ATIVO) */}
            <button 
              onClick={handleGoToOffers}
              className="flex items-center gap-2 bg-white text-[#ff5722] px-5 py-2.5 rounded-xl transition-all duration-300 font-black text-xs uppercase shadow-md border-2 border-white"
            >
              <Tag size={16} />
              Ofertas
            </button>

            <a 
              href="https://nibuy-about-us.vercel.app/" 
              target="_blank" 
              className="hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              Sobre Nós <ExternalLink size={12} className="opacity-50" />
            </a>

            <a 
              href="https://nibuy-help-center.vercel.app/" 
              target="_blank" 
              className="hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              Ajuda <ExternalLink size={12} className="opacity-50" />
            </a>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;