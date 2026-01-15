
export type StoreType = 'Amazon' | 'Shopee' | 'Mercado Livre';

export interface Product {
  id: string;
  title: string;
  category: string;
  oldPrice: number;
  newPrice: number;
  discount: number;
  imageUrl: string;
  affiliateUrl: string;
  store: StoreType;
  description: string;
}

export type Category = 'Todos' | 'Eletrônicos' | 'Casa' | 'Beleza' | 'Esportes' | 'Promoção do Dia';

export type PriceRange = 'all' | 'under500' | '500to2000' | 'over2000';
