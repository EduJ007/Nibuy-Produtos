import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import GeminiRecommendation from './components/GeminiRecommendation';
import Footer from './components/footer';
import PageLoader from "./components/PageLoader";
import { productsData } from './products';

// ------------------ FUNÇÕES AUXILIARES ------------------
const parseSales = (sold: string) => {
  if (!sold) return 0;
  return parseInt(sold.replace(/\D/g, '')) || 0;
};

const parsePrice = (price: string | number) => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  // Remove tudo que não é número, ponto ou vírgula, e trata a vírgula brasileira
  const cleanPrice = price.toString().replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
  return parseFloat(cleanPrice) || 0;
};

// ------------------ APP ------------------
const App: React.FC = () => {
  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeStore, setActiveStore] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('default');
  const [onlyFlash, setOnlyFlash] = useState(false);

  // Estados de Dados e Loading
  const [flashProducts, setFlashProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24;

  // 1. Setup Inicial e Flash Sales
  useEffect(() => {
    const flash = productsData
      .filter(p => p.isFlashSale)
      .slice(0, 6);
    setFlashProducts(flash);

    setTimeout(() => setLoading(false), 1000);
  }, []);

  // 2. Timer Brasília
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 59, 999);
      
      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Lógica de Filtro
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    // Filtro por termo de busca
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filtro por Categoria
    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.category === activeCategory);
    }

    // --- CORREÇÃO AQUI: FILTRO DE PREÇO ---
    if (maxPrice && maxPrice > 0) {
      result = result.filter(p => parsePrice(p.price) <= maxPrice);
    }

    // Filtro Flash Sale
    if (onlyFlash || sortBy === 'flash') {
      result = result.filter(p => p.isFlashSale);
    }

    // --- CORREÇÃO AQUI: SORT E RECOMENDADOS ---
    if (sortBy === 'recomend') {
      result = result
        .filter(p => (p.rating || 0) >= 4.0) // Reduzi de 4.5 para 4.0 para aparecerem mais itens
        .sort((a, b) => parseSales(b.sold) - parseSales(a.sold));
    } else if (sortBy === 'deals') {
      result = result
        .filter(p => parsePrice(p.price) <= 100) // Ajustado para achadinhos ate 100 reais
        .sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === 'sales') {
      result.sort((a, b) => parseSales(b.sold) - parseSales(a.sold));
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }

    return result;
    // Adicionei maxPrice nas dependências para o React perceber a mudança
  }, [searchTerm, activeCategory, onlyFlash, sortBy, maxPrice]);
  // Resetar página ao filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, sortBy, maxPrice]);

  // 4. Cálculos de Paginação
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const pagesPerGroup = 5;
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
  };

  return (
      <div className="min-h-screen bg-gray-200">
        <Navbar onSearch={setSearchTerm} />

        <main className="pt-24 pb-20 px-4 max-w-[1630px] mx-auto">
          
          {/* SEÇÃO OFERTA RELÂMPAGO */}
          <section className="bg-white mt-6 w-full rounded-2xl shadow-sm border border-gray-300 overflow-hidden mb-12">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-gray-50">
              <h2 className="text-[#ff5722] text-2xl font-bold">⚡ Ofertas  Relâmpago</h2>
              <div className="flex items-center gap-2">
                {[timeLeft.h, timeLeft.m, timeLeft.s].map((unit, i) => (
                  <React.Fragment key={i}>
                    <div className="bg-black text-white px-3 py-2 rounded-md font-bold text-sm">
                      {unit.toString().padStart(2, "0")}
                    </div>
                    {i < 2 && <span className="font-bold text-gray-600">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

           <div className="p-6">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {flashProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="min-w-[240px] bg-white rounded-2xl p-2 shadow-md border border-gray-100 transition-all hover:border-[#ff5722] hover:shadow-lg cursor-pointer"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <GeminiRecommendation products={filteredProducts} />

          {/* FILTROS */}
          <div id="filtros" className="mt-12">
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
          </div>

          {/* GRID DE PRODUTOS */}
          <div id="produtos" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-8">
            {pageLoading ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <PageLoader />
              </div>
            ) : (
              visibleProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-xl p-2 border border-transparent transition-all hover:border-[#ff5722] hover:shadow-md cursor-pointer"
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>

          {/* PAGINAÇÃO */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#ff5722] text-white rounded-lg disabled:hidden"
              >
                ❮
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                    currentPage === page ? "bg-[#ff5722] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#ff5722] text-white rounded-lg disabled:opacity-40"
              >
                ❯
              </button>
            </div>
          )}
        </main>

        <Footer />
      </div>
  );
};

export default App;