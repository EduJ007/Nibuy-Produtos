document.addEventListener("DOMContentLoaded", () => {
  const produtos = Array.from(document.querySelectorAll(".produto"));
  const paginationContainer = document.querySelector(".pagination");
  const produtosPorPagina = 28;
  let paginaAtual = 1;

  // pega a categoria real (classe depois de "produto")
  const getCategoria = (produto) => {
    return Array.from(produto.classList).find(c => c !== "produto") || "";
  };

  // parse de preço
  const parsePreco = (text) => {
    if (!text) return Infinity;
    const match = text.replace(/\s/g,'').match(/(\d[\d.,]*)/);
    if (!match) return Infinity;
    return parseFloat(match[1].replace(/\./g,'').replace(',', '.'));
  };

  // filtros
  function aplicarFiltros() {
    const categoriaFiltro = document.getElementById("categoriaFiltro");
    const generoFiltro = document.getElementById("generoFiltro");
    const searchInput = document.getElementById("searchProduto");
    const valorFiltro = document.getElementById("valor");

    const categoria = (categoriaFiltro?.value || "todos").toLowerCase();
    const genero = (generoFiltro?.value || "todos").toLowerCase();
    const pesquisa = (searchInput?.value || "").toLowerCase();
    const valorMax = (valorFiltro && valorFiltro.value.trim() !== "")
      ? parseFloat(valorFiltro.value.replace(",", "."))
      : Infinity;

    return produtos.filter(prod => {
      const cat = getCategoria(prod).toLowerCase();
      const titulo = (prod.querySelector("h3")?.textContent || "").toLowerCase();
      const precoTxt = prod.querySelector("p")?.textContent || "";
      const preco = parsePreco(precoTxt);

      const catOk = categoria === "todos" || cat === categoria;
      const generoOk = genero === "todos" || prod.classList.contains(genero);
      const pesquisaOk = titulo.includes(pesquisa);
      const precoOk = preco <= valorMax;

      return catOk && generoOk && pesquisaOk && precoOk;
    });
  }

  function renderizarProdutos() {
    const filtrados = aplicarFiltros();
    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / produtosPorPagina));
    if (paginaAtual > totalPaginas) paginaAtual = 1;

    // esconde todos
    produtos.forEach(p => p.style.display = "none");

    // mostra só os da página atual
    const inicio = (paginaAtual - 1) * produtosPorPagina;
    filtrados.slice(inicio, inicio + produtosPorPagina).forEach(p => p.style.display = "block");

    // paginacao
    if (paginationContainer) {
      paginationContainer.innerHTML = "";
      if (totalPaginas > 1) {
        if (paginaAtual > 1) {
          const prev = document.createElement("a");
          prev.href = "#";
          prev.textContent = "◄";
          prev.addEventListener("click", e => { e.preventDefault(); paginaAtual--; renderizarProdutos(); });
          paginationContainer.appendChild(prev);
        }

        for (let i = 1; i <= totalPaginas; i++) {
          const link = document.createElement("a");
          link.href = "#";
          link.textContent = i;
          if (i === paginaAtual) link.classList.add("ativo");
          link.addEventListener("click", e => { e.preventDefault(); paginaAtual = i; renderizarProdutos(); });
          paginationContainer.appendChild(link);
        }

        if (paginaAtual < totalPaginas) {
          const next = document.createElement("a");
          next.href = "#";
          next.textContent = "►";
          next.addEventListener("click", e => { e.preventDefault(); paginaAtual++; renderizarProdutos(); });
          paginationContainer.appendChild(next);
        }
      }
    }
  }

  // eventos
  document.getElementById("categoriaFiltro")?.addEventListener("change", () => { paginaAtual = 1; renderizarProdutos(); });
  document.getElementById("generoFiltro")?.addEventListener("change", () => { paginaAtual = 1; renderizarProdutos(); });
  document.getElementById("searchProduto")?.addEventListener("input", () => { paginaAtual = 1; renderizarProdutos(); });
  document.getElementById("valor")?.addEventListener("input", () => { paginaAtual = 1; renderizarProdutos(); });

  // render inicial
  renderizarProdutos();
});
function gerarEstrelaSVG(tipo) {
  const cores = {
    cheia: '#FFD700', // dourado
    meia: '#FFD700',
    vazia: 'white'     // cinza claro
  };

  const sombra = 'stroke:black; stroke-width:1px;';

  if (tipo === 'cheia') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" style="${sombra}" fill="${cores.cheia}" viewBox="0 0 16 16"><path d="M3.612 15.443 4.8 10.71l-4.192-3.356 5.271-.455L8 2.223l2.121 4.676 5.27.455-4.19 3.356 1.188 4.733L8 12.347l-4.388 3.096z"/></svg>`;
  } 
  if (tipo === 'meia') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" style="${sombra}" viewBox="0 0 16 16">
      <defs>
        <linearGradient id="meia">
          <stop offset="50%" stop-color="${cores.meia}"/>
          <stop offset="50%" stop-color="${cores.vazia}"/>
        </linearGradient>
      </defs>
      <path fill="url(#meia)" d="M3.612 15.443 4.8 10.71l-4.192-3.356 5.271-.455L8 2.223l2.121 4.676 5.27.455-4.19 3.356 1.188 4.733L8 12.347l-4.388 3.096z"/>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" style="${sombra}" fill="${cores.vazia}" viewBox="0 0 16 16"><path d="M3.612 15.443 4.8 10.71l-4.192-3.356 5.271-.455L8 2.223l2.121 4.676 5.27.455-4.19 3.356 1.188 4.733L8 12.347l-4.388 3.096z"/></svg>`;
}

// Substitui notas por estrelas SVG
document.querySelectorAll('.produto h4').forEach(h4 => {
  const match = h4.textContent.match(/[\d]+(?:[.,]\d+)?/);
  if (!match) return;
  const nota = parseFloat(match[0].replace(',', '.'));
  const estrelas = [];
  
  for (let i = 1; i <= 5; i++) {
    if (nota >= i) {
      estrelas.push(gerarEstrelaSVG('cheia'));
    } else if (nota >= i - 0.5) {
      estrelas.push(gerarEstrelaSVG('meia'));
    } else {
      estrelas.push(gerarEstrelaSVG('vazia'));
    }
  }

  h4.innerHTML = `${estrelas.join('')} <span style="margin-left:4px;">${nota.toFixed(1)}</span>`;
});