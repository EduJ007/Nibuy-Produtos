import React from 'react';
import { Instagram, Facebook, Music2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div className="col-span-1 md:col-span-2">
          <a href="https://nibuy-home-page.vercel.app/" className="text-3xl font-black text-[#ff5722]">
            𝙉𝙞𝙗𝙪𝙮
          </a>
          <p className="mt-4 text-gray-400 max-w-sm leading-relaxed">
            Sua vitrine inteligente de ofertas. Encontramos os melhores preços e você finaliza a compra com total segurança nas maiores lojas do Brasil.
          </p>
          
           <div className="flex gap-4 mt-6">
            {/* INSTAGRAM */}
            <a href="https://instagram.com/nibuyoficial" target="_blank" rel="noopener noreferrer" 
              className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ff5722] transition-all duration-300 group">
              <Instagram size={18} className="group-hover:scale-110 transition-transform" />
            </a>
            
            {/* FACEBOOK */}
            <a href="https://www.facebook.com/profile.php?id=61583962855568" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#4267B2] transition-all duration-300 group">
              <Facebook size={18} className="group-hover:scale-110 transition-transform" />
            </a>

            {/* PINTEREST (NO LUGAR DA MÚSICA) */}
            <a href="https://pin.it/hFv1x89A5" target="_blank" rel="noopener noreferrer" 
              className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-300 group">
              <i className="fa-brands fa-pinterest text-[18px] group-hover:scale-110 transition-transform"></i>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Navegação</h4>
          <ul className="space-y-4 text-gray-400 text-sm font-medium">
            <li><a href="https://nibuy-home-page.vercel.app/" className="hover:text-[#ff5722] transition-colors">Início</a></li>
            <li><a href="https://sobre-nibuy.vercel.app/" className="hover:text-[#ff5722] transition-colors">Sobre Nós</a></li>
            <li><a href="https://nibuy-central-ajuda.vercel.app/" className="hover:text-[#ff5722] transition-colors">Central de Ajuda</a></li>
            <li><a href="https://nibuy-contact.vercel.app/" className="hover:text-[#ff5722] transition-colors">Contato</a></li>
            <li>
               <a href="https://nibuy-produtos.vercel.app/#produtos"  className="text-[#ff5722] hover:text-white transition-colors"
>Produto</a>      
                  </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Suporte</h4>
          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium">Segunda a Sexta<br/><span className="text-white">09h às 18h</span></p>
            <p className="text-sm text-[#ff5722] font-bold underline">nibuyoficial@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[11px] font-medium uppercase tracking-wider">
          <p>© 2026 NIBUY OFERTAS. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;