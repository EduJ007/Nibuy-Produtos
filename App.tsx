import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import GeminiRecommendation from './components/GeminiRecommendation';
import { productsData } from './products';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeStore, setActiveStore] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState('');
  const [visibleCount, setVisibleCount] = useState(18);
  const loaderRef = useRef(null);

  const parsePrice = (pStr: string) => parseFloat(pStr.replace('R$', '').replace('.', '').replace(',', '.').trim());

  // Separa as ofertas relâmpago para o topo
  const flashSales = useMemo(() => productsData.filter(p => p.isFlashSale).slice(0, 10), []);

  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      const price = parsePrice(p.price);
      const name = p.name.toLowerCase();
      
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      
      let category = 'Outros';
      if (name.includes('fone') || name.includes('caixa') || name.includes('bluetooth') || name.includes('m47')) category = 'Eletrônicos';
      else if (name.includes('camisa') || name.includes('polo') || name.includes('tenis') || name.includes('calçado')) category = 'Moda';
      else if (name.includes('kit') || name.includes('casa') || name.includes('cozinha')) category = 'Casa';
      else if (name.includes('sabonete') || name.includes('creme') || name.includes('beleza')) category = 'Beleza';
      else if (name.includes('relogio') || name.includes('acessório')) category = 'Acessórios';

      const matchesCategory = activeCategory === 'Todos' || category === activeCategory;
      const store = p.link?.includes('shopee') ? 'Shopee' : 'Outras';
      const matchesStore = activeStore === 'Todas' || store === activeStore;
      const matchesPrice = maxPrice === '' || price <= parseFloat(maxPrice);

      // Não mostramos no feed principal o que já está no destaque de relâmpago se quiser evitar repetição
      return matchesSearch && matchesCategory && matchesStore && matchesPrice;
    });
  }, [searchTerm, activeCategory, activeStore, maxPrice]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
        setVisibleCount(prev => prev + 12);
      }
    }, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar onSearch={setSearchTerm} searchTerm={searchTerm} />
      
      <main className="flex-grow max-w-[1600px] mx-auto px-4 py-8">
        
        {/* SEÇÃO DE OFERTAS RELÂMPAGO (No topo de tudo) */}
        <section className="mb-12 bg-gray-900 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#ff5722] p-2 rounded-lg animate-pulse">
              <span className="text-white text-xl">⚡</span>
            </div>
            <div>
              <h2 className="text-white text-2xl font-black italic uppercase">Ofertas Relâmpago</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Preços baixos por tempo limitado</p>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {flashSales.map(product => (
              <div key={product.id} className="min-w-[180px] sm:min-w-[220px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <GeminiRecommendation products={filteredProducts} />

        {/* FILTROS E FEED PRINCIPAL */}
        <div className="mt-12 mb-8">
           <h1 className="text-3xl font-black text-gray-900 italic uppercase">
              🔥 Achados do <span className="text-[#ff5722]">Dia</span>
           </h1>
        </div>

        <FilterBar 
          activeCategory={activeCategory} onSelectCategory={setActiveCategory}
          activeStore={activeStore} onSelectStore={setActiveStore}
          maxPrice={maxPrice} onMaxPriceChange={setMaxPrice}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div ref={loaderRef} className="h-20 flex items-center justify-center">
          {visibleCount < filteredProducts.length && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5722]"></div>
          )}
        </div>
      </main>

      <footer className="bg-white py-12 text-center border-t border-gray-100 mt-20 font-black italic text-3xl text-[#ff5722]">𝙉𝙞𝙗𝙪𝙮</footer>
    </div>
  );
};

export default App;