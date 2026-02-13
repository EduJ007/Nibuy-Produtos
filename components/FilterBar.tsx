import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const categories = ['Todos', 'Eletrodomésticos', 'Moda', 'Beleza', 'Casa', 'Gamer', 
  'Pets', 'Esporte', 'Brinquedos', 'Celulares', 'Relógios', 
  'Tecnologia', 'Calçados', 'Saúde', 'Cozinha', 'Papelaria', 
  'Acessórios', 'Joias', 'Bebês', 'Ferramentas', 'Livros']
const stores = ['Todas', 'Shopee', 'Mercado Livre', 'Amazon', 'Magalu'];

interface FilterBarProps {
  activeCategory: string; onSelectCategory: (c: string) => void;
  activeStore: string; onSelectStore: (s: string) => void;
  maxPrice: string; onMaxPriceChange: (p: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  activeCategory, onSelectCategory, activeStore, onSelectStore, maxPrice, onMaxPriceChange 
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    // Ajustado para flex-wrap e centralização
    <div className="flex flex-wrap justify-center items-start gap-4 md:gap-8 mb-12 w-full max-w-[1200px] mx-auto">
      
      {/* COLUNA: CATEGORIAS */}
      <div className="flex flex-col items-center w-full sm:w-[280px]">
        <span className="text-base font-black text-black uppercase tracking-tighter mb-2">
          Categoria
        </span>
        <div className="relative w-full">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'cat' ? null : 'cat')}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:border-[#ff5722] transition-all shadow-sm"
          >
            <span className="truncate">{activeCategory}</span>
            <ChevronDown size={18} className={`flex-shrink-0 transition-transform ${openDropdown === 'cat' ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown === 'cat' && (
            <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => { onSelectCategory(cat); setOpenDropdown(null); }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold uppercase mb-1 transition-all ${activeCategory === cat ? 'bg-[#ff5722] text-white' : 'hover:bg-gray-50 text-gray-500'}`}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COLUNA: LOJAS */}
      <div className="flex flex-col items-center w-full sm:w-[280px]">
        <span className="text-base font-black text-black uppercase tracking-tighter mb-2">
          Loja
        </span>
        <div className="relative w-full">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'store' ? null : 'store')}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:border-[#ff5722] transition-all shadow-sm"
          >
            <span className="truncate">{activeStore}</span>
            <ChevronDown size={18} className={`flex-shrink-0 transition-transform ${openDropdown === 'store' ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown === 'store' && (
            <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-2xl z-50 p-2">
              {stores.map(s => (
                <button key={s} onClick={() => { onSelectStore(s); setOpenDropdown(null); }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold uppercase mb-1 transition-all ${activeStore === s ? 'bg-[#ff5722] text-white' : 'hover:bg-gray-50 text-gray-500'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COLUNA: PREÇO */}
      <div className="flex flex-col items-center w-full sm:w-[280px]">
        <span className="text-base font-black text-black uppercase tracking-tighter mb-2">
          Preço
        </span>
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">R$</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Ex: 50"
            className="w-full pl-12 pr-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#ff5722] transition-all shadow-sm placeholder:text-gray-300"
          />
        </div>
      </div>

    </div>
  );
};

export default FilterBar;