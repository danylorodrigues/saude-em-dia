// CONFIGURAÇÃO DA API
const API_URL = "http://localhost:3000/registros";
let dados = [];


// 1. CARREGAR DADOS DA API (GET)

async function carregarDados() {
  try {
    const resposta = await fetch(API_URL);
    dados = await resposta.json();
    renderizar();
  } catch (erro) {
    console.error("Erro ao carregar dados", erro);
  }
}


// 2. CRIAR ELEMENTOS NA PÁGINA

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


// 3. RENDERIZAÇÃO

function renderizar(lista = dados) {
  const area = document.querySelector("#conteudo");
  area.innerHTML = "";

  const inputBusca = document.querySelector("#busca");
  const selectCategoria = document.querySelector("#filtroCategoria");

  function aplicarFiltros() {
    const textoBusca = inputBusca.value.toLowerCase();
    const categoriaSelecionada = selectCategoria.value;

    const filtrados = dados.filter((item) => {
    const bateTexto =
      item.titulo.toLowerCase().includes(textoBusca) ||
      item.descricao.toLowerCase().includes(textoBusca);

    const bateCategoria =
      categoriaSelecionada === "Todas" ||
      item.categoria === categoriaSelecionada;

      return bateTexto && bateCategoria;
    });

    renderizar(filtrados);
  }

inputBusca.addEventListener("input", aplicarFiltros);
selectCategoria.addEventListener("change", aplicarFiltros);

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

  document.querySelectorAll(".curtir").forEach((btn) =>
    btn.addEventListener("click", () => curtirRegistro(btn.dataset.id))
  );
}


// 4. CURTIR

async function curtirRegistro(id) {
  const registro = dados.find((item) => item.id == id);
  registro.curtidas++;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registro),
  });

  carregarDados();
}


// 5. CADASTRO

document.querySelector("#cadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.querySelector("#titulo").value.trim();
  const data = document.querySelector("#data").value;
  const categoria = document.querySelector("#categoria").value;
  const descricao = document.querySelector("#descricao").value.trim();
  const msg = document.querySelector("#mensagem");

  if (titulo.length < 3) {
    msg.textContent = "O título precisa ter no mínimo 3 caracteres.";
    msg.style.color = "red";
    return;
  }

  const novo = {
    titulo,
    categoria,
    data,
    descricao,
    curtidas: 0,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novo),
  });

  msg.textContent = "Registro adicionado com sucesso!";
  msg.style.color = "green";
  e.target.reset();

  carregarDados();
});


// 6. ORDENAÇÕES

document.querySelector("#ordenarNome").addEventListener("click", () => {
  dados.sort((a, b) => a.titulo.localeCompare(b.titulo));
  renderizar();
});

document.querySelector("#ordenarData").addEventListener("click", () => {
  dados.sort((a, b) => new Date(a.data) - new Date(b.data));
  renderizar();
});

document.querySelector("#ordenarCurtidas").addEventListener("click", () => {
  dados.sort((a, b) => b.curtidas - a.curtidas);
  renderizar();
});

// INICIALIZAÇÃO
carregarDados();
