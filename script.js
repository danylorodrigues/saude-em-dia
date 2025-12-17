// 1. CARREGAR DADOS DO LOCALSTORAGE
let dados = JSON.parse(localStorage.getItem("registros")) || [
  {
    id: 1,
    titulo: "Caminhada Matinal",
    categoria: "Exercício",
    data: "2025-01-05",
    descricao: "30 minutos de caminhada leve.",
    curtidas: 0,
  },
  {
    id: 2,
    titulo: "Café da Manhã Saudável",
    categoria: "Alimentação",
    data: "2025-01-06",
    descricao: "Mamão com aveia.",
    curtidas: 2,
  },
];

// salva no localStorage
function salvarLocal() {
  localStorage.setItem("registros", JSON.stringify(dados));
}

// 2. CRIAR ELEMENTOS BASE NA PAGINA
const content = document.querySelector(".content");
content.innerHTML = `
  <div id="filtros">
    <input id="busca" type="text" placeholder="Buscar por título..." />
    <select id="filtroCategoria">
      <option value="Todas">Todas</option>
      <option value="Alimentação">Alimentação</option>
      <option value="Exercício">Exercício</option>
      <option value="Descanso">Descanso</option>
    </select>

    <button id="ordenarNome">Ordenar por Nome</button>
    <button id="ordenarData">Ordenar por Data</button>
    <button id="ordenarCurtidas">Mais Curtidas</button>
  </div>

  <div id="conteudo"></div>

  <h3>Novo Registro</h3>
  <form id="cadastro">
    <input type="text" id="titulo" placeholder="Título" required />
    <input type="date" id="data" required />
    <select id="categoria" required>
      <option value="">Selecione a categoria</option>
      <option value="Alimentação">Alimentação</option>
      <option value="Exercício">Exercício</option>
      <option value="Descanso">Descanso</option>
    </select>
    <textarea id="descricao" placeholder="Descrição"></textarea>
    <button type="submit">Adicionar</button>
  </form>

  <p id="mensagem" style="margin-top:10px; font-weight:bold;"></p>
`;

// 3. FUNÇÃO DE RENDERIZAÇÃO DINÂMICA
function renderizar(lista = dados) {
  const area = document.querySelector("#conteudo");
  area.innerHTML = "";

  if (lista.length === 0) {
    area.innerHTML = "<p>Nenhum registro encontrado.</p>";
    return;
  }

  lista.forEach((item) => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ddd";
    card.style.padding = "1rem";
    card.style.borderRadius = "8px";
    card.style.marginBottom = "1rem";
    card.style.background = "#fff";

    card.innerHTML = `
      <h3>${item.titulo}</h3>
      <p><strong>Categoria:</strong> ${item.categoria}</p>
      <p><strong>Data:</strong> ${item.data}</p>
      <p>${item.descricao}</p>

      <button class="curtir" data-id="${item.id}">
         Curtir (${item.curtidas})
      </button>
    `;

    area.appendChild(card);
  });

  // eventos de curtida
  document.querySelectorAll(".curtir").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const registro = dados.find((el) => el.id === id);
      registro.curtidas++;
      salvarLocal();
      renderizar();
    })
  );
}

renderizar();

// 4. BUSCA E FILTRO POR CATEGORIA
document.querySelector("#busca").addEventListener("input", filtrar);
document.querySelector("#filtroCategoria").addEventListener("change", filtrar);

function filtrar() {
  const texto = document.querySelector("#busca").value.toLowerCase();
  const categoria = document.querySelector("#filtroCategoria").value;

  const filtrados = dados.filter((item) => {
    const matchTitulo = item.titulo.toLowerCase().includes(texto);
    const matchCategoria =
      categoria === "Todas" ? true : item.categoria === categoria;
    return matchTitulo && matchCategoria;
  });

  renderizar(filtrados);
}