import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import GeminiRecommendation from './components/GeminiRecommendation';
import Footer from './components/footer';
import { productsData } from './products';
import { Timer } from 'lucide-react';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeStore, setActiveStore] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyFlash, setOnlyFlash] = useState(false); // ⭐ NOVO
  const [visibleCount, setVisibleCount] = useState(18);
  const loaderRef = useRef<HTMLDivElement>(null);

  const shuffledProducts = useMemo(() => {
    return [...productsData].sort(() => Math.random() - 0.5);
  }, []);

  // --- TIMER ---
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeLeft({
        h: 23 - now.getHours(),
        m: 59 - now.getMinutes(),
        s: 59 - now.getSeconds(),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const parsePrice = (pStr: string) =>
    parseFloat(pStr.replace('R$', '').replace('.', '').replace(',', '.').trim());

  // --- FILTRO PRINCIPAL ---
  const filteredProducts = useMemo(() => {
    const keywordsMap: Record<string, string[]> = {
      "Tecnologia": ["fone", "bluetooth", "tablet", "monitor", "drone", "projetor"],
      "Moda": ["camisa", "tenis", "tênis", "calça", "vestido", "sapato"],
      "Casa": ["tapete", "cortina", "almofada", "luminária", "decoração"],
      "Gamer": ["mouse", "teclado", "console", "playstation", "xbox"],
    };

    return shuffledProducts.filter((p) => {
      const name = p.name.toLowerCase();
      const price = parsePrice(p.price);

      const matchesSearch = name.includes(searchTerm.toLowerCase());

      let matchesCategory = activeCategory === 'Todos';
      if (!matchesCategory && keywordsMap[activeCategory]) {
        matchesCategory = keywordsMap[activeCategory].some((key) =>
          name.includes(key)
        );
      }

      const store = p.link?.includes('shopee') ? 'Shopee' : 'Outras';
      const matchesStore = activeStore === 'Todas' || store === activeStore;

      const matchesPrice =
        maxPrice === '' || price <= parseFloat(maxPrice);

      const matchesFlash = !onlyFlash || p.isFlashSale; // ⭐ NOVO

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStore &&
        matchesPrice &&
        matchesFlash
      );
    });
  }, [searchTerm, activeCategory, activeStore, maxPrice, onlyFlash]);

  // --- SCROLL INFINITO ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredProducts.length
        ) {
          setVisibleCount((prev) => prev + 12);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [filteredProducts, visibleCount]);

  useEffect(() => {
    setVisibleCount(18);
  }, [searchTerm, activeCategory, activeStore, maxPrice, onlyFlash]);

  // --- OFERTAS RELÂMPAGO (random a cada reload) ---
  const flashSales = useMemo(() => {
    return [...productsData]
      .filter((p) => p.isFlashSale)
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Navbar onSearch={setSearchTerm} searchTerm={searchTerm} />

      <main className="flex-grow max-w-[1600px] mx-auto px-4 py-8 w-full">

        {/* OFERTAS RELÂMPAGO */}
        <section className="mb-12 bg-gray-900 p-6 rounded-3xl shadow-2xl">
          <div className="flex justify-between mb-6">
            <h2 className="text-white text-2xl font-black italic uppercase">
              ⚡ Ofertas Relâmpago
            </h2>

            <div className="flex items-center gap-2">
              {[timeLeft.h, timeLeft.m, timeLeft.s].map((unit, i) => (
                <div key={i} className="bg-[#ff5722] text-white px-3 py-2 rounded-lg font-black">
                  {unit.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto">
            {flashSales.map((product) => (
              <div key={product.id} className="min-w-[200px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <GeminiRecommendation products={filteredProducts} />

        {/* TÍTULO */}
        <h1 className="text-3xl font-black text-gray-900 mb-6 mt-10">
          🔥 Descobertas do Dia
        </h1>

        {/* FILTROS */}
        <div className="flex flex-wrap items-center gap-4 mb-6">

          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            activeStore={activeStore}
            onSelectStore={setActiveStore}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
          />

          {/* ⭐ CHECKBOX OFERTA */}
          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow cursor-pointer font-bold">
            <input
              type="checkbox"
              checked={onlyFlash}
              onChange={() => setOnlyFlash(!onlyFlash)}
              className="w-4 h-4 accent-[#ff5722]"
            />
            ⚡ Só ofertas relâmpago
          </label>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* LOADER */}
        <div ref={loaderRef} className="h-40 flex items-center justify-center">
          {visibleCount < filteredProducts.length ? (
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#ff5722]"></div>
          ) : (
            <p className="text-gray-400 font-bold">Fim dos achados 🏁</p>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default App;
