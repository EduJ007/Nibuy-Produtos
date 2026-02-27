import React from 'react';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const getStoreInfo = (link?: string) => {
    if (link?.includes('shopee')) return { name: 'Shopee', color: 'text-[#ee4d2d]' };
    if (link?.includes('mercadolivre')) return { name: 'Mercado Livre', color: 'text-[#333]' };
    if (link?.includes('amazon')) return { name: 'Amazon', color: 'text-[#232f3e]' };
    return { name: 'Loja', color: 'text-gray-500' };
  };

  const store = getStoreInfo(product.link);

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full relative">
      
      {/* Badge Discreta de Oferta Relâmpago */}
      {product.isFlashSale && (
        <div className="absolute top-2 right-2 z-20 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          ⚡ RELÂMPAGO
        </div>
      )}

      {/* Imagem com respiro (sem ficar gigante) */}
      <div className="aspect-square relative overflow-hidden bg-white p-4">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        {/* Loja e Oficial em texto simples */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`${store.color} text-[10px] font-black uppercase tracking-tight italic`}>
            {store.name}
          </span>
          {product.isOfficial && (
            <CheckCircle2 size={12} className="text-blue-500" />
          )}
        </div>

        {/* Nome do Produto - 2 linhas limpas */}
        <h3 className="text-gray-800 font-bold text-xs leading-tight line-clamp-2 mb-2 h-[32px]">
          {product.name}
        </h3>

        {/* Métricas Simplificadas (Rating e Vendas na mesma linha) */}
        <div className="flex items-center gap-2 mb-3 text-[11px]">
           <div className="flex items-center gap-0.5 text-yellow-500 font-bold">
              <Star size={12} fill="currentColor" />
              <span>{product.rating || '4.8'}</span>
           </div>
           <span className="text-gray-400">|</span>
           <span className="text-gray-500 font-medium">{product.sold} vendidos</span>
        </div>

        {/* Localização pequena e elegante */}
        <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-3">
          <MapPin size={10} />
          <span className="truncate">{product.location || 'Brasil'}</span>
        </div>
        
        {/* Preços */}
        <div className="mt-auto">
          {product.oldPrice && (
            <p className="text-gray-400 text-[10px] line-through font-medium">
              {product.oldPrice}
            </p>
          )}
          <p className="text-[#ff5722] text-xl font-black tracking-tighter">
            {product.price}
          </p>
        </div>

        {/* Botão Simples e Direto */}
        <a href={product.link} target="_blank" rel="noopener noreferrer" 
           className="mt-3 block w-full bg-[#ff5722] text-white text-[11px] font-bold py-2.5 rounded-lg text-center hover:brightness-110 transition-all uppercase">
          Comprar
        </a>
      </div>
    </div>
  );
};

export default ProductCard;