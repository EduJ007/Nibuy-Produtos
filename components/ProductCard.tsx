import React from 'react';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const getStoreInfo = (link?: string) => {
    if (link?.includes('shopee')) return { name: 'Shopee', color: 'bg-[#ee4d2d] text-white border-[#ee4d2d]' };
    if (link?.includes('mercadolivre')) return { name: 'Mercado Livre', color: 'bg-[#fff159] text-[#333] border-[#333]' };
    if (link?.includes('amazon')) return { name: 'Amazon', color: 'bg-[#232f3e] text-white border-[#232f3e]' };
    return { name: 'Oferta', color: 'bg-white text-gray-900 border-gray-200' };
  };

  const store = getStoreInfo(product.link);

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      
      {/* Badge de Oferta Relâmpago */}
      {product.isFlashSale && (
        <div className="absolute top-3 right-3 z-20 bg-yellow-400 text-black text-[9px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-md border border-yellow-500 italic">
          ⚡ RELÂMPAGO
        </div>
      )}

      {/* Selo da Loja com Cor Específica */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`${store.color} text-[9px] font-black px-2 py-1 rounded border shadow-sm uppercase tracking-tighter`}>
          {store.name}
        </span>
      </div>

      <div className="aspect-square relative overflow-hidden bg-white p-4">
        <img src={product.img} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow border-t border-gray-50">
        <h3 className="text-gray-900 font-bold text-xs leading-snug line-clamp-2 mb-3 min-h-[32px]">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          {product.oldPrice && (
            <p className="text-gray-400 text-[10px] line-through font-bold mb-0.5">
              {product.oldPrice}
            </p>
          )}
          <p className="text-[#ff5722] text-xl font-black tracking-tighter">
            {product.price}
          </p>
        </div>

        <a href={product.link} target="_blank" rel="noopener noreferrer" 
           className="mt-4 block w-full bg-[#ff5722] text-white text-[11px] font-black py-3 rounded-xl text-center hover:brightness-110 transition-all uppercase tracking-tighter">
          Ver Oferta
        </a>
      </div>
    </div>
  );
};

export default ProductCard;