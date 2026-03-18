import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import Footer from './components/footer';
import PageLoader from "./components/PageLoader";
import StartScreen from "./components/StartScreen";
import { productsData } from './products';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

// ------------------ FUNÇÕES AUXILIARES ------------------
const parseSales = (sold: string | number) => {
  if (!sold) return 0;
  if (typeof sold === 'number') return sold;
  const cleanSold = sold.toLowerCase().trim().replace(/\./g, '');
  if (cleanSold.includes('k')) {
    const num = parseFloat(cleanSold.replace('k', '').replace(',', '.'));
    return num * 1000;
  }
  return parseInt(cleanSold.replace(/\D/g, '')) || 0;
};

const parsePrice = (price: string | number) => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  const cleanPrice = price.toString().replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
  return parseFloat(cleanPrice) || 0;
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeStore, setActiveStore] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState<any>('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // NOVO: Controle do Menu Mobile

  const productsPerPage = 24;

  // 1. Auth e URL Params
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    const params = new URLSearchParams(window.location.search);
    
    // Pega o termo de busca
    const searchFromUrl = params.get('search');
    if (searchFromUrl) setSearchTerm(decodeURIComponent(searchFromUrl));

    // Pega a ordenação (IMPORTANTE: Isso faz o "Recomendados", "Flash", etc funcionar)
    const sortFromUrl = params.get('sort');
    if (sortFromUrl) setSortBy(sortFromUrl);

    // Pega a categoria (caso venha de outro link)
    const catFromUrl = params.get('cat');
    if (catFromUrl) setActiveCategory(catFromUrl);

    return () => unsubscribe();
  }, []);

  // 2. Lógica de Filtro e Ordenação
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term));
    }
    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (activeStore !== 'Todas') {
      result = result.filter(p => p.store === activeStore);
    }
    if (maxPrice && maxPrice > 0) {
      result = result.filter(p => parsePrice(p.price) <= parseFloat(maxPrice));
    }

   if (sortBy !== 'default') {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'recomend':
            return (b.rating || 0) - (a.rating || 0);
          case 'deals': // Achadinhos (maior desconto em valor real)
            const discA = a.oldPrice ? (parsePrice(a.oldPrice) - parsePrice(a.price)) : 0;
            const discB = b.oldPrice ? (parsePrice(b.oldPrice) - parsePrice(b.price)) : 0;
            return discB - discA;
          case 'flash': // Ofertas Relâmpago (mesma lógica de achadinhos ou sua preferência)
            const flashA = a.oldPrice ? (parsePrice(a.oldPrice) - parsePrice(a.price)) : 0;
            const flashB = b.oldPrice ? (parsePrice(b.oldPrice) - parsePrice(b.price)) : 0;
            return flashB - flashA;
          case 'sales':
            return parseSales(b.sold) - parseSales(a.sold);
          case 'price_asc':
            return parsePrice(a.price) - parsePrice(b.price);
          default:
            return 0;
        }
      });
    }
    return result;
  }, [searchTerm, activeCategory, activeStore, sortBy, maxPrice]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeCategory, activeStore, sortBy, maxPrice]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const visibleProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const changePage = (page: number) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const resetFilters = () => {
    setActiveCategory('Todos');
    setActiveStore('Todas');
    setMaxPrice('');
    setSortBy('default');
    setIsFilterOpen(false);
  };

  if (loading) return <PageLoader />;
  if (!user) return <StartScreen />;

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar onSearch={setSearchTerm} />

      {/* OVERLAY PARA MOBILE (Escurece o fundo quando o filtro abre) */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <main className="flex flex-col md:flex-row min-h-screen w-full relative">
        
        {/* ASIDE / SIDEBAR ADAPTADA */}
        <aside className={`
          fixed inset-y-0 left-0 z-[70] w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:shadow-none md:z-10 md:w-72 lg:w-80 shrink-0 border-r border-gray-300
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Ajustado pt-32 para o título "Filtros" não sumir atrás da Navbar no Desktop */}
          <div className="sticky top-0 h-screen overflow-y-auto p-6 pt-32 md:pt-36">
            
            {/* Botão Fechar (Só Mobile) */}
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="md:hidden absolute top-24 right-4 text-gray-400 hover:text-[#ff5722]"
            >
              <span className="text-2xl font-bold">✕</span>
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#ff5722] rounded-full"></div>
              <h2 className="text-black font-black text-2xl uppercase tracking-tighter">
                Filtros
              </h2>
            </div>
            
            <FilterBar
              activeCategory={activeCategory}
              onSelectCategory={(c) => { setActiveCategory(c); setIsFilterOpen(false); }}
              activeStore={activeStore}
              onSelectStore={setActiveStore}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <div className="mt-10 pt-6 border-t border-gray-100">
              <button 
                onClick={resetFilters}
                className="w-full py-3 rounded-xl bg-gray-50 text-gray-500 font-bold hover:bg-[#ff5722] hover:text-white transition-all uppercase text-xs tracking-widest"
              >
                Limpar Tudo
              </button>
            </div>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <section className="flex-1 flex flex-col pt-24 md:pt-28 pb-20 px-4 md:px-10">
          
          <div className="mt-10 w-full max-w-[1400px] mx-auto">
            <div className="bg-white border-b-4 border-[#ff5722] py-5 mb-8 shadow-sm px-6 flex justify-center">
              <h2 className="text-[#ff5722] tracking-[0.15em] font-black text-lg md:text-xl uppercase italic">
                Lista de Produtos
              </h2>
            </div>
          </div>

          <div className="w-full max-w-[1400px] mx-auto flex-1">
            {pageLoading ? (
              <div className="flex justify-center items-center h-[50vh]">
                <PageLoader />
              </div>
            ) : (
              <>
                {filteredProducts.length > 0 ? (
                  <div id="produtos" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-7">
                    {visibleProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 italic text-gray-300 px-6 text-center">
                    <p className="font-bold text-xl">Nenhum produto por aqui...</p>
                    <button onClick={resetFilters} className="mt-4 text-[#ff5722] underline not-italic font-bold">Ver todos os produtos</button>
                  </div>
                )}
              </>
            )}

            {/* PAGINAÇÃO */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 md:gap-3 mt-20 mb-10">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-30"
                >
                  <span className="text-gray-400 font-bold">❮</span>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => changePage(page)}
                          className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg font-black text-sm transition-all shadow-md
                            ${currentPage === page ? 'bg-[#ff5722] text-white' : 'bg-white text-gray-600'}`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="text-gray-400 font-bold px-1">...</span>;
                    return null;
                  })}
                </div>

                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-30"
                >
                  <span className="text-gray-400 font-bold">❯</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* BOTÃO FLUTUANTE DE FILTRO (Só aparece no Mobile) */}
        <div className="md:hidden fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#ff5722] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black uppercase tracking-wider animate-bounce"
          >
            <span className="text-xl">🔍</span>
            Filtros
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;