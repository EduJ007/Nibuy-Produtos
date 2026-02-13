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
  const [visibleCount, setVisibleCount] = useState(18);
  const loaderRef = useRef<HTMLDivElement>(null);

  // --- TIMER DE 24 HORAS ---
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeLeft({ h: 23 - now.getHours(), m: 59 - now.getMinutes(), s: 59 - now.getSeconds() });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const parsePrice = (pStr: string) => parseFloat(pStr.replace('R$', '').replace('.', '').replace(',', '.').trim());

  // --- FILTRO INTELIGENTE COM TODAS AS PALAVRAS-CHAVE ---
  const filteredProducts = useMemo(() => {
    const keywordsMap: Record<string, string[]> = {
      Eletrônicos: ['fone', 'caixa', 'bluetooth', 'm47', 'smartwatch', 'relo', 'carregador', 'cabo', 'usb', 'teclado', 'mouse', 'gamer', 'led', 'ring light', 'tripé', 'microfone', 'adaptador', 'tablet', 'celular', 'iphone', 'xiaomi', 'computador', 'monitor', 'headset', 'airpod', 'drone', 'projetor', 'magsafe', 'alexa', 'kindle', 'console'],
      Moda: ['camisa', 'tenis', 'tênis', 'polo', 'calça', 'moletom', 'vestido', 'sapato', 'meia', 'cueca', 'calcinha', 'sutiã', 'blusa', 'jaqueta', 'casaco', 'bermuda', 'short', 'saia', 'boné', 'chinelo', 'sandália', 'bolsa', 'mochila', 'carteira', 'óculos', 'pulseira', 'colar', 'brinco', 't-shirt', 'conjunto', 'jeans'],
      Cozinha: ['pipoqueira', 'fritadeira', 'air fryer', 'panela', 'pote', 'copo', 'garrafa', 'termica', 'tábua', 'faca', 'talher', 'prato', 'liquidificador', 'mixer', 'batedeira', 'sanduicheira', 'cafeteira', 'moedor', 'escorredor', 'organizador', 'balança', 'tempero', 'fogão', 'forma', 'processador', 'seladora', 'mini liquidificador', 'dispenser'],
      Casa: ['casa', 'decoração', 'luminária', 'tapete', 'almofada', 'cortina', 'quadro', 'espelho', 'limpeza', 'vassoura', 'mop', 'aspirador', 'prateleira', 'suporte', 'banheiro', 'quarto', 'sala', 'ferramenta', 'parafusadeira', 'furadeira', 'lâmpada', 'difusor', 'umidificador', 'cabide', 'estante', 'adesiva', 'papel de parede'],
      Beleza: ['maquiagem', 'rimel', 'batom', 'skincare', 'creme', 'perfume', 'shampoo', 'condicionador', 'cabelo', 'secador', 'prancha', 'escova', 'esponja', 'serum', 'protetor solar', 'base', 'pó', 'corretivo', 'paleta', 'unha', 'esmalte', 'cilio', 'sobrancelha', 'facial', 'corporal', 'gloss', 'massagem', 'depilador', 'barbeador']
    };

    return productsData.filter((p) => {
      const name = p.name.toLowerCase();
      const price = parsePrice(p.price);

      const matchesSearch = name.includes(searchTerm.toLowerCase());
      
      let matchesCategory = activeCategory === 'Todos';
      if (!matchesCategory && keywordsMap[activeCategory]) {
        matchesCategory = keywordsMap[activeCategory].some(key => name.includes(key));
      }

      const store = p.link?.includes('shopee') ? 'Shopee' : 'Outras';
      const matchesStore = activeStore === 'Todas' || store === activeStore;
      const matchesPrice = maxPrice === '' || price <= parseFloat(maxPrice);

      return matchesSearch && matchesCategory && matchesStore && matchesPrice;
    });
  }, [searchTerm, activeCategory, activeStore, maxPrice]);

useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Captura a busca da URL
    const searchFromUrl = params.get('search');
    if (searchFromUrl) {
      setSearchTerm(decodeURIComponent(searchFromUrl));
    }

    // Captura a categoria da URL
    const catFromUrl = params.get('cat');
    if (catFromUrl) {
      setActiveCategory(decodeURIComponent(catFromUrl));
    }

    // Se veio algo, faz o scroll para os produtos
    if (searchFromUrl || catFromUrl) {
      window.scrollTo({ top: 450, behavior: 'smooth' });
    }
  }, []);
  
  useEffect(() => {
  // 1. Pega os parâmetros da URL (ex: ?cat=Gamer)
  const params = new URLSearchParams(window.location.search);
  const categoriaDaUrl = params.get('cat');

  // 2. Se existir uma categoria na URL, a gente ativa ela no filtro
  if (categoriaDaUrl) {
    // Verifica se a categoria existe na sua lista (opcional, mas bom)
    setActiveCategory(categoriaDaUrl);
    
    // Rola a página suavemente para os produtos
    window.scrollTo({ top: 500, behavior: 'smooth' });
  }
}, []); // Executa apenas uma vez quando o site abre

  // --- LÓGICA DO CARREGAMENTO INFINITO ---
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

  // Reseta o scroll quando o filtro muda
  useEffect(() => {
    setVisibleCount(18);
  }, [searchTerm, activeCategory, activeStore, maxPrice]);

  const flashSales = useMemo(() => productsData.filter(p => p.isFlashSale).slice(0, 10), []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-200"> 
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
                <h2 className="text-white text-2xl font-black italic uppercase leading-none">Ofertas Relâmpago</h2>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Timer size={12} className="text-[#ff5722]" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Expira em:</p>
                </div>
              </div>
            </div>

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
              🔥 Descobertas do <span className="text-[#ff5722]">Dia</span>
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

        {/* LOADER DO CARREGAMENTO INFINITO - Corrigido */}
        <div ref={loaderRef} className="h-40 flex items-center justify-center w-full mt-8">
          {visibleCount < filteredProducts.length ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#ff5722]"></div>
              <p className="text-[#ff5722] font-black text-[10px] uppercase tracking-widest">Buscando mais ofertas...</p>
            </div>
          ) : (
            <p className="text-gray-400 font-bold italic text-sm">Fim dos achados de hoje! 🏁</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;