import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const categories = ['Todos', 'Eletrônicos', 'Moda', 'Casa', 'Cozinha', 'Beleza', 'Saúde', 'Acessórios', 'Ferramentas', 'Ofertas Relâmpago'];
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
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 w-full">
      
      {/* DROPDOWN: CATEGORIAS */}
      <div className="relative w-full md:w-64 flex flex-col items-center">
        <span className="text-lg font-black text-black uppercase tracking-tighter mb-2 text-center">
          Categorias
        </span>
        <button 
          onClick={() => setOpenDropdown(openDropdown === 'cat' ? null : 'cat')}
          className="w-full flex items-center justify-between px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:border-[#ff5722] transition-all shadow-sm"
        >
          <span className="truncate">{activeCategory}</span>
          <ChevronDown size={18} className={`flex-shrink-0 transition-transform ${openDropdown === 'cat' ? 'rotate-180' : ''}`} />
        </button>
        {openDropdown === 'cat' && (
          <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2 animate-in fade-in zoom-in duration-200">
            {categories.map(cat => (
              <button key={cat} onClick={() => { onSelectCategory(cat); setOpenDropdown(null); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase mb-1 transition-all ${activeCategory === cat ? 'bg-[#ff5722] text-white' : 'hover:bg-gray-50 text-gray-500'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DROPDOWN: LOJAS */}
      <div className="relative w-full md:w-64 flex flex-col items-center">
        <span className="text-lg font-black text-black uppercase tracking-tighter mb-2 text-center">
          Lojas
        </span>
        <button 
          onClick={() => setOpenDropdown(openDropdown === 'store' ? null : 'store')}
          className="w-full flex items-center justify-between px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:border-[#ff5722] transition-all shadow-sm"
        >
          <span className="truncate">{activeStore}</span>
          <ChevronDown size={18} className={`flex-shrink-0 transition-transform ${openDropdown === 'store' ? 'rotate-180' : ''}`} />
        </button>
        {openDropdown === 'store' && (
          <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in duration-200">
            {stores.map(s => (
              <button key={s} onClick={() => { onSelectStore(s); setOpenDropdown(null); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase mb-1 transition-all ${activeStore === s ? 'bg-[#ff5722] text-white' : 'hover:bg-gray-50 text-gray-500'}`}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* INPUT: PREÇO (Centralizado também) */}
      <div className="relative w-full md:w-64 flex flex-col items-center">
        <span className="text-lg font-black text-black uppercase tracking-tighter mb-2 text-center">
          Preço
        </span>
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-sm">R$</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Ex: 50"
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-800 focus:outline-none focus:border-[#ff5722] transition-all shadow-sm placeholder:text-gray-300"
          />
        </div>
      </div>

    </div>
  );
};

export default FilterBar;