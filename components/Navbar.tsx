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
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-center h-20 gap-x-6 md:gap-x-12">

          {/* LOGO — HOVER COM ESCALA SUTIL */}
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0 group transition-transform duration-300 hover:scale-105"
            onClick={() => window.location.reload()}
          >
            <img
              src="/logo-nibuy.png"
              alt="Nibuy Logo"
              className="h-12 w-12 object-contain bg-white rounded-[4px] shadow-sm transition-shadow duration-300 group-hover:shadow-md"
            />
            <span className="text-2xl font-black hidden sm:block">
              𝙉𝙞𝙗𝙪𝙮
            </span>
          </div>

          {/* BUSCA — HOVER COM MUDANÇA DE BORDA E COR */}
          <div className="relative w-[320px] md:w-[450px] group">
            <input
              type="text"
              placeholder="Buscar achados..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-2 px-10 text-white placeholder:text-white/70 focus:bg-white focus:text-gray-900 focus:outline-none transition-all duration-300 font-medium text-sm group-hover:border-white/50"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 transition-colors duration-300 group-focus-within:text-[#ff5722]"
              size={18}
            />
          </div>

          {/* DIREITA — HOVER NOS LINKS E BOTÃO */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            {/* BOTÃO OFERTAS — ELEVAÇÃO E BRILHO */}
            <button
              onClick={handleGoToOffers}
              className="flex items-center gap-2 bg-white text-[#ff5722] px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-md border-2 border-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              <Tag size={14} />
              <span>Ofertas</span>
            </button>

            <div className="flex items-center gap-4">
              {/* LINKS SOBRE/AJUDA — OPACIDADE E MUDANÇA DE COR */}
              <a
                href="https://nibuy-about-us.vercel.app/"
                target="_blank"
                className="opacity-80 hover:opacity-100 hover:text-black transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-1 group"
              >
                Sobre <ExternalLink size={10} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              <a
                href="https://nibuy-help-center.vercel.app/"
                target="_blank"
                className="opacity-80 hover:opacity-100 hover:text-black transition-all duration-300 text-[11px] font-black uppercase tracking-widest flex items-center gap-1 group"
              >
                Ajuda <ExternalLink size={10} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;