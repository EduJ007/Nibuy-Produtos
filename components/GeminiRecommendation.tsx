
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Product } from '../types';
import { Sparkles } from 'lucide-react';

interface GeminiRecommendationProps {
  products: Product[];
}

const GeminiRecommendation: React.FC<GeminiRecommendationProps> = ({ products }) => {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!process.env.API_KEY || products.length === 0) return;
      
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const productList = products.slice(0, 5).map(p => `${p.name} por ${p.price}`).join(', ');
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `De forma extremamente curta e persuasiva (máximo 150 caracteres), sugira qual é a melhor oferta atual desta lista de produtos para um comprador impulsivo: ${productList}. Use um emoji no início.`,
        });

        if (response.text) {
          setRecommendation(response.text.trim());
        }
      } catch (error) {
        console.error("Gemini failed to generate recommendation", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [products]);

  if (!recommendation && !loading) return null;

  return (
    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-8 flex items-center gap-4 animate-pulse-slow">
      <div className="bg-white p-2 rounded-lg shadow-sm">
        <svg className="w-6 h-6 text-[#ff5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div>
        <p className="text-[#ff5722] text-[10px] font-black uppercase tracking-widest mb-0.5">Dica da IA Nibuy</p>
        <p className="text-slate-800 text-sm font-medium leading-tight">
          {loading ? "Pensando na melhor oferta..." : recommendation}
        </p>
      </div>
    </div>
  );
};

export default GeminiRecommendation;
