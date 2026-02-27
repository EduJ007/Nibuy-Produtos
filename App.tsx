import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import GeminiRecommendation from './components/GeminiRecommendation';
import Footer from './components/footer';
import { productsData } from './products';

// --- FUNÇÕES DE CONVERSÃO (Ficam fora do componente) ---
const parseSales = (sold: string) => {
  if (!sold) return 0;
  let res = sold.toLowerCase().replace('+', '').replace(/\s/g, '');
  if (res.includes('mil')) {
    return parseFloat(res.replace('mil', '').replace(',', '.')) * 1000;
  }
  return parseFloat(res.replace(',', '.')) || 0;
};

const parsePrice = (price: string) => {
  if (!price) return 0;
  return parseFloat(price.replace('R$', '').replace(/\./g, '').replace(',', '.')) || 0;
};

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeStore, setActiveStore] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default'); 
  const [onlyFlash, setOnlyFlash] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);
  const loaderRef = useRef<HTMLDivElement>(null);

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

  // --- FILTRO E ORDENAÇÃO PRINCIPAL ---
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    // 1. Busca
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // 2. Categoria
    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.category === activeCategory);
    }

    // 3. Loja
    if (activeStore !== 'Todas') {
      result = result.filter(p => p.link?.toLowerCase().includes(activeStore.toLowerCase()));
    }

    // 4. Preço Máximo
    if (maxPrice) {
      result = result.filter(p => parsePrice(p.price) <= parseFloat(maxPrice));
    }

    // 5. Ofertas Relâmpago
    if (onlyFlash) {
      result = result.filter(p => p.isFlashSale);
    }

    // 6. ORDENAÇÃO (O que você queria!)
    if (sortBy === 'sales') {
      result.sort((a, b) => parseSales(b.sold) - parseSales(a.sold));
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else {
      // Padrão: Ordem aleatória estável baseada no ID para não ficar pulando
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [searchTerm, activeCategory, activeStore, maxPrice, onlyFlash, sortBy]);

  // --- SCROLL INFINITO ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount((prev) => prev + 12);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [filteredProducts, visibleCount]);

  // Resetar contagem ao filtrar
  useEffect(() => {
    setVisibleCount(18);
  }, [searchTerm, activeCategory, activeStore, maxPrice, onlyFlash, sortBy]);

  // Ofertas Relâmpago para a seção de cima
  const flashSales = useMemo(() => {
    return [...productsData]
      .filter((p) => p.isFlashSale)
      .sort(() => Math.random() - 0.5)
      .slice(0, 15);
  }, []);

  useEffect(() => {
  // Captura os parâmetros da URL
  const params = new URLSearchParams(window.location.search);
  const sort = params.get('sort');
  const official = params.get('official');

  // Se na URL tiver ?sort=sales, muda o estado de ordenação
  if (sort) {
    setSortBy(sort);
  }

  // Se na URL tiver ?official=true, podemos ativar um filtro de oficiais
  // (Ou você pode setar para uma loja específica se preferir)
  if (official === 'true') {
    setActiveStore('Shopee'); // Exemplo: Lojas oficiais geralmente estão na Shopee/ML
    // Se você tiver o campo isOfficial nos dados, pode criar um setOnlyOfficial(true)
  }

  // Se o link tiver #produtos, ele desce a tela suavemente
  if (window.location.hash === '#produtos') {
    const element = document.getElementById('produtos');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }
}, [window.location.search, window.location.hash]); // Roda sempre que a URL mudar

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar onSearch={setSearchTerm} />
      
      <main className="pt-24 pb-20 px-4 max-w-[1700px] mx-auto">
        
        {/* SEÇÃO FLASH SALES */}
        <section className="relative mb-12 p-6 rounded-3xl bg-gray-900 overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 gap-3">
              <h2 className="text-white text-xl md:text-3xl font-black italic uppercase italic">
                ⚡ Ofertas Relâmpago
              </h2>
              <div className="flex gap-2">
                {[timeLeft.h, timeLeft.m, timeLeft.s].map((unit, i) => (
                  <div key={i} className="bg-white text-[#ff5722] px-3 py-2 rounded-lg font-black shadow-md">
                    {unit.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {flashSales.map((product) => (
                <div key={product.id} className="min-w-[240px] bg-white rounded-2xl p-2 shadow-lg">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <GeminiRecommendation products={filteredProducts} />

        <h1 className="text-3xl font-black text-gray-900 mb-8 mt-12">🔥 Descobertas do Dia</h1>

        {/* BARRA DE FILTROS */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 bg-white p-4 rounded-2xl shadow-sm">
          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            activeStore={activeStore}
            onSelectStore={setActiveStore}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <label className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl cursor-pointer font-bold text-orange-600 border border-orange-100 hover:bg-orange-100 transition-colors">
            <input
              type="checkbox"
              checked={onlyFlash}
              onChange={() => setOnlyFlash(!onlyFlash)}
              className="w-4 h-4 accent-[#ff5722]"
            />
            ⚡ Ofertas Relâmpago
          </label>
        </div>

        {/* GRID DE PRODUTOS */}
        <div id="produtos" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* LOADER */}
        <div ref={loaderRef} className="h-40 flex items-center justify-center">
          {visibleCount < filteredProducts.length ? (
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#ff5722] border-r-transparent"></div>
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