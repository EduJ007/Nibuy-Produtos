import React, { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react'; // Ícone de tendência

const categories = [
  'Todos', 'Moda & Beleza', 'Tecnologia & Eletrônicos', 'Casa & Decoração',
  'Games & Hobby', 'Bebês & Infantil', 'Automotivo', 'Esporte & Lazer',
  'Pets', 'Eletrodomésticos', 'Móveis', 'Iluminação', 'Papelaria & Escritório',
  'Ferramentas & Construção', 'Segurança & Monitoramento', 'Relógios & Acessórios',
  'Joias & Bijuterias', 'Livros & Educação', 'Viagem & Malas'
];

const stores = ['Todas', 'Shopee', 'Mercado Livre', 'Amazon', 'Magalu'];

// Opções de ordenação
const sortOptions = [
  { label: 'Padrão', value: 'default' },
  { label: 'Mais Vendidos 🔥', value: 'sales' },
  { label: 'Menor Preço 💸', value: 'price_asc' }
];

interface FilterBarProps {
  activeCategory: string; onSelectCategory: (c: string) => void;
  activeStore: string; onSelectStore: (s: string) => void;
  maxPrice: string; onMaxPriceChange: (p: string) => void;
  sortBy: string; onSortChange: (s: string) => void; // Nova prop
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  activeCategory, onSelectCategory, activeStore, onSelectStore, maxPrice, onMaxPriceChange, sortBy, onSortChange 
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat) onSelectCategory(cat);
  }, []);

  // Função para pegar o label do sort ativo
  const activeSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Padrão';

  return (
    <div className="flex flex-wrap justify-center items-start gap-4 md:gap-6 mb-10 w-full max-w-[1300px] mx-auto">
      
      {/* CATEGORIA */}
      <div className="flex flex-col items-center w-full sm:w-[220px]">
        <span className="text-sm font-black text-black uppercase tracking-tighter mb-2">Categoria</span>
        <div className="relative w-full">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'cat' ? null : 'cat')}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:border-[#ff5722] transition-all shadow-sm"
          >
            <span className="truncate">{activeCategory}</span>
            <ChevronDown size={16} className={`transition-transform ${openDropdown === 'cat' ? 'rotate-180' : ''}`} />
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

      {/* LOJA */}
      <div className="flex flex-col items-center w-full sm:w-[220px]">
        <span className="text-sm font-black text-black uppercase tracking-tighter mb-2">Loja</span>
        <div className="relative w-full">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'store' ? null : 'store')}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:border-[#ff5722] transition-all shadow-sm"
          >
            <span className="truncate">{activeStore}</span>
            <ChevronDown size={16} className={`transition-transform ${openDropdown === 'store' ? 'rotate-180' : ''}`} />
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

      {/* ORDENAR POR (MAIS VENDIDOS) */}
      <div className="flex flex-col items-center w-full sm:w-[220px]">
        <span className="text-sm font-black text-black uppercase tracking-tighter mb-2">Ordenar</span>
        <div className="relative w-full">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-700 hover:border-orange-500 transition-all shadow-sm"
          >
            <span className="truncate">{activeSortLabel}</span>
            <TrendingUp size={16} className="text-orange-500" />
          </button>
          {openDropdown === 'sort' && (
            <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-2xl z-50 p-2">
              {sortOptions.map(opt => (
                <button key={opt.value} onClick={() => { onSortChange(opt.value); setOpenDropdown(null); }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold uppercase mb-1 transition-all ${sortBy === opt.value ? 'bg-orange-500 text-white' : 'hover:bg-gray-50 text-gray-500'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PREÇO */}
      <div className="flex flex-col items-center w-full sm:w-[220px]">
        <span className="text-sm font-black text-black uppercase tracking-tighter mb-2">Preço Máximo</span>
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs">R$</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Ex: 50"
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-[#ff5722] transition-all shadow-sm text-sm"
          />
        </div>
      </div>

    </div>
  );
};

export default FilterBar;