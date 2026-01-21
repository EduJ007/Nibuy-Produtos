import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import GeminiRecommendation from './components/GeminiRecommendation';
import Footer from './components/footer';
import { productsData } from './products';
import { Timer } from 'lucide-react'; // Importando o ícone corretamente

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeStore, setActiveStore] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState('');
  const [visibleCount, setVisibleCount] = useState(18);
  const loaderRef = useRef(null);

  // Lógica do Temporizador
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeLeft({
        h: 23 - now.getHours(),
        m: 59 - now.getMinutes(),
        s: 59 - now.getSeconds()
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const parsePrice = (pStr: string) => parseFloat(pStr.replace('R$', '').replace('.', '').replace(',', '.').trim());

  const flashSales = useMemo(() => productsData.filter(p => p.isFlashSale).slice(0, 10), []);

  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      const price = parsePrice(p.price);
      const name = p.name.toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || p.name.toLowerCase().includes(activeCategory.toLowerCase());
      const matchesStore = activeStore === 'Todas' || (activeStore === 'Shopee' && p.link?.includes('shopee'));
      const matchesPrice = maxPrice === '' || price <= parseFloat(maxPrice);
      return matchesSearch && matchesCategory && matchesStore && matchesPrice;
    });
  }, [searchTerm, activeCategory, activeStore, maxPrice]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]"> 
      <Navbar onSearch={setSearchTerm} searchTerm={searchTerm} />
      
      <main className="flex-grow max-w-[1600px] mx-auto px-4 py-8 w-full">
        
        {/* SEÇÃO OFERTAS RELÂMPAGO */}
        <section className="mb-12 bg-gray-900 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#ff5722] p-2 rounded-lg animate-pulse">
                <span className="text-white text-xl font-bold italic">⚡</span>
              </div>
              <div>
                <h2 className="text-white text-2xl font-black italic uppercase">Ofertas Relâmpago</h2>
                <div className="flex items-center gap-2 text-gray-400">
                  <Timer size={12} className="text-[#ff5722]" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Expira em:</p>
                </div>
              </div>
            </div>

            {/* RELÓGIO */}
            <div className="flex items-center gap-2">
              {[timeLeft.h, timeLeft.m, timeLeft.s].map((unit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="bg-[#ff5722] text-white font-black px-3 py-2 rounded-lg text-xl min-w-[45px] text-center">
                    {unit.toString().padStart(2, '0')}
                  </div>
                  {i < 2 && <span className="text-white font-black animate-pulse">:</span>}
                </div>
              ))}
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

        <div ref={loaderRef} className="h-10" />
      </main>

      <Footer />
    </div>
  );
};

export default App;